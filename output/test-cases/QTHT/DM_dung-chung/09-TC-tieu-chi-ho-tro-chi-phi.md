# Test Cases — FR-VIII-12: Quản lý danh mục Tiêu chí đánh giá hỗ trợ chi phí (UC110)

> **SRS Ref**: FR-VIII-12, loai_danh_muc = TIEU_CHI_DG_CHI_PHI  
> **Nguồn**: NotebookLM Session `a0fdcb5c`  
> **Ngày tạo**: 2026-04-16  
> **Đặc thù**: Bổ sung 3 trường: `quy_mo_dn` (Siêu nhỏ/Nhỏ/Vừa), `muc_ho_tro_phan_tram` (number, Y — VD: 100, 30, 10), `tran_ho_tro_nam` (money, Y — VNĐ/năm)  
> **Tham chiếu**: BR-CALC-01 (NĐ18/2026). Seed Data: Siêu nhỏ 100%/3M | Nhỏ ≤30%/5M | Vừa ≤10%/10M

---

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TCCP-001 | FR-VIII-12 / UC110 | Thêm mới tiêu chí hỗ trợ chi phí cho DN siêu nhỏ | 1. User QTHT đã đăng nhập. 2. Đang ở tab "Tiêu chí đánh giá hỗ trợ chi phí". | Mã: "SIEU_NHO_CP", Tên: "Hỗ trợ DN Siêu nhỏ", quy_mo_dn: "Siêu nhỏ", muc_ho_tro_phan_tram: 100, tran_ho_tro_nam: 3000000 | 1. Click [+ Thêm mới]. 2. Điền Mã, Tên. 3. Chọn quy_mo_dn = "Siêu nhỏ". 4. Nhập muc_ho_tro_phan_tram = 100. 5. Nhập tran_ho_tro_nam = 3.000.000 VNĐ. 6. Click [Lưu]. | 1. Lưu thành công. 2. Dữ liệu phù hợp BR-CALC-01 (NĐ18/2026). 3. AUDIT_LOG ghi CREATE. | Happy |
| TC-TCCP-002 | FR-VIII-12 / UC110 | Thêm mới tiêu chí cho DN nhỏ với mức ≤ 30% | 1. User QTHT đã đăng nhập. | Mã: "NHO_CP", quy_mo_dn: "Nhỏ", muc_ho_tro_phan_tram: 30, tran_ho_tro_nam: 5000000 | 1. Click [+ Thêm mới]. 2. Điền thông tin cho quy mô Nhỏ. 3. Click [Lưu]. | 1. Lưu thành công. 2. Phù hợp seed data: Nhỏ ≤30%, trần 5M VNĐ. | Happy |
| TC-TCCP-003 | FR-VIII-12 / UC110 | Nhập muc_ho_tro_phan_tram vượt 100 | 1. User QTHT đã đăng nhập. | muc_ho_tro_phan_tram: 150 | 1. Click [+ Thêm mới]. 2. Nhập muc_ho_tro_phan_tram = 150. 3. Click [Lưu]. | 1. **Lưu ý SRS**: Input cấu hình không định nghĩa explicit validator min/max bounds cho trường này. 2. Kiểm tra hệ thống có validate phần trăm > 100 hay không. 3. Ghi nhận kết quả thực tế → nếu cho phép, đây có thể là GAP. | Edge |
| TC-TCCP-004 | FR-VIII-12 / UC110 | Nhập tran_ho_tro_nam = 0 hoặc giá trị âm | 1. User QTHT đã đăng nhập. | tran_ho_tro_nam: 0 hoặc -1000000 | 1. Click [+ Thêm mới]. 2. Nhập tran_ho_tro_nam = 0 (hoặc giá trị âm). 3. Click [Lưu]. | 1. Kiểm tra hệ thống có validate giá trị tiền >= 0 không. 2. SRS không quy định min/max explicit. 3. Ghi nhận kết quả thực tế. | Negative |
| TC-TCCP-005 | FR-VIII-12 | Thiếu trường bắt buộc muc_ho_tro_phan_tram → lỗi | 1. User QTHT đã đăng nhập. | muc_ho_tro_phan_tram: (trống), tran_ho_tro_nam: 3000000 | 1. Click [+ Thêm mới]. 2. Bỏ trống muc_ho_tro_phan_tram (bắt buộc Y). 3. Click [Lưu]. | 1. Hệ thống từ chối lưu. 2. Thông báo trường bắt buộc. | Negative |
| TC-TCCP-006 | FR-VIII-12 / BR-CALC-01 | Chỉnh sửa mức hỗ trợ và kiểm tra ảnh hưởng nghiệp vụ | 1. Đã cấu hình tiêu chí Siêu nhỏ: 100%, 3M. | Đổi muc_ho_tro_phan_tram: 80, tran_ho_tro_nam: 2000000 | 1. Click [Sửa] trên tiêu chí "Siêu nhỏ". 2. Đổi phần trăm = 80, trần = 2M. 3. Click [Lưu]. | 1. Cập nhật thành công. 2. AUDIT_LOG ghi UPDATE với giá trị cũ (100/3M) → mới (80/2M). 3. Các tính toán nghiệp vụ tiếp theo sẽ dùng giá trị mới. | Edge |
| TC-TCCP-007 | FR-VIII-12 / UC110 | Thiếu trường bắt buộc tran_ho_tro_nam → lỗi | 1. User QTHT đã đăng nhập. | muc_ho_tro_phan_tram: 100, tran_ho_tro_nam: (trống) | 1. Click [+ Thêm mới]. 2. Nhập muc_ho_tro_phan_tram = 100. 3. Bỏ trống tran_ho_tro_nam (SRS: kiểu money, bắt buộc Y). 4. Click [Lưu]. | 1. Hệ thống từ chối lưu. 2. Thông báo: trường tran_ho_tro_nam là bắt buộc. | Negative |

