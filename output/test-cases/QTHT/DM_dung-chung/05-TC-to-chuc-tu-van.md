# Test Cases — FR-VIII-06: Quản lý danh mục Tổ chức tư vấn (UC104)

> **SRS Ref**: FR-VIII-06, loai_danh_muc = TO_CHUC_TU_VAN, bảng DANH_MUC  
> **Nguồn**: NotebookLM Session `a0fdcb5c`  
> **Ngày tạo**: 2026-04-16  
> **Đặc thù**: Bổ sung 2 trường: `dia_chi` (text, N), `linh_vuc` (text, N — "Lĩnh vực hoạt động"). loai_danh_muc tự gán = 'TO_CHUC_TU_VAN'.

---

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TCTV-001 | FR-VIII-06 / UC104 | Thêm mới Tổ chức tư vấn với đầy đủ trường đặc thù | 1. User QTHT đã đăng nhập. 2. Đang ở tab "Tổ chức tư vấn". | Mã: "VPLS_HANOI", Tên: "Văn phòng LS Hà Nội", dia_chi: "123 Bà Triệu, Hà Nội", linh_vuc: "Dân sự, Thương mại" | 1. Click [+ Thêm mới]. 2. Điền Mã, Tên, dia_chi, linh_vuc. 3. Click [Lưu]. | 1. Lưu thành công. 2. loai_danh_muc tự động gán = 'TO_CHUC_TU_VAN' (system). 3. Dữ liệu lưu vào bảng DANH_MUC (không phải bảng riêng). 4. AUDIT_LOG ghi CREATE. | Happy |
| TC-TCTV-002 | FR-VIII-06 / UC104 | Thêm mới chỉ với trường bắt buộc (Mã + Tên), bỏ trống dia_chi và linh_vuc | 1. User QTHT đã đăng nhập. | Mã: "VPLS_TEST", Tên: "VP Luật sư Test", dia_chi: (trống), linh_vuc: (trống) | 1. Click [+ Thêm mới]. 2. Điền Mã, Tên. 3. Bỏ trống dia_chi, linh_vuc. 4. Click [Lưu]. | 1. Lưu thành công. 2. dia_chi = null, linh_vuc = null (cả hai không bắt buộc). | Happy |
| TC-TCTV-003 | FR-VIII-06 | Xác minh loai_danh_muc được system tự gán | 1. User QTHT đã đăng nhập. | — | 1. Thêm mới một Tổ chức tư vấn. 2. Kiểm tra DB bản ghi vừa tạo. | 1. Trường loai_danh_muc = 'TO_CHUC_TU_VAN' (system tự gán). 2. User KHÔNG THẤY trường này trên form (ẩn/auto). | Edge |
| TC-TCTV-004 | FR-VIII-06 / ERR-DM-01 | Mã trùng trong cùng loai_danh_muc TO_CHUC_TU_VAN → lỗi | 1. User QTHT đã đăng nhập. 2. Đã tồn tại mã "VPLS_HANOI" trong TO_CHUC_TU_VAN. | Mã: "VPLS_HANOI" (trùng) | 1. Click [+ Thêm mới]. 2. Nhập Mã = "VPLS_HANOI". 3. Click [Lưu]. | 1. Lỗi ERR-DM-01: "Mã 'VPLS_HANOI' đã tồn tại trong danh mục TO_CHUC_TU_VAN". | Negative |
