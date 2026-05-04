# Functional Test Report — Ma trận phân quyền Mục 4 (Nhóm Vụ việc HTPL)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ (MailHog OTP: http://103.172.236.130:8025) |
| **Người test** | QA Automation via Claude Code (Opus 4.7) |
| **Ngày** | 13:15 — 2026-04-19 |
| **Loại test** | Permission Matrix (Authorization) |
| **Round** | round2_2026-04-16 |
| **Tham chiếu** | [permission-matrix.md §4](../../../permission-matrix.md) · [test-strategy.md §1.2, §5, §9](../../../test-strategy.md) · [funtion/7.5-vu-viec-htpl.md](../../../funtion/7.5-vu-viec-htpl.md) · [round2 vu-viec](../../vu-viec/bug-report-vu-viec.md) |
| **Phương pháp** | Browse UI (gstack `/browse`), KHÔNG test API (theo yêu cầu user) |

---

## 1. Phạm vi test

**Module 4 — Nhóm Vụ việc HTPL** (3 entity × 11 role = 33 ô quyền):

| # | Entity | Route CMS đã phát hiện | QTHT | CB_NV | CB_PD | DN | NHT | TVV | CG |
|---|--------|------------------------|------|-------|-------|----|----|-----|-----|
| 1 | VU_VIEC | `/vu-viec/danh-sach` | 👁️ R | ✅ CRUD* | 📝 RU* | 👁️ R* | 📝 RU* | ❌ | ❌ |
| 2 | HO_SO_VU_VIEC | (tab "Hồ sơ" trong detail `/vu-viec/{id}`) | 👁️ R | ✅ CRUD* | 👁️ R* | 🔌 C†R* | ✅ CRU* | ❌ | ❌ |
| 3 | KET_QUA_VU_VIEC | (tab "Kết quả" trong detail — chỉ render khi state `Đang xử lý`/`Hoàn thành`) | 👁️ R | ✅ CRU* | 📝 RU* | 👁️ R* | ✅ CRU* | ❌ | ❌ |

### Roles đã test

| # | Account | Role SRS | Đơn vị | Cấp | Expected landing | Actual landing | Đăng nhập thành công? |
|---|---------|----------|--------|-----|------------------|----------------|------------------------|
| 1 | qtht_tw | QTHT | Cục BTTP | TW | /dashboard | /dashboard | ✅ |
| 2 | admin | QTHT | Cục BTTP | TW | /dashboard | /dashboard (1 lần) → crash lặp lại sau | ⚠️ Browser Playwright crash sau OTP — dùng qtht_tw thay thế |
| 3 | canbo_tw | CB_NV | Cục BTTP | TW | /dashboard | /403 | ⚠️ (logged in, dashboard blocked — BUG-PERM-M1-003 section 1) |
| 4 | canbo_bn | CB_NV | Bộ KH&ĐT | BN | /dashboard | /403 | ⚠️ |
| 5 | canbo_tinh | CB_NV | Sở TP HN | DP | /dashboard | /403 | ⚠️ |
| 6 | lanhdao_tw | CB_PD | Cục BTTP | TW | /dashboard | /403 | ⚠️ |
| 7 | lanhdao_bn | CB_PD | Bộ KH&ĐT | BN | /dashboard | /403 | ⚠️ |
| 8 | lanhdao_dp | CB_PD | Sở TP HN | DP | /dashboard | /403 | ⚠️ |
| 9 | dn_user | DN | — | Portal | Chặn khỏi CMS (DI-09) | /403, menu CMS hiển thị | ❌ (vi phạm DI-09 — xem BUG-PERM-M1-001 section 1) |
| 10 | nht_user | NHT | — | Portal | Portal view | /dashboard | ✅ (vào được dashboard) |
| 11 | tvv_user | TVV | — | Portal | Portal view / chặn VU_VIEC | /dashboard | ✅ (vào được dashboard, cũng thấy VU_VIEC — **BUG-PERM-M4-004**) |
| 12 | chuyengia_user | CG | — | Portal | Portal view, chặn VU_VIEC | /403, menu VU_VIEC grayed | ✅ |

---

## 2. Kết quả đo được

### 2.1 QTHT (qtht_tw) — Negative Read-only verification

**Spec matrix §4:** QTHT × cả 3 entity Vụ việc = **👁️ R** (chỉ xem, không tạo/sửa/xóa theo §9.2).

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Click menu "Quản lý vụ việc hỗ trợ pháp lý" | Navigate đến `/vu-viec/danh-sach`, list read-only | URL: `/vu-viec/danh-sach`, list 16 records | ✅ menu + list |
| Button "+ Nhập thủ công" (Create) | KHÔNG có | **CÓ** ❌ | ❌ **FAIL → BUG-PERM-M4-001** |
| Button "Xuất Excel" | KHÔNG có | **CÓ** ❌ | ❌ **FAIL → BUG-PERM-M4-001** |
| Icon trash (Delete) trong cột Hành động | KHÔNG có | **CÓ** ❌ | ❌ **FAIL → BUG-PERM-M4-001** |
| Icon eye (View) | CÓ | CÓ | ✅ |
| Bằng chứng QTHT đã tạo được VV | (không có) | **Record `VV-BTP-TW-20260418-011` title "QTHT trying create", field `Người tiếp nhận = "QT Hệ thống TW"`** | ❌ BUG-PERM-M4-001 |

**Evidence:**
- [12-qtht_tw-vv.png](screenshots/12-qtht_tw-vv.png) — QTHT list có 3 nút CRUD + export
- [20-canbo_tw-vv-detail.png](screenshots/20-canbo_tw-vv-detail.png) — detail "QTHT trying create" confirm escalation

### 2.2 CB_NV TW (canbo_tw) — Positive CRUD* scope toàn quốc

**Spec matrix §4:** CB_NV_TW × VU_VIEC = ✅ **CRUD\*** (toàn quốc, cấp TW thấy cả TW+BN+ĐP).

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Nav `/vu-viec/danh-sach` | OK, list full | OK, 16 records | ✅ |
| Button "+ Nhập thủ công" | CÓ | CÓ | ✅ |
| Button "Xuất Excel" | CÓ | CÓ | ✅ |
| Icon eye / trash trên row | CÓ cả 2 | CÓ cả 2 | ✅ |
| Scope data | Thấy tất cả TW+BN+ĐP | 16/16 bản ghi `VV-BTP-TW-*` (TW scope) | ✅ PASS (nhưng không có data BN/ĐP để verify cross-scope) |
| Drill detail — tab "Thông tin" | Hiển thị thông tin + cho phép Sửa | Hiển thị đầy đủ thông tin VV | ✅ |
| Drill detail — tabs visible | `Thông tin | Hồ sơ | Phân công | Lịch sử` | 4 tabs đúng | ✅ (tab Kết quả sẽ xuất hiện khi VV ở state DANG_XU_LY — chưa có data để verify) |

**Evidence:** [02-canbo_tw-vv-list.png](screenshots/02-canbo_tw-vv-list.png) · [20-canbo_tw-vv-detail.png](screenshots/20-canbo_tw-vv-detail.png)

### 2.3 CB_NV BN / DP (canbo_bn, canbo_tinh) — Data isolation fail

**Spec matrix §4:** CB_NV_BN/DP × VU_VIEC = ✅ **CRUD\*** (scoped: chỉ thấy VV đơn vị mình). Theo DI-02/DI-03/DI-04/DI-05 + §9 permission-matrix.

| Account | Đơn vị SRS | Expected scope | Actual scope | Kết luận |
|---------|------------|----------------|--------------|----------|
| canbo_bn | Bộ KH&ĐT (BN) | Chỉ VV của Bộ KH&ĐT | **16 records `VV-BTP-TW-*` (thuộc Cục BTTP TW) ❌** | ❌ **FAIL → BUG-PERM-M4-002** |
| canbo_tinh | Sở TP HN (DP) | Chỉ VV của Sở TP HN | **16 records `VV-BTP-TW-*` ❌** | ❌ **FAIL → BUG-PERM-M4-002** |

Ghi chú: cả 2 role vẫn có UI nút CRUD + Export đầy đủ (khớp CRUD*) — không có bug về UI buttons, chỉ bug về data filter BE.

**Evidence:** [03-canbo_bn-vv-list.png](screenshots/03-canbo_bn-vv-list.png) · [04-canbo_tinh-vv-list.png](screenshots/04-canbo_tinh-vv-list.png)

### 2.4 CB_PD TW (lanhdao_tw) — Positive RU* view-only

**Spec matrix §4:** CB_PD × VU_VIEC = **📝 RU\*** (read + update/phê duyệt, không create/delete, scoped).

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Nav `/vu-viec/danh-sach` | OK | OK, 16 records TW | ✅ |
| Button "+ Nhập thủ công" | KHÔNG | KHÔNG | ✅ |
| Button "Xuất Excel" | (không specified — có/không đều PASS) | KHÔNG | ✅ |
| Icon trash (Delete) | KHÔNG | KHÔNG | ✅ |
| Icon eye (View) | CÓ | CÓ | ✅ |
| Scope TW | Thấy tất cả | 16 TW records — consistent | ✅ |

**Evidence:** [05-lanhdao_tw-vv-list.png](screenshots/05-lanhdao_tw-vv-list.png)

### 2.5 CB_PD BN / DP (lanhdao_bn, lanhdao_dp) — Data isolation fail (tương tự §2.3)

**Spec matrix §4:** CB_PD_BN/DP × VU_VIEC = **📝 RU\*** scoped đơn vị.

| Account | Đơn vị SRS | Buttons UI | Scope data | Kết luận |
|---------|------------|------------|------------|----------|
| lanhdao_bn | Bộ KH&ĐT (BN) | View-only ✅ | **16 records TW thay vì BN** | ❌ **FAIL → BUG-PERM-M4-002** |
| lanhdao_dp | Sở TP HN (DP) | View-only ✅ | **16 records TW thay vì DP** | ❌ **FAIL → BUG-PERM-M4-002** |

**Evidence:** [06-lanhdao_bn-vv-list.png](screenshots/06-lanhdao_bn-vv-list.png) · [07-lanhdao_dp-vv-list.png](screenshots/07-lanhdao_dp-vv-list.png)

### 2.6 DN (dn_user) — Ambiguous matrix vs DI-09

**Spec matrix §4:** DN × VU_VIEC = **👁️ R\*** (CMS read scoped). Nhưng §9.1 note + DI-09 nói "DN không truy cập CMS UI, chỉ qua API".

| Hành động | Expected matrix | Expected DI-09 | Actual | Kết luận |
|-----------|-----------------|----------------|--------|----------|
| Menu "Quản lý vụ việc hỗ trợ pháp lý" | Active (R\*) | Grayed | **Grayed** | ⚠️ **Khớp DI-09, mâu thuẫn matrix → BUG-PERM-M4-005** (spec clarification) |
| Click menu | Navigate vào list scoped | → /403 | → /403 | Khớp DI-09 |

**Ghi chú:** Bug riêng về DN login được CMS đã báo section 1 (BUG-PERM-M1-001 — vi phạm DI-09). Ở section 4, nếu chọn "matrix đúng" thì DN phải vào được VU_VIEC list → đang FAIL; nếu chọn "DI-09 đúng" thì chặn DN đúng → PASS. Cần SRS clarify.

**Evidence:** [08-dn_user-vv-try.png](screenshots/08-dn_user-vv-try.png)

### 2.7 NHT (nht_user) — Row-level filter fail

**Spec matrix §4:** NHT × VU_VIEC = **📝 RU\*** (chỉ VV được phân công cho mình — BR-AUTH-10 + DI-06).

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Menu "Quản lý vụ việc" | Active | Active | ✅ |
| Nav `/vu-viec/danh-sach` | OK | OK | ✅ |
| Button Create/Delete | KHÔNG | KHÔNG | ✅ |
| Icon eye | CÓ | CÓ | ✅ |
| Scope data | Chỉ VV có `nguoi_ho_tro_id == nht_user_id` | **16/16 VV hiện đầy đủ**, cột NHT/TVV hầu hết trống (—) | ❌ **FAIL → BUG-PERM-M4-003** |

**Evidence:** [09-nht_user-vv.png](screenshots/09-nht_user-vv.png)

### 2.8 TVV (tvv_user) — Authz leak

**Spec matrix §4:** TVV × VU_VIEC = **❌** (note §4: "TVV KHÔNG có quyền trên cả 3 entity Vụ việc"; note §9.4: "TVV chỉ tương tác qua HO_SO_VU_VIEC và KET_QUA_VU_VIEC" — nhưng matrix §4 của 2 entity này TVV cũng = ❌).

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Menu "Quản lý vụ việc" | Grayed (giống CG) | **Active** ❌ | ❌ **FAIL → BUG-PERM-M4-004** |
| Click menu | → /403 | Navigate đến `/vu-viec/danh-sach` | ❌ |
| List VV | (không load được) | **16 records hiển thị với icon eye** | ❌ authz leak |

**Evidence:** [10-tvv_user-vv-try.png](screenshots/10-tvv_user-vv-try.png)

### 2.9 CG (chuyengia_user) — PASS (baseline ❌)

**Spec matrix §4:** CG × VU_VIEC = **❌**.

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Menu "Quản lý vụ việc" | Grayed out | Grayed out | ✅ |
| Click menu | → /403 | → /403 | ✅ |

**Evidence:** [11-chuyengia-vv-try.png](screenshots/11-chuyengia-vv-try.png)

### 2.10 HO_SO_VU_VIEC — 10/11 ô BLOCKED (chưa drill được tab)

**Lý do BLOCKED:**
1. **Rule 8 session reset** (CLAUDE.md) — login + drill + tab click không thực hiện được trong 2 bash invocation riêng (chain 2 bị redirect /login do AuthGuard).
2. **Chain timeout** khi dồn tất cả vào 1 atomic chain >13 step.
3. **Selector tab "Hồ sơ" ambiguous** — `text=Hồ sơ` match nhầm với sidebar "Hồ sơ pháp lý" module khác → navigation rẽ sang `/bieu-mau/thu-muc`.

**1 ô INFERRED PASS:** CG × HO_SO_VU_VIEC → menu VU_VIEC grayed + /403, không drill được detail → consistent với spec ❌.

| Role | Expected | Status | Inference |
|------|----------|--------|-----------|
| QTHT | 👁️ R | ⏸ BLOCKED | — |
| CB_NV_TW/BN/DP | ✅ CRUD* | ⏸ BLOCKED | — |
| CB_PD_TW/BN/DP | 👁️ R* | ⏸ BLOCKED | — |
| DN | 🔌 C†R* | ⚠ inferred | UI chặn DN toàn bộ, C† qua API (ngoài scope UI test) |
| NHT | ✅ CRU* | ⏸ BLOCKED | Suspected leak (đã leak VU_VIEC list) |
| TVV | ❌ | ⏸ BLOCKED | Suspected leak (đã leak VU_VIEC list) |
| CG | ❌ | ✅ INFERRED PASS | Menu grayed + /403 |

### 2.11 KET_QUA_VU_VIEC — 10/11 ô BLOCKED (data không đủ state)

**Lý do BLOCKED:**
1. Tab "Kết quả" chỉ render khi VV ở state `Đang xử lý`/`Hoàn thành`/`Chờ phê duyệt`. 16 VV seed hiện ở state `Đã tiếp nhận`/`Đã phân công`/`Yêu cầu bổ sung`/`Từ chối` → tab Kết quả không render.
2. **Chặn bởi BUG-VV-006 + BUG-VV-009** từ round 2026-04-18 (workflow stuck DA_PHAN_CONG, thiếu endpoint setter `ketQuaXuLy`) — không đẩy được VV đến `DANG_XU_LY` → không có state có tab Kết quả để verify.

| Role | Expected | Status | Inference |
|------|----------|--------|-----------|
| QTHT | 👁️ R | ⏸ BLOCKED | Cần fix BUG-VV-006/009 + seed data |
| CB_NV_TW/BN/DP | ✅ CRU* | ⏸ BLOCKED | — |
| CB_PD_TW/BN/DP | 📝 RU* | ⏸ BLOCKED | — |
| DN | 👁️ R* | ⏸ BLOCKED | — |
| NHT | ✅ CRU* | ⏸ BLOCKED | — |
| TVV | ❌ | ⏸ BLOCKED | — |
| CG | ❌ | ✅ INFERRED PASS | Menu grayed — không drill được |

---

## 3. Tổng hợp coverage ma trận

| Cell | Role | Entity | Expected | Tested? | Result |
|------|------|--------|----------|---------|--------|
| 1-1 | QTHT | VU_VIEC | 👁️ R | ✅ | **FAIL** (có Create + Export + Delete → BUG-PERM-M4-001) |
| 1-2 | CB_NV_TW | VU_VIEC | ✅ CRUD* | ✅ | PASS (full buttons, scope TW đúng) |
| 1-3 | CB_NV_BN | VU_VIEC | ✅ CRUD* scoped BN | ✅ | **FAIL** (scope BN không enforce → BUG-PERM-M4-002) |
| 1-4 | CB_NV_DP | VU_VIEC | ✅ CRUD* scoped DP | ✅ | **FAIL** (scope DP không enforce → BUG-PERM-M4-002) |
| 1-5 | CB_PD_TW | VU_VIEC | 📝 RU* | ✅ | PASS (view-only icon, không Create/Delete) |
| 1-6 | CB_PD_BN | VU_VIEC | 📝 RU* scoped BN | ✅ | **FAIL** (scope fail → BUG-PERM-M4-002) |
| 1-7 | CB_PD_DP | VU_VIEC | 📝 RU* scoped DP | ✅ | **FAIL** (scope fail → BUG-PERM-M4-002) |
| 1-8 | DN | VU_VIEC | 👁️ R* | ✅ | ⚠ AMBIGUOUS (matrix vs DI-09 → BUG-PERM-M4-005) |
| 1-9 | NHT | VU_VIEC | 📝 RU* assigned-only | ✅ | **FAIL** (thấy tất cả 16 VV → BUG-PERM-M4-003) |
| 1-10 | TVV | VU_VIEC | ❌ | ✅ | **FAIL** (authz leak, thấy list → BUG-PERM-M4-004) |
| 1-11 | CG | VU_VIEC | ❌ | ✅ | PASS (menu grayed + /403) |
| 2-1 → 2-11 | all | HO_SO_VU_VIEC | (per matrix) | ⏸ | 10 BLOCKED + 1 INFERRED PASS (CG) |
| 3-1 → 3-11 | all | KET_QUA_VU_VIEC | (per matrix) | ⏸ | 10 BLOCKED + 1 INFERRED PASS (CG) |

**Coverage đạt:**
- VU_VIEC: 11/11 ô tested — 3 PASS / 7 FAIL / 1 AMBIGUOUS
- HO_SO_VU_VIEC: 1/11 inferred PASS, 10 BLOCKED
- KET_QUA_VU_VIEC: 1/11 inferred PASS, 10 BLOCKED
- **Tổng:** 5 PASS / 7 FAIL / 1 AMBIGUOUS / 20 BLOCKED = 13/33 đã kết luận (~39%)

**Blockers ngăn mở rộng coverage:**
1. **Browse harness session reset + atomic chain timeout** — không drill vào tab "Hồ sơ" được (ảnh hưởng 10 ô HO_SO_VU_VIEC).
2. **Selector tab ambiguous** — `text=Hồ sơ` match nhầm sidebar "Hồ sơ pháp lý" module khác.
3. **BUG-VV-006 + BUG-VV-009** (workflow stuck từ round trước, chưa fix) — không đẩy được VV đến state `DANG_XU_LY` → tab Kết quả không render (ảnh hưởng 10 ô KET_QUA_VU_VIEC).
4. **Thiếu seed data cross-scope** — không có VV nào thuộc Bộ KH&ĐT (BN) hay Sở TP HN (DP), chỉ có 16 VV của Cục BTTP (TW) → không verify được CB_NV_TW có thấy data ngang cấp BN/ĐP không (positive cross-scope).

---

## 4. Tổng hợp bug

Xem chi tiết: [bug-report-section-4.md](bug-report-section-4.md)

| ID | Severity | Role × Entity | Tiêu đề | Link bug gốc |
|----|----------|---------------|---------|--------------|
| BUG-PERM-M4-001 | **Critical** | QTHT × VU_VIEC | QTHT có nút "+ Nhập thủ công" + "Xuất Excel" + icon Xóa trên VU_VIEC list | [BUG-VV-014](../../vu-viec/bug-report-vu-viec.md) (tái xuất hiện) |
| BUG-PERM-M4-002 | **Critical** | CB_NV_BN/DP + CB_PD_BN/DP × VU_VIEC | Scope BN/ĐP không enforce — 4 role đều thấy 16 records TW | Pattern BUG-PM3-R2-002 |
| BUG-PERM-M4-003 | **Critical** | NHT × VU_VIEC | NHT thấy tất cả 16 VV thay vì chỉ VV được phân công (vi phạm BR-AUTH-10) | [BUG-VV-004](../../vu-viec/bug-report-vu-viec.md) (tái xuất hiện) |
| BUG-PERM-M4-004 | **Critical** | TVV × VU_VIEC | TVV thấy danh sách VU_VIEC — authz leak, matrix = ❌ | [BUG-VV-015](../../vu-viec/bug-report-vu-viec.md) (tái xuất hiện) |
| BUG-PERM-M4-005 | Major | DN × VU_VIEC | Matrix §4 ghi 👁️ R* nhưng UI enforce DI-09 (chặn CMS) — mâu thuẫn spec | — (cần SRS clarify) |

---

## 5. Pass Criteria đối chiếu §10.1

| # | Tiêu chí | Target | Actual | Kết luận |
|---|---------|--------|--------|----------|
| 4 | Phân quyền 3 cấp hoạt động đúng | 100% authorization tests pass | 5/13 tested cells PASS (~38%) | ❌ FAIL |
| 3 | Không có bug Blocker/Critical | 0 open | **4 Critical** (BUG-PERM-M4-001 → 004), tất cả **tái xuất hiện** từ round 2026-04-18 | ❌ FAIL |
| — | Data isolation (DI-02 → DI-06) | 100% PASS | 0/5 PASS (BUG-PERM-M4-002 chặn DI-02/03/04/05; BUG-PERM-M4-003 chặn DI-06) | ❌ FAIL |

**Kết luận đợt test Section 4:** ❌ **FAIL** — Section 4 **KHÔNG đủ điều kiện** đóng gate authorization cho module Vụ việc HTPL. Cần fix 4 P0 Critical + seed cross-scope data + fix workflow stuck (BUG-VV-006/009 round trước) rồi re-run.

---

## 6. Rủi ro & giới hạn của đợt test

1. **Browse daemon (Playwright) crash khi login `admin`** — account admin gây lặp lại "Target page, context or browser has been closed" sau bước nhập OTP trong cả atomic chain lẫn split chain. Workaround: dùng `qtht_tw` (cùng role QTHT, cấp TW, cùng đơn vị Cục BTTP) để verify ô QTHT × VU_VIEC. Cần re-run admin trong session browser khác.

2. **Atomic chain timeout với >13 step** — chain dồn login + drill detail + click tab Hồ sơ liên tục vượt timeout mặc định → BLOCKED 10/11 ô HO_SO_VU_VIEC. Khuyến nghị browse CLI hỗ trợ `--timeout` flag hoặc `state save/load` ổn định.

3. **Rule 8 session reset giữa 2 bash invocations** — `$B cookies > file` rồi `$B cookie-import file` vẫn bị AuthGuard redirect /login ở chain thứ 2 → không thể split login vs drill thành 2 chain.

4. **Seed data thiếu** — 16 VV đều thuộc Cục BTTP (TW), không có VV nào của BN/DP → không thể verify cross-scope positive (CB_NV_TW có thấy data BN/DP không).

5. **Workflow stuck tồn đọng** (BUG-VV-003/006/009 từ round trước) — không có VV ở state `DANG_XU_LY`/`HOAN_THANH` → tab "Kết quả" không render → 10/11 ô KET_QUA_VU_VIEC BLOCKED.

6. **Matrix ambiguity DN × VU_VIEC** — matrix §4 ghi 👁️ R* nhưng §9.1/DI-09 chặn CMS. Không rõ matrix hay DI-09 đúng → tạm mark AMBIGUOUS. Cần SRS clarify trước round tiếp theo.

---

## 7. Khuyến nghị

1. **Fix 4 Critical bug theo priority P0** (BUG-PERM-M4-001 → 004) — tất cả đã tồn tại từ round 2026-04-18 chưa fix:
   - BUG-PERM-M4-001: Ẩn nút Create + Export + Delete cho QTHT trên VU_VIEC list.
   - BUG-PERM-M4-002: Enforce scope filter BN/DP trong `GET /api/v1/vu-viecs` theo `don_vi_id` của user.
   - BUG-PERM-M4-003: Bổ sung filter `nguoi_ho_tro_id = current_user_id` khi role = NHT.
   - BUG-PERM-M4-004: Thêm role guard `TVV` = 403 cho route `/vu-viec/**`.

2. **Matrix clarification (BUG-PERM-M4-005)** — SRS chọn rõ:
   - **Option A:** `DN × VU_VIEC = 🔌 R†*` (API-only, khớp DI-09). Hoặc
   - **Option B:** Giữ 👁️ R* và mở Portal DN cho đọc VV của mình.

3. **Seed data cross-scope** — tạo ít nhất 3 VV cho mỗi cấp (TW / BN / DP) với DN khác nhau → verify được DI-01 → DI-05.

4. **Fix workflow stuck** (BUG-VV-006/009) để unlock verify 10 ô KET_QUA_VU_VIEC.

5. **Re-run section 4 sau fix** — đặc biệt 20 ô BLOCKED + 5 FAIL/AMBIGUOUS.

6. **Browse harness improvement** — tăng timeout atomic chain, hoặc cải tiến `state save/load` cho re-use session giữa chain để split phức tạp workflow.

---

*Report generated: 2026-04-19 13:15 | QA Automation via Claude Code (Opus 4.7)*
