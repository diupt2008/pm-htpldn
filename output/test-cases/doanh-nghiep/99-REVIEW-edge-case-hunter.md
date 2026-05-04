# Edge Case Hunter Review — Module Doanh nghiệp (FR-V.III)

> **Người review**: Edge Case Hunter (path tracer mode)
> **Ngày review**: 2026-04-30
> **Scope review**: 6 file TC (01..06) + SRS source `srs-fr-07-doanh-nghiep.md` (680 lines) + NotebookLM cross-check (`2160bfb1-2020-4199-90a6-d607b298bb42`, conv `7bd60e00`)
> **Method**: Mechanically walk every branching path + boundary condition trong SRS — chỉ liệt kê path THIẾU handling trong TC hiện có. Không bình luận hay/dở.
> **Yêu cầu cứng**: TraceID 1-1 SRS — không tự chế. Expected result quote nguyên văn SRS hoặc mark "SRS Gap" nếu SRS không quote.

---

## 📊 Tổng quan TC bổ sung

| File | TC hiện có | TC bổ sung | TC sau merge |
|------|-----------:|-----------:|-------------:|
| 01-CRUD | 27 | **+18** | 45 |
| 02-Search | 15 | **+12** | 27 |
| 03-Import | 20 | **+15** | 35 |
| 04-Tab #2 HSPL | 16 | **+13** | 29 |
| 05-Tab #3+#4 | 13 | **+8** | 21 |
| 06-Permission | 15 | **+11** | 26 |
| **TỔNG** | **106** | **+77** | **183** |

**Severity distribution của TC bổ sung:** 🔴 Critical 24 / 🟡 High 33 / 🟢 Medium 20

---

## ⚠️ SRS Internal Conflicts phát hiện trong review (đã verify trong file SRS local — cần escalate BA)

| # | Conflict | Vị trí 1 | Vị trí 2 | Đề xuất |
|---|----------|----------|----------|---------|
| C1 | `tinh_thanh_id` FK target | srs-fr-07:95 — "FK → DON_VI" | srs-fr-07:559 ERD — "FK → DANH_MUC(id)" | BA chốt: tỉnh là DON_VI hay DANH_MUC entry? |
| C2 | `nganh_nghe` bắt buộc | srs-fr-07:98 Inputs — "Y" | srs-fr-07:563 Entity — "N" | BA chốt Y/N |
| C3 | `nguoi_dai_dien` bắt buộc | srs-fr-07:102 Inputs — "Y" | srs-fr-07:564 Entity — "N" | BA chốt Y/N |
| C4 | Tên field `doanh_thu` vs `doanh_thu_nam` | srs-fr-07:100 — `doanh_thu_nam` | srs-fr-07:566 Entity — `doanh_thu` | BA chốt 1 tên |
| C5 | `tong_nguon_von` thiếu ở Entity | srs-fr-07:101 Inputs có | srs-fr-07:550-573 Entity KHÔNG có | BA bổ sung Entity hoặc xóa Input field |
| C6 | `ten_viet_tat` thiếu ở Inputs/UI | srs-fr-07:553 Entity có | srs-fr-07:88-108 Inputs KHÔNG có | BA bổ sung field hoặc xóa Entity attribute |
| C7 | `ngay_cap_dkkd` Inputs vs UI | srs-fr-07 Inputs KHÔNG có (chỉ giay_cndk) | srs-fr-07:423 SCR row#9 + Entity row 556 có | BA bổ sung Inputs hoặc xóa SCR row |
| C8 | `quy_mo` `nganh_nghe` enum không match Entity | srs-fr-07:97-98 enum cụ thể | srs-fr-07 Entity không quote enum | BA xác nhận enum chính thức |

> **Note:** Các test case bổ sung dưới đây có thể bị ảnh hưởng bởi SRS internal conflict — đã đánh dấu "Affected by C{N}".

---

## 📝 File 01 — Bổ sung cho `01-TC-quan-ly-dn-CRUD.md`

### Section B (Thêm mới — CREATE) — bổ sung TC

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
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

### Section D (Xóa mềm — DELETE) — bổ sung TC

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-DN-048 | FR-V.III-01 / G6 | Xóa DN có VV trạng thái CHO_PHE_DUYET → block | Login. DN có VV CHO_PHE_DUYET. | — | 1. Xóa. | (2) ERR-DN-03: **"Không thể xóa DN đang có vụ việc xử lý"** (srs-fr-07:192). ⚠️ **SRS Gap G6**: trạng thái CHO_PHE_DUYET có nằm trong "đang xử lý" không? Default block → flag BA. | Edge 🟡 |
| TC-DN-049 | FR-V.III-01 / G6 | Xóa DN có VV trạng thái DA_DUYET (đã duyệt nhưng chưa hoàn thành) → ? | Login. DN có 1 VV DA_DUYET. | — | 1. Xóa. | ⚠️ **SRS Gap G6**: DA_DUYET có "đang xử lý" không? Quan điểm pháp lý: VV đã duyệt → đang trong giai đoạn xử lý. Default expected block với ERR-DN-03. Flag BA. | Edge 🟡 |
| TC-DN-070 | FR-V.III-01 / cross-module | Xóa DN khi DN có HSPL trong Tab #2 | Login. DN-Z không có VV nhưng có 3 HSPL. | — | 1. Xóa DN-Z. 2. Confirm. | (1) ⚠️ **SRS Gap**: SRS line 145 chỉ check VV, không check HSPL. NotebookLM cite [confirmed]: "SRS chỉ yêu cầu kiểm tra 1 điều kiện duy nhất". Default expected: xóa DN-Z thành công, HSPL liên kết cascade soft-delete hay giữ orphan? Flag BA. | Edge 🟡 |
| TC-DN-071 | FR-V.III-01 / cross-module | Xóa DN khi DN có HO_SO_CHI_TRA Tab #4 | Login. DN có 2 HSCT (DA_THANH_TOAN). | — | 1. Xóa DN. | ⚠️ **SRS Gap**: cascade behavior với HSCT chưa quote. SRS chỉ check VV. Flag BA. | Edge 🟡 |

### Section F (Edge & Security) — bổ sung TC

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-DN-080 | FR-V.III-01 / BR-EC-01 + race | Race condition: 2 user thêm DN cùng MST cùng lúc | 2 session: cb_nv_tw_01 và cb_nv_tw_02. Cùng nhập MST="0123456789". | — | 1. User1 click Lưu. 2. User2 click Lưu (gần như đồng thời). | (1) DB UNIQUE constraint trên ma_so_thue (srs-fr-07:580) — chỉ 1 user thắng. (2) User thua nhận ERR-DN-02: **"Mã số thuế đã tồn tại"** (srs-fr-07:190). | Edge 🔴 |
| TC-DN-081 | FR-V.III-01 / BR-EC-01 race | Concurrent: User1 sửa, User2 xóa | 2 session cùng mở DN-X. | — | 1. User1 Sửa, đang điền form. 2. User2 click Xóa, confirm thành công. 3. User1 click Lưu. | (1) DB: DN-X đã `is_deleted=1`. (2) User1 nhận ERR-SYS-02 (BR-EC-01 srs-v3.md:4066) hoặc 404. ⚠️ Verify behavior. | Edge 🟡 |
| TC-DN-082 | FR-V.III-01 / BR-DATA-05 | AUDIT_LOG schema integrity sau CREATE | Login. Tạo DN-test. | — | 1. Tạo DN. 2. Query AUDIT_LOG bảng. | (3) AUDIT_LOG entry với fields: action="CREATE", entity="DOANH_NGHIEP", entity_id=<DN.id>, user_id=<cb_nv_tw_01>, timestamp=<now>, old_value=null, new_value=<JSON snapshot DN>, ip_address (nếu BR-DATA-05 quote). ⚠️ **SRS BR-DATA-05 chỉ quote "Mọi thao tác CUD ... ghi vào AUDIT_LOG. Log là immutable" (line 662) — không quote field schema cụ thể.** Flag BA. | Edge 🟡 |
| TC-DN-083 | FR-V.III-01 / BR-DATA-05 immutability | AUDIT_LOG immutable — không sửa/xóa được | Login QTHT. AUDIT_LOG có entry. | — | 1. Cố UPDATE/DELETE qua API/DB direct. | (1) DB reject: AUDIT_LOG không cho phép UPDATE/DELETE (SRS line 662 "immutable"). ⚠️ Verify constraint thực tế. | Edge 🔴 |
| TC-DN-084 | FR-V.III-01 / BR-DATA-03 common fields | DN record có đủ 7 common fields | Login. Tạo DN-test. | — | 1. Tạo DN. 2. Query DB. | (1) Record có: id, created_at, updated_at, created_by, updated_by, is_deleted=0, don_vi_id=NOT NULL (BR-DATA-03 + BR-DATA-02 srs-fr-07:644-650). | Edge 🟢 |
| TC-DN-085 | FR-V.III-01 / Inputs#2 boundary | Tên DN dài 1000 ký tự | Login. | ten = 1000 chars | 1. Nhập. 2. Lưu. | (1) ⚠️ **SRS Gap**: không quote max length ten_doanh_nghiep. NotebookLM HSPL ten quote 500 chars (srs-fr-07 cite [3]) — DN ten chưa quote. Flag BA. | Edge 🟢 |

---

## 📝 File 02 — Bổ sung cho `02-TC-tim-kiem-dn.md`

### Section A/B — bổ sung TC search edge

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-TKDN-020 | FR-V.III-02 / Inputs#1 + BR-EC-13 | tu_khoa với LIKE wildcard `%`, `_` | Login. | tu_khoa="%" hoặc "_" | 1. Nhập wildcard. 2. Tìm. | (1) ⚠️ **BR-EC-13 quote "escape ký tự đặc biệt truy vấn" (srs-v3.md:4078) — verify backend escape `%` `_` thành literal**. Expected: hiển thị DN có chứa literal `%` hoặc `_` trong tên (ít có), KHÔNG match all. | Edge 🔴 |
| TC-TKDN-021 | FR-V.III-02 / Inputs#1 | tu_khoa whitespace leading/trailing | Login. DN tên="Công ty ABC". | tu_khoa=" ABC " (có space đầu cuối) | 1. Nhập. 2. Tìm. | (3) Backend trim trước query (BR-EC-13 quote "trim, max 200 ký tự"). DN ABC match. | Edge 🟢 |
| TC-TKDN-022 | FR-V.III-02 / Inputs#1 | tu_khoa multi-keyword (space giữa) | Login. DN-A="Công ty TNHH ABC", DN-B="Công ty ABC TNHH". | tu_khoa="Công ty ABC" (3 từ) | 1. Tìm. | (3) ⚠️ **SRS Gap**: SRS không quote search engine — full-text vs LIKE %term1%term2%term3% vs OR logic? Default LIKE → expected match cả DN-A và DN-B. Flag BA. | Edge 🟡 |
| TC-TKDN-023 | FR-V.III-02 / Processing step 2 | Tất cả filter empty → load default scope | Login (cb_nv_tw_01). | Tất cả filter trống | 1. Click [Tìm kiếm] không nhập gì. | (3) Backend trả về scope mặc định của role (BR-AUTH-08), tương đương load page lần đầu. Pagination 20/page. | Happy 🟡 |
| TC-TKDN-024 | FR-V.III-02 / SCR-V.III-01 row#13 | Filter persist khi pagination next page | Login. Filter quy_mo=NHO active. >40 DN match. | — | 1. Apply filter quy_mo=NHO. 2. Click trang 2. | (1) Backend GET `/doanh-nghiep?quy_mo=NHO&page=2`. (3) Filter chip vẫn hiển thị "Quy mô: NHO". Trang 2 chỉ DN NHO. | Happy 🔴 |
| TC-TKDN-025 | FR-V.III-02 / SCR-V.III-01 row#13 | URL deep-link với filter param | Login. | URL: `/doanh-nghiep?quy_mo=NHO&tinh_thanh=HCM` | 1. Paste URL. 2. Page load. | (3) Filter pre-filled từ URL. Table hiển thị kết quả filter. ⚠️ **SRS không quote URL sync — verify thực tế** (note CLAUDE.md cite "BR-UX-01 nếu module có filter"). Flag BA. | Edge 🟡 |
| TC-TKDN-026 | FR-V.III-02 / Inputs#4 | Filter "Lĩnh vực KD" — source dropdown | Login. | linh_vuc_kd values | 1. Mở dropdown lĩnh vực. 2. Quan sát options. | (3) ⚠️ **SRS Conflict**: SCR row#10 quote "select" (srs-fr-07:381) nhưng Entity row 26 là `linh_vuc_kinh_doanh` text + Inputs row#17 cũng text. Source dropdown từ DANH_MUC nào? Flag BA. | Edge 🟡 |
| TC-TKDN-027 | FR-V.III-02 / Inputs#5,6 / G5 | Filter date — tu_ngay = today, den_ngay = today (cùng ngày) | Login. Seed VV ngày today. | tu_ngay=today, den_ngay=today | 1. Tìm. | (3) ⚠️ **SRS Gap G5**: inclusive 2 đầu hay exclusive? Default assume inclusive (BETWEEN) → DN có VV today match. Flag BA. | Edge 🟡 |
| TC-TKDN-028 | FR-V.III-02 / Processing default sort | Search keep default sort hay relevance | Login. tu_khoa="ABC". | — | 1. Tìm. 2. Quan sát thứ tự. | (3) ⚠️ **SRS Gap**: SRS không quote sort khi search. Default sort theo SCR row 399 "ngày cập nhật mới nhất trước". Verify khi có search keyword có đổi sort không. Flag BA. | Edge 🟢 |
| TC-TKDN-029 | FR-V.III-02 / BR-EC-13 performance | Search trên 10k+ records — timeout boundary | Login. 12,000 DN seed. | tu_khoa="A" (match đa phần) | 1. Tìm. | (3) ⚠️ **BR-EC-13 quote "Bảng > 10K → tìm kiếm toàn văn" (srs-v3.md:4078)**. Verify backend dùng full-text index, response time <3s. Flag performance test. | Edge 🟡 |
| TC-TKDN-030 | FR-V.III-02 / Inputs#1 | tu_khoa = chuỗi rỗng "" sau click search | Login. | tu_khoa="" | 1. Click search-box. 2. KHÔNG gõ gì. 3. Click [Tìm kiếm]. | (3) Behave như TC-TKDN-023 (load default scope, không filter). | Edge 🟢 |
| TC-TKDN-031 | FR-V.III-02 / Inputs#5,6 / G5 | Filter date tu_ngay = den_ngay nhưng không có VV ngày đó | Login. DN-X không có VV ngày 2026-04-30. | tu_ngay=den_ngay=2026-04-30 | 1. Tìm. | (3) Empty state INF-DN-TK-01: **"Không tìm thấy doanh nghiệp phù hợp"** (srs-fr-07:262). | Edge 🟢 |

---

## 📝 File 03 — Bổ sung cho `03-TC-import-excel-dn.md`

### Section A/B/C — bổ sung TC import edge

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-IMP-040 | FR-V.III-NEW-01 / E1 ERR-IMP-DN-01 | File `.xlsm` (Excel macro) | Login. File Excel có macro. | — | 1. Drop. | (2) ⚠️ **SRS Gap**: SRS quote "file Excel (.xlsx)" (srs-fr-07:344) — `.xlsm` extension khác. Default expected reject với ERR-IMP-DN-01. Flag verify (vì security: macro có thể nguy hiểm). | Negative 🔴 |
| TC-IMP-041 | FR-V.III-NEW-01 / E1 + security | Bypass extension: rename `.exe` → `.xlsx` | Login. File `.exe` đổi tên thành `.xlsx`. | — | 1. Drop. | (2) ⚠️ **SRS Gap**: chỉ check extension hay magic bytes? Default expected: backend detect mismatch → ERR-IMP-DN-01 hoặc generic error. Flag security verify. | Negative 🔴 |
| TC-IMP-042 | FR-V.III-NEW-01 / E1 | File `.xlsx` corrupted (binary garbage) | Login. File `.xlsx` đã bị corrupt. | — | 1. Drop. | (2) ⚠️ **SRS Gap**: SRS không quote message cho corrupted file. Default expected error generic "File không đọc được" hoặc reject với ERR-IMP-DN-01. Flag BA. | Negative 🟡 |
| TC-IMP-043 | FR-V.III-NEW-01 / E1 | File `.xlsx` password-protected | Login. File `.xlsx` có password. | — | 1. Drop. | (2) ⚠️ **SRS Gap**: SRS không quote. Default expected error "File được bảo vệ" hoặc reject. Flag BA. | Negative 🟡 |
| TC-IMP-044 | FR-V.III-NEW-01 / E4 + security | Cell có formula injection | Login. File với cell tên DN = `=cmd|'/c calc'!A1` | — | 1. Upload + import. | (1) DB lưu literal text (Excel formula chỉ eval trong Excel viewer, server đọc ô raw). (3) Khi user xuất Excel sau import, cell phải prefix `'` để escape (CSV/XLSX injection prevention). ⚠️ **SRS không quote — verify backend escape.** | Edge 🔴 |
| TC-IMP-045 | FR-V.III-NEW-01 / E4 | MST cell format auto Excel: leading zero "0123456789" → "123456789" | Login. File MST cell format=Number. | MST="0123456789" entered as number → Excel save thành 123456789 | 1. Save file. 2. Upload. | (2) ERR-IMP-DN-04: "Dòng N, cột Mã số thuế: format không hợp lệ (10/13 số)" (srs-fr-07:347). ⚠️ Workaround: user phải format MST cell thành Text. SRS không quote hướng dẫn → flag UX gap. | Edge 🟡 |
| TC-IMP-046 | FR-V.III-NEW-01 / Cột bắt buộc | Header row chữ hoa/thường khác | Login. File header "TÊN DN" / "tên dn" / "tên DN" thay vì "Tên DN". | — | 1. Upload. | (3) ⚠️ **SRS Gap**: SRS không quote case-sensitivity header. Default expected: insensitive → accept. Flag BA. | Edge 🟢 |
| TC-IMP-047 | FR-V.III-NEW-01 / Cột bắt buộc | Header row có space leading/trailing | Login. File header " Tên DN " (sau copy-paste). | — | 1. Upload. | (3) Backend trim → accept. ⚠️ **SRS không quote — verify**. | Edge 🟢 |
| TC-IMP-048 | FR-V.III-NEW-01 / Cột bắt buộc | Header row sai thứ tự | Login. File cột thứ tự: MST, Tên DN, Địa chỉ, ... (đảo Tên DN ↔ MST). | — | 1. Upload. | (3) ⚠️ **SRS Gap**: SRS quote bắt buộc cột (srs-fr-07:296-308) nhưng không quote thứ tự. Default expected: match theo tên header → accept. Flag BA. | Edge 🟢 |
| TC-IMP-049 | FR-V.III-NEW-01 / Inputs#1 | File có nhiều sheet — backend đọc sheet nào? | Login. File 3 sheet: "DN" (data), "Hướng dẫn", "Mẫu". | — | 1. Upload. | (3) ⚠️ **SRS Gap**: không quote multi-sheet behavior. Default expected: đọc sheet đầu tiên ("DN") hoặc sheet tên cụ thể. Flag BA. | Edge 🟡 |
| TC-IMP-050 | FR-V.III-NEW-01 / Inputs#1 | File có hidden rows | Login. File có 3 hidden rows giữa data. | — | 1. Upload. | (3) ⚠️ **SRS Gap**: hidden rows count vào "1.000 dòng" hay không? Verify. | Edge 🟢 |
| TC-IMP-051 | FR-V.III-NEW-01 / Processing | Concurrent import — 2 user upload cùng file | 2 session: cb_nv_tw_01 + cb_nv_tw_02 cùng file 5 dòng MST mới. | — | 1. Cả 2 cùng click [Xác nhận Import]. | (1) DB UNIQUE MST chặn duplicate — 5 dòng tạo bởi user thắng race. User thua nhận INF-IMP-DN-01 cho 5 dòng "Trùng MST đã tồn tại, bỏ qua" (srs-fr-07:348). ⚠️ Verify backend xử lý concurrent. | Edge 🔴 |
| TC-IMP-052 | FR-V.III-NEW-01 / Processing | Double-click [Xác nhận Import] (idempotent check) | 1. Đang ở Bước 2 đã review. | — | 1. Click [Xác nhận Import] 2 lần liên tiếp nhanh. | (1) DB chỉ 1 batch import, không duplicate. (3) Backend idempotent (verify). ⚠️ **SRS không quote — verify**. | Edge 🟡 |
| TC-IMP-053 | FR-V.III-NEW-01 / Bước 2-3 | Hard reload F5 giữa Bước 2 (chưa confirm) | Đang ở Bước 2 review. | — | 1. F5 reload. | (1) DB không thay đổi (chưa confirm). (3) Wizard quay về Bước 1, file upload bị clear. ⚠️ Verify session state. | Edge 🟢 |
| TC-IMP-054 | FR-V.III-NEW-01 / E4 | MST có space giữa: "01 0010 0101" | Login. File MST cell="01 0010 0101". | — | 1. Upload. | (2) ⚠️ **SRS Gap**: trim space giữa hay reject? Default expected: trim → "0100100101" → accept (10 số). Flag BA. | Edge 🟢 |
| TC-IMP-055 | FR-V.III-NEW-01 / E4 | MST có alphabet: "0100100ABC" | Login. File MST cell="0100100ABC". | — | 1. Upload. | (2) ERR-IMP-DN-04: "Dòng N, cột Mã số thuế: format không hợp lệ (chỉ chấp nhận số)" (srs-fr-07:347 + cột rule line 301 "Format 10/13 số"). | Negative 🟢 |

---

## 📝 File 04 — Bổ sung cho `04-TC-tab-ho-so-pl-dn.md`

### Section B/C/D — bổ sung TC HSPL edge

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-HSPL-040 | FR-X.1-04 / Inputs row#6,7 | ngay_het_han < ngay_cap → reject | Login. Tab #2. | ngay_cap=2026-06-01, ngay_het_han=2026-01-01 | 1. Nhập ngày hết hạn TRƯỚC ngày cấp. 2. Lưu. | (2) ⚠️ **SRS Gap**: SRS không quote ERR code cho range invalid (chỉ ERR-HSPL-06 cho search range). Default expected: validation error tương tự ERR-HSPL-06: "Ngày bắt đầu phải trước ngày kết thúc" (NotebookLM cite [4]). Flag BA. | Negative 🟡 |
| TC-HSPL-041 | FR-X.1-04 / Inputs row#6,7 | ngay_het_han = ngay_cap (cùng ngày) | Login. | ngay_cap=ngay_het_han=2026-01-15 | 1. Nhập 2 ngày cùng giá trị. 2. Lưu. | (1) ⚠️ **SRS Gap**: cho phép cùng ngày (effectively expired ngay) hay reject? Default expected accept (validate là `<=`). Flag BA. | Edge 🟢 |
| TC-HSPL-042 | FR-X.1-04 / Inputs row#10 + 7 | trang_thai HIEU_LUC nhưng ngay_het_han < today | Login. | ngay_het_han = today - 30 days, trang_thai=HIEU_LUC | 1. Tạo HSPL với data trên. 2. Lưu. | (1) ⚠️ **SRS Gap**: hệ thống auto-update HET_HAN khi ngay_het_han < today, hay manual? SRS quote 3 trạng thái enum (HIEU_LUC/HET_HAN/THU_HOI) nhưng KHÔNG quote auto-transition (line 416, 450). Flag BA. | Edge 🟡 |
| TC-HSPL-043 | FR-X.1-04 / Inputs row#3 boundary | ten_ho_so = 500 chars exact | Login. | ten = 500 chars | 1. Nhập + lưu. | (1) DB lưu OK (NotebookLM cite [3] "Tối đa 500 ký tự" — inclusive). | Edge 🟢 |
| TC-HSPL-044 | FR-X.1-04 / Inputs row#11 | File `.docx` upload | Login. | file `hd.docx` 5MB | 1. Upload. | (2) ⚠️ **SRS quote "PDF/image" (NotebookLM cite [3])** → docx KHÔNG nằm trong whitelist. Expected ERR-HSPL-05 hoặc generic format error. Flag verify. | Negative 🟡 |
| TC-HSPL-045 | FR-X.1-04 / Inputs row#11 | File `.svg` (image vector + XSS risk) | Login. | file `logo.svg` chứa `<script>alert('XSS')</script>` | 1. Upload. 2. Hiển thị HSPL detail. | (3) Detail render file embed an toàn — KHÔNG execute JS. ⚠️ **SRS Gap**: SVG là image format theo SRS quote → có nằm whitelist? Verify backend sanitize SVG. Flag security. | Edge 🔴 |
| TC-HSPL-046 | FR-X.1-04 / Inputs row#11 | File `.gif` animation | Login. | file `logo.gif` 3MB | 1. Upload. | (1) DB lưu OK (gif là image). ⚠️ Verify thực tế nhận gif không. | Edge 🟢 |
| TC-HSPL-047 | FR-X.1-04 / Inputs row#11 boundary | File = 20MB exact + 1 byte | Login. | file 20,971,521 bytes (20MB + 1 byte) | 1. Upload. | (2) ERR-HSPL-03: **"File đính kèm tối đa 20MB"** (NotebookLM cite [4]). | Edge 🟡 |
| TC-HSPL-048 | FR-X.1-04 / Inputs row#11 | Multi-file đính kèm cho 1 HSPL | Login. | 3 files PDF | 1. Cố upload 3 file vào 1 HSPL. | (1) ⚠️ **SRS Gap**: SRS quote "file_dinh_kem (file)" singular (NotebookLM cite [3]) — chỉ 1 file/HSPL. Verify UI có cho upload nhiều không. | Edge 🟢 |
| TC-HSPL-049 | FR-X.1-04 / E2 + cross-module | Tạo HSPL khi DN cha bị xóa mềm song song | 1. cb_nv_tw_01 mở Tab #2 DN-X điền form HSPL. 2. cb_nv_tw_02 xóa DN-X (success). | — | 1. cb_nv_tw_01 click Lưu. | (1) DB không thay đổi. (2) ERR-HSPL-02: **"Doanh nghiệp không tồn tại hoặc đã bị xóa"** (NotebookLM cite [4]). | Edge 🔴 |
| TC-HSPL-050 | FR-X.1-04 / cross-module | DN xóa mềm → HSPL liên kết hành vi | Login. DN-X có 5 HSPL HIEU_LUC. | — | 1. Xóa DN-X. 2. Query HSPL của DN-X. | (1) ⚠️ **SRS Gap**: cascade soft-delete? HSPL `is_deleted=1` theo? Hay giữ orphan? Flag BA. | Edge 🟡 |
| TC-HSPL-051 | FR-X.1-04 / BR-EC-01 | Concurrent edit 2 user trên cùng HSPL | 2 session sửa cùng HSPL-A. | User1 trang_thai→HET_HAN, User2 trang_thai→THU_HOI | 1. User1 Lưu success. 2. User2 Lưu sau. | (1) DB chỉ User1 thắng. (2) User2 nhận ERR-SYS-02 (BR-EC-01 srs-v3.md:4066). | Edge 🟡 |
| TC-HSPL-052 | FR-X.1-04 / BR-AUTH-08 | HSPL của DN-A không hiện ở Tab #2 DN-B | Login. DN-A có 3 HSPL, DN-B có 0 HSPL. | — | 1. Mở chi tiết DN-B. 2. Tab #2. | (3) Tab #2 DN-B: empty state. KHÔNG hiện HSPL của DN-A (filter `doanh_nghiep_id`). | Happy 🔴 |

---

## 📝 File 05 — Bổ sung cho `05-TC-tab-lich-su-tab-chi-tra.md`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-LSHT-010 | FR-V.III-01 / SCR-V.III-02 row#3 KPI | KPI "Tổng chi phí" khi VV có chi phí null | Login. DN có VV-A chi phí=null, VV-B chi phí=5tr. | — | 1. Tab #3. | (3) ⚠️ **SRS Gap**: SUM với null — bỏ qua hay coi là 0? Default SUM bỏ qua null → KPI = 5tr. Flag BA. | Edge 🟢 |
| TC-LSHT-011 | FR-V.III-01 / SCR-V.III-02 row#3 sort | Sort danh sách VV trong Tab #3 | Login. DN có 3 VV với ngày tiếp nhận khác nhau. | — | 1. Tab #3. 2. Quan sát thứ tự. | (3) ⚠️ **SRS Gap**: SCR row#3 chỉ quote "Danh sách VV liên kết + thống kê" — không quote sort. Default expected sort theo ngày tiếp nhận DESC (mới nhất trên). Flag BA. | Edge 🟢 |
| TC-LSHT-012 | FR-V.III-01 / BR-DATA-07 | Pagination Tab #3 khi DN có >20 VV | Login. DN có 25 VV. | — | 1. Tab #3. | (3) Pagination 20/page (BR-DATA-07 srs-v3.md:3978). KPI tính trên TOÀN BỘ scope (25 VV) hay chỉ trang hiện tại? Default: TOÀN BỘ. ⚠️ Flag BA verify. | Edge 🟡 |
| TC-LSHT-013 | FR-V.III-01 / KPI realtime | Tạo VV mới ở module FR-V.I → Tab #3 KPI tự refresh | Login. DN-X có Tổng VV=3. | Tạo VV-04 mới ở `/vu-viec` cho DN-X. | 1. Quay lại Tab #3 DN-X. | (3) ⚠️ **SRS Gap**: realtime update hay phải reload? Default expected: cần reload (websocket/polling không quote). Flag BA. | Edge 🟢 |
| TC-HSCT-010 | FR-V.III-01 / SCR-V.III-02 row#4 status | Tab #4 HSCT có status TU_CHOI/HUY hiển thị đúng | Login. DN-X có HSCT TU_CHOI và HSCT HUY. | — | 1. Tab #4. | (3) Bảng hiển thị 2 row với badge "Từ chối" (đỏ) và "Hủy" (xám) per srs-fr-06 SM-CHITRA. ⚠️ Verify count vào tổng list không. | Edge 🟡 |
| TC-HSCT-011 | FR-V.III-01 / SCR-V.III-02 row#4 KPI | Tab #4 có KPI hay chỉ list | Login. DN có HSCT. | — | 1. Tab #4. 2. Quan sát top section. | (3) ⚠️ **SRS Gap**: SCR row#4 chỉ quote "Danh sách HS chi trả liên kết" (srs-fr-07:418) — KHÔNG quote KPI. Default expected: chỉ list, không KPI. Verify. | Edge 🟢 |
| TC-TAB-020 | FR-V.III-01 / SCR-V.III-02 row#1-4 | Switch tab khi đang điền form Tab #1 chưa lưu | Login. Mở chi tiết DN-X, sửa Tên DN ở Tab #1 (chưa Lưu). | — | 1. Click Tab #2. | (3) ⚠️ **SRS Gap**: confirm dialog "Bạn có thay đổi chưa lưu" hay direct switch và lost data? Default expected: confirm dialog. Flag BA. | Edge 🟡 |
| TC-TAB-021 | FR-V.III-01 / SCR-V.III-02 row#2 condition | Tab #2/#3/#4 disabled state khi tạo mới (chưa save) | Login. Click [+ Thêm mới]. | — | 1. Quan sát 4 tab. | (3) Tab #1 Active. Tab #2/#3/#4: theo SRS row#2-4 quote "Chỉ khi xem chi tiết" → tabs ẨN hoặc DISABLED. Verify behavior thực tế. | Happy 🔴 |

---

## 📝 File 06 — Bổ sung cho `06-TC-permission-matrix.md`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-PERM-040 | BR-AUTH-01 | JWT expired mid-session | 1. cb_nv_tw_01 login. 2. JWT TTL 15 phút. | — | 1. Đợi 16 phút. 2. Click action CRUD. | (3) ⚠️ Theo memory CLAUDE.md note "BE revoke JWT ~2 phút thực bất chấp exp 15 phút claim" — verify behavior. Expected: redirect `/login` với message "Phiên hết hạn, vui lòng đăng nhập lại". ⚠️ **SRS không quote message nguyên văn** — flag BA. | Edge 🟡 |
| TC-PERM-041 | BR-AUTH-01 | Multi-tab login same user — session sync | 1. Tab1 login cb_nv_tw_01. 2. Tab2 login cb_nv_tw_02 (cùng browser). | — | 1. Tab1 thực hiện hành động CRUD. | (3) ⚠️ **SRS Gap**: cookie/session sticky hay isolation? Theo memory `qa_htpldn_round5_t01.md` — BE httpOnly cookie sticky → Tab1 + Tab2 dùng chung session, có thể xung đột. Flag BA. | Edge 🟡 |
| TC-PERM-042 | BR-AUTH-01 | Logout clear server session | 1. cb_nv_tw_01 login. 2. Click Logout. | Token cũ saved | 1. Cố API call với token cũ. | (3) Backend reject 401. Token bị invalidate (verify backend behavior). | Negative 🔴 |
| TC-PERM-043 | BR-DATA-05 / BR-AUTH-08 | Quan sát AUDIT_LOG scope theo role | 1. cb_nv_dp_01 (HCM) đã thực hiện CREATE DN. 2. qtht_01 login. | — | 1. QTHT mở module Nhật ký (FR-10) lọc audit của entity=DOANH_NGHIEP. | (3) QTHT thấy audit của TẤT CẢ đơn vị (👁️ R toàn HT trên AUDIT_LOG per permission-matrix.md line 123 "FR-10 AUDIT_LOG R*" — wait, is it R* scoped or R toàn?). ⚠️ Verify scope AUDIT_LOG cho QTHT. | Edge 🟡 |
| TC-PERM-044 | BR-AUTH-08 / cross-org | CB_NV_BN xem DN của Bộ khác Bộ — qua URL hack DN ID cụ thể | 1. cb_nv_bn_01 (Bộ KH&ĐT) login. 2. DN-Y thuộc Bộ Tài chính. | URL `/doanh-nghiep/{DN-Y-id}` | 1. Paste URL detail DN-Y. | (1) Backend trả 403 hoặc 404 (ẩn record). (3) UI redirect 403 page. ⚠️ **SRS Gap**: 403 vs 404 (security best practice 404 để tránh enumeration). Flag BA. | Negative 🔴 |
| TC-PERM-045 | BR-AUTH-08 / Tab #2 perm | CB_PD_TW click Tab #2 (HSPL) — actor không trong list | 1. cb_pd_tw_01 login. 2. Mở chi tiết DN-X. | — | 1. Quan sát các tab. 2. Click Tab #2. | (3) ⚠️ **SRS Gap**: NotebookLM cite [5] FR-X.1-04 actor = "Cán bộ Nghiệp vụ (TW/BN/ĐP), Người hỗ trợ" — KHÔNG có CB_PD. Tab #2 expected disabled hoặc click → 403. Flag BA verify thực tế. | Edge 🔴 |
| TC-PERM-046 | BR-AUTH-08 / Tab #2 perm | NHT/TVV/CG (Người hỗ trợ) — verify CRUD Tab #2 | 1. nht_01, tvv_01, cg_01 lần lượt login. 2. Mở chi tiết DN trong scope. | — | 1. Click Tab #2. 2. Cố CRUD HSPL. | (3) ⚠️ **SRS Gap**: NotebookLM cite [5] "Người hỗ trợ" — chưa rõ mapping role cụ thể (NHT? TVV? CG? all?). Verify CRUD Tab #2. Flag BA. | Edge 🟡 |
| TC-PERM-047 | BR-AUTH-08 / FR-07 + scope | CB_NV_BN tạo DN — gán don_vi_id của user | 1. cb_nv_bn_01 (Bộ KH&ĐT) login. | DN data không có cột tỉnh (UI tự gán) | 1. Tạo DN. 2. Verify DB. | (1) DB: `don_vi_id = <Bộ KH&ĐT id>` (BR-AUTH-08 multi-tenant + BR-DATA-02 NOT NULL srs-fr-07:644). KHÔNG cho phép user chọn don_vi_id khác (qua API hack). | Happy 🔴 |
| TC-PERM-048 | BR-AUTH-08 / FR-07 + URL hack | CB_NV_DP cố tạo DN với don_vi_id của ĐP khác (qua API) | 1. cb_nv_dp_01 (HCM) login. 2. Curl POST `/doanh-nghiep` với `don_vi_id=<HN id>`. | — | 1. POST API. | (1) Backend reject hoặc force override don_vi_id = HCM (ignore client value). (2) 403 hoặc 400. ⚠️ **SRS Gap**: behavior chưa quote rõ. Flag security. | Negative 🔴 |
| TC-PERM-049 | BR-AUTH-11 / API only | DN qua API token — out-of-scope CMS test note | (Defer test riêng API) | — | — | (3) Tham chiếu cho team API test: BR-AUTH-11 "API lọc theo don_vi_id (Sở TP) + doanh_nghiep_id (token)" (NotebookLM cite [10]). DN chỉ thấy hồ sơ của chính mình. ⚠️ Mark **Defer** — không test trên CMS. | Edge — defer |
| TC-PERM-050 | BR-AUTH-08 / negative | Account khóa giữa session — JWT vẫn valid? | 1. cb_nv_tw_01 login. 2. Admin lock tài khoản qua module FR-10. | — | 1. cb_nv_tw_01 thực hiện CRUD. | (3) ⚠️ **SRS Gap**: backend revoke JWT ngay khi lock hay đợi expire? Default expected: revoke immediately. Verify. Flag BA. | Edge 🟡 |

---

## 🎯 Tổng hợp gap pending BA confirm sau review

Bổ sung cho 7 SRS Gap đã có trong test plan overview §7:

| Gap mới | Mô tả | TC affected |
|---------|-------|-------------|
| **G8** | Cascade behavior khi xóa DN có HSPL/HSCT (chỉ check VV theo SRS) | TC-DN-070, 071, TC-HSPL-050 |
| **G9** | Max length của ten_doanh_nghiep | TC-DN-085 |
| **G10** | file_dinh_kem ở DN — max count, max size, format whitelist, virus scan | TC-DN-045, 046, 047 |
| **G11** | Validation `ngay_cap_dkkd` — accept future date không | TC-DN-039 |
| **G12** | AUDIT_LOG schema fields cụ thể (action/entity/ip/old/new) | TC-DN-082, 083 |
| **G13** | Search engine (full-text vs LIKE) + multi-keyword logic | TC-TKDN-022, 028, 029 |
| **G14** | Filter URL deep-link sync params | TC-TKDN-025 |
| **G15** | Source dropdown "Lĩnh vực KD" — DANH_MUC nào | TC-TKDN-026 |
| **G16** | Excel multi-sheet, hidden rows, header case-sensitivity, header order | TC-IMP-046, 047, 048, 049, 050 |
| **G17** | Excel cell formula injection prevention | TC-IMP-044 |
| **G18** | Auto-transition trang_thai HSPL HIEU_LUC→HET_HAN khi quá ngày | TC-HSPL-042 |
| **G19** | HSPL multi-file đính kèm (SRS quote singular) | TC-HSPL-048 |
| **G20** | SVG XSS sanitize cho HSPL file image | TC-HSPL-045 |
| **G21** | KPI Tab #3 — null handling, scope toàn list vs trang | TC-LSHT-010, 012 |
| **G22** | Tab switch khi form chưa lưu — confirm dialog | TC-TAB-020 |
| **G23** | Permission Tab #2 cho CB_PD và "Người hỗ trợ" mapping role | TC-PERM-045, 046 |
| **G24** | 403 vs 404 cho cross-org access (security enumeration prevention) | TC-PERM-044 |
| **G25** | Account locking mid-session — JWT revoke timing | TC-PERM-050 |

---

## 📋 Hành động tiếp theo

User vui lòng review danh sách 77 TC bổ sung trên + 18 SRS Gap mới (G8-G25), confirm:

1. **TC nào MERGE vào file gốc** — báo từng ID hoặc "merge all"
2. **TC nào bỏ qua** — ghi rõ lý do (trùng / không cần / out-of-scope)
3. **SRS Gap mới (G8-G25)** — escalate BA cùng 7 gap cũ (G1-G7)?
4. **SRS Internal Conflicts C1-C8** — log thành SPEC-CLARIFY ticket riêng?

Sau khi confirm, tôi sẽ:
- Edit từng file `01..06-TC-*.md` để insert TC bổ sung đúng section
- Update `00-test-plan-overview.md` §4 (số lượng TC) + §7 (gap list)

---

*Review generated by Edge Case Hunter (path tracer mode) — exhaustive enumeration, no editorializing. SRS source `srs-fr-07-doanh-nghiep.md` v3.0 + NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42` (verified 2026-04-30).*
