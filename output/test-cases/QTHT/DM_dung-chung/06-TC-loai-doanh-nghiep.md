# Test Cases — FR-VIII-07: Quản lý danh mục Loại doanh nghiệp (UC105)

> **SRS Ref**: FR-VIII-07, loai_danh_muc = LOAI_DOANH_NGHIEP  
> **Nguồn**: NotebookLM Session `a0fdcb5c`  
> **Ngày tạo**: 2026-04-16  
> **Đặc thù**: Bổ sung 2 trường cấu hình: `tieu_chi_doanh_thu` (text, N — "Tiêu chí doanh thu NĐ39/2018"), `tieu_chi_lao_dong` (text, N — "Tiêu chí số lao động"). Loại DN: Siêu nhỏ, Nhỏ, Vừa theo Luật DNNVV 2017.

---

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-LODN-001 | FR-VIII-07 / UC105 | Thêm mới Loại doanh nghiệp với tiêu chí cấu hình | 1. User QTHT đã đăng nhập. 2. Đang ở tab "Loại doanh nghiệp". | Mã: "SIEU_NHO", Tên: "Siêu nhỏ", tieu_chi_doanh_thu: "≤ 3 tỷ VNĐ/năm", tieu_chi_lao_dong: "≤ 10 người" | 1. Click [+ Thêm mới]. 2. Điền Mã, Tên, tieu_chi_doanh_thu, tieu_chi_lao_dong. 3. Click [Lưu]. | 1. Lưu thành công. 2. Tiêu chí doanh thu và lao động lưu dạng text (không validate số học ở cấp quản trị). 3. AUDIT_LOG ghi CREATE. | Happy |
| TC-LODN-002 | FR-VIII-07 / UC105 | Thêm mới chỉ Mã + Tên, bỏ trống tiêu chí | 1. User QTHT đã đăng nhập. | Mã: "VUA", Tên: "Vừa", tieu_chi_doanh_thu: (trống), tieu_chi_lao_dong: (trống) | 1. Click [+ Thêm mới]. 2. Chỉ điền Mã, Tên. 3. Bỏ trống 2 trường tiêu chí. 4. Click [Lưu]. | 1. Lưu thành công. 2. Cả 2 trường tiêu chí = null (không bắt buộc). | Happy |
| TC-LODN-003 | FR-VIII-07 / BR-CALC-05 | Kiểm tra tiêu chí cấu hình được sử dụng để auto-suggest quy mô DN | 1. Đã cấu hình 3 loại DN (Siêu nhỏ, Nhỏ, Vừa) với tiêu chí. 2. Module nhập liệu DN (UC81) đang hoạt động. | DN nhập doanh_thu_nam = 2 tỷ VNĐ | 1. Ở module quản lý DN (UC81), nhập doanh_thu_nam = 2 tỷ. 2. Kiểm tra hệ thống auto-suggest quy mô. | 1. Hệ thống áp dụng BR-CALC-05 để tự động suggest quy mô DN = "Siêu nhỏ" (≤ 3 tỷ). 2. Tiêu chí cấu hình từ danh mục được sử dụng. | Edge |
| TC-LODN-004 | FR-VIII-07 / ERR-DM-03 | Xóa loại DN đang được tham chiếu → chặn | 1. Loại DN "Siêu nhỏ" đang được gán cho 50 doanh nghiệp. | — | 1. Click [Xóa] trên "Siêu nhỏ". | 1. Lỗi ERR-DM-03 với thông tin số bản ghi DOANH_NGHIEP liên kết. | Negative |
