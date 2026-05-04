# Test Cases — FR-II-06 (UC15): Phân công Xử lý Câu hỏi (SRS-FR-02)

> **SRS Ref**: FR-II-06 (UC15), SCR-II-02 / SCR-II-03 (Modal Phân công), Entity HOI_DAP, CAU_HINH_PHAN_CONG  
> **Nguồn**: NotebookLM Session `7176b671`  
> **Ngày tạo**: 2026-04-18  
> **Đặc thù**: Modal gợi ý danh sách CB/TVV theo lĩnh vực + workload. Cảnh báo quá tải. Mapping từ FR-II-NEW-01.

---

## Quy ước

| Ký hiệu | Ý nghĩa |
|----------|---------|
| **TraceID** | Ánh xạ 1-1 chính xác với mã yêu cầu gốc trong SRS. **TUYỆT ĐỐI KHÔNG tự chế mã.** |
| **Happy** | Luồng chính — dữ liệu hợp lệ, quyền đúng |
| **Negative** | Luồng lỗi — dữ liệu sai, thiếu quyền, vi phạm ràng buộc |
| **Edge** | Ranh giới — boundary values, SRS gap |

---

## Logic phân công (SCR-II-03)

1. CB NV mở form phân công (Modal) từ SCR-II-02
2. Hệ thống tải danh sách CB/TVV đã mapping khớp lĩnh vực (từ CAU_HINH_PHAN_CONG / FR-II-NEW-01)
3. Loại trừ tài khoản đã bị khóa/vô hiệu hóa
4. Tính toán Workload hiện tại (đếm số yêu cầu đang xử lý)
5. Sắp xếp: uu_tien ASC → workload ASC
6. Nếu chọn người workload vượt ngưỡng → nhãn cảnh báo đỏ (WRN-PC-01), KHÔNG chặn

---

## A. PHÂN CÔNG — HAPPY PATH

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PC-001 | FR-II-06 | Phân công xử lý thành công — gợi ý theo lĩnh vực | 1. User CB_NV đã đăng nhập. 2. Bản ghi HD-030 ở TIEP_NHAN, lĩnh vực = "Doanh nghiệp". 3. Đã cấu hình mapping lĩnh vực "Doanh nghiệp" ↔ [CB_A, CB_B] (FR-II-NEW-01). | — | 1. Mở chi tiết HD-030. 2. Nhấn [Phân công]. 3. Modal SCR-II-03 hiện lên. 4. Chọn CB_A. 5. Nhập ghi chú. 6. Click [Xác nhận]. | 1. Modal hiện danh sách gợi ý chỉ gồm CB_A, CB_B (khớp lĩnh vực). 2. Sắp xếp theo uu_tien ASC, workload ASC. 3. Trạng thái: TIEP_NHAN → DA_PHAN_CONG (hoặc DANG_XU_LY). 4. Gán nguoi_xu_ly_id = CB_A. 5. Gửi thông báo in-app + email cho CB_A. 6. AUDIT_LOG ghi phân công. | Happy |
| TC-PC-002 | FR-II-06 | Phân công lại (re-assign) — thay đổi người xử lý | 1. User CB_NV đã đăng nhập. 2. HD-031 ở DA_PHAN_CONG, nguoi_xu_ly = CB_A. | nguoi_xu_ly mới: CB_B | 1. Mở chi tiết HD-031 (DA_PHAN_CONG). 2. Nhấn [Phân công]. 3. Chọn CB_B thay CB_A. 4. Click [Xác nhận]. | 1. Cập nhật nguoi_xu_ly_id = CB_B. 2. Gửi thông báo cho CB_B (người mới). 3. AUDIT_LOG ghi thay đổi (CB_A → CB_B). | Happy |
| TC-PC-003 | FR-II-06 / WRN-PC-01 | Phân công cho CB có workload quá tải — cảnh báo nhưng vẫn cho phép | 1. User CB_NV đã đăng nhập. 2. HD-032 ở TIEP_NHAN. 3. CB_C đang xử lý 15 yêu cầu (vượt ngưỡng). | chọn CB_C | 1. Mở phân công HD-032. 2. Danh sách gợi ý hiển thị CB_C với nhãn cảnh báo đỏ. 3. Chọn CB_C. 4. Click [Xác nhận]. | 1. WRN-PC-01: "CB {CB_C} đang xử lý {15} yêu cầu. Xác nhận phân công?". 2. Nhãn cảnh báo đỏ hiển thị trên dòng CB_C. 3. Cho phép lưu sau khi xác nhận (WARNING, KHÔNG block). | Happy |

---

## B. PHÂN CÔNG — NEGATIVE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PC-004 | FR-II-06 / ERR-PC-01 | Phân công cho CB đã bị vô hiệu hóa → lỗi | 1. User CB_NV đã đăng nhập. 2. HD-033 ở TIEP_NHAN. 3. CB_D đã bị vô hiệu hóa tài khoản. | chọn CB_D (disabled) | 1. Mở phân công HD-033. 2. Thử chọn CB_D (nếu vẫn xuất hiện). 3. Click [Xác nhận]. | 1. Lỗi ERR-PC-01: "Người được chọn đã bị vô hiệu hóa". 2. Hệ thống chặn phân công. 3. CB_D bị loại trừ khỏi danh sách gợi ý (validation ở cả UI và API). | Negative |
| TC-PC-005 | FR-II-06 / ERR-PC-02 | Phân công khi trạng thái không hợp lệ (HOAN_THANH) → lỗi | 1. User CB_NV đã đăng nhập. 2. HD-034 ở HOAN_THANH. | — | 1. Thử nhấn [Phân công] cho HD-034 (HOAN_THANH). | 1. Nút [Phân công] bị ẩn cho trạng thái HOAN_THANH. 2. Nếu API: ERR-PC-02: "Hỏi đáp ở trạng thái 'HOAN_THANH' không thể phân công". | Negative |
| TC-PC-006 | FR-II-06 | Phân công mà không chọn người xử lý → bị chặn | 1. User CB_NV đã đăng nhập. 2. HD-035 ở TIEP_NHAN. | nguoi_xu_ly: null | 1. Mở phân công HD-035. 2. Không chọn người xử lý. 3. Click [Xác nhận]. | 1. Hệ thống yêu cầu chọn người xử lý. 2. Nút [Xác nhận] bị disabled hoặc báo lỗi validation. | Negative |

---

## C. PHÂN CÔNG — EDGE CASES

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PC-007 | FR-II-06 / FR-II-NEW-01 | 🟡 Lĩnh vực chưa có mapping → danh sách gợi ý trống | 1. User CB_NV đã đăng nhập. 2. HD-036 ở TIEP_NHAN, lĩnh vực = "Thuế" (chưa mapping CB nào). | — | 1. Mở phân công HD-036. 2. Kiểm tra danh sách gợi ý. | 1. Danh sách gợi ý TRỐNG (không có CB mapping cho lĩnh vực "Thuế"). 2. CB NV vẫn có thể chọn thủ công từ dropdown toàn bộ CB hoặc hệ thống thông báo "Chưa có cấu hình phân công cho lĩnh vực này". | Edge |
| TC-PC-008 | FR-II-06 | 🟡 Workload display — kiểm tra đếm chính xác | 1. User CB_NV đã đăng nhập. 2. CB_A đang phân công 3 yêu cầu (DANG_XU_LY). | — | 1. Mở phân công bất kỳ bản ghi TIEP_NHAN. 2. Kiểm tra workload hiển thị của CB_A. | 1. Workload CB_A hiển thị đúng = 3. 2. Đếm từ số yêu cầu đang xử lý (trang_thai = DANG_XU_LY hoặc DA_PHAN_CONG). | Edge |
| TC-PC-009 | FR-II-06 / BR-AUTH-08 | 🟡 CB NV BN phân công — danh sách gợi ý chỉ hiện CB cùng đơn vị | 1. User CB_NV_BN đã đăng nhập. 2. HD-037 ở TIEP_NHAN, thuộc đơn vị BN. | — | 1. Mở phân công HD-037. 2. Kiểm tra danh sách CB gợi ý. | 1. Chỉ hiện CB thuộc cùng đơn vị BN (Row-Level Security). 2. KHÔNG hiện CB TW, BN khác, ĐP. | Edge |
| TC-PC-010 | FR-II-06 | 🟢 Phân công + đặt thời hạn tùy chỉnh (override SLA default) | 1. User CB_NV đã đăng nhập. 2. HD-038 ở TIEP_NHAN. 3. SLA mặc định = 5 ngày. | thoi_han: 10 ngày | 1. Mở phân công HD-038. 2. Ô thời hạn hiện mặc định theo SLA. 3. Sửa thời hạn = 10 ngày. 4. Click [Xác nhận]. | 1. Phân công thành công với thời hạn = 10 ngày (override SLA default). 2. Deadline tính theo giá trị tùy chỉnh. | Edge |

---

## D. EDGE CASES BỔ SUNG — PHÂN CÔNG

> **Nguồn bổ sung**: Edge Case Review `edge-case-review-FR02.md` — NotebookLM Session `d51cd9c3`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PC-011 | FR-II-06 | 🟡 Tất cả CB khớp lĩnh vực đều bị vô hiệu hóa → danh sách gợi ý trống | 1. User CB_NV đã đăng nhập. 2. HD-100 ở TIEP_NHAN, lĩnh vực "Lao động". 3. Tất cả CB mapping "Lao động" đều có is_active=0. | — | 1. Mở phân công HD-100. 2. Kiểm tra danh sách gợi ý. | 1. Danh sách gợi ý TRỐNG (tất cả CB bị loại do vô hiệu hóa ERR-PC-01). 2. CB NV có thể chọn thủ công từ dropdown toàn bộ CB hoặc hệ thống thông báo không có CB phù hợp. | Edge |
| TC-PC-012 | FR-II-06 / BR-EC-01 | 🟢 2 CB NV cùng phân công cho cùng 1 bản ghi → Optimistic Locking | 1. CB_NV_A và CB_NV_B cùng đăng nhập. 2. HD-101 ở TIEP_NHAN, cả 2 mở cùng lúc. | CB_NV_A chọn CB_X, CB_NV_B chọn CB_Y | 1. CB_NV_A phân công cho CB_X → thành công. 2. CB_NV_B phân công cho CB_Y (updated_at đã thay đổi). | 1. CB_NV_A thành công. 2. CB_NV_B nhận ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang". | Edge |

---

<!-- 
TRACEABILITY:
- ERR-PC-01/02 lấy nguyên văn từ SRS qua NotebookLM
- WRN-PC-01: Cảnh báo workload quá tải (WARNING, không block)
- FR-II-NEW-01: Cấu hình mapping lĩnh vực ↔ CB/TVV
- Section D bổ sung từ Edge Case Review 2026-04-18 (Session d51cd9c3)
-->
