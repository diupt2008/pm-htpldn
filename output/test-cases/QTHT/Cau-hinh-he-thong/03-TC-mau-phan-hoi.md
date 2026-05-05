# Test Cases — FR-II-NEW-02: Cấu hình Mẫu phản hồi (Tab 3 SCR-VIII-06 / MH-10.7)

> **UI location**: SCR-VIII-06 Tab 3 (URL `/quan-tri/cau-hinh?tab=mau-phan-hoi`) — thuộc module Quản trị hệ thống. Per `srs-v3 §FR-II-NEW-02 line 764` + `srs-update-2026-5-4 line 948`: ~~SCR-II-07~~ chuyển sang MH-10.7.
> **Permission (srs-v3 §3.4.2 row MAU_PHAN_HOI)**: QTHT=R, CB_NV_TW/BN/DP=CRUD\*, CB_PD=R\*. **Actor CRUD = CB_NV** theo Mô hình B Hybrid 2 tầng (`srs-update-2026-5-4 §FR-II-NEW-02`):
> - CB_NV_TW: tạo mẫu khung quốc gia (`pham_vi_ap_dung=TW_QUOC_GIA`) dùng chung 63 ĐP.
> - CB_NV_BN: tạo mẫu chuyên ngành riêng đơn vị mình (`pham_vi=BN_RIENG`).
> - CB_NV_DP: tạo mẫu địa phương riêng đơn vị mình (`pham_vi=DP_RIENG`).
> - QTHT: chỉ Read (cross-đơn vị), KHÔNG có nút [+ Thêm mới] / [Sửa] / [Xóa].
>
> **Đặc thù**: Quản lý kho mẫu câu hỏi/phản hồi theo lĩnh vực + đơn vị + phạm vi. Rich Text cho `noi_dung_mau`. 2 loại (MAU_CAU_HOI, MAU_PHAN_HOI) hiển thị chung 1 bảng. KHÔNG bắt trùng tên mẫu.
> **Nút hành động (CB_NV view)**: [+ Thêm mẫu phản hồi] → mở Modal/Drawer CRUD. Modal có [Hủy] và [Lưu]. Mỗi row có [Sửa] + [Xóa] khi user thuộc đơn vị sở hữu mẫu.
> **Nút hành động (QTHT view)**: KHÔNG có [+ Thêm mới] / [Sửa] / [Xóa] — Read-only.

---

## Trường dữ liệu Tab 3

| Trường | Bắt buộc | Kiểu | Ràng buộc | Mặc định |
|--------|----------|------|-----------|----------|
| ten_mau | Có | text | Bắt buộc. ERR-MPH-01 nếu trống. KHÔNG bắt unique. | — |
| linh_vuc_id | Có | select | Chọn từ danh mục Lĩnh vực PL | — |
| noi_dung_mau | Có | Rich Text (long) | Bắt buộc. ERR-MPH-02 nếu trống. KHÔNG giới hạn ký tự SRS. | — |
| loai | Có | enum | MAU_CAU_HOI hoặc MAU_PHAN_HOI | — |
| trang_thai | Có | toggle | KICH_HOAT hoặc VO_HIEU_HOA | — |
| pham_vi_ap_dung | Có | enum | TW_QUOC_GIA / BN_RIENG / DP_RIENG. UI tự lọc theo cấp user. Backend kiểm action-level MPH_CREATE_TW/BN/DP. | Theo cấp user |
| don_vi_id | Có | FK | Auto-fill = `user.don_vi_id` | — |

> **Lưu ý UI**: Trên bảng danh sách, cột hiển thị: Tên mẫu / Lĩnh vực / Nội dung mẫu / Trạng thái / Phạm vi áp dụng / Đơn vị / Hành động (chỉ hiện khi user có quyền UPDATE/DELETE). Thiếu cột "Loại" trên UI (dù trường `loai` tồn tại trong data).

---

## Permission scope (theo Mô hình B Hybrid 2 tầng)

| Vai trò | CREATE | READ | UPDATE | DELETE |
|---|---|---|---|---|
| CB_NV_TW (`cb_nv_tw_01`) | `pham_vi=TW_QUOC_GIA`, mọi LV | tất cả mẫu | mẫu thuộc đơn vị TW | mẫu thuộc đơn vị TW |
| CB_NV_BN (`cb_nv_bn_01`) | `pham_vi=BN_RIENG`, mọi LV thuộc BN | TW_QUOC_GIA + mẫu BN_RIENG đơn vị mình | mẫu BN_RIENG đơn vị mình | mẫu BN_RIENG đơn vị mình |
| CB_NV_DP (`cb_nv_dp_01`) | `pham_vi=DP_RIENG`, mọi LV thuộc DP | TW_QUOC_GIA + mẫu DP_RIENG đơn vị mình | mẫu DP_RIENG đơn vị mình | mẫu DP_RIENG đơn vị mình |
| QTHT | ❌ 403 ERR-MPH-04 | tất cả mẫu (cross-đơn vị) | ❌ 403 | ❌ 403 |
| CB_PD | ❌ | scoped theo cấp | ❌ | ❌ |
| Khác (DN/NHT/TVV/CG) | ❌ | ❌ 403 / UI ẩn | ❌ | ❌ |

---

## Test Cases — Happy + Negative + Edge (CB_NV CRUD)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|------|
| TC-MPH-019 | FR-II-NEW-02 / SCR-VIII-06 / UI | Verify trường thông tin Tab 3 (Mẫu phản hồi): cột bảng, trường Modal, kiểu input khớp SRS | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3 (Mẫu phản hồi). 3. Tồn tại ít nhất 1 mẫu. | — | 1. Mở Tab 3. Kiểm tra tiêu đề cột bảng danh sách. 2. Kiểm tra nút hành động trên bảng. 3. Click [+ Thêm mẫu phản hồi] → Modal mở. 4. Kiểm tra từng trường trên Modal: label, kiểu input, required marker. 5. Kiểm tra nút trên Modal. 6. Kiểm tra ô tìm kiếm/bộ lọc. | 1. **Cột bảng** hiển thị: Tên mẫu / Lĩnh vực / Nội dung mẫu / Trạng thái / Phạm vi áp dụng / Đơn vị / Hành động. ⚠️ Lưu ý SRS: cột "Loại" (loai) KHÔNG được liệt kê trong thiết kế cột — xác nhận có hay không trên UI. 2. **Trường Modal** đúng SRS: ten_mau = input text (bắt buộc, dấu *). linh_vuc_id = select dropdown (bắt buộc). noi_dung_mau = Rich Text editor (bắt buộc, hỗ trợ bold/italic/format). loai = select/radio 2 giá trị. trang_thai = toggle KICH_HOAT/VO_HIEU_HOA. pham_vi_ap_dung = auto-fill theo cấp user (CB_NV_TW → TW_QUOC_GIA, ẩn/disabled). don_vi_id = auto-fill `user.don_vi_id`. 3. **Nút bảng**: [+ Thêm mẫu phản hồi]. 4. **Nút Modal**: [Hủy] và [Lưu]. 5. **Mỗi dòng bảng**: nút [Sửa] + [Xóa] (chỉ với mẫu thuộc đơn vị user). 6. Có ô filter theo `pham_vi_ap_dung`/`linh_vuc_id`/`trang_thai`/`don_vi_id`. | Happy |
| TC-MPH-001 | FR-II-NEW-02 | Thêm mới mẫu phản hồi loại MAU_PHAN_HOI thành công (CB_NV_TW, TW_QUOC_GIA) | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3 (Mẫu phản hồi). | ten_mau: "Hướng dẫn DN đăng ký KD", linh_vuc_id: "Doanh nghiệp", noi_dung_mau: "<p>Kính gửi Quý DN...</p>", loai: MAU_PHAN_HOI, trang_thai: KICH_HOAT, pham_vi_ap_dung: TW_QUOC_GIA | 1. Click [+ Thêm mẫu phản hồi] → Modal mở. 2. Nhập ten_mau. 3. Chọn linh_vuc_id. 4. Nhập noi_dung_mau (Rich Text). 5. Chọn loai = MAU_PHAN_HOI. 6. Click [Lưu]. | 1. Modal đóng. 2. Mẫu mới xuất hiện trên bảng với badge 🟦 "TW khung quốc gia". 3. Nội dung Rich Text hiển thị đúng định dạng. 4. AUDIT_LOG ghi CREATE với `pham_vi_ap_dung=TW_QUOC_GIA`, `created_by=cb_nv_tw_01`. 5. Toast thành công. 6. CB_NV_BN/DP các đơn vị khác cũng thấy mẫu này (TW chia sẻ 63 ĐP). | Happy |
| TC-MPH-002 | FR-II-NEW-02 | Thêm mới mẫu câu hỏi loại MAU_CAU_HOI thành công | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3. | ten_mau: "Câu hỏi về thuế TNCN", loai: MAU_CAU_HOI, pham_vi_ap_dung: TW_QUOC_GIA | 1. Click [+ Thêm mẫu phản hồi]. 2. Điền đầy đủ, chọn loai = MAU_CAU_HOI. 3. Click [Lưu]. | 1. Lưu thành công. 2. Mẫu hiển thị chung 1 bảng cùng MAU_PHAN_HOI. | Happy |
| TC-MPH-003 | FR-II-NEW-02 | Sửa nội dung mẫu phản hồi (Rich Text) | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Tồn tại mẫu thuộc đơn vị TW cần sửa. | noi_dung_mau: cũ → thêm "<b>Lưu ý quan trọng</b>" | 1. Click [Sửa] trên dòng mẫu. 2. Chỉnh sửa noi_dung_mau trong editor Rich Text. 3. Click [Lưu]. | 1. Nội dung cập nhật thành công. 2. Rich Text giữ đúng formatting (bold, italic...). 3. AUDIT_LOG ghi UPDATE với du_lieu_cu và du_lieu_moi. | Happy |
| TC-MPH-004 | FR-II-NEW-02 | Xóa mềm mẫu phản hồi | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Tồn tại mẫu thuộc đơn vị TW cần xóa. | Mẫu: "Hướng dẫn DN đăng ký KD" | 1. Click [Xóa] trên dòng mẫu. 2. Modal xác nhận xóa hiển thị. 3. Xác nhận xóa. | 1. Mẫu bị xóa mềm (is_deleted = 1). 2. Biến mất khỏi danh sách. 3. Toast thành công. 4. AUDIT_LOG ghi DELETE. | Happy |
| TC-MPH-005 | FR-II-NEW-02 / ERR-MPH-01 | Thêm mẫu với ten_mau trống → lỗi | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3. | ten_mau: (trống), noi_dung_mau: "Nội dung test" | 1. Click [+ Thêm mẫu phản hồi]. 2. Bỏ trống ten_mau. 3. Nhập noi_dung_mau. 4. Click [Lưu]. | 1. Lỗi ERR-MPH-01: "Tên mẫu là bắt buộc". 2. Mẫu KHÔNG được tạo. | Negative |
| TC-MPH-006 | FR-II-NEW-02 / ERR-MPH-02 | Thêm mẫu với noi_dung_mau trống → lỗi | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3. | ten_mau: "Mẫu test", noi_dung_mau: (trống) | 1. Click [+ Thêm mẫu phản hồi]. 2. Nhập ten_mau. 3. Bỏ trống noi_dung_mau. 4. Click [Lưu]. | 1. Lỗi ERR-MPH-02: "Nội dung mẫu là bắt buộc". 2. Mẫu KHÔNG được tạo. | Negative |
| TC-MPH-007 | FR-II-NEW-02 / ERR-MPH-01 + ERR-MPH-02 | Thêm mẫu bỏ trống cả 2 trường bắt buộc | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3. | ten_mau: (trống), noi_dung_mau: (trống) | 1. Click [+ Thêm mẫu phản hồi]. 2. Bỏ trống cả ten_mau và noi_dung_mau. 3. Click [Lưu]. | 1. Hiển thị cả ERR-MPH-01 VÀ ERR-MPH-02. 2. Mẫu KHÔNG được tạo. | Negative |
| TC-MPH-008 | FR-II-NEW-02 | Thêm 2 mẫu cùng tên → cho phép (KHÔNG bắt unique tên) | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đã tồn tại mẫu ten_mau = "Hướng dẫn chung". | ten_mau: "Hướng dẫn chung" (trùng) | 1. Click [+ Thêm mẫu phản hồi]. 2. Nhập ten_mau = "Hướng dẫn chung" (trùng). 3. Điền đầy đủ các trường khác. 4. Click [Lưu]. | 1. Lưu thành công. 2. SRS KHÔNG định nghĩa unique constraint cho ten_mau. 3. 2 mẫu cùng tên tồn tại trong bảng. | Edge |
| TC-MPH-009 | FR-II-NEW-02 / UI | MAU_CAU_HOI và MAU_PHAN_HOI hiển thị chung 1 bảng, thiếu cột Loại | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Tồn tại cả mẫu MAU_CAU_HOI và MAU_PHAN_HOI. | — | 1. Mở Tab 3. 2. Kiểm tra bảng danh sách mẫu. | 1. Cả 2 loại hiển thị chung 1 bảng. 2. Cột hiển thị: Tên mẫu / Lĩnh vực / Nội dung mẫu / Trạng thái / Phạm vi / Đơn vị / Hành động. 3. **Lưu ý SRS**: Thiết kế cột KHÔNG liệt kê cột "Loại" để phân biệt trực quan → kiểm tra thực tế có cột Loại hay không. | Edge |
| TC-MPH-010 | FR-II-NEW-02 / UI | Tab 3 có ô tìm kiếm/bộ lọc theo SRS update | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3. | — | 1. Mở Tab 3. 2. Kiểm tra giao diện tìm kiếm. | 1. Theo SRS update 2026-5-4 + Mô hình B, có filter theo `pham_vi_ap_dung` / `linh_vuc_id` / `trang_thai` / `don_vi_id`. 2. Nếu UI thiếu filter → log Minor (gap UX). | Edge |
| TC-MPH-011 | FR-II-NEW-02 | Nội dung Rich Text cực dài → kiểm tra max length | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3 (Mẫu phản hồi). | noi_dung_mau: chuỗi text 100,000 ký tự (Rich Text) | 1. Click [+ Thêm mẫu phản hồi]. 2. Nhập ten_mau = "Test max length". 3. Paste nội dung Rich Text 100,000 ký tự vào noi_dung_mau. 4. Click [Lưu]. | 1. Kiểm tra: hệ thống chấp nhận hay giới hạn. 2. ⚠️ SRS Gap: SRS quy định kiểu text (long) + Rich Text UI nhưng HOÀN TOÀN KHÔNG có Max Length (khác với "nội dung câu hỏi bị limit 5000 ký tự"). 3. Rủi ro: tràn dung lượng DB, response timeout, OOM nếu load danh sách. | Edge |
| TC-MPH-012 | FR-II-NEW-02 | 🔴 Chèn ảnh/link vào Rich Text noi_dung_mau → kiểm tra sanitize XSS | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3. | noi_dung_mau: `<img src="data:image/png;base64,...">` + `<a href="javascript:alert(1)">click</a>` | 1. Click [+ Thêm mẫu phản hồi]. 2. Chèn ảnh base64 và link JavaScript vào editor Rich Text. 3. Click [Lưu]. | 1. Kiểm tra: hệ thống cho phép hay chặn ảnh/link. 2. ⚠️ SRS Gap: SRS KHÔNG đề cập quy định chèn ảnh, link trong editor Rich Text này. 3. 🔴 Security: Nếu không sanitize → lỗ hổng Stored XSS qua noi_dung_mau khi user khác load mẫu để prefill. | Edge |
| TC-MPH-013 | FR-II-NEW-02 / FR-VIII-01 | 🔴 Xóa mềm Lĩnh vực PL → mẫu phản hồi đang tham chiếu hiển thị (orphan data) | 1. QTHT đã đăng nhập (xóa Lĩnh vực) + CB_NV_TW xem Read view. 2. Tồn tại mẫu phản hồi với linh_vuc_id = "Luật DN" do CB_NV_TW seed. 3. Lĩnh vực "Luật DN" bị xóa mềm. | Mẫu: ten_mau = "Hướng dẫn DN" → linh_vuc_id trỏ tới lĩnh vực đã xóa | 1. QTHT xóa mềm "Luật DN" trong DM dùng chung. 2. CB_NV_TW quay lại Tab 3. 3. Kiểm tra mẫu "Hướng dẫn DN". | 1. Kiểm tra hiển thị: Cột Lĩnh vực hiện gì? (trống/null/"Đã xóa"/tên cũ?) 2. 🔴 SRS Gap: Quy tắc xóa Danh mục FR-VIII-01 liệt kê entity tham chiếu để block xóa: "HOI_DAP, VU_VIEC, TU_VAN_VIEN, CAU_HINH_PHAN_CONG, KHO_CAU_HOI" — entity MAU_PHAN_HOI bị BỎ SÓT khỏi danh sách → Lĩnh vực có thể xóa dù đang tham chiếu → Orphan data. | Edge |
| TC-MPH-014 | FR-II-NEW-02 | Sửa mẫu → phản hồi đã gửi KHÔNG bị ảnh hưởng (cơ chế Prefill/Copy) | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đã có PHAN_HOI gửi trước dùng mẫu "Hướng dẫn chung" (nội dung V1). 3. Đang ở Tab 3. | noi_dung_mau: "Nội dung V1" → "Nội dung V2" | 1. Sửa mẫu "Hướng dẫn chung": noi_dung_mau từ "V1" → "V2". 2. Click [Lưu]. 3. Kiểm tra phản hồi đã gửi trước đó. | 1. Mẫu cập nhật V2 trên Tab 3. 2. Phản hồi đã gửi vẫn giữ nội dung "V1" (KHÔNG thay đổi). 3. SRS: Cơ chế Prefill/Copy — copy string vào noi_dung_phan_hoi, không tham chiếu FK. | Edge |
| TC-MPH-015 | FR-II-NEW-02 / Race Condition | VO_HIEU_HOA mẫu khi CB NV khác đang chọn mẫu (popup mở) → race condition | 1. CB_NV_TW_A (`cb_nv_tw_01`) đang ở Tab 3. CB_NV_TW_B (`cb_nv_tw_02`) đang soạn phản hồi ở FR-II-07 (SCR-II-02), popup chọn mẫu đang mở. | Mẫu "Hướng dẫn DN" đang KICH_HOAT | 1. CB_NV_TW_A: Toggle mẫu "Hướng dẫn DN" → VO_HIEU_HOA, click [Lưu]. 2. CB_NV_TW_B (cùng thời điểm): chọn mẫu "Hướng dẫn DN" từ popup. | 1. CB_NV_TW_B: Nội dung mẫu vẫn được điền sẵn vào form (copy/prefill thành công). 2. Khi nhấn [Gửi phản hồi] → lưu bình thường (nội dung đã copy thành string). 3. SRS: Processing FR-II-07 KHÔNG kiểm tra lại trang_thai mẫu khi gửi — chỉ validate "nội dung phản hồi không trống". 4. ⚠️ Gap: Không có realtime lock/refresh khi mẫu bị VO_HIEU_HOA. | Edge |
| TC-MPH-016 | FR-II-NEW-02 / ERR-SYS-02 | 2 CB_NV_TW cùng đơn vị cùng sửa 1 mẫu phản hồi → Optimistic Locking | 1. CB_NV_TW_A (`cb_nv_tw_01`) và CB_NV_TW_B (`cb_nv_tw_02`) đăng nhập. 2. Cả 2 mở Tab 3 cùng lúc. | Mẫu "Hướng dẫn DN" thuộc đơn vị TW: noi_dung_mau cũ | 1. CB_NV_TW_A click [Sửa] mẫu "Hướng dẫn DN", sửa noi_dung_mau = "V2" → [Lưu] → thành công. 2. CB_NV_TW_B click [Sửa] cùng mẫu, sửa noi_dung_mau = "V3" → [Lưu]. | 1. CB_NV_TW_A: Lưu thành công, noi_dung_mau = "V2". 2. CB_NV_TW_B: ERR-SYS-02: "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang". 3. BR-EC-01: Optimistic Locking kiểm tra updated_at → xung đột → reject. | Edge |
| TC-MPH-017 | FR-II-NEW-02 | Toggle trạng thái mẫu phản hồi KICH_HOAT ↔ VO_HIEU_HOA | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Tồn tại mẫu "Hướng dẫn chung" với trang_thai = KICH_HOAT, đơn vị TW. | trang_thai: KICH_HOAT → VO_HIEU_HOA | 1. Click [Sửa] trên dòng mẫu "Hướng dẫn chung". 2. Toggle trang_thai từ KICH_HOAT → VO_HIEU_HOA. 3. Click [Lưu]. | 1. Lưu thành công. 2. Mẫu vẫn hiển thị trên danh sách (vô hiệu, không xóa). 3. Mẫu KHÔNG xuất hiện trong popup chọn mẫu của CB NV ở FR-II-07 (chỉ load mẫu KICH_HOAT). 4. AUDIT_LOG ghi UPDATE: trang_thai "KICH_HOAT" → "VO_HIEU_HOA". | Happy |
| TC-MPH-018 | FR-II-NEW-02 | Thêm mẫu bỏ trống linh_vuc_id (bắt buộc) → lỗi | 1. User CB_NV_TW (`cb_nv_tw_01`) đã đăng nhập. 2. Đang ở Tab 3. | ten_mau: "Test thiếu LV", noi_dung_mau: "Nội dung test", linh_vuc_id: (trống) | 1. Click [+ Thêm mẫu phản hồi]. 2. Nhập ten_mau, noi_dung_mau. 3. Bỏ trống linh_vuc_id (không chọn lĩnh vực). 4. Click [Lưu]. | 1. Hệ thống từ chối lưu. 2. Hiển thị lỗi validation: trường Lĩnh vực là bắt buộc. 3. Mẫu KHÔNG được tạo. | Negative |

---

## Test Cases — Mô hình B Hybrid scope (CB_NV BN/DP create + scope read/update)

> Áp dụng `srs-update-2026-5-4 §FR-II-NEW-02` — action-level MPH_CREATE_TW/BN/DP + scope MPH_READ/UPDATE/DELETE theo `don_vi_id` + `pham_vi_ap_dung`. Backend kiểm action-level + scope (BR-AUTH-01, BR-AUTH-08 exception MAU_PHAN_HOI).

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|------|------------------|------|
| TC-MPH-MB-001 | srs-update-2026-5-4 §FR-II-NEW-02 / MPH_CREATE_BN | CB_NV_BN tạo mẫu BN_RIENG cho đơn vị mình | 1. CB_NV_BN (`cb_nv_bn_01`) đã đăng nhập. 2. user.don_vi_id = BN_KH-DT. 3. Đang ở Tab 3. | `pham_vi_ap_dung=BN_RIENG`, `don_vi_id=BN_KH-DT`, mọi LV thuộc BN | 1. Tab 3 → [+ Thêm mới]. 2. Form auto-fill `pham_vi=BN_RIENG`, `don_vi=BN_KH-DT`. 3. Điền tên + nội dung + LV. 4. Click [Lưu]. | 1. Lưu thành công. 2. Badge 🟩 "BN" trên row. 3. Chỉ user thuộc BN_KH-DT thấy mẫu này (cùng CB_NV_TW + QTHT cross-view). | Happy |
| TC-MPH-MB-002 | srs-update-2026-5-4 §FR-II-NEW-02 / MPH_CREATE_DP | CB_NV_DP tạo mẫu DP_RIENG cho đơn vị mình | 1. CB_NV_DP (`cb_nv_dp_01`) đã đăng nhập. 2. user.don_vi_id = ĐP_AG. 3. Đang ở Tab 3. | `pham_vi_ap_dung=DP_RIENG`, `don_vi_id=ĐP_AG`, LV thuộc DP | 1. Tab 3 → [+ Thêm mới]. 2. Form auto-fill `pham_vi=DP_RIENG`, `don_vi=ĐP_AG`. 3. Điền tên + nội dung + LV. 4. Click [Lưu]. | 1. Lưu thành công. 2. Badge 🟨 "ĐP" trên row. 3. Chỉ user thuộc ĐP_AG thấy mẫu này (cùng CB_NV_TW + QTHT cross-view). | Happy |
| TC-MPH-MB-003 | srs-update-2026-5-4 §FR-II-NEW-02 / ERR-MPH-04 | CB_NV_BN POST payload `pham_vi=TW_QUOC_GIA` (vượt UI) → 403 | 1. CB_NV_BN có token. | Payload `{pham_vi_ap_dung: "TW_QUOC_GIA", ...}` | 1. Curl `POST /api/v1/mau-phan-hoi` với token CB_NV_BN. | 1. 403 ERR-MPH-04 (backend kiểm MPH_CREATE_TW chỉ cho CB_NV_TW). 2. AUDIT_LOG ghi attempt FAIL. | Negative |
| TC-MPH-MB-004 | srs-update-2026-5-4 §FR-II-NEW-02 / MPH_READ scope | CB_NV_BN không thấy mẫu DP_RIENG đơn vị khác | 1. CB_NV_BN (`cb_nv_bn_01`) đã đăng nhập. 2. Tồn tại mẫu DP_RIENG do `cb_nv_dp_01` (ĐP_AG) tạo. | — | 1. Mở Tab 3. 2. Verify danh sách. | 1. Mẫu DP_RIENG ĐP_AG **KHÔNG** xuất hiện trong list. 2. Chỉ thấy mẫu TW_QUOC_GIA + mẫu BN_RIENG đơn vị mình. | Negative |
| TC-MPH-MB-005 | srs-update-2026-5-4 §FR-II-NEW-02 / MPH_UPDATE scope | CB_NV_BN đơn-vị-khác PUT mẫu BN_RIENG đơn vị khác → 403 | 1. CB_NV_BN_TC (`cb_nv_bn_02` ở BN_TC) có token. 2. Mẫu BN-001 thuộc BN_KH-DT do `cb_nv_bn_01` tạo. | Payload edit `noi_dung_mau` | 1. Curl `PUT /api/v1/mau-phan-hoi/BN-001` với token CB_NV_BN_TC. | 1. 403. 2. Mẫu BN-001 không bị thay đổi. | Negative |

---

## Test Cases — QTHT Read view + Negative permission

> QTHT chỉ R per `srs-v3 §3.4.2` — không có nút CRUD. Bổ sung TC negative permission: QTHT vượt UI gọi API CRUD → 403.

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|------|------------------|------|
| TC-MPH-QTHT-001 | srs-v3 §3.4.2 / SCR-VIII-06 / UI | QTHT vào Tab 3 — UI ẩn mọi nút CRUD, hiển thị Read view | 1. QTHT (`qtht_01`) đã đăng nhập. 2. Đã có ≥1 mẫu seed bởi CB_NV. | — | 1. Login QTHT. 2. Vào `/quan-tri/cau-hinh?tab=mau-phan-hoi`. 3. Inspect DOM tìm button [+ Thêm mới] / [Sửa] / [Xóa]. | 1. Bảng hiển thị tất cả mẫu cross-đơn vị (TW + BN + DP). 2. **KHÔNG** có button [+ Thêm mới] trên toolbar. 3. **KHÔNG** có button [Sửa] / [Xóa] / Toggle trên mỗi row. 4. Có thể click row để xem detail (read view). 5. Có ô filter (`pham_vi`/`linh_vuc`/`trang_thai`/`don_vi`). | Happy (R-only) |
| TC-MPH-QTHT-002 | srs-v3 §3.4.2 / BR-AUTH-08 | QTHT POST `/api/v1/mau-phan-hoi` (vượt UI) → 403 ERR-AUTH-01 | 1. QTHT (`qtht_01`) đã đăng nhập, lấy access token. 2. Endpoint `POST /api/v1/mau-phan-hoi` exposed. | Payload hợp lệ: `{ten_mau, linh_vuc_id, noi_dung_mau, loai, trang_thai, pham_vi_ap_dung=TW_QUOC_GIA}` | 1. Dùng curl/Postman gọi `POST /api/v1/mau-phan-hoi` với token QTHT. | 1. Response 403. 2. Body chứa `error.code = ERR-AUTH-01` hoặc `ERR-MPH-04`. 3. AUDIT_LOG ghi attempt FAIL. | Negative |
| TC-MPH-QTHT-003 | srs-v3 §3.4.2 / BR-AUTH-08 | QTHT PUT `/api/v1/mau-phan-hoi/{id}` (vượt UI) → 403 | 1. Tồn tại mẫu MPH-001 do `cb_nv_tw_01` tạo. 2. QTHT có token. | Payload `{noi_dung_mau: "edit by QTHT"}` | 1. Curl `PUT /api/v1/mau-phan-hoi/MPH-001` token QTHT. | 1. Response 403. 2. Mẫu MPH-001 không bị thay đổi. 3. AUDIT_LOG ghi attempt FAIL. | Negative |
| TC-MPH-QTHT-004 | srs-v3 §3.4.2 / BR-AUTH-08 | QTHT DELETE `/api/v1/mau-phan-hoi/{id}` (vượt UI) → 403 | 1. Tồn tại mẫu MPH-001. 2. QTHT có token. | — | 1. Curl `DELETE /api/v1/mau-phan-hoi/MPH-001` token QTHT. | 1. Response 403. 2. Mẫu MPH-001 không bị xóa mềm (`is_deleted=0`). 3. AUDIT_LOG ghi attempt FAIL. | Negative |

---

## Tổng quan TC

| Bucket | Số TC |
|---|---|
| Happy CRUD CB_NV (TC-MPH-001/002/003/004/017/019) | 6 |
| Negative CB_NV validation (TC-MPH-005/006/007/018) | 4 |
| Edge CB_NV (TC-MPH-008..016 trừ 017) | 8 |
| Mô hình B scope (TC-MPH-MB-001..005) | 5 |
| QTHT R-only + Negative perm (TC-MPH-QTHT-001..004) | 4 |
| **Tổng** | **27** |

---

## Cross-link

- Spec gốc: [`input/srs-v3/srs-fr-02-hoi-dap.md`](../../../../input/srs-v3/srs-fr-02-hoi-dap.md) §FR-II-NEW-02 + [`input/srs-update-2026-5-4/srs-fr-02-hoi-dap.md`](../../../../input/srs-update-2026-5-4/srs-fr-02-hoi-dap.md) §FR-II-NEW-02
- Permission matrix: [`output/permission-matrix-by-fr.md`](../../../permission-matrix-by-fr.md) row MAU_PHAN_HOI + [`output/srs-v3-3.4.2-permission-matrix.md`](../../../srs-v3-3.4.2-permission-matrix.md) line 12
- View dropdown chèn mẫu khi soạn phản hồi (FR-II-07 SCR-II-02): [`output/test-cases/hoi-dap/06-TC-phan-hoi-cau-hoi.md`](../../hoi-dap/06-TC-phan-hoi-cau-hoi.md) TC-PH-002 + TC-PH-015
- Edge case hunter source: [`05-REVIEW-edge-case-hunter.md`](05-REVIEW-edge-case-hunter.md)
