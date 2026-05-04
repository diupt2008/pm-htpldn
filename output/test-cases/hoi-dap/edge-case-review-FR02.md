# Edge Case Hunter Review — SRS-FR-02: Hỏi đáp Pháp luật

> **Workflow**: `bmad-review-edge-case-hunter` (Exhaustive Path Analysis)  
> **Scope**: 7 file TC (01-07), 87 TC hiện tại  
> **Nguồn xác minh**: NotebookLM Session `d51cd9c3` (2 queries, 16 câu hỏi probe)  
> **Ngày review**: 2026-04-18  
> **Kết quả**: **31 edge cases CHƯA được phủ** — cần bổ sung vào test suite

---

## Tóm Tắt Executive

| Severity | Count | Mô tả |
|----------|-------|-------|
| 🔴 Critical | 5 | Lỗ hổng bảo mật, data integrity, race condition nghiêm trọng |
| 🟡 High | 14 | Logic rẽ nhánh ẩn, SRS inconsistency, notification gaps |
| 🟢 Medium | 12 | Boundary, UI behavior, pagination edge |

---

## FILE 01: `01-TC-quan-ly-hoi-dap.md` — CRUD (+8 TC mới)

### Findings

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|-----------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-HD-020 | FR-II-01 / BR-EC-19 | 🔴 Xóa hàng loạt (Batch Delete) — max 100/batch, per-record | 1. User CB_NV đã đăng nhập. 2. Tồn tại 5 bản ghi ở trạng thái MOI và TIEP_NHAN. | Tick chọn 5 bản ghi (MOI + TIEP_NHAN) | 1. Tick chọn 5 bản ghi. 2. Click [Xóa hàng loạt]. 3. Confirm dialog hiện lên. 4. Click [Xác nhận]. | 1. Xử lý per-record: 5 bản ghi xóa mềm thành công. 2. Chỉ xóa bản ghi NOT IN (DA_DUYET, CONG_KHAI, HOAN_THANH). 3. Max 100/batch (BR-EC-19). 4. AUDIT_LOG ghi 5 entries DELETE. | Edge | 🔴 |
| 2 | TC-HD-021 | FR-II-01 / BR-EC-19 | 🟡 Batch Delete hỗn hợp: 3 MOI + 2 DA_DUYET → partial success | 1. User CB_NV đã đăng nhập. 2. 5 bản ghi tick: 3 ở MOI, 2 ở DA_DUYET. | Tick 5 bản ghi hỗn hợp trạng thái | 1. Tick 5 bản ghi. 2. Click [Xóa hàng loạt]. 3. Xác nhận. | 1. Per-record: 3 MOI xóa thành công, 2 DA_DUYET lỗi ERR-HD-04. 2. Kết quả hỗn hợp: "3 xóa thành công, 2 lỗi". 3. AUDIT_LOG chỉ ghi 3 entries. | Edge | 🟡 |
| 3 | TC-HD-022 | FR-II-01 | 🟡 Upload file extension KHÔNG nằm trong whitelist → bị chặn | 1. User CB_NV đã đăng nhập. | file_dinh_kem: image.jpg (hoặc .png, .zip, .exe) | 1. Click [Thêm mới]. 2. Nhập đầy đủ trường bắt buộc. 3. Upload file image.jpg. | 1. Hệ thống từ chối: chỉ chấp nhận 5 định dạng: doc, docx, xls, xlsx, pdf. 2. jpg/png/zip/exe bị chặn ngay ở client-side + server-side. | Negative | 🟡 |
| 4 | TC-HD-023 | FR-II-01 / BR-DATA-04 | 🔴 2 CB NV đồng thời tạo HOI_DAP cùng ngày → SEQ collision | 1. CB_NV_A và CB_NV_B cùng đăng nhập. 2. Cùng ngày 18/04/2026, chưa có bản ghi nào. | CB_NV_A submit cùng mili-giây với CB_NV_B | 1. CB_NV_A nhấn [Lưu] tạo mới. 2. CB_NV_B nhấn [Lưu] cùng mili-giây. | 1. **SRS Gap**: SRS chỉ quy định format HD-YYYYMMDD-SEQ + UNIQUE constraint, KHÔNG mô tả Atomic Counter mechanism. 2. Nếu cơ chế DB Sequence đúng → mỗi bản ghi nhận SEQ khác nhau. 3. Nếu không → ném Unique Constraint Violation. 4. Cần xác minh implementation: DB sequence vs app-level counter. | Edge | 🔴 |
| 5 | TC-HD-024 | FR-II-01 / DG-06 | 🟢 Sắp xếp mặc định: Ngày tạo DESC + toggle sort | 1. User CB_NV đã đăng nhập. 2. Tồn tại nhiều bản ghi HOI_DAP. | — | 1. Mở danh sách `/hoi-dap`. 2. Kiểm tra thứ tự hiển thị mặc định. 3. Click header cột "Ngày tạo" để đảo chiều. | 1. Mặc định sort = "Ngày tạo" DESC (mới nhất trên cùng, DG-06). 2. Click header → toggle ASC. 3. Chỉ cột "Ngày tạo" là sortable (SRS chỉ gắn thẻ sortable cho cột này). | Edge | 🟢 |
| 6 | TC-HD-025 | FR-II-01 | 🟢 Nút [Làm mới] — chỉ AJAX reload, KHÔNG reset bộ lọc | 1. User CB_NV đã đăng nhập. 2. Đang có bộ lọc: Lĩnh vực = "Doanh nghiệp", Trạng thái = "MOI". | — | 1. Thiết lập bộ lọc. 2. Click [Làm mới] trên Toolbar. | 1. AJAX reload: tải lại dữ liệu mới nhất. 2. GIỮ NGUYÊN bộ lọc + scroll position + trang hiện tại. 3. KHÔNG reset bộ lọc (khác với [Xóa bộ lọc] ở Filter-bar). | Edge | 🟢 |
| 7 | TC-HD-026 | FR-II-01 | 🟢 Nút [Xóa bộ lọc] — reset tất cả filter về mặc định | 1. User CB_NV đã đăng nhập. 2. Đang có bộ lọc active. | — | 1. Click [Xóa bộ lọc] ở Filter-bar. | 1. Xóa mọi từ khóa + dropdown về giá trị mặc định. 2. Danh sách reload không bộ lọc. | Edge | 🟢 |
| 8 | TC-HD-027 | FR-II-01 | 🟡 Sửa thông tin câu hỏi gốc khi trạng thái CHO_PHE_DUYET — Boundary ẩn | 1. User CB_NV đã đăng nhập. 2. HD-070 ở CHO_PHE_DUYET. | noi_dung câu hỏi gốc: "Sửa nội dung gốc" | 1. Mở chi tiết HD-070 (CHO_PHE_DUYET). 2. Thử sửa thông tin câu hỏi gốc (noi_dung, ten_nguoi_gui...). | 1. FR-II-01 chỉ chặn sửa ở DA_DUYET/HOAN_THANH (BR-FLOW-03). 2. CHO_PHE_DUYET KHÔNG nằm trong danh sách khóa → CB NV CÓ THỂ sửa thông tin câu hỏi gốc. 3. Nhưng nội dung phản hồi (PHAN_HOI) thì BỊ KHÓA. 4. Cần xác minh: form có tách biệt 2 section không? | Edge | 🟡 |

---

## FILE 02: `02-TC-tim-kiem-tong-hop.md` — Search (+2 TC mới)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|-----------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 9 | TC-TK-011 | FR-II-02 / DG-06 | 🟢 Tìm kiếm — kết quả sắp xếp theo Ngày tạo DESC mặc định | 1. User CB_NV đã đăng nhập. 2. Khớp nhiều kết quả. | keyword: "doanh nghiệp" | 1. Nhập keyword. 2. Click [Tìm kiếm]. 3. Kiểm tra thứ tự kết quả. | 1. Kết quả sắp xếp = Ngày tạo DESC (DG-06). 2. Bản ghi mới nhất hiển thị đầu tiên. | Edge | 🟢 |
| 10 | TC-TK-012 | FR-II-02 | 🟢 Tìm kiếm chỉ nhập tu_ngay (không nhập den_ngay) → hệ thống xử lý thế nào | 1. User CB_NV đã đăng nhập. | tu_ngay: "2026-01-01", den_ngay: null | 1. Chọn tu_ngay = 01/01/2026. 2. Bỏ trống den_ngay. 3. Click [Tìm kiếm]. | 1. Hệ thống tìm tất cả bản ghi từ 01/01/2026 trở đi (đến hiện tại). 2. HOẶC yêu cầu nhập cả 2 ngày. 3. Cần xác minh hành vi thực tế. | Edge | 🟢 |

---

## FILE 03: `03-TC-tiep-nhan-xu-ly.md` — Tiếp nhận (+2 TC mới)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|-----------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 11 | TC-TN-011 | FR-II-03 / BR-SLA-01 | 🟡 SLA tính khi tuần liên tiếp nghỉ lễ (30/04 + 01/05 + weekend) | 1. User CB_NV đã đăng nhập. 2. Tiếp nhận vào Thứ 4 (29/04/2026). 3. NGAY_LE chứa 30/04 + 01/05. | — | 1. Tiếp nhận HD-080 vào 29/04 (T4). 2. Kiểm tra deadline. | 1. T4 29/04 (đếm) → T5 30/04 (lễ, skip) → T6 01/05 (lễ, skip) → T7 02/05 (weekend, skip) → CN 03/05 (weekend, skip) → T2 04/05 (đếm) → T3 05/05 → T4 06/05 → T5 07/05. 2. Deadline = 07/05 hoặc 08/05 (tùy cách đếm ngày tiếp nhận). | Edge | 🟡 |
| 12 | TC-TN-012 | FR-II-03 / BR-SLA-02 | 🟡 SLA badge chuyển vàng/đỏ/đen đúng ngưỡng — kiểm tra background job | 1. Bản ghi HD-081 ở DANG_XU_LY. 2. Deadline = 5 ngày. | Đợi > 50% thời hạn trôi qua | 1. Kiểm tra badge SLA sau 3 ngày (>50% consumed). 2. Kiểm tra sau 5 ngày (100% = quá hạn). 3. Kiểm tra sau 10 ngày (200% = nghiêm trọng). | 1. >50% thời hạn qua → Badge VÀNG "Sắp hết hạn". 2. >100% → Badge ĐỎ "Quá hạn" + thông báo CB NV + CB PD. 3. >200% → Badge ĐEN "QH nghiêm trọng" + escalate lên cấp trên. 4. Background job chạy mỗi 30 phút (BR-SLA-02). | Edge | 🟡 |

---

## FILE 04: `04-TC-quan-ly-tiep-nhan.md` — QL tiếp nhận (+3 TC mới)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|-----------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 13 | TC-QL-009 | FR-II-04 / BR-AUTH-04 | 🟡 CB_PD_TW xem data cấp BN/ĐP — xem được nhưng KHÔNG duyệt được | 1. User CB_PD_TW đã đăng nhập. 2. Tồn tại bản ghi HD-090 thuộc cấp BN ở DANG_XU_LY. | — | 1. Mở tab "Đang xử lý". 2. Xác nhận HD-090 (cấp BN) CÓ hiển thị trong danh sách. 3. Click vào HD-090. | 1. BR-AUTH-04: CB_PD_TW CÓ quyền XEM toàn bộ data TW + BN + ĐP. 2. Hiển thị HD-090 trong danh sách. 3. Nhưng khi chuyển sang CHO_PHE_DUYET, nút [Phê duyệt] sẽ bị chặn (BR-AUTH-05: phê duyệt cùng cấp). | Edge | 🟡 |
| 14 | TC-QL-010 | FR-II-04 | 🟢 Cập nhật thời hạn — thời hạn mới < ngày hiện tại → kiểm tra ràng buộc | 1. User CB_NV đã đăng nhập. 2. HD-091 ở DANG_XU_LY, hạn cũ = 30/04/2026. | thoi_han_moi: 10/04/2026 (quá khứ), ly_do: "Rút ngắn deadline" | 1. Mở chi tiết HD-091. 2. Nhập thời hạn mới = 10/04/2026 (quá khứ). 3. Click [Lưu]. | 1. Hệ thống có chấp nhận thời hạn trong quá khứ không? 2. Nếu chặn: "Thời hạn phải lớn hơn ngày hiện tại". 3. Nếu chấp nhận: bản ghi lập tức chuyển badge ĐỎ/ĐEN. | Edge | 🟢 |
| 15 | TC-QL-011 | FR-II-09 | 🟡 DA_PHAN_CONG — trạng thái ẩn, SRS Gap xung đột với SM-HOIDAP | 1. Vừa phân công HD-092 thành công. | — | 1. Kiểm tra trạng thái thực tế sau phân công. 2. Kiểm tra Stepper. | 1. **SRS Gap**: FR-II-06 ghi "trạng_thái = DA_PHAN_CONG". 2. Nhưng SM-HOIDAP KHÔNG có trạng thái DA_PHAN_CONG → chuyển thẳng TIEP_NHAN → DANG_XU_LY. 3. Stepper KHÔNG hiển thị DA_PHAN_CONG. 4. Cần xác minh implementation: có trạng thái trung gian hay không. | Edge | 🟡 |

---

## FILE 05: `05-TC-phan-cong-xu-ly.md` — Phân công (+2 TC mới)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|-----------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 16 | TC-PC-011 | FR-II-06 | 🟡 Phân công khi tất cả CB khớp lĩnh vực đều bị vô hiệu hóa → danh sách trống | 1. User CB_NV đã đăng nhập. 2. HD-100 ở TIEP_NHAN, lĩnh vực "Lao động". 3. Tất cả CB mapping "Lao động" đều có is_active=0. | — | 1. Mở phân công HD-100. 2. Kiểm tra danh sách gợi ý. | 1. Danh sách gợi ý TRỐNG (tất cả CB bị loại do vô hiệu hóa ERR-PC-01). 2. CB NV có thể chọn thủ công từ dropdown toàn bộ CB hoặc hệ thống thông báo không có CB phù hợp. | Edge | 🟡 |
| 17 | TC-PC-012 | FR-II-06 / BR-EC-01 | 🟢 2 CB NV cùng phân công cho cùng 1 bản ghi → Optimistic Locking | 1. CB_NV_A và CB_NV_B cùng đăng nhập. 2. HD-101 ở TIEP_NHAN, cả 2 mở cùng lúc. | CB_NV_A chọn CB_X, CB_NV_B chọn CB_Y | 1. CB_NV_A phân công cho CB_X → thành công. 2. CB_NV_B phân công cho CB_Y (updated_at đã thay đổi). | 1. CB_NV_A thành công. 2. CB_NV_B nhận ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang". | Edge | 🟢 |

---

## FILE 06: `06-TC-phan-hoi-cau-hoi.md` — Phản hồi (+5 TC mới)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|-----------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 18 | TC-PH-012 | FR-II-07 / PHAN_HOI 1:N | 🟡 Xem lịch sử phản hồi cũ (card-list) — nhiều lần từ chối-soạn lại | 1. User CB_NV đã đăng nhập. 2. HD-110 ở DANG_XU_LY, đã bị từ chối 2 lần → có 2 PHAN_HOI cũ. | — | 1. Mở chi tiết HD-110 (SCR-II-02). 2. Kiểm tra section "Danh sách phản hồi cũ". | 1. Card-list hiển thị 2 bản phản hồi cũ (mới nhất trên cùng). 2. Mỗi card: số thứ tự + nội dung + người soạn + ngày + lý do từ chối. 3. CB NV đang soạn bản thứ 3 trong Rich-text editor. | Edge | 🟡 |
| 19 | TC-PH-013 | FR-II-07 | 🟢 Reject loop vô hạn — bản ghi bị từ chối 10 lần → hệ thống không giới hạn | 1. HD-111 đã bị CB PD từ chối 10 lần liên tiếp. | — | 1. Kiểm tra: CB NV vẫn có thể soạn phản hồi lần thứ 11? 2. Card-list hiển thị 10 bản cũ? | 1. SRS KHÔNG giới hạn số lần từ chối-soạn lại (loop vô hạn). 2. Card-list "Phản hồi cũ" hiển thị tất cả 10 bản. 3. Hiệu năng scroll có bị ảnh hưởng? | Edge | 🟢 |
| 20 | TC-PH-014 | FR-II-07 / FR-II-NEW-02 | 🟢 Chọn mẫu → pre-fill → chọn mẫu khác → confirm ghi đè | 1. User CB_NV đã đăng nhập. 2. HD-112 ở DANG_XU_LY. 3. Đang soạn nội dung (có text). | Chọn mẫu "M1" → soạn thêm → chọn mẫu "M2" | 1. Chọn mẫu M1 → nội dung pre-fill. 2. Sửa một phần nội dung. 3. Chọn mẫu M2 (khác M1). | 1. Confirm dialog: "Nội dung hiện tại sẽ bị thay thế. Xác nhận?" (hoặc append?). 2. Nếu confirm → ghi đè bằng M2. 3. Nếu hủy → giữ nguyên nội dung đang soạn. | Edge | 🟢 |
| 21 | TC-PH-015 | FR-II-07 | 🟢 Lĩnh vực không có MAU_PHAN_HOI → dropdown mẫu trống | 1. User CB_NV đã đăng nhập. 2. HD-113 ở DANG_XU_LY, lĩnh vực "Thuế" (chưa có mẫu). | — | 1. Mở soạn phản hồi HD-113. 2. Kiểm tra dropdown mẫu phản hồi. | 1. Dropdown trống hoặc disabled: "Chưa có mẫu cho lĩnh vực này". 2. CB NV vẫn có thể soạn thủ công. | Edge | 🟢 |
| 22 | TC-PH-016 | FR-II-07 / FR-II-08 | 🔴 Phản hồi khi CB PD đang duyệt (race condition trạng thái) | 1. CB_NV_A đã đăng nhập, HD-114 ở DANG_XU_LY. 2. CB_NV_A tick "Đã trả lời" → CHO_PHE_DUYET. 3. CB_PD đang xem xét bản ghi. | CB_NV_A thử soạn phản hồi mới trong khi CB_PD đang review | 1. CB_NV_A gửi phản hồi → CHO_PHE_DUYET. 2. CB_NV_A quay lại chi tiết HD-114. 3. Thử soạn phản hồi mới (nếu UI cho phép). | 1. Form soạn phản hồi BỊ KHÓA khi trạng thái = CHO_PHE_DUYET. 2. CB NV chỉ thao tác được ở DA_PHAN_CONG / DANG_XU_LY. 3. Nếu KHÔNG khóa → lỗ hổng: phản hồi mới ghi đè bản đang chờ duyệt. | Edge | 🔴 |

---

## FILE 07: `07-TC-phe-duyet-cong-khai.md` — Phê duyệt & Công khai (+9 TC mới)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|-----------|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 23 | TC-PD-020 | FR-II-08 | 🟡 Batch reject (từ chối hàng loạt) — KHÔNG được phép | 1. User CB_PD đã đăng nhập. 2. 5 bản ghi ở CHO_PHE_DUYET. | Tick 5 bản ghi | 1. Tick chọn 5 bản ghi ở CHO_PHE_DUYET. 2. Kiểm tra có nút [Từ chối hàng loạt] không. | 1. KHÔNG có nút [Từ chối hàng loạt] (SRS: "Không hỗ trợ Từ chối hàng loạt — chỉ từ chối đơn"). 2. Lý do: BR-FLOW-04 yêu cầu lý do riêng cho từng bản ghi. 3. Chỉ có [Phê duyệt hàng loạt] + [Công khai hàng loạt]. | Edge | 🟡 |
| 24 | TC-PD-021 | FR-II-08 / BR-EC-20 | 🔴 Hủy công khai — API Cổng PLQG lỗi → trạng thái ROLLBACK về CONG_KHAI | 1. User CB NV đã đăng nhập. 2. HD-120 ở CONG_KHAI. 3. API Cổng PLQG đang down/timeout. | — | 1. Chọn HD-120 (CONG_KHAI). 2. Nhấn [Hủy công khai]. 3. Confirm dialog. 4. API gỡ bài thất bại. | 1. BR-EC-20: "KHÔNG set trạng thái mới trước khi API thành công". 2. Trạng thái ROLLBACK → GIỮ NGUYÊN CONG_KHAI (không chuyển DA_DUYET). 3. Thông báo lỗi: tương tự ERR-PD-04. 4. CB NV có thể thử lại sau. | Edge | 🔴 |
| 25 | TC-PD-022 | FR-II-08 | 🟡 CB PD xem nội dung phản hồi — Read-only (KHÔNG có nút sửa trên UI) | 1. User CB_PD đã đăng nhập. 2. HD-121 ở CHO_PHE_DUYET. | — | 1. Mở chi tiết HD-121. 2. Kiểm tra section phản hồi. | 1. Nội dung phản hồi hiển thị read-only (KHÔNG có Rich-text editor cho CB PD). 2. Action bar chỉ có: [Phê duyệt] + [Từ chối]. 3. **SRS Inconsistency**: Permission Matrix cấp U (Update) cho CB_PD trên PHAN_HOI, nhưng UI KHÔNG cung cấp form sửa. 4. Hành vi thực tế: CB PD phải [Từ chối] + nhập lý do để trả CB NV sửa. | Edge | 🟡 |
| 26 | TC-PD-023 | FR-II-08 | 🟡 Confirm dialog: Phê duyệt đơn lẻ phải hiện confirm | 1. User CB_PD đã đăng nhập. 2. HD-122 ở CHO_PHE_DUYET. | — | 1. Nhấn [Phê duyệt]. 2. Kiểm tra confirm dialog có hiện không. | 1. Confirm dialog BẮT BUỘC hiện trước khi thực hiện phê duyệt (SRS SCR-II-02 C12). 2. Nội dung: "Xác nhận phê duyệt?" 3. [Xác nhận] → thực hiện. [Hủy] → quay lại. | Edge | 🟡 |
| 27 | TC-PD-024 | FR-II-08 | 🟡 Confirm dialog: Công khai đơn lẻ phải hiện confirm | 1. User CB NV đã đăng nhập. 2. HD-123 ở DA_DUYET. | — | 1. Nhấn [Công khai]. | 1. Confirm dialog BẮT BUỘC trước khi gọi API Cổng PLQG. 2. [Xác nhận] → thực hiện API call. [Hủy] → dừng. | Edge | 🟡 |
| 28 | TC-PD-025 | FR-II-08 / BR-EC-19 | 🟡 Công khai hàng loạt (Batch Publish) — max 100/batch | 1. User CB NV đã đăng nhập. 2. 5 bản ghi ở DA_DUYET. | Tick 5 bản ghi | 1. Tick chọn 5 bản ghi DA_DUYET. 2. Click [Công khai hàng loạt]. 3. Confirm dialog → Xác nhận. | 1. Confirm dialog hiện trước. 2. Xử lý per-record: gọi API cho từng bản ghi. 3. Kết quả hỗn hợp nếu 1 API fail. 4. Max 100/batch. | Edge | 🟡 |
| 29 | TC-PD-026 | FR-II-08 / FR-II-CROSS-01 | 🟡 SLA warning tại CHO_PHE_DUYET — thông báo nhắc CB PD | 1. HD-124 ở CHO_PHE_DUYET. 2. Đã quá N ngày không xử lý. | — | 1. Background job quét. 2. Kiểm tra thông báo gửi cho CB PD. | 1. EC-01: Bản ghi ở CHO_PHE_DUYET quá N ngày → tự động nhắc nhở CB PD. 2. Escalate lên cấp trên nếu vẫn không xử lý. 3. In-app + email. | Edge | 🟡 |
| 30 | TC-PD-027 | FR-II-08 | 🟢 Từ chối — lý do đúng 9 ký tự → boundary reject | 1. User CB_PD đã đăng nhập. 2. HD-125 ở CHO_PHE_DUYET. | ly_do_tu_choi: "Thiếu VBP" (9 ký tự) | 1. Nhấn [Từ chối]. 2. Nhập "Thiếu VBP" (9 ký tự). 3. Click [Xác nhận]. | 1. ERR-PD-02: "Vui lòng nhập lý do từ chối" (9 < 10 minimum BR-FLOW-04). 2. KHÔNG chuyển trạng thái. | Edge | 🟢 |
| 31 | TC-PD-028 | FR-II-08 | 🟢 Lĩnh vực bị soft delete SAU KHI tạo hỏi đáp → bản ghi HOI_DAP không bị ảnh hưởng | 1. HD-126 đã tạo với linh_vuc_id = "Thuế". 2. Admin thử xóa lĩnh vực "Thuế" trong danh mục. | — | 1. Admin vào Danh mục → xóa lĩnh vực "Thuế". | 1. Hệ thống check tham chiếu: HD-126 đang dùng lĩnh vực "Thuế". 2. ERR-DM-03: "Không thể xóa. Danh mục đang được sử dụng bởi {N} bản ghi...". 3. Chặn xóa → bảo vệ FK integrity. | Edge | 🟢 |

---

## Tổng kết SRS Gaps & Inconsistencies Mới Phát Hiện

| # | Gap ID | Mô tả | Severity | TC liên quan |
|---|--------|-------|----------|--------------|
| G6 | SEQ Collision Mechanism | SRS quy định ma_hoi_dap UNIQUE + HD-YYYYMMDD-SEQ nhưng không mô tả Atomic Counter (DB Sequence vs App-level) | 🔴 | TC-HD-023 |
| G7 | DA_PHAN_CONG xung đột | FR-II-06 ghi trạng thái DA_PHAN_CONG nhưng SM-HOIDAP không có trạng thái này | 🟡 | TC-QL-011 |
| G8 | Permission vs UI inconsistency cho CB_PD | Permission Matrix cấp U trên PHAN_HOI cho CB_PD nhưng UI không cung cấp form sửa | 🟡 | TC-PD-022 |
| G9 | Reject loop vô hạn | SRS không giới hạn số lần từ chối-soạn lại → potential infinite loop | 🟢 | TC-PH-013 |
| G10 | Range filter một chiều | SRS không mô tả hành vi khi chỉ nhập tu_ngay mà không nhập den_ngay | 🟢 | TC-TK-012 |

---

## Mapping: File TC → Findings cần bổ sung

| File TC | Edge Cases mới | IDs đề xuất |
|---------|---------------|-------------|
| `01-TC-quan-ly-hoi-dap.md` | 8 | TC-HD-020 → TC-HD-027 |
| `02-TC-tim-kiem-tong-hop.md` | 2 | TC-TK-011 → TC-TK-012 |
| `03-TC-tiep-nhan-xu-ly.md` | 2 | TC-TN-011 → TC-TN-012 |
| `04-TC-quan-ly-tiep-nhan.md` | 3 | TC-QL-009 → TC-QL-011 |
| `05-TC-phan-cong-xu-ly.md` | 2 | TC-PC-011 → TC-PC-012 |
| `06-TC-phan-hoi-cau-hoi.md` | 5 | TC-PH-012 → TC-PH-016 |
| `07-TC-phe-duyet-cong-khai.md` | 9 | TC-PD-020 → TC-PD-028 |
| **TỔNG** | **31** | |

---

## Thống kê nếu bổ sung

| Metric | Trước Review | Sau Review | Δ |
|--------|-------------|------------|---|
| Tổng TC | 87 | 118 | +31 |
| Happy | 27 | 27 | +0 |
| Negative | 24 | 26 | +2 |
| Edge | 30 | 61 | +31 |
| Coverage SRS Gaps | G1-G5 | G1-G10 | +5 |

---

*Edge Case Hunter Review thực hiện bởi QA Automation | NotebookLM Session `d51cd9c3` | 2026-04-18*
