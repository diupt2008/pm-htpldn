# Test Cases — UC112: Quản Lý Vai Trò (FR-VIII-14)

> **SRS Ref**: FR-VIII-14, SCR-VIII-02, Entity VAI_TRO  
> **Nguồn**: NotebookLM Session `1aea59de`  
> **Ngày tạo**: 2026-04-17

---

## A. XEM DANH SÁCH VAI TRÒ (READ)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-VT-001 | FR-VIII-14 / BR-AUTH-01 | Xem danh sách vai trò thành công | 1. QTHT đã đăng nhập. 2. Session còn hiệu lực (< 30p idle). | Tài khoản: QTHT_admin. Hệ thống có ≥ 11 vai trò seed data. | 1. Đăng nhập CMS bằng tài khoản QTHT. 2. Truy cập menu Quản trị > Phân quyền > Vai trò. | 1. Hiển thị SCR-VIII-02 với bảng danh sách. 2. Cột: Mã vai trò, Tên vai trò, Mô tả, Số tài khoản, Số quyền, Trạng thái (toggle), Hành động (Sửa/Xóa). 3. Breadcrumb: "Trang chủ > Quản trị > Phân quyền > Vai trò". 4. Nút [+ Thêm vai trò] hiển thị trên toolbar. 5. Chỉ hiển thị bản ghi is_deleted = 0. | Happy |
| TC-VT-002 | FR-VIII-14 / BR-DATA-07 | Phân trang danh sách vai trò | 1. QTHT đã đăng nhập. 2. Tổng vai trò > 20 bản ghi. | 25 vai trò (11 seed + 14 custom). | 1. Truy cập danh sách vai trò. 2. Quan sát phân trang. | 1. Trang 1 hiển thị 20 vai trò. 2. Trang 2 hiển thị 5 vai trò còn lại. 3. Default 20 rows/page, max 100. | Happy |
| TC-VT-003 | FR-VIII-14 / Permission Matrix | User CB_NV xem danh sách vai trò (Read-only) | 1. User CB_NV_TW đã đăng nhập. | Tài khoản: cbnv_tw_user (vai trò CB_NV_TW) | 1. Đăng nhập bằng tài khoản CB_NV_TW. 2. Truy cập phần hiển thị vai trò (nếu có quyền từ menu). | 1. User có thể xem danh sách vai trò (Read). 2. Nút [+ Thêm vai trò], [Sửa], [Xóa] KHÔNG hiển thị hoặc bị disabled. 3. Toggle trạng thái bị disabled. | Happy |
| TC-VT-004 | ERR-AUTH-01 | User DN cố truy cập quản lý vai trò → lỗi | 1. User DN đã đăng nhập. | Tài khoản: dn_user (vai trò DN) | 1. Đăng nhập bằng tài khoản DN. 2. Cố truy cập URL quản lý vai trò (direct URL). | 1. Lỗi ERR-AUTH-01: "Bạn không có quyền thực hiện chức năng này". 2. Menu "Quản trị > Phân quyền" không hiển thị trong sidebar cho DN. | Negative |

---

## B. THÊM MỚI VAI TRÒ (CREATE)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-VT-005 | FR-VIII-14 | Thêm vai trò thành công với đầy đủ thông tin | 1. QTHT đã đăng nhập. | ma_vai_tro: "KIEM_TOAN", ten_vai_tro: "Kiểm toán viên", mo_ta: "Vai trò kiểm toán nội bộ", cap: "TW" | 1. Click [+ Thêm vai trò]. 2. Modal mở ra với form: Mã, Tên, Mô tả, Cấp, Trạng thái. 3. Điền đầy đủ thông tin. 4. Trạng thái mặc định = Hoạt động (KICH_HOAT). 5. Click [Lưu]. | 1. Modal đóng. 2. Vai trò mới xuất hiện trong bảng. 3. trang_thai = KICH_HOAT. 4. don_vi_id = NULL (toàn hệ thống). 5. AUDIT_LOG ghi hanh_dong = 'CREATE', entity_type = 'VAI_TRO'. 6. Toast thông báo thành công. | Happy |
| TC-VT-006 | FR-VIII-14 | Thêm vai trò chỉ trường bắt buộc (Mã + Tên) | 1. QTHT đã đăng nhập. | ma_vai_tro: "TEST_MIN", ten_vai_tro: "Test tối thiểu", mo_ta: (trống), cap: (mặc định ALL) | 1. Click [+ Thêm vai trò]. 2. Chỉ nhập Mã và Tên. 3. Bỏ trống Mô tả. 4. Click [Lưu]. | 1. Lưu thành công. 2. mo_ta = null. 3. cap = 'ALL' (mặc định). 4. trang_thai = KICH_HOAT (mặc định). | Happy |
| TC-VT-007 | FR-VIII-14 / ERR-VT-01 | Thêm vai trò với mã trùng → lỗi ERR-VT-01 | 1. QTHT đã đăng nhập. 2. Đã tồn tại vai trò mã "QTHT". | ma_vai_tro: "QTHT", ten_vai_tro: "Test trùng" | 1. Click [+ Thêm vai trò]. 2. Nhập Mã = "QTHT". 3. Nhập Tên = "Test trùng". 4. Click [Lưu]. | 1. Hệ thống từ chối lưu. 2. Lỗi ERR-VT-01: "Mã vai trò 'QTHT' đã tồn tại". | Negative |
| TC-VT-008 | FR-VIII-14 | Thêm vai trò với Tên trống → lỗi | 1. QTHT đã đăng nhập. | ma_vai_tro: "NO_NAME", ten_vai_tro: "" (trống) | 1. Click [+ Thêm vai trò]. 2. Nhập Mã = "NO_NAME". 3. Để trống Tên. 4. Click [Lưu]. | 1. Hệ thống từ chối lưu. 2. Hiển thị lỗi: "Tên vai trò là bắt buộc". | Negative |
| TC-VT-009 | FR-VIII-14 | Thêm vai trò với Mã trống → lỗi | 1. QTHT đã đăng nhập. | ma_vai_tro: "" (trống), ten_vai_tro: "Test mã trống" | 1. Click [+ Thêm vai trò]. 2. Để trống Mã. 3. Nhập Tên = "Test mã trống". 4. Click [Lưu]. | 1. Hệ thống từ chối lưu. 2. Hiển thị lỗi: "Mã vai trò là bắt buộc". | Negative |
| TC-VT-010 | FR-VIII-14 | Thêm vai trò với cấp không hợp lệ | 1. QTHT đã đăng nhập. | ma_vai_tro: "BAD_CAP", ten_vai_tro: "Test cấp sai", cap: "INVALID" | 1. Click [+ Thêm vai trò]. 2. Nhập thông tin hợp lệ. 3. Gửi API với cap = "INVALID" (bypass UI). | 1. Hệ thống từ chối. 2. Trường cap chỉ nhận giá trị CHECK IN ('TW','BN','DP','ALL'). | Negative |

---

## C. CHỈNH SỬA VAI TRÒ (UPDATE)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-VT-011 | FR-VIII-14 | Chỉnh sửa tên vai trò thành công | 1. QTHT đã đăng nhập. 2. Vai trò "KIEM_TOAN" tồn tại. | ten_vai_tro mới: "Kiểm toán viên nội bộ" | 1. Click [Sửa] trên vai trò "KIEM_TOAN". 2. Modal mở ra, hiển thị dữ liệu hiện tại. 3. Đổi Tên thành "Kiểm toán viên nội bộ". 4. Click [Lưu]. | 1. Modal đóng. 2. Tên cập nhật trong bảng. 3. AUDIT_LOG ghi 'UPDATE' với du_lieu_cu và du_lieu_moi. 4. Toast thành công. | Happy |
| TC-VT-012 | FR-VIII-14 / SCR-VIII-02 | Toggle trạng thái vai trò trực tiếp trên bảng | 1. QTHT đã đăng nhập. 2. Vai trò "KIEM_TOAN" trang_thai = KICH_HOAT. | — | 1. Click toggle Trạng thái trên hàng "KIEM_TOAN". 2. KHÔNG mở modal. | 1. Trạng thái chuyển sang VO_HIEU_HOA. 2. Toggle cập nhật trực tiếp (SRS SCR-VIII-02: "toggle → cập nhật" không cần confirm). 3. AUDIT_LOG ghi 'UPDATE'. | Edge |
| TC-VT-013 | FR-VIII-14 / ERR-VT-01 | Sửa mã vai trò trùng với vai trò khác → lỗi | 1. QTHT đã đăng nhập. 2. Tồn tại vai trò "DN" và "NHT". | Đổi mã "NHT" thành "DN" | 1. Click [Sửa] trên vai trò "NHT". 2. Đổi Mã thành "DN". 3. Click [Lưu]. | 1. Lỗi ERR-VT-01: "Mã vai trò 'DN' đã tồn tại". | Negative |
| TC-VT-014 | FR-VIII-14 / BR-EC-01 | Xung đột cập nhật đồng thời (Optimistic Locking) | 1. Hai QTHT cùng mở modal sửa vai trò "NHT". | User A đổi tên, User B đổi mô tả. | 1. User A mở sửa vai trò "NHT" (updated_at = T1). 2. User B mở sửa cùng vai trò (updated_at = T1). 3. User A lưu → thành công (updated_at = T2). 4. User B lưu → check updated_at ≠ T1. | 1. User A: lưu thành công. 2. User B: lỗi ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang". | Edge |
| TC-VT-015 | FR-VIII-14 | Sửa vai trò giữ nguyên mã → không lỗi trùng | 1. QTHT đã đăng nhập. 2. Vai trò "DN" tồn tại. | Giữ mã "DN", đổi tên thành "Doanh nghiệp - Updated" | 1. Click [Sửa] trên "DN". 2. Giữ nguyên Mã. 3. Đổi Tên. 4. Click [Lưu]. | 1. Lưu thành công. 2. Loại trừ chính bản ghi khi kiểm tra unique mã. | Edge |

---

## D. XÓA VAI TRÒ (DELETE — Xóa mềm)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-VT-016 | FR-VIII-14 / BR-DATA-01 | Xóa vai trò thành công (chưa gán TK) | 1. QTHT đã đăng nhập. 2. Vai trò "KIEM_TOAN" chưa gán cho bất kỳ tài khoản nào. | Vai trò: "KIEM_TOAN", Số tài khoản = 0 | 1. Click [Xóa] trên hàng "KIEM_TOAN". 2. Dialog xác nhận hiển thị. 3. Xác nhận xóa. | 1. Vai trò biến mất khỏi bảng. 2. DB: is_deleted = 1 (xóa mềm). 3. AUDIT_LOG ghi 'DELETE'. 4. Toast thành công. | Happy |
| TC-VT-017 | FR-VIII-14 / ERR-VT-02 | Xóa vai trò đang gán cho TK → lỗi ERR-VT-02 | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_TW" đang gán cho 5 tài khoản. | Vai trò: "CB_NV_TW", Số tài khoản = 5 | 1. Click [Xóa] trên hàng "CB_NV_TW". 2. Xác nhận xóa. | 1. Lỗi ERR-VT-02: "Không thể xóa. Vai trò đang gán cho 5 tài khoản". 2. Vai trò vẫn tồn tại. | Negative |
| TC-VT-018 | FR-VIII-14 | Xóa vai trò seed data khi chưa gán TK → thành công (SRS không khóa cứng) | 1. QTHT đã đăng nhập. 2. Vai trò seed "CG" chưa gán cho bất kỳ TK nào. | Vai trò: "CG" (seed data), Số tài khoản = 0 | 1. Click [Xóa] trên vai trò "CG". 2. Xác nhận xóa. | 1. Xóa mềm thành công (SRS không có cờ is_system để chặn). 2. is_deleted = 1. 3. AUDIT_LOG ghi 'DELETE'. | Edge |
| TC-VT-019 | FR-VIII-14 / BR-EC-01 | Xóa vai trò đã bị user khác sửa → lỗi Optimistic Lock | 1. QTHT A xem danh sách (updated_at = T1). 2. QTHT B sửa vai trò cùng lúc. | Vai trò: "TEST_LOCK" | 1. QTHT A click [Xóa] trên "TEST_LOCK". 2. QTHT B đã sửa trước đó (updated_at = T2). 3. Hệ thống kiểm tra updated_at ≠ T1. | 1. Lỗi ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang". | Edge |
| TC-VT-020 | FR-VIII-14 / ERR-VT-01 | Thêm mới mã trùng với vai trò đã xóa mềm | 1. QTHT đã đăng nhập. 2. Vai trò "OLD_ROLE" đã xóa mềm (is_deleted = 1). | ma_vai_tro: "OLD_ROLE" | 1. Click [+ Thêm vai trò]. 2. Nhập Mã = "OLD_ROLE". 3. Click [Lưu]. | 1. Kết quả phụ thuộc vào logic unique: nếu UNIQUE bao gồm bản ghi xóa mềm → lỗi ERR-VT-01. 2. SRS quy định ma_vai_tro unique toàn hệ thống (không loại trừ is_deleted). | Edge |
| TC-VT-021 | FR-VIII-14 / BR-DATA-05 | Xác minh AUDIT_LOG ghi đầy đủ khi CRUD vai trò | 1. QTHT đã đăng nhập. 2. Đã thực hiện tạo → sửa → xóa 1 vai trò. | — | 1. Kiểm tra bảng AUDIT_LOG sau mỗi thao tác. | 1. Log ghi: hanh_dong (CREATE/UPDATE/DELETE), entity_type = 'VAI_TRO', entity_id, nguoi_thuc_hien_id, thoi_gian, ip_address, du_lieu_cu (cho UPDATE/DELETE), du_lieu_moi (cho CREATE/UPDATE). 2. Log immutable - không thể sửa/xóa. | Happy |

---

## E. EDGE CASES BỔ SUNG (từ Edge Case Hunter Review 2026-04-17)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-VT-022 | FR-VIII-14 / SM-TAIKHOAN | Toggle OFF vai trò đang gán cho TK → ảnh hưởng user online | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_TW" đang gán cho 5 TK. 3. Có 2 user CB_NV_TW đang online (session active). | Vai trò: CB_NV_TW, trang_thai hiện tại = KICH_HOAT | 1. QTHT toggle trạng thái vai trò "CB_NV_TW" sang VO_HIEU_HOA. 2. Kiểm tra session 2 user CB_NV_TW đang online. | 1. Toggle thành công (SRS KHÔNG chặn vô hiệu hóa vai trò đang gán TK — chỉ chặn XÓA theo ERR-VT-02). 2. **SRS Gap**: Không có quy định invalidate session user khi vai trò bị vô hiệu hóa (chỉ có khi TÀI KHOẢN bị vô hiệu hóa — SM-TAIKHOAN). 3. User đang online sẽ không bị kick ngay — nhưng các request tiếp theo sẽ bị chặn nếu hệ thống check quyền realtime, hoặc vẫn hoạt động đến khi API token hết hạn (15p theo BR-AUTH-06). | Edge |
| TC-VT-023 | FR-VIII-14 | TK chỉ có 1 vai trò duy nhất bị vô hiệu hóa → user vẫn login nhưng menu trống | 1. User "nv_one_role" chỉ có vai trò duy nhất "CB_NV_TW". 2. QTHT vô hiệu hóa vai trò "CB_NV_TW". | — | 1. QTHT toggle OFF vai trò CB_NV_TW. 2. User "nv_one_role" đăng nhập. | 1. Đăng nhập THÀNH CÔNG (SRS login chỉ kiểm tra TAI_KHOAN.trang_thai, không kiểm tra VAI_TRO.trang_thai — FR-VIII-15 Processing). 2. Dashboard/Menu hiển thị trống rỗng (không có quyền nào active). 3. Mọi API call bị chặn bởi ERR-API-403: "Không có quyền truy cập API này". | Edge |
| TC-VT-024 | FR-VIII-14 | Tên vai trò toàn khoảng trắng → lỗi validate | 1. QTHT đã đăng nhập. | ma_vai_tro: "SPACE_VT", ten_vai_tro: "   " (3 spaces) | 1. Click [+ Thêm vai trò]. 2. Nhập Tên = "   " (toàn khoảng trắng). 3. Click [Lưu]. | 1. Hệ thống trim khoảng trắng → Tên trống → lỗi "Tên vai trò là bắt buộc" (SRS: ten_vai_tro Bắt buộc Y). | Edge |

---

## F. EDGE CASES BỔ SUNG V2 (từ Edge Case Hunter Review V2 — 2026-04-18)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-VT-025 | FR-VIII-14 | 🔴 Sửa mã vai trò (ma_vai_tro) — SRS cho phép edit mã sau khi tạo | 1. QTHT đã đăng nhập. 2. Vai trò "KIEM_TOAN" tồn tại, đang gán cho 3 TK. | ma_vai_tro cũ: "KIEM_TOAN" → mới: "KT_NOI_BO" | 1. Click [Sửa] vai trò "KIEM_TOAN". 2. Đổi Mã thành "KT_NOI_BO". 3. Click [Lưu]. | 1. **SRS xác nhận**: Trường ma_vai_tro KHÔNG có ghi chú `(readonly)` trong Form CRUD Modal SCR-VIII-02 — QTHT có thể sửa mã sau khi tạo (khác với mã nghiệp vụ `(auto)` như ma_vu_viec). 2. Nếu thành công: mã cũ "KIEM_TOAN" → "KT_NOI_BO", cần kiểm tra liên kết TAI_KHOAN_VAI_TRO vẫn intact. 3. AUDIT_LOG ghi UPDATE với du_lieu_cu chứa mã cũ. | Edge |
| TC-VT-026 | FR-VIII-14 | 🟡 Mã vai trò không có MAX LENGTH — nhập mã 500 ký tự | 1. QTHT đã đăng nhập. | ma_vai_tro: "A" × 500 (500 ký tự) | 1. Click [+ Thêm vai trò]. 2. Nhập Mã = chuỗi 500 ký tự. 3. Click [Lưu]. | 1. **SRS Gap**: FR-VIII-14 Inputs KHÔNG quy định MAX LENGTH cho ma_vai_tro (khác với Danh mục chung "Mã danh mục max 20 ký tự", khác Username "4-50 ký tự"). 2. Kiểm tra: DB có thể reject nếu cột VARCHAR có giới hạn, hoặc chấp nhận → hiển thị UI bị tràn cột. | Edge |
| TC-VT-027 | FR-VIII-14 | 🟡 Mã vai trò không có format restriction — nhập chữ thường, dấu cách, ký tự đặc biệt | 1. QTHT đã đăng nhập. | ma_vai_tro: "vai trò @#$" | 1. Click [+ Thêm vai trò]. 2. Nhập Mã = "vai trò @#$" (chứa dấu cách + ký tự đặc biệt). 3. Click [Lưu]. | 1. **SRS Gap**: FR-VIII-14 Inputs KHÔNG có ràng buộc format/regex cho ma_vai_tro (khác Username có "chữ+số+gạch_dưới" ERR-TK-04). 2. Kỳ vọng: Hệ thống NÊN chặn ký tự đặc biệt để mã vai trò chuẩn hóa. 3. Hiện tại SRS cho phép lưu bất kỳ ký tự nào. | Edge |
| TC-VT-028 | FR-VIII-14 | 🟢 Tên vai trò không có MAX LENGTH — nhập tên 1000 ký tự | 1. QTHT đã đăng nhập. | ten_vai_tro: "A" × 1000 | 1. Click [+ Thêm vai trò]. 2. Nhập Mã hợp lệ. 3. Nhập Tên = chuỗi 1000 ký tự. 4. Click [Lưu]. | 1. **SRS Gap**: FR-VIII-14 Inputs KHÔNG quy định MAX LENGTH cho ten_vai_tro. 2. Kiểm tra: DB varchar limit hoặc UI truncation behavior. | Edge |
| TC-VT-029 | FR-VIII-14 / SCR-VIII-02 | 🟡 Đếm "Số tài khoản" — có bao gồm TK bị VO_HIEU_HOA? | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_TW" gán cho 5 TK: 3 HOAT_DONG + 1 VO_HIEU_HOA + 1 TAM_KHOA. | — | 1. Truy cập danh sách vai trò SCR-VIII-02. 2. Quan sát cột "Số tài khoản" của "CB_NV_TW". | 1. **SRS Gap**: SCR-VIII-02 mô tả cột "Số TK đang gán" — KHÔNG định nghĩa filter trang_thai. 2. Kiểm tra giá trị: 5 (tất cả) hay 3 (chỉ HOAT_DONG). 3. Cần clarify với BA. | Edge |
