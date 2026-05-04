# Test Cases — UC49: NHT cập nhật hồ sơ (FR-IV-11)

> **SRS Ref**: FR-IV-11, SCR-IV-02 (Cổng PLQG / chuyên trang), Entity TU_VAN_VIEN
> **Nguồn**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **Ngày tạo**: 2026-05-01
> **Note**: UC này khác UC42 — UC49 là NHT tự cập nhật **thông tin chung** (ho_ten, sdt, dia_chi, email…); UC42 là cập nhật **năng lực** (chuyen_nganh, kinh_nghiem, chứng chỉ).

---

## A. UI FIELD VERIFICATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-UI-12 | FR-IV-11 / SCR-IV-02 / UI | Verify form NHT cập nhật hồ sơ trên Cổng PLQG | NHT (nht_01) đăng nhập Cổng PLQG. Có TVV trạng thái DANG_HOAT_DONG. | URL Cổng PLQG (SPEC-CLARIFY-CG-02) | 1. Vào "Hồ sơ của tôi". 2. Click [Cập nhật hồ sơ]. | **LAYOUT**: Form gần giống SCR-IV-02 nhưng giới hạn field NHT được phép sửa (NLM cite [27] ERR-CN-01/02 reference). **FIELDS cho phép**: ho_ten (text), email (RFC 5322), so_dien_thoai (10-11 số), dia_chi (text). **FIELDS read-only/disable**: ma_tvv, cmnd_cccd (UNIQUE đã cấp), trang_thai, loai_tvv. **NEGATIVE — Phần tử KHÔNG có**: KHÔNG có button [Đổi loại TVV]. KHÔNG có button [Cập nhật trạng thái] (đó là UC50 cho CB NV). KHÔNG có chỉnh sửa to_chuc_chinh_id (cần CB NV approve). **Note**: SRS quote nguyên văn về scope field UC49 chưa rõ — SPEC-CLARIFY-CG-28 (xác định danh sách field NHT được sửa). | Happy 🔴 |

---

## B. CẬP NHẬT HAPPY

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-1001 | FR-IV-11 | NHT cập nhật SĐT + địa chỉ | NHT đăng nhập Cổng PLQG. Có TVV. | so_dien_thoai="0987654321", dia_chi="Hà Nội mới" | 1. Form. 2. Đổi SĐT + địa chỉ. 3. [Lưu]. | **STATE**: UPDATE TU_VAN_VIEN SET so_dien_thoai, dia_chi, updated_at, updated_by. AUDIT_LOG hanh_dong='UPDATE' (BR-DATA-05). **UI**: Toast "Cập nhật thành công" (SRS Gap message). **PERSIST**: Reload "Hồ sơ của tôi" → giá trị mới. CB NV vào SCR-IV-03 detail TVV → giá trị mới. | Happy |
| TC-CG-1002 | FR-IV-11 | NHT cập nhật email | NHT. Có TVV. | email="newemail@example.com" | 1. Form. 2. Đổi email hợp lệ. 3. [Lưu]. | **STATE**: UPDATE email + audit. **UI**: Toast OK. Nếu BE yêu cầu verify email → gửi mail xác nhận (SRS Gap — SPEC-CLARIFY-CG-29). **PERSIST**: Reload → email mới. | Happy |
| TC-CG-1003 | FR-IV-11 | NHT cập nhật họ tên | NHT. | ho_ten="Lê Văn C - Updated" | 1-3 với ho_ten mới. | **STATE**: UPDATE. **UI**: Toast OK. **PERSIST**: SCR-IV-01 cột Họ tên hiển thị tên mới. **Note**: SRS Gap nếu cần chờ duyệt khi đổi họ tên (NLM cite [19] có hint "TVV tự cập nhật thông tin, chờ duyệt"). | Happy 🟡 |

---

## C. NEGATIVE: VALIDATION & PERMISSION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-1004 | ERR-CN-01 | NHT cập nhật email sai format | NHT. | email="not-email" | 1. Form. 2. Email = "not-email". 3. [Lưu]. | **STATE**: KHÔNG UPDATE. **UI**: Inline "**Định dạng email không hợp lệ**" (NLM cite [27] ERR-CN-01). **PERSIST**: — | Negative 🔴 |
| TC-CG-1005 | ERR-CN-02 | NHT cố cập nhật hồ sơ NHT khác | NHT (nht_01) đăng nhập. NHT khác có TVV "TVV-OTHER-001". | URL/API direct PUT /api/v1/tu-van-vien/{TVV-OTHER-001} | 1. NHT cố access TVV khác. | **STATE**: 403. **UI**: Toast "**Bạn không có quyền cập nhật hồ sơ này**" (NLM cite [27] ERR-CN-02). **PERSIST**: TVV khác không đổi. | Negative 🔴 |
| TC-CG-1006 | FR-IV-11 / BR-AUTH-01 | NHT chưa đăng nhập cố cập nhật | NHT chưa login. | URL direct | 1. Mở URL. | **STATE**: — **UI**: Redirect login. **PERSIST**: — | Negative |

---

## D. EDGE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-1007 | FR-IV-11 / NLM cite [11] AC | NHT cập nhật → áp dụng NGAY (KHÔNG có "chờ duyệt") + readonly view sau lưu | NHT. Có TVV DANG_HOAT_DONG. | ho_ten mới = "Lê Văn C - Updated" | 1. NHT cập nhật ho_ten. 2. [Lưu]. 3. Verify ngay trên SCR-IV-01 (CB NV view). | **STATE**: AC NGUYÊN VĂN cite [11]: "Given NHT thay đổi thông tin When lưu Then **validate + cập nhật thành công, ghi audit log**" — UPDATE TU_VAN_VIEN NGAY (KHÔNG pending state). AUDIT_LOG entry. **UI**: AC nguyên văn cite [11]: "Given NHT lưu thành công When hệ thống xử lý xong Then **hiển thị thông tin đã cập nhật ở chế độ readonly để xác nhận**". Form switch về readonly view với giá trị mới. **PERSIST**: SCR-IV-01 NGAY phản ánh ho_ten mới. **Note**: SPEC-CLARIFY-CG-30 đóng — AC FR-IV-11 chính thức không có workflow chờ duyệt; cite [19] overview procedure ref là tóm tắt không phải spec. | Happy 🔴 |
| TC-CG-1008 | FR-IV-11 / BR-FLOW-03 | NHT cập nhật khi TVV trạng thái VO_HIEU_HOA | NHT có TVV trạng thái VO_HIEU_HOA. | — | 1. Vào "Hồ sơ của tôi". 2. Cố [Cập nhật hồ sơ]. | **STATE**: — **UI**: Nút [Cập nhật hồ sơ] disable hoặc thông báo "Hồ sơ đã vô hiệu hóa, không thể cập nhật" (suy ra từ NLM cite [3] row 4 hide [Sửa hồ sơ] khi VO_HIEU_HOA). **PERSIST**: — | Edge 🟡 |

---

## E. EDGE BỔ SUNG (Edge Case Hunter Review 2026-05-01)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-1009 | FR-IV-11 / NLM cite [11] AC vs cite [19] overview | Verify SRS conflict 2 nguồn (AC vs overview procedure) — AC chính thức trumps overview | NHT. TVV DANG_HOAT_DONG. | ho_ten mới | 1. NHT update. 2. Verify behavior. | **STATE**: 2 nguồn SRS conflict: cite [11] AC FR-IV-11 = update ngay + readonly view; cite [19] overview procedure ref = "TVV tự cập nhật thông tin, **chờ duyệt**". → Test verify hành vi thực tế: nếu app cập nhật ngay → confirm AC cite [11] đúng (overview tóm tắt sai). Nếu chờ duyệt → confirm overview cite [19] đúng (AC viết tắt). **UI**: Tùy implementation. **PERSIST**: Mark SPEC-CLARIFY-CG-30 update (clarify which source is canonical). | Edge 🟡 |
| TC-CG-1010 | FR-IV-11 / NLM cite [27] | NHT cập nhật ho_ten với ký tự Unicode đặc biệt (vd: dấu tiếng Việt, emoji) | NHT. | ho_ten = "Lê Văn Cường 🎓" | 1. Form. 2. Lưu. | **STATE**: BE behavior **SRS Gap** (cite [27] không quote charset constraint). Có thể: (a) accept Unicode + emoji; (b) reject emoji; (c) chỉ accept Vietnamese alphabet. **UI**: Tùy. **PERSIST**: Mark SPEC-CLARIFY-CG-47. | Edge 🟢 |
| TC-CG-1011 | FR-IV-11 / NLM cite [11] Outputs | Verify Output FR-IV-11 — Response API có 2 fields nguyên văn | NHT. TVV. | dia_chi mới | 1. Submit form update. 2. Inspect API response. | **STATE**: Cite [11] Output NGUYÊN VĂN: 2 fields = (1) `success` (boolean); (2) `updated_at` (datetime, format dd/mm/yyyy HH:mm). **UI**: Toast OK trigger từ success=true. **PERSIST**: updated_at lưu DB. | Edge 🟡 |
| TC-CG-1012 | FR-IV-11 / NLM cite [11] AC case 3 | Sau lưu thành công → form switch về readonly mode hiển thị giá trị mới | NHT. TVV. | dia_chi="Hà Nội mới" | 1. Form edit. 2. [Lưu]. 3. Quan sát UI sau response. | **STATE**: AC NGUYÊN VĂN cite [11] case 3: "Given NHT lưu thành công When hệ thống xử lý xong Then **hiển thị thông tin đã cập nhật ở chế độ readonly để xác nhận**". → Form đổi state từ edit-mode sang readonly-mode hiển thị "Hà Nội mới". **UI**: Input fields disabled, hiển thị giá trị mới. Có thể có nút "Chỉnh sửa lại" để re-enter edit mode. **PERSIST**: Reload trang → giá trị mới persist. | Happy 🔴 |
| TC-CG-1013 | FR-IV-11 / NLM cite [18] | NHT update multi-field cùng lúc (atomic transaction) | NHT. TVV. | dia_chi + so_dien_thoai + email cùng update | 1. Form. 2. Đổi cả 3 field. 3. Force network error giữa request (interrupt). | **STATE**: BE atomic UPDATE — hoặc cả 3 field commit thành công, hoặc rollback hết. KHÔNG partial commit. AUDIT_LOG ghi 1 entry với du_lieu_moi cho cả 3 field (không phải 3 entry riêng). **UI**: Toast nguyên văn. **PERSIST**: F5 reload → cả 3 field consistent (cùng cũ hoặc cùng mới). | Edge 🟢 |
