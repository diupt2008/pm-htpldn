# Test Cases — UC42: Cập nhật năng lực TVV (FR-IV-04)

> **SRS Ref**: FR-IV-04, SCR-IV-03 (Tab Năng lực), Entity HO_SO_TU_VAN_VIEN
> **Nguồn**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **Ngày tạo**: 2026-05-01

---

## A. UI FIELD VERIFICATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-UI-05 | FR-IV-04 / SCR-IV-03 / UI | Verify Tab Năng lực hiển thị + nút [Cập nhật năng lực] | NHT (nht_01) đăng nhập Cổng PLQG. NHT đã có TVV và navigate vào hồ sơ chi tiết của mình. | URL: `/ho-so-cua-toi` (Cổng PLQG) | 1. Vào hồ sơ chi tiết. 2. Click tab "Năng lực". | **LAYOUT** (NLM cite [4] tab-3): "Bằng cấp chi tiết" section (text), "Chứng chỉ chi tiết" (text), "Kinh nghiệm chi tiết" (text), "Tóm tắt hồ sơ năng lực" (summary). Nút [Cập nhật năng lực] (chỉ hiển thị khi user là NHT sở hữu HOẶC CB NV). **FORM INLINE EDIT** (khi click [Cập nhật năng lực], NLM cite [15]): kinh_nghiem (textarea long, không bắt buộc), chuyen_nganh (text), chung_chi_moi (file PDF max 10MB, không bắt buộc, multi), linh_vuc_ids (multi-select), ghi_chu_cap_nhat (text). **NEGATIVE — Phần tử KHÔNG có**: KHÔNG có cập nhật trường ho_ten/cccd/email/sdt (chỉ năng lực thôi — UC49 mới cho NHT cập nhật info chung). | Happy 🔴 |

---

## B. CẬP NHẬT NĂNG LỰC THÀNH CÔNG

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-301 | FR-IV-04 | NHT cập nhật chuyên ngành + kinh nghiệm | NHT đăng nhập Cổng PLQG. NHT có TVV "TVV-...-001" trạng thái DANG_HOAT_DONG. | chuyen_nganh="Pháp lý lao động", kinh_nghiem="7 năm", ghi_chu="Cập nhật theo yêu cầu BA" | 1. Tab Năng lực. 2. Click [Cập nhật năng lực]. 3. Đổi chuyên ngành + kinh nghiệm. 4. Lưu. | **STATE**: UPDATE HO_SO_TU_VAN_VIEN SET chuyen_nganh, kinh_nghiem, ghi_chu_cap_nhat, updated_at, updated_by (NLM cite [16] step 3). AUDIT_LOG hanh_dong='UPDATE' với du_lieu_cu/moi (BR-DATA-05, NLM cite [16] step 6). **UI**: Toast OK. Form đóng, summary cập nhật. **PERSIST**: Reload tab Năng lực → giá trị mới hiển thị. **Note**: SRS không yêu cầu re-thẩm định (NLM cite [16]). | Happy |
| TC-CG-302 | FR-IV-04 / BR-FILE-03 | NHT upload chứng chỉ mới (PDF 8MB) | NHT có TVV. | chung_chi_moi=cc.pdf (8MB) | 1. Tab Năng lực. 2. Click [Cập nhật]. 3. Upload chung_chi_moi. 4. Lưu. | **STATE**: INSERT 1 row FILE_DINH_KEM linked HO_SO (NLM cite [16] step 4). UPDATE HO_SO_TVV. AUDIT_LOG. **UI**: Toast OK. Danh sách chứng chỉ +1. **PERSIST**: File download được. | Happy |
| TC-CG-303 | FR-IV-04 | NHT đổi lĩnh vực hoạt động | NHT có TVV với lĩnh vực [DAN_SU]. | linh_vuc_ids = [DAN_SU, KINH_TE] | 1. Tab Năng lực. 2. [Cập nhật]. 3. Multi-select thêm KINH_TE. 4. Lưu. | **STATE**: UPDATE TVV_LINH_VUC: DELETE row cũ + INSERT 2 row mới (NLM cite [16] step 5 transaction). **UI**: Tag list hiển thị 2 lĩnh vực. **PERSIST**: Reload → 2 tag. SCR-IV-01 cột Lĩnh vực update tương ứng. | Happy |

---

## C. NEGATIVE: PERMISSION & VALIDATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-304 | ERR-NL-01 / BR-AUTH-10 | NHT cố cập nhật năng lực hồ sơ NHT khác | NHT (nht_01) đăng nhập. NHT khác có TVV "TVV-OTHER-001". | URL direct hoặc API direct PUT /api/v1/ho-so/{TVV-OTHER-001} | 1. NHT cố access TVV của người khác. | **STATE**: KHÔNG UPDATE. BE check ownership (NLM cite [16] step 1, BR-AUTH-10) → 403. **UI**: Toast/HTTP "**Bạn không có quyền cập nhật hồ sơ này**" (NLM cite [23] ERR-NL-01). **PERSIST**: HO_SO của TVV khác không đổi. | Negative 🔴 |
| TC-CG-305 | ERR-NL-02 | Upload chứng chỉ > 10MB | NHT có TVV. | chung_chi_moi=big.pdf (12MB) | 1. Tab Năng lực. 2. [Cập nhật]. 3. Upload PDF 12MB. | **STATE**: KHÔNG UPDATE. **UI**: "**File tải lên tối đa 10MB**" (NLM cite [23] ERR-NL-02). **PERSIST**: — | Negative |
| TC-CG-306 | FR-IV-04 / BR-AUTH-01 | TVV chưa đăng nhập cố cập nhật năng lực | TVV chưa login. | URL direct | 1. Mở URL Tab Năng lực không login. | **STATE**: — **UI**: Redirect login (BR-AUTH-01). **PERSIST**: — | Negative |
| TC-CG-307 | FR-IV-04 / BR-AUTH-08 | CB_NV_DP cố cập nhật năng lực TVV ngoài đơn vị | CB_NV_DP_01 đăng nhập internal app. TVV "TVV-DP_OTHER-001" thuộc ĐP khác. | API direct PUT | 1. CB_NV_DP_01 cố cập nhật năng lực TVV ngoài scope. | **STATE**: 403. **UI**: Toast/HTTP "Bạn không có quyền". **PERSIST**: HO_SO không đổi. | Negative |

---

## D. EDGE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-308 | FR-IV-04 / BR-FLOW-03 | Cập nhật năng lực khi TVV trạng thái VO_HIEU_HOA | NHT có TVV "TVV-...-099" trạng thái VO_HIEU_HOA. | — | 1. NHT vào hồ sơ của mình. 2. Tab Năng lực. | **STATE**: — **UI**: Nút [Cập nhật năng lực] **ẨN/DISABLE** (suy ra từ NLM cite [3] row 4 — sửa hồ sơ chặn khi VO_HIEU_HOA). SRS Gap nguyên văn — SPEC-CLARIFY-CG-16 (UC42 có chặn không khi TVV VO_HIEU_HOA). **PERSIST**: — | Edge 🟡 |
| TC-CG-309 | FR-IV-04 / BR-DATA-05 | Verify AUDIT_LOG ghi nhận diff cập nhật năng lực | NHT có TVV. | Sequence: thay 2 field | 1. Đổi chuyên ngành. 2. Lưu. 3. Đổi tiếp lĩnh vực. 4. Lưu. 5. Query AUDIT_LOG. | **STATE**: 2 row AUDIT_LOG, mỗi row có du_lieu_cu/du_lieu_moi cụ thể trường nào đổi. **UI**: Trang Nhật ký query entity_id → thấy 2 entries. **PERSIST**: Log immutable. | Happy |

---

## E. EDGE BỔ SUNG (Edge Case Hunter Review 2026-05-01)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-310 | FR-IV-04 / NLM cite [18] | UC42 KHÔNG có guard chặn khi TVV VO_HIEU_HOA — cập nhật năng lực có pass? | NHT có TVV trạng thái VO_HIEU_HOA. | chuyen_nganh="updated" | 1. NHT vào tab Năng lực. 2. Click [Cập nhật năng lực] (nếu UI cho phép). 3. Lưu. | **STATE**: SRS Gap nguyên văn — cite [18] precondition chỉ quote: "**TVV tồn tại, NHT sở hữu hoặc CB NV có quyền**" (KHÔNG có guard VO_HIEU_HOA). UC50 nói khi VO_HIEU_HOA → auto gỡ Cổng PLQG nhưng KHÔNG cấm cập nhật năng lực. → Nếu app chặn → log bug FE thừa validation; nếu app cho phép → log SPEC-CLARIFY-CG-16 (tracking trong file gốc). **UI**: Tùy app. **PERSIST**: — | Edge 🟡 |
| TC-CG-311 | FR-IV-04 / NLM cite [18] field 4 | UPDATE linh_vuc_ids xuống empty `[]` (xóa hết lĩnh vực) | NHT có TVV, hiện đang có 2 lĩnh vực. | linh_vuc_ids = [] | 1. Tab Năng lực. 2. [Cập nhật]. 3. Bỏ chọn hết lĩnh vực. 4. Lưu. | **STATE**: SRS Gap (cite [18] field 4 chỉ quote "Cập nhật lĩnh vực PL" — không quote constraint ≥1). Lưu ý cite [7] field 16 cho UC39 nói "FK → DANH_MUC, **≥ 1**" cho create — UC42 update có inherit constraint đó không là Gap. → Mark SPEC-CLARIFY-CG-40. **UI**: Tùy app. **PERSIST**: Nếu allow → TVV không có lĩnh vực, sẽ break filter SCR-IV-01 cột Lĩnh vực. | Edge 🟡 |
| TC-CG-312 | FR-IV-04 / BR-EC-04 / NLM cite [5] | Upload chứng chỉ mới khi đơn vị đã 90% quota → cảnh báo | NHT có TVV. Đơn vị NHT đã dùng 9GB/10GB (90%). | chung_chi_moi=cc.pdf (1.5GB — đủ tăng quá 90%) | 1. Tab Năng lực. 2. Upload PDF. 3. Lưu. | **STATE**: BE upload OK nhưng cảnh báo (cite [5] BR-EC-04 nguyên văn: "**90% → cảnh báo**"). UPDATE thành công. **UI**: Toast warning kèm "Đơn vị đã sử dụng 90% dung lượng lưu trữ" (message chính xác **SRS Gap**). **PERSIST**: File lưu. | Edge 🟡 |
| TC-CG-313 | FR-IV-04 / NLM cite [4] AC case 3 | CB NV cập nhật năng lực TVV thuộc đơn vị mình (case role CB NV) | CB_NV_TW. TVV "TVV-TW-007" thuộc đơn vị TW. | chuyen_nganh="Pháp lý hành chính" | 1. CB_NV_TW vào SCR-IV-03 cho TVV-TW-007. 2. Tab Năng lực. 3. [Cập nhật năng lực]. 4. Lưu. | **STATE**: AC NGUYÊN VĂN cite [4] case 3: "Given **CB NV xem chi tiết TVV** When cập nhật năng lực Then validate + lưu". UPDATE HO_SO_TVV với updated_by=cb_nv_tw_01. AUDIT_LOG. **UI**: Toast OK. **PERSIST**: Reload tab → giá trị mới. | Happy 🔴 |
| TC-CG-314 | FR-IV-04 / NLM cite [4] AC case 1 / cite [12] tab-3 | Form inline edit verify — nút [Cập nhật năng lực] click → form xuất hiện inline | NHT có TVV. | — | 1. Tab Năng lực. 2. Click [Cập nhật năng lực]. 3. Quan sát UI. | **STATE**: — **UI**: AC NGUYÊN VĂN cite [4] case 1: "Then **form inline edit**". Cite [12] tab-3 nguyên văn: "**form inline edit**" — KHÔNG phải modal/drawer/navigate trang khác. Form mở trong cùng tab Năng lực, các field editable inline. **PERSIST**: — | Happy 🟡 |
| TC-CG-315 | FR-IV-04 / NLM cite [22] field 3 | NHT cập nhật năng lực không upload chứng chỉ mới (chung_chi_moi=null optional) | NHT có TVV. | chung_chi_moi=null | 1. Tab Năng lực. 2. [Cập nhật]. 3. Chỉ đổi chuyen_nganh + linh_vuc. 4. Lưu. | **STATE**: UPDATE chỉ chuyen_nganh + linh_vuc_ids (cite [22] field 3 "chung_chi_moi | binary[] | **N**" optional). **UI**: Toast OK. **PERSIST**: Không có FILE_DINH_KEM mới. | Edge 🟢 |
