# Test Cases — Tab Hồ sơ PL Doanh nghiệp (FR-X.1-04 / UC150)

> **SRS Ref**: FR-X.1-04 (UC150) — gộp từ MH-12.3 (Tư vấn CS) sang SCR-V.III-02 Tab #2 (v2.1). Entity HO_SO_PHAP_LY_DN.
> **Nguồn**: NotebookLM (`2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00`)
> **Ngày tạo**: 2026-04-30
> **Đặc thù**: Tab #2 trên SCR-V.III-02 chỉ hiển thị khi xem chi tiết DN (`Chỉ khi xem chi tiết` — SCR-V.III-02 row#2). Auto-gen `HSPL-{YYYYMMDD}-{SEQ}`. Permission KHÁC tab #1 — actor là CB NV (TW/BN/ĐP) + "Người hỗ trợ", KHÔNG có DN/CB PD.

---

## Quy ước

(Cùng quy ước file 01)

---

## Trường HO_SO_PHAP_LY_DN (NotebookLM cite [3] — FR-X.1-04 Inputs)

| # | Field | Bắt buộc | Kiểu | Ràng buộc | Mặc định |
|---|-------|----------|------|-----------|----------|
| 1 | ma_ho_so | Y (auto) | text | Format `HSPL-{YYYYMMDD}-{SEQ}` | auto-gen |
| 2 | doanh_nghiep_id | Y | FK | → DOANH_NGHIEP | — |
| 3 | ten_ho_so | Y | text | Tối đa 500 ký tự | — |
| 4 | loai_ho_so | Y | enum | GIAY_PHEP / HOP_DONG / GIAY_CN / QUYET_DINH / KHAC | — |
| 5 | linh_vuc_id | N | FK | → DANH_MUC | — |
| 6 | ngay_cap | N | date | — | — |
| 7 | ngay_het_han | N | date | — | — |
| 8 | co_quan_cap | N | text | — | — |
| 9 | mo_ta | N | text(long) | — | — |
| 10 | trang_thai | Y | enum | HIEU_LUC / HET_HAN / THU_HOI | HIEU_LUC |
| 11 | file_dinh_kem | N | file | PDF/image, max 20MB | — |

---

## Permission Tab #2 (KHÁC FR-07)

| Role | Quyền tab #2 | Note |
|------|--------------|------|
| QTHT | (chưa cite trong NotebookLM — verify) | Default ❌ hoặc 👁️ R |
| CB_NV (TW/BN/DP) | ✅ CRUD scoped | Actor chính (NotebookLM cite [5]) |
| CB_PD (TW/BN/DP) | ❌ | KHÔNG có trong actor list FR-X.1-04 |
| "Người hỗ trợ" (NHT/TVV/CG) | ✅ CRUD scoped | Theo NotebookLM cite [5]: "Cán bộ Nghiệp vụ (TW/BN/ĐP), Người hỗ trợ" — verify role mapping cụ thể |
| DN | ❌ | KHÔNG có trong actor list (khác BR-AUTH-11) |

---

## A. UI FIELD VERIFICATION — TAB #2 HSPL

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-HSPL-UI-01 | FR-X.1-04 / SCR-V.III-02 row#2 / UI | Verify trường thông tin Tab #2 "Hồ sơ PL doanh nghiệp": toolbar, table columns, form fields, action buttons | 1. cb_nv_tw_01 login. 2. DN-X có ≥1 HSPL. | — | 1. Mở chi tiết DN-X. 2. Click Tab #2. 3. Kiểm tra toolbar: nút [+ Thêm HSPL] (điều kiện "Có quyền CRUD"). 4. Kiểm tra table: tên cột, thứ tự, kiểu dữ liệu. 5. Click [+ Thêm HSPL] → kiểm tra form: label, input type, required marker `*`. 6. Kiểm tra action bar form. | (3) **Toolbar Tab #2**: [+ Thêm HSPL] button (chỉ CB_NV + Người hỗ trợ, KHÔNG hiện cho CB_PD/DN). **Table HSPL cột**: Mã HSPL (text), Tên hồ sơ (text), Loại hồ sơ badge (GIAY_PHEP/HOP_DONG/GIAY_CN/QUYET_DINH/KHAC), Lĩnh vực (text), Ngày cấp (date), Ngày hết hạn (date), Cơ quan cấp (text), Trạng thái badge (HIEU_LUC xanh/HET_HAN cam/THU_HOI đỏ), Hành động Sửa/Xóa icon. **Form HSPL fields**: Mã hồ sơ text-input readonly auto-gen (row#1), Tên hồ sơ text-input required* max 500 (row#2), Loại hồ sơ select required* 5 options (row#3), Lĩnh vực select optional FK→DANH_MUC (row#4), Ngày cấp date-picker optional (row#5), Ngày hết hạn date-picker optional (row#6), Cơ quan cấp text-input optional (row#7), Mô tả textarea optional (row#8), Trạng thái select required* default=HIEU_LUC 3 options (row#9), File đính kèm file-upload PDF/image max 20MB (row#10). **Action bar**: [Hủy], [Lưu]. **Phần tử KHÔNG có**: không có nút [Import], không có nút [Xuất Excel] riêng cho Tab #2. | Happy 🔴 |

---

## B. XEM TAB & DANH SÁCH HSPL

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-HSPL-001 | FR-X.1-04 / SCR-V.III-02 row#2 | Tab #2 chỉ hiện khi xem chi tiết DN, KHÔNG hiện khi tạo mới | 1. cb_nv_tw_01 login. | — | 1. Click [+ Thêm mới] tạo DN mới. 2. Quan sát tab. 3. Mở chi tiết DN-X có sẵn. | (3) Khi tạo mới: chỉ thấy Tab #1 (Thông tin cơ bản). Tab #2/#3/#4 ẨN (`Chỉ khi xem chi tiết` srs-fr-07:415-418). Khi xem chi tiết DN có sẵn: 4 tab hiện. | Happy 🔴 |
| TC-HSPL-002 | FR-X.1-04 / Outputs | Xem danh sách HSPL của DN | 1. Login. 2. DN-X có 3 HSPL (1 GIAY_PHEP HIEU_LUC, 1 HOP_DONG HET_HAN, 1 QUYET_DINH THU_HOI). | — | 1. Mở chi tiết DN-X. 2. Click Tab "Hồ sơ PL doanh nghiệp". | (1) Backend GET `/ho-so-phap-ly-dn?doanh_nghiep_id={DN-X}`. (3) Bảng 3 dòng với cột: Mã HSPL / Tên / Loại badge / Lĩnh vực / Ngày cấp / Ngày hết hạn / Cơ quan cấp / Trạng thái badge (HIEU_LUC xanh / HET_HAN cam / THU_HOI đỏ). Action Sửa/Xóa per row. | Happy 🔴 |
| TC-HSPL-003 | FR-X.1-04 / BR-DATA-07 | Pagination tab #2 | 1. Login. 2. DN-Y có 25 HSPL. | — | 1. Mở chi tiết DN-Y, tab #2. | (3) Default 20 rows; pagination control hiện. | Happy 🟡 |

---

## C. THÊM MỚI HSPL — CREATE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-HSPL-010 | FR-X.1-04 / Inputs row#1 | Thêm HSPL happy path — auto-gen mã | 1. cb_nv_tw_01 login. 2. Mở chi tiết DN-X. 3. Tab #2. | ten_ho_so="Giấy phép kinh doanh ngành A", loai_ho_so=GIAY_PHEP, linh_vuc_id=KD, ngay_cap=2026-01-15, ngay_het_han=2030-01-15, co_quan_cap="Sở KH&ĐT TP HCM" | 1. Click [+ Thêm HSPL]. 2. Điền form. 3. Lưu. | (1) DB: HO_SO_PHAP_LY_DN record mới với `ma_ho_so` matched regex `^HSPL-\d{8}-\d+$` (vd `HSPL-20260430-001`); `doanh_nghiep_id={DN-X}`; `trang_thai=HIEU_LUC` (default); created_by=cb_nv_tw_01. (2) Toast positive (**SRS Gap: message nguyên văn không có**). (3) Tab #2 list reload, HSPL mới hiện đầu; AUDIT_LOG: action=CREATE entity=HO_SO_PHAP_LY_DN. | Happy 🔴 |
| TC-HSPL-011 | FR-X.1-04 / Inputs row#11 | Upload file PDF kèm HSPL | 1. Login. Mở Tab #2. | file: `giay_phep.pdf` (2MB, PDF) | 1. Click Thêm. 2. Điền form. 3. Upload file PDF 2MB. 4. Lưu. | (1) DB: file_dinh_kem được lưu (storage path + checksum). (3) Detail HSPL hiển thị link file, click download mở được. AUDIT_LOG ghi CREATE + file metadata. | Happy 🟡 |
| TC-HSPL-012 | FR-X.1-04 / Inputs row#11 | Upload file image (.jpg/.png) | Login. Tab #2. | file: `cnkd.png` (5MB, PNG) | 1. Upload PNG 5MB. 2. Lưu. | (1) DB lưu OK. SRS quote "PDF/image" → cả 2 format được. | Happy 🟢 |
| TC-HSPL-013 | FR-X.1-04 / Inputs row#10 default | Trạng thái mặc định = HIEU_LUC khi tạo | Login. Tab #2. | Không chọn trạng thái | 1. Tạo HSPL không chỉnh trang_thai. 2. Lưu. | (1) DB: `trang_thai=HIEU_LUC` (default theo NotebookLM cite [3]). (3) Badge xanh "Hiệu lực". | Happy 🟡 |
| TC-HSPL-014 | FR-X.1-04 / Inputs row#10 | Tạo HSPL với trang_thai=THU_HOI | Login. Tab #2. | trang_thai=THU_HOI | 1. Chọn trạng thái = "Thu hồi". 2. Lưu. | (1) DB: `trang_thai=THU_HOI`. (3) Badge đỏ. | Happy 🟢 |

---

## D. NEGATIVE — VALIDATION HSPL

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-HSPL-020 | FR-X.1-04 / E1 ERR-HSPL-01 | Tên HSPL trống → ERR-HSPL-01 | Login. Tab #2. | ten_ho_so="" | 1. Bỏ trống tên. 2. Lưu. | (1) DB không thay đổi. (2) Error nguyên văn: **"Tên hồ sơ pháp lý là bắt buộc"** (ERR-HSPL-01). (3) Form giữ. | Negative 🔴 |
| TC-HSPL-021 | FR-X.1-04 / E2 ERR-HSPL-02 | Tạo HSPL với DN đã xóa mềm → ERR-HSPL-02 | 1. Login. 2. DN-Z đã `is_deleted=1`. 3. Hack URL truyền `doanh_nghiep_id={DN-Z}`. | — | 1. Cố tạo HSPL với DN-Z. 2. Lưu. | (1) DB không thay đổi. (2) Error: **"Doanh nghiệp không tồn tại hoặc đã bị xóa"** (ERR-HSPL-02). (3) Form reject. | Negative 🔴 |
| TC-HSPL-022 | FR-X.1-04 / E3 ERR-HSPL-03 | File >20MB → ERR-HSPL-03 | Login. Tab #2. | file 21MB PDF | 1. Upload file 21MB. | (2) Error nguyên văn: **"File đính kèm tối đa 20MB"** (ERR-HSPL-03). (1) DB không thay đổi. | Negative 🔴 |
| TC-HSPL-023 | FR-X.1-04 / E3 boundary 20MB | File = 20MB exact → accept | Login. | file 20,971,520 bytes (20MB) | 1. Upload. | (1) Lưu OK. ⚠️ Verify boundary inclusive. | Edge 🟡 |
| TC-HSPL-024 | FR-X.1-04 / E4 ERR-HSPL-04 | File chứa virus (EICAR test) | Login. | file: `eicar.pdf` (EICAR antivirus test signature) | 1. Upload. | (2) ClamAV scan phát hiện. Error: **"File '{ten_file}' chứa mã độc, không thể tải lên"** (ERR-HSPL-04). (1) File KHÔNG lưu storage. | Negative 🔴 |
| TC-HSPL-025 | FR-X.1-04 / Inputs row#11 | Upload file `.exe` → reject | Login. | file: `malware.exe` | 1. Upload. | (2) Error type không hợp lệ (SRS quote "PDF/image" — `.exe` reject). ⚠️ **SRS Gap: chưa có mã lỗi cụ thể cho file type sai — verify**. | Negative 🟡 |
| TC-HSPL-026 | FR-X.1-04 / E5 ERR-HSPL-05 | loai_ho_so không hợp lệ (qua API hack) | Login. Bypass UI dropdown, gửi API với loai_ho_so="INVALID_TYPE". | — | 1. POST API với loại sai. | (1) DB không thay đổi. (2) Error: **"Loại hồ sơ 'INVALID_TYPE' không hợp lệ"** (ERR-HSPL-05). | Negative 🟡 |
| TC-HSPL-027 | FR-X.1-04 / Inputs row#3 boundary | Tên HSPL > 500 ký tự | Login. | ten_ho_so = 501 chars | 1. Nhập 501 ký tự. 2. Lưu. | (2) Validation reject (max 500 — NotebookLM cite [3]). ⚠️ **SRS không quote message — verify**. | Edge 🟢 |

---

## E. UPDATE / DELETE HSPL

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-HSPL-030 | FR-X.1-04 / Postcond | Chuyển trạng thái HIEU_LUC → HET_HAN | 1. Login. 2. HSPL-A trạng thái HIEU_LUC. | new trang_thai=HET_HAN | 1. Click Sửa. 2. Đổi trạng thái. 3. Lưu. | (1) DB: `trang_thai=HET_HAN`, `updated_at`/`updated_by` cập nhật. (3) Badge cam "Hết hạn"; AUDIT_LOG: action=UPDATE, diff trang_thai HIEU_LUC→HET_HAN (BR-DATA-05). | Happy 🟡 |
| TC-HSPL-031 | FR-X.1-04 / Postcond | Xóa mềm HSPL | Login. HSPL-B tồn tại. | — | 1. Click Xóa. 2. Confirm. | (1) DB: `is_deleted=1` (soft delete BR-DATA-01). (3) Tab #2 list không hiện HSPL-B; AUDIT_LOG: DELETE. | Happy 🟡 |

---

## F. EDGE BOUNDARY & CONCURRENCY (bổ sung từ review)

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-HSPL-040 | FR-X.1-04 / Inputs row#6,7 | ngay_het_han < ngay_cap → reject | Login. Tab #2. | ngay_cap=2026-06-01, ngay_het_han=2026-01-01 | 1. Nhập ngày hết hạn TRƯỚC ngày cấp. 2. Lưu. | (2) ⚠️ **SRS Gap**: SRS không quote ERR code cho range invalid (chỉ ERR-HSPL-06 cho search range). Default expected: validation error tương tự ERR-HSPL-06: "Ngày bắt đầu phải trước ngày kết thúc" (NotebookLM cite [4]). Flag BA. | Negative 🟡 |
| TC-HSPL-041 | FR-X.1-04 / Inputs row#6,7 | ngay_het_han = ngay_cap (cùng ngày) | Login. | ngay_cap=ngay_het_han=2026-01-15 | 1. Nhập 2 ngày cùng giá trị. 2. Lưu. | (1) ⚠️ **SRS Gap**: cho phép cùng ngày (effectively expired ngay) hay reject? Default expected accept (validate là `<=`). Flag BA. | Edge 🟢 |
| TC-HSPL-042 | FR-X.1-04 / Inputs row#10 + 7 | trang_thai HIEU_LUC nhưng ngay_het_han < today | Login. | ngay_het_han = today - 30 days, trang_thai=HIEU_LUC | 1. Tạo HSPL với data trên. 2. Lưu. | (1) ⚠️ **SRS Gap G18**: hệ thống auto-update HET_HAN khi ngay_het_han < today, hay manual? SRS quote 3 trạng thái enum (HIEU_LUC/HET_HAN/THU_HOI) nhưng KHÔNG quote auto-transition (line 416, 450). Flag BA. | Edge 🟡 |
| TC-HSPL-043 | FR-X.1-04 / Inputs row#3 boundary | ten_ho_so = 500 chars exact | Login. | ten = 500 chars | 1. Nhập + lưu. | (1) DB lưu OK (NotebookLM cite [3] "Tối đa 500 ký tự" — inclusive). | Edge 🟢 |
| TC-HSPL-044 | FR-X.1-04 / Inputs row#11 | File `.docx` upload | Login. | file `hd.docx` 5MB | 1. Upload. | (2) ⚠️ **SRS quote "PDF/image" (NotebookLM cite [3])** → docx KHÔNG nằm trong whitelist. Expected ERR-HSPL-05 hoặc generic format error. Flag verify. | Negative 🟡 |
| TC-HSPL-045 | FR-X.1-04 / Inputs row#11 | File `.svg` (image vector + XSS risk) | Login. | file `logo.svg` chứa `<script>alert('XSS')</script>` | 1. Upload. 2. Hiển thị HSPL detail. | (3) Detail render file embed an toàn — KHÔNG execute JS. ⚠️ **SRS Gap G20**: SVG là image format theo SRS quote → có nằm whitelist? Verify backend sanitize SVG. Flag security. | Edge 🔴 |
| TC-HSPL-046 | FR-X.1-04 / Inputs row#11 | File `.gif` animation | Login. | file `logo.gif` 3MB | 1. Upload. | (1) DB lưu OK (gif là image). ⚠️ Verify thực tế nhận gif không. | Edge 🟢 |
| TC-HSPL-047 | FR-X.1-04 / Inputs row#11 boundary | File = 20MB exact + 1 byte | Login. | file 20,971,521 bytes (20MB + 1 byte) | 1. Upload. | (2) ERR-HSPL-03: **"File đính kèm tối đa 20MB"** (NotebookLM cite [4]). | Edge 🟡 |
| TC-HSPL-048 | FR-X.1-04 / Inputs row#11 | Multi-file đính kèm cho 1 HSPL | Login. | 3 files PDF | 1. Cố upload 3 file vào 1 HSPL. | (1) ⚠️ **SRS Gap G19**: SRS quote "file_dinh_kem (file)" singular (NotebookLM cite [3]) — chỉ 1 file/HSPL. Verify UI có cho upload nhiều không. | Edge 🟢 |
| TC-HSPL-049 | FR-X.1-04 / E2 + cross-module | Tạo HSPL khi DN cha bị xóa mềm song song | 1. cb_nv_tw_01 mở Tab #2 DN-X điền form HSPL. 2. cb_nv_tw_02 xóa DN-X (success). | — | 1. cb_nv_tw_01 click Lưu. | (1) DB không thay đổi. (2) ERR-HSPL-02: **"Doanh nghiệp không tồn tại hoặc đã bị xóa"** (NotebookLM cite [4]). | Edge 🔴 |
| TC-HSPL-050 | FR-X.1-04 / cross-module | DN xóa mềm → HSPL liên kết hành vi | Login. DN-X có 5 HSPL HIEU_LUC. | — | 1. Xóa DN-X. 2. Query HSPL của DN-X. | (1) ⚠️ **SRS Gap G8**: cascade soft-delete? HSPL `is_deleted=1` theo? Hay giữ orphan? Flag BA. | Edge 🟡 |
| TC-HSPL-051 | FR-X.1-04 / BR-EC-01 | Concurrent edit 2 user trên cùng HSPL | 2 session sửa cùng HSPL-A. | User1 trang_thai→HET_HAN, User2 trang_thai→THU_HOI | 1. User1 Lưu success. 2. User2 Lưu sau. | (1) DB chỉ User1 thắng. (2) User2 nhận ERR-SYS-02 (BR-EC-01 srs-v3.md:4066). | Edge 🟡 |
| TC-HSPL-052 | FR-X.1-04 / BR-AUTH-08 | HSPL của DN-A không hiện ở Tab #2 DN-B | Login. DN-A có 3 HSPL, DN-B có 0 HSPL. | — | 1. Mở chi tiết DN-B. 2. Tab #2. | (3) Tab #2 DN-B: empty state. KHÔNG hiện HSPL của DN-A (filter `doanh_nghiep_id`). | Happy 🔴 |

---

## Tổng kết file 04-TC

- **32 TC** (verified bằng grep): 12 Happy + 8 Negative + 12 Edge (gồm 13 TC từ Edge Case Hunter + 1 TC từ Deep Review)
- **TC bổ sung từ Deep Review**: TC-HSPL-UI-01 (UI Field Verification Tab #2 — bắt buộc theo KI)
- **Critical TC** (🔴): UI-01, 001, 002, 010, 020, 021, 022, 024, 045, 049, 052 — phải pass 100%
- **SRS Gap**: TC-HSPL-010, 023, 025, 027 (cũ) + G18 (auto-transition HET_HAN), G19 (multi-file), G20 (SVG XSS), G8 (cascade)
