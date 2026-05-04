# Test Cases — FR-II-03 (UC12): Tiếp nhận Xử lý Hỏi đáp (SRS-FR-02)

> **SRS Ref**: FR-II-03 (UC12), SCR-II-01 / SCR-II-02, Entity HOI_DAP  
> **Nguồn**: NotebookLM Session `7176b671`  
> **Ngày tạo**: 2026-04-18  
> **Đặc thù**: Chuyển trạng thái MOI → TIEP_NHAN. Optimistic Locking chống race condition. Bắt đầu tính SLA.

---

## Quy ước

| Ký hiệu | Ý nghĩa |
|----------|---------|
| **TraceID** | Ánh xạ 1-1 chính xác với mã yêu cầu gốc trong SRS. **TUYỆT ĐỐI KHÔNG tự chế mã.** |
| **Happy** | Luồng chính — dữ liệu hợp lệ, quyền đúng |
| **Negative** | Luồng lỗi — dữ liệu sai, thiếu quyền, vi phạm ràng buộc |
| **Edge** | Ranh giới — boundary values, race condition, SRS gap |

---

## A. TIẾP NHẬN HỎI ĐÁP — ACCEPT

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TN-001 | FR-II-03 / BR-SLA-01 | Tiếp nhận hỏi đáp thành công — bắt đầu tính SLA | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi HD-010 ở trạng thái MOI. | — | 1. Mở danh sách tab "Mới". 2. Chọn bản ghi HD-010. 3. Nhấn [Tiếp nhận]. | 1. Trạng thái chuyển MOI → TIEP_NHAN. 2. Hệ thống gán nguoi_tiep_nhan = CB hiện tại. 3. Tự động tính deadline SLA: Ngày tiếp nhận + 5 ngày làm việc (BR-SLA-01 / BR-CALC-03). 4. Chỉ đếm T2-T6, trừ NGAY_LE. 5. AUDIT_LOG ghi thay đổi trạng thái. | Happy |
| TC-TN-002 | FR-II-03 | Tiếp nhận và mở chi tiết — Stepper hiển thị đúng | 1. User CB_NV đã đăng nhập. 2. Vừa tiếp nhận HD-010 thành công. | — | 1. Click vào HD-010 đã tiếp nhận. 2. Kiểm tra SCR-II-02 (Chi tiết). | 1. Stepper 6 bước hiển thị: bước "Tiếp nhận" được highlight active. 2. Accordion Thông tin câu hỏi hiển thị đầy đủ. 3. Các nút [Phân công], [Lưu nháp] hiển thị tùy trạng thái. | Happy |
| TC-TN-003 | FR-II-03 / BR-SLA-01 | Tiếp nhận vào thứ 6 — deadline tính đúng ngày làm việc | 1. User CB_NV đã đăng nhập. 2. Bản ghi HD-011 ở trạng thái MOI. 3. Hôm nay là Thứ 6. | — | 1. Tiếp nhận HD-011 vào Thứ 6 (18/04/2026). 2. Kiểm tra deadline. | 1. Deadline = Thứ 6 (18/04) + 5 ngày làm việc = skip Thứ 7+CN → Thứ 5 (24/04/2026) hoặc muộn hơn nếu có NGAY_LE. 2. SLA chỉ đếm T2-T6, trừ nghỉ lễ. | Happy |

---

## B. TIẾP NHẬN — NEGATIVE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TN-004 | FR-II-03 / ERR-TN-01 | 2 CB NV cùng tiếp nhận 1 bản ghi → Optimistic Locking | 1. CB_NV_A và CB_NV_B cùng đăng nhập. 2. Bản ghi HD-012 ở trạng thái MOI. | — | 1. CB_NV_A và CB_NV_B cùng mở danh sách tab "Mới". 2. CB_NV_A nhấn [Tiếp nhận] HD-012 → thành công. 3. CB_NV_B nhấn [Tiếp nhận] HD-012 (1-2 giây sau). | 1. CB_NV_A tiếp nhận thành công. 2. CB_NV_B nhận ERR-TN-01: "Hỏi đáp đã được tiếp nhận bởi {CB_NV_A}". 3. Optimistic Locking fuse, người thứ 2 bị chặn. | Negative |
| TC-TN-005 | FR-II-03 / ERR-TN-02 | Tiếp nhận bản ghi đã bị xóa → lỗi | 1. User CB_NV đã đăng nhập. 2. Bản ghi HD-013 ở trạng thái MOI trên danh sách. 3. CB khác đã xóa mềm HD-013 (is_deleted=1). | — | 1. CB_NV nhấn [Tiếp nhận] HD-013 (đã bị xóa nhưng danh sách chưa refresh). | 1. Lỗi ERR-TN-02: "Hỏi đáp không tồn tại hoặc đã bị xóa". 2. Không thay đổi trạng thái. | Negative |
| TC-TN-006 | FR-II-03 / ERR-TN-03 | Tiếp nhận khi bản ghi đã bị update bởi người khác — xung đột Optimistic Lock | 1. CB_NV_A đã đăng nhập. 2. CB_NV_B đã sửa nội dung HD-014 (updated_at thay đổi). 3. CB_NV_A chưa refresh. | — | 1. CB_NV_A nhấn [Tiếp nhận] HD-014 (updated_at không khớp). | 1. Lỗi ERR-TN-03: "Bản ghi đã được tiếp nhận bởi người khác". 2. Không cho phép tiếp nhận. | Negative |
| TC-TN-007 | FR-II-03 | Tiếp nhận bản ghi ở trạng thái TIEP_NHAN (đã tiếp nhận) → bị chặn | 1. User CB_NV đã đăng nhập. 2. HD-015 đã ở trạng thái TIEP_NHAN. | — | 1. Thử nhấn [Tiếp nhận] cho HD-015 (đã TIEP_NHAN). | 1. Nút [Tiếp nhận] bị ẩn cho bản ghi không ở trạng thái MOI. 2. Nếu gọi API trực tiếp → từ chối chuyển trạng thái. | Negative |

---

## C. TIẾP NHẬN — EDGE CASES

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TN-008 | FR-II-03 / BR-SLA-01 | 🟡 Tiếp nhận khi ngày hiện tại = ngày lễ quốc gia → SLA tính đúng | 1. User CB_NV đã đăng nhập. 2. Hôm nay = ngày lễ trong bảng NGAY_LE (VD: 30/04). 3. Bản ghi HD-016 ở MOI. | — | 1. Tiếp nhận HD-016 vào ngày 30/04. 2. Kiểm tra deadline SLA. | 1. Ngày 30/04 KHÔNG được đếm vào SLA (vì nằm trong NGAY_LE). 2. Deadline bắt đầu tính từ ngày làm việc tiếp theo (02/05 hoặc muộn hơn nếu 01/05 cũng là NGAY_LE). | Edge |
| TC-TN-009 | FR-II-03 / BR-AUTH-08 | 🟡 CB NV BN tiếp nhận bản ghi thuộc đơn vị khác → bị chặn | 1. User CB_NV_BN (Bộ KH&ĐT) đã đăng nhập. 2. Tồn tại bản ghi HD-017 thuộc đơn vị TW ở MOI. | — | 1. Thử truy cập/tiếp nhận HD-017 (thuộc TW, không thuộc đơn vị BN). | 1. Bản ghi HD-017 KHÔNG xuất hiện trong danh sách CB_NV_BN (BR-AUTH-08). 2. Nếu gọi API trực tiếp → từ chối vì Row-Level Security. | Edge |
| TC-TN-010 | FR-II-03 / BR-SLA-02 | 🟢 Tiếp nhận → kiểm tra SLA badge hiển thị "Bình thường" ban đầu | 1. Vừa tiếp nhận HD-018 thành công. | — | 1. Kiểm tra badge SLA trên bản ghi HD-018. | 1. SLA badge = "Bình thường" (>50% thời hạn còn lại). 2. Màu hiển thị: mặc định / xanh. | Edge |

---

## D. EDGE CASES BỔ SUNG — TIẾP NHẬN

> **Nguồn bổ sung**: Edge Case Review `edge-case-review-FR02.md` — NotebookLM Session `d51cd9c3`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TN-011 | FR-II-03 / BR-SLA-01 | 🟡 SLA tính khi tuần liên tiếp nghỉ lễ (30/04 + 01/05 + weekend) | 1. User CB_NV đã đăng nhập. 2. Tiếp nhận vào Thứ 4 (29/04/2026). 3. NGAY_LE chứa 30/04 + 01/05. | — | 1. Tiếp nhận HD-080 vào 29/04 (T4). 2. Kiểm tra deadline. | 1. T4 29/04 (đếm) → T5 30/04 (lễ, skip) → T6 01/05 (lễ, skip) → T7 02/05 (weekend, skip) → CN 03/05 (weekend, skip) → T2 04/05 (đếm) → T3 05/05 → T4 06/05 → T5 07/05. 2. Deadline = 07/05 hoặc 08/05 (tùy cách đếm ngày tiếp nhận). | Edge |
| TC-TN-012 | FR-II-03 / BR-SLA-02 | 🟡 SLA badge chuyển vàng/đỏ/đen đúng ngưỡng — kiểm tra background job | 1. Bản ghi HD-081 ở DANG_XU_LY. 2. Deadline = 5 ngày. | Đợi > 50% thời hạn trôi qua | 1. Kiểm tra badge SLA sau 3 ngày (>50% consumed). 2. Kiểm tra sau 5 ngày (100% = quá hạn). 3. Kiểm tra sau 10 ngày (200% = nghiêm trọng). | 1. >50% thời hạn qua → Badge VÀNG "Sắp hết hạn". 2. >100% → Badge ĐỎ "Quá hạn" + thông báo CB NV + CB PD. 3. >200% → Badge ĐEN "QH nghiêm trọng" + escalate lên cấp trên. 4. Background job chạy mỗi 30 phút (BR-SLA-02). | Edge |

---

<!-- 
TRACEABILITY: 
- ERR-TN-01/02/03 lấy nguyên văn từ SRS qua NotebookLM
- BR-SLA-01 / BR-CALC-03: Deadline = ngày tiếp nhận + N ngày làm việc
- BR-EC-01: Optimistic Locking qua updated_at
- Section D bổ sung từ Edge Case Review 2026-04-18 (Session d51cd9c3)
-->
