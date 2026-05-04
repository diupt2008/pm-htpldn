# Test Cases — UC41: Đăng ký tham gia mạng lưới (FR-IV-03)

> **SRS Ref**: FR-IV-03, SCR-IV-02 (chuyên trang / Cổng PLQG), Entity TU_VAN_VIEN
> **Nguồn**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **Ngày tạo**: 2026-05-01
> **Note**: UC này chạy trên **Cổng PLQG / chuyên trang** (URL khác app nội bộ — chờ SPEC-CLARIFY-CG-02 confirm route).

---

## A. UI FIELD VERIFICATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-UI-04 | FR-IV-03 / SCR-IV-02 / UI | Verify form đăng ký NHT trên Cổng PLQG | NHT (nht_01) đã có tài khoản và đăng nhập Cổng PLQG. NHT chưa có hồ sơ TVV. | URL Cổng PLQG (SPEC-CLARIFY-CG-02) | 1. NHT đăng nhập Cổng PLQG. 2. Vào trang "Đăng ký tham gia mạng lưới". 3. Kiểm tra form. | **LAYOUT**: Form 12 field (NLM cite [12]). **FIELDS**: ho_ten *, cmnd_cccd * (max 12 unique), email * (RFC 5322), so_dien_thoai * (10-11 số), dia_chi *, trinh_do *, chuyen_nganh *, kinh_nghiem * (textarea long), linh_vuc_ids * (multi-select), to_chuc_id (single-select không bắt buộc), file_bang_cap * (multi-file PDF max 10MB), file_the_hanh_nghe (single PDF max 10MB không bắt buộc). **NEGATIVE — Phần tử KHÔNG có**: KHÔNG có field "loai_tvv" (mặc định = NHT khi đăng ký qua UC41). KHÔNG có field "trạng thái" (auto-set MOI_DANG_KY). KHÔNG có ảnh chân dung (NLM cite [12] chỉ liệt kê 12 field; SPEC-CLARIFY-CG-14 nếu UI có thêm). | Happy 🔴 |

---

## B. ĐĂNG KÝ THÀNH CÔNG

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-201 | FR-IV-03 / BR-SM-TVV / NLM cite [3] Outputs | NHT đăng ký mạng lưới thành công — Output 4 fields nguyên văn | NHT đăng nhập Cổng PLQG. NHT chưa có hồ sơ. Lĩnh vực DAN_SU + Tổ chức TC-001 tồn tại. | ho_ten="Lê Văn C", cmnd_cccd="987654321012", email="c@example.com", sdt="0912345678", dia_chi="Đà Nẵng", trinh_do="Cử nhân Luật", chuyen_nganh="Pháp lý dân sự", kinh_nghiem="5 năm tư vấn doanh nghiệp", linh_vuc_ids=[DAN_SU], to_chuc_id=TC-001, file_bang_cap=cv.pdf (3MB) | 1. Form đăng ký. 2. Điền đủ 11 trường + upload bằng cấp 1 file PDF 3MB. 3. Click [Đăng ký]. | **STATE**: INSERT TU_VAN_VIEN với loai_tvv='NHT' (NLM cite [13] processing step 4 — auto-set MOI_DANG_KY), don_vi_id=NHT.don_vi_id, ho_ten='Lê Văn C', cccd='987654321012'. INSERT HO_SO_TU_VAN_VIEN linked. INSERT TVV_LINH_VUC. INSERT FILE_DINH_KEM. AUDIT_LOG hanh_dong='CREATE' (BR-DATA-05 NLM cite [13] step 6). Notify CB NV cùng đơn vị (NLM cite [13] step 5). **UI**: Toast NGUYÊN VĂN cite [3] Output field 4 = "**Đăng ký thành công, chờ thẩm định**" (SPEC-CLARIFY-CG-15 đã đóng — đây là nguyên văn). Redirect trang "Hồ sơ của tôi". Response API có **4 fields**: `ma_tvv` (TVV-{CODE}-{SEQ} auto-gen), `trang_thai='MOI_DANG_KY'`, `ngay_dang_ky` (dd/mm/yyyy HH:mm), `thong_bao="Đăng ký thành công, chờ thẩm định"`. **PERSIST**: NHT vào trang "Hồ sơ của tôi" → thấy hồ sơ trạng thái "Mới đăng ký". CB NV TW vào SCR-IV-01 tab "Mới đăng ký" → thấy record + badge tăng +1. | Happy 🔴 |
| TC-CG-202 | FR-IV-03 / BR-SM-TVV | Đăng ký với 2 file bằng cấp đa file PDF | NHT chưa có hồ sơ. | file_bang_cap=[bc1.pdf 5MB, bc2.pdf 8MB] | 1. Đăng ký. 2. Upload 2 file PDF. 3. Submit. | **STATE**: INSERT TU_VAN_VIEN + HO_SO + 2 row FILE_DINH_KEM. **UI**: Danh sách file hiển thị 2 mục (tên + size + nút xóa/xem). **PERSIST**: Detail TVV → tab Hồ sơ → 2 file download được. | Happy |
| TC-CG-203 | FR-IV-03 / BR-FILE-03 | Đăng ký kèm thẻ hành nghề (optional) | NHT chưa có hồ sơ. | file_the_hanh_nghe=the.pdf (5MB) | 1. Đăng ký với cả file_bang_cap + file_the_hanh_nghe. | **STATE**: INSERT thêm row FILE_DINH_KEM cho thẻ. **UI**: Danh sách file hiển thị thẻ riêng. **PERSIST**: — | Happy |

---

## C. NEGATIVE: VALIDATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-204 | ERR-DK-01 | NHT đã có hồ sơ chờ xử lý — không cho đăng ký lại | NHT (nht_01) đã có 1 TVV trạng thái MOI_DANG_KY trước đó. | — | 1. NHT vào trang đăng ký. 2. Cố submit form. | **STATE**: BE check (NLM cite [13] step 1) → KHÔNG INSERT. **UI**: Toast "**Bạn đã có hồ sơ đang chờ xử lý**" (NLM cite [12] ERR-DK-01). Form disable nút submit. **PERSIST**: Count TVV của NHT vẫn = 1. | Negative 🔴 |
| TC-CG-205 | ERR-DK-03 | NHT đăng ký không upload bằng cấp | NHT chưa có hồ sơ. | file_bang_cap = (trống) | 1. Form. 2. Bỏ trống file bằng cấp. 3. Submit. | **STATE**: KHÔNG INSERT. **UI**: Inline error "**Bằng cấp/chứng chỉ là bắt buộc**" (NLM cite [12] ERR-DK-03). **PERSIST**: Count = 0. | Negative 🔴 |
| TC-CG-206 | ERR-DK-02 | NHT upload file bằng cấp > 10MB | NHT chưa có hồ sơ. | file_bang_cap=cv.pdf (12MB) | 1. Form. 2. Upload PDF 12MB. | **STATE**: Reject upload, không INSERT. **UI**: "**File tải lên tối đa 10MB**" (NLM cite [12] ERR-DK-02). **PERSIST**: — | Negative |
| TC-CG-207 | ERR-DK-02 | NHT upload non-PDF (jpg/docx) cho file bằng cấp | NHT chưa có hồ sơ. | file_bang_cap=cv.docx | 1. Form. 2. Cố upload file .docx. | **STATE**: Reject. **UI**: Error "Chỉ chấp nhận file PDF" (SRS Gap nguyên văn). **PERSIST**: — | Negative |
| TC-CG-208 | FR-IV-03 / BR-TVV-03 | NHT đăng ký với CCCD trùng TVV đã có | NHT chưa có hồ sơ. TVV "TVV-TW-001" có cccd="987654321012". | cmnd_cccd="987654321012" | 1. Form. 2. Nhập cccd trùng. 3. Submit. | **STATE**: BE check unique (NLM cite [13] step 3) → KHÔNG INSERT. **UI**: Toast "**Số CMND/CCCD đã tồn tại**" (NLM cite [22] ERR-TVV-02 reused). **PERSIST**: — | Negative 🔴 |
| TC-CG-209 | ERR-CN-01 | Email sai format khi đăng ký | NHT chưa có hồ sơ. | email = "abc" | 1. Form. 2. Email = "abc". 3. Submit. | **STATE**: KHÔNG INSERT. **UI**: Inline "**Định dạng email không hợp lệ**" (NLM cite [27] ERR-CN-01). **PERSIST**: — | Negative |

---

## D. EDGE & SECURITY

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-210 | BR-EC-03 | Upload file PDF chứa virus → ClamAV reject | NHT chưa có hồ sơ. | file_bang_cap=eicar.pdf (test virus pattern) | 1. Form. 2. Upload file có pattern EICAR. 3. Submit. | **STATE**: ClamAV scan trigger → reject. KHÔNG INSERT. **UI**: Error "File chứa mã độc hoặc không an toàn" (SRS Gap message — BR-EC-03 NLM cite [21]). **PERSIST**: Không có file lưu storage. | Edge 🔴 |
| TC-CG-211 | FR-IV-03 / BR-TVV-04 | Đăng ký với to_chuc_id không tồn tại | NHT chưa có hồ sơ. | to_chuc_id="TC-INVALID-999" | 1. API direct POST với to_chuc_id giả. | **STATE**: BE FK check fail → KHÔNG INSERT. **UI**: HTTP 422 hoặc toast "**Tổ chức tư vấn không tồn tại**" (NLM cite [22] ERR-TVV-04). **PERSIST**: — | Negative |
| TC-CG-212 | FR-IV-03 | Đăng ký không kèm tổ chức (to_chuc_id optional) | NHT chưa có hồ sơ. | to_chuc_id = null | 1. Form. 2. Bỏ trống Tổ chức. 3. Submit. | **STATE**: INSERT thành công với to_chuc_chinh_id=NULL (NLM cite [12] field 10 = N). **UI**: Toast OK. **PERSIST**: Detail TVV → Tab Hồ sơ → Tổ chức = "—". | Edge |

---

## E. EDGE BỔ SUNG (Edge Case Hunter Review 2026-05-01)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-213 | FR-IV-03 / BR-EC-04 / NLM cite [5] | NHT đăng ký kèm bằng cấp khi đơn vị đã đạt 100% storage quota | NHT chưa có hồ sơ. Đơn vị NHT đã dùng 10GB/10GB (cite [5] BR-EC-04 default 10GB). | file_bang_cap=cv.pdf (5MB) | 1. Đăng ký, upload. | **STATE**: BE check storage trước upload (cite [5] BR-EC-04 nguyên văn: "Mỗi đơn vị có hạn mức lưu trữ (mặc định 10GB). 90% → cảnh báo. 100% → từ chối **ERR-FILE-01**"). KHÔNG INSERT. **UI**: Error code "ERR-FILE-01" (message chính xác **SRS Gap**). **PERSIST**: NHT đăng ký fail. | Edge 🟡 |
| TC-CG-214 | FR-IV-03 / BR-EC-03 / NLM cite [5] | Upload file nhiễm virus → từ chối ERR-FILE-02 (chính xác mã) | NHT chưa có hồ sơ. | file_bang_cap=eicar_test.pdf | 1. Đăng ký, upload EICAR test pattern. | **STATE**: BE quét antivirus (cite [5] BR-EC-03 nguyên văn: "Tất cả file upload SHALL quét antivirus trước lưu trữ. Nhiễm → từ chối **ERR-FILE-02**"). KHÔNG INSERT. **UI**: Error code **ERR-FILE-02** (KHÔNG phải ERR-DK-02 như TC-CG-210). Message chính xác **SRS Gap**. **PERSIST**: File không lưu storage. | Edge 🔴 |
| TC-CG-215 | FR-IV-03 / NLM cite [17] | NHT chưa đăng nhập cố mở form đăng ký | NHT chưa login. | URL direct trang đăng ký | 1. Mở URL không login. | **STATE**: BE/FE precondition fail (cite [17] nguyên văn: "**NHT đã đăng nhập trên chuyên trang**"). **UI**: Redirect login page. **PERSIST**: — | Edge 🟢 |
| TC-CG-216 | FR-IV-03 / NLM cite [17] field 11 | Upload file binary[] rỗng (0 bytes) | NHT chưa có hồ sơ. | file_bang_cap=empty.pdf (0 bytes) | 1. Form. 2. Upload file rỗng. | **STATE**: BE behavior **SRS Gap** (cite [17] field 11 chỉ quote "PDF, max 10MB/file" không quote min size). Có thể: (a) reject; (b) accept với 0 bytes. **UI**: Tùy app. **PERSIST**: Mark SPEC-CLARIFY-CG-39 cho min size rule. | Edge 🟡 |
| TC-CG-217 | FR-IV-03 / NLM cite [3] Outputs | Verify Output FR-IV-03 — Response API có 4 fields nguyên văn | NHT đăng ký thành công. | Same TC-CG-201 | 1. Submit form đăng ký. 2. Inspect API response JSON. | **STATE**: Response chứa **4 fields** theo cite [3] Output: (1) `ma_tvv` text format "TVV-{CODE}-{SEQ} (auto-gen)"; (2) `trang_thai` = `"MOI_DANG_KY"`; (3) `ngay_dang_ky` datetime format "dd/mm/yyyy HH:mm"; (4) `thong_bao` = `"Đăng ký thành công, chờ thẩm định"` (NGUYÊN VĂN). **UI**: Toast hiển thị `thong_bao` field. **PERSIST**: NHT trang "Hồ sơ của tôi" hiển thị mã TVV vừa cấp. | Edge 🟡 |
| TC-CG-218 | FR-IV-03 / NLM cite [12] field 12 | NHT đăng ký với chỉ field bắt buộc (skip optional to_chuc_id, file_the_hanh_nghe) | NHT chưa có hồ sơ. | Skip to_chuc_id=null + file_the_hanh_nghe=null | 1. Form đăng ký với chỉ 11 field bắt buộc. | **STATE**: INSERT thành công với to_chuc_chinh_id=NULL, không có FILE_DINH_KEM cho thẻ hành nghề. **UI**: Toast OK. **PERSIST**: Detail hiển thị Tổ chức: "—", thẻ hành nghề: empty. | Edge 🟢 |
