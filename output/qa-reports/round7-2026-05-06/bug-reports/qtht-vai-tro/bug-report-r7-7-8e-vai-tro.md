# Bug Report — R7.7.8e FR-VIII-14 Quản lý Vai trò

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000/quan-tri/vai-tro |
| **Người test** | QA Automation via Claude Code (qtht_02) |
| **Ngày** | 2026-05-07 |
| **Loại test** | Functional FR-VIII-14 R7.7.8e |
| **Round** | Round 7 |
| **2-source verify** | ✅ NotebookLM Haizz-HTPLDN (id `a4ae45bf-...`) + grep SRS local — match 100% |

---

## Tổng hợp

Phát hiện **7** lỗi khi test FR-VIII-14 + SCR-VIII-02 trên 11 TC (TC01-TC11). 2 TC bonus từ NotebookLM gợi ý: TC10 Permission negative (BUG-VT-009 Medium) + TC11 Audit log verify (PASS).

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 7    | 1        | 2     | 2      | 2     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|---|---|---|---|---|---|---|---|
| BUG-VT-001 | Critical | P0 | Workflow/Data | TC08 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 645 + 651 | BE xóa vai trò silently khi role đang gán TK (ERR-VT-02 không trigger) | Closed |
| BUG-VT-003 | Major | P1 | UI/UX | TC01 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 1517-1519 (SCR-VIII-02) | UI table thiếu 3 cột SRS: Mô tả + Số tài khoản + Số quyền | Closed |
| BUG-VT-004 | Major | P1 | UI/UX | TC03 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 644 | FE silent trên 409 — modal đóng, không toast/inline error | Closed |
| BUG-VT-005 | Medium | P2 | UI/UX | TC02/TC06 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 619 (§Inputs row 4) | Form Add/Edit modal thiếu trường Trạng thái (trang_thai bắt buộc) | Closed |
| BUG-VT-006 | Minor | P3 | UI/UX | TC02 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 1522 (SCR-VIII-02) | Form Add button [Thêm] ≠ SRS [Lưu] (Form Edit lại đúng [Lưu]) | Closed |
| BUG-VT-008 | Minor | P3 | Code | TC03/TC08 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 644-645 | errCode mismatch — BE `ERR-VAL-VIII-111-XX` thay SRS `ERR-VT-XX` | Open (defer Minor) |
| BUG-VT-009 | Medium | P2 | UI/UX | TC10 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 610 + 625 | FE cho non-QTHT thấy button [+ Thêm mới] + mở modal CRUD (BE 403 đúng nhưng UI lộ entrypoint) | Closed |

> **Re-test 2026-05-07 (sau dev claim fix):** ❌ 5/7 STILL OPEN, 2/7 not verified.
> - **BUG-VT-003**: Table vẫn 5 cột (Mã/Tên/Cấp/Trạng thái/Thao tác), thiếu Mô tả/SoTK/SoQuyền. ❌ FAIL.
> - **BUG-VT-004**: POST mã trùng `QTHT` → BE 409 ERR-VAL-VIII-111-01 đúng. FE vẫn silent: modal đóng, errors=[], no toast. ❌ FAIL.
> - **BUG-VT-005**: Modal Thêm vai trò vẫn 4 fields (Mã/Tên/Cấp/Mô tả), thiếu trường Trạng thái. ❌ FAIL.
> - **BUG-VT-006**: Button vẫn label `[Thêm]` (form Add). ❌ FAIL.
> - **BUG-VT-008**: errCode vẫn `ERR-VAL-VIII-111-01` (không phải SRS `ERR-VT-01`). ❌ FAIL.
> - **BUG-VT-001**: Skip re-test — yêu cầu full E2E (create role + assign TK qua UI multi-step + delete). Pattern modal CRUD chưa thay đổi nên khả năng cao behavior giống bug gốc. Cần re-verify riêng.
> - **BUG-VT-009**: Skip re-test — yêu cầu login non-QTHT trong isolated context. UI button [+ Thêm mới] vẫn render trong list — chưa xác định hide cho non-QTHT.

> **Re-test 2026-05-07 14:30 (sau dev claim fix lần 2):** ✅ 6/7 CLOSED-verified, 1/7 defer Minor.
> - **BUG-VT-001:** ✅ PASS (Closed-verified). Setup E2E: tạo role `QA_VT_DEL_TEST_R7` qua UI [+ Thêm mới] → toast "Thêm vai trò thành công"; gán role cho `cb_nv_tw_01` qua dialog "Quản lý vai trò" (button team trên row TK list); navigate Vai trò list → role hiện Số tài khoản = 1. Click button delete (row action) → confirm popup "Bạn có chắc chắn muốn xóa vai trò này?" → click [Xóa]. **DELETE `/api/v1/vai-tro/<id>` → 409** (đúng SRS) + toast error close-circle: **"Không thể xóa. Vai trò đang được gán cho 1 tài khoản"**. Match SRS line 645 ERR-VT-02 message exactly. Role không bị xóa (table vẫn 12 mục). Evidence: [r7-7-8e-retest-vt001-409-toast.png](r7-7-8e-retest-vt001-409-toast.png).
> - **BUG-VT-003:** ✅ PASS (Closed-verified). Table render đầy đủ **8 cột**: Mã / Tên / **Mô tả** / **Số tài khoản** (clickable link `/quan-tri/tai-khoan?vaiTroId=X`) / **Số quyền** (clickable link `/vai-tro/X/quyen-han`) / Cấp / Trạng thái / Thao tác. Đủ 7 cột SRS line 1517-1519 + 1 cột Cấp extra. Evidence: [r7-7-8e-retest-table-8-cols.png](r7-7-8e-retest-table-8-cols.png).
> - **BUG-VT-004:** ✅ PASS (Closed-verified). Modal "Thêm vai trò" mở → fill mã trùng `QA_VT_DEL_TEST_R7` + tên "Test ma trung" → click [Lưu]. **Modal vẫn open** (không silent close) + **inline error trên field Mã** (`invalid="true"` + description) + **toast error close-circle**: "Mã vai trò 'QA_VT_DEL_TEST_R7' đã tồn tại". Match SRS line 644 ERR-VT-01 message. Evidence: [r7-7-8e-retest-vt004-409-toast-inline.png](r7-7-8e-retest-vt004-409-toast-inline.png).
> - **BUG-VT-005:** ✅ PASS (Closed-verified). Modal Add vai trò có **5 fields**: Mã* / Tên* / Cấp / Mô tả / **Trạng thái** (switch toggle, default checked = Hoạt động). Modal Edit cũng có Trạng thái field.
> - **BUG-VT-006:** ✅ PASS (Closed-verified). Button submit modal Add giờ là `[Lưu]` thay vì `[Thêm]` — match SRS line 1522 + consistent với Form Edit.
> - **BUG-VT-008:** ⏳ Defer Minor — không re-verify trực tiếp errCode body lần này (session API auth expired). Message Tiếng Việt match SRS exactly cho cả VT-01 (mã trùng) và VT-02 (đang gán). Code mismatch không block functional, đợi BA + dev align.
> - **BUG-VT-009:** ✅ PASS (Closed-verified). Login `cb_nv_tw_02` (role CB_NV_TW non-QTHT) trong isolated context → navigate `/quan-tri/vai-tro` → **redirect `/403`**. Page render: image "Unauthorized" + text "403 / Bạn không có quyền truy cập trang này. / Vai trò hiện tại: CB_NV_TW" + button "Về trang chủ" / "Quay lại". KHÔNG render page Quản lý vai trò → KHÔNG có button [+ Thêm mới] visible. FE đã check permission qua route guard. Evidence: [r7-7-8e-retest-vt009-403-redirect.png](r7-7-8e-retest-vt009-403-redirect.png).

---

## BUG-VT-001 — BE xóa vai trò silently khi role đang gán TK (ERR-VT-02 không trigger)

### Mô tả

QTHT xóa vai trò đang gán cho ≥1 tài khoản. Theo SRS line 645, BE phải reject 409 với `ERR-VT-02 "Không thể xóa. Vai trò đang gán cho {N} tài khoản"`. Thực tế BE trả 204 No Content (delete thành công), record VAI_TRO bị xóa, junction TAI_KHOAN_VAI_TRO bị cascade xóa, TK mất role tham chiếu mà không có warning.

### Các bước tái hiện

1. Login `qtht_02` / OTP 666666.
2. Tạo vai trò mới `QA_TEST_VT_R778E` qua UI (TC02 happy).
3. Gán vai trò vừa tạo cho TK `cb_nv_tw_02` (uuid `facdea31-96a6-4e09-9acf-f871052faa68`):
   ```
   PUT /api/v1/tai-khoan/facdea31-96a6-4e09-9acf-f871052faa68
   Body: {"version":5,"vaiTroIds":["aaaaaaaa-0000-4000-8000-000000000008","c2386e67-4992-454c-bb72-e563d2911792"]}
   ```
4. Verify GET `/api/v1/tai-khoan/<cb_nv_tw_02>` trả `vaiTros: [CB_NV_TW, QA_TEST_VT_R778E]`.
5. Xóa vai trò vừa gán:
   ```
   DELETE /api/v1/vai-tro/c2386e67-4992-454c-bb72-e563d2911792
   ```

### Kết quả mong đợi

- BE trả `409` với `{success: false, error: {code: "ERR-VT-02", message: "Không thể xóa. Vai trò đang gán cho 1 tài khoản"}}`.
- Record VAI_TRO không bị xóa.
- TK cb_nv_tw_02 vẫn giữ role `QA_TEST_VT_R778E`.

### Kết quả thực tế

```
DELETE /api/v1/vai-tro/c2386e67-4992-454c-bb72-e563d2911792
Status: 204 No Content
Body: (empty)
```

- BE **silently deleted** record VAI_TRO.
- GET cb_nv_tw_02 sau xóa: `vaiTros: [CB_NV_TW only]` — junction record auto-cleaned (cascade hoặc soft-delete + filter).
- TK mất role mà không có cảnh báo.

### Bằng chứng

**SRS local quote** (`srs-fr-10-quan-tri.md` line 645):

```
| E2 | Vai trò đang gán cho TK | ERR-VT-02 | "Không thể xóa. Vai trò đang gán cho {N} tài khoản" | ERROR |
```

**SRS Acceptance Criteria** (line 651):

```
Given QTHT xóa vai trò đang gán cho tài khoản When xác nhận Then từ chối + cảnh báo
```

**NotebookLM verify match 100%** (citation source-id `e2d6294a-...`): "ERR-VT-02: Vai trò đang gán cho TK — 'Không thể xóa. Vai trò đang gán cho {N} tài khoản'".

**Severity:** Critical — vi phạm AC explicit "từ chối + cảnh báo". Hậu quả nghiêm trọng:
- Data integrity: TK mất role gắn → có thể mất quyền truy cập đột ngột.
- Audit gap: Không có log warn về assignment cleanup.
- Junction cascade silent: Admin không biết bao nhiêu TK bị ảnh hưởng.

### Test command (reproduce)

```javascript
// 1) Gán role vào TK
await fetch('/api/v1/tai-khoan/facdea31-96a6-4e09-9acf-f871052faa68', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}`},
  body: JSON.stringify({version: 5, vaiTroIds: ['aaaaaaaa-0000-4000-8000-000000000008', 'c2386e67-4992-454c-bb72-e563d2911792']})
});
// 2) Xóa role
await fetch('/api/v1/vai-tro/c2386e67-4992-454c-bb72-e563d2911792', {
  method: 'DELETE',
  headers: {'Authorization': `Bearer ${TOKEN}`}
});
// Expect: 409 ERR-VT-02
// Actual: 204 silent delete
```

---

## BUG-VT-003 — UI table thiếu 3 cột SRS: Mô tả + Số tài khoản + Số quyền

### Mô tả

SCR-VIII-02 line 1517-1519 quote 7 cột table: Mã / Tên / **Mô tả** / **Số tài khoản** / **Số quyền** / Trạng thái / Hành động. UI thực tế chỉ render 5 cột: Mã / Tên / **Cấp** (extra) / Trạng thái / Thao tác. Thiếu 3 cột quan trọng cho QTHT quản lý role.

### Các bước tái hiện

1. Login `qtht_02` → `/quan-tri/vai-tro`.
2. Quan sát header table.

### Kết quả mong đợi

UI table có đủ 7 cột theo SRS:
1. Mã vai trò
2. Tên vai trò
3. Mô tả (mô tả chức năng)
4. Số tài khoản (clickable → lọc danh sách TK)
5. Số quyền (clickable → MH-10.4)
6. Trạng thái (toggle)
7. Hành động (Sửa/Xóa)

### Kết quả thực tế

UI render 5 cột:
1. Mã vai trò ✅
2. Tên vai trò ✅
3. **Cấp** (extra — không có trong SRS)
4. Trạng thái (text label, không phải toggle)
5. Thao tác

→ Thiếu Mô tả / Số tài khoản / Số quyền. QTHT muốn xem role có bao nhiêu TK đang dùng → không có column. Mô tả role → không thấy ngoài form Edit.

### Bằng chứng

**SRS local quote** (`srs-fr-10-quan-tri.md` line 1517-1519):

```
| 5 | content | Cột Mô tả | table-column | Mô tả chức năng | — | luôn hiển thị |
| 6 | content | Cột Số tài khoản | table-column | Số TK đang gán | click → lọc danh sách TK | luôn hiển thị |
| 7 | content | Cột Số quyền | table-column | Số quyền đã gán | click → MH-10.4 | luôn hiển thị |
```

**NotebookLM verify match 100%** (citation source-id `e2d6294a-...`).

**Severity:** Major — missing functional UX. QTHT phải mở từng role để xem mô tả/quyền/TK count → không scale.

---

## BUG-VT-004 — FE silent trên 409 — modal đóng không toast/inline error

### Mô tả

Khi BE reject CREATE vai trò với 409 ERR-VAL-VIII-111-01 (mã trùng), FE đóng modal nhưng KHÔNG hiện toast error + KHÔNG hiện inline error trên field Mã. User thao tác fail mà không biết tại sao — nghĩ là bug app, retry vô tận.

### Các bước tái hiện

1. Tạo vai trò `QA_TEST_VT_R778E` lần 1 → success (TC02).
2. Click [+ Thêm mới] → fill mã trùng `QA_TEST_VT_R778E` + tên `Test trùng mã` → click [Thêm].
3. Quan sát UI sau click Thêm.

### Kết quả mong đợi

- Modal stay open hoặc reopen.
- FE hiện toast `.ant-message-error` với message từ BE: "Mã vai trò 'QA_TEST_VT_R778E' đã tồn tại".
- HOẶC FE hiện inline `.ant-form-item-explain-error` dưới field Mã.

### Kết quả thực tế

- Modal đóng silent.
- KHÔNG có toast `.ant-message`/`.ant-notification`.
- KHÔNG có inline error dưới field Mã.
- List vẫn 12/12 (rejected đúng).
- User không biết tại sao thao tác fail.

### Bằng chứng

**Network response BE đúng:**
```json
POST /api/v1/vai-tro
Status: 409
Response: {"success":false,"error":{"code":"ERR-VAL-VIII-111-01","message":"Mã vai trò 'QA_TEST_VT_R778E' đã tồn tại"}}
```

**FE evaluate_script kiểm tra:**
```js
document.querySelectorAll('.ant-form-item-explain-error, .ant-message, .ant-notification, [role="alert"]')
// → []
```

**SRS local quote** (`srs-fr-10-quan-tri.md` line 644):

```
| E1 | Mã vai trò trùng | ERR-VT-01 | "Mã vai trò '{ma}' đã tồn tại" | ERROR |
```

→ Severity ERROR phải show toast/inline error per UX standard.

**Severity:** Major — UX broken, vi phạm SRS Severity ERROR yêu cầu user phải nhận thông báo.

---

## BUG-VT-005 — Form Add/Edit modal thiếu trường Trạng thái

### Mô tả

SRS Inputs row 4 line 619 quote: `trang_thai | boolean | Y | 1 = Hoạt động | 1 | user input` — bắt buộc, default 1. SRS line 1522 quote modal Form CRUD: "Mã, Tên, Mô tả, Trạng thái — [Hủy] [Lưu]". Form Add/Edit modal thực tế CHỈ có 4 fields (Mã*/Tên*/Cấp/Mô tả), KHÔNG có trường Trạng thái cho user chọn.

### Các bước tái hiện

1. Click [+ Thêm mới] → quan sát modal Add.
2. Click [edit] trên row custom → quan sát modal Edit.

### Kết quả mong đợi

Modal Add/Edit có 4 trường + 1 trường Trạng thái:
- Mã vai trò* (Add only)
- Tên vai trò*
- Mô tả
- **Trạng thái** (toggle Hoạt động/Không hoạt động, default Hoạt động)

### Kết quả thực tế

Modal Add: Mã* / Tên* / **Cấp** (extra) / Mô tả → 4 fields KHÔNG có Trạng thái.
Modal Edit: Tên* / Cấp / Mô tả → 3 fields KHÔNG có Trạng thái.

→ User muốn tạo role inactive ngay từ đầu → không làm được, phải tạo + toggle riêng. Edit role → không sửa được Trạng thái trong cùng form, phải toggle qua button swap riêng (UX phân mảnh).

### Bằng chứng

**SRS local quote** (`srs-fr-10-quan-tri.md` line 619 + 1522):

```
Inputs row 4: trang_thai | boolean | Y | 1 = Hoạt động | 1 | user input

SCR-VIII-02 row 10: form | Form CRUD | modal | Mã, Tên, Mô tả, Trạng thái | [Hủy] [Lưu] | khi mở modal
```

**NotebookLM verify match 100%** (citation source-id `e2d6294a-...`): "Modal Form CRUD ... bao gồm 4 trường dữ liệu để nhập: Mã, Tên, Mô tả, Trạng thái".

**Severity:** Medium — workaround có (toggle qua button swap) nhưng UX không match SRS.

---

## BUG-VT-006 — Form Add button [Thêm] ≠ SRS [Lưu] (Form Edit lại đúng [Lưu])

### Mô tả

SRS line 1522 quote modal CRUD button: `[Hủy] [Lưu]`. Form Add modal dùng `[Hủy] [Thêm]`. Form Edit modal dùng `[Hủy] [Lưu]` — đúng SRS. Inconsistent labels giữa 2 form CRUD cùng module.

### Các bước tái hiện

1. Click [+ Thêm mới] → quan sát button submit modal Add.
2. Click [edit] → quan sát button submit modal Edit.

### Kết quả mong đợi

Cả Form Add và Form Edit dùng `[Lưu]` per SRS line 1522.

### Kết quả thực tế

- Form Add: button label `[Thêm]` (không match SRS).
- Form Edit: button label `[Lưu]` (match SRS).

### Bằng chứng

**SRS local quote** (`srs-fr-10-quan-tri.md` line 1522):

```
| 10 | modal | Form CRUD | modal | Mã, Tên, Mô tả, Trạng thái | [Hủy] [Lưu] | khi mở modal |
```

**Severity:** Minor — chỉ là label, không ảnh hưởng functional. Tuy nhiên BA review có thể chốt giữ `[Thêm]` cho Form Add (UX rõ hơn) → cần update SRS thay đổi cho match thực tế.

---

## BUG-VT-008 — errCode mismatch — BE `ERR-VAL-VIII-111-XX` thay SRS `ERR-VT-XX`

### Mô tả

SRS FR-VIII-14 §Error Handling định nghĩa 2 errCode `ERR-VT-01` (mã trùng) + `ERR-VT-02` (đang gán TK). BE thực tế dùng convention khác `ERR-VAL-VIII-111-XX`:
- `ERR-VAL-VIII-111-01` thay `ERR-VT-01` (mã trùng).
- KHÔNG trigger `ERR-VT-02` (xem BUG-VT-001).
- `ERR-VAL-VIII-111-03` (mới — system role lock, không có trong SRS).

### Các bước tái hiện

1. TC03 — POST mã trùng → `ERR-VAL-VIII-111-01`.
2. TC08 bonus — DELETE QTHT system role → `ERR-VAL-VIII-111-03`.
3. TC08 chính — DELETE assigned role → 204 (không trigger error code nào).

### Kết quả mong đợi

BE dùng đúng errCode SRS:
- `ERR-VT-01` cho mã trùng.
- `ERR-VT-02` cho role đang gán TK.

### Kết quả thực tế

BE dùng `ERR-VAL-VIII-111-XX` — convention error code khác hoàn toàn SRS spec.

### Bằng chứng

```json
TC03: {"code":"ERR-VAL-VIII-111-01","message":"Mã vai trò 'QA_TEST_VT_R778E' đã tồn tại"}
TC08-bonus: {"code":"ERR-VAL-VIII-111-03","message":"Không thể xóa vai trò hệ thống"}
```

**SRS local quote** (`srs-fr-10-quan-tri.md` line 644-645): Chỉ định nghĩa `ERR-VT-01` + `ERR-VT-02`.

**Severity:** Minor — error message đúng, chỉ code mismatch. FE có thể parse message OK nhưng nếu FE muốn dùng errCode để switch logic (vd map errCode → field highlight) → fail. Cần BA + dev align convention error code.

---

## BUG-VT-009 — FE cho non-QTHT thấy button [+ Thêm mới] + mở modal CRUD (UI permission gap)

### Mô tả

SRS Preconditions line 610: "User đã đăng nhập, vai trò QTHT". Processing bước 1 line 625: "Kiểm tra quyền QTHT" (BR-AUTH-01). Page `/quan-tri/vai-tro` chỉ dành cho QTHT. UI thực tế render đầy đủ button [+ Thêm mới] cho user `cb_nv_tw_02` (role CB_NV_TW, KHÔNG phải QTHT). User click button → modal "Thêm vai trò" mở → fill xong submit → BE 403 ERR-PERM-SYS-00-01 "Forbidden" (BE đúng) nhưng FE đã cho user nhập data + lộ entrypoint write trước khi BE chặn.

### Các bước tái hiện

1. Login `cb_nv_tw_02` / OTP 666666 (role CB_NV_TW non-QTHT).
2. Navigate `/quan-tri/vai-tro` → page render đầy đủ + 11 system roles + button [+ Thêm mới] visible (uid 121_40).
3. Click [+ Thêm mới] → modal "Thêm vai trò" mở (uid 122_0) với form 4 fields.
4. Fill `QA_TC10_NEG_PERM` + tên + click [Thêm].
5. Quan sát BE response.

### Kết quả mong đợi

- FE check JWT permissions trước khi render button [+ Thêm mới] → hide nếu user thiếu permission `create_vai_tro`.
- Hoặc disable button + tooltip "Bạn không có quyền tạo vai trò".
- Modal KHÔNG mở được cho non-QTHT.

### Kết quả thực tế

- Button [+ Thêm mới] visible cho cb_nv_tw_02 ✅ FE không check permission.
- Modal mở được + form input work bình thường.
- BE chặn submit:
```json
POST /api/v1/vai-tro
Status: 403
Response: {"success":false,"error":{"code":"ERR-PERM-SYS-00-01","message":"Forbidden"}}
```

### Bằng chứng

**SRS local quote** (`srs-fr-10-quan-tri.md` line 610 + 625):

```
Preconditions:
- User đã đăng nhập, vai trò QTHT

Processing bước 1: Kiểm tra quyền QTHT | BR-AUTH-01
```

**JWT decode cb_nv_tw_02 permissions:** Có `read_vai_tro` (cho phép READ) nhưng KHÔNG có `create_vai_tro`/`update_vai_tro`/`delete_vai_tro`.

**Severity:** Medium — UX gap, BE defense in depth đúng nên không phải Critical/Major. Tuy nhiên user thao tác xong mới biết bị chặn → confusion. Best practice FE phải hide write entrypoint dựa vào permissions JWT.

**Note finding bonus:** BE design granular permission (cấp `read_vai_tro` cho non-QTHT) có thể khác SRS Preconditions "QTHT-only". Có thể defensive cần thiết (CB_NV cần read role để chọn assign khi tạo TK), không trái nghiêm trọng. Cần BA confirm rule chính thức.

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|---|---|
| URL | http://103.172.236.130:3000/quan-tri/vai-tro |
| API | `/api/v1/vai-tro/*` (CRUD) · `/api/v1/tai-khoan/<id>` (gán role test) |
| Account | qtht_02 (admin), cb_nv_tw_02 (target test gán role test ERR-VT-02) |
| Tool | Chrome DevTools MCP |
| NotebookLM | https://notebooklm.google.com/notebook/a4ae45bf-cea0-4325-8fee-b1e0be702cf2 |
| Custom role test | `QA_TEST_VT_R778E` (uuid `c2386e67-4992-454c-bb72-e563d2911792`) — created TC02, deleted TC08 (silent — bug) |

---

*Bug report generated: 2026-05-07 | QA Automation via Claude Code | 2-source verify NotebookLM + SRS local*
