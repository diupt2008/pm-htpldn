# Test Cases — FR-II-08 (UC17): Phê duyệt & Công khai Phản hồi (SRS-FR-02)

> **SRS Ref**: FR-II-08 (UC17), SCR-II-01 / SCR-II-02, Entity HOI_DAP / PHAN_HOI  
> **Nguồn**: NotebookLM Session `7176b671`  
> **Ngày tạo**: 2026-04-18  
> **Đặc thù**: CB PD cùng cấp duyệt. Từ chối kèm lý do ≥10 ký tự. Batch approve max 100/batch, per-record. Công khai qua API trực tiếp lên Cổng PLQG. Hủy công khai + Đóng hồ sơ.

---

## Quy ước

| Ký hiệu | Ý nghĩa |
|----------|---------|
| **TraceID** | Ánh xạ 1-1 chính xác với mã yêu cầu gốc trong SRS. **TUYỆT ĐỐI KHÔNG tự chế mã.** |
| **Happy** | Luồng chính — dữ liệu hợp lệ, quyền đúng |
| **Negative** | Luồng lỗi — dữ liệu sai, thiếu quyền, vi phạm ràng buộc |
| **Edge** | Ranh giới — boundary values, SRS gap |

---

## A. PHÊ DUYỆT — APPROVE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PD-001 | FR-II-08 / BR-AUTH-05 | Phê duyệt phản hồi thành công — CB PD cùng cấp | 1. User CB_PD_TW đã đăng nhập. 2. HD-050 ở CHO_PHE_DUYET, do CB_NV_TW tạo/xử lý. | — | 1. Mở tab "Chờ duyệt". 2. Click vào HD-050. 3. Xem nội dung phản hồi. 4. Nhấn [Phê duyệt]. | 1. Trạng thái: CHO_PHE_DUYET → DA_DUYET. 2. AUDIT_LOG ghi APPROVE. 3. Thông báo gửi cho CB_NV_TW (người soạn). 4. BR-AUTH-05: CB PD TW duyệt cho bản ghi TW → hợp lệ. | Happy |
| TC-PD-002 | FR-II-08 / BR-EC-19 | Phê duyệt hàng loạt (Batch Approve) thành công | 1. User CB_PD đã đăng nhập. 2. Tồn tại 5 bản ghi ở CHO_PHE_DUYET thuộc cùng cấp. | 5 bản ghi chọn | 1. Mở tab "Chờ duyệt". 2. Tick chọn 5 bản ghi. 3. Click [Phê duyệt hàng loạt]. | 1. Xử lý per-record (từng bản ghi). 2. Tất cả 5 chuyển CHO_PHE_DUYET → DA_DUYET. 3. Kết quả: "5 duyệt thành công, 0 lỗi". 4. AUDIT_LOG ghi 5 entries. | Happy |

---

## B. TỪ CHỐI — REJECT

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PD-003 | FR-II-08 / BR-FLOW-04 | Từ chối phê duyệt kèm lý do hợp lệ (≥10 ký tự) | 1. User CB_PD đã đăng nhập. 2. HD-051 ở CHO_PHE_DUYET. | ly_do_tu_choi: "Nội dung phản hồi chưa đầy đủ căn cứ pháp lý" (42 ký tự) | 1. Mở chi tiết HD-051. 2. Nhấn [Từ chối]. 3. Nhập lý do từ chối (42 ký tự). 4. Click [Xác nhận]. | 1. Trạng thái: CHO_PHE_DUYET → DANG_XU_LY (trả lại CB NV sửa). 2. Lý do từ chối hiển thị cho CB NV. 3. Gửi thông báo in-app + email cho CB NV. 4. AUDIT_LOG ghi REJECT + lý do. | Happy |
| TC-PD-004 | FR-II-08 / ERR-PD-02 | Từ chối — lý do trống → lỗi | 1. User CB_PD đã đăng nhập. 2. HD-052 ở CHO_PHE_DUYET. | ly_do_tu_choi: "" | 1. Nhấn [Từ chối]. 2. Bỏ trống lý do. 3. Click [Xác nhận]. | 1. Lỗi ERR-PD-02: "Vui lòng nhập lý do từ chối". 2. KHÔNG chuyển trạng thái. | Negative |
| TC-PD-005 | FR-II-08 / ERR-PD-02 / BR-FLOW-04 | Từ chối — lý do < 10 ký tự → lỗi | 1. User CB_PD đã đăng nhập. 2. HD-053 ở CHO_PHE_DUYET. | ly_do_tu_choi: "Thiếu" (5 ký tự) | 1. Nhấn [Từ chối]. 2. Nhập "Thiếu" (5 ký tự < 10 minimum). 3. Click [Xác nhận]. | 1. Lỗi ERR-PD-02: "Vui lòng nhập lý do từ chối" (min 10 ký tự theo BR-FLOW-04). 2. KHÔNG chuyển trạng thái. | Negative |
| TC-PD-006 | FR-II-08 / ERR-PD-01 | Từ chối — CB PD phê duyệt xuyên cấp → lỗi | 1. User CB_PD_BN đã đăng nhập. 2. HD-054 ở CHO_PHE_DUYET, thuộc đơn vị TW. | — | 1. Thử nhấn [Từ chối] hoặc [Phê duyệt] HD-054 (thuộc TW). | 1. Bản ghi KHÔNG hiển thị trong danh sách CB_PD_BN (Row-Level Security). 2. Nếu API: ERR-PD-01: "Bạn không có quyền phê duyệt bản ghi thuộc đơn vị khác cấp". | Negative |
| TC-PD-007 | FR-II-08 / ERR-PD-03 | Phê duyệt bản ghi KHÔNG ở CHO_PHE_DUYET → lỗi | 1. User CB_PD đã đăng nhập. 2. HD-055 ở DA_DUYET (đã duyệt rồi). | — | 1. Thử nhấn [Phê duyệt] HD-055. | 1. Nút [Phê duyệt] bị ẩn cho trạng thái DA_DUYET. 2. Nếu API: ERR-PD-03: "Hỏi đáp không ở trạng thái chờ phê duyệt". | Negative |

---

## C. CÔNG KHAI — PUBLISH

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PD-008 | FR-II-08 / BR-FLOW-05 | Công khai phản hồi lên Cổng PLQG thành công | 1. User CB PD/CB NV đã đăng nhập. 2. HD-056 ở DA_DUYET. 3. API Cổng PLQG hoạt động bình thường. | — | 1. Chọn HD-056 (DA_DUYET). 2. Nhấn [Công khai]. | 1. Hệ thống gọi REST API trực tiếp lên Cổng PLQG (BR-FLOW-05: không qua LGSP). 2. API trả về thành công. 3. Trạng thái: DA_DUYET → CONG_KHAI. 4. AUDIT_LOG ghi PUBLISH. | Happy |
| TC-PD-009 | FR-II-08 / ERR-PD-04 | Công khai — API Cổng PLQG lỗi → không chuyển trạng thái | 1. User CB PD/CB NV đã đăng nhập. 2. HD-057 ở DA_DUYET. 3. API Cổng PLQG đang down/timeout. | — | 1. Chọn HD-057 (DA_DUYET). 2. Nhấn [Công khai]. | 1. ERR-PD-04: "Lỗi kết nối Cổng PLQG. Vui lòng thử công khai lại". 2. Trạng thái GIỮ NGUYÊN = DA_DUYET (không set nếu API lỗi). | Negative |

---

## D. HỦY CÔNG KHAI & ĐÓNG HỒ SƠ

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PD-010 | FR-II-08 | Hủy công khai — chuyển CONG_KHAI → DA_DUYET + gỡ API | 1. User CB NV đã đăng nhập. 2. HD-058 ở CONG_KHAI. | — | 1. Chọn HD-058 (CONG_KHAI). 2. Nhấn [Hủy công khai]. 3. Xác nhận. | 1. Trạng thái: CONG_KHAI → DA_DUYET. 2. Gọi API trực tiếp Cổng PLQG để gỡ nội dung. 3. AUDIT_LOG ghi UNPUBLISH. | Happy |
| TC-PD-011 | FR-II-08 | Đóng hồ sơ từ DA_DUYET → HOAN_THANH | 1. User CB NV đã đăng nhập. 2. HD-059 ở DA_DUYET. | — | 1. Mở chi tiết HD-059. 2. Nhấn [Đóng hồ sơ]. 3. Confirm dialog: "Đóng hồ sơ? Hồ sơ sẽ không thể chỉnh sửa." 4. Click [Xác nhận]. | 1. Trạng thái: DA_DUYET → HOAN_THANH. 2. Bản ghi bị khóa vĩnh viễn (BR-FLOW-03). 3. AUDIT_LOG ghi CLOSE. | Happy |

---

## E. PHÊ DUYỆT & CÔNG KHAI — EDGE CASES

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PD-012 | FR-II-08 / BR-EC-19 / ERR-PD-05 | 🔴 Phê duyệt hàng loạt > 100 bản ghi → bị chặn | 1. User CB_PD đã đăng nhập. 2. Tồn tại 101 bản ghi ở CHO_PHE_DUYET. | Chọn 101 bản ghi | 1. Tick chọn 101 bản ghi. 2. Click [Phê duyệt hàng loạt]. | 1. ERR-PD-05: Vượt quá 100 bản ghi/batch (BR-EC-19). 2. Hệ thống từ chối request. | Edge |
| TC-PD-013 | FR-II-08 / WRN-PD-01 | 🟡 Batch approve — 1 bản ghi lỗi, 4 thành công → kết quả hỗn hợp | 1. User CB_PD đã đăng nhập. 2. 5 bản ghi ở CHO_PHE_DUYET, 1 trong đó đã bị CB khác duyệt (race condition). | 5 bản ghi tích | 1. Tick chọn 5 bản ghi. 2. Click [Phê duyệt hàng loạt]. | 1. Xử lý per-record: 4 thành công, 1 lỗi (ERR-PD-03). 2. WRN-PD-01: "4 duyệt thành công, 1 lỗi". 3. Kết quả chi tiết dạng [{id, thanh_cong, ly_do_loi}]. 4. AUDIT_LOG ghi 4 entries thành công. | Edge |
| TC-PD-014 | FR-II-08 / BR-FLOW-04 | 🟡 Từ chối — lý do đúng 10 ký tự → boundary accept | 1. User CB_PD đã đăng nhập. 2. HD-060 ở CHO_PHE_DUYET. | ly_do_tu_choi: "Thiếu VBPL" (10 ký tự) | 1. Nhấn [Từ chối]. 2. Nhập "Thiếu VBPL" (đúng 10 ký tự). 3. Click [Xác nhận]. | 1. Từ chối thành công (10 ≥ 10 minimum). 2. Trạng thái → DANG_XU_LY. | Edge |
| TC-PD-015 | FR-II-08 | 🔴 Self-approve: Cùng user vừa soạn vừa duyệt → SRS Gap | 1. User có cả role CB_NV + CB_PD. 2. HD-061 do chính user này soạn phản hồi, đang ở CHO_PHE_DUYET. | — | 1. Đăng nhập user dual-role. 2. Mở HD-061 (do mình soạn). 3. Nhấn [Phê duyệt]. | 1. **SRS Gap (G1)**: SRS KHÔNG có rule `nguoi_duyet_id != nguoi_tao_id`. 2. Có khả năng phê duyệt thành công → lỗ hổng Self-approve. 3. Cần xác nhận hành vi thực tế. | Edge |
| TC-PD-016 | FR-II-08 | 🟡 Đóng hồ sơ từ CONG_KHAI → HOAN_THANH (skip DA_DUYET) | 1. User CB NV đã đăng nhập. 2. HD-062 ở CONG_KHAI. | — | 1. Mở chi tiết HD-062 (CONG_KHAI). 2. Nhấn [Đóng hồ sơ]. 3. Xác nhận. | 1. Trạng thái: CONG_KHAI → HOAN_THANH (luồng kết thúc từ CONG_KHAI). 2. Bản ghi bị khóa (BR-FLOW-03). 3. AUDIT_LOG ghi CLOSE. | Edge |

---

## F. HỦY YÊU CẦU — CANCEL (MOI → HUY)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PD-017 | FR-II-08 / SM-HOIDAP | Hủy yêu cầu từ trạng thái MOI thành công | 1. User CB_NV đã đăng nhập. 2. HD-063 ở MOI, KHÔNG có PHAN_HOI con. | — | 1. Mở chi tiết HD-063 (MOI). 2. Nhấn [Hủy yêu cầu]. 3. Confirm dialog hiện lên. 4. Click [Xác nhận]. | 1. Trạng thái: MOI → HUY. 2. Xóa mềm (soft delete). 3. AUDIT_LOG ghi CANCEL. | Happy |
| TC-PD-018 | FR-II-08 / SM-HOIDAP | Hủy yêu cầu từ trạng thái TIEP_NHAN → bị chặn | 1. User CB_NV đã đăng nhập. 2. HD-064 ở TIEP_NHAN. | — | 1. Mở chi tiết HD-064 (TIEP_NHAN). 2. Thử nhấn [Hủy yêu cầu]. | 1. Nút [Hủy yêu cầu] bị ẩn cho trạng thái TIEP_NHAN. 2. Hủy chỉ cho phép từ MOI. | Negative |
| TC-PD-019 | FR-II-08 / SM-HOIDAP | 🟡 Hủy yêu cầu MOI có PHAN_HOI con → kiểm tra ràng buộc | 1. User CB_NV đã đăng nhập. 2. HD-065 ở MOI nhưng có bản ghi PHAN_HOI con (edge case: ai đó đã soạn nháp trước khi tiếp nhận?). | — | 1. Mở chi tiết HD-065 (MOI, có PHAN_HOI). 2. Nhấn [Hủy yêu cầu]. | 1. Hệ thống chặn hủy: "Không có phản hồi đang soạn" là điều kiện. 2. Nếu có PHAN_HOI con → không cho phép hủy. | Edge |

---

## G. EDGE CASES BỔ SUNG — PHÊ DUYỆT & CÔNG KHAI

> **Nguồn bổ sung**: Edge Case Review `edge-case-review-FR02.md` — NotebookLM Session `d51cd9c3`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-PD-020 | FR-II-08 | 🟡 Batch reject (từ chối hàng loạt) — KHÔNG được phép | 1. User CB_PD đã đăng nhập. 2. 5 bản ghi ở CHO_PHE_DUYET. | Tick 5 bản ghi | 1. Tick chọn 5 bản ghi ở CHO_PHE_DUYET. 2. Kiểm tra có nút [Từ chối hàng loạt] không. | 1. KHÔNG có nút [Từ chối hàng loạt] (SRS: "Không hỗ trợ Từ chối hàng loạt — chỉ từ chối đơn"). 2. Lý do: BR-FLOW-04 yêu cầu lý do riêng cho từng bản ghi. 3. Chỉ có [Phê duyệt hàng loạt] + [Công khai hàng loạt]. | Edge |
| TC-PD-021 | FR-II-08 / BR-EC-20 | 🔴 Hủy công khai — API Cổng PLQG lỗi → trạng thái ROLLBACK về CONG_KHAI | 1. User CB NV đã đăng nhập. 2. HD-120 ở CONG_KHAI. 3. API Cổng PLQG đang down/timeout. | — | 1. Chọn HD-120 (CONG_KHAI). 2. Nhấn [Hủy công khai]. 3. Confirm dialog. 4. API gỡ bài thất bại. | 1. BR-EC-20: "KHÔNG set trạng thái mới trước khi API thành công". 2. Trạng thái ROLLBACK → GIỮ NGUYÊN CONG_KHAI (không chuyển DA_DUYET). 3. Thông báo lỗi: tương tự ERR-PD-04. 4. CB NV có thể thử lại sau. | Edge |
| TC-PD-022 | FR-II-08 | 🟡 CB PD xem nội dung phản hồi — Read-only (KHÔNG có nút sửa trên UI) | 1. User CB_PD đã đăng nhập. 2. HD-121 ở CHO_PHE_DUYET. | — | 1. Mở chi tiết HD-121. 2. Kiểm tra section phản hồi. | 1. Nội dung phản hồi hiển thị read-only (KHÔNG có Rich-text editor cho CB PD). 2. Action bar chỉ có: [Phê duyệt] + [Từ chối]. 3. **SRS Gap (G8)**: Permission Matrix cấp U (Update) cho CB_PD trên PHAN_HOI, nhưng UI KHÔNG cung cấp form sửa. 4. Hành vi thực tế: CB PD phải [Từ chối] + nhập lý do để trả CB NV sửa. | Edge |
| TC-PD-023 | FR-II-08 / SCR-II-02 | 🟡 Confirm dialog: Phê duyệt đơn lẻ phải hiện confirm | 1. User CB_PD đã đăng nhập. 2. HD-122 ở CHO_PHE_DUYET. | — | 1. Nhấn [Phê duyệt]. 2. Kiểm tra confirm dialog có hiện không. | 1. Confirm dialog BẮT BUỘC hiện trước khi thực hiện phê duyệt (SRS SCR-II-02 C12). 2. Nội dung: "Xác nhận phê duyệt?" 3. [Xác nhận] → thực hiện. [Hủy] → quay lại. | Edge |
| TC-PD-024 | FR-II-08 / SCR-II-02 | 🟡 Confirm dialog: Công khai đơn lẻ phải hiện confirm | 1. User CB NV đã đăng nhập. 2. HD-123 ở DA_DUYET. | — | 1. Nhấn [Công khai]. | 1. Confirm dialog BẮT BUỘC trước khi gọi API Cổng PLQG. 2. [Xác nhận] → thực hiện API call. [Hủy] → dừng. | Edge |
| TC-PD-025 | FR-II-08 / BR-EC-19 | 🟡 Công khai hàng loạt (Batch Publish) — max 100/batch, per-record | 1. User CB NV đã đăng nhập. 2. 5 bản ghi ở DA_DUYET. | Tick 5 bản ghi | 1. Tick chọn 5 bản ghi DA_DUYET. 2. Click [Công khai hàng loạt]. 3. Confirm dialog → Xác nhận. | 1. Confirm dialog hiện trước. 2. Xử lý per-record: gọi API Cổng PLQG cho từng bản ghi. 3. Kết quả hỗn hợp nếu 1 API fail. 4. Max 100/batch (BR-EC-19). | Edge |
| TC-PD-026 | FR-II-08 / FR-II-CROSS-01 | 🟡 SLA warning tại CHO_PHE_DUYET — thông báo nhắc CB PD | 1. HD-124 ở CHO_PHE_DUYET. 2. Đã quá N ngày không xử lý. | — | 1. Background job quét. 2. Kiểm tra thông báo gửi cho CB PD. | 1. EC-01: Bản ghi ở CHO_PHE_DUYET quá N ngày → tự động nhắc nhở CB PD. 2. Escalate lên cấp trên nếu vẫn không xử lý. 3. In-app + email. | Edge |
| TC-PD-027 | FR-II-08 / BR-FLOW-04 | 🟢 Từ chối — lý do đúng 9 ký tự → boundary reject | 1. User CB_PD đã đăng nhập. 2. HD-125 ở CHO_PHE_DUYET. | ly_do_tu_choi: "Thiếu VBP" (9 ký tự) | 1. Nhấn [Từ chối]. 2. Nhập "Thiếu VBP" (9 ký tự). 3. Click [Xác nhận]. | 1. ERR-PD-02: "Vui lòng nhập lý do từ chối" (9 < 10 minimum BR-FLOW-04). 2. KHÔNG chuyển trạng thái. | Edge |
| TC-PD-028 | FR-II-08 / ERR-DM-03 | 🟢 Lĩnh vực bị soft delete SAU KHI tạo hỏi đáp → hệ thống chặn xóa danh mục | 1. HD-126 đã tạo với linh_vuc_id = "Thuế". 2. Admin thử xóa lĩnh vực "Thuế". | — | 1. Admin vào Danh mục → xóa lĩnh vực "Thuế". | 1. Hệ thống check tham chiếu: HD-126 đang dùng lĩnh vực "Thuế". 2. ERR-DM-03: "Không thể xóa. Danh mục đang được sử dụng bởi {N} bản ghi...". 3. Chặn xóa → bảo vệ FK integrity. | Edge |

---

<!-- 
TRACEABILITY:
- ERR-PD-01/02/03/04/05, WRN-PD-01 lấy nguyên văn SRS qua NotebookLM
- BR-AUTH-05: Phê duyệt cùng cấp
- BR-FLOW-03: Khóa dữ liệu DA_DUYET/CONG_KHAI/HOAN_THANH
- BR-FLOW-04: Lý do từ chối ≥ 10 ký tự
- BR-FLOW-05: Công khai trực tiếp qua REST API (không qua LGSP)
- BR-EC-19: Batch approve max 100/batch, per-record
- BR-EC-20: DB Transaction Consistency — rollback khi API fail
- SRS Gap G1: Thiếu Self-approve restriction
- SRS Gap G8: Permission vs UI inconsistency cho CB_PD
- Section G bổ sung từ Edge Case Review 2026-04-18 (Session d51cd9c3)
-->
