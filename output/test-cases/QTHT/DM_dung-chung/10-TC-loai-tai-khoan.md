# Test Cases — FR-VIII-13: Quản lý danh mục Loại tài khoản (UC111)

> **SRS Ref**: FR-VIII-13, loai_danh_muc = LOAI_TAI_KHOAN  
> **Nguồn**: NotebookLM Session `a0fdcb5c`  
> **Ngày tạo**: 2026-04-16  
> **Đặc thù**: Ràng buộc xóa kiểm tra trực tiếp bảng `TAI_KHOAN.loai_tai_khoan`  
> **Loại tài khoản (VD)**: Cán bộ Nghiệp vụ TW/BN/ĐP, Doanh nghiệp, Người hỗ trợ, Quản trị hệ thống

---

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-LOTK-001 | FR-VIII-13 / UC111 | Thêm mới Loại tài khoản thành công | 1. User QTHT đã đăng nhập. 2. Đang ở tab "Loại tài khoản". | Mã: "CB_NV_TW", Tên: "Cán bộ Nghiệp vụ Trung ương" | 1. Click [+ Thêm mới]. 2. Điền Mã = "CB_NV_TW", Tên = "Cán bộ Nghiệp vụ Trung ương". 3. Click [Lưu]. | 1. Lưu thành công. 2. Bản ghi hiển thị trong danh sách. 3. AUDIT_LOG ghi CREATE. 4. loai_danh_muc = 'LOAI_TAI_KHOAN'. | Happy |
| TC-LOTK-002 | FR-VIII-13 / UC111 | Chỉnh sửa tên loại tài khoản | 1. Tồn tại loại "CB_NV_TW" với tên "Cán bộ NV TW". | Tên mới: "Cán bộ Nghiệp vụ Trung ương (Full)" | 1. Click [Sửa] trên "CB_NV_TW". 2. Đổi tên. 3. Click [Lưu]. | 1. Cập nhật thành công. 2. AUDIT_LOG ghi UPDATE. | Happy |
| TC-LOTK-003 | FR-VIII-13 / ERR-DM-03 | Xóa loại tài khoản đang có TAI_KHOAN liên kết → chặn | 1. Loại "CB_NV_TW" đang được gán cho 25 tài khoản trong bảng TAI_KHOAN. | — | 1. Click [Xóa] trên "CB_NV_TW". 2. Xác nhận. | 1. Hệ thống từ chối xóa. 2. Lỗi ERR-DM-03: "Không thể xóa. Danh mục đang được sử dụng bởi 25 bản ghi TAI_KHOAN". 3. Ràng buộc trực tiếp: kiểm tra TAI_KHOAN.loai_tai_khoan. | Negative |
| TC-LOTK-004 | FR-VIII-13 | Xóa loại tài khoản không có TAI_KHOAN liên kết → thành công | 1. Loại "TEST_LTK" không được gán cho tài khoản nào. | — | 1. Click [Xóa] trên "TEST_LTK". 2. Xác nhận. | 1. Xóa mềm thành công (is_deleted = 1). 2. AUDIT_LOG ghi DELETE. | Happy |
| TC-LOTK-005 | FR-VIII-13 / ERR-DM-01 | Thêm mới loại tài khoản mã trùng → lỗi | 1. Đã tồn tại mã "QTHT" trong LOAI_TAI_KHOAN. | Mã: "QTHT" (trùng) | 1. Click [+ Thêm mới]. 2. Nhập Mã = "QTHT". 3. Click [Lưu]. | 1. Lỗi ERR-DM-01: "Mã 'QTHT' đã tồn tại trong danh mục LOAI_TAI_KHOAN". | Negative |
