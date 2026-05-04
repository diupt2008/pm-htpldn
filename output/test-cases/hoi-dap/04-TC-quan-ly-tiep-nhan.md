# Test Cases — FR-II-04/09 (UC13/UC18): Quản lý tiếp nhận & Quản lý đã xử lý (SRS-FR-02)

> **SRS Ref**: FR-II-04 (UC13), FR-II-09 (UC18), SCR-II-01 / SCR-II-02  
> **Nguồn**: NotebookLM Session `7176b671`  
> **Ngày tạo**: 2026-04-18  
> **Đặc thù**: UC13 = hard filter đang xử lý (R + Update hạn), UC18 = Read-only đã hoàn thành. Gộp vì liên quan view management.

---

## Quy ước

| Ký hiệu | Ý nghĩa |
|----------|---------|
| **TraceID** | Ánh xạ 1-1 chính xác với mã yêu cầu gốc trong SRS. **TUYỆT ĐỐI KHÔNG tự chế mã.** |
| **Happy** | Luồng chính — dữ liệu hợp lệ, quyền đúng |
| **Negative** | Luồng lỗi — dữ liệu sai, thiếu quyền, vi phạm ràng buộc |
| **Edge** | Ranh giới — boundary values, SRS gap |

---

## Phân biệt UC13 vs UC18

| UC | Mã FR | View | Hard filter | CRUD | Đặc thù |
|----|--------|------|-------------|------|---------|
| UC13 | FR-II-04 | Tab "Đang xử lý" | TIEP_NHAN, DA_PHAN_CONG, DANG_XU_LY | R + Update (thời hạn) | Cập nhật thời hạn xử lý kèm lý do. Xem Timeline AUDIT_LOG |
| UC18 | FR-II-09 | Tab "Hoàn thành" | DA_DUYET, CONG_KHAI, HOAN_THANH | Read-only | Xem phản hồi cuối + người duyệt + ngày duyệt. Toàn bộ lịch sử xử lý |

---

## A. QUẢN LÝ TIẾP NHẬN XỬ LÝ — UC13 (FR-II-04)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-QL-001 | FR-II-04 | Xem danh sách đang xử lý — hard filter đúng trạng thái | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi ở TIEP_NHAN, DA_PHAN_CONG, DANG_XU_LY, và DA_DUYET. | — | 1. Mở tab "Đang xử lý". 2. Kiểm tra danh sách. | 1. Chỉ hiển thị bản ghi trang_thai IN (TIEP_NHAN, DA_PHAN_CONG, DANG_XU_LY). 2. KHÔNG hiển thị MOI, DA_DUYET, CONG_KHAI, HOAN_THANH. 3. Không có nút [Thêm mới] / [Xóa] (UC13 không hỗ trợ CRUD đầy đủ). | Happy |
| TC-QL-002 | FR-II-04 | Cập nhật thời hạn xử lý kèm lý do thành công | 1. User CB_NV đã đăng nhập. 2. Bản ghi HD-020 ở DANG_XU_LY, hạn cũ = 24/04/2026. | thoi_han_moi: 30/04/2026, ly_do: "Cần thêm thời gian nghiên cứu văn bản" | 1. Mở chi tiết HD-020. 2. Nhập thời hạn mới = 30/04/2026. 3. Nhập lý do thay đổi. 4. Click [Lưu]. | 1. Cập nhật thành công, thời hạn mới = 30/04/2026. 2. AUDIT_LOG ghi UPDATE (thời hạn cũ → mới + lý do). 3. Thông báo gửi cho người được phân công. | Happy |
| TC-QL-003 | FR-II-04 / BR-DATA-05 | Xem lịch sử Timeline (AUDIT_LOG) | 1. User CB_NV đã đăng nhập. 2. Bản ghi HD-021 có lịch sử: MOI → TIEP_NHAN → DA_PHAN_CONG → DANG_XU_LY. | — | 1. Mở chi tiết HD-021. 2. Mở Accordion "Nhật ký xử lý" (Timeline). | 1. Hiển thị dòng thời gian: ai làm gì, thời gian, hành động. 2. Mỗi entry: hanh_dong, nguoi_thuc_hien, thoi_gian, giá_trị cũ → mới. 3. Dữ liệu truy vấn từ AUDIT_LOG (BR-DATA-05). | Happy |
| TC-QL-004 | FR-II-04 | Cập nhật thời hạn — thiếu lý do → bị chặn | 1. User CB_NV đã đăng nhập. 2. Bản ghi HD-022 ở DANG_XU_LY. | thoi_han_moi: 30/04/2026, ly_do: "" (trống) | 1. Mở chi tiết HD-022. 2. Nhập thời hạn mới. 3. Bỏ trống lý do. 4. Click [Lưu]. | 1. Hệ thống yêu cầu nhập lý do thay đổi. 2. Không cho phép lưu khi lý do trống. | Negative |
| TC-QL-005 | FR-II-04 / BR-AUTH-08 | 🟡 CB NV ĐP xem timeline bản ghi thuộc đơn vị khác → bị chặn | 1. User CB_NV_DP (Sở TP HN) đã đăng nhập. 2. Bản ghi HD-023 thuộc đơn vị TW ở DANG_XU_LY. | — | 1. Thử truy cập chi tiết HD-023 (đơn vị TW). | 1. Bản ghi KHÔNG xuất hiện trong danh sách tab "Đang xử lý" của CB_NV_DP. 2. Row-Level Security (BR-AUTH-08) chặn ở tầng data. | Edge |

---

## B. QUẢN LÝ CÂU HỎI ĐÃ XỬ LÝ — UC18 (FR-II-09) — READ-ONLY

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-QL-006 | FR-II-09 | Xem danh sách đã xử lý — Read-only | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi ở DA_DUYET, CONG_KHAI, HOAN_THANH. | — | 1. Mở tab "Hoàn thành" (UC18). 2. Kiểm tra danh sách. | 1. Chỉ hiển thị bản ghi trang_thai IN (DA_DUYET, CONG_KHAI, HOAN_THANH). 2. Read-only: KHÔNG có nút [Thêm mới], [Sửa], [Xóa]. 3. Cột bổ sung: nguoi_duyet, ngay_duyet. | Happy |
| TC-QL-007 | FR-II-09 | Xem chi tiết đã xử lý — hiển thị toàn bộ lịch sử | 1. User CB_NV đã đăng nhập. 2. Bản ghi HD-024 ở HOAN_THANH. | — | 1. Click vào HD-024. 2. Xem SCR-II-02 (Chi tiết). | 1. Hiển thị nội dung phản hồi cuối cùng. 2. Thông tin người duyệt + ngày duyệt. 3. Timeline đầy đủ từ MOI → ... → HOAN_THANH. 4. Tất cả trường bị disabled/locked (BR-FLOW-03). | Happy |
| TC-QL-008 | FR-II-09 / BR-FLOW-03 | 🟡 Thử sửa bản ghi HOAN_THANH → bị khóa | 1. User CB_NV đã đăng nhập. 2. Bản ghi HD-025 ở HOAN_THANH. | — | 1. Mở chi tiết HD-025. 2. Thử sửa nội dung (nếu có nút [Sửa]). | 1. Nút [Sửa] bị ẩn/disabled. 2. BR-FLOW-03: Bản ghi ở HOAN_THANH bị khóa hoàn toàn. 3. Nếu gọi API → ERR-HD-04: "Không thể sửa/xóa bản ghi đã phê duyệt". | Edge |

---

## C. EDGE CASES BỔ SUNG — QL TIẾP NHẬN & ĐÃ XỬ LÝ

> **Nguồn bổ sung**: Edge Case Review `edge-case-review-FR02.md` — NotebookLM Session `d51cd9c3`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-QL-009 | FR-II-04 / BR-AUTH-04 | 🟡 CB_PD_TW xem data cấp BN/ĐP — xem được nhưng KHÔNG duyệt được | 1. User CB_PD_TW đã đăng nhập. 2. Tồn tại bản ghi HD-090 thuộc cấp BN ở DANG_XU_LY. | — | 1. Mở tab "Đang xử lý". 2. Xác nhận HD-090 (cấp BN) CÓ hiển thị trong danh sách. 3. Click vào HD-090. | 1. BR-AUTH-04: CB_PD_TW CÓ quyền XEM toàn bộ data TW + BN + ĐP. 2. Hiển thị HD-090 trong danh sách. 3. Nhưng khi chuyển sang CHO_PHE_DUYET, nút [Phê duyệt] sẽ bị chặn (BR-AUTH-05: phê duyệt cùng cấp). | Edge |
| TC-QL-010 | FR-II-04 | 🟢 Cập nhật thời hạn — thời hạn mới < ngày hiện tại → kiểm tra ràng buộc | 1. User CB_NV đã đăng nhập. 2. HD-091 ở DANG_XU_LY, hạn cũ = 30/04/2026. | thoi_han_moi: 10/04/2026 (quá khứ), ly_do: "Rút ngắn deadline" | 1. Mở chi tiết HD-091. 2. Nhập thời hạn mới = 10/04/2026 (quá khứ). 3. Click [Lưu]. | 1. Hệ thống có chấp nhận thời hạn trong quá khứ không? 2. Nếu chặn: "Thời hạn phải lớn hơn ngày hiện tại". 3. Nếu chấp nhận: bản ghi lập tức chuyển badge ĐỎ/ĐEN. | Edge |
| TC-QL-011 | FR-II-09 | 🟡 DA_PHAN_CONG — trạng thái ẩn, SRS Gap xung đột với SM-HOIDAP | 1. Vừa phân công HD-092 thành công. | — | 1. Kiểm tra trạng thái thực tế sau phân công. 2. Kiểm tra Stepper. | 1. **SRS Gap (G7)**: FR-II-06 ghi "trạng_thái = DA_PHAN_CONG". 2. Nhưng SM-HOIDAP KHÔNG có trạng thái DA_PHAN_CONG → chuyển thẳng TIEP_NHAN → DANG_XU_LY. 3. Stepper KHÔNG hiển thị DA_PHAN_CONG. 4. Cần xác minh implementation: có trạng thái trung gian hay không. | Edge |

---

<!-- 
TRACEABILITY:
- UC13 (FR-II-04): View đang xử lý với hard filter TIEP_NHAN/DA_PHAN_CONG/DANG_XU_LY
- UC18 (FR-II-09): View đã hoàn thành, Read-only, trạng thái DA_DUYET/CONG_KHAI/HOAN_THANH
- Sessions: NotebookLM 7176b671 + d51cd9c3
- Section C bổ sung từ Edge Case Review 2026-04-18
-->
