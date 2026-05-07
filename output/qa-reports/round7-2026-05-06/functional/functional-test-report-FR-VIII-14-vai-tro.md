# Functional Test Report — R7.7.8e FR-VIII-14 Quản lý Vai trò

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000/quan-tri/vai-tro |
| **Người test** | QA Automation via Claude Code (qtht_02) |
| **Ngày** | 2026-05-07 |
| **Loại test** | Functional FR-VIII-14 + SCR-VIII-02 CRUD |
| **Round** | Round 7 — R7.7.8e |
| **Tool** | Chrome DevTools MCP |
| **Account** | qtht_02 (admin), cb_nv_tw_02 (target gán role test ERR-VT-02) |
| **SRS** | FR-VIII-14 line 597-655, SCR-VIII-02 line 1503-1523 |
| **2-source verify** | ✅ NotebookLM Haizz-HTPLDN (id `a4ae45bf-...`) + grep SRS local — match 100% |

---

## Tổng hợp

**Verdict:** 🚫 **FAIL** — Critical 1 + Major 2 + Medium 2 + Minor 2 = 7 bugs. BE không enforce ERR-VT-02 (xóa role đang gán TK silently). Form thiếu trường Trạng thái. Table thiếu 3 cột SRS. FE silent trên 409. TC10 thêm BUG-VT-009 (FE không hide button cho non-QTHT). TC11 audit log PASS.

> **Bonus test (NotebookLM gợi ý):** TC10 Permission negative + TC11 Audit log — chạy thật 2026-05-07.

### Test result

| TC | Path | Verdict |
|---|---|---|
| **TC01** | READ list 11 system seed + verify 7 cột SRS | ⚠️ PARTIAL — UI 5 cột, thiếu "Mô tả/SoTK/SoQuyen", có "Cấp" extra, all 11 roles locked |
| **TC02** | CREATE happy `QA_TEST_VT_R778E` | ✅ PASS — saved 12/12 items, có 4 button [edit/database/swap/delete] |
| **TC03** | CREATE duplicate mã (ERR-VT-01) | ⚠️ PARTIAL — BE 409 message OK, errCode `ERR-VAL-VIII-111-01` ≠ SRS `ERR-VT-01`, FE silent (modal đóng no toast) |
| **TC04** | CREATE empty mã | ✅ PASS — FE inline "Vui lòng nhập mã vai trò" |
| **TC05** | CREATE empty tên | ✅ PASS — FE inline "Vui lòng nhập tên vai trò" |
| **TC06** | UPDATE tên | ✅ PASS — toast "Cập nhật vai trò thành công" |
| **TC07** | TOGGLE trạng thái | ✅ PASS — Kích hoạt → Vô hiệu hóa, toast "Đã vô hiệu hóa vai trò" |
| **TC08** | DELETE assigned role (ERR-VT-02) | 🚫 **FAIL** — BE 204 silently deleted despite role assigned to cb_nv_tw_02 |
| **TC09** | DELETE cleanup | ✅ PASS (side effect TC08) — list back to 11/11 |
| **TC10** | Permission negative — cb_nv_tw_02 (non-QTHT) truy cập | ⚠️ PARTIAL — BE 403 ERR-PERM-SYS-00-01 đúng cho POST, NHƯNG FE không hide button [+ Thêm mới] + cho mở modal CRUD (UX gap, BUG-VT-009) |
| **TC11** | Audit log verify CRUD VAI_TRO | ✅ PASS — Filter Module=Vai trò trả 4 entries match TC02/06/07/08 (CREATE 201 + UPDATE 200 + TOGGLE 200 + DELETE 204) |

---

## TC01 — READ list 11 system seed roles

**Action:** Navigate `/quan-tri/vai-tro` → quan sát table.

**SRS spec SCR-VIII-02 line 1515-1521 quote 7 cột:** Mã / Tên / **Mô tả** / **SốTK** / **SốQuyền** / Trạng thái (toggle) / Hành động (Sửa/Xóa).

**UI thực tế 5 cột:** Mã vai trò / Tên vai trò / **Cấp** (extra) / Trạng thái / Thao tác.

**Mismatches (logged BUG-VT-003):**
- ❌ Thiếu 3 cột SRS: Mô tả / Số tài khoản / Số quyền.

**System roles all locked (note observation):**
- 11/11 system seed roles (CB_NV_BN/DP/TW + CB_PD_BN/DP/TW + CG/DN/NHT/QTHT/TVV) chỉ có icon "lock" + button [database], KHÔNG có Sửa/Xóa.
- BE applies defensive rule "system role lock" (ERR-VAL-VIII-111-03) — hợp lý để bảo vệ data integrity. Cần BA confirm + bổ sung SRS spec nếu giữ rule.

---

## TC02 — CREATE happy `QA_TEST_VT_R778E`

**Action:** Click [+ Thêm mới] → modal "Thêm vai trò" → fill Mã/Tên/Mô tả → click [Thêm].

**Modal fields observed (4 fields):** Mã vai trò* / Tên vai trò* / **Cấp** (combobox extra) / Mô tả.

**Missing field (logged BUG-VT-005):**
- ❌ KHÔNG có trường Trạng thái — SRS Inputs row 4 quote `trang_thai | boolean | Y | 1 = Hoạt động | 1 | user input` bắt buộc.

**Button label (logged BUG-VT-006):**
- ⚠️ Button label `[Thêm]` (form Add) ≠ SRS line 1522 quote `[Lưu]`. Form Edit modal lại dùng `[Lưu]` đúng — inconsistent labels.

**Result:** Record `QA_TEST_VT_R778E` (uuid `c2386e67-4992-454c-bb72-e563d2911792`) saved, list 11→12 items, có 4 button [edit/database/swap/delete] (KHÔNG lock như system roles). Trạng thái default "Kích hoạt" ✅.

**API:** `POST /api/v1/vai-tro` → 201 Created. Body `{maVaiTro, tenVaiTro, cap, moTa}`.

---

## TC03 — CREATE duplicate mã (ERR-VT-01)

**Action:** Click [+ Thêm mới] → fill Mã trùng `QA_TEST_VT_R778E` + Tên `Test trùng mã` → click [Thêm].

**Result BE:**
```json
POST /api/v1/vai-tro
Status: 409 Conflict
Response: {"success":false,"error":{"code":"ERR-VAL-VIII-111-01","message":"Mã vai trò 'QA_TEST_VT_R778E' đã tồn tại"}}
```

**Result FE:**
- Modal đóng silent.
- KHÔNG có toast.
- KHÔNG có inline error trên field Mã.
- List vẫn 12/12 (rejected đúng).
- User không biết tại sao thao tác fail.

**Findings:**
- ✅ BE message khớp SRS line 644 quote `Mã vai trò '{ma}' đã tồn tại`.
- ⚠️ errCode mismatch: BE `ERR-VAL-VIII-111-01` ≠ SRS `ERR-VT-01` (logged BUG-VT-008).
- 🚨 FE silent fail (logged BUG-VT-004).

---

## TC04-05 — CREATE empty mã / empty tên

| TC | Action | FE inline error | Verdict |
|---|---|---|---|
| TC04 | Empty Mã + fill Tên | "Vui lòng nhập mã vai trò" | ✅ PASS |
| TC05 | Fill Mã `QA_TC05_NO_NAME` + empty Tên | "Vui lòng nhập tên vai trò" | ✅ PASS |

FE form validation Antd `required` work đúng, no API call sent (FE block trước submit).

---

## TC06 — UPDATE Tên

**Action:** Click [edit] row `QA_TEST_VT_R778E` → modal "Chỉnh sửa vai trò" → update Tên → click [Lưu].

**Modal fields (3 fields):** Tên / Cấp / Mô tả. **KHÔNG có Mã** (immutable design — acceptable).

**Result:** Tên updated `QA Test Vai trò R7.7.8e (đã update)`, toast "Cập nhật vai trò thành công" ✅.

**Note:** Form Edit cũng thiếu trường Trạng thái như form Add (BUG-VT-005 cover cả 2 form).

---

## TC07 — TOGGLE trạng thái

**Action:** Click button [swap] (icon đổi chiều) trên row custom role.

**Result:** Trạng thái Kích hoạt → Vô hiệu hóa direct (không popconfirm), toast "Đã vô hiệu hóa vai trò" ✅.

---

## TC08 — DELETE assigned role (ERR-VT-02) — CRITICAL BUG

**Setup:** PUT `/api/v1/tai-khoan/<cb_nv_tw_02>` thêm role `c2386e67-...` vào `vaiTroIds`. Verify GET trả `vaiTros: [CB_NV_TW, QA_TEST_VT_R778E]` ✅.

**Action:** `DELETE /api/v1/vai-tro/c2386e67-4992-454c-bb72-e563d2911792` (custom role đang gán cb_nv_tw_02).

**Expected:** 409 Conflict + `{code: "ERR-VT-02", message: "Không thể xóa. Vai trò đang gán cho 1 tài khoản"}` per SRS line 645.

**Actual:**
```
DELETE /api/v1/vai-tro/c2386e67-4992-454c-bb72-e563d2911792
Status: 204 No Content
Body: (empty)
```

→ BE **silently deleted** the role despite assignment. Vi phạm SRS BR/ERR-VT-02 (logged BUG-VT-001 Critical).

**Verify post-state GET cb_nv_tw_02:** `vaiTros: [CB_NV_TW only]` — junction record auto-cleaned (cascade) → role không còn trong system, TK mất reference.

**Side effect:** TC09 cleanup đã hoàn thành (custom role deleted + list back 11/11).

---

## TC08 bonus — DELETE system role probe (defensive design observation)

**Action:** `DELETE /api/v1/vai-tro/aaaaaaaa-0000-4000-8000-000000000002` (QTHT system seed).

**Result:**
```
Status: 409
Response: {"code":"ERR-VAL-VIII-111-03","message":"Không thể xóa vai trò hệ thống"}
```

**Observation:** BE chặn xóa system seed roles với errCode mới `ERR-VAL-VIII-111-03` — defensive design bảo vệ data integrity. SRS không quote rule này nhưng cũng không cấm. Cần BA confirm + bổ sung SRS spec nếu giữ rule. errCode mismatch convention SRS log riêng → BUG-VT-008 (Minor).

---

## TC10 — Permission negative — cb_nv_tw_02 (non-QTHT) truy cập

**SRS Preconditions line 610:** "User đã đăng nhập, vai trò QTHT". **Processing line 625:** "Kiểm tra quyền QTHT" (BR-AUTH-01).

**Setup:** Login `cb_nv_tw_02` (role CB_NV_TW) trong isolated context riêng.

**Action 1 — GET list:** Navigate `/quan-tri/vai-tro` → page render đầy đủ + 11 system roles + button [+ Thêm mới] visible.

**Action 2 — POST CREATE:** Click [+ Thêm mới] → modal mở → fill `QA_TC10_NEG_PERM` + tên → click [Thêm].

**Result:**
```
GET /api/v1/vai-tro → 200 (BE allow READ — JWT có permission `read_vai_tro`)
POST /api/v1/vai-tro → 403
Response: {"success":false,"error":{"code":"ERR-PERM-SYS-00-01","message":"Forbidden"}}
```

**Findings:**
- ✅ BE chặn write 403 đúng (defense in depth OK).
- ⚠️ FE cho non-QTHT thấy button [+ Thêm mới] + cho mở modal CRUD → user nhập xong submit mới biết không có quyền (UX gap).
- ⚠️ BE design granular permission `read_vai_tro` cấp cho non-QTHT — SRS quote QTHT-only, có thể cần BA confirm rule (CB_NV cần read role để chọn assign khi tạo TK — defensive design hợp lý).

→ Logged BUG-VT-009 (Medium).

---

## TC11 — Audit log verify CRUD VAI_TRO (BR-DATA-05)

**SRS Processing bước 4 line 628:** "Ghi nhật ký thao tác" (BR-DATA-05).

**Action:** Navigate `/quan-tri/audit-log` → filter Module=Vai trò → search.

**Result:** 4/4 entries match đầy đủ 4 thao tác CRUD trên `c2386e67` (custom role TC02 created):

| Thời gian | Hành động | Endpoint | HTTP Code | Match TC |
|---|---|---|---|---|
| 07/05/2026 01:48 | Tạo mới | POST /api/v1/vai-tro | 201 | TC02 CREATE ✅ |
| 07/05/2026 01:51 | Cập nhật | PATCH /api/v1/vai-tro/c2386e67-... | 200 | TC06 UPDATE ✅ |
| 07/05/2026 01:51 | Cập nhật | PATCH /api/v1/vai-tro/c2386e67-.../toggle-status | 200 | TC07 TOGGLE ✅ |
| 07/05/2026 01:55 | Xóa | DELETE /api/v1/vai-tro/c2386e67-... | 204 | TC08 DELETE ✅ |

→ ✅ PASS — BR-DATA-05 audit work đúng. BE ghi audit cả 4 CRUD operation.

**Bonus finding:** Audit DELETE 204 vẫn được ghi mặc dù role đang gán TK (BUG-VT-001) → audit không có warn về assignment cleanup → tăng cường evidence Critical bug.

---

## Bug Summary Table

| Bug ID | Severity | SRS Ref | Title | Status |
|---|---|---|---|---|
| BUG-VT-001 | **Critical** | FR-VIII-14 line 645 + AC line 651 | BE xóa vai trò silently khi role đang gán TK (ERR-VT-02 không trigger, 204 thay 409) | Open |
| BUG-VT-003 | Major | SCR-VIII-02 line 1517-1519 | UI table thiếu 3 cột SRS: Mô tả + Số tài khoản + Số quyền | Open |
| BUG-VT-004 | Major | FR-VIII-14 line 644 + UX | FE silent trên 409 ERR-VAL-VIII-111-01 — modal đóng không toast/inline error | Open |
| BUG-VT-005 | Medium | FR-VIII-14 §Inputs row 4 line 619 | Form Add/Edit modal thiếu trường Trạng thái (trang_thai bắt buộc, default 1) | Open |
| BUG-VT-006 | Minor | SCR-VIII-02 line 1522 | Form Add button [Thêm] ≠ SRS [Lưu] (Form Edit lại đúng [Lưu]) — inconsistent | Open |
| BUG-VT-008 | Minor | FR-VIII-14 §Error Handling | errCode mismatch toàn bộ — BE dùng `ERR-VAL-VIII-111-XX` thay SRS `ERR-VT-XX` | Open |
| BUG-VT-009 | Medium | FR-VIII-14 §Preconditions line 610 + Processing line 625 | FE cho non-QTHT (cb_nv_tw_02) thấy button [+ Thêm mới] + mở modal CRUD (BE 403 đúng nhưng UI lộ entrypoint) | Open |

**Bug file riêng:** [bug-report-r7-7-8e-vai-tro.md](../bug-reports/qtht-vai-tro/bug-report-r7-7-8e-vai-tro.md)

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|---|---|
| URL | http://103.172.236.130:3000/quan-tri/vai-tro |
| API | `/api/v1/vai-tro/*` (CRUD) · `/api/v1/tai-khoan/<id>` (gán role test ERR-VT-02) |
| Account | qtht_02 (admin), cb_nv_tw_02 (target test gán role) |
| Tool | Chrome DevTools MCP |
| NotebookLM | https://notebooklm.google.com/notebook/a4ae45bf-cea0-4325-8fee-b1e0be702cf2 |
| Custom role test | `QA_TEST_VT_R778E` (uuid `c2386e67-4992-454c-bb72-e563d2911792`) — created TC02, deleted TC08 |

---

*Functional test report generated: 2026-05-07 | QA Automation via Claude Code | 2-source verify NotebookLM + SRS local*
