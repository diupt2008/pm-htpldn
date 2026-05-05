# 🔍 Edge Case Hunter Review — Cấu hình hệ thống (SCR-VIII-06 / MH-10.7)

> **Phiên bản**: 1.0  
> **Ngày review**: 2026-04-17  
> **Nguồn xác minh**: NotebookLM Session `3b7c3e6a` (7 câu hỏi deep-dive)  
> **Phạm vi**: 49 test cases hiện tại (01-TC-SLA → 04-TC-quy-trinh)  
> **Phương pháp**: Exhaustive path enumeration — quét tất cả branching path, boundary condition, race condition, SRS gap

---

## Quy ước đọc

- **🔴 CRITICAL** — Edge case có thể gây crash, data corruption, hoặc security issue
- **🟡 HIGH** — Logic gap quan trọng, có thể dẫn đến sai nghiệp vụ
- **🟢 MEDIUM** — UX gap hoặc SRS chưa rõ, cần confirm với CĐT
- **TraceID** — Ánh xạ 1:1 với mã SRS gốc, KHÔNG tự chế
- **Kết quả mong đợi** — Trích nguyên văn hoặc bám sát SRS

---

## FILE 1: `01-TC-SLA.md` — Tab 1: Thời hạn xử lý / SLA (FR-VIII-10 / UC108)

### Các edge case CHƯA được cover (6 findings)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|------------|-------------------|---------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-SLA-017 | FR-VIII-10 / ERR-SLA-01 | Nhập thoi_han_ngay = số thập phân (3.5) → chặn | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 1 (SLA). | thoi_han_ngay: 3.5 | 1. Click vào ô thoi_han_ngay dòng HOI_DAP. 2. Nhập giá trị 3.5. 3. Click [Lưu cấu hình]. | 1. Lỗi ERR-SLA-01: "Thời hạn xử lý phải là số nguyên dương" (SRS: kiểu integer, thông báo ngầm hiểu chặn số thập phân). 2. Giá trị KHÔNG được lưu. **⚠️ SRS Gap**: Không có ERR code riêng cho kiểu dữ liệu sai — chỉ ngầm qua từ "số nguyên dương" trong ERR-SLA-01. | Edge | 🟡 HIGH |
| 2 | TC-SLA-018 | FR-VIII-10 / ERR-SLA-01 | Nhập thoi_han_ngay = ký tự chữ ("abc") → chặn | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 1. | thoi_han_ngay: "abc" | 1. Nhập "abc" vào ô thoi_han_ngay. 2. Click [Lưu cấu hình]. | 1. Hệ thống chặn nhập liệu (UI input type=number) HOẶC trả ERR-SLA-01: "Thời hạn xử lý phải là số nguyên dương". 2. **⚠️ SRS Gap**: Không có mã lỗi riêng cho sai kiểu dữ liệu — hành vi phụ thuộc vào implementation (UI chặn vs API reject). | Edge | 🟡 HIGH |
| 3 | TC-SLA-019 | FR-VIII-10 / DB Constraint | Nhập canh_bao_2 = 100 (biên trên nghiêm ngặt) → từ chối | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 1. | canh_bao_1: 50, canh_bao_2: 100 | 1. Sửa canh_bao_1 = 50, canh_bao_2 = 100 cho dòng VU_VIEC. 2. Click [Lưu cấu hình]. | 1. Hệ thống TỪ CHỐI. SRS validate: "canh_bao_1 < canh_bao_2 < 100" (nhỏ hơn nghiêm ngặt, KHÔNG bao gồm 100). 2. **⚠️ UX Gap**: Mã lỗi hiện có ERR-SLA-02 chỉ ghi "Mức cảnh báo 1 phải nhỏ hơn mức cảnh báo 2" — câu báo lỗi sai ngữ cảnh khi CB1=50, CB2=100 (thực tế vi phạm CB2 < 100, không phải CB1 >= CB2). | Edge | 🟡 HIGH |
| 4 | TC-SLA-020 | FR-VIII-10 / DB Constraint | Nhập canh_bao_1 = 0 (biên dưới) → chấp nhận | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 1. | canh_bao_1: 0, canh_bao_2: 80 | 1. Sửa canh_bao_1 = 0, canh_bao_2 = 80. 2. Click [Lưu cấu hình]. | 1. Lưu thành công. SRS: CHECK BETWEEN 0 AND 100 (bao gồm 0). 2. Giá trị 0 thỏa mãn: 0 < 80 < 100. 3. AUDIT_LOG ghi UPDATE. | Edge | 🟢 MEDIUM |
| 5 | TC-SLA-021 | FR-VIII-10 / DB Constraint | Nhập qua_han_he_so = 0.99 (vi phạm CHECK > 1) → lỗi DB | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 1. | qua_han_he_so: 0.99 | 1. Sửa qua_han_he_so = 0.99. 2. Click [Lưu cấu hình]. | 1. Chặn bởi DB Constraint CHECK > 1 (SRS: "qua_han_he_so CHECK > 1"). 2. **🔴 SRS Gap**: Bảng Error Handling HOÀN TOÀN VẮNG mã lỗi cho trường hợp này (chỉ có ERR-SLA-01/02/03) → Hệ thống có thể văng Database Exception (HTTP 500) thay vì thông báo thân thiện. | Edge | 🔴 CRITICAL |
| 6 | TC-SLA-022 | FR-VIII-10 / UC108 | Lưu inline-edit: 1 dòng lỗi + 3 dòng hợp lệ → kiểm tra transaction | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 1. 3. Tất cả 4 dòng SLA hiển thị. | Dòng VU_VIEC: canh_bao_1=90, canh_bao_2=50 (LỖI). Dòng HOI_DAP: thoi_han_ngay=3 (HỢP LỆ). | 1. Sửa inline dòng VU_VIEC: CB1=90, CB2=50 (vi phạm ERR-SLA-02). 2. Sửa inline dòng HOI_DAP: thoi_han_ngay=3 (hợp lệ). 3. Click [Lưu cấu hình] (1 nút lưu tất cả). | 1. Kiểm tra xem hệ thống Reject ALL (transaction nguyên tử) hay Partial Save (lưu 3 dòng, chỉ báo lỗi dòng VU_VIEC). 2. **⚠️ SRS Gap**: SRS thiết kế 1 nút [Lưu cấu hình] cho toàn Tab nhưng KHÔNG định nghĩa cơ chế Transaction (All-or-nothing vs Partial). Processing Bước 4 chỉ ghi chung "Tạo hoặc cập nhật bản ghi CAU_HINH_SLA". | Edge | 🔴 CRITICAL |

### Tổng hợp SRS Gaps phát hiện cho Tab 1

| # | Gap | Mức độ | Đề xuất |
|---|-----|--------|---------|
| G1 | Không có ERR code cho nhập sai kiểu dữ liệu (chữ, số thập phân) | 🟡 | Confirm với CĐT: UI chặn hay API trả lỗi riêng? |
| G2 | ERR-SLA-02 message sai ngữ cảnh khi CB2 = 100 (vi phạm < 100, không phải CB1 >= CB2) | 🟡 | Đề xuất thêm ERR-SLA-04 cho vi phạm boundary 0-100 |
| G3 | Hoàn toàn thiếu ERR code cho qua_han_he_so vi phạm CHECK > 1 | 🔴 | Rủi ro DB Exception (500) — cần ERR-SLA riêng |
| G4 | Chưa định nghĩa Transaction behavior cho batch inline-edit | 🔴 | Confirm: Reject ALL hay Partial Save? |

---

## FILE 2: `02-TC-phan-cong.md` — Tab 2: Phân công mặc định (FR-II-NEW-01)

### Các edge case CHƯA được cover (5 findings)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|------------|-------------------|---------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-PC-013 | FR-II-NEW-01 / ERR-CH-02 | Chọn CB/TVV đã vô hiệu hóa → lỗi ERR-CH-02 | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 2. 3. Tồn tại CB "Lê Văn C" trạng thái VO_HIEU_HOA (tài khoản đã khóa). | nguoi_xu_ly_id: "Lê Văn C" (VO_HIEU_HOA) | 1. Click thêm mapping mới → Modal mở. 2. Chọn Lĩnh vực = "Luật Hình sự". 3. Chọn Người xử lý = "Lê Văn C". 4. Click [Lưu]. | 1. Lỗi ERR-CH-02: "CB/TVV đã bị vô hiệu hóa" (SRS: Error Handling E2 — "CB/TVV không hoạt động" → ERR-CH-02). 2. Mapping KHÔNG được tạo. 3. Bước 2 Processing: "Kiểm tra lĩnh vực + người xử lý tồn tại" — validate kèm trạng thái hoạt động. | Edge | 🔴 CRITICAL |
| 2 | TC-PC-014 | FR-II-NEW-01 / ERR-CH-01 | Tạo mapping loai_yeu_cau=VU_VIEC khi đã có mapping cùng bộ 3 với loai_yeu_cau=TAT_CA → lỗi UNIQUE | 1. User QTHT đã đăng nhập. 2. Đã tồn tại mapping: linh_vuc="Luật DN" + nguoi_xu_ly="Nguyễn A" + don_vi=auto, loai_yeu_cau=TAT_CA. | linh_vuc_id: "Luật DN", nguoi_xu_ly_id: "Nguyễn A", loai_yeu_cau: VU_VIEC | 1. Click thêm mapping mới. 2. Chọn cùng Lĩnh vực + Người xử lý (don_vi auto-fill trùng). 3. Chọn loai_yeu_cau = VU_VIEC (khác TAT_CA). 4. Click [Lưu]. | 1. Lỗi ERR-CH-01: "Cấu hình lĩnh vực 'Luật DN' ↔ CB 'Nguyễn A' đã tồn tại". 2. SRS: UNIQUE constraint chỉ áp dụng cho bộ 3 (linh_vuc_id + nguoi_xu_ly_id + don_vi_id), KHÔNG bao gồm loai_yeu_cau. Processing Bước 3: "UNIQUE: linh_vuc_id + nguoi_xu_ly_id + don_vi_id". | Edge | 🟡 HIGH |
| 3 | TC-PC-015 | FR-II-NEW-01 | Thay đổi mapping phân công → hồ sơ đang xử lý KHÔNG bị ảnh hưởng | 1. User QTHT đã đăng nhập. 2. Hồ sơ HS_X đang xử lý, đã gán CB "Nguyễn A". 3. Đang ở Tab 2. | Xóa mapping "Luật DN" ↔ "Nguyễn A" | 1. Xóa mềm mapping "Luật DN" ↔ "Nguyễn A". 2. Kiểm tra hồ sơ HS_X đang xử lý. 3. Tạo hồ sơ mới HS_Y cùng lĩnh vực "Luật DN". | 1. HS_X: Vẫn giữ "Nguyễn A" là CB xử lý (KHÔNG bị ảnh hưởng). SRS: Cấu hình chỉ dùng để "Tải danh sách gợi ý phân công" tại thời điểm mở form, không tạo liên kết cứng (hard FK) với hồ sơ đã phân công. 2. HS_Y: Không còn gợi ý "Nguyễn A" cho lĩnh vực "Luật DN". | Edge | 🟡 HIGH |
| 4 | TC-PC-016 | FR-II-NEW-01 | Nhập uu_tien = 0 hoặc giá trị âm → kiểm tra validation | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 2. | uu_tien: 0 (hoặc -1) | 1. Click thêm mapping mới. 2. Nhập uu_tien = 0. 3. Click [Lưu]. | 1. Kiểm tra: hệ thống chấp nhận hay từ chối. 2. **⚠️ SRS Gap**: SRS chỉ ghi "1 = cao nhất, mặc định 99, sắp xếp uu_tien ASC" — KHÔNG có ràng buộc CHECK > 0 hay min value. Giá trị 0 hoặc âm có thể được lưu vào DB. | Edge | 🟢 MEDIUM |
| 5 | TC-PC-017 | FR-II-NEW-01 / UI | Browser F5 refresh khi đang nhập trên Modal → mất dữ liệu | 1. User QTHT đã đăng nhập. 2. Đang nhập dữ liệu trên Modal thêm mapping (chưa nhấn Lưu). | Đã chọn Lĩnh vực, Người xử lý | 1. Mở Modal thêm mapping mới. 2. Điền đầy đủ thông tin. 3. Nhấn F5 (refresh browser). | 1. Trang reload hoàn toàn. 2. Modal đóng, dữ liệu chưa lưu bị MẤT. 3. KHÔNG có cảnh báo beforeunload. 4. **⚠️ SRS Gap**: SRS KHÔNG quy định cảnh báo "unsaved changes" cho màn hình Cấu hình hệ thống (khác với màn hình Thêm TVV có quy định rõ "confirm neu unsaved"). | Edge | 🟢 MEDIUM |

### Tổng hợp SRS Gaps phát hiện cho Tab 2

| # | Gap | Mức độ | Đề xuất |
|---|-----|--------|---------|
| G5 | TC hiện tại thiếu hoàn toàn ERR-CH-02 (CB/TVV vô hiệu) — mã lỗi có trong SRS nhưng chưa test | 🔴 | Bắt buộc bổ sung TC-PC-013 |
| G6 | UNIQUE constraint không bao gồm loai_yeu_cau → potential conflict logic chưa test | 🟡 | Bổ sung TC-PC-014 |
| G7 | Không có min/max cho uu_tien | 🟢 | Confirm với CĐT |

---

## FILE 3: `03-TC-mau-phan-hoi.md` — Tab 3: Mẫu phản hồi (FR-II-NEW-02)

> **Update 2026-05-05 R12:** UI vẫn ở SCR-VIII-06 Tab 3 (module QTHT/Cau-hinh-he-thong/), nhưng actor CRUD đổi từ QTHT → CB_NV theo `srs-v3 §3.4.2` + `srs-update-2026-5-4 FR-II-NEW-02` (Mô hình B Hybrid 2 tầng — QTHT chỉ R, CB_NV CRUD\*). Pre-conditions của TC-MPH-011/012/014/015 đã chuyển từ "User QTHT" → "User CB_NV_TW (`cb_nv_tw_01`)". TC-MPH-013 giữ 2 actor (QTHT xóa Lĩnh vực + CB_NV_TW Read view). TC-MPH-015 đổi 2 actor: CB_NV_TW_A (sửa mẫu) + CB_NV_TW_B (đang chọn mẫu ở FR-II-07).

### Các edge case CHƯA được cover (5 findings)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|------------|-------------------|---------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-MPH-011 | FR-II-NEW-02 | Nội dung Rich Text cực dài → kiểm tra max length | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3 (Mẫu phản hồi). | noi_dung_mau: chuỗi text 100,000 ký tự (Rich Text) | 1. Click [+ Thêm mẫu phản hồi]. 2. Nhập ten_mau = "Test max length". 3. Paste nội dung Rich Text 100,000 ký tự vào noi_dung_mau. 4. Click [Lưu]. | 1. Kiểm tra: hệ thống chấp nhận hay giới hạn. 2. **⚠️ SRS Gap**: SRS quy định kiểu text (long) + Rich Text UI nhưng HOÀN TOÀN KHÔNG có Max Length (khác với "nội dung câu hỏi bị limit 5000 ký tự"). 3. Rủi ro: tràn dung lượng DB, response timeout, OOM nếu load danh sách. | Edge | 🟡 HIGH |
| 2 | TC-MPH-012 | FR-II-NEW-02 | Chèn ảnh/link vào Rich Text noi_dung_mau → kiểm tra sanitize | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3. | noi_dung_mau: `<img src="data:image/png;base64,...">` + `<a href="javascript:alert(1)">click</a>` | 1. Click [+ Thêm mẫu phản hồi]. 2. Chèn ảnh base64 và link JavaScript vào editor Rich Text. 3. Click [Lưu]. | 1. Kiểm tra: hệ thống cho phép hay chặn ảnh/link. 2. **⚠️ SRS Gap**: SRS KHÔNG đề cập quy định chèn ảnh, link trong editor Rich Text này. 3. **🔴 Security**: Nếu không sanitize → lỗ hổng XSS (Stored XSS qua noi_dung_mau). | Edge | 🔴 CRITICAL |
| 3 | TC-MPH-013 | FR-II-NEW-02 / FR-VIII-01 | Xóa mềm Lĩnh vực PL → mẫu phản hồi đang tham chiếu hiển thị lỗi | 1. User QTHT đã đăng nhập (xóa Lĩnh vực) + User CB_NV_TW xem Read view. 2. Tồn tại mẫu phản hồi với linh_vuc_id = "Luật DN" do CB_NV_TW seed. 3. Lĩnh vực "Luật DN" bị xóa mềm từ Danh mục. | Mẫu: ten_mau = "Hướng dẫn DN" → linh_vuc_id trỏ tới lĩnh vực đã xóa | 1. QTHT đi tới Danh mục dùng chung → Xóa mềm "Luật DN". 2. Quay lại Tab 3 (Mẫu phản hồi) — Read view. 3. Kiểm tra mẫu "Hướng dẫn DN". | 1. Kiểm tra hiển thị: Cột Lĩnh vực hiện gì? (trống/null/"Đã xóa"/tên cũ?) 2. **🔴 SRS Gap**: Quy tắc xóa Danh mục FR-VIII-01 liệt kê entity tham chiếu để block xóa: "HOI_DAP, VU_VIEC, TU_VAN_VIEN, CAU_HINH_PHAN_CONG, KHO_CAU_HOI" — entity MAU_PHAN_HOI bị **BỎ SÓT** khỏi danh sách → Lĩnh vực có thể xóa dù đang tham chiếu → Orphan data. | Edge | 🔴 CRITICAL |
| 4 | TC-MPH-014 | FR-II-NEW-02 | Sửa mẫu → phản hồi đã gửi KHÔNG bị ảnh hưởng (cơ chế Prefill/Copy) | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. CB NV đã gửi phản hồi dùng mẫu "Hướng dẫn chung" (nội dung cũ). 3. Đang ở Tab 3. | noi_dung_mau: "Nội dung V1" → "Nội dung V2" | 1. Sửa mẫu "Hướng dẫn chung": noi_dung_mau từ "V1" → "V2". 2. Click [Lưu]. 3. Kiểm tra phản hồi đã gửi trước đó bởi CB NV. | 1. Mẫu cập nhật V2 trên Tab 3. 2. Phản hồi đã gửi vẫn giữ nội dung "V1" (KHÔNG thay đổi). 3. SRS: Cơ chế Prefill/Copy — "tải nội dung mẫu → điền sẵn form" (FR-II-07 Processing Bước 3). Mẫu copy string vào noi_dung_phan_hoi, không tham chiếu FK. | Edge | 🟡 HIGH |
| 5 | TC-MPH-015 | FR-II-NEW-02 / Race Condition | VO_HIEU_HOA mẫu khi CB NV khác đang chọn mẫu (popup mở) → race condition | 1. CB_NV_TW_A (`cb_nv_tw_01`) đang ở Tab 3. CB_NV_TW_B (`cb_nv_tw_02`) đang soạn phản hồi ở màn hình FR-II-07, popup chọn mẫu đang mở. | Mẫu "Hướng dẫn DN" đang KICH_HOAT | 1. CB_NV_TW_A: Toggle mẫu "Hướng dẫn DN" → VO_HIEU_HOA, click [Lưu]. 2. CB_NV_TW_B (cùng thời điểm): chọn mẫu "Hướng dẫn DN" từ popup. | 1. CB_NV_TW_B: Nội dung mẫu vẫn được điền sẵn vào form (copy/prefill thành công). 2. CB_NV_TW_B: Khi nhấn [Gửi phản hồi] → lưu bình thường (nội dung đã copy thành string). 3. SRS: Processing FR-II-07 KHÔNG kiểm tra lại trang_thai mẫu khi gửi — chỉ validate "nội dung phản hồi không trống". 4. **⚠️ Gap**: Không có realtime lock/refresh khi mẫu bị VO_HIEU_HOA. | Edge | 🟢 MEDIUM |

### Tổng hợp SRS Gaps phát hiện cho Tab 3

| # | Gap | Mức độ | Đề xuất |
|---|-----|--------|---------|
| G8 | Không có Max Length cho noi_dung_mau (Rich Text) | 🟡 | Confirm với CĐT: đặt limit bao nhiêu? |
| G9 | Không có quy định chèn ảnh/link + rủi ro XSS | 🔴 | BẮT BUỘC: Backend phải sanitize HTML |
| G10 | MAU_PHAN_HOI bị bỏ sót khỏi danh sách tham chiếu FK khi xóa Lĩnh vực (FR-VIII-01) | 🔴 | Báo CĐT: bổ sung MAU_PHAN_HOI vào reference check |

---

## FILE 4: `04-TC-quy-trinh.md` — Tab 4: Quy trình hỗ trợ (FR-V.I-NEW-01)

### Các edge case CHƯA được cover (5 findings)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|------------|-------------------|---------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-QT-012 | FR-V.I-NEW-01 | Nhập thu_tu = 0 hoặc giá trị âm → kiểm tra validation | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 4 (Quy trình). | thu_tu: 0 (hoặc -1) | 1. Click [+ Thêm bước]. 2. Nhập thu_tu = 0. 3. Nhập ten_buoc = "Bước test zero". 4. Click [Lưu]. | 1. Kiểm tra: hệ thống chấp nhận hay từ chối. 2. **⚠️ SRS Gap**: Input định nghĩa thu_tu kiểu number. Hệ thống chỉ bắt ERR-QT-01 (trùng) — KHÔNG có ràng buộc CHECK > 0. Giá trị 0 hoặc -1 có thể lưu được. 3. Hệ thống hiển thị bước theo thu_tu ASC → bước thu_tu = -1 sẽ đứng đầu tiên. | Edge | 🟡 HIGH |
| 2 | TC-QT-013 | FR-V.I-NEW-01 | Xóa bước giữa quy trình → thu_tu bị đứt đoạn, KHÔNG auto-reindex | 1. User QTHT đã đăng nhập. 2. Tồn tại 3 bước quy trình: thu_tu = 1, 2, 3. | Xóa bước thu_tu = 2 ("Xác minh") | 1. Click [Xóa] trên dòng bước thu_tu = 2. 2. Xác nhận xóa. 3. Kiểm tra danh sách bước còn lại. | 1. Bước 2 bị xóa mềm. 2. Danh sách còn: thu_tu = 1, 3 (ĐỨT ĐOẠN). 3. SRS KHÔNG có logic Auto-Reindex — quản lý số thứ tự đứt đoạn đẩy cho QTHT tự xử lý bằng tay. 4. Hệ thống vẫn hoạt động bình thường với thu_tu không liên tục. | Edge | 🟡 HIGH |
| 3 | TC-QT-014 | FR-V.I-NEW-01 | Nhập thu_tu = số thập phân (1.5) → kiểm tra kiểu integer | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 4. | thu_tu: 1.5 | 1. Click [+ Thêm bước]. 2. Nhập thu_tu = 1.5. 3. Nhập ten_buoc = "Bước test decimal". 4. Click [Lưu]. | 1. Kiểm tra: thu_tu là integer hay cho phép decimal? 2. **⚠️ SRS Gap**: Input chỉ ghi kiểu "number" — không rõ integer hay decimal. Nếu DB column là integer → DB reject. Nếu decimal → bước 1.5 sẽ sắp xếp giữa bước 1 và 2. | Edge | 🟢 MEDIUM |
| 4 | TC-QT-015 | FR-V.I-NEW-01 | Thêm rất nhiều bước quy trình (stress test) → kiểm tra giới hạn | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 4. | Thêm 50 bước (thu_tu: 1 → 50) | 1. Lặp lại thêm bước 50 lần. 2. Kiểm tra UI hiển thị và performance. | 1. Kiểm tra: hệ thống cho phép bao nhiêu bước tối đa? 2. **⚠️ SRS Gap**: KHÔNG quy định Max steps. 3. UI: Bảng có hiển thị pagination (BR-DATA-07: 20/page) hay scroll? 4. Performance: Thời gian load khi 50+ bước? | Edge | 🟢 MEDIUM |
| 5 | TC-QT-016 | FR-V.I-NEW-01 | Max length cho ten_buoc, dieu_kien_chuyen, mo_ta → kiểm tra giới hạn ký tự | 1. User QTHT đã đăng nhập. 2. Đang ở Tab 4. | ten_buoc: 1000 ký tự, dieu_kien_chuyen: 10,000 ký tự, mo_ta: 10,000 ký tự | 1. Click [+ Thêm bước]. 2. Nhập ten_buoc 1000 ký tự. 3. Nhập dieu_kien_chuyen 10,000 ký tự. 4. Nhập mo_ta 10,000 ký tự. 5. Click [Lưu]. | 1. Kiểm tra giới hạn từng trường. 2. SRS: ten_buoc kiểu "text", dieu_kien_chuyen kiểu "text (long)", mo_ta kiểu "text (long)". 3. **⚠️ SRS Gap**: KHÔNG đề cập Max Length cho cả 3 trường — cột Ràng buộc để trống. | Edge | 🟢 MEDIUM |

### Tổng hợp SRS Gaps phát hiện cho Tab 4

| # | Gap | Mức độ | Đề xuất |
|---|-----|--------|---------|
| G11 | Không có CHECK > 0 cho thu_tu (cho phép 0, âm) | 🟡 | Confirm với CĐT |
| G12 | Không có Auto-Reindex khi xóa bước giữa | 🟡 | Document rõ: QTHT tự quản lý |
| G13 | Không rõ thu_tu là integer hay decimal | 🟢 | Confirm với CĐT/Dev |
| G14 | Không có Max steps cho quy trình | 🟢 | Stress test để xác định |
| G15 | Không có Max Length cho ten_buoc, dieu_kien_chuyen, mo_ta | 🟢 | Confirm với CĐT |

---

## FILE 0: `00-test-plan-overview.md` — Chung (Cross-cutting)

### Các edge case CHƯA được cover (2 findings)

| # | ID đề xuất | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type | Severity |
|---|------------|-------------------|---------------|---------------------------|----------------------|-------------------|------------------|------|----------|
| 1 | TC-CHUNG-001 | BR-DATA-07 | Pagination: dữ liệu < 20 bản ghi → kiểm tra hiển thị component phân trang | 1. User QTHT đã đăng nhập. 2. Tab 2/3/4 có ít hơn 20 bản ghi. | Tab 2: 3 mapping, Tab 3: 5 mẫu, Tab 4: 4 bước | 1. Mở Tab 2. 2. Kiểm tra footer bảng (pagination). 3. Lặp lại cho Tab 3, Tab 4. | 1. Kiểm tra: Component phân trang bị ẩn (hidden) hay hiển thị dạng "1/1 trang" (disabled)? 2. SRS BR-DATA-07: "Mọi danh sách sử dụng phân trang. Default: 20 rows/page". UI format: "Hiển thị 1-20 / {total_count} kết quả". 3. **⚠️ SRS Gap**: KHÔNG chỉ định UX behavior khi total < page_size. | Edge | 🟢 MEDIUM |
| 2 | TC-CHUNG-002 | SCR-VIII-06 / UI | QTHT nhấn browser Back button khi đang chỉnh sửa → mất dữ liệu không cảnh báo | 1. User QTHT đã đăng nhập. 2. Đang sửa dữ liệu trên bất kỳ tab nào (chưa nhấn Lưu). | Sửa inline hoặc đang trên Modal | 1. Sửa dữ liệu (inline hoặc Modal). 2. KHÔNG nhấn [Lưu]. 3. Nhấn browser Back button. | 1. Trang điều hướng (navigate away). 2. Dữ liệu chưa lưu bị MẤT. 3. KHÔNG có cảnh báo beforeunload. 4. SRS: Toàn bộ MCH Cấu hình hệ thống KHÔNG áp dụng cơ chế cảnh báo unsaved changes (khác màn hình Thêm TVV có "confirm neu unsaved"). | Edge | 🟢 MEDIUM |

---

## 📊 TỔNG HỢP REVIEW

### Thống kê Edge Cases phát hiện

| File TC | Findings | 🔴 CRITICAL | 🟡 HIGH | 🟢 MEDIUM |
|---------|----------|-------------|---------|-----------|
| `01-TC-SLA.md` | 6 | 2 | 3 | 1 |
| `02-TC-phan-cong.md` | 5 | 1 | 2 | 2 |
| `03-TC-mau-phan-hoi.md` | 5 | 2 | 2 | 1 |
| `04-TC-quy-trinh.md` | 5 | 0 | 2 | 3 |
| `00-test-plan-overview.md` (Chung) | 2 | 0 | 0 | 2 |
| **TỔNG** | **23** | **5** | **9** | **9** |

### Top 5 SRS Gaps nghiêm trọng nhất (🔴 CRITICAL)

| # | Gap ID | File | Mô tả | Rủi ro |
|---|--------|------|--------|--------|
| 1 | G3 | 01-TC-SLA | Thiếu ERR code cho qua_han_he_so vi phạm CHECK > 1 | DB Exception 500 |
| 2 | G4 | 01-TC-SLA | Chưa định nghĩa Transaction cho batch inline-edit | Partial save gây inconsistency |
| 3 | G5 | 02-TC-phan-cong | ERR-CH-02 (CB vô hiệu) có trong SRS nhưng CHƯA test | Mapping CB đã khóa vào hệ thống |
| 4 | G9 | 03-TC-mau-phan-hoi | Rich Text không sanitize → Stored XSS | Security vulnerability |
| 5 | G10 | 03-TC-mau-phan-hoi | MAU_PHAN_HOI bị bỏ sót khỏi reference check FR-VIII-01 | Orphan data khi xóa Lĩnh vực |

### Đề xuất hành động

1. **BẮT BUỘC bổ sung 5 TC CRITICAL** (TC-SLA-021, TC-SLA-022, TC-PC-013, TC-MPH-012, TC-MPH-013)
2. **Nên bổ sung 9 TC HIGH** — đặc biệt boundary testing (CB2=100, thu_tu=0, loai_yeu_cau conflict)
3. **Tùy chọn 9 TC MEDIUM** — UX gaps cần confirm với CĐT trước khi viết test
4. **Báo CĐT** về 15 SRS Gaps (G1→G15) để cập nhật SRS trước sprint tiếp theo
