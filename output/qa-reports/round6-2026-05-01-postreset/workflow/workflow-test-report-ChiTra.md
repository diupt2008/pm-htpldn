# Workflow Test Report — Chi trả chi phí (R6.6.1)

> **Module:** Quản lý Chi trả chi phí (FR-06) · **SRS:** [`02-thu-tu-module.md §⑪ FR-06 SM-CHITRA`](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L697-L713) · **Round:** R16 · **Date:** 2026-05-04 · **Tester:** QA Automation (Claude Code via MCP Chrome DevTools)
> **Bug:** [`bug-report-flow-chi-tra.md`](../bug-reports/bug-report-flow-chi-tra.md)

---

## Kết luận

❌ **FAIL — 0/8 transition CMS PASS**. **7 BUG Critical** (6 FE + 1 BE) + **1 OBS spec inconsistency** (FR-V.II-09 lệch SCR + UC76 về enum `CAN_BO_SUNG`, cần BA chốt). 5 transition còn lại (1, 2, 6, 7, 13) **out-of-scope CMS** (DVC/LGSP/Cron auto/DN rút hồ sơ qua DVC) — bỏ test, không phải FAIL.

> **Workflow Chi trả CMS-side hoàn toàn không thể vận hành** từ Bước 3 đến Bước 12 — mọi POST từ FE đều trả 422 ERR-VAL hoặc UI không submit. State 100 record HSCT seed sẵn KHÔNG advance được state nào qua UI.
>
> **3-source verify (2026-05-04):**
> - **NotebookLM HTPLDN** (id `e3a2681b-fdd6-4a24-917c-9ed636e8a110`) — query SM-CHITRA + API field naming + UI SCR-V.II-02. Source: `615dcbf0` (SRS v2.1 FR-V.II-*) + `98e8d0a4` (Architecture Doc).
> - **SRS local** [02-thu-tu-module.md §⑪](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L697-L713) — match cho 13 transition.
> - **Tài liệu BA gốc** [`input/Input/Danh sách transaction_v1.1.csv`](../../../../input/Input/Danh sách transaction_v1.1_2026-03-27.csv) UC68-UC80 phần V.II Chi trả — verify lần 2: UC72/UC76/UC79 phân định 2 OBS lên BUG (CT-003 UI thiếu input, CT-005-BE require thừa field) + 1 OBS giữ nguyên (CT-B FR-V.II-09 lệch chuẩn về enum).
> - **Phát hiện quan trọng:** SRS không quy định endpoint API URL (thuộc Architecture Doc) — chỉ chốt logical field name (snake_case `checklist_items`/`ket_qua_tham_dinh`/`ly_do_tu_choi`/`so_tien_thuc_tra`). FE gửi tên khác = FE bug rõ ràng.

---

## R16 (LATEST) — 2026-05-04 21:40-21:50 — Test 8 transition CMS

### Bảng kiểm tra workflow (13 transition theo SRS)

| # | Bước (transition) | Actor | Sample test | Status | Bug / Note |
|:-:|---|---|---|:-:|---|
| 1 | `— → CHO_TIEP_NHAN` (DN nộp Mẫu 01 qua DVC LGSP, UC68) | DN (API inbound) | — | ⏭ | Out-of-scope CMS — không có UI nhập tay theo SRS dòng 691-694 |
| 2 | `— → CHO_TIEP_NHAN` (DN nộp qua chuyên trang Cổng PLQG) | DN (API inbound) | — | ⏭ | Out-of-scope CMS — chuyên trang DN, không phải CMS |
| 3 | `CHO_TIEP_NHAN → DANG_KIEM_TRA` ([Tiếp nhận]) | cb_nv_tw_01 | HSCT000049 | ❌ | [BUG-FUNC-CT-001](../bug-reports/bug-report-flow-chi-tra.md) — UI detail page state CHO_TIEP_NHAN render thiếu nút [Tiếp nhận] |
| 4 | `DANG_KIEM_TRA → DANG_DANH_GIA` (Đạt checklist) | cb_nv_tw_01 | HSCT000050 | ❌ | [BUG-FUNC-CT-002](../bug-reports/bug-report-flow-chi-tra.md) — POST /kiem-tra 422, FE field `danhSachTaiLieu` ≠ BE `checklistItems` |
| 5 | `DANG_KIEM_TRA → YEU_CAU_BO_SUNG` (Thiếu hồ sơ) | cb_nv_tw_01 | HSCT000050 | ❌ | Cùng BUG-FUNC-CT-002 (cùng endpoint /kiem-tra) |
| 6 | `YEU_CAU_BO_SUNG → DANG_KIEM_TRA` (DN bổ sung qua DVC) | DN (API inbound) | — | ⏭ | Out-of-scope CMS |
| 7 | `YEU_CAU_BO_SUNG → TU_CHOI` (System auto BR-EC-16) | System cron | — | ⏭ | Out-of-scope CMS — cron auto, không trigger được tay |
| 8 | `DANG_DANH_GIA → DANG_THAM_DINH` (Đánh giá mức) | cb_nv_tw_01 | HSCT000045 | ❌ | [BUG-FUNC-CT-003](../bug-reports/bug-report-flow-chi-tra.md) — UI form Đánh giá thiếu input `phi_tu_van_thuc_te` + POST /danh-gia 422. 2/3 nguồn (FR-V.II-05 + UC72 CSV BA) confirm CB NV phải nhập |
| 9 | `DANG_THAM_DINH → CHO_PHE_DUYET` ([Trình duyệt]) | cb_nv_tw_01 | HSCT000046 | ❌ | [BUG-FUNC-CT-004](../bug-reports/bug-report-flow-chi-tra.md) — POST /tham-dinh 422, FE field `ketQua` ≠ BE `ketQuaThamDinh` (SRS chốt `ket_qua_tham_dinh`). Riêng FR-V.II-09 thừa enum `CAN_BO_SUNG` = OBS-CT-B (lệch SCR + UC76) |
| 10 | `CHO_PHE_DUYET → DA_DUYET` ([Duyệt]) | cb_pd_tw_01 | HSCT000047 | ❌ | [BUG-FUNC-CT-005-BE](../bug-reports/bug-report-flow-chi-tra.md) — BE bug. UI đúng SCR + UC79 (modal confirm only, no input). BE phải auto-derive `so_tien_duyet` từ Bước 8, không bắt FE gửi |
| 11 | `CHO_PHE_DUYET → DANG_THAM_DINH` ([Từ chối]) | cb_pd_tw_01 | HSCT000041 | ❌ | [BUG-FUNC-CT-006](../bug-reports/bug-report-flow-chi-tra.md) — POST /tu-choi 422, FE field `lyDo` ≠ BE `lyDoTuChoi` |
| 12 | `DA_DUYET → DA_THANH_TOAN` (Cập nhật thanh toán) | cb_nv_tw_01 | HSCT000098 | ❌ | [BUG-FUNC-CT-007](../bug-reports/bug-report-flow-chi-tra.md) — UI spinbutton "Số tiền thực trả" có valuemax=0 chặn nhập số dương → click "Cập nhật thanh toán" không trigger POST |
| 13 | `CHO_TIEP_NHAN → HUY` (DN rút hồ sơ qua DVC) | DN (API inbound) | — | ⏭ | Out-of-scope CMS |

> Icon: ✅ pass · ❌ fail · ⏭ skip (out-of-scope CMS) · 🚫 blocked · — chưa test

### Phát hiện R16

**Pattern chung — FE/BE contract mismatch toàn module Chi trả:**

| Bước | Endpoint | FE gửi (request body) | BE expect (validation) | HTTP |
|---|---|---|---|---|
| 4-5 | POST `/kiem-tra` | `{danhSachTaiLieu, ketQua, version}` | `checklistItems must be an array` | 422 |
| 8 | POST `/danh-gia` | `{version: 1}` (chỉ thế) | `phiTuVanThucTe must be a positive number` | 422 |
| 9 | POST `/tham-dinh` | `{danhSachKiemTra, ketQua, version}` | `ketQuaThamDinh must be one of: DAT, KHONG_DAT, CAN_BO_SUNG` | 422 |
| 10 | POST `/phe-duyet` | `{version: 1}` | `soTienDuyet must be a positive number` | 422 |
| 11 | POST `/tu-choi` | `{lyDo, version}` | `lyDoTuChoi must be longer than or equal to 10 characters` | 422 |
| 12 | POST `/cap-nhat-thanh-toan` | (không submit do FE validate spinbutton valuemax=0) | — | UI block |

**Quan sát cấu trúc app:**
- App rút gọn 2 transition Bước 3 (Tiếp nhận) + Bước 4 (Đạt) thành 1 button [Kiểm tra] trong list view, dẫn tới detail page với param `?action=kiem-tra`. Endpoint POST `/tiep-nhan` không tồn tại (404). Không có khả năng test riêng Bước 3 và 4 — workflow rút gọn không khớp SRS bảng transition.
- Stepper hiển thị 6 phase: Tiếp nhận → Kiểm tra → Đánh giá → Thẩm định → Phê duyệt → Thanh toán — chỉ là StaticText, không có hiệu ứng tick state đã qua.
- 5 tab filter (Tất cả / Chờ xử lý / Đang đánh giá / Chờ phê duyệt / Đã xử lý) hoạt động đúng, count `1-N / M mục` chính xác. Pool 100 record HSCT phân bố:
  - Chờ xử lý 26 (CHO_TIEP_NHAN ~9 + DANG_KIEM_TRA ~9 + YEU_CAU_BO_SUNG ~8)
  - Đang đánh giá 16 (DANG_DANH_GIA 8 + DANG_THAM_DINH 8)
  - Chờ phê duyệt 8 (CHO_PHE_DUYET)
  - Đã xử lý 50 (DA_DUYET / DA_THANH_TOAN / TU_CHOI)
- Permission đúng: cb_nv_tw_01 thấy nút action ở Chờ xử lý + Đang đánh giá + DA_DUYET (Cập nhật TT), KHÔNG thấy action ở Chờ phê duyệt. cb_pd_tw_01 thấy [Phê duyệt] / [Từ chối] ở Chờ phê duyệt.

### Bằng chứng R16

**BUG-FUNC-CT-001 — Bước 3 detail page state CHO_TIEP_NHAN không có nút action:**

![BUG-FUNC-CT-001 — HSCT000049 detail page no action button](../bug-reports/image/r6-r661-bug001-HSCT000049-no-action.png)

**BUG-FUNC-CT-002 — Bước 4-5 form Kiểm tra render đủ nhưng POST 422:**

![BUG-FUNC-CT-002 — HSCT000050 form Kiểm tra](../bug-reports/image/r6-r661-bug002-HSCT000050-form-kiem-tra.png)

```text
POST /api/v1/ho-so-chi-tras/{id}/kiem-tra → 422
Request:  {"ketQua":"DAT","danhSachTaiLieu":[...],"version":1}
Response: {"error":{"code":"ERR-VAL-SYS-00-01","field":"checklistItems","message":"checklistItems must be an array"}}
```

**BUG-FUNC-CT-003 — Bước 8 form Đánh giá thiếu input phiTuVanThucTe:**

![BUG-FUNC-CT-003 — HSCT000045 form Đánh giá](../bug-reports/image/r6-r661-bug003-HSCT000045-form-danh-gia.png)

```text
POST /api/v1/ho-so-chi-tras/{id}/danh-gia → 422
Request:  {"version":1}
Response: {"error":{"code":"ERR-VAL-SYS-00-01","field":"phiTuVanThucTe","message":"phiTuVanThucTe must be a positive number"}}
```

**BUG-FUNC-CT-004 — Bước 9 form Thẩm định FE field sai + thiếu radio CAN_BO_SUNG:**

![BUG-FUNC-CT-004 — HSCT000046 form Thẩm định](../bug-reports/image/r6-r661-bug004-HSCT000046-form-tham-dinh.png)

```text
POST /api/v1/ho-so-chi-tras/{id}/tham-dinh → 422
Request:  {"danhSachKiemTra":[...],"ketQua":"DAT","version":1}
Response: {"error":{"code":"ERR-VAL-SYS-00-01","field":"ketQuaThamDinh","message":"ketQuaThamDinh must be one of the following values: DAT, KHONG_DAT, CAN_BO_SUNG"}}
```

**BUG-FUNC-CT-005 — Bước 10 form Phê duyệt thiếu input soTienDuyet:**

![BUG-FUNC-CT-005 — HSCT000047 form Phê duyệt](../bug-reports/image/r6-r661-bug005-HSCT000047-phe-duyet-no-input.png)

```text
POST /api/v1/ho-so-chi-tras/{id}/phe-duyet → 422
Request:  {"version":1}
Response: {"error":{"code":"ERR-VAL-SYS-00-01","field":"soTienDuyet","message":"soTienDuyet must be a positive number"}}
```

**BUG-FUNC-CT-006 — Bước 11 modal Từ chối FE field `lyDo` ≠ BE `lyDoTuChoi`:**

![BUG-FUNC-CT-006 — HSCT000041 modal Từ chối + 422](../bug-reports/image/r6-r661-bug006-HSCT000041-tu-choi-422.png)

```text
POST /api/v1/ho-so-chi-tras/{id}/tu-choi → 422
Request:  {"lyDo":"Hồ sơ thiếu chứng từ phí tư vấn theo BR-FLOW-04","version":1}
Response: {"error":{"code":"ERR-VAL-SYS-00-01","field":"lyDoTuChoi","message":"lyDoTuChoi must be longer than or equal to 10 characters"}}
```

**BUG-FUNC-CT-007 — Bước 12 spinbutton "Số tiền thực trả" valuemax=0:**

![BUG-FUNC-CT-007 — HSCT000098 spinbutton valuemax=0 block submit](../bug-reports/image/r6-r661-bug007-HSCT000098-spinbutton-valuemax0.png)

```text
Spinbutton attribute: valuemax="0" valuemin="0" value="0"
→ Click "Cập nhật thanh toán" KHÔNG trigger POST nào (FE validate block)
SRS yêu cầu (Bước 12): so_tien_thuc_tra phải ≤ so_tien_duyet (ví dụ HSCT000098: so_tien_duyet=7.872.000 ₫)
```

---

## R17 (LATEST) — 2026-05-04 23:45-23:55 — Retest sau dev claim "đã fix"

### Verdict R17

❌ **REGRESSION FAIL — 0/7 bug closed, 7/7 bug vẫn Open**. Dev claim đã fix toàn bộ Chi trả nhưng retest tất cả 7 bug đều FAIL với cùng error code, cùng request body, cùng response. KHÔNG có thay đổi nào trên FE/BE.

### Bảng retest R17

| Bug ID | Bước | Endpoint | Request body R17 | Response R17 | Verdict |
|---|---|---|---|---|---|
| BUG-FUNC-CT-001 | 3 | (UI) | — | Detail page CHO_TIEP_NHAN vẫn KHÔNG có nút [Tiếp nhận] | ❌ FAIL same |
| BUG-FUNC-CT-002 | 4-5 | POST /kiem-tra | `{ketQua:"DAT",danhSachTaiLieu:[...],version:1}` | 422 `checklistItems must be an array` | ❌ FAIL same |
| BUG-FUNC-CT-003 | 8 | POST /danh-gia | `{version:1}` | 422 `phiTuVanThucTe must be a positive number` | ❌ FAIL same |
| BUG-FUNC-CT-004 | 9 | POST /tham-dinh | `{danhSachKiemTra:[...],ketQua:"DAT",version:1}` | 422 `ketQuaThamDinh must be one of: DAT, KHONG_DAT, CAN_BO_SUNG` | ❌ FAIL same |
| BUG-FUNC-CT-005-BE | 10 | POST /phe-duyet | `{version:1}` | 422 `soTienDuyet must be a positive number` | ❌ FAIL same |
| BUG-FUNC-CT-006 | 11 | POST /tu-choi | `{lyDo:"R17 retest...",version:1}` | 422 `lyDoTuChoi must be longer than or equal to 10 characters` | ❌ FAIL same |
| BUG-FUNC-CT-007 | 12 | (UI) | — | Spinbutton vẫn `valuemax="0" valuemin="0"` chặn nhập | ❌ FAIL same |

### Phát hiện R17

- **Dev claim "đã fix" KHÔNG có evidence trên hệ thống**: tất cả 7 bug retest cùng request body + cùng response error + cùng UI state. Không có FE deploy mới hay BE schema migration nào.
- **2-source SRS verify giữ nguyên kết luận R16** (NotebookLM + SRS local + CSV BA gốc UC68-UC80): 7 bug đều có evidence chuẩn, không phải false positive.
- **Pool 100 record HSCT vẫn nguyên** (verify 2026-05-04 23:43): 26 Chờ xử lý + 16 Đang đánh giá + 8 Chờ phê duyệt + 50 Đã xử lý — không record nào advance state qua UI.

### Bằng chứng R17

**BUG-FUNC-CT-007 R17 — spinbutton vẫn `valuemax=0`:**

![BUG-FUNC-CT-007 R17 — HSCT000098 spinbutton valuemax=0 chưa fix](../bug-reports/image/r6-r661-r17-bug007-spinbutton-still-valuemax0.png)

**Khuyến nghị:**
- Yêu cầu dev confirm thực sự đã deploy fix cho Chi trả (verify commit hash + deploy log) trước khi báo "đã fix".
- Nếu confirm đã deploy: yêu cầu dev attach commit diff + test case BE/FE đã pass internal trước khi escalate QA retest.

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt (1 dòng) |
|---|---|---|
| R17 | 04/05 23:45 | Retest sau dev claim "đã fix" — 0/7 bug closed, all 7 vẫn FAIL same error. Regression: dev chưa thực sự deploy fix. |
| R16 | 04/05 21:40 | Test full workflow — 0/8 CMS transition PASS, 7 BUG Critical FE/BE contract mismatch. |

---

*R16 | QA Automation via Claude Code (MCP Chrome DevTools)*
