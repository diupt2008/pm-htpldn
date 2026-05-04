# Bug Report — Workflow Chi trả chi phí (R6.6.1)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp (HTPLDN) |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA Automation (Claude Code via MCP Chrome DevTools) |
| **Ngày** | 2026-05-04 |
| **Loại test** | Workflow E2E |
| **Round** | R16 |
| **Tài liệu tham chiếu** | [02-thu-tu-module.md §⑪ FR-06 SM-CHITRA](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L697-L713) · [workflow-test-report-ChiTra.md](../workflow/workflow-test-report-ChiTra.md) |

---

## Tổng hợp

Phát hiện **7** lỗi Critical (6 FE + 1 BE) + **1 spec inconsistency** trong quá trình test 8 transition CMS workflow Chi trả (R6.6.1). 5 transition còn lại (1, 2, 6, 7, 13) out-of-scope CMS theo SRS dòng 691-694 (module DUY NHẤT không cho CB NV nhập tay, nguồn DVC/LGSP API inbound + cron auto + DN rút qua DVC).

> **3-source verify (2026-05-04):**
> - **NotebookLM HTPLDN** (id `e3a2681b-fdd6-4a24-917c-9ed636e8a110`) — query SM-CHITRA + API field naming + UI SCR-V.II-02. Source: `615dcbf0` (SRS v2.1 FR-V.II-*) + `98e8d0a4` (Architecture Doc).
> - **SRS local** [02-thu-tu-module.md §⑪ dòng 697-713](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L697-L713) — 13 transition + Mẫu 01 NĐ55 18 trường + `BR-CALC-01`/`BR-CALC-02`/`BR-FLOW-04`/`BR-EC-16`.
> - **Tài liệu BA gốc** [`input/Input/Danh sách transaction_v1.1.csv`](../../../../input/Input/Danh sách transaction_v1.1_2026-03-27.csv) — UC68-UC80 phần V.II Quản lý chi trả chi phí. Verify lần 2 phát hiện UC72/UC76/UC79 chốt 2 OBS thành BUG (CT-003/CT-005-BE) và 1 OBS giữ nguyên (CT-B FR vs SCR/CSV mismatch về enum CAN_BO_SUNG).

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 7    | 7        | 0     | 0      | 0     | 0       |

> **Re-test R17 — 2026-05-04 23:45:** Dev claim "đã fix các bug Chi trả". Retest tất cả 7 bug → **0/7 closed**, tất cả vẫn FAIL với cùng request body + cùng response error code + cùng UI state. KHÔNG có evidence dev đã deploy fix. Yêu cầu dev verify commit hash + deploy log trước khi escalate retest tiếp.

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS + UC Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-FUNC-CT-001 | Critical | P0 | UI/Workflow | R6.6.1 Bước 3 | `FR-06 SM-CHITRA dòng 703` + `SCR-V.II-02 row 4 stepper [Tiếp nhận]` + `UC70 (CSV BA)` "CB NV xem chi tiết HSCT để kiểm tra" | Detail page state CHO_TIEP_NHAN không render nút action [Tiếp nhận], chặn toàn bộ Bước 3 | Open |
| BUG-FUNC-CT-002 | Critical | P0 | Workflow/Data | R6.6.1 Bước 4-5 | `FR-V.II-03 Inputs: checklist_items` (NotebookLM verified) | POST /kiem-tra 422 — FE field `danhSachTaiLieu` ≠ BE `checklistItems` (SRS quy định `checklist_items`) | Open |
| BUG-FUNC-CT-003 | Critical | P0 | UI/Workflow | R6.6.1 Bước 8 | `FR-V.II-05 Inputs: phi_tu_van_thuc_te` (CB NV nhập) + `UC72 (CSV BA)` "CB NV NHẬP đánh giá theo tiêu chí" — 2/3 nguồn confirm CB NV phải nhập | UI form Đánh giá thiếu input `phi_tu_van_thuc_te` (chỉ textarea Ghi chú); POST /danh-gia 422 vì FE chỉ gửi `{version:1}` | Open |
| BUG-FUNC-CT-004 | Critical | P0 | Workflow/Data | R6.6.1 Bước 9 | `FR-V.II-09 Inputs: ket_qua_tham_dinh` (NotebookLM verified) | POST /tham-dinh 422 — FE field `ketQua` ≠ BE `ketQuaThamDinh` (SRS quy định `ket_qua_tham_dinh`) | Open |
| BUG-FUNC-CT-005-BE | Critical | P0 | Backend | R6.6.1 Bước 10 | `SCR-V.II-02 rows 26-28` Auto-calc readonly + modal confirm only + `UC79 (CSV BA)` "CB PD phê duyệt" KHÔNG nói nhập số tiền — 2/3 nguồn confirm BE phải auto-derive từ Bước 8 evaluation | BE require field `soTienDuyet` từ FE → 422. Đúng spec UI/CSV: BE phải auto-derive `so_tien_duyet` từ kết quả `BR-CALC-02` Bước 8, không bắt cb_pd nhập | Open |
| BUG-FUNC-CT-006 | Critical | P0 | Workflow/Data | R6.6.1 Bước 11 | `FR-V.II-12 Inputs: ly_do_tu_choi` + `Common Approval Fields` + `UC79 (CSV BA)` "popup nhập **lý do từ chối**" + `BR-FLOW-04` ≥10 ký tự | POST /tu-choi 422 — FE field `lyDo` ≠ BE `lyDoTuChoi` (SRS quy định `ly_do_tu_choi`) | Open |
| BUG-FUNC-CT-007 | Critical | P0 | UI/Workflow | R6.6.1 Bước 12 | `FR-V.II-13 Inputs row 4: so_tien_thuc_tra ≤ số tiền được duyệt` + `SCR-V.II-02 row 30` + `UC80 (CSV BA)` cb_nv "cập nhật kết quả xử lý" | UI spinbutton "Số tiền thực trả" có valuemax=0, valuemin=0 → chặn nhập số dương → click "Cập nhật thanh toán" không trigger POST | Open |

## Spec Inconsistency Observation (cần BA clarify, KHÔNG log dev cho đến khi chốt)

| ID | Bước | Mâu thuẫn nội bộ SRS | Verdict |
|---|---|---|---|
| OBS-CT-B | Bước 9 Thẩm định | `FR-V.II-09 Inputs` quy định `ket_qua_tham_dinh` enum **3 giá trị** `DAT/KHONG_DAT/CAN_BO_SUNG` (NotebookLM source `615dcbf0`) **vs** `SCR-V.II-02 row 22` + `UC76 (CSV BA)` chỉ **2 giá trị** `Đạt/Không đạt`. UC76 còn có thao tác RIÊNG "CB NV gửi yêu cầu bổ sung" TÁCH KHỎI "nhập kết quả thẩm định" → "bổ sung" là action endpoint riêng, KHÔNG phải value enum | **2/3 nguồn (SCR + CSV) đồng thuận 2 enum**. FR-V.II-09 lệch chuẩn → cần BA confirm xóa enum `CAN_BO_SUNG` khỏi BE schema. UI 2 radio Đạt/Không đạt là ĐÚNG, KHÔNG phải bug FE thiếu radio. |

> **Chú thích Type:**
> - `Workflow` — chuyển trạng thái (state machine transition)
> - `UI/UX` — giao diện, hiển thị, tương tác
> - `Data` — toàn vẹn dữ liệu, validation contract

---

## BUG-FUNC-CT-001 — Detail page state CHO_TIEP_NHAN không render nút action [Tiếp nhận]

### Mô tả

Cb nv mở chi tiết hồ sơ HSCT000049 ở trạng thái "Chờ tiếp nhận" (URL `/chi-tra/{id}?action=kiem-tra`). Trang chỉ render "Quay lại danh sách" — không có button [Tiếp nhận] hoặc form Kiểm tra. Toàn bộ Bước 3 (CHO_TIEP_NHAN → DANG_KIEM_TRA) không thực hiện được qua UI.

### Các bước tái hiện

1. Login `cb_nv_tw_01` / `Secret@123` / OTP `666666`.
2. Navigate sidebar "Quản lý chi trả chi phí" → tab "Chờ xử lý".
3. Click button "Kiểm tra" trên row HSCT000049 (state Chờ tiếp nhận).
4. App navigate sang `http://103.172.236.130:3000/chi-tra/e3000000-0000-4000-8000-000000000049?action=kiem-tra`.
5. Quan sát: detail page render thông tin DN/TVV/VV + stepper 6 phase + section "Lịch sử xử lý" — KHÔNG có button [Tiếp nhận]/form Kiểm tra.

### Kết quả mong đợi

- Theo SRS [02-thu-tu-module.md §⑪ dòng 703](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L703): Bước 3 actor `cb_nv_<cap>_01` thao tác trigger `[Tiếp nhận]` để chuyển CHO_TIEP_NHAN → DANG_KIEM_TRA.
- UI phải render nút [Tiếp nhận] hoặc form chấp nhận để cb_nv click khi state CHO_TIEP_NHAN.

### Kết quả thực tế

- Detail page state CHO_TIEP_NHAN render rỗng không có UI action.
- DOM chỉ có button "Quay lại danh sách" (verified `evaluate_script` query `button` nodes).
- KHÔNG có drawer/modal nào auto mở dù URL chứa param `?action=kiem-tra`.
- API endpoint POST `/api/v1/ho-so-chi-tras/{id}/tiep-nhan` → 404 (BE không có endpoint này).
- Endpoint POST `/api/v1/ho-so-chi-tras/{id}/kiem-tra` tồn tại (401 = auth required, không phải 404) → app có thể gộp 2 transition Bước 3+4 vào 1 endpoint, nhưng UI Bước 3 (state CHO_TIEP_NHAN) vẫn cần render form.

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FUNC-CT-001 — HSCT000049 detail page CHO_TIEP_NHAN không có action button](image/r6-r661-bug001-HSCT000049-no-action.png)

**2. API response:**

```json
POST /api/v1/ho-so-chi-tras/e3000000-0000-4000-8000-000000000049/tiep-nhan
Status: 404
{"success":false,"error":{"code":"ERR-SYS-00-04-01","message":"Cannot POST /api/v1/ho-so-chi-tras/{id}/tiep-nhan"}}
```

---

## BUG-FUNC-CT-002 — POST /kiem-tra 422, FE field `danhSachTaiLieu` ≠ BE `checklistItems`

### Mô tả

Cb nv chọn 5 checkbox tài liệu + radio "Đạt" + click "Xác nhận kiểm tra" trên HSCT000050 (state Đang kiểm tra). API POST `/kiem-tra` trả 422 vì FE gửi field `danhSachTaiLieu` nhưng BE validation expect `checklistItems`. Workflow Bước 4 (Đạt → DANG_DANH_GIA) và Bước 5 (Yêu cầu bổ sung → YEU_CAU_BO_SUNG) cùng endpoint nên cùng fail.

### Các bước tái hiện

1. Login `cb_nv_tw_01`.
2. Navigate "Quản lý chi trả chi phí" → tab "Chờ xử lý" → row HSCT000050 (state Đang kiểm tra) → click "Kiểm tra".
3. Trang detail render form Kiểm tra: 5 checkbox tài liệu + 3 radio (Đạt / Yêu cầu bổ sung / Không đạt).
4. Tick 5 checkbox: Mẫu 01 NĐ55, Giấy CNĐKKD, Tờ khai thuế, Hợp đồng TVPL, Văn bản TVPL.
5. Chọn radio "Đạt".
6. Click button "Xác nhận kiểm tra".
7. Quan sát: state vẫn "Đang kiểm tra", checkbox vẫn checked, không có toast success/error.

### Kết quả mong đợi

- Theo SRS [02-thu-tu-module.md §⑪ dòng 704](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L704): Bước 4 cb_nv tick checklist Đạt → state DANG_KIEM_TRA chuyển sang DANG_DANH_GIA, hệ thống tính trước mức hỗ trợ.
- POST `/kiem-tra` phải trả 200/201, state record cập nhật DANG_DANH_GIA.

### Kết quả thực tế

- Network: POST `/api/v1/ho-so-chi-tras/{id}/kiem-tra` trả 422 ERR-VAL-SYS-00-01.
- BE message: `"checklistItems must be an array"`.
- FE request body gửi: `{"ketQua":"DAT","danhSachTaiLieu":[{"tenTaiLieu":"Mẫu 01 NĐ55","daTaiLen":true},...],"version":1}`.
- BE expect field `checklistItems` thay vì `danhSachTaiLieu`. Naming convention mismatch nghiêm trọng — không có record nào chuyển state được qua endpoint này.

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FUNC-CT-002 — HSCT000050 form Kiểm tra render đủ nhưng POST 422](image/r6-r661-bug002-HSCT000050-form-kiem-tra.png)

**2. API request/response:**

```json
POST /api/v1/ho-so-chi-tras/e3000000-0000-4000-8000-000000000050/kiem-tra
Request: {"ketQua":"DAT","danhSachTaiLieu":[{"tenTaiLieu":"Mẫu 01 NĐ55","daTaiLen":true},{"tenTaiLieu":"Giấy CNĐKKD","daTaiLen":true},{"tenTaiLieu":"Tờ khai thuế","daTaiLen":true},{"tenTaiLieu":"Hợp đồng TVPL","daTaiLen":true},{"tenTaiLieu":"Văn bản TVPL","daTaiLen":true}],"version":1}
Status: 422
Response: {"success":false,"error":{"code":"ERR-VAL-SYS-00-01","field":"checklistItems","message":"checklistItems must be an array","details":[{"field":"checklistItems","message":"checklistItems must be an array"}]}}
```

---

## BUG-FUNC-CT-003 — UI form Đánh giá thiếu input `phi_tu_van_thuc_te` + POST /danh-gia 422

### Mô tả

Cb nv mở form Đánh giá HSCT000045 (state Đang đánh giá), click "Xác nhận đánh giá". POST `/danh-gia` chỉ gửi `{version:1}` không kèm `phiTuVanThucTe` → BE 422. UI form Đánh giá KHÔNG có input field nhập `phi_tu_van_thuc_te` — chỉ có 4 readonly hiển thị (Mức HT %/Trần năm/Đã chi/Số tiền duyệt) + textarea Ghi chú. **2/3 nguồn confirm CB NV phải nhập**: FR-V.II-05 Inputs có `phi_tu_van_thuc_te` (CB NV nhập) + UC72 (CSV BA gốc) nói rõ "CB NV NHẬP đánh giá theo tiêu chí". Chỉ SCR-V.II-02 Section 4 đang lệch (auto-calc only) → SCR cần update + FE thêm input.

### Các bước tái hiện

1. Login `cb_nv_tw_01`.
2. Navigate "Quản lý chi trả chi phí" → tab "Đang đánh giá" → row HSCT000045 (DN Siêu nhỏ, phí TV 3.250.000 ₫) → click "Đánh giá".
3. Trang detail render section "Đánh giá mức hỗ trợ" — 4 field hiển thị (Mức hỗ trợ %, Trần năm, Đã chi, Số tiền duyệt — đều "—"/auto) + textarea Ghi chú + button "Xác nhận đánh giá".
4. Click button "Xác nhận đánh giá" (không nhập gì vì form không có input số).
5. Quan sát: state vẫn Đang đánh giá, không có toast.

### Kết quả mong đợi

- Theo `FR-V.II-05 Inputs` (NotebookLM verified) + `UC72` (CSV BA gốc dòng 606-614): CB NV phải nhập `phi_tu_van_thuc_te` (số tiền chứng từ thực tế từ HĐTV) → BE áp `BR-CALC-01/02` tự tính `so_tien_duoc_duyet = MIN(so_tien_de_nghi, phi_tu_van_thuc_te × muc_ho_tro%, tran_ho_tro_nam − da_chi_trong_nam)` → state DANG_DANH_GIA chuyển DANG_THAM_DINH.
- UI phải có 1 input số "Phí tư vấn thực tế (₫)" cho CB NV nhập, sau đó 4 field readonly tự update giá trị tính.

### Kết quả thực tế

- POST `/api/v1/ho-so-chi-tras/{id}/danh-gia` request body chỉ `{version:1}`.
- BE 422 ERR-VAL-SYS-00-01: `"phiTuVanThucTe must be a positive number"`.
- UI form Đánh giá KHÔNG có input nhập số → cb_nv không thể trigger Bước 8 đúng spec.

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FUNC-CT-003 — HSCT000045 form Đánh giá thiếu input phiTuVanThucTe](image/r6-r661-bug003-HSCT000045-form-danh-gia.png)

**2. API request/response:**

```json
POST /api/v1/ho-so-chi-tras/e3000000-0000-4000-8000-000000000045/danh-gia
Request: {"version":1}
Status: 422
Response: {"success":false,"error":{"code":"ERR-VAL-SYS-00-01","field":"phiTuVanThucTe","message":"phiTuVanThucTe must be a positive number"}}
```

---

## BUG-FUNC-CT-004 — POST /tham-dinh 422 FE field `ketQua` ≠ BE `ketQuaThamDinh`

### Mô tả

Cb nv mở form Thẩm định HSCT000046 (state Đang thẩm định), tick 4 checkbox tiêu chí + radio "Đạt" + click "Trình phê duyệt". POST `/tham-dinh` 422 vì FE gửi field `ketQua` nhưng BE expect `ketQuaThamDinh` (SRS FR-V.II-09 chốt tên `ket_qua_tham_dinh`). Riêng việc thiếu radio enum CAN_BO_SUNG trên UI là **OBS-CT-B spec inconsistency** (FR-V.II-09 lệch SCR + UC76) — KHÔNG log thành bug FE.

### Các bước tái hiện

1. Login `cb_nv_tw_01`.
2. Navigate "Quản lý chi trả chi phí" → tab "Đang đánh giá" → row HSCT000046 (state Đang thẩm định) → click "Trình PD".
3. Trang detail render section "Thẩm định hồ sơ": 4 checkbox tiêu chí (Số liệu khớp Mẫu 01, Phí tư vấn hợp lý, Quy mô DN đúng, Chưa vượt trần năm) + 2 radio (Đạt / Không đạt) + button "Trình phê duyệt" disabled.
4. Tick 4 checkbox + chọn "Đạt" → button "Trình phê duyệt" enable.
5. Click "Trình phê duyệt".
6. Quan sát: state vẫn Đang thẩm định.

### Kết quả mong đợi

- Theo SRS [02-thu-tu-module.md §⑪ dòng 709](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L709) + NotebookLM verified `FR-V.II-09 Inputs: ket_qua_tham_dinh`: Bước 9 cb_nv `[Trình duyệt]` với guard "KQ thẩm định đạt" → state DANG_THAM_DINH chuyển CHO_PHE_DUYET.
- POST `/tham-dinh` phải nhận field tên `ketQuaThamDinh` (camelCase từ logical `ket_qua_tham_dinh`), trả 200/201, state cập nhật.

### Kết quả thực tế

- POST `/tham-dinh` 422 ERR-VAL-SYS-00-01: `"ketQuaThamDinh must be one of the following values: DAT, KHONG_DAT, CAN_BO_SUNG"`.
- FE gửi `{danhSachKiemTra:[...],ketQua:"DAT",version:1}` — field name `ketQua` sai (SRS chốt `ket_qua_tham_dinh`).

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FUNC-CT-004 — HSCT000046 form Thẩm định + 422 ketQua vs ketQuaThamDinh](image/r6-r661-bug004-HSCT000046-form-tham-dinh.png)

**2. API request/response:**

```json
POST /api/v1/ho-so-chi-tras/e3000000-0000-4000-8000-000000000046/tham-dinh
Request: {"danhSachKiemTra":[{"tieuChi":"Số liệu khớp Mẫu 01","ketQua":true},{"tieuChi":"Phí tư vấn hợp lý","ketQua":true},{"tieuChi":"Quy mô DN đúng","ketQua":true},{"tieuChi":"Chưa vượt trần năm","ketQua":true}],"ketQua":"DAT","version":1}
Status: 422
Response: {"success":false,"error":{"code":"ERR-VAL-SYS-00-01","field":"ketQuaThamDinh","message":"ketQuaThamDinh must be one of the following values: DAT, KHONG_DAT, CAN_BO_SUNG"}}
```

---

## BUG-FUNC-CT-005-BE — BE require `soTienDuyet` từ FE thay vì auto-derive từ Bước 8 (BE bug)

### Mô tả

Cb pd click "Phê duyệt" trên HSCT000047 (state Chờ phê duyệt) → modal confirm → "Xác nhận phê duyệt". POST `/phe-duyet` chỉ gửi `{version:1}`, BE 422 require `soTienDuyet`. Nhưng theo `SCR-V.II-02 rows 26-28` + `UC79 (CSV BA)`: cb_pd CHỈ click button → modal confirm, **không có ô input số tiền**. BE phải tự lấy `so_tien_duyet` đã chốt ở Bước 8 (kết quả `BR-CALC-02`) gán thẳng khi cb_pd confirm. Đây là **BE bug** (not FE/UI).

### Các bước tái hiện

1. Login `cb_pd_tw_01` (isolated context).
2. Navigate "Quản lý chi trả chi phí" → tab "Chờ phê duyệt" → row HSCT000047 → mở chi tiết.
3. Detail page render section "Phê duyệt hồ sơ": thông tin DN + Phí TV + Số tiền đề nghị + Số tiền được duyệt "—" (Bước 8 chưa run vì BUG CT-003 block) + 2 button (Phê duyệt / Từ chối).
4. Click button "Phê duyệt" → modal C12 "Bạn có chắc chắn muốn phê duyệt hồ sơ này?" + 2 button (Hủy / Xác nhận phê duyệt) — **không có input số tiền** (đúng SCR-V.II-02 row 27).
5. Click "Xác nhận phê duyệt".
6. Quan sát: modal đóng, state vẫn Chờ phê duyệt.

### Kết quả mong đợi

- Theo `SCR-V.II-02 rows 26-28` (NotebookLM verified): "summary auto-calc readonly + nút [Phê duyệt] chỉ mở modal C12 confirm".
- Theo `UC79` (CSV BA dòng 651-657): "CB PD phê duyệt hồ sơ → Hệ thống cập nhật trạng thái đã duyệt" — KHÔNG có thao tác "nhập số tiền".
- BE phải tự lấy `so_tien_duyet` đã chốt ở Bước 8 evaluation (kết quả tính `BR-CALC-02`) → gán thẳng vào record khi cb_pd nhấn Confirm → trả 200, state DA_DUYET.

### Kết quả thực tế

- POST `/api/v1/ho-so-chi-tras/{id}/phe-duyet` request body `{version:1}`.
- BE 422 ERR-VAL-SYS-00-01: `"soTienDuyet must be a positive number"` — BE đang require field `soTienDuyet` từ FE.
- Đây là sai design: BE đáng lẽ tự lấy từ DB (kết quả Bước 8) không cần FE gửi.

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FUNC-CT-005-BE — HSCT000047 form Phê duyệt UI ĐÚNG SCR (no input), BE bug require soTienDuyet](image/r6-r661-bug005-HSCT000047-phe-duyet-no-input.png)

**2. API request/response:**

```json
POST /api/v1/ho-so-chi-tras/e3000000-0000-4000-8000-000000000047/phe-duyet
Request: {"version":1}
Status: 422
Response: {"success":false,"error":{"code":"ERR-VAL-SYS-00-01","field":"soTienDuyet","message":"soTienDuyet must be a positive number"}}
```

### So sánh (Comparison) — vai trò vs UI render

| Role | List action visible | Detail UI render | API call | Result |
|------|----------|----------|----------|--------|
| cb_nv_tw_01 (CHO_PHE_DUYET) | Không có button | Section Phê duyệt + Phí + Số tiền hiển thị, KHÔNG có button | — | Đúng phân quyền — cb_nv không có quyền duyệt |
| cb_pd_tw_01 (CHO_PHE_DUYET) | Không có nút action ở list | Form Phê duyệt + 2 button (Phê duyệt/Từ chối) + modal confirm | POST 422 | UI đúng SCR/UC79 (no input) — **BE bug** require thừa field |

---

## BUG-FUNC-CT-006 — POST /tu-choi 422 FE field `lyDo` ≠ BE `lyDoTuChoi`

### Mô tả

Cb pd mở form Phê duyệt HSCT000041 (state Chờ phê duyệt), click "Từ chối" → modal "Từ chối hồ sơ" với textarea "Nhập lý do từ chối...". Nhập 50 ký tự (≥10) + click "Xác nhận từ chối". POST `/tu-choi` 422 vì FE gửi field `lyDo` nhưng BE expect `lyDoTuChoi`.

### Các bước tái hiện

1. Login `cb_pd_tw_01` (isolated context).
2. Navigate "Quản lý chi trả chi phí" → tab "Chờ phê duyệt" → row HSCT000041 → click vào hồ sơ.
3. Click button "Từ chối" → modal "Từ chối hồ sơ" hiện với textarea + 2 button (Hủy / Xác nhận từ chối).
4. Nhập text 50 ký tự: `"Hồ sơ thiếu chứng từ phí tư vấn theo BR-FLOW-04"`.
5. Click "Xác nhận từ chối".
6. Quan sát: modal vẫn open, state vẫn Chờ phê duyệt.

### Kết quả mong đợi

- Theo SRS [02-thu-tu-module.md §⑪ dòng 711](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L711) + `BR-FLOW-04`: Bước 11 cb_pd `[Từ chối]` với `ly_do_tu_choi` ≥10 ký tự → state CHO_PHE_DUYET trả về DANG_THAM_DINH.
- POST `/tu-choi` phải trả 200/201, state cập nhật.

### Kết quả thực tế

- POST `/tu-choi` 422 ERR-VAL-SYS-00-01: `"lyDoTuChoi must be longer than or equal to 10 characters"`.
- FE gửi `{lyDo:"...",version:1}` — sai field name (BE expect `lyDoTuChoi`).

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FUNC-CT-006 — HSCT000041 modal Từ chối + 422](image/r6-r661-bug006-HSCT000041-tu-choi-422.png)

**2. API request/response:**

```json
POST /api/v1/ho-so-chi-tras/e3000000-0000-4000-8000-000000000041/tu-choi
Request: {"lyDo":"Hồ sơ thiếu chứng từ phí tư vấn theo BR-FLOW-04","version":1}
Status: 422
Response: {"success":false,"error":{"code":"ERR-VAL-SYS-00-01","field":"lyDoTuChoi","message":"lyDoTuChoi must be shorter than or equal to 2000 characters","details":[{"field":"lyDoTuChoi","message":"lyDoTuChoi must be shorter than or equal to 2000 characters"},{"field":"lyDoTuChoi","message":"lyDoTuChoi must be longer than or equal to 10 characters"},{"field":"lyDoTuChoi","message":"lyDoTuChoi must be a string"}]}}
```

---

## BUG-FUNC-CT-007 — Bước 12 spinbutton "Số tiền thực trả" valuemax=0 chặn submit

### Mô tả

Cb nv mở form Cập nhật thanh toán HSCT000098 (state Đã duyệt, so_tien_duyet=7.872.000 ₫). Spinbutton "Số tiền thực trả" có thuộc tính `valuemax="0"` `valuemin="0"` `value="0"` — không cho nhập giá trị > 0. Sau khi `fill_form` set value 7872000 + click "Cập nhật thanh toán", FE KHÔNG trigger POST nào (FE form validation block do giá trị vượt valuemax). State không đổi.

### Các bước tái hiện

1. Login `cb_nv_tw_01`.
2. Navigate "Quản lý chi trả chi phí" → tab "Tất cả" → row HSCT000098 (state Đã duyệt, so_tien_duyet hiển thị `7.872.000 ₫`) → click "Cập nhật TT".
3. Trang detail render section "Cập nhật thanh toán" với 4 field: Số tiền thực trả (spinbutton), Ngày thanh toán (default 2026-05-04), Số biên nhận (textbox), Ghi chú (textarea) + button "Cập nhật thanh toán".
4. Inspect attribute spinbutton: `<input type="number" max="0" min="0" value="0">`.
5. Fill spinbutton value="7872000" + Số biên nhận="BN-2026-098".
6. Click button "Cập nhật thanh toán".
7. Quan sát: KHÔNG có network request nào fire (verify `list_network_requests` — chỉ có GET ngày-le, không có POST cap-nhat-thanh-toan). State vẫn "Đã duyệt".

### Kết quả mong đợi

- Theo SRS [02-thu-tu-module.md §⑪ dòng 712](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L712): Bước 12 cb_nv nhập `so_tien_thuc_tra` (≤ `so_tien_duyet`), `ngay_thanh_toan`, `so_bien_nhan` → state DA_DUYET chuyển DA_THANH_TOAN.
- Spinbutton "Số tiền thực trả" phải có `valuemax = so_tien_duyet` (vd 7.872.000 với HSCT000098), `valuemin = 1`.
- Click "Cập nhật thanh toán" phải gửi POST `/cap-nhat-thanh-toan` với 3 field bắt buộc.

### Kết quả thực tế

- Spinbutton attribute `valuemax="0"` `valuemin="0"` chặn nhập giá trị dương → cb_nv không thể nhập được số tiền thực trả hợp lệ.
- Click button "Cập nhật thanh toán" KHÔNG trigger POST (FE form validate block trước khi gửi). Verified `list_network_requests` sau click chỉ có 5 request đã có sẵn từ load page (auth/refresh, unread-count, GET detail, ngày-le 2026, ngày-le 2027) — không có POST nào.

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FUNC-CT-007 — HSCT000098 spinbutton valuemax=0 chặn submit](image/r6-r661-bug007-HSCT000098-spinbutton-valuemax0.png)

**2. DOM attribute (verified `take_snapshot`):**

```text
spinbutton "* Số tiền thực trả" focusable focused value="0" valuemax="0" valuemin="0" valuetext=""
```

**3. Network sau click "Cập nhật thanh toán" (không có POST cap-nhat-thanh-toan):**

```text
reqid=1330 POST /api/v1/auth/refresh [200]
reqid=1332 GET /api/v1/thong-baos/unread-count [304]
reqid=1349 GET /api/v1/ho-so-chi-tras/e3000000-0000-4000-8000-000000000098 [200]
reqid=1350 GET /api/v1/ngay-le?nam=2026 [304]
reqid=1351 GET /api/v1/ngay-le?nam=2027 [304]
(KHÔNG có POST .../cap-nhat-thanh-toan)
```

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000 |
| OTP login | `666666` (bypass dev-side) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 (giữ làm fallback) |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT (httpOnly cookie + Authorization Bearer) + OTP |
| Tool test | Chrome DevTools MCP |
| Account cb_nv | `cb_nv_tw_01` / `Secret@123` (CB Nghiệp vụ TW 01, BTP-TW) |
| Account cb_pd | `cb_pd_tw_01` / `Secret@123` (CB Phê duyệt TW 01, BTP-TW) |
| Pool data | 100 record HSCT000001..100 (verify 2026-05-04, phân bố đủ 6 state CMS) |

---

*Bug report generated: 2026-05-04 | QA Automation via Claude Code (MCP Chrome DevTools)*
