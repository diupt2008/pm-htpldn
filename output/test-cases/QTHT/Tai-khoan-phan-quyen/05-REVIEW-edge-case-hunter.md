# Edge Case Hunter Review — Tài Khoản & Phân Quyền (UC112-UC115)

> **Review Date**: 2026-04-17  
> **Reviewer**: Edge Case Hunter (Exhaustive Path Analysis)  
> **Scope**: 4 file TC: `01-TC-quan-ly-vai-tro.md`, `02-TC-quan-ly-tai-khoan.md`, `03-TC-phan-quyen-du-lieu.md`, `04-TC-phan-quyen-chuc-nang.md`  
> **Nguồn xác minh**: NotebookLM Session `1aea59de` (9 lượt query)  
> **Phương pháp**: Exhaustive path enumeration — quét mọi nhánh rẽ, chỉ report path CHƯA có TC cover

---

## Quy ước

- **TraceID**: Ánh xạ 1-1 chính xác với mã SRS gốc từ NotebookLM — KHÔNG tự chế
- **Kết quả mong đợi**: Trích nguyên văn hoặc bám sát SRS
- **Target File**: File TC cần bổ sung nếu user confirm
- **Severity**: 🔴 Critical | 🟡 Medium | 🟢 Low

---

## FILE 1: `01-TC-quan-ly-vai-tro.md` (UC112 / FR-VIII-14)

### Findings: 3 edge cases thiếu

| ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|------------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| TC-VT-E01 | FR-VIII-14 / SM-TAIKHOAN | Toggle OFF vai trò đang gán cho TK → ảnh hưởng user online | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_TW" đang gán cho 5 TK. 3. Có 2 user CB_NV_TW đang online (session active). | Vai trò: CB_NV_TW, trang_thai hiện tại = KICH_HOAT | 1. QTHT toggle trạng thái vai trò "CB_NV_TW" sang VO_HIEU_HOA. 2. Kiểm tra session 2 user CB_NV_TW đang online. | 1. Toggle thành công (SRS KHÔNG chặn vô hiệu hóa vai trò đang gán TK — chỉ chặn XÓA theo ERR-VT-02). 2. **SRS Gap**: Không có quy định invalidate session user khi vai trò bị vô hiệu hóa (chỉ có khi TÀI KHOẢN bị vô hiệu hóa — SM-TAIKHOAN). 3. User đang online sẽ không bị kick ngay — nhưng các request tiếp theo sẽ bị chặn nếu hệ thống check quyền realtime, hoặc vẫn hoạt động đến khi API token hết hạn (15p theo BR-AUTH-06). | Edge | 🔴 |
| TC-VT-E02 | FR-VIII-14 | TK chỉ có 1 vai trò duy nhất bị vô hiệu hóa → user vẫn login nhưng menu trống | 1. User "nv_one_role" chỉ có vai trò duy nhất "CB_NV_TW". 2. QTHT vô hiệu hóa vai trò "CB_NV_TW". | — | 1. QTHT toggle OFF vai trò CB_NV_TW. 2. User "nv_one_role" đăng nhập. | 1. Đăng nhập THÀNH CÔNG (SRS login chỉ kiểm tra TAI_KHOAN.trang_thai, không kiểm tra VAI_TRO.trang_thai — FR-VIII-15 Processing). 2. Dashboard/Menu hiển thị trống rỗng (không có quyền nào active). 3. Mọi API call bị chặn bởi ERR-API-403: "Không có quyền truy cập API này". | Edge | 🟡 |
| TC-VT-E03 | FR-VIII-14 | Tên vai trò toàn khoảng trắng → lỗi validate | 1. QTHT đã đăng nhập. | ma_vai_tro: "SPACE_VT", ten_vai_tro: "   " (3 spaces) | 1. Click [+ Thêm vai trò]. 2. Nhập Tên = "   " (toàn khoảng trắng). 3. Click [Lưu]. | 1. Hệ thống trim khoảng trắng → Tên trống → lỗi "Tên vai trò là bắt buộc" (SRS: ten_vai_tro Bắt buộc Y). | Edge | 🟢 |

---

## FILE 2: `02-TC-quan-ly-tai-khoan.md` (UC113 / FR-VIII-15)

### Findings: 8 edge cases thiếu

| ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|------------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| TC-TK-E01 | FR-VIII-15 / SM-TAIKHOAN | QTHT tự vô hiệu hóa tài khoản chính mình (self-lockout TK) | 1. QTHT đăng nhập bằng TK "admin_01". 2. Chỉ có 1 TK QTHT duy nhất trên hệ thống. | — | 1. QTHT click [Khóa/Vô hiệu hóa] trên chính TK "admin_01". | 1. **CRITICAL GAP**: SRS không có validation chặn `target_id == current_user_id`. 2. Nếu thực thi: trang_thai → VO_HIEU_HOA, session bị invalidate ngay (SM-TAIKHOAN + EC-SEC-08: "refresh token → blacklist Redis"). 3. QTHT bị kick → không thể tự đăng nhập lại → hệ thống bị đứng. | Edge | 🔴 |
| TC-TK-E02 | FR-VIII-15 | Gán vai trò đã vô hiệu hóa cho TK mới → hệ thống cho phép (SRS Gap) | 1. QTHT đã đăng nhập. 2. Vai trò "OLD_ROLE" trang_thai = VO_HIEU_HOA. | vai_tro: ["OLD_ROLE"] | 1. Click [+ Thêm tài khoản]. 2. Chọn vai trò "OLD_ROLE" (đã vô hiệu hóa). 3. Click [Lưu]. | 1. **SRS Gap**: Form SCR-VIII-03 chỉ ghi "Vai trò \| multi-select \| Bắt buộc" — không có filter WHERE trang_thai = KICH_HOAT. 2. Error handling chỉ có ERR-TK-06 "Vai trò ID {id} không tồn tại" — KHÔNG check trạng thái. 3. Kỳ vọng: Dropdown NÊN chỉ hiển thị vai trò KICH_HOAT. | Edge | 🔴 |
| TC-TK-E03 | FR-VIII-15 | Email format sai (không theo RFC 5322) → lỗi | 1. QTHT đã đăng nhập. | email: "not-an-email" | 1. Nhập email = "not-an-email". 2. Click [Lưu]. | 1. Lỗi: Email không hợp lệ (SRS: "Định dạng email hợp lệ theo chuẩn RFC 5322" — FR-VIII-15 Inputs). | Negative | 🟢 |
| TC-TK-E04 | FR-VIII-15 | Tạo TK không chọn loại tài khoản (bắt buộc) → lỗi | 1. QTHT đã đăng nhập. | loai_tai_khoan: (trống) | 1. Click [+ Thêm tài khoản]. 2. Điền hợp lệ nhưng bỏ trống Loại tài khoản. 3. Click [Lưu]. | 1. Lỗi validate: Loại tài khoản là bắt buộc (SRS: "loai_tai_khoan: Bắt buộc Y" — FR-VIII-15 Inputs). | Negative | 🟢 |
| TC-TK-E05 | FR-VIII-15 | Tạo TK không chọn đơn vị (bắt buộc) → lỗi | 1. QTHT đã đăng nhập. | don_vi_id: (trống) | 1. Click [+ Thêm tài khoản]. 2. Bỏ trống Đơn vị. 3. Click [Lưu]. | 1. Lỗi validate: Đơn vị là bắt buộc (SRS: "don_vi_id: Bắt buộc Y" — FR-VIII-15 Inputs). | Negative | 🟢 |
| TC-TK-E06 | FR-VIII-15 / BR-AUTH-07 | Sai MK 5 lần từ các IP khác nhau → vẫn khóa (counter global) | 1. TK "nv_test_01" đang HOAT_DONG. | 5 lần sai từ 5 IP khác nhau | 1. Đăng nhập sai lần 1 từ IP_A. 2. Sai lần 2 từ IP_B. ... 5. Sai lần 5 từ IP_E. | 1. Trang_thai → TAM_KHOA sau lần 5 (SRS BR-AUTH-07: "sai 5 lần liên tiếp" — counter gắn per-account, không per-IP). | Edge | 🟡 |
| TC-TK-E07 | FR-VIII-15 / SM-TAIKHOAN | Token kích hoạt đã sử dụng 1 lần → click lại lần 2 | 1. QTHT tạo TK "new_user". 2. User đã click link kích hoạt → TK chuyển HOAT_DONG. | Link kích hoạt cũ | 1. User click lại link kích hoạt đã sử dụng. | 1. Token đã hết hiệu lực sau lần sử dụng đầu tiên (one-time-use). 2. Hiển thị lỗi: Link kích hoạt không còn hiệu lực. | Edge | 🟡 |
| TC-TK-E08 | FR-VIII-15 / BR-EC-01 | Optimistic locking khi sửa tài khoản | 1. QTHT A và QTHT B cùng mở sửa TK "nv_test_01". | User A đổi họ tên, User B đổi đơn vị | 1. User A mở form sửa (updated_at = T1). 2. User B mở cùng TK (updated_at = T1). 3. User A lưu → thành công. 4. User B lưu → check updated_at. | 1. User B: lỗi ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang" (SRS BR-EC-01: Optimistic Locking áp dụng cho mọi UPDATE/DELETE). | Edge | 🟡 |

---

## FILE 3: `03-TC-phan-quyen-du-lieu.md` (UC114 / FR-VIII-16)

### Findings: 4 edge cases thiếu

| ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|------------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| TC-PQD-E01 | FR-VIII-16 / ERR-AUTH-01 | User không phải QTHT cố truy cập phân quyền dữ liệu → lỗi | 1. User CB_NV đã đăng nhập. | — | 1. Cố truy cập URL SCR-VIII-05. | 1. Lỗi ERR-AUTH-01: "Bạn không có quyền thực hiện chức năng này" (SRS: Permission Matrix — chỉ QTHT có CRUD cho PHAN_QUYEN_DU_LIEU). | Negative | 🟢 |
| TC-PQD-E02 | FR-VIII-16 | Vai trò có cap = 'DP' nhưng QTHT tick cấp TW → SRS không chặn (Gap) | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_DP" có cap = 'DP'. | Tick node TW (Cục BLDS&KT) | 1. Chọn vai trò CB_NV_DP (cap = DP). 2. Tick node TW trên cây đơn vị. 3. Click [Lưu]. | 1. **SRS Gap**: Hệ thống chỉ chặn chọn ngang cấp (ERR-PQ-01) nhưng KHÔNG validate sự tương thích giữa VAI_TRO.cap và DON_VI.cap. 2. Kỳ vọng: NÊN cảnh báo rằng vai trò ĐP không nên có quyền xem dữ liệu TW. | Edge | 🟡 |
| TC-PQD-E03 | FR-VIII-16 | Đơn vị bị TẠM DỪNG (trang_thai = TAM_DUNG) nhưng phân quyền vẫn trỏ đến → stale reference | 1. Đơn vị "Phòng cũ" đã bị TẠM DỪNG. 2. Vai trò "TEST_ROLE" đang có quyền xem "Phòng cũ". | — | 1. QTHT tạm dừng đơn vị "Phòng cũ" (DON_VI.trang_thai = TAM_DUNG). 2. Kiểm tra phân quyền dữ liệu của vai trò "TEST_ROLE". | 1. **SRS Gap**: Không có rule tự động vô hiệu hóa hay dọn dẹp phân quyền khi đơn vị bị tạm dừng (SRS có DON_VI.trang_thai = TAM_DUNG nhưng không liên kết với PHAN_QUYEN_DU_LIEU). 2. Phân quyền stale vẫn tồn tại → user có thể vẫn \\\"thấy\\\" data old. | Edge | 🟡 |
| TC-PQD-E04 | FR-VIII-16 / BR-EC-01 | 2 QTHT phân quyền dữ liệu cùng vai trò cùng lúc → Optimistic Lock | 1. QTHT A và QTHT B cùng chọn vai trò "CB_NV_TW" trên SCR-VIII-05. | QTHT A chọn 3 đơn vị, QTHT B chọn 5 đơn vị | 1. QTHT A load phân quyền vai trò CB_NV_TW. 2. QTHT B load cùng lúc. 3. QTHT A lưu 3 đơn vị → thành công. 4. QTHT B lưu 5 đơn vị → check version. | 1. QTHT B: lỗi ERR-SYS-02 (SRS BR-EC-01: Optimistic Locking áp dụng cho mọi UPDATE). 2. Lưu phân quyền UC114 dùng transaction "xóa cũ + tạo mới" (FR-VIII-16 Processing) nên phải check version. | Edge | 🟡 |

---

## FILE 4: `04-TC-phan-quyen-chuc-nang.md` (UC115 / FR-VIII-17)

### Findings: 3 edge cases thiếu

| ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|------------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| TC-PQCN-E01 | FR-VIII-17 / BR-EC-01 | 2 QTHT phân quyền chức năng cùng vai trò cùng lúc → Optimistic Lock | 1. QTHT A và QTHT B cùng chọn vai trò "CB_NV_TW" trên SCR-VIII-04. | QTHT A tick Xem+Thêm module Hỏi đáp, QTHT B tick Xem+Sửa module Vụ việc | 1. QTHT A load ma trận quyền CB_NV_TW. 2. QTHT B load cùng lúc. 3. QTHT A lưu → thành công. 4. QTHT B lưu → check version. | 1. QTHT B: lỗi ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang" (SRS BR-EC-01: Optimistic Locking áp dụng cho mọi thao tác cập nhật). | Edge | 🟡 |
| TC-PQCN-E02 | FR-VIII-17 | Phân quyền cho vai trò đã bị vô hiệu hóa → SRS cho phép (không chặn) | 1. QTHT đã đăng nhập. 2. Vai trò "OLD_ROLE" trang_thai = VO_HIEU_HOA. | — | 1. Chọn "OLD_ROLE" từ dropdown vai trò. 2. Tick quyền Xem cho module Hỏi đáp. 3. Click [Lưu phân quyền]. | 1. Dropdown không filter vai trò theo trạng thái (SRS SCR-VIII-04: "Dropdown chọn vai trò" — không có WHERE KICH_HOAT). 2. Lưu thành công nhưng vô nghĩa (vai trò đã VO_HIEU_HOA → không user nào hưởng quyền). | Edge | 🟢 |
| TC-PQCN-E03 | FR-VIII-17 / BR-PQ-03 | Click header cột → uncheck tất cả dòng (toggle behavior) | 1. QTHT đã đăng nhập. 2. Tất cả module đã tick cột "Xem". | — | 1. Click header cột "Xem" (lần 2 — đã check all). | 1. SRS ghi "Click header cột → check/uncheck tất cả dòng" (FR-VIII-17). 2. Lần 2 click → toggle uncheck tất cả ở cột "Xem". 3. Nếu đây là quyền duy nhất → vai trò mất toàn bộ khả năng xem. | Edge | 🟢 |

---

## TỔNG KẾT

| File TC | Edge Cases Thiếu | 🔴 Critical | 🟡 Medium | 🟢 Low |
|---------|-------------------|-------------|-----------|--------|
| 01 - Vai trò (UC112) | 3 | 1 | 1 | 1 |
| 02 - Tài khoản (UC113) | 8 | 2 | 3 | 3 |
| 03 - PQ Dữ liệu (UC114) | 4 | 0 | 3 | 1 |
| 04 - PQ Chức năng (UC115) | 3 | 0 | 1 | 2 |
| **TỔNG** | **18** | **3** | **8** | **7** |

### 3 CRITICAL FINDINGS cần ưu tiên:

1. **TC-VT-E01** — Toggle OFF vai trò đang gán TK → user online không bị kick (Gap SM không cover role deactivation)
2. **TC-TK-E01** — QTHT tự vô hiệu hóa chính TK mình → hệ thống đứng (No self-lockout protection)
3. **TC-TK-E02** — Gán vai trò đã VO_HIEU_HOA cho TK mới → validation thiếu (Gap SCR-VIII-03 no filter)
