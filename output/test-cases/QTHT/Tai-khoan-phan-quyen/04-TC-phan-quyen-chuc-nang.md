# Test Cases — UC115: Phân Quyền Chức Năng (FR-VIII-17)

> **SRS Ref**: FR-VIII-17, SCR-VIII-04, Entity QUYEN_HAN  
> **Nguồn**: NotebookLM Session `1aea59de`  
> **Ngày tạo**: 2026-04-17

---

## A. XEM MÀN HÌNH PHÂN QUYỀN CHỨC NĂNG (READ)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQCN-001 | FR-VIII-17 / BR-AUTH-01 | Truy cập màn hình phân quyền chức năng thành công | 1. QTHT đã đăng nhập. 2. Có ≥ 1 vai trò trong hệ thống. | Tài khoản: QTHT_admin | 1. Truy cập Quản trị > Phân quyền > Phân quyền chức năng. | 1. Hiển thị SCR-VIII-04. 2. Dropdown chọn vai trò trên toolbar. 3. Ma trận checkbox: hàng = cây menu module, cột = 6 quyền (Xem, Thêm, Sửa, Xóa, Phê duyệt, Xuất). 4. Nút [Lưu phân quyền] và [Reset về mặc định]. | Happy |
| TC-PQCN-002 | FR-VIII-17 / SCR-VIII-04 | Chọn vai trò → load ma trận quyền hiện tại | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_TW" đã phân quyền Xem + Thêm cho module Hỏi đáp. | Vai trò: CB_NV_TW | 1. Chọn "CB_NV_TW" từ dropdown. | 1. Ma trận checkbox load với tick Xem + Thêm ở hàng "Hỏi đáp". 2. Các module khác hiển thị quyền tương ứng đã phân quyền trước đó. | Happy |
| TC-PQCN-003 | ERR-AUTH-01 | User không phải QTHT cố truy cập → lỗi | 1. User CB_NV đã đăng nhập. | — | 1. Cố truy cập URL phân quyền chức năng. | 1. Lỗi ERR-AUTH-01. 2. Menu không hiển thị. | Negative |

---

## B. THAO TÁC CHECK/UNCHECK TRÊN MA TRẬN

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQCN-004 | FR-VIII-17 / BR-PQ-03 | Check cha menu → auto check tất cả module con | 1. QTHT đã đăng nhập. 2. Đã chọn vai trò. | Cây: "Quản trị" (cha) → "Danh mục", "Vai trò", "Tài khoản" (con) | 1. Tick checkbox cột "Xem" tại hàng "Quản trị" (node cha). | 1. Tự động tick "Xem" cho tất cả module con: "Danh mục", "Vai trò", "Tài khoản". | Happy |
| TC-PQCN-005 | FR-VIII-17 / BR-PQ-03 | Click header cột → check tất cả dòng | 1. QTHT đã đăng nhập. 2. Đã chọn vai trò. | — | 1. Click vào header cột "Xem" (tiêu đề cột). | 1. Tất cả checkbox ở cột "Xem" được tick (mọi module). | Edge |
| TC-PQCN-006 | FR-VIII-17 / BR-PQ-03 | Uncheck cha menu → auto uncheck tất cả con | 1. QTHT đã đăng nhập. 2. Cha "Quản trị" và tất cả con đều đã tick "Xem". | — | 1. Bỏ tick "Xem" tại hàng "Quản trị". | 1. Tất cả con auto bỏ tick cột "Xem". | Edge |
| TC-PQCN-007 | FR-VIII-17 | Tick "Thêm" mà không tick "Xem" → SRS không có auto-dependency | 1. QTHT đã đăng nhập. 2. Module "Hỏi đáp" chưa tick gì. | — | 1. Tick cột "Thêm" cho module "Hỏi đáp" mà KHÔNG tick "Xem". | 1. Hệ thống cho phép tick chỉ "Thêm" mà không tick "Xem" (SRS gap: không có quy tắc phụ thuộc ngang). 2. Kết quả phụ thuộc implementation. | Edge |

---

## C. LƯU PHÂN QUYỀN CHỨC NĂNG

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQCN-008 | FR-VIII-17 / BR-PQ-02 | Lưu phân quyền chức năng thành công | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_TW" đã chọn. 3. Đã tick Xem + Thêm cho module "Hỏi đáp". | — | 1. Tick các checkbox mong muốn. 2. Click [Lưu phân quyền]. | 1. Hệ thống xóa quyền cũ + tạo quyền mới (save batch toàn bộ matrix). 2. AUDIT_LOG ghi hành động. 3. Hiệu lực ngay lập tức (không cần logout/login). 4. Toast thành công. | Happy |
| TC-PQCN-009 | FR-VIII-17 / ERR-PQ-02 | Lưu cho vai trò không tồn tại → lỗi ERR-PQ-02 | 1. QTHT gửi API với vai_tro_id không tồn tại. | vai_tro_id: 99999 | 1. API phân quyền chức năng với vai_tro_id = 99999. | 1. Lỗi ERR-PQ-02: "Vai trò không tồn tại". | Negative |
| TC-PQCN-010 | FR-VIII-17 / ERR-PQ-04 | Lưu với quyền chức năng không tồn tại → lỗi ERR-PQ-04 | 1. QTHT gửi API với quyen_han_id không tồn tại. | quyen_han_id: 99999 | 1. API phân quyền chứa quyền ID = 99999. | 1. Lỗi ERR-PQ-04: "Quyền chức năng ID 99999 không tồn tại". | Negative |
| TC-PQCN-011 | FR-VIII-17 | Bỏ tick tất cả quyền cho vai trò → vai trò không truy cập gì | 1. QTHT đã đăng nhập. 2. Vai trò "TEST_ROLE" đang có quyền nhiều module. | Bỏ tick tất cả | 1. Bỏ tick tất cả checkbox. 2. Click [Lưu phân quyền]. | 1. Xóa tất cả quyền. 2. User có vai trò này không thể truy cập bất kỳ module nào. | Edge |

---

## D. SELF-LOCKOUT & EDGE CASES

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQCN-012 | FR-VIII-17 / GAP-01 | QTHT tự tước quyền quản trị (self-lockout risk) | 1. QTHT đã đăng nhập. 2. Chọn vai trò "QTHT" từ dropdown. | Bỏ tick tất cả quyền cho vai trò QTHT | 1. Chọn vai trò "QTHT". 2. Bỏ tick tất cả checkbox (bao gồm cả Xem/Sửa module Quản trị). 3. Click [Lưu phân quyền]. | 1. **CRITICAL GAP**: SRS không có cơ chế bảo vệ → nếu lưu thành công, QTHT sẽ mất quyền truy cập quản trị → hệ thống bị đứng. 2. Kỳ vọng: hệ thống NÊN chặn với thông báo cảnh báo rủi ro self-lockout. | Edge |
| TC-PQCN-013 | FR-VIII-17 / SCR-VIII-04 | Nút [Reset về mặc định] hoạt động | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_TW" đã thay đổi quyền. | — | 1. Chọn vai trò CB_NV_TW. 2. Thay đổi vài checkbox. 3. Click [Reset về mặc định]. | 1. Ma trận quay lại trạng thái ban đầu (quyền mặc định cho vai trò). 2. Các checkbox phản ánh quyền mặc định, chưa lưu cho đến khi click [Lưu]. | Happy |
| TC-PQCN-014 | FR-VIII-17 | Kiểm tra hiệu lực ngay sau lưu (không cần re-login) | 1. QTHT vừa bỏ tick quyền "Xuất" cho CB_NV_TW ở module "Vụ việc". 2. User CB_NV_TW đang đăng nhập (session active). | — | 1. QTHT lưu phân quyền. 2. Ngay lập tức, user CB_NV_TW truy cập module "Vụ việc". 3. Kiểm tra nút "Xuất Excel". | 1. Nút "Xuất Excel" không hiển thị hoặc bị disabled cho CB_NV_TW. 2. Quyền có hiệu lực ngay, không cần re-login. | Edge |
| TC-PQCN-015 | FR-VIII-17 / BR-DATA-05 | Xác minh AUDIT_LOG khi phân quyền chức năng | 1. QTHT đã thực hiện lưu phân quyền. | — | 1. Kiểm tra bảng AUDIT_LOG sau lưu. | 1. AUDIT_LOG ghi: hanh_dong, entity_type = 'QUYEN_HAN', vai_tro thay đổi, nguoi_thuc_hien, thoi_gian, du_lieu_cu, du_lieu_moi. | Happy |

---

## E. EDGE CASES BỔ SUNG (từ Edge Case Hunter Review 2026-04-17)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQCN-016 | FR-VIII-17 / BR-EC-01 | 2 QTHT phân quyền chức năng cùng vai trò cùng lúc → Optimistic Lock | 1. QTHT A và QTHT B cùng chọn vai trò "CB_NV_TW" trên SCR-VIII-04. | QTHT A tick Xem+Thêm module Hỏi đáp, QTHT B tick Xem+Sửa module Vụ việc | 1. QTHT A load ma trận quyền CB_NV_TW. 2. QTHT B load cùng lúc. 3. QTHT A lưu → thành công. 4. QTHT B lưu → check version. | 1. QTHT B: lỗi ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang" (SRS BR-EC-01: Optimistic Locking áp dụng cho mọi thao tác cập nhật). | Edge |
| TC-PQCN-017 | FR-VIII-17 | Phân quyền cho vai trò đã bị vô hiệu hóa → SRS cho phép (không chặn) | 1. QTHT đã đăng nhập. 2. Vai trò "OLD_ROLE" trang_thai = VO_HIEU_HOA. | — | 1. Chọn "OLD_ROLE" từ dropdown vai trò. 2. Tick quyền Xem cho module Hỏi đáp. 3. Click [Lưu phân quyền]. | 1. Dropdown không filter vai trò theo trạng thái (SRS SCR-VIII-04: "Dropdown chọn vai trò" — không có WHERE KICH_HOAT). 2. Lưu thành công nhưng vô nghĩa (vai trò đã VO_HIEU_HOA → không user nào hưởng quyền). | Edge |
| TC-PQCN-018 | FR-VIII-17 / BR-PQ-03 | Click header cột → uncheck tất cả dòng (toggle behavior) | 1. QTHT đã đăng nhập. 2. Tất cả module đã tick cột "Xem". | — | 1. Click header cột "Xem" (lần 2 — đã check all). | 1. SRS ghi "Click header cột → check/uncheck tất cả dòng" (FR-VIII-17). 2. Lần 2 click → toggle uncheck tất cả ở cột "Xem". 3. Nếu đây là quyền duy nhất → vai trò mất toàn bộ khả năng xem. | Edge |

---

## F. EDGE CASES BỔ SUNG V2 (từ Edge Case Hunter Review V2 — 2026-04-18)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQCN-019 | FR-VIII-17 / SCR-VIII-04 | 🔴 Nút [Reset về mặc định] — SRS Gap: không rõ "mặc định" là gì | 1. QTHT đã đăng nhập. 2. Vai trò CB_NV_TW đã thay đổi quyền (tick thêm Sửa+Xóa module Hỏi đáp). | — | 1. Chọn vai trò CB_NV_TW. 2. Click [Reset về mặc định]. 3. Modal xác nhận → Xác nhận. 4. Quan sát ma trận checkbox. | 1. **SRS Gap nghiêm trọng**: SCR-VIII-04 chỉ ghi "click → modal xác nhận". SRS KHÔNG định nghĩa "mặc định" là: (a) Xóa sạch/uncheck toàn bộ? (b) Trả về phân quyền seed data ban đầu? (c) Khôi phục lần lưu cuối? 2. Cần clarify với BA/CĐT. 3. Kiểm tra hành vi thực tế và so sánh với expectation. | Edge |
| TC-PQCN-020 | FR-VIII-17 / SCR-VIII-04 | 🟢 Ma trận quyền: 6 cột chính xác (Xem, Thêm, Sửa, Xóa, Phê duyệt, Xuất) | 1. QTHT đã đăng nhập. | — | 1. Chọn bất kỳ vai trò. 2. Kiểm tra header cột của ma trận. | 1. **SRS xác nhận**: SCR-VIII-04 liệt kê chính xác 6 cột quyền: **Xem / Thêm / Sửa / Xóa / Phê duyệt / Xuất**. 2. Kiểm tra đầy đủ 6 cột hiển thị, không thừa không thiếu. | Happy |
| TC-PQCN-021 | FR-VIII-17 / SCR-VIII-04 | 🟡 Ma trận quyền: số hàng (modules) — SRS không liệt kê chính xác | 1. QTHT đã đăng nhập. | — | 1. Chọn vai trò bất kỳ. 2. Đếm số hàng module trong ma trận (cây menu). | 1. **SRS Gap**: SCR-VIII-04 chỉ ghi "Cây menu (cột trái) | Phân cấp module: Dashboard / Hỏi đáp / Đào tạo / ...". KHÔNG liệt kê đầy đủ. 2. Kiểm tra số hàng thực tế trên UI vs danh sách module trong hệ thống. 3. Mỗi cha có nhiều submenu con → số hàng có thể > 20. | Edge |
| TC-PQCN-022 | FR-VIII-17 | 🟢 Tick "Phê duyệt" cho module không có luồng phê duyệt → quyền vô nghĩa | 1. QTHT đã đăng nhập. 2. Module "Danh mục chung" KHÔNG có luồng phê duyệt trong SRS. | — | 1. Chọn vai trò CB_NV_TW. 2. Tick cột "Phê duyệt" cho module "Danh mục chung". 3. Click [Lưu phân quyền]. | 1. Hệ thống cho phép lưu (ma trận không validate nghiệp vụ cross-module). 2. **Logic hole**: Quyền "Phê duyệt" vô nghĩa cho module không có workflow phê duyệt — nhưng SRS không chặn. 3. Không gây lỗi nhưng tạo confusion cho QTHT. | Edge |
