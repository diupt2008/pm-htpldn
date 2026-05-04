# Test Cases — UC43: Xem chi tiết TVV (FR-IV-05)

> **SRS Ref**: FR-IV-05, SCR-IV-03 (toàn bộ — Header + 5 tab), Entity TU_VAN_VIEN + HO_SO_TU_VAN_VIEN
> **Nguồn**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **Ngày tạo**: 2026-05-01

---

## A. UI FIELD VERIFICATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-UI-06 | FR-IV-05 / SCR-IV-03 / UI | Verify SCR-IV-03: Header + 5 tab + action buttons (per state) | CB_NV_TW đăng nhập. TVV "TVV-TW-001" trạng thái CHO_PHE_DUYET tồn tại. | TVV-TW-001 | 1. Vào SCR-IV-03 detail. 2. Kiểm tra header + 5 tab + buttons. | **HEADER (NLM cite [3])**: Breadcrumb "Trang chủ > Chuyên gia/TVV > [Tên TVV]". Nút [← Quay lại danh sách]. Card header: ảnh chân dung 80x100, Tên TVV bold 20px, Mã TVV, badge trạng thái lớn (màu theo SM-TVV), điểm DG sao (hoặc "—"), ngày công nhận. **ACTION BUTTONS** (conditional render, NLM cite [3] rows 4-8): [Sửa hồ sơ] (ẩn nếu VO_HIEU_HOA), [Cập nhật trạng thái] (chỉ CB NV), [Phê duyệt] (chỉ khi CHO_PHE_DUYET + CB PD cùng cấp), [Từ chối] (chỉ khi CHO_PHE_DUYET + CB PD), [Công khai lên Cổng PLQG] (chỉ khi DANG_HOAT_DONG AND la_cong_khai=0). **5 TABS** (NLM cite [4]): "Hồ sơ" (5 accordion read-only), "Thẩm định" (chỉ render khi DANG_THAM_DINH/CHO_PHE_DUYET), "Năng lực" (UC42), "Lịch sử hỗ trợ" (UC48), "Đánh giá" (UC47). **Verify TC này TVV đang CHO_PHE_DUYET** → tabs Thẩm định+Hồ sơ+Năng lực+Lịch sử+Đánh giá render đầy đủ; nút [Phê duyệt] và [Từ chối] HIỂN THỊ với CB PD cùng cấp; với CB NV: nút [Cập nhật trạng thái] HIỂN THỊ. | Happy 🔴 |

---

## B. XEM CHI TIẾT — VARIOUS STATES

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-401 | FR-IV-05 | Xem chi tiết TVV trạng thái DANG_HOAT_DONG — buttons phù hợp | CB_NV_TW đăng nhập. TVV "TVV-TW-007" DANG_HOAT_DONG, la_cong_khai=0. | — | 1. Vào SCR-IV-03 cho TVV-TW-007. | **STATE**: GET TVV success. **UI**: Header buttons HIỂN THỊ: [Sửa hồ sơ], [Cập nhật trạng thái], [Công khai lên Cổng PLQG]. KHÔNG có [Phê duyệt]/[Từ chối]. Tab "Thẩm định" KHÔNG render. **PERSIST**: Reload giữ. | Happy |
| TC-CG-402 | FR-IV-05 | Xem chi tiết TVV trạng thái VO_HIEU_HOA — buttons phù hợp | CB_NV_TW đăng nhập. TVV "TVV-TW-099" VO_HIEU_HOA. | — | 1. Vào SCR-IV-03. | **STATE**: GET success. **UI**: Header buttons: [Cập nhật trạng thái] (để khôi phục) HIỂN THỊ. KHÔNG có [Sửa hồ sơ] (NLM cite [3] row 4 condition NOT VO_HIEU_HOA). KHÔNG có [Công khai], [Phê duyệt], [Từ chối]. **PERSIST**: — | Happy |
| TC-CG-403 | FR-IV-05 | Xem chi tiết TVV trạng thái MOI_DANG_KY — tabs phù hợp | CB_NV_TW. TVV "TVV-TW-101" MOI_DANG_KY. | — | 1. Vào SCR-IV-03. | **UI**: 5 tab default; tab "Thẩm định" KHÔNG render (chỉ DANG_THAM_DINH/CHO_PHE_DUYET, NLM cite [4] tab-2 condition). Header KHÔNG có [Phê duyệt]/[Từ chối]. Có [Sửa hồ sơ]+[Cập nhật trạng thái]. | Happy |

---

## C. NEGATIVE: ERROR & PERMISSION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-404 | ERR-HS-01 | TVV ID không tồn tại | CB_NV_TW đăng nhập. | URL: `/chuyen-gia-tvv/INVALID-ID` | 1. Mở URL detail với ID không tồn tại. | **STATE**: BE 404. **UI**: Toast/page error "**Hồ sơ TVV không tồn tại**" (NLM cite [14] ERR-HS-01) hoặc redirect SCR-IV-01. **PERSIST**: — | Negative |
| TC-CG-405 | FR-IV-05 / BR-AUTH-08 | CB_NV_DP cố xem TVV thuộc ĐP khác | CB_NV_DP_01 đăng nhập. TVV "TVV-DP_OTHER-001". | URL direct | 1. Mở URL detail TVV ngoài đơn vị. | **STATE**: 403. **UI**: Page lỗi "Bạn không có quyền" hoặc redirect. **PERSIST**: — | Negative |

---

## D. EDGE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-406 | FR-IV-05 | TVV chưa có đánh giá nào → điểm DG hiển thị "—" | CB_NV_TW. TVV "TVV-TW-101" chưa có DANH_GIA_TVV. | — | 1. SCR-IV-01: cột Điểm DG. 2. SCR-IV-03 header. | **UI**: Cột Điểm DG = "—" thay vì 0 (NLM cite [1] row 22 — "Nếu chưa đánh giá → '—'"). Header SCR-IV-03 cũng "—". Tab "Đánh giá" → progress bar 0%. **PERSIST**: — | Edge |
| TC-CG-407 | FR-IV-05 | TVV có ảnh chân dung null → fallback avatar placeholder | CB_NV_TW. TVV "TVV-TW-110" anh_chan_dung=NULL. | — | 1. SCR-IV-01: cột Ảnh. 2. SCR-IV-03 header. | **UI**: SCR-IV-01 cột Ảnh hiển thị avatar placeholder (NLM cite [1] row 16 "Mặc định: avatar placeholder"). Header SCR-IV-03 ảnh placeholder 80x100. **PERSIST**: — | Edge |

---

## E. EDGE BỔ SUNG (Edge Case Hunter Review 2026-05-01)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-408 | FR-IV-05 / NLM cite [3] row 5 | Verify nút [Cập nhật trạng thái] HIỂN THỊ cho CB NV với MỌI trạng thái (không chặn theo state) | CB_NV_TW. Test TVV ở 9 trạng thái khác nhau (1 record/state). | — | 1. Lần lượt vào SCR-IV-03 cho 9 TVV. 2. Quan sát nút [Cập nhật trạng thái]. | **STATE**: — **UI**: Cite [3] row 5 "Dieu kien hien thi: **Chi CB NV**" (KHÔNG có điều kiện theo trạng thái). → Nút HIỂN THỊ với CB NV ở MỌI 9 trạng thái: MOI_DANG_KY, CHO_THAM_DINH, DANG_THAM_DINH, YEU_CAU_BO_SUNG, CHO_PHE_DUYET, TU_CHOI, DANG_HOAT_DONG, TAM_DUNG, VO_HIEU_HOA. **PERSIST**: Modal mở luôn nhưng option transition trong modal sẽ hạn chế (chỉ TAM_DUNG/Khôi phục/VO_HIEU_HOA per UC50) → các state khác click [Cập nhật trạng thái] sẽ không có option phù hợp hoặc trigger ERR-TT-01 nếu force. | Edge 🔴 |
| TC-CG-409 | FR-IV-05 / NLM cite [12] tab-2 | Tab "Thẩm định" — ẨN khi trạng thái KHÔNG IN (DANG_THAM_DINH, CHO_PHE_DUYET) | CB_NV_TW. TVV ở 7 state khác (loại trừ DANG_THAM_DINH+CHO_PHE_DUYET). | — | 1. Lần lượt vào SCR-IV-03 cho 7 TVV state khác. 2. Tab list visible. | **UI**: Cite [12] tab-2 nguyên văn "Chi hien khi TT in {**DANG_THAM_DINH, CHO_PHE_DUYET**}". → Tab "Thẩm định" ẨN cho 7 state: MOI_DANG_KY, CHO_THAM_DINH, YEU_CAU_BO_SUNG, TU_CHOI, DANG_HOAT_DONG, TAM_DUNG, VO_HIEU_HOA. Chỉ HIỂN THỊ cho 2 state DANG_THAM_DINH/CHO_PHE_DUYET. **PERSIST**: — | Edge 🔴 |
| TC-CG-410 | FR-IV-05 / NLM cite [3] row 8 | Nút [Công khai] ẨN khi `cong_khai=true` (đã công khai) | CB_NV_TW có quyền công khai. TVV DANG_HOAT_DONG, la_cong_khai=1. | — | 1. SCR-IV-03 cho TVV đã công khai. 2. Quan sát header. | **UI**: Cite [3] row 8 nguyên văn: "Dieu kien hien thi: **Khi DANG_HOAT_DONG AND cong_khai=false**". → Nút [Công khai lên Cổng PLQG] **ẨN** khi cong_khai=true. SRS không quote nút thay thế [Hủy công khai] — **SRS Gap** cho UI hành động unpublish trên SCR-IV-03 single (chỉ batch ở SCR-IV-01 cite [1]). **PERSIST**: Mark SPEC-CLARIFY-CG-41. | Edge 🟡 |
| TC-CG-411 | FR-IV-05 / NLM cite [15] Tác nhân | NHT xem chi tiết hồ sơ của chính mình (case Tác nhân thứ 3) | NHT (nht_01) đăng nhập Cổng PLQG. NHT có TVV "TVV-DP-005". | — | 1. NHT vào "Hồ sơ của tôi" → SCR-IV-03. | **STATE**: Cite [15] Tác nhân nguyên văn: "CB NV, CB PD, **NHT (xem hồ sơ của mình)**". Backend permission check ownership pass. **UI**: SCR-IV-03 hiển thị 5 tab (hoặc 4 tab per AC cite [5] — verify SPEC-CLARIFY-CG-57). Header card hiển thị thông tin TVV. **NEGATIVE**: Nút [Cập nhật trạng thái] (chỉ CB NV) không hiển thị cho NHT. Nút [Phê duyệt]/[Từ chối]/[Công khai] cũng ẩn. **PERSIST**: NHT KHÔNG xem được TVV của người khác (BR-AUTH-10). | Happy 🔴 |
| TC-CG-412 | FR-IV-05 / NLM cite [15] Outputs | Verify Output FR-IV-05 — Tab Hồ sơ hiển thị đủ 7 fields nguyên văn | CB_NV_TW. TVV "TVV-TW-001" có đầy đủ thông tin. | — | 1. SCR-IV-03 cho TVV-TW-001. 2. Tab Hồ sơ. 3. Đối chiếu các field. | **STATE**: GET API trả response chứa **7 fields** theo cite [15] Output: (1) `ho_ten`; (2) `ngay_sinh`; (3) `cmnd_cccd`; (4) `trinh_do`; (5) `chung_chi`; (6) `so_the_hanh_nghe`; (7) `files` (list FILE_DINH_KEM). **UI**: Tab Hồ sơ accordion hiển thị đủ 7 field. **PERSIST**: Mỗi field match đúng giá trị DB. | Edge 🟡 |
