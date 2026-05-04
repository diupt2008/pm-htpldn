# Test Cases — FR-VIII-08 & FR-VIII-09: Quản lý danh mục Hồ sơ đề nghị (UC106, UC107)

> **SRS Ref**: FR-VIII-08 (HO_SO_DE_NGHI_HT), FR-VIII-09 (HO_SO_DE_NGHI_TT)  
> **Nguồn**: NotebookLM Session `a0fdcb5c`  
> **Ngày tạo**: 2026-04-16  
> **Đặc thù FR-VIII-08**: Bổ sung 2 mảng structured: `thanh_phan_bat_buoc` (danh sách giấy tờ bắt buộc), `thanh_phan_tuy_chon` (danh sách giấy tờ tùy chọn)  
> **Đặc thù FR-VIII-09**: Bổ sung mảng `thanh_phan_ho_so`  
> **Lưu ý SRS**: Tài liệu CHƯA làm rõ cơ chế nhập liệu UI cho 2 trường mảng JSON trên giao diện Quản trị (không có thiết kế component đặc thù).

---

## A. HỒ SƠ ĐỀ NGHỊ HỖ TRỢ (FR-VIII-08)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HSDN-001 | FR-VIII-08 / UC106 | Thêm mới cấu hình Hồ sơ đề nghị hỗ trợ với checklist bắt buộc | 1. User QTHT đã đăng nhập. 2. Đang ở tab "Hồ sơ đề nghị hỗ trợ". | Mã: "HS_TPPL_01", Tên: "Hồ sơ TPPL cơ bản", thanh_phan_bat_buoc: ["Đơn đề nghị", "CMND/CCCD", "Giấy phép ĐKKD"], thanh_phan_tuy_chon: ["Hợp đồng liên quan", "Biên bản"] | 1. Click [+ Thêm mới]. 2. Điền Mã, Tên. 3. Cấu hình thanh_phan_bat_buoc (3 thành phần). 4. Cấu hình thanh_phan_tuy_chon (2 thành phần). 5. Click [Lưu]. | 1. Lưu thành công. 2. Dữ liệu structured (mảng JSON) được lưu đúng. 3. Khi tham chiếu từ module hồ sơ, checklist hiển thị đầy đủ. | Happy |
| TC-HSDN-002 | FR-VIII-08 / UC106 | Thêm mới chỉ Mã + Tên, bỏ trống các mảng structured | 1. User QTHT đã đăng nhập. | Mã: "HS_EMPTY", Tên: "HS rỗng", thanh_phan_bat_buoc: [], thanh_phan_tuy_chon: [] | 1. Click [+ Thêm mới]. 2. Chỉ điền Mã, Tên. 3. Không cấu hình thành phần nào. 4. Click [Lưu]. | 1. Kiểm tra hệ thống có cho phép lưu mảng rỗng hay không. 2. Ghi nhận: SRS không quy định rõ thanh_phan_bat_buoc có bắt buộc ≥ 1 phần tử hay không. | Edge |
| TC-HSDN-003 | FR-VIII-08 | Kiểm tra giao diện nhập liệu structured (UI Gap) | 1. User QTHT đã đăng nhập. | — | 1. Mở form thêm mới cho tab "Hồ sơ đề nghị hỗ trợ". 2. Kiểm tra giao diện nhập liệu cho thanh_phan_bat_buoc và thanh_phan_tuy_chon. | 1. **LƯU Ý GAP SRS**: Tài liệu SRS KHÔNG có thiết kế component UI đặc thù cho nhập liệu mảng JSON. 2. Ghi nhận cách hệ thống thực hiện: bảng nhập liệu động? textarea JSON? input lặp? | Edge |

---

## B. HỒ SƠ ĐỀ NGHỊ THANH TOÁN (FR-VIII-09)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HSTT-001 | FR-VIII-09 / UC107 | Thêm mới cấu hình Hồ sơ đề nghị thanh toán | 1. User QTHT đã đăng nhập. 2. Đang ở tab "Hồ sơ đề nghị thanh toán". | Mã: "HS_TT_01", Tên: "Hồ sơ thanh toán cơ bản", thanh_phan_ho_so: ["Đề nghị thanh toán", "Hóa đơn", "Xác nhận dịch vụ"] | 1. Click [+ Thêm mới]. 2. Điền Mã, Tên. 3. Cấu hình thanh_phan_ho_so (3 thành phần). 4. Click [Lưu]. | 1. Lưu thành công. 2. Mảng thanh_phan_ho_so được lưu đúng dạng structured/JSON. | Happy |
| TC-HSTT-002 | FR-VIII-09 / UC107 | Chỉnh sửa thêm/bớt thành phần hồ sơ thanh toán | 1. User QTHT đã đăng nhập. 2. Đã có bản ghi "HS_TT_01" với 3 thành phần. | Thêm: "Biên bản nghiệm thu". Bớt: "Xác nhận dịch vụ". | 1. Click [Sửa] trên "HS_TT_01". 2. Thêm thành phần "Biên bản nghiệm thu". 3. Xóa "Xác nhận dịch vụ". 4. Click [Lưu]. | 1. Cập nhật thành công. 2. AUDIT_LOG ghi UPDATE với du_lieu_cu (mảng cũ 3 phần tử) → du_lieu_moi (mảng mới 3 phần tử: thay đổi). | Happy |
| TC-HSTT-003 | FR-VIII-09 | Xóa cấu hình HS thanh toán đang được tham chiếu → chặn | 1. Cấu hình "HS_TT_01" đang được sử dụng bởi quy trình thanh toán. | — | 1. Click [Xóa] trên "HS_TT_01". 2. Xác nhận. | 1. Lỗi ERR-DM-03 kèm số bản ghi liên kết. | Negative |
| TC-HSTT-004 | FR-VIII-09 | Nhập thành phần hồ sơ trùng tên trong cùng 1 bản ghi | 1. User QTHT đã đăng nhập. | thanh_phan_ho_so: ["Hóa đơn", "Hóa đơn"] (trùng) | 1. Cấu hình 2 thành phần trùng tên "Hóa đơn". 2. Click [Lưu]. | 1. Kiểm tra hệ thống có validate trùng lặp trong mảng hay không. 2. Ghi nhận: SRS không đề cập ràng buộc unique trong mảng. | Edge |
| TC-HSTT-005 | FR-VIII-08 / BR-DATA-05 / SCR-VIII-10 | Chỉnh sửa trường structured → AUDIT_LOG lưu nested JSON đúng | 1. Đã có cấu hình HS với thanh_phan_bat_buoc = ["Đơn đề nghị", "CCCD"]. | Thêm thành phần "Giấy phép ĐKKD" vào mảng thanh_phan_bat_buoc | 1. Sửa cấu hình HS. 2. Thêm "Giấy phép ĐKKD" vào thanh_phan_bat_buoc. 3. Click [Lưu]. 4. Kiểm tra AUDIT_LOG (SCR-VIII-10). | 1. du_lieu_cu chứa JSON: thanh_phan_bat_buoc = ["Đơn đề nghị", "CCCD"]. 2. du_lieu_moi chứa JSON: thanh_phan_bat_buoc = ["Đơn đề nghị", "CCCD", "Giấy phép ĐKKD"]. 3. Nested JSON trong JSON được serialize đúng. 4. SRS SCR-VIII-10: "Chi tiết thay đổi (JSON diff: old_value → new_value, expandable)" — hiển thị dạng tree-view. | Edge |

