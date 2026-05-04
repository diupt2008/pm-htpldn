# Test Cases — FR-II-01 (UC10): Quản lý thông tin Hỏi đáp (SRS-FR-02)

> **SRS Ref**: FR-II-01, SCR-II-01 (Danh sách Hỏi đáp), Entity HOI_DAP  
> **Nguồn**: NotebookLM Session `7176b671`  
> **Ngày tạo**: 2026-04-18  
> **Đặc thù**: CRUD đầy đủ cho CB_NV. Auto-gen mã HD-YYYYMMDD-SEQ. Rich-text editor cho nội dung. File đính kèm quét ClamAV.

---

## Quy ước

| Ký hiệu | Ý nghĩa |
|----------|---------|
| **TraceID** | Ánh xạ 1-1 chính xác với mã yêu cầu gốc trong SRS. **TUYỆT ĐỐI KHÔNG tự chế mã.** |
| **Kết quả mong đợi** | Trích nguyên văn hoặc bám sát SRS. Không diễn giải mơ hồ. |
| **Happy** | Luồng chính — dữ liệu hợp lệ, quyền đúng, hệ thống hoạt động đúng spec |
| **Negative** | Luồng lỗi — dữ liệu sai, thiếu quyền, vi phạm ràng buộc → hệ thống chặn đúng |
| **Edge** | Ranh giới — boundary values, race condition, SRS gap, trạng thái đặc biệt |
| 🔴 | Critical — rủi ro cao, có thể gây lỗi hệ thống hoặc mất dữ liệu |
| 🟡 | High — rủi ro trung bình, ảnh hưởng nghiệp vụ |
| 🟢 | Medium — rủi ro thấp, nhưng cần kiểm tra |

---

## Trường dữ liệu HOI_DAP

| Trường | Bắt buộc | Kiểu | Ràng buộc |
|--------|----------|------|-----------|
| ma_hoi_dap | Có (Auto) | text | UNIQUE, format HD-YYYYMMDD-SEQ |
| noi_dung | Có | rich text | Max 5000 ký tự |
| linh_vuc_id | Có | FK | Phải tồn tại trong DANH_MUC |
| kenh_tiep_nhan | Có | enum | DVC / CONG_PLQG / TRUC_TIEP / HE_THONG_KHAC |
| ten_nguoi_gui | Không | text | — |
| email_nguoi_gui | Không | text | — |
| sdt_nguoi_gui | Không | text | — |
| doanh_nghiep_id | Không | FK | — |
| file_dinh_kem | Không | binary[] | doc/docx/xls/xlsx/pdf. Max 20MB/file |

---

## A. XEM DANH SÁCH — READ

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HD-001 | FR-II-01 / SCR-II-01 | Xem danh sách hỏi đáp — CB NV TW | 1. User CB_NV_TW đã đăng nhập. 2. Tồn tại dữ liệu HOI_DAP. | — | 1. Click menu "Quản lý hỏi đáp pháp lý". 2. Kiểm tra danh sách hiển thị. | 1. Navigate `/hoi-dap`. 2. Hiển thị bảng danh sách với các tab trạng thái (Tất cả/Mới/Đang xử lý/Chờ duyệt/Đã duyệt/Công khai/Hoàn thành). 3. Toolbar: [Thêm mới], [Xuất Excel], [Làm mới]. 4. Bộ lọc: Từ khóa, Lĩnh vực, Trạng thái, Khoảng ngày, Kênh tiếp nhận. 5. Default 20 rows/page (BR-DATA-07). 6. CB_NV_TW thấy toàn quốc (BR-AUTH-08). | Happy |
| TC-HD-002 | FR-II-01 / BR-AUTH-08 | Xem danh sách — CB NV BN chỉ thấy data đơn vị mình | 1. User CB_NV_BN đã đăng nhập (Bộ KH&ĐT). 2. Tồn tại data HOI_DAP từ nhiều đơn vị (TW, BN khác, ĐP). | — | 1. Mở `/hoi-dap`. 2. Kiểm tra danh sách hiển thị. 3. Xác nhận không có bản ghi đơn vị khác. | 1. Chỉ hiển thị bản ghi thuộc đơn vị Bộ KH&ĐT. 2. KHÔNG hiển thị bản ghi TW, BN khác, ĐP (BR-AUTH-08: ngang cấp KHÔNG thấy nhau). | Happy |
| TC-HD-003 | FR-II-01 / BR-DATA-07 | Pagination: thay đổi page size | 1. User CB_NV đã đăng nhập. 2. Tồn tại > 50 bản ghi. | — | 1. Mở danh sách. 2. Tại footer, thay đổi page size từ 20 → 50. | 1. Hiển thị 50 bản ghi/trang. 2. Các tùy chọn gồm: 10, 20, 50, 100. 3. Format: "Hiển thị 1-50 / {total_count} kết quả". | Happy |

---

## B. THÊM MỚI — CREATE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HD-004 | FR-II-01 / BR-DATA-04 | Thêm mới hỏi đáp thành công | 1. User CB_NV đã đăng nhập. 2. Tồn tại Lĩnh vực PL hợp lệ trong DANH_MUC. | noi_dung: "Hỏi về thủ tục đăng ký DN", linh_vuc_id: [Lĩnh vực Doanh nghiệp], kenh_tiep_nhan: "TRUC_TIEP", ten_nguoi_gui: "Nguyễn Văn A" | 1. Click [Thêm mới]. 2. Nhập nội dung hỏi đáp. 3. Chọn Lĩnh vực PL. 4. Chọn Kênh tiếp nhận = TRUC_TIEP. 5. Nhập tên người gửi. 6. Click [Lưu]. | 1. Tạo thành công, toast thông báo. 2. Mã tự động sinh: HD-20260418-001 (BR-DATA-04). 3. Trạng thái mặc định = MOI. 4. AUDIT_LOG ghi CREATE. 5. Bản ghi xuất hiện trong danh sách tab "Mới". | Happy |
| TC-HD-005 | FR-II-01 | Thêm mới với file đính kèm hợp lệ | 1. User CB_NV đã đăng nhập. | noi_dung: "Câu hỏi về hợp đồng", linh_vuc_id: [Hợp đồng], kenh_tiep_nhan: "DVC", file_dinh_kem: test.pdf (5MB) | 1. Click [Thêm mới]. 2. Điền đầy đủ trường bắt buộc. 3. Upload file test.pdf (5MB, định dạng pdf). 4. Click [Lưu]. | 1. File được quét ClamAV → sạch → lưu thành công. 2. Bản ghi mới hiển thị kèm icon đính kèm. 3. AUDIT_LOG ghi CREATE. | Happy |
| TC-HD-006 | FR-II-01 / ERR-HD-01 | Thêm mới — nội dung câu hỏi trống → lỗi | 1. User CB_NV đã đăng nhập. | noi_dung: "", linh_vuc_id: [có chọn], kenh_tiep_nhan: "DVC" | 1. Click [Thêm mới]. 2. Bỏ trống nội dung. 3. Chọn lĩnh vực, kênh tiếp nhận. 4. Click [Lưu]. | 1. Lỗi ERR-HD-01: "Nội dung câu hỏi là bắt buộc". 2. Bản ghi KHÔNG được tạo. | Negative |
| TC-HD-007 | FR-II-01 / ERR-HD-02 | Thêm mới — nội dung vượt 5000 ký tự → lỗi | 1. User CB_NV đã đăng nhập. | noi_dung: [chuỗi 5001 ký tự], linh_vuc_id: [có chọn], kenh_tiep_nhan: "DVC" | 1. Click [Thêm mới]. 2. Nhập nội dung 5001 ký tự. 3. Click [Lưu]. | 1. Lỗi ERR-HD-02: "Nội dung câu hỏi tối đa 5000 ký tự". 2. Bản ghi KHÔNG được tạo. | Negative |
| TC-HD-008 | FR-II-01 / ERR-HD-03 | Thêm mới — lĩnh vực PL không tồn tại → lỗi | 1. User CB_NV đã đăng nhập. 2. linh_vuc_id tham chiếu bản ghi đã bị xóa hoặc không tồn tại. | noi_dung: "Câu hỏi test", linh_vuc_id: [ID không tồn tại], kenh_tiep_nhan: "DVC" | 1. Click [Thêm mới]. 2. Bypass UI chọn lĩnh vực (hoặc xóa lĩnh vực sau khi chọn). 3. Click [Lưu]. | 1. Lỗi ERR-HD-03: "Lĩnh vực PL không tồn tại". 2. Bản ghi KHÔNG được tạo. | Negative |
| TC-HD-009 | FR-II-01 / ERR-FILE-02 | Upload file chứa mã độc → ClamAV chặn | 1. User CB_NV đã đăng nhập. | file_dinh_kem: eicar_test.pdf (file virus test) | 1. Click [Thêm mới]. 2. Điền đầy đủ trường bắt buộc. 3. Upload file eicar_test.pdf. | 1. ClamAV quét phát hiện mã độc. 2. Lỗi ERR-FILE-02: "Tệp chứa mã độc, không thể upload". 3. File KHÔNG được lưu vào hệ thống. | Negative |
| TC-HD-010 | FR-II-01 | Upload file vượt 20MB → lỗi | 1. User CB_NV đã đăng nhập. | file_dinh_kem: large_file.pdf (25MB) | 1. Click [Thêm mới]. 2. Upload file 25MB. | 1. Hệ thống từ chối upload. 2. Thông báo lỗi dung lượng. | Negative |
| TC-HD-011 | FR-II-01 / BR-DATA-04 | 🟡 Boundary: nội dung chính xác 5000 ký tự → chấp nhận | 1. User CB_NV đã đăng nhập. | noi_dung: [chuỗi đúng 5000 ký tự], linh_vuc_id: [hợp lệ], kenh_tiep_nhan: "TRUC_TIEP" | 1. Click [Thêm mới]. 2. Nhập nội dung đúng 5000 ký tự. 3. Click [Lưu]. | 1. Tạo thành công (5000 ≤ 5000 max). 2. Mã tự động sinh. | Edge |

---

## C. CHỈNH SỬA — UPDATE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HD-012 | FR-II-01 | Sửa hỏi đáp ở trạng thái MOI thành công | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi HD-001 ở trạng thái MOI. | noi_dung: "Sửa nội dung câu hỏi" | 1. Click vào bản ghi HD-001. 2. Nhấn [Sửa]. 3. Sửa nội dung. 4. Click [Lưu]. | 1. Cập nhật thành công, toast thông báo. 2. AUDIT_LOG ghi UPDATE (du_lieu_cu, du_lieu_moi). | Happy |
| TC-HD-013 | FR-II-01 / ERR-HD-04 / BR-FLOW-03 | Sửa hỏi đáp ở trạng thái DA_DUYET → bị chặn | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi HD-002 ở trạng thái DA_DUYET. | — | 1. Mở chi tiết bản ghi HD-002 (DA_DUYET). 2. Thử nhấn [Sửa]. | 1. Nút [Sửa] bị ẩn/disabled. 2. Nếu gọi API trực tiếp → ERR-HD-04: "Không thể sửa/xóa bản ghi đã phê duyệt". 3. BR-FLOW-03: Khóa dữ liệu khi DA_DUYET/CONG_KHAI/HOAN_THANH. | Negative |
| TC-HD-014 | FR-II-01 / ERR-SYS-02 / BR-EC-01 | 🟡 2 CB NV cùng sửa 1 bản ghi → Optimistic Locking | 1. CB_NV_A và CB_NV_B cùng đăng nhập. 2. Cả 2 mở cùng bản ghi HD-003 ở trạng thái MOI. | CB_NV_A sửa noi_dung = "Nội dung A". CB_NV_B sửa noi_dung = "Nội dung B". | 1. CB_NV_A mở chi tiết HD-003, đọc updated_at gốc. 2. CB_NV_B mở chi tiết HD-003, đọc updated_at gốc. 3. CB_NV_A sửa và [Lưu] → thành công. 4. CB_NV_B sửa và [Lưu]. | 1. CB_NV_A lưu thành công. 2. CB_NV_B nhận ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang". 3. Hộp thoại xung đột hiển thị với nút tải lại (KHÔNG auto-refresh). | Edge |

---

## D. XÓA MỀM — DELETE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HD-015 | FR-II-01 / BR-DATA-01 | Xóa mềm hỏi đáp ở trạng thái MOI thành công | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi HD-004 ở trạng thái MOI. | — | 1. Chọn bản ghi HD-004. 2. Click [Xóa]. 3. Confirm dialog hiện lên → nhấn [Xác nhận]. | 1. Xóa mềm thành công: is_deleted = 1 (BR-DATA-01). 2. Bản ghi biến mất khỏi danh sách. 3. AUDIT_LOG ghi DELETE. 4. Dữ liệu vật lý vẫn tồn tại trong DB. | Happy |
| TC-HD-016 | FR-II-01 / ERR-HD-04 / BR-FLOW-03 | Xóa hỏi đáp ở trạng thái CONG_KHAI → bị chặn | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi HD-005 ở trạng thái CONG_KHAI. | — | 1. Chọn bản ghi HD-005 (CONG_KHAI). 2. Thử [Xóa]. | 1. Nút [Xóa] bị ẩn/disabled cho trạng thái CONG_KHAI. 2. SRS: trang_thai NOT IN ('DA_DUYET', 'CONG_KHAI', 'HOAN_THANH') mới cho phép xóa. 3. Nếu gọi API → ERR-HD-04. | Negative |
| TC-HD-017 | FR-II-01 / ERR-TN-02 | 🟡 Xóa bản ghi đã bị xóa bởi người khác → lỗi | 1. User CB_NV_A đã đăng nhập. 2. Bản ghi HD-006 ở trạng thái MOI hiển thị trong danh sách. 3. CB_NV_B đã xóa HD-006 (is_deleted=1) nhưng CB_NV_A chưa refresh. | — | 1. CB_NV_A chọn HD-006 (đã bị xóa bởi B nhưng A chưa biết). 2. Click [Xóa] → [Xác nhận]. | 1. Lỗi ERR-TN-02: "Hỏi đáp không tồn tại hoặc đã bị xóa". 2. Bản ghi không bị xóa lần 2. | Edge |

---

## E. XUẤT EXCEL — EXPORT

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HD-018 | FR-II-01 / BR-DATA-06 | Xuất Excel thành công theo bộ lọc hiện tại | 1. User CB_NV đã đăng nhập. 2. Bộ lọc đang chọn: linh_vuc = "Doanh nghiệp", trạng thái = "MOI". | — | 1. Thiết lập bộ lọc: Lĩnh vực = Doanh nghiệp, Trạng thái = Mới. 2. Click [Xuất Excel]. | 1. Download file Excel. 2. File chứa đúng các bản ghi khớp bộ lọc hiện tại (BR-DATA-06: "xuất theo bộ lọc hiện tại"). 3. Các cột ánh xạ đúng cột hiển thị trên lưới. | Happy |
| TC-HD-019 | FR-II-01 / WRN-HD-01 | 🟡 Xuất Excel vượt 10.000 dòng → cảnh báo cắt | 1. User CB_NV_TW đã đăng nhập. 2. Tổng số bản ghi khớp bộ lọc > 10.000. | Bộ lọc: Tất cả, > 10.000 rows | 1. Bỏ trống bộ lọc (lấy tất cả). 2. Click [Xuất Excel]. | 1. WRN-HD-01: "Hệ thống sẽ xuất 10.000 dòng đầu tiên". 2. File Excel chỉ chứa 10.000 dòng. 3. Bảo vệ hiệu năng hệ thống. | Edge |

---

## F. XÓA HÀNG LOẠT — BATCH DELETE

> **Nguồn bổ sung**: Edge Case Review `edge-case-review-FR02.md` — NotebookLM Session `d51cd9c3`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HD-020 | FR-II-01 / BR-EC-19 | 🔴 Xóa hàng loạt thành công — max 100/batch, per-record | 1. User CB_NV đã đăng nhập. 2. Tồn tại 5 bản ghi ở trạng thái MOI và TIEP_NHAN. | Tick chọn 5 bản ghi (MOI + TIEP_NHAN) | 1. Tick chọn 5 bản ghi. 2. Click [Xóa hàng loạt]. 3. Confirm dialog hiện lên. 4. Click [Xác nhận]. | 1. Xử lý per-record: 5 bản ghi xóa mềm thành công. 2. Chỉ xóa bản ghi NOT IN (DA_DUYET, CONG_KHAI, HOAN_THANH). 3. Max 100/batch (BR-EC-19). 4. AUDIT_LOG ghi 5 entries DELETE. | Edge |
| TC-HD-021 | FR-II-01 / BR-EC-19 | 🟡 Batch Delete hỗn hợp: 3 MOI + 2 DA_DUYET → partial success | 1. User CB_NV đã đăng nhập. 2. 5 bản ghi tick: 3 ở MOI, 2 ở DA_DUYET. | Tick 5 bản ghi hỗn hợp trạng thái | 1. Tick 5 bản ghi. 2. Click [Xóa hàng loạt]. 3. Xác nhận. | 1. Per-record: 3 MOI xóa thành công, 2 DA_DUYET lỗi ERR-HD-04. 2. Kết quả hỗn hợp: "3 xóa thành công, 2 lỗi". 3. AUDIT_LOG chỉ ghi 3 entries. | Edge |

---

## G. EDGE CASES BỔ SUNG — CREATE & UPDATE

> **Nguồn bổ sung**: Edge Case Review `edge-case-review-FR02.md` — NotebookLM Session `d51cd9c3`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HD-022 | FR-II-01 | 🟡 Upload file extension KHÔNG nằm trong whitelist → bị chặn | 1. User CB_NV đã đăng nhập. | file_dinh_kem: image.jpg (hoặc .png, .zip, .exe) | 1. Click [Thêm mới]. 2. Nhập đầy đủ trường bắt buộc. 3. Upload file image.jpg. | 1. Hệ thống từ chối: chỉ chấp nhận 5 định dạng: doc, docx, xls, xlsx, pdf. 2. jpg/png/zip/exe bị chặn ngay ở client-side + server-side. | Negative |
| TC-HD-023 | FR-II-01 / BR-DATA-04 | 🔴 2 CB NV đồng thời tạo HOI_DAP cùng ngày → SEQ collision | 1. CB_NV_A và CB_NV_B cùng đăng nhập. 2. Cùng ngày 18/04/2026, chưa có bản ghi nào. | CB_NV_A submit cùng mili-giây với CB_NV_B | 1. CB_NV_A nhấn [Lưu] tạo mới. 2. CB_NV_B nhấn [Lưu] cùng mili-giây. | 1. **SRS Gap (G6)**: SRS chỉ quy định format HD-YYYYMMDD-SEQ + UNIQUE constraint, KHÔNG mô tả Atomic Counter mechanism. 2. Nếu DB Sequence đúng → mỗi bản ghi nhận SEQ khác nhau. 3. Nếu không → ném Unique Constraint Violation. 4. Cần xác minh implementation: DB sequence vs app-level counter. | Edge |
| TC-HD-027 | FR-II-01 / BR-FLOW-03 | 🟡 Sửa thông tin câu hỏi gốc khi trạng thái CHO_PHE_DUYET — Boundary ẩn | 1. User CB_NV đã đăng nhập. 2. HD-070 ở CHO_PHE_DUYET. | noi_dung câu hỏi gốc: "Sửa nội dung gốc" | 1. Mở chi tiết HD-070 (CHO_PHE_DUYET). 2. Thử sửa thông tin câu hỏi gốc (noi_dung, ten_nguoi_gui...). | 1. FR-II-01 chỉ chặn sửa ở DA_DUYET/HOAN_THANH (BR-FLOW-03). 2. CHO_PHE_DUYET KHÔNG nằm trong danh sách khóa → CB NV CÓ THỂ sửa thông tin câu hỏi gốc. 3. Nhưng nội dung phản hồi (PHAN_HOI) thì BỊ KHÓA. 4. Cần xác minh: form có tách biệt 2 section không? | Edge |

---

## H. EDGE CASES BỔ SUNG — READ (SORT & FILTER)

> **Nguồn bổ sung**: Edge Case Review `edge-case-review-FR02.md` — NotebookLM Session `d51cd9c3`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-HD-024 | FR-II-01 / DG-06 | 🟢 Sắp xếp mặc định: Ngày tạo DESC + toggle sort | 1. User CB_NV đã đăng nhập. 2. Tồn tại nhiều bản ghi HOI_DAP. | — | 1. Mở danh sách `/hoi-dap`. 2. Kiểm tra thứ tự hiển thị mặc định. 3. Click header cột "Ngày tạo" để đảo chiều. | 1. Mặc định sort = "Ngày tạo" DESC (mới nhất trên cùng, DG-06). 2. Click header → toggle ASC. 3. Chỉ cột "Ngày tạo" là sortable (SRS chỉ gắn thẻ sortable cho cột này). | Edge |
| TC-HD-025 | FR-II-01 | 🟢 Nút [Làm mới] — chỉ AJAX reload, KHÔNG reset bộ lọc | 1. User CB_NV đã đăng nhập. 2. Đang có bộ lọc: Lĩnh vực = "Doanh nghiệp", Trạng thái = "MOI". | — | 1. Thiết lập bộ lọc. 2. Click [Làm mới] trên Toolbar. | 1. AJAX reload: tải lại dữ liệu mới nhất. 2. GIỮ NGUYÊN bộ lọc + scroll position + trang hiện tại. 3. KHÔNG reset bộ lọc (khác với [Xóa bộ lọc] ở Filter-bar). | Edge |
| TC-HD-026 | FR-II-01 | 🟢 Nút [Xóa bộ lọc] — reset tất cả filter về mặc định | 1. User CB_NV đã đăng nhập. 2. Đang có bộ lọc active. | — | 1. Click [Xóa bộ lọc] ở Filter-bar. | 1. Xóa mọi từ khóa + dropdown về giá trị mặc định. 2. Danh sách reload không bộ lọc. | Edge |

---

<!-- 
==========================================================
  HƯỚNG DẪN SỬ DỤNG
==========================================================

1. NAMING: TC-HD = Test Case Hỏi đáp CRUD
2. TRACEABILITY: Mọi TraceID lấy từ SRS qua NotebookLM Session 7176b671 + d51cd9c3
3. FR-II-NEW-01, FR-II-NEW-02 (Cấu hình) → xem QTHT/Cau-hinh-he-thong/
4. Sections F/G/H bổ sung từ Edge Case Review 2026-04-18
-->
