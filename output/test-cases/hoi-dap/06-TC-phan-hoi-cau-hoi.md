# Test Cases — FR-II-07 (UC16): Phản hồi Câu hỏi (SRS-FR-02)

> **SRS Ref**: FR-II-07 (UC16), SCR-II-02 (Chi tiết & Soạn Phản hồi), Entity PHAN_HOI  
> **Nguồn**: NotebookLM Session `7176b671`  
> **Ngày tạo**: 2026-04-18  
> **Đặc thù**: Rich-text editor. Dropdown mẫu phản hồi pre-fill. Checkbox "Đã trả lời" → auto-transition (BR-FLOW-01). Đính kèm tài liệu + VBPL.

---

## Quy ước

| Ký hiệu | Ý nghĩa |
|----------|---------|
| **TraceID** | Ánh xạ 1-1 chính xác với mã yêu cầu gốc trong SRS. **TUYỆT ĐỐI KHÔNG tự chế mã.** |
| **Happy** | Luồng chính — dữ liệu hợp lệ, quyền đúng |
| **Negative** | Luồng lỗi — dữ liệu sai, thiếu quyền, vi phạm ràng buộc |
| **Edge** | Ranh giới — boundary values, SRS gap |

---

## A. SOẠN PHẢN HỒI — HAPPY PATH

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PH-001 | FR-II-07 | Soạn phản hồi và lưu nháp thành công | 1. User CB_NV đã đăng nhập. 2. Là người được phân công xử lý. 3. Bản ghi HD-040 ở DA_PHAN_CONG hoặc DANG_XU_LY. | noi_dung_phan_hoi: "Theo quy định Luật Doanh nghiệp 2020, thủ tục..." | 1. Mở chi tiết HD-040 (SCR-II-02). 2. Soạn nội dung phản hồi bằng Rich-text editor. 3. Click [Lưu nháp]. | 1. Lưu nháp thành công. 2. Trạng thái chuyển → DANG_XU_LY (nếu từ DA_PHAN_CONG). 3. Nội dung phản hồi được lưu nhưng chưa gửi đi. 4. AUDIT_LOG ghi CREATE/UPDATE PHAN_HOI. | Happy |
| TC-PH-002 | FR-II-07 / FR-II-NEW-02 | Soạn phản hồi sử dụng mẫu pre-fill | 1. User CB_NV đã đăng nhập. 2. HD-041 ở DANG_XU_LY, lĩnh vực = "Doanh nghiệp". 3. Tồn tại MAU_PHAN_HOI cho lĩnh vực "Doanh nghiệp". | — | 1. Mở chi tiết HD-041. 2. Chọn mẫu phản hồi từ dropdown (theo lĩnh vực). 3. System pre-fill nội dung mẫu vào Rich-text editor. 4. Chỉnh sửa nội dung. 5. Click [Lưu nháp]. | 1. Dropdown chỉ hiện mẫu khớp lĩnh vực "Doanh nghiệp". 2. Nội dung mẫu pre-fill thành công vào editor. 3. CB NV có thể chỉnh sửa nội dung pre-fill. 4. Lưu nháp thành công. | Happy |
| TC-PH-003 | FR-II-07 / BR-FLOW-01 | Gửi phản hồi — tick "Đã trả lời" → auto-transition CHO_PHE_DUYET | 1. User CB_NV đã đăng nhập. 2. HD-042 ở DANG_XU_LY, đã soạn nội dung phản hồi đầy đủ. | noi_dung_phan_hoi: "Phản hồi hoàn chỉnh...", checkbox: "Đã trả lời" = checked | 1. Mở chi tiết HD-042. 2. Soạn nội dung phản hồi đầy đủ. 3. Tick checkbox "Đã trả lời". 4. Click [Gửi]. | 1. BR-FLOW-01: Auto-transition → bỏ qua DA_TRA_LOI → thẳng CHO_PHE_DUYET. 2. Thông báo gửi cho CB Phê duyệt (CB PD) cùng cấp. 3. AUDIT_LOG ghi thay đổi trạng thái DANG_XU_LY → CHO_PHE_DUYET. 4. Stepper highlight "Chờ duyệt". | Happy |
| TC-PH-004 | FR-II-07 | Đính kèm tài liệu VBPL khi phản hồi | 1. User CB_NV đã đăng nhập. 2. HD-043 ở DANG_XU_LY. | file_dinh_kem: van_ban_phap_luat.pdf (10MB) | 1. Mở soạn phản hồi HD-043. 2. Nhập nội dung. 3. Click [Đính kèm tài liệu]. 4. Upload van_ban_phap_luat.pdf. 5. Click [Lưu nháp]. | 1. File được quét ClamAV → sạch → upload thành công. 2. File hiển thị trong danh sách đính kèm. 3. Lưu nháp thành công. | Happy |

---

## B. SOẠN PHẢN HỒI — NEGATIVE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PH-005 | FR-II-07 / ERR-PH-01 | Gửi phản hồi — nội dung trống → lỗi | 1. User CB_NV đã đăng nhập. 2. HD-044 ở DANG_XU_LY. | noi_dung_phan_hoi: "" | 1. Mở soạn phản hồi HD-044. 2. Bỏ trống nội dung. 3. Tick "Đã trả lời". 4. Click [Gửi]. | 1. Lỗi ERR-PH-01: "Nội dung phản hồi là bắt buộc". 2. KHÔNG chuyển trạng thái. | Negative |
| TC-PH-006 | FR-II-07 / ERR-PH-02 | Phản hồi khi trạng thái không hợp lệ (DA_DUYET) → lỗi | 1. User CB_NV đã đăng nhập. 2. HD-045 ở DA_DUYET. | — | 1. Mở chi tiết HD-045 (DA_DUYET). 2. Thử soạn phản hồi. | 1. Khu vực soạn phản hồi bị disabled/ẩn. 2. Nếu API: ERR-PH-02: "Hỏi đáp ở trạng thái 'DA_DUYET' không thể phản hồi". | Negative |
| TC-PH-007 | FR-II-07 / ERR-PH-02 | Phản hồi nội dung vượt 5000 ký tự → lỗi | 1. User CB_NV đã đăng nhập. 2. HD-046 ở DANG_XU_LY. | noi_dung_phan_hoi: [5001 ký tự] | 1. Soạn phản hồi 5001 ký tự. 2. Click [Gửi]. | 1. Lỗi: Nội dung phản hồi tối đa 5000 ký tự (tương tự ERR-HD-02, áp dụng cho phan_hoi). | Negative |

---

## C. SOẠN PHẢN HỒI — EDGE CASES

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PH-008 | FR-II-07 / WRN-PH-01 | 🟡 Người soạn KHÔNG phải người được phân công → cảnh báo | 1. User CB_NV_B đã đăng nhập. 2. HD-047 ở DANG_XU_LY, nguoi_xu_ly = CB_NV_A. | CB_NV_B soạn phản hồi (khác người phân công) | 1. CB_NV_B mở chi tiết HD-047 (phân công cho CB_NV_A). 2. Soạn nội dung phản hồi. 3. Click [Gửi]. | 1. WRN-PH-01: "Bạn không phải người được phân công. Vẫn muốn phản hồi?". 2. Cho phép tiếp tục nếu xác nhận (WARNING, không block). | Edge |
| TC-PH-009 | FR-II-07 / BR-FLOW-01 | 🔴 Auto-transition: Tick "Đã trả lời" nhưng KHÔNG click [Gửi] → kiểm tra trạng thái | 1. User CB_NV đã đăng nhập. 2. HD-048 ở DANG_XU_LY. | Tick "Đã trả lời" nhưng KHÔNG click Gửi | 1. Soạn nội dung đầy đủ. 2. Tick "Đã trả lời". 3. KHÔNG nhấn [Gửi]. 4. Thoát trang. | 1. Kiểm tra: trạng thái CÓ chuyển chỉ vì tick checkbox HAY phải click [Gửi]? 2. SRS: "Khi tích 'Đã trả lời', hệ thống tự động chuyển trạng thái" — cần xác minh trigger là tick hay submit. | Edge |
| TC-PH-010 | FR-II-07 / BR-AUTH-05 | 🟡 Gửi phản hồi → thông báo gửi đúng CB PD cùng cấp | 1. User CB_NV_BN đã đăng nhập (cấp BN). 2. HD-049 ở DANG_XU_LY. | — | 1. Soạn phản hồi hoàn chỉnh. 2. Tick "Đã trả lời" + [Gửi]. 3. Kiểm tra CB PD nhận thông báo. | 1. Thông báo in-app + email gửi cho CB_PD_BN (cùng cấp BN). 2. CB_PD_TW và CB_PD_DP KHÔNG nhận thông báo (BR-AUTH-05: phê duyệt cùng cấp). | Edge |
| TC-PH-011 | FR-II-07 | 🟢 Phản hồi chính xác 5000 ký tự → boundary accept | 1. User CB_NV đã đăng nhập. 2. HD-050 ở DANG_XU_LY. | noi_dung_phan_hoi: [5000 ký tự] | 1. Soạn phản hồi đúng 5000 ký tự. 2. Click [Gửi]. | 1. Lưu/gửi thành công (5000 = max allowed). | Edge |

---

## D. EDGE CASES BỔ SUNG — PHẢN HỒI

> **Nguồn bổ sung**: Edge Case Review `edge-case-review-FR02.md` — NotebookLM Session `d51cd9c3`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PH-012 | FR-II-07 / PHAN_HOI 1:N | 🟡 Xem lịch sử phản hồi cũ (card-list) — nhiều lần từ chối-soạn lại | 1. User CB_NV đã đăng nhập. 2. HD-110 ở DANG_XU_LY, đã bị từ chối 2 lần → có 2 PHAN_HOI cũ. | — | 1. Mở chi tiết HD-110 (SCR-II-02). 2. Kiểm tra section "Danh sách phản hồi cũ". | 1. Card-list hiển thị 2 bản phản hồi cũ (mới nhất trên cùng). 2. Mỗi card: số thứ tự + nội dung + người soạn + ngày + lý do từ chối. 3. CB NV đang soạn bản thứ 3 trong Rich-text editor. | Edge |
| TC-PH-013 | FR-II-07 | 🟢 Reject loop vô hạn — bản ghi bị từ chối 10 lần → hệ thống không giới hạn | 1. HD-111 đã bị CB PD từ chối 10 lần liên tiếp. | — | 1. Kiểm tra: CB NV vẫn có thể soạn phản hồi lần thứ 11? 2. Card-list hiển thị 10 bản cũ? | 1. **SRS Gap (G9)**: SRS KHÔNG giới hạn số lần từ chối-soạn lại (loop vô hạn). 2. Card-list "Phản hồi cũ" hiển thị tất cả 10 bản. 3. Hiệu năng scroll có bị ảnh hưởng? | Edge |
| TC-PH-014 | FR-II-07 / FR-II-NEW-02 | 🟢 Chọn mẫu → pre-fill → chọn mẫu khác → confirm ghi đè | 1. User CB_NV đã đăng nhập. 2. HD-112 ở DANG_XU_LY. 3. Đang soạn nội dung (có text). | Chọn mẫu "M1" → soạn thêm → chọn mẫu "M2" | 1. Chọn mẫu M1 → nội dung pre-fill. 2. Sửa một phần nội dung. 3. Chọn mẫu M2 (khác M1). | 1. Confirm dialog: "Nội dung hiện tại sẽ bị thay thế. Xác nhận?" (hoặc append?). 2. Nếu confirm → ghi đè bằng M2. 3. Nếu hủy → giữ nguyên nội dung đang soạn. | Edge |
| TC-PH-015 | FR-II-07 / FR-II-NEW-02 | 🟢 Lĩnh vực không có MAU_PHAN_HOI → dropdown mẫu trống | 1. User CB_NV đã đăng nhập. 2. HD-113 ở DANG_XU_LY, lĩnh vực "Thuế" (chưa có mẫu). | — | 1. Mở soạn phản hồi HD-113. 2. Kiểm tra dropdown mẫu phản hồi. | 1. Dropdown trống hoặc disabled: "Chưa có mẫu cho lĩnh vực này". 2. CB NV vẫn có thể soạn thủ công. | Edge |
| TC-PH-016 | FR-II-07 / FR-II-08 | 🔴 Phản hồi khi CB PD đang duyệt — form phải bị KHÓA ở CHO_PHE_DUYET | 1. CB_NV_A đã đăng nhập. 2. HD-114 ở CHO_PHE_DUYET (CB_NV_A đã gửi). | CB_NV_A thử soạn phản hồi mới | 1. CB_NV_A quay lại chi tiết HD-114 (CHO_PHE_DUYET). 2. Kiểm tra form soạn phản hồi. | 1. Form soạn phản hồi BỊ KHÓA khi trạng thái = CHO_PHE_DUYET. 2. CB NV chỉ thao tác được ở DA_PHAN_CONG / DANG_XU_LY. 3. Nếu KHÔNG khóa → lỗ hổng: phản hồi mới ghi đè bản đang chờ duyệt. | Edge |

---

<!-- 
TRACEABILITY:
- ERR-PH-01/02 lấy nguyên văn SRS qua NotebookLM
- WRN-PH-01: Warning cho người không phải người phân công
- BR-FLOW-01: Auto-transition khi tick "Đã trả lời"
- BR-AUTH-05: Phê duyệt cùng cấp
- PHAN_HOI 1:N: Một HOI_DAP có NHIỀU PHAN_HOI con (lịch sử)
- Section D bổ sung từ Edge Case Review 2026-04-18 (Session d51cd9c3)
-->
