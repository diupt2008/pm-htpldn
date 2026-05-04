# Test Cases — FR-VIII-05: Quản lý danh mục Cơ quan đơn vị quản lý (UC103)

> **SRS Ref**: FR-VIII-05, bảng DON_VI (KHÔNG dùng DANH_MUC)  
> **Nguồn**: NotebookLM Session `a0fdcb5c`  
> **Ngày tạo**: 2026-04-16  
> **Đặc thù**: 
> - Bảng riêng `DON_VI`, giao diện Tree View 3 cấp (TW → BN → ĐP)
> - Trường đặc thù: `cap` (text, Y, TW/BN/DP), `don_vi_cha_id` (identifier, Y nếu BN/DP), `dia_chi` (text, N), `dien_thoai` (text, N), `email` (text, N)
> - Kiểm tra vòng lặp cây (cycle detection), ERR-DV-05

---

## A. TREE VIEW & PHÂN CẤP

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CQDV-001 | FR-VIII-05 / UC103 | Hiển thị Tree View phân cấp 3 tầng | 1. User QTHT đã đăng nhập. 2. Dữ liệu có: 1 đơn vị TW, 2 đơn vị BN, 3 đơn vị ĐP. | Cấu trúc: TW "Bộ Tư pháp" → BN "Cục A" → ĐP "Sở B" | 1. Truy cập Quản trị > Danh mục > tab "Cơ quan đơn vị". | 1. Giao diện Tree View hiển thị cây phân cấp TW → BN → ĐP. 2. Click node cây → form chi tiết hiển thị bên phải (Mã ĐV, Tên ĐV, Cấp, ĐV cha, Địa chỉ, ĐT, Email, Trạng thái). 3. Mỗi node cây có nút [+ Thêm đơn vị con]. | Happy |
| TC-CQDV-002 | FR-VIII-05 / UC103 | Thêm đơn vị cấp TW (không yêu cầu đơn vị cha) | 1. User QTHT đã đăng nhập. | Mã: "TW_BTP", Tên: "Bộ Tư pháp", cap: "TW", don_vi_cha_id: (trống), dia_chi: "Hà Nội", dien_thoai: "024-xxx", email: "btp@gov.vn" | 1. Click [+ Thêm mới] hoặc nút gốc. 2. Chọn cap = "TW". 3. Điền đầy đủ thông tin. 4. Để trống don_vi_cha_id. 5. Click [Lưu]. | 1. Lưu thành công. 2. don_vi_cha_id = NULL (cấp TW không yêu cầu cha). 3. Đơn vị mới xuất hiện ở gốc cây. | Happy |
| TC-CQDV-003 | FR-VIII-05 / UC103 | Thêm đơn vị cấp BN bắt buộc chỉ định đơn vị cha | 1. User QTHT đã đăng nhập. 2. Tồn tại đơn vị TW "Bộ Tư pháp". | Mã: "BN_CUC_A", Tên: "Cục A", cap: "BN", don_vi_cha_id: ID của "Bộ Tư pháp" | 1. Click [+ Thêm đơn vị con] trên node "Bộ Tư pháp". 2. Hoặc click [+ Thêm mới], chọn cap = "BN". 3. Chỉ định don_vi_cha_id = "Bộ Tư pháp". 4. Click [Lưu]. | 1. Lưu thành công. 2. Đơn vị BN xuất hiện dưới node TW "Bộ Tư pháp" trong cây. | Happy |
| TC-CQDV-004 | FR-VIII-05 / UC103 | Thêm đơn vị cấp BN/ĐP thiếu don_vi_cha_id → lỗi | 1. User QTHT đã đăng nhập. | cap: "BN", don_vi_cha_id: (trống) | 1. Click [+ Thêm mới]. 2. Chọn cap = "BN". 3. Để trống don_vi_cha_id. 4. Click [Lưu]. | 1. Hệ thống từ chối lưu. 2. Lỗi: don_vi_cha_id là bắt buộc khi cap = BN hoặc DP. | Negative |
| TC-CQDV-005 | FR-VIII-05 / UC103 | Thêm đơn vị cấp ĐP với đơn vị cha là BN | 1. User QTHT đã đăng nhập. 2. Tồn tại đơn vị BN "Cục A". | Mã: "DP_SO_B", Tên: "Sở B", cap: "DP", don_vi_cha_id: ID "Cục A" | 1. Click [+ Thêm đơn vị con] trên node "Cục A". 2. Điền thông tin. 3. Click [Lưu]. | 1. Lưu thành công. 2. Đơn vị ĐP xuất hiện dưới node BN "Cục A" (cấp 3 trong cây). | Happy |

---

## B. KIỂM TRA VÒNG LẶP CÂY (CYCLE DETECTION)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CQDV-006 | FR-VIII-05 / ERR-DV-05 | Cố tạo vòng lặp cây → lỗi ERR-DV-05 | 1. User QTHT đã đăng nhập. 2. Cấu trúc: TW "A" → BN "B" → ĐP "C". | Sửa đơn vị "A" (TW), đổi don_vi_cha_id = ID "C" (ĐP) | 1. Click [Sửa] trên đơn vị "A". 2. Đổi don_vi_cha_id = ID đơn vị "C" (tạo vòng lặp A→C→B→A). 3. Click [Lưu]. | 1. Hệ thống từ chối cập nhật. 2. Lỗi ERR-DV-05: "Không thể tạo vòng lặp phân cấp". | Negative |
| TC-CQDV-007 | FR-VIII-05 / ERR-DV-05 | Sửa đơn vị cha thành chính nó (self-reference) | 1. User QTHT đã đăng nhập. 2. Đơn vị "B" có don_vi_cha_id = "A". | Sửa "B": don_vi_cha_id = ID "B" (chính nó) | 1. Click [Sửa] trên đơn vị "B". 2. Đổi don_vi_cha_id = chính ID "B". 3. Click [Lưu]. | 1. Lỗi ERR-DV-05: "Không thể tạo vòng lặp phân cấp". 2. Tham chiếu chính mình là trường hợp cycle đơn giản nhất. | Edge |
| TC-CQDV-008 | FR-VIII-05 | Sửa đơn vị cha hợp lệ (không tạo vòng lặp) | 1. User QTHT đã đăng nhập. 2. Cấu trúc: TW "A" → BN "B". TW "D" tồn tại riêng. | Sửa "B": don_vi_cha_id từ "A" sang "D" | 1. Click [Sửa] trên đơn vị "B". 2. Đổi don_vi_cha_id = ID "D". 3. Click [Lưu]. | 1. Cập nhật thành công. 2. Đơn vị "B" chuyển sang nhánh cây dưới "D". 3. Kiểm tra đơn vị cha tồn tại = Pass. | Happy |

---

## C. RÀNG BUỘC XÓA VÀ CẢNH BÁO

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CQDV-009 | FR-VIII-05 | Xóa đơn vị có tài khoản người dùng liên kết → chặn | 1. User QTHT đã đăng nhập. 2. Đơn vị "Sở B" có 5 tài khoản liên kết. | Đơn vị: "Sở B" đang có TAI_KHOAN liên kết | 1. Click [Xóa] trên đơn vị "Sở B". 2. Xác nhận xóa. | 1. Hệ thống chặn xóa. 2. Lỗi ERR-DM-03: "Không thể xóa. Danh mục đang được sử dụng bởi {N} bản ghi TAI_KHOAN". | Negative |
| TC-CQDV-010 | FR-VIII-05 | Xóa đơn vị có dữ liệu nghiệp vụ liên kết → chặn | 1. User QTHT đã đăng nhập. 2. Đơn vị đang có VU_VIEC liên kết. | Đơn vị đang tham chiếu bởi dữ liệu nghiệp vụ | 1. Click [Xóa] trên đơn vị. 2. Xác nhận. | 1. Chặn xóa, hiển thị ERR-DM-03 với thông tin entity liên kết. | Negative |
| TC-CQDV-011 | FR-VIII-05 | Xóa đơn vị không có liên kết → thành công | 1. User QTHT đã đăng nhập. 2. Đơn vị "Test ĐV" không có tài khoản hay dữ liệu liên kết. | — | 1. Click [Xóa] trên đơn vị "Test ĐV". 2. Xác nhận. | 1. Xóa mềm thành công (is_deleted = 1). 2. Đơn vị biến mất khỏi Tree View. | Happy |

---

## D. GHI CHÚ GIAO DIỆN

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CQDV-012 | SCR-VIII-01 | Click node cây hiển thị form chi tiết bên phải | 1. User QTHT đã đăng nhập. Tree có dữ liệu. | — | 1. Click vào node "Bộ Tư pháp" trong Tree View. | 1. Panel bên phải hiển thị form chi tiết: Mã ĐV, Tên ĐV, Cấp, ĐV cha, Địa chỉ, ĐT, Email, Trạng thái. | Happy |
| TC-CQDV-013 | SCR-VIII-01 | Alert cảnh báo khi thay đổi cấp/đơn vị cha | 1. User QTHT đã đăng nhập. | — | 1. Mở form sửa đơn vị. 2. Thay đổi trường cap hoặc don_vi_cha_id. | 1. Hiển thị alert cảnh báo: "Thay đổi cấp/đơn vị cha sẽ cập nhật chính sách phân quyền". | Edge |
| TC-CQDV-014 | FR-VIII-05 / BR-AUTH-02 | Kiểm tra ràng buộc phân cấp TW → BN/ĐP | 1. User QTHT đã đăng nhập. | Cố tạo đơn vị cap = "ĐP" với don_vi_cha_id là đơn vị TW (bỏ qua cấp BN) | 1. Click [+ Thêm mới]. 2. Chọn cap = "DP". 3. Chỉ định don_vi_cha = đơn vị TW trực tiếp. 4. Click [Lưu]. | 1. Kiểm tra hệ thống có ràng buộc phân cấp chặt (ĐP phải dưới BN) hay cho phép ĐP trực tiếp dưới TW. 2. SRS quy định BR-AUTH-02: "TW → BN / ĐP" — ghi nhận kết quả thực tế. | Edge |

---

## E. EDGE CASES BỔ SUNG (từ Edge Case Hunter Review 2026-04-17)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-CQDV-015 | FR-VIII-05 / BR-EC-02 | Xóa đơn vị CHA → cascade soft-delete tất cả đơn vị CON | 1. User QTHT đã đăng nhập. 2. Cấu trúc: TW "A" → BN "B" → ĐP "C". 3. Cả "A", "B", "C" đều KHÔNG có tài khoản/dữ liệu nghiệp vụ liên kết. | Xóa "A" (TW) — có 2 con "B" (BN) và "C" (ĐP) | 1. Click [Xóa] trên đơn vị "A". 2. Xác nhận xóa. | 1. Đơn vị "A" bị xóa mềm (is_deleted=1). 2. Đơn vị con "B" và "C" CŨNG bị cascade soft-delete (is_deleted=1). 3. SRS BR-EC-02: "Khi soft-delete bản ghi cha, ứng dụng SHALL cascade soft-delete bản ghi con. Khi restore → restore con". 4. Cả "A", "B", "C" biến mất khỏi Tree View. | Edge |
| TC-CQDV-016 | FR-VIII-05 / BR-EC-02 / ERR-DM-03 | Xóa đơn vị CHA có CON đang tham chiếu → cascade bị chặn bởi ERR-DM-03 | 1. Cấu trúc: TW "A" → BN "B". 2. Đơn vị con "B" đang có 10 tài khoản liên kết (TAI_KHOAN). 3. Đơn vị cha "A" KHÔNG có liên kết trực tiếp. | Xóa "A" — con "B" đang bị tham chiếu | 1. Click [Xóa] trên đơn vị cha "A". 2. Xác nhận. | 1. Hệ thống kiểm tra cascade: con "B" đang có tham chiếu TAI_KHOAN. 2. Chặn xóa "A" vì cascade sẽ ảnh hưởng "B" đang có liên kết → ERR-DM-03. 3. Ghi nhận: SRS quy định cascade (BR-EC-02) VÀ kiểm tra tham chiếu (ERR-DM-03) — xung đột tiềm năng cần verify thực tế. | Edge |
| TC-CQDV-017 | FR-VIII-05 / Entity DON_VI | Mã đơn vị trùng toàn cục (khác scope DANH_MUC) → lỗi | 1. User QTHT đã đăng nhập. 2. Đã tồn tại đơn vị TW mã "BTP_001". | Thêm đơn vị BN mới: mã = "BTP_001" (trùng ĐV khác cấp) | 1. Thêm đơn vị mới cấp BN, nhập mã = "BTP_001". 2. Click [Lưu]. | 1. Hệ thống từ chối: mã "BTP_001" đã tồn tại. 2. SRS Entity DON_VI: `ma_don_vi` ràng buộc "UNIQUE" (toàn cục), mô tả "Mã cơ quan (duy nhất)" — KHÁC với bảng DANH_MUC là "UNIQUE per loai_danh_muc". | Edge |

