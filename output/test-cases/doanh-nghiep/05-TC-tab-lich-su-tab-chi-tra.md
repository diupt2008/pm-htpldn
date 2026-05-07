# Test Cases — Tab #3 Lịch sử Hỗ trợ + Tab #4 Hồ sơ Chi trả (Read-only)

> **SRS Ref**: FR-V.III-01 (cite tab #3, #4 srs-fr-07:417-418), SCR-V.III-02 row#3,4. Entity link: VU_VIEC, HO_SO_CHI_TRA.
> **Nguồn**: NotebookLM (`2160bfb1-2020-4199-90a6-d607b298bb42`)
> **Ngày tạo**: 2026-04-30 · **Update 2026-05-06 (FR-06 v3.5)**: state badge tab #4 đồng bộ 10 state SM-CHITRA tiếng Việt thuần (Thay đổi 9). Cite: [`srs-update-2026-5-5/srs-fr-06-chi-tra.md`](../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md) §5 SM-CHITRA.
> **Đặc thù**: Cả 2 tab đều READ-ONLY. Tab #3 KPI 3 ô (Tổng VV / VV hoàn thành / Tổng chi phí). Tab #4 quote NotebookLM cite [7]: "Nguồn duy nhất DVC qua LGSP — CB NV KHÔNG nhập tay" → KHÔNG có action button tạo mới HSCT từ tab này.

---

## Quy ước

(Cùng quy ước file 01)

---

## A. UI FIELD VERIFICATION — TAB #3 & TAB #4

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-LSHT-UI-01 | FR-V.III-01 / SCR-V.III-02 row#3 / UI | Verify trường thông tin Tab #3 "Lịch sử Hỗ trợ": KPI cards, table columns, read-only constraints | 1. cb_nv_tw_01 login. 2. DN-X có ≥1 VV. | — | 1. Mở chi tiết DN-X. 2. Click Tab #3. 3. Kiểm tra KPI section: số card, label, format số. 4. Kiểm tra table: tên cột, thứ tự. 5. Xác nhận KHÔNG có action CRUD. | (3) **KPI Section**: 3 card — "Tổng vụ việc" (number), "VV hoàn thành" (number), "Tổng chi phí hỗ trợ" (format VND có dấu chấm). **Table VV cột**: Mã VV (text click→detail cross-module), Tên VV (text), Trạng thái badge (DA_TIEP_NHAN/DANG_XU_LY/HOAN_THANH/TU_CHOI/HUY), Ngày tiếp nhận (date), Chi phí (number VND). **Pagination**: 20 mục/trang (BR-DATA-07). **Phần tử KHÔNG có**: không có nút [+ Thêm VV] (read-only tab), không có nút [Sửa]/[Xóa] per row, không có nút [Xuất Excel] riêng tab. | Happy 🔴 |
| TC-HSCT-UI-01 | FR-V.III-01 / SCR-V.III-02 row#4 / UI / **FR-06 v3.5** | Verify trường thông tin Tab #4 "Hồ sơ Chi trả": table columns, read-only constraints, nguồn DVC, **state badge tiếng Việt v3.5 (10 state)** | 1. cb_nv_tw_01 login. 2. DN-X có ≥1 HSCT. | — | 1. Mở chi tiết DN-X. 2. Click Tab #4. 3. Kiểm tra table: tên cột, thứ tự. 4. Xác nhận KHÔNG có action CRUD. 5. Xác nhận không có KPI section. 6. **Verify state badge map nhãn tiếng Việt** không lộ raw enum (FR-06 v3.5 Thay đổi 9). | (3) **Table HSCT cột**: Mã HSCT (text click→detail cross-module), Mã VV liên kết (text), Số tiền đề nghị (number VND), Số tiền duyệt (number VND), **Trạng thái badge tiếng Việt v3.5 — 10 state SM-CHITRA**: "Chờ tiếp nhận" (CHO_TIEP_NHAN) / "Đang kiểm tra" (DANG_KIEM_TRA) / "Yêu cầu bổ sung" (YEU_CAU_BO_SUNG) / "Đang đánh giá" (DANG_DANH_GIA) / "Đang thẩm định" (DANG_THAM_DINH) / "Chờ phê duyệt" (CHO_PHE_DUYET) / "Đã duyệt" (DA_DUYET) / "Đã thanh toán" (DA_THANH_TOAN) / "Từ chối" (TU_CHOI) / "Hủy" (HUY), Ngày tạo (date). **Pagination**: 20 mục/trang. **Phần tử KHÔNG có**: không có nút [+ Thêm HSCT] (nguồn duy nhất: DVC qua LGSP — cite NotebookLM [7] + FR-06 v3.5 line 1026), không có nút [Sửa]/[Xóa], không có KPI section (⚠️ SRS row#4 chỉ quote list). **Lưu ý v3.5:** bỏ raw enum cũ `MOI`/`DA_TIEP_NHAN`/`CHO_THAM_DINH`/`DA_THAM_DINH`/`TU_CHOI_THAM_DINH`/`TU_CHOI_THANH_TOAN` (Thay đổi 1). | Happy 🔴 |

---

## B. TAB #3 — LỊCH SỬ HỖ TRỢ (VU_VIEC)

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-LSHT-001 | FR-V.III-01 / SCR-V.III-02 row#3 | Tab #3 hiển thị 3 KPI + danh sách VV | 1. cb_nv_tw_01 login. 2. DN-X có 5 VV: 3 HOAN_THANH (chi phí 5tr+2tr+8tr=15tr), 1 DANG_XU_LY (chi phí 0), 1 TU_CHOI (chi phí 0). | — | 1. Mở chi tiết DN-X. 2. Click Tab "Lịch sử Hỗ trợ". | (1) Backend GET `/vu-viec?doanh_nghiep_id={DN-X}`. (3) UI: 3 KPI card — "Tổng VV: 5", "VV hoàn thành: 3", "Tổng chi phí: 15.000.000 VND". Bảng list 5 VV với cột: Mã VV / Tên / Trạng thái badge / Ngày tiếp nhận / Chi phí. | Happy 🔴 |
| TC-LSHT-002 | FR-V.III-01 / SCR-V.III-02 row#3 | Tab #3 KPI = 0 khi DN không có VV | 1. Login. 2. DN-Y mới tạo, chưa có VV. | — | 1. Mở chi tiết DN-Y. 2. Tab #3. | (3) 3 KPI = 0. Empty state "Chưa có vụ việc hỗ trợ" (**SRS không quote — verify**). | Happy 🟡 |
| TC-LSHT-003 | FR-V.III-01 / cross-module | Click row VV ở Tab #3 → navigate sang module Vụ việc | 1. Tiếp TC-LSHT-001. | — | 1. Tab #3, click row VV-01. | (3) Navigate đến `/vu-viec/{VV-01}` chi tiết. ⚠️ **SRS không quote behavior này — verify**. | Edge 🟡 |
| TC-LSHT-004 | FR-V.III-01 / Read-only | Tab #3 KHÔNG có action CRUD | 1. Login. 2. DN-X có VV. | — | 1. Tab #3. 2. Quan sát toolbar tab. | (3) KHÔNG có nút [Thêm VV], [Sửa], [Xóa] trong tab này. Đây là tab read-only — VV được tạo từ module FR-V.I (Vụ việc). | Happy 🔴 |
| TC-LSHT-005 | FR-V.III-01 / BR-AUTH-08 | Tab #3 chỉ hiển thị VV trong scope role | 1. cb_nv_dp_01 (Sở TP HCM) login. 2. DN-X (đa-đơn-vị) có VV: VV-A do Sở TP HCM tạo, VV-B do Bộ KH&ĐT tạo. | — | 1. cb_nv_dp_01 mở chi tiết DN-X (qua URL hack nếu DN-X không thuộc HCM scope). 2. Tab #3. | (3) Tab #3 chỉ hiện VV thuộc đơn vị Sở TP HCM (VV-A). KHÔNG thấy VV-B (BR-AUTH-08 multi-tenant). KPI tính theo scope (Tổng VV của HCM = 1, không phải tổng toàn cục). | Happy 🔴 |
| TC-LSHT-006 | FR-V.III-01 / KPI logic | KPI "VV hoàn thành" chỉ đếm trang_thai=HOAN_THANH | 1. Login. 2. DN-X có 5 VV (3 HOAN_THANH, 2 DANG_XU_LY). | — | 1. Tab #3. | (3) KPI "VV hoàn thành" = 3 (chỉ HOAN_THANH); KPI "Tổng VV" = 5 (tất cả). | Happy 🟡 |

---

## C. TAB #4 — HỒ SƠ CHI TRẢ (HO_SO_CHI_TRA)

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-HSCT-001 | FR-V.III-01 / SCR-V.III-02 row#4 | Tab #4 hiển thị danh sách HSCT liên kết | 1. cb_nv_tw_01 login. 2. DN-X có 3 HSCT (1 DA_DUYET, 1 CHO_PHE_DUYET, 1 TU_CHOI). | — | 1. Mở chi tiết DN-X. 2. Click Tab "Hồ sơ Chi trả". | (1) Backend GET `/ho-so-chi-tra?doanh_nghiep_id={DN-X}`. (3) Bảng list 3 HSCT với cột: Mã HSCT / Mã VV / Số tiền đề nghị / Số tiền duyệt / Trạng thái badge / Ngày tạo. | Happy 🔴 |
| TC-HSCT-002 | FR-V.III-01 / SCR-V.III-02 row#4 / Read-only | Tab #4 KHÔNG có action tạo HSCT mới | 1. Login. Mở Tab #4 của bất kỳ DN. | — | 1. Quan sát toolbar tab. | (3) KHÔNG có nút [+ Thêm HSCT]. Theo NotebookLM cite [7]: **"Nguồn duy nhất: DVC qua LGSP — CB NV KHÔNG nhập tay hồ sơ chi trả"**. Tab này hoàn toàn read-only. | Happy 🔴 |
| TC-HSCT-003 | FR-V.III-01 / cross-module | Click row HSCT → navigate sang module Chi trả | 1. Tiếp TC-HSCT-001. | — | 1. Click row HSCT-01. | (3) Navigate `/ho-so-chi-tra/{HSCT-01}` chi tiết. ⚠️ **SRS không quote — verify**. | Edge 🟡 |
| TC-HSCT-004 | FR-V.III-01 / BR-AUTH-08 | Tab #4 scope theo role | 1. cb_nv_dp_01 login. 2. DN-X có 2 HSCT (HSCT-A của HCM, HSCT-B của Bộ KH&ĐT). | — | 1. Mở chi tiết DN-X. 2. Tab #4. | (3) Chỉ hiện HSCT-A. HSCT-B không hiện. | Happy 🔴 |
| TC-HSCT-005 | FR-V.III-01 / Empty state | Tab #4 trống khi DN không có HSCT | 1. Login. 2. DN-Y mới tạo. | — | 1. Mở chi tiết DN-Y. 2. Tab #4. | (3) Empty state "Chưa có hồ sơ chi trả" (verify message). | Happy 🟢 |

---

## D. EDGE — TAB INTERACTION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-TAB-010 | FR-V.III-01 / row#1-4 | Switch giữa 4 tab — data persist | 1. Login. 2. DN-X có VV + HSCT + HSPL. | — | 1. Mở chi tiết. 2. Click Tab #1 → #2 → #3 → #4 → #1. | (3) Mỗi tab load data đúng. Tab #1 form không reset khi switch sang tab khác và quay về (input đã sửa giữ nguyên — verify draft state behavior). ⚠️ **SRS không quote — verify**. | Edge 🟢 |
| TC-TAB-011 | FR-V.III-01 / scope | CB_PD chỉ Read tab #1, KHÔNG truy cập tab #2 | 1. cb_pd_tw_01 login. 2. Mở chi tiết DN-X. | — | 1. Click Tab "Hồ sơ PL doanh nghiệp". | (3) Tab #2 expected disabled hoặc khi click hiển thị 403 / "Bạn không có quyền". CB_PD KHÔNG có trong actor list FR-X.1-04 (NotebookLM cite [5]). ⚠️ Verify thực tế UI behavior. | Edge 🔴 |
| TC-LSHT-010 | FR-V.III-01 / SCR-V.III-02 row#3 KPI | KPI "Tổng chi phí" khi VV có chi phí null | Login. DN có VV-A chi phí=null, VV-B chi phí=5tr. | — | 1. Tab #3. | (3) ⚠️ **SRS Gap G21**: SUM với null — bỏ qua hay coi là 0? Default SUM bỏ qua null → KPI = 5tr. Flag BA. | Edge 🟢 |
| TC-LSHT-011 | FR-V.III-01 / SCR-V.III-02 row#3 sort | Sort danh sách VV trong Tab #3 | Login. DN có 3 VV với ngày tiếp nhận khác nhau. | — | 1. Tab #3. 2. Quan sát thứ tự. | (3) ⚠️ **SRS Gap**: SCR row#3 chỉ quote "Danh sách VV liên kết + thống kê" — không quote sort. Default expected sort theo ngày tiếp nhận DESC (mới nhất trên). Flag BA. | Edge 🟢 |
| TC-LSHT-012 | FR-V.III-01 / BR-DATA-07 | Pagination Tab #3 khi DN có >20 VV | Login. DN có 25 VV. | — | 1. Tab #3. | (3) Pagination 20/page (BR-DATA-07 srs-v3.md:3978). KPI tính trên TOÀN BỘ scope (25 VV) hay chỉ trang hiện tại? Default: TOÀN BỘ. ⚠️ **SRS Gap G21:** Flag BA verify. | Edge 🟡 |
| TC-LSHT-013 | FR-V.III-01 / KPI realtime | Tạo VV mới ở module FR-V.I → Tab #3 KPI tự refresh | Login. DN-X có Tổng VV=3. | Tạo VV-04 mới ở `/vu-viec` cho DN-X. | 1. Quay lại Tab #3 DN-X. | (3) ⚠️ **SRS Gap**: realtime update hay phải reload? Default expected: cần reload (websocket/polling không quote). Flag BA. | Edge 🟢 |
| TC-HSCT-010 | FR-V.III-01 / SCR-V.III-02 row#4 status | Tab #4 HSCT có status TU_CHOI/HUY hiển thị đúng | Login. DN-X có HSCT TU_CHOI và HSCT HUY. | — | 1. Tab #4. | (3) Bảng hiển thị 2 row với badge "Từ chối" (đỏ) và "Hủy" (xám) per srs-fr-06 SM-CHITRA. ⚠️ Verify count vào tổng list không. | Edge 🟡 |
| TC-HSCT-011 | FR-V.III-01 / SCR-V.III-02 row#4 KPI | Tab #4 có KPI hay chỉ list | Login. DN có HSCT. | — | 1. Tab #4. 2. Quan sát top section. | (3) ⚠️ **SRS Gap**: SCR row#4 chỉ quote "Danh sách HS chi trả liên kết" (srs-fr-07:418) — KHÔNG quote KPI. Default expected: chỉ list, không KPI. Verify. | Edge 🟢 |
| TC-TAB-020 | FR-V.III-01 / SCR-V.III-02 row#1-4 | Switch tab khi đang điền form Tab #1 chưa lưu | Login. Mở chi tiết DN-X, sửa Tên DN ở Tab #1 (chưa Lưu). | — | 1. Click Tab #2. | (3) ⚠️ **SRS Gap G22**: confirm dialog "Bạn có thay đổi chưa lưu" hay direct switch và lost data? Default expected: confirm dialog. Flag BA. | Edge 🟡 |
| TC-TAB-021 | FR-V.III-01 / SCR-V.III-02 row#2 condition | Tab #2/#3/#4 disabled state khi tạo mới (chưa save) | Login. Click [+ Thêm mới]. | — | 1. Quan sát 4 tab. | (3) Tab #1 Active. Tab #2/#3/#4: theo SRS row#2-4 quote "Chỉ khi xem chi tiết" → tabs ẨN hoặc DISABLED. Verify behavior thực tế. | Happy 🔴 |
| TC-LSHT-014 | FR-V.III-01 / SCR-V.III-01 row#21 | Cột "Số lần hỗ trợ" — verify VV trạng thái HUY/TU_CHOI có count vào không | 1. cb_nv_tw_01 login. 2. DN-X có 5 VV: 2 HOAN_THANH, 1 DANG_XU_LY, 1 TU_CHOI, 1 HUY. | — | 1. Mở danh sách DN. 2. Quan sát cột "Số lần hỗ trợ" của DN-X. | (3) ⚠️ **SRS srs-fr-07:118 quote "Kết hợp thông tin VU_VIEC" không filter state**. 2 kịch bản: (a) Đếm ALL VV = 5 (bao gồm HUY + TU_CHOI); (b) Chỉ đếm VV "active" (loại HUY/TU_CHOI) = 3. **Default expected**: đếm ALL = 5 (theo SRS không filter). Verify thực tế + flag BA xác nhận. | Edge 🟡 |
| TC-DN-052 | FR-V.III-01 / SCR-V.III-01 row#5 | Xuất Excel — 0 records (filter không match) → behavior | 1. cb_nv_tw_01 login. 2. Apply filter tu_khoa="KHONGTONTAI_XYZ_999" (0 kết quả). | — | 1. Click [Xuất Excel]. | (3) ⚠️ **SRS Gap**: behavior khi export 0 records — expected 1 trong 2: (a) File .xlsx chỉ có header (0 data rows); (b) Warning "Không có dữ liệu để xuất" + không download. Verify thực tế. | Edge 🟢 |
| TC-DN-053 | FR-V.III-01 / SCR-V.III-01 row#5 + BR-AUTH-08 | Xuất Excel — CB_PD role có thấy nút [Xuất Excel] không | 1. cb_pd_tw_01 login (CB_PD read-only). 2. Mở `/doanh-nghiep`. | — | 1. Quan sát toolbar. 2. Tìm nút [Xuất Excel]. | (3) SRS SCR-V.III-01 row#5 quote [Xuất Excel] **"Điều kiện hiển thị: Luôn hiển thị"** (srs-fr-07:376) — khác [Thêm mới] / [Import] có điều kiện "Có quyền CRUD". Expected: CB_PD THẤY nút [Xuất Excel] và export được (chỉ dữ liệu trong scope). ⚠️ Verify thực tế — nếu UI ẩn nút Export cho CB_PD = BUG (vi phạm SRS). | Edge 🟡 |

---

## Tổng kết file 05-TC

- **26 TC** (verified bằng grep): 13 Happy + 0 Negative + 13 Edge (gồm 8 TC từ Edge Case Hunter + 3 TC từ Deep Review bổ sung trước + 2 TC UI mới). Phân phối: UI Verify = 2 TC, Tab #3 = 11 TC, Tab #4 = 7 TC, Tab interaction = 4 TC, Cross-module = 2 TC
- **TC bổ sung từ Deep Review**: TC-LSHT-UI-01 (UI verify Tab #3), TC-HSCT-UI-01 (UI verify Tab #4), TC-LSHT-014 (count logic), TC-DN-052/053 (export)
- **Critical TC** (🔴): TC-LSHT-001, 004, 005, TC-HSCT-001, 002, 004, TC-TAB-011, 021 — phải pass 100%
- **SRS Gap**: G21 (KPI null/scope), G22 (tab switch unsaved)
- **Cross-module dependency**: file này phụ thuộc seed VU_VIEC + HO_SO_CHI_TRA upstream — verify GĐ 1 seed module FR-V.I + FR-V.II xong trước.
