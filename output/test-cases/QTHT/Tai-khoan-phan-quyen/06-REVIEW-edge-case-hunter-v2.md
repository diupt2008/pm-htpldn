# Edge Case Hunter Review V2 — Tài Khoản & Phân Quyền (UC112-UC115)

> **Review Date**: 2026-04-18  
> **Reviewer**: Edge Case Hunter V2 (Deep Exhaustive Path Analysis)  
> **Scope**: 4 file TC: `01-TC-quan-ly-vai-tro.md`, `02-TC-quan-ly-tai-khoan.md`, `03-TC-phan-quyen-du-lieu.md`, `04-TC-phan-quyen-chuc-nang.md`  
> **Nguồn xác minh**: NotebookLM Session `dd619fe9` (2 lượt deep query)  
> **Phương pháp**: Deep path enumeration lần 2 — quét lại toàn bộ nhánh rẽ, xác minh SRS nguyên văn, chỉ report path ĐÃ BỊ BỎ SÓT sau review V1  
> **Review V1 tham chiếu**: `05-REVIEW-edge-case-hunter.md` (18 edge cases, đã tích hợp vào TC)

---

## Quy ước

- **TraceID**: Ánh xạ 1-1 chính xác với mã SRS gốc từ NotebookLM — KHÔNG tự chế
- **Kết quả mong đợi**: Trích nguyên văn hoặc bám sát SRS
- **Target File**: File TC cần bổ sung nếu user confirm
- **Severity**: 🔴 Critical | 🟡 High | 🟢 Medium
- **Status**: ⬜ Chờ confirm | ✅ Đã tích hợp

---

## FILE 1: `01-TC-quan-ly-vai-tro.md` (UC112 / FR-VIII-14)

### Findings: 5 edge cases mới

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|------------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-VT-025 | FR-VIII-14 | Sửa mã vai trò (ma_vai_tro) — SRS cho phép edit mã sau khi tạo | 1. QTHT đã đăng nhập. 2. Vai trò "KIEM_TOAN" tồn tại, đang gán cho 3 TK. | ma_vai_tro cũ: "KIEM_TOAN" → mới: "KT_NOI_BO" | 1. Click [Sửa] vai trò "KIEM_TOAN". 2. Đổi Mã thành "KT_NOI_BO". 3. Click [Lưu]. | 1. **SRS xác nhận**: Trường ma_vai_tro KHÔNG có ghi chú `(readonly)` trong Form CRUD Modal SCR-VIII-02 — QTHT có thể sửa mã sau tạo (khác với mã nghiệp vụ `(auto)` như ma_vu_viec). 2. Nếu thành công: mã cũ "KIEM_TOAN" → "KT_NOI_BO", cần kiểm tra liên kết TAI_KHOAN_VAI_TRO vẫn intact. 3. AUDIT_LOG ghi UPDATE với du_lieu_cu chứa mã cũ. | Edge | 🔴 |
| 2 | TC-VT-026 | FR-VIII-14 | Mã vai trò không có MAX LENGTH — nhập mã 500 ký tự | 1. QTHT đã đăng nhập. | ma_vai_tro: "A" × 500 (500 ký tự) | 1. Click [+ Thêm vai trò]. 2. Nhập Mã = chuỗi 500 ký tự. 3. Click [Lưu]. | 1. **SRS Gap**: FR-VIII-14 Inputs KHÔNG quy định MAX LENGTH cho ma_vai_tro (khác với Danh mục chung có "Mã danh mục max 20 ký tự", khác với Username có "4-50 ký tự"). 2. Kiểm tra: DB có thể reject nếu cột VARCHAR có giới hạn, hoặc chấp nhận → hiển thị UI bị tràn cột. | Edge | 🟡 |
| 3 | TC-VT-027 | FR-VIII-14 | Mã vai trò không có format restriction — nhập chữ thường, dấu cách, ký tự đặc biệt | 1. QTHT đã đăng nhập. | ma_vai_tro: "vai trò @#$" | 1. Click [+ Thêm vai trò]. 2. Nhập Mã = "vai trò @#$" (chứa dấu cách + ký tự đặc biệt). 3. Click [Lưu]. | 1. **SRS Gap**: FR-VIII-14 Inputs KHÔNG có ràng buộc format/regex cho ma_vai_tro (khác với Username có "chữ+số+gạch_dưới" ERR-TK-04). 2. Kỳ vọng: Hệ thống NÊN chặn ký tự đặc biệt để mã vai trò chuẩn hóa. 3. Hiện tại SRS cho phép lưu bất kỳ ký tự nào. | Edge | 🟡 |
| 4 | TC-VT-028 | FR-VIII-14 | Tên vai trò không có MAX LENGTH — nhập tên 1000 ký tự | 1. QTHT đã đăng nhập. | ten_vai_tro: "A" × 1000 | 1. Click [+ Thêm vai trò]. 2. Nhập Mã hợp lệ. 3. Nhập Tên = chuỗi 1000 ký tự. 4. Click [Lưu]. | 1. **SRS Gap**: FR-VIII-14 Inputs KHÔNG quy định MAX LENGTH cho ten_vai_tro. 2. Kiểm tra: DB varchar limit hoặc UI truncation behavior. | Edge | 🟢 |
| 5 | TC-VT-029 | FR-VIII-14 / SCR-VIII-02 | Đếm "Số tài khoản" của vai trò — có bao gồm TK bị VO_HIEU_HOA/is_deleted? | 1. QTHT đã đăng nhập. 2. Vai trò "CB_NV_TW" gán cho 5 TK: 3 HOAT_DONG + 1 VO_HIEU_HOA + 1 TAM_KHOA. | — | 1. Truy cập danh sách vai trò SCR-VIII-02. 2. Quan sát cột "Số tài khoản" của vai trò "CB_NV_TW". | 1. **SRS Gap**: SCR-VIII-02 mô tả cột này chỉ là "Số TK đang gán" — KHÔNG định nghĩa filter trang_thai (có loại trừ VO_HIEU_HOA/TAM_KHOA hay không). 2. Kiểm tra giá trị hiển thị: 5 (tất cả) hay 3 (chỉ HOAT_DONG). 3. Quyết định DEV: cần clarify với BA. | Edge | 🟡 |

---

## FILE 2: `02-TC-quan-ly-tai-khoan.md` (UC113 / FR-VIII-15)

### Findings: 9 edge cases mới

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|------------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-TK-049 | FR-VIII-15 / SCR-VIII-03 | UI KHÔNG có nút "Xóa" tài khoản — chỉ Khóa/Vô hiệu hóa | 1. QTHT đã đăng nhập. | — | 1. Truy cập danh sách TK SCR-VIII-03. 2. Kiểm tra cột Hành động cho bất kỳ TK nào. | 1. **SRS xác nhận**: Cột Hành động SCR-VIII-03 chỉ có 6 nút: "Xem / Sửa / Mở khóa / Khóa / Gửi lại email / Đổi MK". 2. KHÔNG có nút "Xóa" tài khoản. 3. Hệ thống chỉ hỗ trợ Vô hiệu hóa (VO_HIEU_HOA), KHÔNG hỗ trợ xóa mềm TK qua UI. | Edge | 🔴 |
| 2 | TC-TK-050 | FR-VIII-15 / SCR-VIII-03 | UI thiếu nút "Kích hoạt thủ công" — SM cho phép nhưng không có UI | 1. QTHT đã đăng nhập. 2. TK "new_user" đang CHO_KICH_HOAT. | — | 1. Truy cập danh sách TK, tab "Chờ kích hoạt". 2. Kiểm tra cột Hành động của TK "new_user". | 1. **SRS Gap**: SM-TAIKHOAN ghi trigger "User kích hoạt email / QTHT kích hoạt" cho chuyển CHO_KICH_HOAT → HOAT_DONG. 2. Nhưng UI SCR-VIII-03 KHÔNG có nút kích hoạt thủ công. Nút [Mở khóa] chỉ áp dụng cho TAM_KHOA. 3. QTHT chỉ có [Gửi lại email] — không thể kích hoạt trực tiếp. | Edge | 🔴 |
| 3 | TC-TK-051 | FR-VIII-15 / SM-TAIKHOAN | Tab "Chờ phân quyền" — trạng thái CHO_PHAN_QUYEN vắng mặt trong SM | 1. QTHT đã đăng nhập. 2. User từ UC191 đã click link xác nhận email → TK ở CHO_PHAN_QUYEN. | TK UC191 trạng thái CHO_PHAN_QUYEN | 1. Click tab "Chờ phân quyền" trên SCR-VIII-03. 2. Quan sát danh sách TK. 3. Click nút hành động. | 1. **SRS Conflict**: Trạng thái CHO_PHAN_QUYEN có trong luồng UC191 (FR-VIII-22) và UI SCR-VIII-03 (tab + filter), nhưng VẮNG MẶT trong SM-TAIKHOAN chính thức (chỉ có 4 trạng thái: CHO_KICH_HOAT/HOAT_DONG/TAM_KHOA/VO_HIEU_HOA). 2. QTHT cần thao tác phê duyệt qua Modal SCR-VIII-08a: gán vai trò (bắt buộc) + gán đơn vị (bắt buộc) → Phê duyệt → SET HOAT_DONG. 3. Đây là lỗi logic tài liệu SRS cần ghi nhận. | Edge | 🔴 |
| 4 | TC-TK-052 | FR-VIII-15 | Họ tên (ho_ten) không có MAX LENGTH — nhập 1000 ký tự | 1. QTHT đã đăng nhập. | ho_ten: "Nguyễn" + " Văn" × 200 (> 1000 ký tự) | 1. Click [+ Thêm tài khoản]. 2. Nhập ho_ten chuỗi rất dài. 3. Click [Lưu]. | 1. **SRS Gap**: FR-VIII-15 Inputs chỉ ghi ho_ten "Bắt buộc Y", ràng buộc = trống "—". KHÔNG có MAX LENGTH hay regex. 2. Kiểm tra: UI có cắt/chặn không? DB có reject không? | Edge | 🟢 |
| 5 | TC-TK-053 | FR-VIII-15 | Số điện thoại (dien_thoai) — không bắt buộc và KHÔNG validate format | 1. QTHT đã đăng nhập. | dien_thoai: "abc!@#" | 1. Click [+ Thêm TK]. 2. Nhập SĐT = "abc!@#" (ký tự chữ + đặc biệt). 3. Click [Lưu]. | 1. **SRS xác nhận**: FR-VIII-15 Inputs: dien_thoai "Bắt buộc = N", ràng buộc = "—" (trống). 2. KHÔNG có validate format (khác UC191 user đăng ký — có validate_SDT). 3. Hệ thống có thể lưu bất kỳ chuỗi nào vào trường SĐT. | Edge | 🟡 |
| 6 | TC-TK-054 | FR-VIII-15 / ERR-TK-06 | Gán nhiều vai trò: 1 hợp lệ + 1 không tồn tại → Reject ALL (không partial save) | 1. QTHT đã đăng nhập. | vai_tro_ids: [CB_NV_TW (hợp lệ), 99999 (không tồn tại)] | 1. Click [+ Thêm TK]. 2. Điền đầy đủ thông tin hợp lệ. 3. Chọn 2 vai trò: CB_NV_TW + vai trò ID 99999 (bypass UI dropdown). 4. Click [Lưu]. | 1. **SRS xác nhận**: ERR-TK-06 có Severity = ERROR → block transaction. 2. FR-VIII-15 Processing Bước 6: gán vai trò nằm trong chuỗi xử lý tuần tự → lỗi ERROR ngắt luồng. 3. Kết quả: **Reject ALL** — TK KHÔNG được tạo, KHÔNG partial save. 4. Hiển thị ERR-TK-06: "Vai trò ID 99999 không tồn tại". | Edge | 🟡 |
| 7 | TC-TK-055 | FR-VIII-15 / SCR-VIII-03 | Chuyển tab trạng thái KHÔNG reset bộ lọc tìm kiếm | 1. QTHT đã đăng nhập. 2. Đang ở tab "Tất cả", đã nhập từ khóa "nv_hanoi" trong ô tìm kiếm. | Từ khóa: "nv_hanoi" | 1. Nhập "nv_hanoi" → Enter → kết quả lọc. 2. Click tab "Tạm khóa". | 1. **SRS xác nhận**: Chuyển tab chỉ thêm filter trang_thai = TAM_KHOA (click → filter). 2. BR-UX-01 (URL Sync Filter): tham số lọc đồng bộ URL query params → từ khóa "nv_hanoi" được GIỮ LẠI. 3. Kết quả: Chỉ TK tạm khóa CÓ username chứa "nv_hanoi" mới hiển thị (AND logic). 4. Bộ lọc chỉ reset khi nhấn "Xóa bộ lọc". | Edge | 🟡 |
| 8 | TC-TK-056 | FR-VIII-15 / BR-EC-02 | Xóa mềm TK (nếu có API) → cascade soft-delete TAI_KHOAN_VAI_TRO | 1. Admin DB thực hiện soft-delete TK "test_cascade" (is_deleted=1) — KHÔNG qua UI (vì UI không có nút xóa). | TK "test_cascade" gán 2 vai trò | 1. Cập nhật DB: TAI_KHOAN.is_deleted = 1 cho "test_cascade". 2. Kiểm tra bảng TAI_KHOAN_VAI_TRO. | 1. **SRS xác nhận**: BR-EC-02 (Soft-delete Cascade): "Khi soft-delete bản ghi cha, hệ thống SHALL cascade soft-delete bản ghi con". 2. TAI_KHOAN_VAI_TRO.is_deleted cũng = 1 cho 2 liên kết. 3. ⚠️ Lưu ý: Scenario này chỉ xảy ra ở tầng DB/API, vì UI SCR-VIII-03 KHÔNG có nút xóa TK. | Edge | 🟢 |
| 9 | TC-TK-057 | FR-VIII-15 | Đổi đơn vị (don_vi_id) cho TK → phân quyền dữ liệu (UC114) KHÔNG tự cập nhật | 1. TK "nv_hanoi" thuộc đơn vị "Sở TP Hà Nội". Vai trò CB_NV_DP phân quyền xem "Sở TP Hà Nội". 2. QTHT đổi đơn vị TK sang "Sở TP HCM". | don_vi_id cũ: Sở TP Hà Nội → mới: Sở TP HCM | 1. QTHT sửa TK "nv_hanoi", đổi đơn vị → "Sở TP HCM". 2. Click [Lưu]. 3. User "nv_hanoi" truy cập dữ liệu. | 1. **SRS xác nhận**: UC114 phân quyền gán cho VAI_TRO (không gán cho TK). Đổi don_vi_id KHÔNG trigger cập nhật PHAN_QUYEN_DU_LIEU. 2. Kết quả: User "nv_hanoi" nhìn dữ liệu theo quyền của VAI_TRO (CB_NV_DP → Sở TP Hà Nội), KHÔNG tự thấy "Sở TP HCM". 3. QTHT phải cập nhật phân quyền dữ liệu riêng nếu muốn. | Edge | 🟡 |

---

## FILE 3: `03-TC-phan-quyen-du-lieu.md` (UC114 / FR-VIII-16)

### Findings: 3 edge cases mới

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|------------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-PQD-018 | FR-VIII-16 / BR-PQ-02 | Lưu phân quyền: 1 đơn vị không tồn tại trong batch → Reject ALL (atomic transaction) | 1. QTHT đã đăng nhập. 2. Chọn vai trò cần phân quyền. | Tick 3 đơn vị hợp lệ + 1 đơn vị đã bị xóa (ID = 99999 bypass UI) | 1. Gửi API lưu phân quyền với 4 đơn vị, trong đó 1 không tồn tại. | 1. **SRS xác nhận**: FR-VIII-16 Processing Bước 6: "Xóa toàn bộ quyền dữ liệu cũ + tạo quyền mới cho vai trò (trong 1 giao dịch)". SCR-VIII-05: "click → lưu trong 1 transaction". 2. Transaction atomic: lỗi bất kỳ đơn vị nào → **rollback toàn bộ**. 3. ERR-PQ-03: "Đơn vị ID 99999 không tồn tại". 4. Quyền cũ GIỮ NGUYÊN (rollback). | Edge | 🟡 |
| 2 | TC-PQD-019 | FR-VIII-16 / BR-PQ-01 | Check cha: cây đơn vị 3 cấp → đệ quy auto check TW → BN → ĐP | 1. QTHT đã đăng nhập. 2. Cây: TW (Cục BLDS&KT) → BN (Bộ Công Thương, Bộ Tài Chính) → ĐP (4 Sở). | — | 1. Chọn vai trò QTHT. 2. Tick checkbox node TW (Cục BLDS&KT). | 1. **SRS xác nhận**: SCR-VIII-05: "check cha → auto check con", cây phân cấp 3 cấp (TW → BN → ĐP). 2. Đệ quy: Tick TW → auto tick TẤT CẢ BN (2 đơn vị) → auto tick TẤT CẢ ĐP (4 đơn vị). 3. Tổng cộng: 7 đơn vị được đánh dấu (1 TW + 2 BN + 4 ĐP). 4. Danh sách đã chọn hiển thị 7 tag. | Edge | 🟢 |
| 3 | TC-PQD-020 | FR-VIII-16 | Uncheck 1 con → cha chuyển "indeterminate" thay vì unchecked | 1. QTHT đã đăng nhập. 2. Đã tick TW → tất cả con được tick. | — | 1. Bỏ tick 1 đơn vị ĐP (Sở TP Hà Nội). 2. Quan sát node cha (BN Hà Nội) và node gốc (TW). | 1. Node BN Hà Nội chuyển trạng thái "indeterminate" (nửa tick □). 2. Node TW cũng chuyển "indeterminate". 3. Tag "Sở TP Hà Nội" biến mất khỏi danh sách đã chọn. 4. Chỉ còn 6/7 đơn vị được chọn. | Edge | 🟢 |

---

## FILE 4: `04-TC-phan-quyen-chuc-nang.md` (UC115 / FR-VIII-17)

### Findings: 4 edge cases mới

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|------------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-PQCN-019 | FR-VIII-17 / SCR-VIII-04 | Nút [Reset về mặc định] — SRS Gap: không rõ "mặc định" là gì | 1. QTHT đã đăng nhập. 2. Vai trò CB_NV_TW đã thay đổi quyền (tick thêm Sửa+Xóa module Hỏi đáp). | — | 1. Chọn vai trò CB_NV_TW. 2. Click [Reset về mặc định]. 3. Modal xác nhận hiện ra → Xác nhận. 4. Quan sát ma trận checkbox. | 1. **SRS Gap nghiêm trọng**: SCR-VIII-04 chỉ ghi "click → modal xác nhận". SRS KHÔNG định nghĩa "mặc định" là gì: (a) Xóa sạch/uncheck toàn bộ? (b) Trả về phân quyền seed data ban đầu? (c) Khôi phục lần lưu cuối? 2. Cần clarify với BA/CĐT. 3. Kiểm tra hành vi thực tế và so sánh với expectation. | Edge | 🔴 |
| 2 | TC-PQCN-020 | FR-VIII-17 / SCR-VIII-04 | Ma trận quyền: 6 cột chính xác (Xem, Thêm, Sửa, Xóa, Phê duyệt, Xuất) | 1. QTHT đã đăng nhập. | — | 1. Chọn bất kỳ vai trò. 2. Kiểm tra header cột của ma trận. | 1. **SRS xác nhận**: SCR-VIII-04 liệt kê chính xác 6 cột quyền: **Xem / Thêm / Sửa / Xóa / Phê duyệt / Xuất**. 2. Kiểm tra đầy đủ 6 cột hiển thị, không thừa không thiếu. | Happy | 🟢 |
| 3 | TC-PQCN-021 | FR-VIII-17 / SCR-VIII-04 | Ma trận quyền: số hàng (modules) — SRS không liệt kê chính xác | 1. QTHT đã đăng nhập. | — | 1. Chọn vai trò bất kỳ. 2. Đếm số hàng module trong ma trận (cây menu). | 1. **SRS Gap**: SCR-VIII-04 chỉ ghi "Cây menu (cột trái) | Phân cấp module: Dashboard / Hỏi đáp / Đào tạo / ...". KHÔNG liệt kê đầy đủ tất cả module + submenu. 2. Kiểm tra số hàng thực tế trên UI vs danh sách module trong hệ thống. 3. Mỗi module cha có thể có nhiều submenu con → số hàng có thể > 20. | Edge | 🟡 |
| 4 | TC-PQCN-022 | FR-VIII-17 | Tick "Phê duyệt" cho module không có luồng phê duyệt → quyền vô nghĩa | 1. QTHT đã đăng nhập. 2. Module "Danh mục chung" KHÔNG có luồng phê duyệt trong SRS. | — | 1. Chọn vai trò CB_NV_TW. 2. Tick cột "Phê duyệt" cho module "Danh mục chung". 3. Click [Lưu phân quyền]. | 1. Hệ thống cho phép lưu (ma trận không validate nghiệp vụ cross-module). 2. **Logic hole**: Quyền "Phê duyệt" vô nghĩa cho module không có workflow phê duyệt — nhưng SRS không chặn. 3. Không gây lỗi, nhưng tạo confusion cho QTHT. | Edge | 🟢 |

---

## TỔNG KẾT REVIEW V2

| File TC | Edge Cases Mới | 🔴 Critical | 🟡 High | 🟢 Medium |
|---------|----------------|-------------|---------|----------|
| 01 - Vai trò (UC112) | 5 | 1 | 3 | 1 |
| 02 - Tài khoản (UC113) | 9 | 3 | 4 | 2 |
| 03 - PQ Dữ liệu (UC114) | 3 | 0 | 1 | 2 |
| 04 - PQ Chức năng (UC115) | 4 | 1 | 1 | 2 |
| **TỔNG V2** | **21** | **5** | **9** | **7** |

### So sánh với Review V1

| Metric | V1 | V2 | Cộng dồn |
|--------|----|----|----------|
| Tổng edge cases | 18 | 21 | **39** |
| 🔴 Critical | 3 | 5 | **8** |
| 🟡 High | 8 | 9 | **17** |
| 🟢 Medium | 7 | 7 | **14** |

---

## TOP 5 CRITICAL FINDINGS (V2)

| # | ID | File TC | Phát hiện | Nguồn SRS |
|---|-----|---------|-----------|-----------|
| 1 | TC-TK-049 | 02-TC | UI KHÔNG có nút "Xóa" TK — chỉ Khóa (VO_HIEU_HOA). Phải xóa test case xóa TK nếu có. | SCR-VIII-03: cột Hành động |
| 2 | TC-TK-050 | 02-TC | UI thiếu nút "Kích hoạt thủ công" — SM cho phép nhưng UI không có nút | SM-TAIKHOAN vs SCR-VIII-03 |
| 3 | TC-TK-051 | 02-TC | Trạng thái CHO_PHAN_QUYEN vắng mặt khỏi SM-TAIKHOAN chính thức — lỗi logic SRS | SM-TAIKHOAN vs FR-VIII-22 |
| 4 | TC-VT-025 | 01-TC | SRS cho phép sửa Mã vai trò sau tạo (không readonly) — rủi ro phá vỡ liên kết | FR-VIII-14 Inputs |
| 5 | TC-PQCN-019 | 04-TC | Nút [Reset về mặc định] không định nghĩa "mặc định" là gì — SRS Gap nghiêm trọng | SCR-VIII-04 |

---

## SRS GAPS MỚI PHÁT HIỆN (V2)

| # | Gap | UC | Mức rủi ro | Trích dẫn SRS |
|---|-----|----|------------|---------------|
| GAP-08 | ma_vai_tro + ten_vai_tro không có MAX LENGTH | UC112 | Trung bình | FR-VIII-14 Inputs: ràng buộc trống |
| GAP-09 | ma_vai_tro không có format restriction (regex) | UC112 | Trung bình | FR-VIII-14 Inputs: không có ràng buộc format |
| GAP-10 | UI SCR-VIII-03 không có nút xóa TK | UC113 | Cao | SCR-VIII-03: cột Hành động |
| GAP-11 | UI thiếu nút kích hoạt thủ công TK cho QTHT | UC113 | Cao | SM-TAIKHOAN vs SCR-VIII-03 |
| GAP-12 | CHO_PHAN_QUYEN vắng mặt trong SM-TAIKHOAN chính thức | UC113 | Cao | SM-TAIKHOAN: chỉ 4 trạng thái |
| GAP-13 | ho_ten không có MAX LENGTH | UC113 | Thấp | FR-VIII-15 Inputs: ràng buộc trống |
| GAP-14 | dien_thoai (QTHT tạo) không validate format | UC113 | Trung bình | FR-VIII-15 Inputs: Bắt buộc=N, ràng buộc trống |
| GAP-15 | Đếm "Số TK" vai trò: không rõ filter trang_thai | UC112 | Trung bình | SCR-VIII-02: "Số TK đang gán" |
| GAP-16 | [Reset về mặc định] UC115: không định nghĩa target state | UC115 | Cao | SCR-VIII-04: "click → modal xác nhận" |
| GAP-17 | Ma trận UC115: không liệt kê đầy đủ hàng module | UC115 | Trung bình | SCR-VIII-04: "Cây menu..." |
