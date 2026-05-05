# Bug Report — Workflow Chi trả chi phí (R6.6.1)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp (HTPLDN) |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA Automation (Claude Code via MCP Chrome DevTools) |
| **Ngày** | 2026-05-05 |
| **Loại test** | Workflow E2E (R19 retest sau dev fix lần 3) |
| **Round** | R19 |
| **Tài liệu tham chiếu** | [srs-fr-06-chi-tra.md FR-V.II-* + SCR-V.II-02](../../../../input/srs-v3/srs-fr-06-chi-tra.md) · [workflow-test-report-ChiTra.md](../workflow/workflow-test-report-ChiTra.md) |

---

## Tổng hợp

Phát hiện **7** lỗi Critical (6 FE + 1 BE) + **1 spec inconsistency** trong quá trình test 8 transition CMS workflow Chi trả (R6.6.1). 5 transition còn lại (1, 2, 6, 7, 13) out-of-scope CMS theo SRS dòng 691-694 (module DUY NHẤT không cho CB NV nhập tay, nguồn DVC/LGSP API inbound + cron auto + DN rút qua DVC).

> **3-source verify (2026-05-04):**
> - **NotebookLM HTPLDN** (id `2160bfb1-2020-4199-90a6-d607b298bb42`) — query SM-CHITRA + API field naming + UI SCR-V.II-02. Source: `e23b5d2a` (SRS v2.1 FR-V.II-*) + `98e8d0a4` (Architecture Doc).
> - **SRS local** [srs-fr-06-chi-tra.md FR-V.II-* + SCR-V.II-02](../../../../input/srs-v3/srs-fr-06-chi-tra.md) — 13 transition + Mẫu 01 NĐ55 18 trường + `BR-CALC-01`/`BR-CALC-02`/`BR-FLOW-04`/`BR-EC-16`.
> - **Tài liệu BA gốc** [`input/Input/Danh sách transaction_v1.1.csv`](../../../../input/Input/Danh sách transaction_v1.1_2026-03-27.csv) — UC68-UC80 phần V.II Quản lý chi trả chi phí. Verify lần 2 phát hiện UC72/UC76/UC79 chốt 2 OBS thành BUG (CT-003/CT-005-BE) và 1 OBS giữ nguyên (CT-B FR vs SCR/CSV mismatch về enum CAN_BO_SUNG).

### Severity breakdown (R19 — sau dev deploy fix lần 3)

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 7 (gốc) | 1 (Open) | 0 | 0 | 0 | 0 |

**6/7 closed** ngày 2026-05-05 R19 (CT-001/002/003/004/006/007). Còn lại CT-005-BE giữ Open ở mức Critical với scope thay đổi (BE accept field nhưng FE thêm input contradicting SCR-V.II-02 — cần BA chốt).

> **Re-test R19 — 2026-05-05 11:23-11:33:** Dev confirm "đã fix lần 3 + deploy". Cache cleared (sessionStorage/localStorage/cookies) trước test. Retest 7 bug độc lập 2 isolated context (CT-NV-R19 cho cb_nv_tw_01 + CT-PD-R19 cho cb_pd_tw_01) → **6/7 closed** (CT-001/002/003/004/006/007 PASS), CT-005-BE remain Open với scope thay đổi (BE bug → FE+spec mismatch). 2 obs mới phát sinh (OBS-R19-A perm scope cross-DV, OBS-R19-B button "Trình phê duyệt" mis-wire endpoint).
>
> **Re-test R18 — 2026-05-05 08:55:** Dev confirm "đã fix lại" (lần 2). Retest tất cả 7 bug → **0/7 closed lần 2**, identical R17. JWT token mới R18 (`iat: 1777945965`) → call hoàn toàn fresh, BE schema vẫn require field name cũ. FE vẫn gửi field name sai. STOP retest cho đến khi dev cung cấp evidence deploy.
>
> **Re-test R17 — 2026-05-04 23:45:** Dev claim "đã fix". Retest 7 bug → **0/7 closed**, tất cả vẫn FAIL với cùng request body + response error.

## Bug Summary Table (R19 status)

| Bug ID | Severity | Priority | Type | TC Ref | **SRS + UC Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| ~~BUG-FUNC-CT-001~~ | Critical | P0 | UI/Workflow | R6.6.1 Bước 3 | `FR-06 SM-CHITRA dòng 703` + `SCR-V.II-02 row 4 stepper [Tiếp nhận]` + `UC70` | Detail page state CHO_TIEP_NHAN không render nút action [Tiếp nhận] | **Closed R19** |
| ~~BUG-FUNC-CT-002~~ | Critical | P0 | Workflow/Data | R6.6.1 Bước 4-5 | `FR-V.II-03 Inputs: checklist_items` | POST /kiem-tra 422 — FE field `danhSachTaiLieu` ≠ BE `checklistItems` | **Closed R19** |
| ~~BUG-FUNC-CT-003~~ | Critical | P0 | UI/Workflow | R6.6.1 Bước 8 | `FR-V.II-05 Inputs: phi_tu_van_thuc_te` + `UC72` | UI form Đánh giá thiếu input `phi_tu_van_thuc_te`; POST /danh-gia 422 | **Closed R19** |
| ~~BUG-FUNC-CT-004~~ | Critical | P0 | Workflow/Data | R6.6.1 Bước 9 | `FR-V.II-09 Inputs: ket_qua_tham_dinh` | POST /tham-dinh 422 — FE field `ketQua` ≠ BE `ketQuaThamDinh` | **Closed R19** |
| BUG-FUNC-CT-005-BE | Critical | P0 | Backend/UI | R6.6.1 Bước 10 | `SCR-V.II-02 rows 26-28` + `UC79` | BE giờ accept `soTienDuyet` (không 422); nhưng FE thêm input contradicting SCR-V.II-02 (cb_pd phải có modal confirm only, không nhập số). Cần BA chốt: update SCR + giữ FE input HOẶC xóa input + BE auto-derive | Open (scope shift) |
| ~~BUG-FUNC-CT-006~~ | Critical | P0 | Workflow/Data | R6.6.1 Bước 11 | `FR-V.II-12 Inputs: ly_do_tu_choi` + `BR-FLOW-04` | POST /tu-choi 422 — FE field `lyDo` ≠ BE `lyDoTuChoi` | **Closed R19** |
| ~~BUG-FUNC-CT-007~~ | Critical | P0 | UI/Workflow | R6.6.1 Bước 12 | `FR-V.II-13` + `SCR-V.II-02 row 30` + `UC80` | UI spinbutton "Số tiền thực trả" valuemax=0/valuemin=0 chặn nhập | **Closed R19** |

### New observations R19 (cần track riêng)

| ID | Severity | Type | Mô tả | Action |
|----|----------|------|-------|--------|
| OBS-R19-A | Major | Permission | cb_pd_tw_01 (BTP-TW `00000000-...0001`) gọi POST /phe-duyet + /tu-choi cho HSCT của Sở Tư pháp ĐP → BE 403 `ERR-CT-PD-05: Khong co quyen phe duyet ho so cua don vi khac`. FE list "Chờ phê duyệt" hiện 8/8 record nhưng cb_pd TW chỉ có quyền duyệt record TW. Cần BA xác nhận: scope rule (cb_pd TW chỉ duyệt TW) đúng → FE phải filter list theo scope. | Cần log bug FE list filter sau khi BA xác nhận scope rule |
| OBS-R19-B | Medium | UI/Workflow | Bước 9 form Thẩm định: button đổi label "Trình phê duyệt" sau khi save tham-dinh, nhưng vẫn trigger POST /tham-dinh (tạo tham-dinh thứ 2) thay vì POST /trinh-phe-duyet. State giữ `DANG_THAM_DINH`, không advance sang `CHO_PHE_DUYET` qua UI. _links response có `trinhPheDuyet` nhưng FE không dùng. | Log bug FE wire sai endpoint sau Bước 9 |

## Spec Inconsistency Observation (cần BA clarify, KHÔNG log dev cho đến khi chốt)

| ID | Bước | Mâu thuẫn nội bộ SRS | Verdict |
|---|---|---|---|
| OBS-CT-B | Bước 9 Thẩm định | `FR-V.II-09 Inputs` (NotebookLM `2160bfb1` source `e23b5d2a` + SRS local `srs-fr-06-chi-tra.md` line 546+568+1072) chốt `ket_qua_tham_dinh` enum **3 giá trị** `DAT/KHONG_DAT/CAN_BO_SUNG` **vs** `SCR-V.II-02 row 22` (line 896) chỉ render **2 radio** `Đạt/Không đạt`. BE retest R18 vẫn validate enum 3 giá trị → BE FOLLOW FR-V.II-09 đúng. SCR-V.II-02 lệch FR. | **FR-V.II-09 + BE đồng thuận 3 enum** → **SCR-V.II-02 + UI thiếu radio CAN_BO_SUNG là BUG FE Major**. Tách BUG-FUNC-CT-008 (UI thiếu radio "Cần bổ sung" — block transition `DANG_THAM_DINH → YEU_CAU_BO_SUNG` qua thao tác Thẩm định lần 2). Cần BA xác nhận giữ 3 enum hay chỉnh SCR + xóa enum khỏi BE. |

> **Chú thích Type:**
> - `Workflow` — chuyển trạng thái (state machine transition)
> - `UI/UX` — giao diện, hiển thị, tương tác
> - `Data` — toàn vẹn dữ liệu, validation contract

---

## ~~BUG-FUNC-CT-001~~ [CLOSED R19] — Detail page state CHO_TIEP_NHAN không render nút action [Tiếp nhận]

> **Re-test:** 2026-05-05 R19 — ✅ PASS (Closed-verified). Detail page HSCT000049 giờ render section "Tiếp nhận hồ sơ" + button [Tiếp nhận] + popover confirm "Tiếp nhận hồ sơ?". Click → POST `/tiep-nhan` 200, state `CHO_TIEP_NHAN → DANG_KIEM_TRA`, `ngayTiepNhan: 2026-05-05T04:25:07`, `nguoiTiepNhanId` filled, `deadlineSla: 2026-02-08`. Bằng chứng: ![CT-001 R19 button render](image/r6-r661-r19-bug001-HSCT000049-button-tiep-nhan.png).

### Mô tả

Cb nv mở chi tiết hồ sơ HSCT000049 ở trạng thái "Chờ tiếp nhận" (URL `/chi-tra/{id}?action=kiem-tra`). Trang chỉ render "Quay lại danh sách" — không có button [Tiếp nhận] hoặc form Kiểm tra. Toàn bộ Bước 3 (CHO_TIEP_NHAN → DANG_KIEM_TRA) không thực hiện được qua UI.

### Các bước tái hiện

1. Login `cb_nv_tw_01` / `Secret@123` / OTP `666666`.
2. Navigate sidebar "Quản lý chi trả chi phí" → tab "Chờ xử lý".
3. Click button "Kiểm tra" trên row HSCT000049 (state Chờ tiếp nhận).
4. App navigate sang `http://103.172.236.130:3000/chi-tra/e3000000-0000-4000-8000-000000000049?action=kiem-tra`.
5. Quan sát: detail page render thông tin DN/TVV/VV + stepper 6 phase + section "Lịch sử xử lý" — KHÔNG có button [Tiếp nhận]/form Kiểm tra.

### Kết quả mong đợi

- Theo SRS [srs-fr-06-chi-tra.md FR-V.II-* + SCR-V.II-02](../../../../input/srs-v3/srs-fr-06-chi-tra.md): Bước 3 actor `cb_nv_<cap>_01` thao tác trigger `[Tiếp nhận]` để chuyển CHO_TIEP_NHAN → DANG_KIEM_TRA.
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

## ~~BUG-FUNC-CT-002~~ [CLOSED R19] — POST /kiem-tra 422, FE field `danhSachTaiLieu` ≠ BE `checklistItems`

> **Re-test:** 2026-05-05 R19 — ✅ PASS (Closed-verified). HSCT000050 form Kiểm tra: 5 checkbox + radio Đạt + Submit → POST `/kiem-tra` 200. Request body đổi đúng: `{"ketQua":"DAT","checklistItems":[{"field":"mau_01_nd55","status":"DAY_DU"},...],"version":1}`. State `DANG_KIEM_TRA → DANG_DANH_GIA`, auto trigger POST `/tinh-muc-ho-tro` 200 (BR-CALC-01 chạy). Bằng chứng: ![CT-002 R19 form Kiểm tra 200](image/r6-r661-r19-bug002-HSCT000050-kiem-tra-200.png).

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

- Theo SRS [srs-fr-06-chi-tra.md FR-V.II-* + SCR-V.II-02](../../../../input/srs-v3/srs-fr-06-chi-tra.md): Bước 4 cb_nv tick checklist Đạt → state DANG_KIEM_TRA chuyển sang DANG_DANH_GIA, hệ thống tính trước mức hỗ trợ.
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

## ~~BUG-FUNC-CT-003~~ [CLOSED R19] — UI form Đánh giá thiếu input `phi_tu_van_thuc_te` + POST /danh-gia 422

> **Re-test:** 2026-05-05 R19 — ✅ PASS (Closed-verified). HSCT000045 form Đánh giá giờ render spinbutton "Phí tư vấn thực tế" (default 3.250.000 ₫ từ phí TV). Click "Xác nhận đánh giá" → POST `/danh-gia` 200 với body `{"phiTuVanThucTe":"3250000.00","version":1}`. Response: state `DANG_DANH_GIA → DANG_THAM_DINH`, `soTienDuocDuyet: "3000000.00"` (BR-CALC-02 đúng MIN(5.600.000, 3.250.000×100%, 3.000.000−0) = 3.000.000 ₫ — capped trần năm cho SIEU_NHO). Bằng chứng: ![CT-003 R19 input present](image/r6-r661-r19-bug003-HSCT000045-form-danh-gia-input.png).

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

## ~~BUG-FUNC-CT-004~~ [CLOSED R19] — POST /tham-dinh 422 FE field `ketQua` ≠ BE `ketQuaThamDinh`

> **Re-test:** 2026-05-05 R19 — ✅ PASS (Closed-verified, OBS-CT-B đồng thời resolved). HSCT000046 form Thẩm định: 4 checkbox + **3 radio "Đạt / Không đạt / Cần bổ sung"** (R18 chỉ có 2 radio) + Submit → POST `/tham-dinh` 200 với body `{"ketQuaThamDinh":"DAT","version":1}`. Response tạo thamDinh record `seqId: 1, ketQuaThamDinh: "DAT", soTienDeXuat: "990000.00"`. UI thêm radio "Cần bổ sung" giải quyết spec inconsistency OBS-CT-B (FR-V.II-09 enum 3 giá trị giờ render đúng). _**Lưu ý OBS-R19-B:**_ button "Trình phê duyệt" sau save tham-dinh vẫn trigger /tham-dinh thay vì /trinh-phe-duyet → state chưa advance qua UI, log riêng. Bằng chứng: ![CT-004 R19 form 3 radio](image/r6-r661-r19-bug004-HSCT000046-form-tham-dinh-3radio.png).

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

- Theo SRS [srs-fr-06-chi-tra.md FR-V.II-* + SCR-V.II-02](../../../../input/srs-v3/srs-fr-06-chi-tra.md) + NotebookLM verified `FR-V.II-09 Inputs: ket_qua_tham_dinh`: Bước 9 cb_nv `[Trình duyệt]` với guard "KQ thẩm định đạt" → state DANG_THAM_DINH chuyển CHO_PHE_DUYET.
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

## BUG-FUNC-CT-005-BE [STILL OPEN — scope shift R19] — BE require `soTienDuyet` từ FE thay vì auto-derive từ Bước 8

> **Re-test:** 2026-05-05 R19 — ⚠️ NOT CLOSED, scope shift. BE giờ accept field `soTienDuyet` (không trả 422 nữa). Nhưng FE đã thêm spinbutton "Số tiền duyệt" trong form Phê duyệt (HSCT000047) — contradicting SCR-V.II-02 rows 26-28 + UC79 vốn quy định cb_pd CHỈ click button + modal confirm, KHÔNG có ô input số tiền. Spinbutton lại render `valuemax="0" valuemin="1" value="0"` (inconsistent — max < min). POST với body `{"soTienDuyet":5760000,"version":1}` trả 403 `ERR-CT-PD-05` (perm scope cross-DV — OBS-R19-A riêng). **Cần BA chốt lại design**: (a) update SCR-V.II-02 cho phép cb_pd nhập số tiền + FE fix spinbutton attribute, hoặc (b) xóa spinbutton + BE auto-derive từ thamDinh.soTienDeXuat. Bằng chứng: ![CT-005 R19 form vẫn có input](image/r6-r661-r19-bug005-HSCT000047-form-phe-duyet-still-input.png).

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

## ~~BUG-FUNC-CT-006~~ [CLOSED R19] — POST /tu-choi 422 FE field `lyDo` ≠ BE `lyDoTuChoi`

> **Re-test:** 2026-05-05 R19 — ✅ PASS (Closed-verified). HSCT000041 modal "Từ chối hồ sơ" → fill 75 ký tự + Submit → POST `/tu-choi` với body `{"lyDoTuChoi":"R19 retest verify field name lyDoTuChoi đã đúng spec FR-V.II-12","version":1}`. Field name đúng spec. Response 403 `ERR-CT-PD-05` thuộc OBS-R19-A perm scope cross-DV (cb_pd_tw_01 không duyệt được record của Sở Tư pháp ĐP) — KHÔNG còn 422 field-name. Để verify state transition, cần dùng cb_pd cùng cấp với DonVi của HSCT.

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

- Theo SRS [srs-fr-06-chi-tra.md FR-V.II-* + SCR-V.II-02](../../../../input/srs-v3/srs-fr-06-chi-tra.md) + `BR-FLOW-04`: Bước 11 cb_pd `[Từ chối]` với `ly_do_tu_choi` ≥10 ký tự → state CHO_PHE_DUYET trả về DANG_THAM_DINH.
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

## ~~BUG-FUNC-CT-007~~ [CLOSED R19] — Bước 12 spinbutton "Số tiền thực trả" valuemax=0 chặn submit

> **Re-test:** 2026-05-05 R19 — ✅ PASS (Closed-verified). HSCT000098 form Cập nhật thanh toán: spinbutton giờ render `value="0" valuemax="7872000" valuemin="1"` (R18 sai `valuemax="0" valuemin="0"`). Fill 7872000 + soBienNhan "BN-R19-098" + radio "Đã thanh toán" + Submit → POST `/cap-nhat-thanh-toan` 200 với body `{"ketQuaCuoi":"DA_THANH_TOAN","version":1,"soTienThucTra":7872000,"ngayThanhToan":"2026-05-05","soBienNhan":"BN-R19-098"}`. Response: state `DA_DUYET → DA_THANH_TOAN`, `soTienThucTra: "7872000.00"`, `ngayThanhToan: "2026-05-05"`, `soBienNhan: "BN-R19-098"` lưu DB. Bằng chứng: ![CT-007 R19 spinbutton fixed](image/r6-r661-r19-bug007-HSCT000098-spinbutton-fixed.png).

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

- Theo SRS [srs-fr-06-chi-tra.md FR-V.II-* + SCR-V.II-02](../../../../input/srs-v3/srs-fr-06-chi-tra.md): Bước 12 cb_nv nhập `so_tien_thuc_tra` (≤ `so_tien_duyet`), `ngay_thanh_toan`, `so_bien_nhan` → state DA_DUYET chuyển DA_THANH_TOAN.
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
