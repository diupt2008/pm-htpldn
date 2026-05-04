# Test Cases — UC47: Đánh giá TVV (FR-IV-09)

> **SRS Ref**: FR-IV-09, SCR-IV-03 (Tab Đánh giá — gộp MH-04.6), Entity DANH_GIA_TU_VAN_VIEN
> **Nguồn**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **Ngày tạo**: 2026-05-01

---

## A. UI FIELD VERIFICATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-UI-10 | FR-IV-09 / SCR-IV-03 / UI | Verify Tab Đánh giá: điểm tổng + 3 progress bar + form | DN (dn_01) đăng nhập (đã hoàn thành 1 VV với TVV-TW-007). | — | 1. SCR-IV-03 cho TVV-TW-007. 2. Click tab "Đánh giá". | **LAYOUT** (NLM cite [4] tab-5): "Điểm tổng hợp" số lớn (vd "8.5/10") + sao + "(N đánh giá)". "3 progress bar": Chuyên môn (avg/10), Thái độ (avg/10), Đúng hạn (avg/10). "Danh sách đánh giá" bảng: Người DG, Vụ việc, Ngày, 3 điểm thành phần, Nhận xét. Pagination 10/trang. **FORM ĐÁNH GIÁ MỚI** (NLM cite [4] row 21 — chỉ render "khi có quyền đánh giá"): Chọn TVV * (auto-fill), Vụ việc liên kết (optional), 3 star-rating (0-10): Chuyên môn / Thái độ / Đúng hạn, "Điểm tổng" auto-AVG (read-only), Nhận xét textarea max 5000 ký, Nút [Gửi đánh giá]. **NEGATIVE — Phần tử KHÔNG có**: Form không hiển thị nếu user không có quyền (vd: chưa từng làm việc với TVV này). KHÔNG có nút "Sửa đánh giá"/"Xóa đánh giá" cho đánh giá đã gửi (SRS Gap). | Happy 🔴 |

---

## B. ĐÁNH GIÁ HAPPY

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-801 | FR-IV-09 / BR-DG-02 / BR-CALC-06 | DN đánh giá TVV sau VV hoàn thành (3 tiêu chí 8/9/10) | DN (dn_01) đăng nhập. VV "VV-001" đã hoàn thành với TVV-TW-007. | diem_chuyen_mon=8, diem_thai_do=9, diem_thoi_gian=10, vu_viec_id=VV-001, nhan_xet="Tư vấn rõ ràng, đúng hạn" | 1. SCR-IV-03 tab "Đánh giá". 2. Form đánh giá. 3. Tick chọn VV-001. 4. Kéo star-rating: 8/9/10. 5. Quan sát "Điểm tổng" auto = 9 (AVG). 6. Nhập nhận xét. 7. Click [Gửi đánh giá]. | **STATE**: INSERT DANH_GIA_TU_VAN_VIEN: diem_tong=9 (AUTO AVG = (8+9+10)/3 = 9.0, NLM cite [20] step 3, BR-DG-02). UPDATE TU_VAN_VIEN.diem_danh_gia_tb (CROSS-01 trigger sau insert, NLM cite [20] step 5). AUDIT_LOG. **UI**: Toast "Gửi đánh giá thành công" (SRS Gap). Form clear. Bảng đánh giá +1 row. Điểm tổng hợp recalculate (vd: trước có 1 đánh giá 8.0, sau có (8+9)/2=8.5). 3 progress bar update. Header SCR-IV-03 sao đổi. **PERSIST**: SCR-IV-01 cột Điểm DG cập nhật. | Happy 🔴 |
| TC-CG-802 | FR-IV-09 | CB NV cũng có quyền đánh giá TVV | CB_NV_TW đăng nhập. TVV đã có VV hoàn thành. | diem_chuyen_mon=7, diem_thai_do=8, diem_thoi_gian=9 | 1-7 như TC-801 nhưng role CB_NV. | **STATE**: Same as TC-801 (NLM cite [18] "Tác nhân: CB NV, CB PD, DN"). **UI**: Form hiển thị cho CB NV. **PERSIST**: nguoi_dg = CB_NV. | Happy |
| TC-CG-803 | FR-IV-09 | Đánh giá không kèm vụ việc liên kết (vu_viec_id=null) | DN. TVV-TW-007. | vu_viec_id=null, 3 điểm hợp lệ | 1. Form. 2. Bỏ trống Vụ việc. 3. Submit. | **STATE**: INSERT với vu_viec_id=NULL (NLM cite [18] field 2 = N). **UI**: Toast OK. **PERSIST**: Bảng đánh giá hiển thị "—" cho cột Vụ việc. | Happy |

---

## C. NEGATIVE: VALIDATION & PERMISSION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-804 | ERR-DG-01 / BR-DG-01 | Điểm Chuyên môn ngoài 0-10 → ERR-DG-01 | DN. TVV. | diem_chuyen_mon=11 | 1. Form. 2. Cố nhập 11 (qua API hoặc bypass slider). 3. Submit. | **STATE**: BE check 0-10 → reject. **UI**: Inline "**Điểm đánh giá phải từ 0 đến 10**" (NLM cite [25] ERR-DG-01). Slider cap ở 10. **PERSIST**: KHÔNG INSERT. | Negative 🔴 |
| TC-CG-805 | ERR-DG-01 | Điểm âm | DN. TVV. | diem_chuyen_mon=-1 | 1-3 với điểm -1. | **STATE**: Reject. **UI**: ERR-DG-01. **PERSIST**: — | Negative |
| TC-CG-806 | ERR-DG-02 | Đánh giá TVV ID không tồn tại | DN. | tvv_id="INVALID-999" | 1. API direct POST với tvv_id giả. | **STATE**: BE FK fail → reject. **UI**: HTTP 422 "**TVV không tồn tại**" (NLM cite [25] ERR-DG-02). **PERSIST**: — | Negative |
| TC-CG-807 | FR-IV-09 / Permission Matrix | DN chưa từng có VV với TVV cố đánh giá | DN_other (dn_02) đăng nhập (chưa có VV với TVV-TW-007). | — | 1. SCR-IV-03 cho TVV-TW-007. 2. Tab Đánh giá. | **STATE**: — **UI**: Form đánh giá KHÔNG render cho DN không có quan hệ (Permission Matrix C† "sau khi vụ việc hoàn thành"). HOẶC nút [Gửi đánh giá] disable. **PERSIST**: Per SRS Gap nguyên văn — SPEC-CLARIFY-CG-27 (xác định rule access form đánh giá). | Negative 🟡 |

---

## D. EDGE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-808 | FR-IV-09 / BR-DG-02 | Verify auto AVG khi 3 điểm 0/0/0 | DN. TVV. | 0/0/0 | 1-7 với 3 điểm = 0. | **STATE**: INSERT diem_tong=0. **UI**: Auto-calc hiển thị "0". **PERSIST**: TVV.diem_danh_gia_tb recalc với điểm 0 (giảm avg). | Edge |
| TC-CG-809 | FR-IV-09 / BR-DG-02 | Verify auto AVG khi 3 điểm 10/10/10 (boundary max) | DN. TVV. | 10/10/10 | Tương tự. | **STATE**: INSERT diem_tong=10. **UI**: "10". **PERSIST**: — | Edge |
| TC-CG-810 | SPEC-CLARIFY-CG-08 | DN đánh giá TVV nhiều lần (cùng VV) — chống trùng? | DN dn_01 đã đánh giá TVV-TW-007 cho VV-001. | Same data | 1. Form. 2. Đánh giá lại cùng VV-001. | **STATE**: SRS không quy định chặn (NLM cite [20] không có UNIQUE constraint). **UI**: Per app behavior. **PERSIST**: SPEC-CLARIFY-CG-08: nếu allow → CROSS-01 sẽ avg cả 2 entries; nếu reject → cần error message + UNIQUE constraint. | Edge 🟡 |
| TC-CG-811 | FR-IV-09 / BR-CROSS-01 | Verify diem_danh_gia_tb update realtime sau INSERT | DN. TVV-TW-007 đã có 2 đánh giá: 8.0 và 9.0 (avg 8.5). | Đánh giá mới: diem_tong=10 | 1. Submit đánh giá thứ 3 với điểm tổng=10. 2. Refresh SCR-IV-01. | **STATE**: AVG recalc = (8+9+10)/3 = 9.0. UPDATE TU_VAN_VIEN.diem_danh_gia_tb=9.0 trigger ngay (NLM cite [17] CROSS-01). **UI**: SCR-IV-01 cột Điểm DG hiển thị 9.0 (không phải 8.5). Header SCR-IV-03 cập nhật. **PERSIST**: F5 reload → 9.0. | Edge 🔴 |

---

## E. EDGE BỔ SUNG (Edge Case Hunter Review 2026-05-01)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-812 | FR-IV-09 / NLM cite [14] / [15] | DANH_GIA_TU_VAN_VIEN có CỘT điểm thành phần (`diem_phap_ly`, `diem_nang_luc`, `diem_hieu_qua`, `diem_mang_luoi`) — KHÁC với 3 tiêu chí form (Chuyên môn/Thái độ/Đúng hạn) | DN. TVV. | Form đánh giá theo 3 tiêu chí cite [12] | 1. Verify form UI. 2. Verify DB schema cite [14]/[15]. | **STATE**: SRS conflict — cite [12] form UI có 3 star-rating "**Chuyen mon, Thai do, Dung han**"; cite [14]/[15] entity có 4 cột "**diem_phap_ly, diem_nang_luc, diem_hieu_qua, diem_mang_luoi**". → Mismatch field UI vs DB. → Mark SPEC-CLARIFY-CG-45 (BA confirm: schema 4 nhóm thẩm định reused cho đánh giá DN, hay đánh giá DN dùng 3 tiêu chí riêng?). **UI**: Tùy. **PERSIST**: — | Edge 🔴 |
| TC-CG-813 | FR-IV-09 / NLM cite [14] | DN đánh giá nhiều lần cùng (TVV, vu_viec) — SRS không có UNIQUE | DN. TVV. VV-001. Đã có 1 đánh giá. | Submit thêm 1 đánh giá identical | 1. Form. 2. Submit lại. | **STATE**: cite [14]/[15] DANH_GIA_TU_VAN_VIEN chỉ có PK trên `id`, **KHÔNG có UNIQUE (tu_van_vien_id, nguoi_danh_gia_id, vu_viec_id)**. → INSERT thành công với row 2. **UI**: Toast OK. **PERSIST**: Bảng đánh giá tab "Đánh giá" hiển thị 2 record cùng người DG cho cùng VV. CROSS-01 trigger 2 lần. diem_danh_gia_tb tính cả 2. | Edge 🔴 |
| TC-CG-814 | FR-IV-09 / NLM cite [14] field 11 | Đánh giá ngày nhập manual — verify ngày DG = NOW() (auto), không cho user override | DN. TVV. | API direct POST với ngay_danh_gia=2020-01-01 | 1. POST với ngày custom. | **STATE**: BE override (cite [14] field 11 "ngay_danh_gia | datetime | Y | **DEFAULT NOW()**"). Lưu ngay_danh_gia=NOW() bất chấp input. **UI**: — **PERSIST**: Bảng cột "Ngày" hiển thị NOW. | Edge 🟢 |
| TC-CG-815 | FR-IV-09 / NLM cite [14] field 5 / BR-CALC-06 | diem (điểm tổng) — DB CHECK BETWEEN 0 AND 10 (cite [14]) — boundary exact 0.0 và 10.0 và 5.5 | DN. TVV. | 3 lần test với điểm tổng = 0.0, 10.0, 5.5 | 3 INSERT. | **STATE**: Cả 3 INSERT thành công (cite [14] field 5 "CHECK BETWEEN 0 AND 10" inclusive). **UI**: — **PERSIST**: 3 row, diem_danh_gia_tb recalc đúng. | Edge 🟢 |
| TC-CG-816 | FR-IV-09 / NLM cite [14] field 4 / SPEC-CLARIFY-CG-27 | DN không có VV với TVV cố submit qua API direct (UI block nhưng API có check?) | DN không có VV với TVV-TW-007. | API direct POST với tvv_id=TVV-TW-007 | 1. API call. | **STATE**: cite [14] field 4 "vu_viec_id | identifier | **N**" optional → backend không enforce relationship. → Có thể: (a) BE check thêm rule "DN có quyền nếu có VV"; (b) BE accept (chỉ FE block). → Mark SPEC-CLARIFY-CG-27 reuse. **UI**: HTTP code tùy. **PERSIST**: Nếu accept → CROSS-01 trigger với đánh giá unauthorized. | Edge 🟡 |
| TC-CG-817 | FR-IV-09 / Permission `C†` / cite [23] / cite [19] | DN có VV nhưng VV trạng thái DANG_XU_LY (chưa HOAN_THANH) → cố đánh giá → reject (per condition †) | DN (dn_01). VV-001 với TVV-TW-007 trạng thái DANG_XU_LY. | diem_chuyen_mon=8, etc. | 1. DN cố submit đánh giá VV chưa HT. | **STATE**: Cite [23] Permission `C†R*` cho DN — † = condition. Cite [19] overview FR-IV-09: "DN đánh giá TVV **sau hỗ trợ**". → BE check vu_viec.trang_thai='HOAN_THANH' → nếu không → reject. **UI**: Toast/HTTP error "Chỉ được đánh giá sau khi vụ việc hoàn thành" (message **SRS Gap**). **PERSIST**: KHÔNG INSERT DANH_GIA_TVV. | Negative 🔴 |
| TC-CG-818 | FR-IV-09 / Permission `C†` / cite [19] | DN có VV trạng thái HOAN_THANH với TVV → submit OK (verify condition † = HOAN_THANH) | DN. VV-002 HOAN_THANH với TVV-TW-007. | 3 điểm valid | 1. Form. 2. Submit. | **STATE**: BE pass condition † → INSERT DANH_GIA_TVV thành công. CROSS-01 trigger update diem_danh_gia_tb. **UI**: Toast OK. **PERSIST**: Bảng đánh giá +1. | Happy 🟡 |
| TC-CG-819 | FR-IV-09 / Permission `C†R*` / BR-AUTH-08 | DN khác đơn vị, không có VV với TVV → 0 access (R* scoped) | DN_other (dn_02 thuộc đơn vị khác). TVV-TW-007 + VV của dn_01. | — | 1. dn_02 vào SCR-IV-03 cho TVV-TW-007. 2. Tab Đánh giá. | **STATE**: Permission `R*` scoped theo `don_vi_id` (BR-AUTH-08) → dn_02 KHÔNG see TVV ngoài đơn vị. **UI**: 403 hoặc empty form (form đánh giá KHÔNG render vì không có quyền). **PERSIST**: Không có đánh giá nào tạo bởi dn_02 cho TVV-TW-007. | Negative 🟡 |
| TC-CG-820 | FR-IV-09 / NLM cite [12] tab-5 row 21 / cite [18] field 7 | Nhận xét textarea boundary 0/5000/5001 ký | DN. TVV. | 3 case: nhan_xet="" (0 ký), 5000 ký, 5001 ký | 3 INSERT. | **STATE**: Cite [12] form spec "Nhan xet (max 5000 ky)". (a) 0 ký: cite [18] field 7 nhan_xet `text | N` optional → INSERT OK với null/empty. (b) 5000 ký: INSERT OK boundary. (c) 5001 ký: BE reject. **UI**: (c) inline error "Nhận xét tối đa 5000 ký tự" (message **SRS Gap**). **PERSIST**: — | Edge 🟢 |
