# Test Cases — FR-V.III-01 (UC81): Quản lý Doanh nghiệp được HTPL

> **SRS Ref**: FR-V.III-01, SCR-V.III-01 (Danh sách), SCR-V.III-02 (Form 4 tab — Tab #1 only ở file này), Entity DOANH_NGHIEP
> **Nguồn**: NotebookLM (`2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00`)
> **Ngày tạo**: 2026-04-30
> **Đặc thù**: CRUD đầy đủ cho CB_NV. Auto-gen mã `DN-{TINH}-{SEQ}` (BR-DATA-04). Auto-suggest quy mô NĐ39/2018 (BR-CALC-05). Soft-delete với check VV đang xử lý.

---

## Quy ước

| Ký hiệu | Ý nghĩa |
|---------|---------|
| **TraceID** | Ánh xạ 1-1 với SRS — KHÔNG tự chế mã |
| **Kết quả mong đợi** | 3 lớp verify: (1) STATE DB, (2) UI toast/message nguyên văn, (3) PERSIST + side effects |
| **Happy** | Luồng chính — dữ liệu hợp lệ, quyền đúng |
| **Negative** | Luồng lỗi — dữ liệu sai, vi phạm ràng buộc |
| **Edge** | Boundary, race condition, SRS gap |
| 🔴 Critical / 🟡 High / 🟢 Medium | Severity rủi ro |

---

## Trường dữ liệu DOANH_NGHIEP (FR-V.III-01 Inputs)

| # | Trường | Bắt buộc | Kiểu | Ràng buộc |
|---|--------|----------|------|-----------|
| 1 | ma_doanh_nghiep | Y (auto) | text | Auto-gen `DN-{TINH}-{SEQ}` |
| 2 | ten_doanh_nghiep | Y | text | Không rỗng |
| 3 | ma_so_thue | Y | text | UNIQUE toàn hệ thống |
| 4 | giay_cndk | N | text | — |
| 5 | dia_chi | Y | text | Không rỗng |
| 6 | tinh_thanh_id | Y | FK | → DON_VI |
| 7 | loai_doanh_nghiep_id | Y | FK | → DANH_MUC (UC105) |
| 8 | quy_mo | Y | enum | SIEU_NHO / NHO / VUA |
| 9 | nganh_nghe | Y | enum | NONG_LAM / CONG_NGHIEP / THUONG_MAI |
| 10 | so_lao_dong | N | number | ≥ 0 |
| 11 | doanh_thu_nam | N | number | ≥ 0 |
| 12 | tong_nguon_von | N | number | ≥ 0 |
| 13 | nguoi_dai_dien | Y | text | Không rỗng |
| 14 | chuc_vu_dd | N | text | — |
| 15 | email | N | text | Format email |
| 16 | so_dien_thoai | N | text | — |
| 17 | linh_vuc_kinh_doanh | N | text | — |
| 18 | ghi_chu | N | text(long) | — |
| 19 | file_dinh_kem | N | file[] | Multi-upload |
| 20 | fax | N | text | — (SRS SCR-V.III-02 row#22, Entity line 562) |
| 21 | ten_viet_tat | N | text | — (SRS Entity line 553, Conflict C6: Inputs/SCR không có) |

---

## A. UI FIELD VERIFICATION

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-DN-UI-01 | FR-V.III-01 / SCR-V.III-01 / UI | Verify trường thông tin SCR-V.III-01 (Danh sách): 24 components — breadcrumb, toolbar, filter-bar, table, pagination | 1. cb_nv_tw_01 (CB_NV có quyền CRUD) đã đăng nhập. 2. Có ≥1 DN. | — | 1. Mở `/doanh-nghiep`. 2. Kiểm tra breadcrumb. 3. Kiểm tra toolbar: tên nút, số nút, điều kiện hiển thị. 4. Kiểm tra filter-bar: 6 ô + 2 nút. 5. Kiểm tra table: tên cột, thứ tự, kiểu dữ liệu. 6. Kiểm tra pagination. | (3) **Breadcrumb**: "Trang chủ > Doanh nghiệp > Danh sách" (SRS row#1). **Toolbar**: [+ Thêm mới] button (row#3, điều kiện "Có quyền CRUD"), [Import Excel] button (row#4, "Có quyền CRUD"), [Xuất Excel] button (row#5, "Luôn hiển thị"), [Làm mới] button (row#6, "Luôn hiển thị"). **Filter-bar**: Từ khóa search-box (row#7), Quy mô select (row#8), Tỉnh thành select (row#9), Lĩnh vực KD select (row#10), Từ ngày date-picker (row#11), Đến ngày date-picker (row#12), [Tìm kiếm] button (row#13), [Xóa bộ lọc] button (row#14). **Table 9 cột**: Checkbox (row#15), Mã DN (row#16 click→detail), Tên DN (row#17), MST (row#18), Quy mô badge (row#19), Địa chỉ cắt 30 ký tự (row#20), Số lần hỗ trợ (row#21), Tổng chi phí VND (row#22), Hành động Xem/Sửa/Xóa icon (row#23). **Pagination**: 20 mục/trang (row#24). **Phần tử KHÔNG có**: không có nút [Xóa hàng loạt], không có cột trạng thái. | Happy 🔴 |
| TC-DN-UI-02 | FR-V.III-01 / SCR-V.III-02 / UI | Verify trường thông tin SCR-V.III-02 (Form 4 tab): 30 components — tabs, fields, action bar | 1. cb_nv_tw_01 login. 2. Mở chi tiết DN-X. | — | 1. Kiểm tra 4 tab: tên, thứ tự, điều kiện hiển thị. 2. Kiểm tra từng field Tab #1: label, kiểu input, required marker `*`. 3. Kiểm tra action bar. | (3) **4 Tab**: Tab#1 "Thông tin cơ bản" (luôn hiện), Tab#2 "Hồ sơ PL doanh nghiệp" (chỉ chi tiết, row#2), Tab#3 "Lịch sử Hỗ trợ" (chỉ chi tiết, row#3), Tab#4 "Hồ sơ Chi trả" (chỉ chi tiết, row#4). **Tab#1 fields** (30 components): Mã DN text-input readonly (row#5), Tên DN text-input required* (row#6), MST text-input required* (row#7), Giấy CNĐKKD text-input (row#8), Ngày cấp ĐKKD date-picker (row#9), Địa chỉ text-input required* (row#10), Tỉnh thành select required* (row#11), Loại DN select required* (row#12), Quy mô select required* auto-suggest (row#13), Ngành nghề select required* (row#14), Số lao động text-input number (row#15), Doanh thu năm text-input number (row#16), Tổng nguồn vốn text-input number (row#17), Người đại diện text-input required* (row#18), Chức vụ ĐD text-input (row#19), Email text-input (row#20), SĐT text-input (row#21), **Fax text-input (row#22)**, Phụ nữ làm chủ checkbox (row#23), Số LĐ nữ text-input (row#24), Số LĐ khuyết tật text-input (row#25), Lĩnh vực KD textarea (row#26), Ghi chú textarea (row#27), File đính kèm file-upload multi (row#28). **Action bar**: [Hủy] (row#29), [Lưu] (row#30). **Phần tử KHÔNG có**: không có nút [Xóa] trong form detail, không có nút [Auto-save]. | Happy 🔴 |

---

## B. XEM DANH SÁCH — READ

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-DN-001 | FR-V.III-01 / SCR-V.III-01 | Xem danh sách DN — CB_NV_TW thấy toàn quốc | 1. cb_nv_tw_01 đã đăng nhập. 2. Tồn tại ≥3 DN từ ≥2 đơn vị (TW seed + ĐP seed). | — | 1. Click sidebar "Quản lý Doanh nghiệp". 2. Quan sát breadcrumb + table. | (1) Backend GET `/doanh-nghiep` query với scope=TW. (2) — (read, no toast). (3) UI: breadcrumb "Trang chủ > Doanh nghiệp > Danh sách"; toolbar 4 nút [+ Thêm mới], [Import Excel], [Xuất Excel], [Làm mới]; filter 6 ô (Từ khóa/Quy mô/Tỉnh/Lĩnh vực/Từ ngày/Đến ngày); table 9 cột (checkbox/Mã DN/Tên/MST/Quy mô badge/Địa chỉ cắt 30 ký tự/Số lần HT/Tổng chi phí VND/Hành động); pagination 20/page (BR-DATA-07). cb_nv_tw_01 thấy ≥3 DN của mọi đơn vị. | Happy 🔴 |
| TC-DN-002 | FR-V.III-01 / BR-AUTH-08 | CB_NV_BN chỉ thấy DN đơn vị mình | 1. cb_nv_bn_01 (Bộ KH&ĐT) đã login. 2. Seed: 2 DN của Bộ KH&ĐT, 2 DN của Bộ Tài chính, 2 DN của Sở TP HCM. | — | 1. Mở `/doanh-nghiep`. 2. Quan sát danh sách. | (1) GET `/doanh-nghiep?don_vi_id=<KHDT>`. (2) —. (3) UI: chỉ 2 DN của Bộ KH&ĐT hiển thị. KHÔNG thấy 2 DN Bộ Tài chính (ngang cấp BR-AUTH-08), KHÔNG thấy 2 DN Sở TP HCM (cấp dưới khác bộ). | Happy 🔴 |
| TC-DN-003 | FR-V.III-01 / BR-AUTH-08 | CB_NV_DP chỉ thấy DN đơn vị mình | 1. cb_nv_dp_01 (Sở TP HCM) đã login. 2. Seed: 2 DN HCM, 2 DN Hà Nội, 1 DN Bộ KH&ĐT. | — | 1. Mở danh sách DN. | (3) UI chỉ 2 DN HCM. KHÔNG thấy DN Hà Nội (ngang cấp), KHÔNG thấy DN cấp BN (cấp trên khác). | Happy 🔴 |
| TC-DN-004 | FR-V.III-01 / BR-DATA-07 | Pagination: page size 20 mặc định + đổi 50/100 | 1. cb_nv_tw_01 login. 2. Tồn tại ≥120 DN (12 fixture × seed bulk). | — | 1. Mở danh sách. 2. Footer xem total + page size. 3. Đổi page size 20 → 50 → 100. | (1) GET với `pageSize` thay đổi. (3) Default 20 rows; options [10, 20, 50, 100]; format "Hiển thị 1-N / total"; total ≥120. | Happy 🟡 |
| TC-DN-005 | FR-V.III-01 / SCR-V.III-01 row#21,22 | Cột tính toán: Số lần hỗ trợ + Tổng chi phí | 1. cb_nv_tw_01 login. 2. Seed: DN-X có 3 VV (1 hoàn thành chi phí 5tr, 1 đang xử lý chi phí 3tr, 1 hoàn thành chi phí 2tr). | — | 1. Mở danh sách, tìm DN-X. 2. Quan sát cột "Số lần hỗ trợ" + "Tổng chi phí". | (3) Số lần hỗ trợ = 3 (đếm tất cả VV). Tổng chi phí = SUM = 10,000,000 VND, format có dấu chấm phân cách "10.000.000". | Happy 🟡 |
| TC-DN-006 | FR-V.III-01 / SCR-V.III-01 row#20 | Cột địa chỉ cắt 30 ký tự | 1. Login. 2. Seed DN có dia_chi="Số 123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM" (>30 ký tự). | — | 1. Mở danh sách. 2. Hover hoặc xem cột Địa chỉ. | (3) UI hiển thị "Số 123 Đường Nguyễn Văn Lin..." (30 ký tự + ellipsis). Tooltip hover hiển thị full text. | Happy 🟢 |
| TC-DN-007 | FR-V.III-01 / SCR-V.III-01 default sort | Sắp xếp mặc định: ngày cập nhật mới nhất trước | 1. Seed DN-A updated 10:00, DN-B updated 14:00, DN-C updated 09:00 cùng ngày. | — | 1. Mở danh sách. 2. Quan sát thứ tự. | (3) Order: DN-B (14:00) → DN-A (10:00) → DN-C (09:00). SRS line 399. | Happy 🟢 |

---

## B. THÊM MỚI — CREATE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-DN-010 | FR-V.III-01 / BR-DATA-04 | Thêm DN happy path — auto-gen mã | 1. cb_nv_tw_01 login. 2. Loại DN "Doanh nghiệp tư nhân" tồn tại trong DANH_MUC. 3. Tỉnh "Hà Nội" tồn tại DON_VI. | ten="Công ty TNHH ABC", ma_so_thue="0123456789", dia_chi="123 Hai Bà Trưng, HN", tinh_thanh_id=HN, loai_dn_id=DNTN, quy_mo=NHO, nganh_nghe=THUONG_MAI, so_lao_dong=30, doanh_thu_nam=20000000000, nguoi_dai_dien="Nguyễn Văn A" | 1. Click [+ Thêm mới]. 2. Điền 7 trường bắt buộc. 3. Click [Lưu]. | (1) DOANH_NGHIEP record mới: `is_deleted=0`, `don_vi_id=KHDT_TW`, các field nhập = đúng input, `ma_doanh_nghiep` matched regex `^DN-HN-\d+$` (BR-DATA-04 — **SRS Gap G1: SEQ scope chưa rõ**); `created_at`, `created_by=cb_nv_tw_01` set. (2) Toast success: "Thêm doanh nghiệp '{ten}' thành công" (**SRS Gap: chưa có message nguyên văn — verify chỉ toast positive**). (3) List reload, DN hiện đầu (sort by updated_at DESC); AUDIT_LOG: action=CREATE, entity=DOANH_NGHIEP, user=cb_nv_tw_01 (BR-DATA-05). | Happy 🔴 |
| TC-DN-011 | FR-V.III-01 / BR-CALC-05 | Auto-calc quy mô khi nhập số lao động + doanh thu | 1. Login. | so_lao_dong=8, doanh_thu_nam=2_000_000_000 (2 tỷ) — match SIEU_NHO theo NĐ39 | 1. Click Thêm mới. 2. Nhập so_lao_dong=8. 3. Nhập doanh_thu_nam=2,000,000,000. 4. Quan sát ô Quy mô. | (3) Field "Quy mô" auto-suggest = "SIEU_NHO" (≤10 LĐ AND ≤3 tỷ — match cả 2 tiêu chí). | Happy 🟡 |
| TC-DN-012 | FR-V.III-01 / SCR-V.III-02 row#13 | User vẫn có thể override gợi ý quy mô | 1. Login. 2. Đã nhập so_lao_dong=8 (auto-suggest SIEU_NHO). | quy_mo override = NHO | 1. Click dropdown Quy mô. 2. Chọn "NHO". 3. Click [Lưu]. | (1) DB: `quy_mo=NHO` lưu đúng (user override thắng auto-suggest). (2) — (no warning vì user chủ động chọn). (3) List hiển thị badge "NHO". | Happy 🟢 |
| TC-DN-013 | FR-V.III-01 / SCR-V.III-02 row#23 | Tạo DN với checkbox "Phụ nữ làm chủ" | 1. Login. | la_nu_lam_chu=true, so_lao_dong_nu=15 trong tổng so_lao_dong=20 | 1. Tích "Phụ nữ làm chủ". 2. Nhập so_lao_dong=20, so_lao_dong_nu=15. 3. Lưu. | (1) DB: `la_nu_lam_chu=1`, `so_lao_dong_nu=15` ≤ `so_lao_dong=20` (CHECK constraint pass — srs-fr-07:577). (3) Detail hiển thị checkbox tick + value đúng. Cờ này là input cho ưu tiên phân công ở module Vụ việc (BR-CALC-05 phụ lục B). | Happy 🟡 |
| TC-DN-014 | FR-V.III-01 / E1 ERR-DN-01 | Tên DN trống → ERR-DN-01 | 1. Login. | ten="" (rỗng), các field khác valid | 1. Click Thêm mới. 2. Bỏ trống Tên DN. 3. Điền các field khác. 4. Click Lưu. | (1) DB không thay đổi (count trước = sau). (2) Error nguyên văn: **"Tên doanh nghiệp là bắt buộc"** (mã ERR-DN-01, srs-fr-07:189). (3) Form giữ nguyên (modal/drawer không close), focus về field Tên DN. | Negative 🔴 |
| TC-DN-015 | FR-V.III-01 / E2 ERR-DN-02 | MST trùng → ERR-DN-02 | 1. Login. 2. Tồn tại DN-A với ma_so_thue="0100100101". | ma_so_thue="0100100101" (trùng) | 1. Click Thêm mới. 2. Nhập MST = "0100100101". 3. Điền các field bắt buộc. 4. Lưu. | (1) DB không có record mới. (2) Error: **"Mã số thuế đã tồn tại"** (ERR-DN-02, srs-fr-07:190). (3) Form giữ nguyên, focus field MST. | Negative 🔴 |
| TC-DN-016 | FR-V.III-01 / Inputs row#5 | Địa chỉ trống → reject | 1. Login. | dia_chi="" | 1. Bỏ trống Địa chỉ. 2. Lưu. | (1) DB không thay đổi. (2) Error message **"SRS Gap: chưa định nghĩa message rõ ràng cho địa chỉ rỗng — verify field-level validate"** — expected client-side `.ant-form-item-explain-error` với text về required Địa chỉ. (3) Form giữ. | Negative 🟡 |
| TC-DN-017 | FR-V.III-01 / Inputs row#7 | Loại DN không chọn (FK rỗng) → reject | 1. Login. | loai_doanh_nghiep_id=null | 1. Không chọn dropdown Loại DN. 2. Lưu. | (1) DB không thay đổi. (2) Validation error required cho dropdown Loại DN (**SRS Gap: message nguyên văn không có trong SRS**). (3) Form giữ. | Negative 🟡 |
| TC-DN-018 | FR-V.III-01 / Inputs row#15 | Email không đúng format | 1. Login. | email="abc.invalid" | 1. Nhập email không hợp lệ. 2. Điền các field bắt buộc khác. 3. Lưu. | (1) DB không thay đổi. (2) Validation error format email (**SRS Gap message**). (3) Form giữ, focus Email. | Negative 🟡 |
| TC-DN-019 | FR-V.III-01 / Inputs row#10 | Số lao động âm → reject | 1. Login. | so_lao_dong=-5 | 1. Nhập âm. 2. Lưu. | (1) DB không thay đổi. (2) Validation error "≥0" (DB CHECK constraint srs-fr-07:576). | Negative 🟡 |
| TC-DN-020 | FR-V.III-01 / CHECK constraint | so_lao_dong_nu > so_lao_dong → reject | 1. Login. | so_lao_dong=10, so_lao_dong_nu=15 | 1. Nhập số LĐ nữ > tổng số LĐ. 2. Lưu. | (1) DB CHECK constraint chặn (srs-fr-07:577): `so_lao_dong_nu <= so_lao_dong`. (2) Server-side error 500 hoặc 400 — verify response shape. (3) Form không close. | Negative 🟢 |
| TC-DN-021 | FR-V.III-01 / E3 WRN-DN-01 | Quy mô không khớp NĐ39 — confirm dialog | 1. Login. | so_lao_dong=8 (SIEU_NHO theo LĐ), doanh_thu_nam=80_000_000_000 (80 tỷ — VUA theo doanh thu), user chọn quy_mo=NHO | 1. Nhập 2 tiêu chí cho kết quả khác nhau. 2. Chọn quy_mo=NHO (không match cả 2). 3. Click Lưu. | (2) WARNING dialog hiển thị **NGUYÊN VĂN: "Quy mô NHO không khớp với số liệu lao động/doanh thu. Vẫn lưu?"** (WRN-DN-01, srs-fr-07:191). 2 nút [Vẫn lưu] / [Hủy]. | Negative 🔴 |
| TC-DN-022 | FR-V.III-01 / WRN-DN-01 + Q5 NotebookLM | Click "Vẫn lưu" trong WRN-DN-01 | 1. Tiếp TC-DN-021. | — | 1. Click [Vẫn lưu]. | (1) DB: DN lưu thành công. (2) Toast positive. (3) List hiển thị DN mới. ⚠️ **SRS Gap G3:** Không quy định lưu quy mô user nhập (NHO) hay auto-tính (VUA). TC chỉ verify lưu thành công, KHÔNG assert giá trị `quy_mo` — flag BA confirm. | Edge 🟡 |
| TC-DN-023 | FR-V.III-01 / WRN-DN-01 | Click "Hủy" trong WRN-DN-01 | 1. Tiếp TC-DN-021. | — | 1. Click [Hủy]. | (1) DB không thay đổi (count = trước). (3) Dialog đóng, form vẫn mở với data cũ. ⚠️ **SRS Gap G4:** Không quy định focus field nào sau hủy — TC chỉ verify dialog đóng + form không reset. | Edge 🟢 |
| TC-DN-024 | FR-V.III-01 / Inputs#3 (ma_so_thue Y) | MST trống → reject | Login. | ma_so_thue="" | 1. Bỏ trống MST. 2. Điền các field bắt buộc khác. 3. Lưu. | (1) DB không thay đổi. (2) Validation error required cho field MST. ⚠️ **SRS Gap: SRS chỉ ghi "Y" + "Unique toàn hệ thống" (line 92), KHÔNG có ERR code/message nguyên văn cho MST trống** — verify field-level required indicator + flag BA. (3) Form giữ, focus MST. | Negative 🔴 |
| TC-DN-025 | FR-V.III-01 / Inputs#13 (Affected by C3) | Người đại diện trống → reject | Login. | nguoi_dai_dien="" | 1. Bỏ trống. 2. Lưu. | (1) DB không thay đổi (theo Inputs Y). (2) Validation error required. ⚠️ **SRS Conflict C3: Inputs Y vs Entity N — chưa rõ thực tế UI có required hay không.** Flag BA. | Negative 🟡 |
| TC-DN-026 | FR-V.III-01 / Inputs#8 quy_mo | quy_mo không chọn (FK rỗng) → reject | Login. | quy_mo=null (không chọn dropdown) | 1. Để quy_mo trống. 2. Điền các field khác. 3. Lưu. | (1) DB không thay đổi (Inputs row#8 Y bắt buộc, srs-fr-07:97). (2) Validation required. ⚠️ **SRS Gap: không có ERR code cho quy_mo trống** — verify message. | Negative 🟡 |
| TC-DN-027 | FR-V.III-01 / Inputs#9 nganh_nghe (Affected by C2) | nganh_nghe không chọn → reject | Login. | nganh_nghe=null | 1. Để trống. 2. Lưu. | (1) DB không thay đổi (theo Inputs Y). ⚠️ **SRS Conflict C2: Inputs Y vs Entity N**. Verify thực tế. | Negative 🟡 |
| TC-DN-028 | FR-V.III-01 / Inputs#11 doanh_thu_nam ≥0 (Affected by C4) | doanh_thu_nam âm → reject | Login. | doanh_thu_nam=-1000000 | 1. Nhập âm. 2. Lưu. | (1) DB CHECK constraint chặn (srs-fr-07:579 `CHECK (doanh_thu >= 0)`). (2) Validation error "≥0". ⚠️ Conflict C4 tên field. | Negative 🟡 |
| TC-DN-029 | FR-V.III-01 / Inputs#12 tong_nguon_von ≥0 (Affected by C5) | tong_nguon_von âm → reject | Login. | tong_nguon_von=-50000000 | 1. Nhập âm. 2. Lưu. | (1) Inputs row#12 quy định "≥ 0" (srs-fr-07:101). (2) Validation. ⚠️ **Conflict C5: Entity SRS section 4 KHÔNG có field này — verify schema thực tế.** | Negative 🟢 |
| TC-DN-035 | FR-V.III-01 / CHECK constraint srs-fr-07:578 | so_lao_dong_khuyet_tat > so_lao_dong → reject | Login. | so_lao_dong=10, so_lao_dong_khuyet_tat=15 | 1. Nhập. 2. Lưu. | (1) DB CHECK constraint chặn (srs-fr-07:578 `CHECK (so_lao_dong_khuyet_tat <= so_lao_dong)`). (2) Server error. ⚠️ **SRS không quote message UI cho client-side validate** — verify form-level check trước submit. | Negative 🟡 |
| TC-DN-036 | FR-V.III-01 / Inputs#10 boundary | so_lao_dong=0 (DN không nhân viên) → accept | Login. | so_lao_dong=0, doanh_thu_nam=0 | 1. Nhập 0/0. 2. Chọn quy_mo=SIEU_NHO (auto-suggest). 3. Lưu. | (1) DB lưu OK (CHECK ≥0 cho phép 0). (3) DN startup chưa hoạt động được lưu. | Edge 🟢 |
| TC-DN-037 | FR-V.III-01 / Inputs#11 boundary upper | doanh_thu_nam = 999_999_999_999 (~1000 tỷ — vượt VUA NĐ39 200 tỷ) | Login. | so_lao_dong=300 (vượt VUA 200), doanh_thu_nam=999_999_999_999, quy_mo=VUA | 1. Nhập số liệu vượt NĐ39. 2. Chọn quy_mo=VUA. 3. Lưu. | (2) WRN-DN-01: **"Quy mô VUA không khớp với số liệu lao động/doanh thu. Vẫn lưu?"** (srs-fr-07:191). ⚠️ NĐ39 bảng srs-fr-07:35-37 quote VUA ≤200 LĐ + ≤200 tỷ DT — vượt cả 2 → vẫn warning hay block? **SRS Gap**: NotebookLM cite "Vẫn cho phép lưu" → expected warning. | Edge 🟡 |
| TC-DN-038 | FR-V.III-01 / Inputs#15 email format | Email format edge cases | Login. | email values: "abc@", "@example.com", "abc.def@example..com", "abc@example", "very_long_local_part_60chars@x.co" | 1. Lần lượt nhập từng email format edge. 2. Lưu. | (2) Tất cả phải reject với validation "Format email hợp lệ" (srs-fr-07:104). ⚠️ **SRS không quote regex hoặc RFC standard — verify backend chuẩn (RFC 5322 hay HTML5 input type=email)**. Flag BA. | Negative 🟢 |
| TC-DN-039 | FR-V.III-01 / SCR-V.III-02 row#9 (Affected by C7) | ngay_cap_dkkd trong tương lai → reject hoặc warn | Login. | ngay_cap_dkkd = today + 30 ngày | 1. Chọn date picker > today. 2. Lưu. | (1) ⚠️ **SRS Gap + Conflict C7: SRS không quote ngay_cap_dkkd validate range. Inputs section KHÔNG có field này. SCR row#9 + Entity có nhưng không quote ràng buộc.** Flag BA: ngày cấp ĐKKD có cho phép tương lai không? | Edge 🟢 |
| TC-DN-045 | FR-V.III-01 / Inputs#19 file_dinh_kem | Upload nhiều file đính kèm | Login. | 5 file PDF + 2 file image PNG (mỗi file <5MB) | 1. Tạo DN. 2. Upload 7 file. 3. Lưu. | (1) DB lưu metadata 7 file. (3) Detail hiển thị list 7 file download được. ⚠️ **SRS chỉ quote "Upload nhiều file" (line 108) — không quote max count, max size mỗi file, virus scan, format whitelist.** Flag BA cho boundary. | Edge 🟡 |
| TC-DN-046 | FR-V.III-01 / Inputs#19 | File đính kèm vượt size limit | Login. | file 100MB | 1. Upload. | (2) ⚠️ **SRS Gap: không quote max size cho file_dinh_kem ở DN (khác HSPL 20MB).** Verify thực tế behavior. | Edge 🟡 |
| TC-DN-047 | FR-V.III-01 / Inputs#19 | Upload file `.exe` đính kèm | Login. | file .exe | 1. Upload. | (2) ⚠️ **SRS Gap: không quote whitelist format file** (khác HSPL "PDF/image"). Verify ClamAV + format check. | Edge 🔴 |

---

## C. CHỈNH SỬA — UPDATE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-DN-030 | FR-V.III-01 / BR-DATA-05 | Sửa thông tin cơ bản — happy path | 1. cb_nv_tw_01 login. 2. DN-X tồn tại với ten="Công ty A", dia_chi="123 ABC". | new ten="Công ty A (đã đổi tên)", new dia_chi="456 XYZ" | 1. Mở danh sách. 2. Click row Sửa. 3. Đổi tên + địa chỉ. 4. Lưu. | (1) DB: `ten_doanh_nghiep`, `dia_chi` đổi đúng giá trị mới; các field khác (MST, quy_mo, ...) giữ nguyên; `updated_at`, `updated_by=cb_nv_tw_01` cập nhật. (2) Toast success update. (3) Detail/list reload hiển thị giá trị mới; AUDIT_LOG: action=UPDATE, diff old→new (BR-DATA-05). | Happy 🔴 |
| TC-DN-031 | FR-V.III-01 / Inputs row#1 | Mã DN readonly không sửa được | 1. Login. 2. Mở chi tiết DN-X (ma_doanh_nghiep="DN-HN-00001"). | — | 1. Mở chi tiết DN-X. 2. Quan sát ô Mã DN. 3. Cố click/edit. | (3) Field "Mã DN" có attribute `readonly`/`disabled` (SCR-V.III-02 row#5). User KHÔNG sửa được. | Happy 🟡 |
| TC-DN-032 | FR-V.III-01 / E2 ERR-DN-02 | Đổi MST sang giá trị trùng → ERR-DN-02 | 1. Login. 2. DN-A: MST="0100". DN-B: MST="0200". | new MST của DN-A = "0200" (trùng DN-B) | 1. Mở Sửa DN-A. 2. Đổi MST sang "0200". 3. Lưu. | (1) DB không thay đổi (DN-A.ma_so_thue vẫn là "0100"). (2) Error: **"Mã số thuế đã tồn tại"** (ERR-DN-02). (3) Form giữ nguyên, focus MST. | Negative 🔴 |
| TC-DN-033 | FR-V.III-01 / BR-EC-01 | Optimistic lock conflict — 2 user sửa cùng lúc | 1. cb_nv_tw_01 và cb_nv_tw_02 cùng mở Sửa DN-X (cùng updated_at base). | User1 đổi tên→"V1", User2 đổi tên→"V2" | 1. User1 click Lưu (success). 2. User2 click Lưu sau User1. | (1) DB: chỉ User1 thắng, ten="V1". User2 update bị reject. (2) User2 nhận error: ERR-SYS-02 (BR-EC-01 srs-v3.md:4066). (3) Form User2 giữ, hint reload. | Edge 🔴 |
| TC-DN-034 | FR-V.III-01 / BR-AUTH-08 | CB_NV_BN sửa DN của Bộ khác → 403 | 1. cb_nv_bn_01 (Bộ KH&ĐT) login. 2. DN-Y thuộc Bộ Tài chính (don_vi_id khác). | — | 1. Truy cập trực tiếp URL detail DN-Y (qua URL hack). 2. Cố Sửa. | (1) DB không thay đổi. (3) Backend trả 403 hoặc 404 (ẩn record). UI redirect 403 page. AUDIT_LOG: action=ACCESS_DENIED. | Negative 🔴 |

---

## D. XÓA MỀM — DELETE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-DN-040 | FR-V.III-01 / BR-DATA-01 | Xóa mềm DN không có VV → soft delete success | 1. cb_nv_tw_01 login. 2. DN-Z không có VU_VIEC liên kết. | — | 1. Click row Xóa DN-Z. 2. Confirm. | (1) DB: `is_deleted=1` (BR-DATA-01 srs-fr-07:160), record vẫn tồn tại physical. (2) Toast confirm xóa thành công (**SRS Gap: message nguyên văn**). (3) Record ẩn khỏi list mặc định; AUDIT_LOG: action=DELETE (BR-DATA-05); cross-module: dropdown DN ở M3 VU_VIEC không còn DN-Z (entity-map.md). | Happy 🔴 |
| TC-DN-041 | FR-V.III-01 / E4 ERR-DN-03 | Xóa DN có VV trạng thái DANG_XU_LY → ERR-DN-03 | 1. Login. 2. DN-Y có VV-01 trạng thái=DANG_XU_LY. | — | 1. Click Xóa DN-Y. 2. Confirm. | (1) DB không thay đổi (`is_deleted` vẫn = 0). (2) Error: **"Không thể xóa DN đang có vụ việc xử lý"** (ERR-DN-03, srs-fr-07:192). (3) Record vẫn ở list. ⚠️ **SRS Gap G6:** SRS không liệt kê enum state cụ thể bị block — TC giả định block khi `VU_VIEC.trang_thai ∈ (DA_TIEP_NHAN, DANG_KIEM_TRA, DA_PHAN_CONG, DANG_XU_LY, CHO_PHE_DUYET, DA_DUYET)`. Flag BA. | Negative 🔴 |
| TC-DN-042 | FR-V.III-01 / G6 | Xóa DN có VV trạng thái HOAN_THANH → cho phép xóa | 1. Login. 2. DN-W chỉ có VV trạng thái=HOAN_THANH. | — | 1. Click Xóa. 2. Confirm. | (1) `is_deleted=1`. (2) Toast success. (3) Record ẩn. ⚠️ **SRS Gap G6:** Default assume HOAN_THANH/TU_CHOI/HUY allow xóa — flag BA confirm. | Edge 🟡 |
| TC-DN-043 | FR-V.III-01 / BR-DATA-01 | Hard reload sau soft delete — record không hiện | 1. Tiếp TC-DN-040. | — | 1. Click [Làm mới]. 2. Hard reload F5. | (3) Record DN-Z vẫn không hiện ở list mặc định. Nếu UI có filter "Đã xóa" (SRS không quote rõ — verify) → DN-Z xuất hiện. Nếu không có filter "Đã xóa" → flag SRS Gap. | Edge 🟢 |
| TC-DN-044 | FR-V.III-01 / cross-module | Sau xóa DN — VV cũ liên kết vẫn giữ FK | 1. Tiếp TC-DN-040 (DN-Z xóa, không có VV). | — | 1. Verify DB. | (3) Không có VV nào của DN-Z (precondition). Cross-module integrity: nếu seed thêm VV của DN khác → KHÔNG bị ảnh hưởng. AUDIT_LOG entry còn nguyên (immutable). | Edge 🟢 |
| TC-DN-048 | FR-V.III-01 / G6 | Xóa DN có VV trạng thái CHO_PHE_DUYET → block | Login. DN có VV CHO_PHE_DUYET. | — | 1. Xóa. | (2) ERR-DN-03: **"Không thể xóa DN đang có vụ việc xử lý"** (srs-fr-07:192). ⚠️ **SRS Gap G6**: trạng thái CHO_PHE_DUYET có nằm trong "đang xử lý" không? Default block → flag BA. | Edge 🟡 |
| TC-DN-049 | FR-V.III-01 / G6 | Xóa DN có VV trạng thái DA_DUYET (đã duyệt nhưng chưa hoàn thành) → ? | Login. DN có 1 VV DA_DUYET. | — | 1. Xóa. | ⚠️ **SRS Gap G6**: DA_DUYET có "đang xử lý" không? Quan điểm pháp lý: VV đã duyệt → đang trong giai đoạn xử lý. Default expected block với ERR-DN-03. Flag BA. | Edge 🟡 |
| TC-DN-070 | FR-V.III-01 / cross-module | Xóa DN khi DN có HSPL trong Tab #2 | Login. DN-Z không có VV nhưng có 3 HSPL. | — | 1. Xóa DN-Z. 2. Confirm. | (1) ⚠️ **SRS Gap G8**: SRS line 145 chỉ check VV, không check HSPL. NotebookLM cite [confirmed]: "SRS chỉ yêu cầu kiểm tra 1 điều kiện duy nhất". Default expected: xóa DN-Z thành công, HSPL liên kết cascade soft-delete hay giữ orphan? Flag BA. | Edge 🟡 |
| TC-DN-071 | FR-V.III-01 / cross-module | Xóa DN khi DN có HO_SO_CHI_TRA Tab #4 | Login. DN có 2 HSCT (DA_THANH_TOAN). | — | 1. Xóa DN. | ⚠️ **SRS Gap G8**: cascade behavior với HSCT chưa quote. SRS chỉ check VV. Flag BA. | Edge 🟡 |

---

## E. XUẤT EXCEL — EXPORT

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-DN-050 | FR-V.III-01 / BR-DATA-06 | Xuất Excel danh sách happy path | 1. cb_nv_tw_01 login. 2. ≥10 DN tồn tại. 3. Filter quy_mo=NHO áp dụng. | — | 1. Apply filter quy_mo=NHO. 2. Click [Xuất Excel]. | (1) Backend GET `/doanh-nghiep/export?quy_mo=NHO`. (2) — (download). (3) File `.xlsx` download mở được; header 8 cột (Mã DN/Tên/MST/Quy mô/Địa chỉ/Số lần HT/Tổng chi phí/Tỉnh thành); rows match filter `quy_mo=NHO`; format VND có dấu chấm. | Happy 🟡 |
| TC-DN-051 | FR-V.III-01 / BR-DATA-06 boundary 10k | Xuất Excel khi tổng > 10,000 dòng | 1. Login. 2. Seed bulk 10,500 DN. 3. Không apply filter. | — | 1. Click [Xuất Excel]. | (3) BR-DATA-06 (srs-v3.md:3977): max 10k rows/file. Expected 1 trong 2: (a) Reject với cảnh báo "Vui lòng lọc xuống ≤10,000 dòng" hoặc (b) File chỉ chứa 10k rows đầu + warning. ⚠️ **SRS không quote message — verify thực tế**. | Edge 🟡 |

---

## F. EDGE CASE & SECURITY

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-DN-060 | FR-V.III-01 / Inputs row#2 | Tên DN dài 500 ký tự (boundary) | Login. | ten = string 500 chars (ascii) | 1. Nhập tên 500 ký tự. 2. Lưu. | (1) DB lưu thành công (SRS không quote max length cho ten — flag verify với BA). (3) Detail hiển thị full text. ⚠️ **SRS Gap: max length của ten_doanh_nghiep không quote**. | Edge 🟢 |
| TC-DN-061 | FR-V.III-01 / Inputs row#2 | Tên DN có ký tự Unicode + emoji + diacritic | Login. | ten = "Công ty TNHH Á Đông 🇻🇳" | 1. Nhập + lưu. | (1) DB lưu UTF-8 đúng. (3) List + detail render đúng emoji + diacritic. | Edge 🟢 |
| TC-DN-062 | FR-V.III-01 / BR-EC-13 | Ký tự đặc biệt SQL injection trong tên | Login. | ten = "ABC'; DROP TABLE doanh_nghiep;--" | 1. Nhập + lưu. | (1) DB lưu literal text (escape đúng). (3) List hiển thị literal. AUDIT_LOG ghi đúng. KHÔNG có table bị drop. | Edge 🔴 |
| TC-DN-063 | FR-V.III-01 / BR-EC-13 | XSS payload trong field ghi_chu | Login. | ghi_chu = "<script>alert('XSS')</script>" | 1. Nhập + lưu. 2. Mở chi tiết. | (1) DB lưu literal. (3) Detail render escaped (text hiển thị "<script>..."), KHÔNG execute JS. | Edge 🔴 |
| TC-DN-064 | FR-V.III-01 / Q1 G1 | Verify mã DN auto-gen format regex | Login. Tạo 5 DN mới ở 3 tỉnh khác nhau (HN, HCM, ĐN). | — | 1. Tạo 5 DN. 2. Quan sát mã. | (3) Tất cả 5 mã match regex `^DN-[A-Z]+-\d+$`. ⚠️ **SRS Gap G1:** SEQ reset (toàn HT/tỉnh/ngày) + padding zero không quote — verify pattern thực tế (vd `DN-HN-1` vs `DN-HN-00001`) → flag BA. | Edge 🟡 |
| TC-DN-080 | FR-V.III-01 / BR-EC-01 + race | Race condition: 2 user thêm DN cùng MST cùng lúc | 2 session: cb_nv_tw_01 và cb_nv_tw_02. Cùng nhập MST="0123456789". | — | 1. User1 click Lưu. 2. User2 click Lưu (gần như đồng thời). | (1) DB UNIQUE constraint trên ma_so_thue (srs-fr-07:580) — chỉ 1 user thắng. (2) User thua nhận ERR-DN-02: **"Mã số thuế đã tồn tại"** (srs-fr-07:190). | Edge 🔴 |
| TC-DN-081 | FR-V.III-01 / BR-EC-01 race | Concurrent: User1 sửa, User2 xóa | 2 session cùng mở DN-X. | — | 1. User1 Sửa, đang điền form. 2. User2 click Xóa, confirm thành công. 3. User1 click Lưu. | (1) DB: DN-X đã `is_deleted=1`. (2) User1 nhận ERR-SYS-02 (BR-EC-01 srs-v3.md:4066) hoặc 404. ⚠️ Verify behavior. | Edge 🟡 |
| TC-DN-082 | FR-V.III-01 / BR-DATA-05 | AUDIT_LOG schema integrity sau CREATE | Login. Tạo DN-test. | — | 1. Tạo DN. 2. Query AUDIT_LOG bảng. | (3) AUDIT_LOG entry với fields: action="CREATE", entity="DOANH_NGHIEP", entity_id=<DN.id>, user_id=<cb_nv_tw_01>, timestamp=<now>, old_value=null, new_value=<JSON snapshot DN>, ip_address (nếu BR-DATA-05 quote). ⚠️ **SRS BR-DATA-05 chỉ quote "Mọi thao tác CUD ... ghi vào AUDIT_LOG. Log là immutable" (line 662) — không quote field schema cụ thể (G12).** Flag BA. | Edge 🟡 |
| TC-DN-083 | FR-V.III-01 / BR-DATA-05 immutability | AUDIT_LOG immutable — không sửa/xóa được | Login QTHT. AUDIT_LOG có entry. | — | 1. Cố UPDATE/DELETE qua API/DB direct. | (1) DB reject: AUDIT_LOG không cho phép UPDATE/DELETE (SRS line 662 "immutable"). ⚠️ Verify constraint thực tế. | Edge 🔴 |
| TC-DN-084 | FR-V.III-01 / BR-DATA-03 common fields | DN record có đủ 7 common fields | Login. Tạo DN-test. | — | 1. Tạo DN. 2. Query DB. | (1) Record có: id, created_at, updated_at, created_by, updated_by, is_deleted=0, don_vi_id=NOT NULL (BR-DATA-03 + BR-DATA-02 srs-fr-07:644-650). | Edge 🟢 |
| TC-DN-085 | FR-V.III-01 / Inputs#2 boundary | Tên DN dài 1000 ký tự | Login. | ten = 1000 chars | 1. Nhập. 2. Lưu. | (1) ⚠️ **SRS Gap G9**: không quote max length ten_doanh_nghiep. NotebookLM HSPL ten quote 500 chars (srs-fr-07 cite [3]) — DN ten chưa quote. Flag BA. | Edge 🟢 |
| TC-DN-090 | FR-V.III-01 / SCR-V.III-02 row#22 | Field `fax` — nhập + lưu + hiển thị | 1. cb_nv_tw_01 login. | fax="028-38234567" | 1. Mở [+ Thêm mới]. 2. Điền đủ field bắt buộc + fax="028-38234567". 3. Lưu. 4. Mở chi tiết DN mới tạo. | (1) DB: `fax="028-38234567"` lưu đúng (Entity srs-fr-07:562 có field `fax`). (3) Chi tiết hiển thị label "Fax" với giá trị "028-38234567". ⚠️ SRS không quote validate format fax — chấp nhận free-text. | Happy 🟢 |
| TC-DN-091 | FR-V.III-01 / Entity line 553 / SRS Conflict C6 | Field `ten_viet_tat` — verify có hiện trên form hay không | 1. cb_nv_tw_01 login. 2. Mở chi tiết DN-X hoặc [+ Thêm mới]. | — | 1. Quan sát toàn bộ field trên form Tab #1. 2. Tìm field "Tên viết tắt" hoặc "ten_viet_tat". | (3) ⚠️ **SRS Conflict C6**: Entity srs-fr-07:553 CÓ `ten_viet_tat` nhưng Inputs table (line 88-108) và SCR-V.III-02 KHÔNG có. **Expected 2 kịch bản**: (a) Field KHÔNG hiện trên UI → confirm dev bỏ qua Entity attribute, OK; (b) Field CÓ hiện → ghi nhận thêm vào bảng field. Flag BA xác nhận. | Edge 🟡 |
| TC-DN-092 | FR-V.III-01 / Entity line 571 | DB counter `tong_so_vu_viec` = 0 default khi DN mới tạo | 1. cb_nv_tw_01 login. | — | 1. Tạo DN mới (happy path). 2. Query DB `SELECT tong_so_vu_viec FROM doanh_nghiep WHERE id=<new>`. | (1) DB: `tong_so_vu_viec = 0` (Entity srs-fr-07:571 default 0). ⚠️ Nếu field không tồn tại trong DB thực tế → ghi nhận SRS gap, counter được tính dynamic từ VU_VIEC count. | Edge 🟡 |
| TC-DN-093 | FR-V.III-01 / Entity line 572 | DB counter `tong_chi_phi_ho_tro` update khi VV hoàn thành | 1. cb_nv_tw_01 login. 2. DN-X có `tong_chi_phi_ho_tro = 0`. 3. Tạo VV cho DN-X, hoàn thành với chi phí = 5,000,000 VND. | — | 1. Sau VV hoàn thành, query DB `SELECT tong_chi_phi_ho_tro FROM doanh_nghiep WHERE id=<DN-X>`. | (1) DB: `tong_chi_phi_ho_tro = 5000000` (Entity srs-fr-07:572 counter update). ⚠️ **SRS Gap**: counter tự update (trigger/event) hay tính dynamic (SUM từ VU_VIEC)? Nếu dynamic → field Entity chỉ là cache, verify consistency. Flag BA. | Edge 🟡 |

---

## Tổng kết file 01-TC

- **68 TC** (verified bằng grep): 18 Happy + 19 Negative + 31 Edge (gồm 24 TC từ Edge Case Hunter + 6 TC từ Deep Review)
- **TC bổ sung từ Deep Review**: TC-DN-UI-01, TC-DN-UI-02 (UI Field Verification bắt buộc theo KI), TC-DN-090 (fax), TC-DN-091 (ten_viet_tat C6), TC-DN-092/093 (counter fields)
- **SRS Gap flag**: G1, G3, G4, G6, G8, G9, G10, G11, G12 (xem mapping trong 99-REVIEW-edge-case-hunter.md)
- **SRS Conflicts affected**: C2, C3, C4, C5, C6, C7
- **Cross-module impact**: TC-DN-040 (xóa DN → dropdown M3 VV), TC-DN-070/071 (HSPL/HSCT cascade)
- **Critical TC** (🔴): UI-01, UI-02, 001, 002, 003, 010, 014, 015, 021, 024, 030, 032, 033, 034, 040, 041, 047, 062, 063, 080, 083 — phải pass 100%
