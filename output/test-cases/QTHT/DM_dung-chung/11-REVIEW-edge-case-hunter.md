# 🔍 Edge Case Hunter Review — FR-VIII Danh Mục Dùng Chung

> **Reviewer**: Edge Case Hunter (bmad-review-edge-case-hunter)  
> **Ngày review**: 2026-04-17  
> **Scope**: Toàn bộ 10 file TC trong `QTHT_DMDC/`  
> **Nguồn xác minh**: NotebookLM Session `a0fdcb5c` (câu hỏi #8 và #9)  
> **Nguyên tắc**: KHÔNG suy diễn. Mọi edge case đều được trích từ SRS qua NotebookLM.

---

## HƯỚNG DẪN SỬ DỤNG

Mỗi edge case bên dưới được **gắn với file TC cụ thể** mà nó thiếu. User review và quyết định bổ sung vào file nào.

**Quy ước**:
- ✅ = Edge case đã có trong TC hiện tại → SKIP
- ❌ = Edge case THIẾU → **ĐỀ XUẤT BỔ SUNG** (kèm test case mẫu)

---

## FILE: `01-TC-TPL-CRUD-chung.md`

### ❌ EC-01: Tạo mã trùng với bản ghi đã xóa mềm (is_deleted=1)

**Nguồn SRS**: TPL-DM-CRUD Processing Thêm mới, Entity DANH_MUC — `ma` ràng buộc "UNIQUE per loai_danh_muc" (KHÔNG có mệnh đề WHERE is_deleted = 0)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CRUD-E01 | TPL-DM-CRUD / ERR-DM-01 | Thêm mới mã trùng với bản ghi đã XÓA MỀM → lỗi ERR-DM-01 | 1. User QTHT đã đăng nhập. 2. Bản ghi mã "OLD_CODE" đã bị xóa mềm (is_deleted=1) trong loai_danh_muc = LINH_VUC_PL. | Mã: "OLD_CODE", Tên: "Mã cũ tái sử dụng" | 1. Tại tab Lĩnh vực pháp lý, click [+ Thêm mới]. 2. Nhập Mã = "OLD_CODE" (trùng bản ghi đã xóa mềm). 3. Click [Lưu]. | 1. Hệ thống từ chối lưu. 2. Lỗi ERR-DM-01: "Mã 'OLD_CODE' đã tồn tại trong danh mục LINH_VUC_PL". 3. Unique constraint tính cả bản ghi is_deleted=1 (SRS KHÔNG có ngoại trừ bản ghi đã xóa). | Edge |

### ❌ EC-02: Toggle trạng thái trực tiếp trên danh sách (không qua modal)

**Nguồn SRS**: SCR-VIII-01 — Cột Trạng thái (toggle), hành vi: "toggle → cập nhật"

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CRUD-E02 | SCR-VIII-01 | Toggle trạng thái trực tiếp trên bảng danh sách → cập nhật luôn | 1. User QTHT đã đăng nhập. 2. Bản ghi "THUE" có trang_thai = 1 (Hoạt động). | Bản ghi "THUE", trạng thái hiện tại = Hoạt động | 1. Tại bảng danh sách, click toggle Trạng thái trên bản ghi "THUE". 2. KHÔNG mở modal sửa. | 1. Hệ thống cập nhật LUÔN trang_thai = 0 (theo SRS: "toggle → cập nhật", không cần confirm). 2. AUDIT_LOG ghi hanh_dong = 'UPDATE', du_lieu_cu (trang_thai=1) → du_lieu_moi (trang_thai=0). 3. KHÔNG kiểm tra tham chiếu (chỉ kiểm tra khi XÓA). | Edge |

### ❌ EC-03: Tìm kiếm với ký tự đặc biệt nguy hiểm (SQL wildcard, XSS)

**Nguồn SRS**: EC-DATA-SEARCH — "loại bỏ ký tự đặc biệt nguy hiểm"; BR-EC-13 — "escape ký tự đặc biệt truy vấn"; EC-SEC-06a — chống SQL Injection + XSS

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CRUD-E03 | EC-DATA-SEARCH / BR-EC-13 | Tìm kiếm chứa ký tự SQL wildcard (%, _, ') | 1. User QTHT đã đăng nhập. | Từ khóa: "test%' OR 1=1--" | 1. Nhập "test%' OR 1=1--" vào ô tìm kiếm. 2. Nhấn Enter. | 1. Hệ thống escape ký tự đặc biệt truy vấn (BR-EC-13). 2. Sử dụng parameterized statements (EC-SEC-06a: "KHÔNG BAO GIỜ nối chuỗi user input vào SQL"). 3. Trả kết quả tìm kiếm bình thường (rỗng hoặc khớp literal). 4. KHÔNG bị SQL injection. | Edge |
| TC-CRUD-E04 | EC-DATA-SEARCH / EC-SEC-06a | Tìm kiếm chứa XSS script tag | 1. User QTHT đã đăng nhập. | Từ khóa: `<script>alert(1)</script>` | 1. Nhập `<script>alert(1)</script>` vào ô tìm kiếm. 2. Nhấn Enter. | 1. Hệ thống loại bỏ/escape ký tự nguy hiểm. 2. CSP header chặn inline script (EC-SEC-06a: "CSP: script-src 'self'"). 3. Không thực thi JS. | Edge |

### ❌ EC-04: Tìm kiếm vượt giới hạn 200 ký tự

**Nguồn SRS**: EC-DATA-SEARCH — "giới hạn 200 ký tự"

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CRUD-E05 | EC-DATA-SEARCH | Tìm kiếm với từ khóa vượt 200 ký tự → cắt giới hạn | 1. User QTHT đã đăng nhập. | Từ khóa: chuỗi 250 ký tự "A" lặp lại | 1. Nhập chuỗi 250 ký tự vào ô tìm kiếm. 2. Nhấn Enter. | 1. Hệ thống cắt từ khóa còn 200 ký tự (EC-DATA-SEARCH: "giới hạn 200 ký tự"). 2. Trả kết quả tìm kiếm dựa trên 200 ký tự đầu. | Edge |

### ❌ EC-05: Danh mục bị vô hiệu hóa → bản ghi nghiệp vụ mới không được tham chiếu

**Nguồn SRS**: ERR-TVCS-API-05 — "Lĩnh vực pháp lý không hợp lệ hoặc đã ngừng hoạt động"; SCR-II-03 — "Validation: trang_thai = HOAT_DONG"

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CRUD-E06 | TPL-DM-CRUD / ERR-TVCS-API-05 | Bản ghi nghiệp vụ mới cố tham chiếu danh mục đã vô hiệu hóa → chặn | 1. QTHT đã vô hiệu hóa danh mục "Thuế" (trang_thai=0). 2. User CB_NV tạo hồ sơ mới. | Lĩnh vực PL chọn: "Thuế" (đã ngừng hoạt động) | 1. Đăng nhập CB_NV. 2. Tạo hồ sơ/vụ việc mới. 3. Chọn lĩnh vực PL = "Thuế" (đã vô hiệu hóa). | 1. Hệ thống chặn: "Lĩnh vực pháp lý không hợp lệ hoặc đã ngừng hoạt động". 2. Dropdown KHÔNG hiển thị danh mục có trang_thai=0 (Validation: trang_thai = HOAT_DONG). | Edge |

---

## FILE: `04-TC-co-quan-don-vi.md`

### ❌ EC-06: Xóa đơn vị CHA → cascade xóa mềm đơn vị CON

**Nguồn SRS**: BR-EC-02 (Soft-delete Cascade) — "Khi soft-delete bản ghi cha, ứng dụng SHALL cascade soft-delete bản ghi con. Khi restore → restore con"

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CQDV-E01 | FR-VIII-05 / BR-EC-02 | Xóa đơn vị cha → cascade soft-delete đơn vị con | 1. User QTHT đã đăng nhập. 2. Cấu trúc: TW "A" → BN "B" → ĐP "C". 3. Đơn vị "A" KHÔNG có tài khoản/dữ liệu nghiệp vụ liên kết trực tiếp. Các con "B", "C" cũng không có liên kết. | Xóa "A" (TW) — có 2 con "B" (BN) và "C" (ĐP) | 1. Click [Xóa] trên đơn vị "A". 2. Xác nhận xóa. | 1. Đơn vị "A" bị xóa mềm (is_deleted=1). 2. Đơn vị con "B" và "C" CŨNG bị cascade soft-delete (is_deleted=1). 3. BR-EC-02: "Khi soft-delete bản ghi cha, ứng dụng SHALL cascade soft-delete bản ghi con". 4. Cả "A", "B", "C" biến mất khỏi Tree View. | Edge |
| TC-CQDV-E02 | FR-VIII-05 / BR-EC-02 | Xóa đơn vị cha có con đang tham chiếu → cascade bị chặn? | 1. Cấu trúc: TW "A" → BN "B". 2. "B" đang có 10 tài khoản liên kết. 3. "A" không có liên kết trực tiếp. | Xóa "A" — con "B" đang bị tham chiếu | 1. Click [Xóa] trên "A". 2. Xác nhận. | 1. Hệ thống kiểm tra cascade: con "B" đang tham chiếu. 2. Chặn xóa "A" vì cascade sẽ ảnh hưởng "B" đang có liên kết → ERR-DM-03. 3. Ghi nhận: SRS quy định cascade VÀ kiểm tra tham chiếu — xung đột tiềm năng cần verify thực tế. | Edge |

### ❌ EC-07: Mã đơn vị unique TOÀN CỤC (khác DANH_MUC)

**Nguồn SRS**: Entity DON_VI — `ma_don_vi` ràng buộc "UNIQUE" (toàn cục), mô tả "Mã cơ quan (duy nhất)"

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CQDV-E03 | FR-VIII-05 / Entity DON_VI | Mã đơn vị trùng toàn cục → lỗi (khác scope DANH_MUC) | 1. User QTHT đã đăng nhập. 2. Đã tồn tại đơn vị TW mã "BTP_001". | Thêm đơn vị BN mới mã "BTP_001" (trùng) | 1. Thêm đơn vị mới cấp BN, mã = "BTP_001". 2. Click [Lưu]. | 1. Hệ thống từ chối: mã "BTP_001" đã tồn tại. 2. Unique constraint DON_VI.ma_don_vi là TOÀN CỤC (SRS: "UNIQUE", "Mã cơ quan duy nhất") — khác với DANH_MUC là "UNIQUE per loai_danh_muc". | Edge |

---

## FILE: `08-TC-tieu-chi-danh-gia-hieu-qua.md`

### ❌ EC-08: Validate thang_diem_max > thang_diem_min

**Nguồn SRS**: FR-VIII-11 Input — `thang_diem_max` ràng buộc: "phải > thang_diem_min"

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TCDG-E01 | FR-VIII-11 / UC109 | thang_diem_max ≤ thang_diem_min → lỗi | 1. User QTHT đã đăng nhập. | thang_diem_min: 10, thang_diem_max: 5 | 1. Click [+ Thêm mới]. 2. Nhập thang_diem_min=10, thang_diem_max=5. 3. Click [Lưu]. | 1. Hệ thống từ chối: ràng buộc "thang_diem_max phải > thang_diem_min" (SRS FR-VIII-11 Input). | Negative |
| TC-TCDG-E02 | FR-VIII-11 / UC109 | thang_diem_max = thang_diem_min (bằng nhau) → lỗi | 1. User QTHT đã đăng nhập. | thang_diem_min: 5, thang_diem_max: 5 | 1. Click [+ Thêm mới]. 2. Nhập thang_diem_min=5, thang_diem_max=5. 3. Click [Lưu]. | 1. Hệ thống từ chối: ràng buộc "phải >" (strict greater than, không phải >=). 2. thang_diem_max = thang_diem_min vi phạm. | Edge |
| TC-TCDG-E03 | FR-VIII-11 / UC109 | Thiếu thang_diem_min hoặc thang_diem_max → lỗi (bắt buộc Y) | 1. User QTHT đã đăng nhập. | thang_diem_min: (trống), thang_diem_max: 10 | 1. Click [+ Thêm mới]. 2. Bỏ trống thang_diem_min. 3. Click [Lưu]. | 1. Hệ thống từ chối: cả thang_diem_min và thang_diem_max đều bắt buộc (Y). | Negative |

---

## FILE: `07-TC-ho-so-de-nghi.md`

### ❌ EC-09: AUDIT_LOG với nested JSON (structured fields)

**Nguồn SRS**: SCR-VIII-10 — "Chi tiet thay doi (JSON diff: old_value → new_value, expandable)"

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HSDN-E01 | FR-VIII-08 / BR-DATA-05 / SCR-VIII-10 | Chỉnh sửa trường structured → AUDIT_LOG lưu nested JSON đúng | 1. Đã có cấu hình HS với thanh_phan_bat_buoc = ["Đơn đề nghị", "CCCD"]. | Thêm thành phần "Giấy phép ĐKKD" vào mảng | 1. Sửa cấu hình HS. 2. Thêm "Giấy phép ĐKKD" vào thanh_phan_bat_buoc. 3. Click [Lưu]. 4. Kiểm tra AUDIT_LOG. | 1. du_lieu_cu chứa JSON: thanh_phan_bat_buoc = ["Đơn đề nghị", "CCCD"]. 2. du_lieu_moi chứa JSON: thanh_phan_bat_buoc = ["Đơn đề nghị", "CCCD", "Giấy phép ĐKKD"]. 3. Nested JSON trong JSON được serialize đúng. 4. SCR-VIII-10 hiển thị dạng expandable tree-view. | Edge |

---

## FILE: `02-TC-chuong-trinh-ho-tro.md`

### ❌ EC-10: Xóa chương trình hỗ trợ đang tham chiếu → message ERR-DM-03 chi tiết

**Nguồn SRS**: ERR-DM-03 — message sử dụng placeholder {entity} (số ít) → trả 1 module đại diện đầu tiên

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CTHT-E01 | FR-VIII-03 / ERR-DM-03 | Xóa CT được tham chiếu từ NHIỀU module → ERR-DM-03 trả 1 entity đại diện | 1. CT "CT_2025" tham chiếu bởi VU_VIEC (5 bản ghi) VÀ HO_SO (3 bản ghi). | — | 1. Click [Xóa] trên "CT_2025". 2. Xác nhận. | 1. Lỗi ERR-DM-03: "Không thể xóa. Danh mục đang được sử dụng bởi 5 bản ghi VU_VIEC". 2. Message chỉ trả 1 entity đại diện (placeholder {entity} số ít — SRS), KHÔNG liệt kê tất cả module. 3. Hệ thống từ chối ngay khi chạm bảng tham chiếu đầu tiên. | Edge |

---

## FILE: `01-TC-TPL-CRUD-chung.md` (Bổ sung thêm)

### ❌ EC-11: Mã 1 ký tự (boundary cận dưới)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CRUD-E07 | TPL-DM-CRUD | Thêm mới với Mã 1 ký tự (boundary cận dưới) → thành công | 1. User QTHT đã đăng nhập. | Mã: "A" (1 ký tự), Tên: "Boundary min" | 1. Click [+ Thêm mới]. 2. Nhập Mã = "A". 3. Click [Lưu]. | 1. Lưu thành công. 2. SRS chỉ định max 20 ký tự, không có min length ngoài "bắt buộc nhập" (non-empty). 3. Mã 1 ký tự hợp lệ. | Edge |

### ❌ EC-12: Tên chỉ chứa khoảng trắng

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CRUD-E08 | TPL-DM-CRUD / ERR-DM-02 | Thêm mới với Tên = toàn khoảng trắng → lỗi ERR-DM-02 | 1. User QTHT đã đăng nhập. | Mã: "SPACE_NAME", Tên: "   " (3 spaces) | 1. Click [+ Thêm mới]. 2. Nhập Tên = "   " (toàn khoảng trắng). 3. Click [Lưu]. | 1. Hệ thống trim khoảng trắng → Tên trống. 2. Lỗi ERR-DM-02: "Tên danh mục là bắt buộc". | Edge |

### ❌ EC-13: Refresh token 24h hết hạn

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CRUD-E09 | BR-AUTH-06 / ERR-AUTH-02 | Refresh token 24h hết hạn → redirect đăng nhập | 1. User QTHT đăng nhập > 24h trước. 2. API token đã hết (15p), refresh token cũng hết (24h). | — | 1. Sau > 24h, thực hiện thao tác. 2. Cả API token lẫn refresh token đều hết. | 1. Hệ thống KHÔNG thể refresh. 2. Redirect về trang đăng nhập (ERR-AUTH-02). 3. BR-AUTH-06: "refresh token 24 giờ". | Edge |

---

## FILE: `03-TC-tinh-trang-vu-viec.md`

### ❌ EC-14: Toggle trạng thái Tình trạng vụ việc → ảnh hưởng workflow

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TTVV-E01 | FR-VIII-04 / SCR-VIII-01 | Vô hiệu hóa trạng thái đang được sử dụng trong workflow → bản ghi mới không chọn được | 1. Trạng thái "Đang xử lý" (trang_thai=1) đang được dùng trong VU_VIEC workflow. | Toggle "Đang xử lý" sang Không hoạt động | 1. Toggle trạng thái "Đang xử lý" = Không hoạt động trên danh sách. 2. Tạo vụ việc mới, chọn tình trạng. | 1. Toggle cập nhật LUÔN (SCR-VIII-01: "toggle → cập nhật"). 2. Vụ việc mới: dropdown KHÔNG hiển thị "Đang xử lý" (Validation: trang_thai = HOAT_DONG). 3. Vụ việc cũ đang ở trạng thái "Đang xử lý" vẫn giữ nguyên (toàn vẹn dữ liệu). | Edge |

---

## FILE: `09-TC-tieu-chi-ho-tro-chi-phi.md`

### ❌ EC-15: Thiếu trường bắt buộc tran_ho_tro_nam

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TCCP-E01 | FR-VIII-12 / UC110 | Thiếu trường bắt buộc tran_ho_tro_nam → lỗi | 1. User QTHT đã đăng nhập. | muc_ho_tro_phan_tram: 100, tran_ho_tro_nam: (trống) | 1. Click [+ Thêm mới]. 2. Nhập muc_ho_tro_phan_tram = 100. 3. Bỏ trống tran_ho_tro_nam (bắt buộc Y, kiểu money). 4. Click [Lưu]. | 1. Hệ thống từ chối lưu. 2. Thông báo: trường tran_ho_tro_nam là bắt buộc. | Negative |

---

## TỔNG KẾT EDGE CASE HUNTER

| # | File TC bị thiếu | EC ID | Mô tả ngắn | Mức độ |
|---|-----------------|-------|-------------|--------|
| 1 | 01-CRUD-chung | EC-01 | Mã trùng bản ghi đã xóa mềm | 🔴 Nghiêm trọng |
| 2 | 01-CRUD-chung | EC-02 | Toggle trạng thái trực tiếp (không modal) | 🔴 Nghiêm trọng |
| 3 | 01-CRUD-chung | EC-03 | SQL injection qua tìm kiếm | 🔴 Nghiêm trọng |
| 4 | 01-CRUD-chung | EC-04 | XSS qua tìm kiếm | 🟡 Trung bình |
| 5 | 01-CRUD-chung | EC-05 | Giới hạn 200 ký tự tìm kiếm | 🟡 Trung bình |
| 6 | 01-CRUD-chung | EC-06 | DM vô hiệu hóa → chặn tham chiếu mới | 🔴 Nghiêm trọng |
| 7 | 04-co-quan-don-vi | EC-07 | Cascade soft-delete đơn vị con | 🔴 Nghiêm trọng |
| 8 | 04-co-quan-don-vi | EC-08 | Cascade + tham chiếu → xung đột | 🔴 Nghiêm trọng |
| 9 | 04-co-quan-don-vi | EC-09 | Mã đơn vị unique TOÀN CỤC | 🔴 Nghiêm trọng |
| 10 | 08-tieu-chi-hieu-qua | EC-10 | thang_diem_max > thang_diem_min | 🔴 Nghiêm trọng |
| 11 | 08-tieu-chi-hieu-qua | EC-11 | thang_diem equal boundary | 🟡 Trung bình |
| 12 | 08-tieu-chi-hieu-qua | EC-12 | thang_diem bắt buộc Y | 🟡 Trung bình |
| 13 | 07-ho-so-de-nghi | EC-13 | Nested JSON AUDIT_LOG | 🟡 Trung bình |
| 14 | 02-chuong-trinh-ht | EC-14 | ERR-DM-03 trả 1 entity (không all) | 🟢 Thấp |
| 15 | 01-CRUD-chung | EC-15 | Mã 1 ký tự boundary | 🟢 Thấp |
| 16 | 01-CRUD-chung | EC-16 | Tên toàn khoảng trắng | 🟡 Trung bình |
| 17 | 01-CRUD-chung | EC-17 | Refresh token 24h hết hạn | 🟡 Trung bình |
| 18 | 03-tinh-trang-vu-viec | EC-18 | Vô hiệu hóa trạng thái workflow | 🔴 Nghiêm trọng |
| 19 | 09-tieu-chi-chi-phi | EC-19 | Thiếu tran_ho_tro_nam bắt buộc | 🟡 Trung bình |

**Tổng: 19 edge cases bị thiếu** (8 Nghiêm trọng 🔴, 7 Trung bình 🟡, 4 Thấp 🟢)
