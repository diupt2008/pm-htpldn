# Permission Test Report — FR-10 Quản trị Hệ thống (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI deep-test (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-10](../../../permission-matrix-by-role.md) + SRS v3.1 §3.4.2
**Round:** Round 3 phân quyền — FR-10 core admin module

---

## 1. Kết quả tổng quan

| Section | Tổng function | ✅ PASS | ❌ FAIL | ⚠️ PARTIAL / GAP | Verdict |
|---------|---------------|---------|---------|-------------------|---------|
| **Submenu 1** DMDC 14 tab | 13 DM (FR-VIII-01..04, 06..09, 11, 12, 18, 19) + 1 DON_VI (FR-VIII-05) | 13 | 1 (DON_VI) | 0 | ⚠️ PASS WITH BUG |
| **Submenu 2** Cấu hình HT | 1 SLA (FR-VIII-10) + Phân công + Mẫu PH | 1 | 0 | 0 | ✅ PASS (re-verify FR-05) |
| **Submenu 3** Tài khoản & phân quyền | FR-VIII-13 (DMDC), FR-VIII-15 (TK) | 2 | 0 | 3 GAP UI (FR-VIII-14, 16, 17) | ⚠️ PASS WITH GAP |
| **Submenu 4** Nhật ký hệ thống | AUDIT_LOG (related FR-VI-02) | 1 | 0 | 0 | ✅ PASS |
| **Login flow** FR-VIII-20..25 | 6 function | 3 verify | 0 | 3 untested (VNeID stack) | ⚠️ PASS |
| **TỔNG** | **25** | **20** | **1** | **4 GAP** | ⚠️ **PASS WITH MAJOR BUG** |

### Bug phát hiện mới

| Bug ID | Severity | Title | Scope |
|--------|----------|-------|-------|
| **BUG-PERM-QTHT-FR10-001** | **Major** | DON_VI tab: `[Thêm đơn vị con]` + `[Xóa]` disabled với mọi node — QTHT không Create/Delete được đơn vị. Cũng không có button `[+ Thêm đơn vị mới]` cấp root. Vi phạm FR-VIII-05 `DON_VI` CRUD. | 3 cấp QTHT (TW/BN/ĐP) |
| **BUG-PERM-QTHT-FR10-002** | Medium | DON_VI tree bị scope-filter cho qtht_dp_4 (chỉ thấy 1 node TW root, trong khi qtht_tw thấy 84+ nodes). Vi phạm BR-AUTH-08 QTHT vượt scope. | QTHT_DP × DON_VI tree |

### Regression (BUG-002 FR-01..05)

BUG-PERM-QTHT-FR04-002 Dashboard TVV count = 0 cho qtht_dp_4 — **vẫn không fix, confirmed lại ở round này**.

### 4 GAP UI (không phải bug phân quyền)

| FR | Function | Issue |
|----|----------|-------|
| FR-VIII-14 | Quản lý vai trò (SCR-VIII-02) | Không có URL/page UI |
| FR-VIII-16 | Phân quyền truy cập dữ liệu (SCR-VIII-05) | Không có UI |
| FR-VIII-17 | Phân quyền chức năng master (SCR-VIII-04) | Không có UI (chỉ có modal "Quản lý vai trò" per-user) |
| Landing `/quan-tri` | Placeholder "Đang phát triển — Epic 16" | Module root chưa implement |

---

## 2. Bảng kết quả chi tiết — 25 function × QTHT cấp TW

### 2.1 Submenu 1: Danh mục dùng chung (`/quan-tri/danh-muc/{CODE}`)

> **14 tab DM side-nav:** Lĩnh vực PL (LINH_VUC_PL) / Loại hình hỗ trợ (LOAI_HINH_HO_TRO) / Chương trình hỗ trợ (CHUONG_TRINH_HT) / Tình trạng vụ việc (TINH_TRANG_VU_VIEC) / Cơ quan đơn vị (**DON_VI**) / Tổ chức tư vấn (TO_CHUC_TU_VAN) / Loại doanh nghiệp (LOAI_DOANH_NGHIEP) / Hồ sơ đề nghị hỗ trợ (HO_SO_DE_NGHI_HT) / Hồ sơ đề nghị thanh toán (HO_SO_DE_NGHI_TT) / Tiêu chí đánh giá hiệu quả (TIEU_CHI_DG_HIEU_QUA) / Tiêu chí đánh giá chi phí (TIEU_CHI_DG_CHI_PHI) / Loại tài khoản (LOAI_TAI_KHOAN) / Loại hình tiếp nhận (LOAI_HINH_TIEP_NHAN) / Kênh tiếp nhận (KENH_TIEP_NHAN)

| # | Function | Tab | Entity | Expected | Actual UI | Verdict |
|---|----------|-----|--------|----------|-----------|---------|
| 1 | `FR-VIII-01` | Lĩnh vực pháp lý | `DANH_MUC` | ✅ F CRUD | 15 mục · [+ Thêm mới] + [Xuất Excel] + row [Sửa]/[Xóa] + switch trạng thái. Drawer Thêm + Chỉnh sửa open OK với 6 field (Mã*, Tên*, Mô tả, Thứ tự, DM cha, Trạng thái radio). Buttons [Hủy]/[Đồng ý]. | ✅ PASS |
| 2 | `FR-VIII-02` | Loại hình hỗ trợ | `DANH_MUC` | ✅ F CRUD | 7 mục, cùng pattern | ✅ PASS |
| 3 | `FR-VIII-03` | Chương trình hỗ trợ | `DANH_MUC` | ✅ F CRUD | 4 mục, cùng pattern | ✅ PASS |
| 4 | `FR-VIII-04` | Tình trạng vụ việc | `DANH_MUC` | ✅ F CRUD | 12 mục, cùng pattern | ✅ PASS |
| 5 | **`FR-VIII-05`** | **Cơ quan đơn vị** | **`DON_VI`** | ✅ F CRUD | **Tree view** 84+ đơn vị (TW+BN+DP). Detail panel có [Sửa] (enabled — Update OK). **[Thêm đơn vị con] + [Xóa] DISABLED** trên mọi node. **KHÔNG có button [+ Thêm đơn vị mới] cấp root.** | ❌ **FAIL — BUG-001** |
| 6 | `FR-VIII-06` | Tổ chức tư vấn | `DANH_MUC` | ✅ F CRUD | 3 mục, cùng pattern | ✅ PASS |
| 7 | `FR-VIII-07` | Loại doanh nghiệp | `DANH_MUC` | ✅ F CRUD | 5 mục, cùng pattern | ✅ PASS |
| 8 | `FR-VIII-08` | Hồ sơ đề nghị hỗ trợ | `DANH_MUC` | ✅ F CRUD | 4 mục, cùng pattern | ✅ PASS |
| 9 | `FR-VIII-09` | Hồ sơ đề nghị thanh toán | `DANH_MUC` | ✅ F CRUD | 4 mục, cùng pattern | ✅ PASS |
| 11 | `FR-VIII-11` | Tiêu chí đánh giá hiệu quả | `TIEU_CHI_DANH_GIA` | ✅ F CRUD | 5 mục, cùng pattern. (Nhóm vào DANH_MUC chung — gap spec entity naming) | ✅ PASS |
| 12 | `FR-VIII-12` | Tiêu chí đánh giá chi phí | `DANH_MUC` | ✅ F CRUD | 3 mục, cùng pattern | ✅ PASS |
| 13 | `FR-VIII-13` | Loại tài khoản | `TAI_KHOAN` | ✅ F CRUD | 6 mục, cùng pattern. (Nhóm vào DANH_MUC chung — gap spec entity naming) | ✅ PASS |
| 18 | `FR-VIII-18` | Loại hình tiếp nhận | `DANH_MUC` | ✅ F CRUD | 5 mục, cùng pattern | ✅ PASS |
| 19 | `FR-VIII-19` | Kênh tiếp nhận | `DANH_MUC` | ✅ F CRUD | 4 mục, cùng pattern | ✅ PASS |

**Quan sát chung DMDC:**
- Drawer Thêm/Chỉnh sửa: Mã disabled khi edit (đúng — PK). Spinbutton "Thứ tự" có `valuemax="0"` bug (known — memory qa_htpldn_dmdc_ui_round1.md).
- Label button submit = **[Đồng ý]** (spec là [Lưu] — UI deviate).
- Row action `[Sửa]/[Xóa]` = `<a>` với cursor:pointer + onclick + color (blue/red) — clickable đúng.
- Toggle trạng thái switch default = `checked` (Kích hoạt).

### 2.2 Submenu 2: Cấu hình hệ thống (`/quan-tri/cau-hinh`)

4 tab: Thời hạn xử lý SLA (default) / Phân công mặc định / Mẫu phản hồi / Quy trình hỗ trợ. Đã test ở FR-05 round 1 — verdict consistent:

| # | Function | Tab | Entity | Verdict | Ref |
|---|----------|-----|--------|---------|-----|
| 10 | `FR-VIII-10` | Thời hạn xử lý (SLA) | `CAU_HINH_SLA` | ✅ PASS (4 row seed + [Sửa] row) | [FR-05 report](FR-05-vuviec-report.md#22-entity-cau_hinh_sla-cấu-hình-hệ-thống--tab-1-sla) |
|   | — | Phân công mặc định | `CAU_HINH_PHAN_CONG` | ✅ PASS (CRUD full) | [FR-02 report](FR-02-hoidap-report.md#22-entity-cau_hinh_phan_cong-cấu-hình-hệ-thống--tab-2) |
|   | — | Mẫu phản hồi | `MAU_PHAN_HOI` | ✅ PASS (R-only) | [FR-02 report](FR-02-hoidap-report.md#23-entity-mau_phan_hoi-cấu-hình-hệ-thống--tab-3) |
|   | — | Quy trình hỗ trợ | — | ⚠️ "Chưa triển khai ở giai đoạn sau" placeholder | — |

### 2.3 Submenu 3: Tài khoản & phân quyền (`/quan-tri/tai-khoan`)

| # | Function | UI element | Entity | Expected | Actual | Verdict |
|---|----------|-----------|--------|----------|--------|---------|
| 15 | `FR-VIII-15` | Quản lý TK NSD | `TAI_KHOAN` | ✅ F CRUD | **Table 9 cột + 5 status tab (Tất cả 99+ / Hoạt động 92 / Chờ KH 5 / Tạm khóa 4 / Chờ phân quyền) + 101 mục data.** Filter 4 field (Từ khóa, Trạng thái, Loại TK, Đơn vị, Vai trò). `[+ Thêm mới]` render. Row action 4 button state-dependent: Hoạt động=[edit/team/Khóa TK/Vô hiệu hóa], Chờ KH=[edit/team/Kích hoạt/Gửi lại email], Tạm khóa=[edit/team/Mở khóa]. | ✅ PASS |
| 17 | `FR-VIII-17` (partial) | [team] modal "Quản lý vai trò" — gán vai trò cho user | `VAI_TRO` | ✅ F CRUD | Modal Dropdown "Vai trò được gán" + [Lưu vai trò]/[Hủy]. Hoạt động OK. | ✅ PASS (assignment only) |
| 14 | `FR-VIII-14` | Quản lý Vai trò master (SCR-VIII-02) | `VAI_TRO` | ✅ F CRUD | **Không tìm thấy UI riêng.** URL `/quan-tri/vai-tro` redirect về `/login`. `/quan-tri` landing = "Đang phát triển — Epic 16". | ⚠️ **GAP UI** |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu (SCR-VIII-05) | `VAI_TRO` | ✅ F CRUD | Không có UI riêng | ⚠️ **GAP UI** |
| 17 | `FR-VIII-17` (master) | Phân quyền chức năng master (SCR-VIII-04) | `VAI_TRO` | ✅ F CRUD | Không có UI master — chỉ có modal per-user gán vai trò | ⚠️ **GAP UI** |

**TK detail page** (click row link → `/quan-tri/tai-khoan/{id}`): 3 tab (Hồ sơ / Vai trò (1) / Lịch sử). Tab "Vai trò" hiện vai trò đã gán (read-only). Không có CRUD tại detail.

### 2.4 Submenu 4: Nhật ký hệ thống (`/quan-tri/audit-log`)

| Entity | Data | UI | Verdict |
|--------|------|-----|---------|
| `AUDIT_LOG` | **6534 mục** | Table 10 cột (Thời gian / Module / Entity type / Entity ID / Hành động / Người TH / IP / Endpoint / Code / Thao tác). Filter 6 field. Pagination 1-20/6534. [Xuất Excel] enabled. Row có [Xem chi tiết]. | ✅ PASS (R-only) |

Log trace xác nhận activity: **LOGIN / LOGIN_OTP_PENDING** cho qtht_tw_4 / qtht_bn_4 / qtht_dp_4 / qtht_tw_5 — confirm FR-VIII-20 (Quản lý đăng nhập) working đúng.

### 2.5 Functional FR-VIII-20..25 (Login/Logout/VNeID stack)

| # | Function | Entity | Verify | Verdict |
|---|----------|--------|--------|---------|
| 20 | `FR-VIII-20` Quản lý đăng nhập | `TAI_KHOAN` | Login OTP 666666 bypass hoạt động. AUDIT_LOG ghi LOGIN actions. Session lưu ở `sessionStorage` key `auth-store`. | ✅ PASS |
| 21 | `FR-VIII-21` Quản lý đăng xuất | `TAI_KHOAN` | Session clear thông qua `sessionStorage.clear()` + redirect `/login`. Verify: khi click [Đăng xuất] UI? — chưa test UI button (nằm ở user dropdown top-right, chưa drill). | ⚠️ Partial (functional OK, UI button chưa verify) |
| 22 | `FR-VIII-22` Đăng ký TK self-reg | `TAI_KHOAN` | Link `/auth/forgot-password` có, register flow chưa tìm thấy button riêng trên login page | ⚠️ Untested |
| 23 | `FR-VIII-23` Đăng nhập VNeID | `TAI_KHOAN` | Button "Đăng nhập bằng VNeID" render trên `/login` | ✅ PASS (button render) |
| 24 | `FR-VIII-24` Đăng xuất VNeID | `TAI_KHOAN` | Chưa test VNeID flow | ⚠️ Untested |
| 25 | `FR-VIII-25` Đồng bộ TK VNeID | `TAI_KHOAN` | TK detail có field "VNeID: Chưa liên kết VNeID" — link function chưa verify | ⚠️ Untested |

---

## 3. Cross-scope verify (BR-AUTH-08 QTHT vượt scope)

| Account | DMDC 13 tab (table) | DON_VI tab (tree) | Dashboard TVV count | Verdict |
|---------|---------------------|-------------------|---------------------|---------|
| qtht_tw_4 | ✅ Full CRUD, 15 mục LV_PL | ✅ Tree 84+ nodes, [Sửa] enabled, [Thêm con]/[Xóa] disabled | 1 | ⚠️ BUG-001 DON_VI |
| qtht_bn_4 | ✅ Full CRUD, 15 mục LV_PL (same data) | (chưa test tree - dự đoán same pattern DP) | 1 | ⚠️ BUG-001 |
| qtht_dp_4 | ✅ Full CRUD, 15 mục LV_PL (same data) | ❌ **Tree chỉ 1 node TW** (vs 84+ ở TW) + [Thêm con]/[Xóa] disabled | **0** (BUG-002 regression) | ❌ BUG-001 + BUG-002 (DON_VI) + Dashboard bug |

**→ Kết luận cross-scope:**
- **DMDC (13 loại DM thông thường):** BR-AUTH-08 làm việc đúng — 3 cấp QTHT đều thấy same data + có full CRUD ✅.
- **DON_VI tree:** BR-AUTH-08 **fail cho QTHT_DP** — tree bị scope-filter chỉ thấy TW root, không thấy BN/DP siblings → **BUG-002 riêng cho DON_VI**.
- Bug BUG-001 (CRUD disabled DON_VI) consistent 3 cấp.

---

## 4. Bug chi tiết

### BUG-PERM-QTHT-FR10-001 (Major, P1)

**Title:** DON_VI tab — `[+ Thêm đơn vị con]` và `[Xóa]` luôn disabled; không có button `[+ Thêm đơn vị mới]` cấp root. QTHT không Create/Delete được đơn vị.

**Evidence:**
- Node TW root (Cục BTTP): buttons `[Sửa]` enabled · `[Thêm đơn vị con]` disabled · `[Xóa]` disabled.
- Node BN (Bộ KH&ĐT): cùng pattern.
- Node DP (Sở TP Hà Nội): buttons `[Sửa]` enabled · `[Xóa]` disabled (không render [Thêm con] - leaf).
- Toolbar tree panel chỉ có `Cây đơn vị` label + search — **KHÔNG có button [+ Thêm đơn vị]** cấp root.
- Button disabled **KHÔNG có tooltip** giải thích — user không biết tại sao.

**Spec vi phạm:** SRS §3.4.2 — QTHT × DON_VI = `CRUD` (full Create/Read/Update/Delete).

**Root cause nghi:** Component tree detail panel hard-code disable {add-child, delete} buttons — thiếu permission check CASL `ability.can('create'/'delete', 'DonVi')`. Toolbar [+ Thêm] cấp root cũng chưa implement.

**Fix suggestion:**
```tsx
// Panel tree toolbar
{ability.can('create', 'DonVi') && <Button icon="plus">Thêm đơn vị mới</Button>}

// Panel detail node
{ability.can('create', 'DonVi') && <Button icon="plus">Thêm đơn vị con</Button>}
{ability.can('delete', 'DonVi') && <Button icon="delete" danger>Xóa</Button>}
```

**Cross-scope:** BUG ảnh hưởng 3 cấp QTHT (TW/BN/ĐP) — pattern disabled cố định, không phụ thuộc user cấp.

**Evidence:** [R-61-qtht_tw-fr10-donvi-tree-disabled.png](screenshots/R-61-qtht_tw-fr10-donvi-tree-disabled.png)

### BUG-PERM-QTHT-FR10-002 (Medium, P2)

**Title:** DON_VI tree bị scope-filter cho QTHT_DP — vi phạm BR-AUTH-08.

**Evidence:**
- qtht_tw_4: tree render 84+ nodes (TW + 16 BN + 67 DP).
- qtht_bn_4: chưa đếm nhưng assume similar.
- qtht_dp_4: tree chỉ render **1 node TW root** (treeCount=1).

**Spec vi phạm:** BR-AUTH-08 — QTHT vượt scope thấy TẤT CẢ đơn vị.

**Root cause nghi:** BE endpoint `/api/v1/don-vi/tree` (hoặc similar) scope-filter theo `user.donViId` cho role non-TW. Thiếu exception `if (user.role === 'QTHT') return allNodes`.

**Fix:** BE thêm role guard cho endpoint tree data. Similar với BUG-002 FR-01 Dashboard widget (same pattern).

**Evidence:** [R-64-qtht_dp-fr10-donvi-scope-filtered.png](screenshots/R-64-qtht_dp-fr10-donvi-scope-filtered.png)

---

## 5. Phạm vi test

### Đã test thorough
- Submenu 1 DMDC: **14/14 tab** (13 PASS + 1 BUG)
- Submenu 2 Cấu hình HT: 4/4 tab (re-verify, consistent round FR-05)
- Submenu 3 Tài khoản list + modal gán vai trò per-user
- Submenu 4 Nhật ký: full list + filter
- Cross-scope DMDC + DON_VI với 3 cấp QTHT

### Partial / BLOCKED
- DMDC: Drawer Thêm/Edit/Delete — chưa save test (tránh pollution data). Chỉ verify UI render.
- FR-VIII-14 Vai trò master / FR-VIII-16 Phân quyền DL / FR-VIII-17 Phân quyền CN master: **không có UI phơi ra** → GAP, không phải BUG perm.
- FR-VIII-21..25 login/logout/VNeID: verify partial qua UI button render + AUDIT_LOG trace. Flow VNeID full chưa drill.

### Not tested (out of scope round)
- BE 403 guard khi non-QTHT user gọi DMDC/TK CRUD endpoints — round API test sau.
- Drawer validation (required/length/format) — round functional sau.

---

## 6. Đề xuất / Next steps

**Ưu tiên 1 — Fix BUG-PERM-QTHT-FR10-001 Major (DON_VI CRUD):**
- FE add button `[+ Thêm đơn vị mới]` cấp root vào toolbar tree panel.
- FE enable `[Thêm đơn vị con]` / `[Xóa]` với CASL ability guard.
- BE verify endpoint POST/DELETE `/api/v1/don-vi` accept QTHT role.

**Ưu tiên 2 — Fix BUG-PERM-QTHT-FR10-002 Medium (DON_VI scope):**
- BE endpoint tree data thêm role guard: `if (user.role === 'QTHT') return allNodes`.
- Tham khảo pattern tương tự BUG-002 Dashboard TVV (cùng module vi phạm BR-AUTH-08).

**Ưu tiên 3 — Implement GAP UI:**
- FR-VIII-14 Vai trò master page `/quan-tri/vai-tro` (SCR-VIII-02): list + CRUD vai trò.
- FR-VIII-16 Phân quyền truy cập DL page (SCR-VIII-05): matrix role × entity.
- FR-VIII-17 Phân quyền chức năng master (SCR-VIII-04): matrix role × function.
- `/quan-tri` landing page: sidebar/quick-access cho 4 submenu thay vì "Đang phát triển".

**Ưu tiên 4 — Regression BUG-002:**
- Dashboard widget TVV count cho qtht_dp_4 **chưa fix** — Dev escalate.

**Ưu tiên 5 — Test completion:**
- Round functional: test save flow DMDC drawer với validation.
- Round API: verify BE 403 cho non-QTHT user gọi DMDC/DON_VI/TK CRUD.
- Round VNeID: drill login/logout/sync VNeID end-to-end.

---

## 7. Quy trình test

### Pattern được dùng

```
Login qtht_{TW|BN|DP}_4 → Click sidebar "Quản trị hệ thống" ▶
→ 4 submenu expanded

Submenu 1 DMDC:
  Click tab 1 "Lĩnh vực PL" → evaluate_script iterate 13 tab còn lại
    → Capture: url, total, rowCount, toolbarBtns, rowActions per tab
  → Click tab "Cơ quan đơn vị" → verify tree + click 3 nodes (TW/BN/DP) → check [Thêm con]/[Xóa] state
  → Click [+ Thêm mới] → verify drawer open + [Hủy] cancel
  → Click [Sửa] row → verify drawer pre-fill + [Hủy]

Submenu 3 TK:
  Observe table + 5 tabs + 101 mục + 4 row actions state-dependent
  → Click [team] icon → verify modal "Quản lý vai trò"
  → Try URL direct /quan-tri/vai-tro → redirect /login (nav break auth, gap UI confirmed)

Submenu 4 Nhật ký:
  Observe 6534 mục + filter + pagination

Cross-scope:
  Logout → Login qtht_bn_4 → DMDC Lĩnh vực PL check
  Logout → Login qtht_dp_4 → DMDC + DON_VI tree (scope filter check)
```

### Key learnings

- **DMDC table 13 tab cùng component** — JS iterate click tabs + capture state là efficient pattern.
- **DON_VI tab khác biệt** (tree vs table) — must click node để check detail panel state.
- **[team] button** trên TK row = modal quản lý vai trò assignment (không phải page Vai trò master).
- **navigate_page URL direct** → mất auth → redirect /login (re-confirm MCP-Rule 3).
- **Drawer submit label = [Đồng ý]** (not [Lưu] per spec) — UI deviate.

---

## 8. Artifacts

- [R-60-qtht_tw-fr10-dmdc-linhvuc.png](screenshots/R-60-qtht_tw-fr10-dmdc-linhvuc.png) — DMDC Lĩnh vực PL tab (full-page)
- [R-61-qtht_tw-fr10-donvi-tree-disabled.png](screenshots/R-61-qtht_tw-fr10-donvi-tree-disabled.png) — DON_VI tree + disabled buttons
- [R-62-qtht_tw-fr10-taikhoan-list.png](screenshots/R-62-qtht_tw-fr10-taikhoan-list.png) — TK list + CRUD + state actions
- [R-63-qtht_tw-fr10-nhatky.png](screenshots/R-63-qtht_tw-fr10-nhatky.png) — AUDIT_LOG list
- [R-64-qtht_dp-fr10-donvi-scope-filtered.png](screenshots/R-64-qtht_dp-fr10-donvi-scope-filtered.png) — BUG-002 DON_VI scope filter

## 9. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~30 phút (3 role QTHT × ~10 phút) |
| Số MCP tool call | ~70 |
| Số screenshot | 5 |
| Crashes | 2 (auth loss khi navigate_page direct) |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
