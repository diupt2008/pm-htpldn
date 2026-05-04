# Test Cases — UC114: Phân Quyền Truy Cập Dữ Liệu (FR-VIII-16)

> **SRS Ref**: FR-VIII-16, SCR-VIII-05, Row-level Security  
> **Nguồn**: NotebookLM Session `1aea59de`  
> **Ngày tạo**: 2026-04-17

---

## A. XEM & CHỌN PHÂN QUYỀN DỮ LIỆU (READ)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQD-001 | FR-VIII-16 / BR-AUTH-01 | Truy cập màn hình phân quyền dữ liệu thành công | 1. QTHT đã đăng nhập. 2. Có ≥ 1 vai trò trong hệ thống. | Tài khoản: QTHT_admin | 1. Truy cập Quản trị > Phân quyền > Phân quyền dữ liệu. | 1. Hiển thị SCR-VIII-05. 2. Dropdown chọn vai trò. 3. Cây đơn vị phân cấp (tree + checkbox): TW → BN → ĐP (3 tầng). 4. Khu vực "Danh sách đã chọn" (tag-list). 5. Alert cảnh báo ngang cấp (ẩn mặc định). 6. Nút [Lưu]. | Happy |
| TC-PQD-002 | FR-VIII-16 / SCR-VIII-05 | Chọn vai trò → load quyền hiện tại | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_BN" đã được phân quyền trước đó cho 2 đơn vị BN. | Vai trò: CB_NV_BN | 1. Chọn "CB_NV_BN" từ dropdown vai trò. | 1. Cây đơn vị load và tự tick checkbox cho 2 đơn vị BN đã gán. 2. Danh sách đã chọn hiển thị 2 tag tương ứng. | Happy |
| TC-PQD-003 | FR-VIII-16 / BR-PQ-01 | Check cha → auto check tất cả con | 1. QTHT đã đăng nhập. 2. Chọn vai trò cần phân quyền. | Cây: TW (root) có 3 BN con, mỗi BN có 2 ĐP | 1. Tick checkbox vào node TW (Cục BLDS&KT). | 1. Tất cả node con (BN, ĐP) tự động được tick. 2. Danh sách đã chọn hiển thị tất cả đơn vị. | Happy |
| TC-PQD-004 | FR-VIII-16 / SCR-VIII-05 | Bỏ chọn đơn vị cụ thể qua tag-list (click X) | 1. QTHT đã tick TW → tất cả con được tick. | — | 1. Tại khu vực "Danh sách đã chọn", click [X] trên tag "Sở TP Hà Nội". | 1. Checkbox "Sở TP Hà Nội" trên cây bị bỏ tick. 2. Tag biến mất khỏi danh sách đã chọn. 3. Node cha (TW) chuyển sang trạng thái "indeterminate" (nửa tick). | Happy |

---

## B. QUY TẮC NGANG CẤP & CẤP CHA-CON

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQD-005 | FR-VIII-16 / BR-AUTH-03 / ERR-PQ-01 | Chọn 2 đơn vị ngang cấp → alert cảnh báo + block lưu | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_BN" thuộc đơn vị Bộ Công Thương (BN). | Tick: "Bộ Công Thương" (BN) + "Sở TP Hà Nội" (ĐP) | 1. Chọn vai trò CB_NV_BN. 2. Tick "Bộ Công Thương" (BN). 3. Tick thêm "Sở TP Hà Nội" (ĐP) — ngang cấp vì BN ↛ ĐP. | 1. Alert đỏ hiển thị cảnh báo vi phạm quy tắc ngang cấp. 2. Nút [Lưu] bị khóa (block). 3. ERR-PQ-01: "Không thể gán quyền xem đơn vị Sở TP Hà Nội cho vai trò thuộc đơn vị Bộ Công Thương (ngang cấp)". | Negative |
| TC-PQD-006 | FR-VIII-16 / BR-AUTH-04 | Vai trò TW xem tất cả dữ liệu BN + ĐP | 1. QTHT đã phân quyền cho vai trò "QTHT" chọn node TW. | — | 1. Đăng nhập bằng TK có vai trò QTHT. 2. Truy cập dữ liệu nghiệp vụ (VD: danh sách vụ việc). | 1. User TW nhìn thấy tất cả dữ liệu: TW + BN + ĐP. 2. Tuân thủ BR-AUTH-04: cấp cha thấy cấp con. | Happy |
| TC-PQD-007 | FR-VIII-16 / BR-AUTH-03 | Vai trò BN KHÔNG thấy dữ liệu ĐP | 1. Vai trò "CB_NV_BN" chỉ được phân quyền cho Bộ Công Thương. | — | 1. Đăng nhập TK có vai trò CB_NV_BN (Bộ Công Thương). 2. Truy cập dữ liệu nghiệp vụ. | 1. User chỉ thấy dữ liệu của Bộ Công Thương. 2. KHÔNG thấy dữ liệu của Sở TP Hà Nội hay BN khác. | Negative |
| TC-PQD-008 | FR-VIII-16 / BR-AUTH-03 | Vai trò ĐP không thấy ĐP khác (ngang cấp) | 1. Vai trò "CB_NV_DP" phân quyền cho Sở TP Hà Nội. | — | 1. Đăng nhập TK CB_NV_DP (Sở TP Hà Nội). 2. Cố truy cập dữ liệu Sở TP HCM. | 1. Không thấy dữ liệu của Sở TP HCM. 2. Tuân thủ quy tắc ngang cấp: ĐP ↛ ĐP. | Negative |
| TC-PQD-009 | FR-VIII-16 / BR-AUTH-03 | BN không thấy ĐP (mặc dù cùng tầng ngang) | 1. Vai trò "CB_NV_BN" chỉ phân quyền cho Bộ Công Thương. | — | 1. Đăng nhập CB_NV_BN. 2. Cố truy cập dữ liệu Sở TP Hà Nội (ĐP). | 1. Không thấy dữ liệu ĐP. 2. BN và ĐP là ngang cấp theo mô hình 2 tầng. | Edge |

---

## C. LƯU PHÂN QUYỀN DỮ LIỆU

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQD-010 | FR-VIII-16 / BR-PQ-02 | Lưu phân quyền dữ liệu thành công | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_DP" đã chọn. 3. Tick "Sở TP Hà Nội". | — | 1. Chọn vai trò CB_NV_DP. 2. Tick checkbox "Sở TP Hà Nội". 3. Click [Lưu]. | 1. Hệ thống xóa quyền cũ + tạo quyền mới trong 1 transaction. 2. Cache phân quyền cập nhật ngay. 3. AUDIT_LOG ghi hành động. 4. Hiệu lực ngay lập tức (không cần phê duyệt). 5. Toast thành công. | Happy |
| TC-PQD-011 | FR-VIII-16 / ERR-PQ-02 | Lưu cho vai trò không tồn tại → lỗi ERR-PQ-02 | 1. QTHT gửi API phân quyền với vai_tro_id không tồn tại. | vai_tro_id: 99999 | 1. Gửi API phân quyền với vai_tro_id = 99999. | 1. Lỗi ERR-PQ-02: "Vai trò không tồn tại". | Negative |
| TC-PQD-012 | FR-VIII-16 / ERR-PQ-03 | Lưu với đơn vị không tồn tại → lỗi ERR-PQ-03 | 1. QTHT gửi API với don_vi_id không tồn tại. | don_vi_id: 99999 | 1. Gửi API phân quyền chứa đơn vị ID = 99999. | 1. Lỗi ERR-PQ-03: "Đơn vị ID 99999 không tồn tại". | Negative |
| TC-PQD-013 | FR-VIII-16 | Lưu phân quyền khi không chọn đơn vị nào → xóa hết quyền | 1. QTHT đã đăng nhập. 2. Vai trò "TEST_ROLE" đang có quyền xem 3 đơn vị. | Bỏ tick tất cả đơn vị | 1. Chọn vai trò "TEST_ROLE". 2. Bỏ tick tất cả checkbox. 3. Click [Lưu]. | 1. Xóa toàn bộ quyền dữ liệu cũ. 2. Vai trò không thấy dữ liệu nào. 3. Tuân thủ logic: "xóa cũ + tạo mới" → nếu mới = rỗng thì chỉ xóa. | Edge |

---

## D. EDGE CASES BỔ SUNG (từ Edge Case Hunter Review 2026-04-17)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQD-014 | FR-VIII-16 / ERR-AUTH-01 | User không phải QTHT cố truy cập phân quyền dữ liệu → lỗi | 1. User CB_NV đã đăng nhập. | — | 1. Cố truy cập URL SCR-VIII-05. | 1. Lỗi ERR-AUTH-01: "Bạn không có quyền thực hiện chức năng này" (SRS: Permission Matrix — chỉ QTHT có CRUD cho PHAN_QUYEN_DU_LIEU). 2. Menu không hiển thị cho CB_NV. | Negative |
| TC-PQD-015 | FR-VIII-16 | Vai trò có cap = 'DP' nhưng QTHT tick cấp TW → SRS không chặn (Gap) | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_DP" có cap = 'DP'. | Tick node TW (Cục BLDS&KT) | 1. Chọn vai trò CB_NV_DP (cap = DP). 2. Tick node TW trên cây đơn vị. 3. Click [Lưu]. | 1. **SRS Gap**: Hệ thống chỉ chặn chọn ngang cấp (ERR-PQ-01) nhưng KHÔNG validate sự tương thích giữa VAI_TRO.cap và DON_VI.cap. 2. Kỳ vọng: NÊN cảnh báo rằng vai trò ĐP không nên có quyền xem dữ liệu TW. | Edge |
| TC-PQD-016 | FR-VIII-16 | Đơn vị bị TẠM DỪNG nhưng phân quyền vẫn trỏ đến → stale reference | 1. Đơn vị "Phòng cũ" đã bị TẠM DỪNG (DON_VI.trang_thai = TAM_DUNG). 2. Vai trò "TEST_ROLE" đang có quyền xem "Phòng cũ". | — | 1. QTHT tạm dừng đơn vị "Phòng cũ". 2. Kiểm tra phân quyền dữ liệu của vai trò "TEST_ROLE". | 1. **SRS Gap**: Không có rule tự động vô hiệu hóa hay dọn dẹp phân quyền khi đơn vị bị tạm dừng (SRS có DON_VI.trang_thai = TAM_DUNG nhưng không liên kết với PHAN_QUYEN_DU_LIEU). 2. Phân quyền stale vẫn tồn tại → user vẫn "thấy" data cũ. | Edge |
| TC-PQD-017 | FR-VIII-16 / BR-EC-01 | 2 QTHT phân quyền dữ liệu cùng vai trò cùng lúc → Optimistic Lock | 1. QTHT A và QTHT B cùng chọn vai trò "CB_NV_TW" trên SCR-VIII-05. | QTHT A chọn 3 đơn vị, QTHT B chọn 5 đơn vị | 1. QTHT A load phân quyền CB_NV_TW. 2. QTHT B load cùng lúc. 3. QTHT A lưu 3 đơn vị → thành công. 4. QTHT B lưu 5 đơn vị → check version. | 1. QTHT B: lỗi ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang" (SRS BR-EC-01: Optimistic Locking áp dụng cho mọi UPDATE). 2. Lưu UC114 dùng transaction "xóa cũ + tạo mới" (FR-VIII-16 Processing). | Edge |

---

## E. EDGE CASES BỔ SUNG V2 (từ Edge Case Hunter Review V2 — 2026-04-18)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PQD-018 | FR-VIII-16 / BR-PQ-02 | 🟡 Lưu phân quyền: 1 đơn vị không tồn tại trong batch → Reject ALL (atomic transaction) | 1. QTHT đã đăng nhập. 2. Chọn vai trò cần phân quyền. | Tick 3 đơn vị hợp lệ + gửi API thêm đơn vị ID 99999 (bypass UI) | 1. Gửi API lưu phân quyền với 4 đơn vị, trong đó 1 không tồn tại. | 1. **SRS xác nhận**: FR-VIII-16 Processing Bước 6: "Xóa toàn bộ quyền dữ liệu cũ + tạo quyền mới cho vai trò (trong 1 giao dịch)". SCR-VIII-05: "click → lưu trong 1 transaction". 2. Transaction atomic: lỗi bất kỳ → **rollback toàn bộ**. 3. ERR-PQ-03: "Đơn vị ID 99999 không tồn tại". 4. Quyền cũ GIỮ NGUYÊN (rollback). | Edge |
| TC-PQD-019 | FR-VIII-16 / BR-PQ-01 | 🟢 Check cha: cây 3 cấp → đệ quy auto check TW → BN → ĐP | 1. QTHT đã đăng nhập. 2. Cây: TW (Cục BLDS&KT) → BN (2 Bộ) → ĐP (4 Sở). | — | 1. Chọn vai trò QTHT. 2. Tick checkbox node TW (Cục BLDS&KT). | 1. **SRS xác nhận**: SCR-VIII-05: "check cha → auto check con", cây phân cấp 3 cấp. 2. Đệ quy: Tick TW → auto tick TẤT CẢ BN (2) → auto tick TẤT CẢ ĐP (4). 3. Tổng: 7 đơn vị được đánh dấu (1 TW + 2 BN + 4 ĐP). 4. Danh sách đã chọn hiển thị 7 tag. | Edge |
| TC-PQD-020 | FR-VIII-16 | 🟢 Uncheck 1 con → cha chuyển "indeterminate" | 1. QTHT đã đăng nhập. 2. Đã tick TW → tất cả con được tick. | — | 1. Bỏ tick 1 đơn vị ĐP (VD: Sở TP Hà Nội). 2. Quan sát node cha BN và node gốc TW. | 1. Node BN cha chuyển trạng thái "indeterminate" (nửa tick □). 2. Node TW cũng chuyển "indeterminate". 3. Tag "Sở TP Hà Nội" biến mất khỏi danh sách đã chọn. 4. Chỉ còn 6/7 đơn vị được chọn. | Edge |
