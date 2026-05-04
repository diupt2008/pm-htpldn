# Functional Test Report — Ma trận phân quyền Mục 2 (Nhóm Hỏi đáp Pháp lý)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Module** | Quản lý Hỏi đáp Pháp lý (Module 2) |
| **SRS Reference** | srs-fr-02-hoi-dap.md — UC 10-19, 13 FR |
| **Môi trường** | http://103.172.236.130:3000/ (MailHog OTP: http://103.172.236.130:8025) |
| **Người test** | QA Automation via Claude Code |
| **Ngày** | 12:15 — 12:35 (UTC+7), 2026-04-18 |
| **Loại test** | Permission Matrix (Authorization) |
| **Round** | Round 2 |
| **Primary Accounts** | admin, qtht_tw, canbo_tw, canbo_bn, canbo_tinh, lanhdao_tw/bn/dp, dn_user, nht_user, tvv_user, chuyengia_user |
| **Test Method** | Browse UI (gstack `/browse`), KHÔNG test API |
| **Tham chiếu** | [permission-matrix.md §2](../../../../permission-matrix.md) · [test-strategy.md §1.2, §5, §9.1](../../../../test-strategy.md) · [bug-report-section-2.md](bug-report-section-2.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 33 (3 entity × 11 role) |
| **Tier-1 Passed** | 9 / 12 |
| **Tier-1 Failed** | 3 / 12 |
| **Tier-2 HOI_DAP Passed** | 3 / 12 (chuyengia_user, canbo_tw, lanhdao_tw đúng buttons) |
| **Tier-2 HOI_DAP Failed** | 9 / 12 (admin, qtht_tw, canbo_bn, canbo_tinh, lanhdao_bn, lanhdao_dp, nht_user, tvv_user, dn_user) |
| **Tier-2 PHAN_HOI** | 1 / 11 role sampled (canbo_tw — buttons match matrix) |
| **Tier-2 MAU_PHAN_HOI** | 0 / 11 (route độc lập không tồn tại, nghi ngờ embedded dropdown) |
| **Pass Rate Tier-2 HOI_DAP** | 25% (3/12) |
| **Tier-1 Coverage** | 29/33 ô ma trận menu-level (87%) |
| **Tier-2 HOI_DAP Coverage** | 12/12 role (100%) — Phase B + C |
| **Bugs Found** | **5** (4 Critical, 1 Minor mitigated) — xem [bug-report-section-2.md](bug-report-section-2.md) |
| **Health Score** | **30/100** (giảm thêm sau Phase C — data scope bug + QTHT bug cross-role) |
| **Phase A (Tier-1)** | 12:15 — 12:35 (UTC+7) |
| **Phase B (Tier-2 5 roles)** | 14:10 — 14:25 (UTC+7) |
| **Phase C (Tier-2 7 roles + scope + drawer)** | 14:28 — 14:40 (UTC+7) |
| **Total Duration** | ~50 phút |
| **Browse Status** | OK với bypass 666666 + `$B wait '.ant-table-tbody tr.ant-table-row'` |

### Verdict: **FAIL — NOT FOR RELEASE**

Toàn bộ Tier-1 + Tier-2 HOI_DAP hoàn tất (12/12 role). Phát hiện **5 bug RBAC**, trong đó **4 Critical**. Chỉ 1 role (chuyengia_user) correct hoàn toàn, 2 role (canbo_tw, lanhdao_tw TW-level) correct buttons. **9/12 role sai RBAC hoặc data scope.**

Phát hiện tổng kết:

**A. Button-level RBAC violations (4 role):**
- **admin + qtht_tw (QTHT)** thấy `Thêm mới` + `Xuất Excel` — matrix §2 quy định QTHT = 👁️ R only → **BUG-M2-004**
- **NHT** thấy 20 rows + có `Thêm mới` — unauthorized Create → **BUG-M2-002 Critical**
- **DN** thấy 20 rows + có `Thêm mới` trong CMS — vi phạm BR-AUTH-11 + data leak → **BUG-M2-001 Critical**
- **TVV** thấy 20 rows (không có Create) — unauthorized Read → **BUG-M2-002**

**B. Data scope violation (4 role) — NEW Phase C:**
- canbo_bn, canbo_tinh, lanhdao_bn, lanhdao_dp: tất cả thấy **21/21 records** (bao gồm data của TW + các Bộ khác + các Sở khác). Matrix §9 quy định BN chỉ thấy BN mình, DP chỉ thấy DP mình → **BUG-M2-005 Critical**

**C. Correct RBAC (3 role — baseline):**
- chuyengia_user (CG): menu disabled, không reach được /hoi-dap ✅
- canbo_tw (CB_NV_TW): 5 buttons đầy đủ khớp CRU*D ✅
- lanhdao_tw (CB_PD_TW): 3 buttons khớp R only (TW thấy cả 3 cấp theo spec) ✅

**D. PHAN_HOI:** Detail page `/hoi-dap/:uuid` có buttons `Sửa`, `Lưu nháp`, `Gửi phản hồi`, `Phân công` cho canbo_tw → khớp PHAN_HOI CB_NV_TW = ✅ CRU*.

**E. MAU_PHAN_HOI:** Route `/quan-tri/cau-hinh-he-thong` tồn tại (user hint) nhưng page hiển thị **"Đang phát triển — Epic 16"** → feature chưa implement. Menu sidebar cho "Cấu hình hệ thống" cũng chưa bật. 11 TC `BLOCKED — under development`, không phải bug.

### Breakthrough timeline

1. Session 2026-04-18 sáng (`round1/permission-matrix-module2/`): 0/33 BLOCKED do OTP.
2. Phase A (12:15-12:35): unblock OTP bằng `$B type "$OTP"` → Tier-1 29/33 + 3 bug.
3. Phase B (14:10-14:25): dev cấp OTP bypass `666666`; pattern `$B wait '.ant-table-tbody tr.ant-table-row'` → Tier-2 unblock. Probe 5 role → +1 bug Critical (admin/QTHT), upgrade NHT/TVV → Critical.
4. Phase C (14:28-14:40): sweep 7 role còn lại; verify data scope; probe PHAN_HOI + MAU_PHAN_HOI → +1 bug Critical (data scope), confirm PHAN_HOI buttons cho canbo_tw.

---

## 2. Phạm vi test

### 2.1 Entity trong Module 2

| # | Entity | Route CMS | QTHT | CB_NV | CB_PD | DN | NHT/TVV/CG |
|---|--------|-----------|------|-------|-------|----|-----|
| 1 | HOI_DAP | `/hoi-dap` | 👁️ R | ✅ CRU*D | 👁️ R/R* | 🔌 C† (API) | ❌ |
| 2 | PHAN_HOI | (detail drawer trong `/hoi-dap`) | 👁️ R | ✅ CRU* | 📝 RU* | ❌ | ❌ |
| 3 | MAU_PHAN_HOI | (sub-view, chưa phát hiện route riêng) | 👁️ R | ✅ CRUD* | 👁️ R* | ❌ | ❌ |

**Tổng số ô cần test:** 33 (3 entity × 11 role):
- 14 ô = có quyền UI (R/RU/CRU/CRUD) → verify positive
- 18 ô = không quyền (❌) → verify negative
- 1 ô = 🔌 C† (DN-HOI_DAP) = API only → out-of-scope UI test (nhưng DN vẫn vào được CMS → BUG-PERM-M2-001)

### 2.2 Role × Landing URL (đã verify)

| # | Account | Role SRS | Đơn vị | Cấp | Landing actual | Login OK |
|---|---------|----------|--------|-----|----------------|---------|
| 0 | admin | QTHT (master) | Cục BTTP | TW | `/dashboard` | ✅ |
| 1 | qtht_tw | QTHT | Cục BTTP | TW | `/dashboard` | ✅ |
| 2 | canbo_tw | CB_NV_TW | Cục BTTP | TW | `/403` | ⚠️ (logged in, dashboard blocked) |
| 3 | canbo_bn | CB_NV_BN | Bộ KH&ĐT | BN | `/403` | ⚠️ |
| 4 | canbo_tinh | CB_NV_DP | Sở TP HN | DP | `/403` | ⚠️ |
| 5 | lanhdao_tw | CB_PD_TW | Cục BTTP | TW | `/403` | ⚠️ |
| 6 | lanhdao_bn | CB_PD_BN | Bộ KH&ĐT | BN | `/403` | ⚠️ |
| 7 | lanhdao_dp | CB_PD_DP | Sở TP HN | DP | `/403` | ⚠️ |
| 8 | dn_user | DN | — | Portal | `/403` | ❌ BUG (vi phạm BR-AUTH-11, xem BUG-PERM-M2-001) |
| 9 | nht_user | NHT | — | Portal | `/403` | ✅ |
| 10 | tvv_user | TVV | — | Portal | `/403` | ✅ |
| 11 | chuyengia_user | CG | — | Portal | `/403` | ✅ |

**Lưu ý `/403` landing cho non-QTHT:** trùng với phát hiện BUG-PERM-M1-003 của section-1 (non-admin roles không thấy /dashboard). Không lặp report ở đây.

---

## 3. Test Results Summary

### 3.1 HOI_DAP × 11 role

**Tier-1 (sidebar) và Tier-2 (page content) — Phase B đã probe 5 role:**

| ID | TraceID | TC | Type | Priority | Result | Bug ID | Ghi chú (Tier-2) |
|----|---------|----|------|----------|--------|--------|------------------|
| M2-HD-01 | QTHT × HOI_DAP (👁️ R) | admin vào /hoi-dap | Authz+ | P0 | **FAIL** | BUG-PERM-M2-004 | Tier-2: 20 rows + có `Thêm mới`/`Xuất Excel` ❌ (expected R-only) |
| M2-HD-02 | QTHT × HOI_DAP | qtht_tw vào /hoi-dap | Authz+ | P0 | **FAIL** (suspected) | BUG-PERM-M2-004 | Tier-1 OK; Tier-2 chưa test nhưng cùng pattern admin → nghi ngờ cùng bug |
| M2-HD-03 | CB_NV_TW × HOI_DAP (✅ CRU*D) | canbo_tw CRUD | Authz+ | P0 | **PASS** | — | Tier-2: 20 rows + Tìm/Xóa/`Thêm mới`/`Xuất Excel`/Làm mới ✅ (khớp C quyền). Edit/Delete có thể ở drawer — chưa verify |
| M2-HD-04 | CB_NV_BN × HOI_DAP | canbo_bn CRUD scoped | Authz+ | P0 | **PARTIAL** | — | Tier-1 OK; Tier-2 chưa test (data scope BN chưa verify) |
| M2-HD-05 | CB_NV_DP × HOI_DAP | canbo_tinh CRUD scoped | Authz+ | P0 | **PARTIAL** | — | Tier-1 OK; Tier-2 chưa test (data scope DP chưa verify) |
| M2-HD-06 | CB_PD_TW × HOI_DAP (👁️ R) | lanhdao_tw Read | Authz+ | P0 | **PASS** | — | Tier-2: 20 rows + chỉ Tìm/Xóa/Làm mới (KHÔNG có `Thêm mới`/`Xuất`) ✅ khớp R only |
| M2-HD-07 | CB_PD_BN × HOI_DAP (👁️ R*) | lanhdao_bn Read scoped | Authz+ | P0 | **PARTIAL** | — | Tier-1 OK; Tier-2 chưa test |
| M2-HD-08 | CB_PD_DP × HOI_DAP (👁️ R*) | lanhdao_dp Read scoped | Authz+ | P0 | **PARTIAL** | — | Tier-1 OK; Tier-2 chưa test |
| M2-HD-09 | DN × HOI_DAP (🔌 C† API only) | dn_user KHÔNG được vào CMS | Authz- | P0 | **FAIL** | BUG-PERM-M2-001 | Tier-2: reach `/hoi-dap`, thấy 20 rows, có `Thêm mới`. Data leak + auth bypass — CRITICAL |
| M2-HD-10 | NHT × HOI_DAP (❌) | nht_user menu ẩn | Authz- | P0 | **FAIL** | BUG-PERM-M2-002 | Tier-2: reach `/hoi-dap`, thấy 20 rows, có `Thêm mới`. NÂNG severity Major → CRITICAL |
| M2-HD-11 | TVV × HOI_DAP (❌) | tvv_user menu ẩn | Authz- | P0 | **FAIL** (Tier-1) + suspected CRITICAL (Tier-2 chưa test) | BUG-PERM-M2-002 | Pattern NHT → tvv chưa Tier-2 nhưng giả định cùng bug |
| M2-HD-12 | CG × HOI_DAP (❌) | chuyengia_user menu ẩn | Authz- | P0 | **PASS** | — | Tier-1 Menu disabled ✅; không cần Tier-2 |

**Tóm tắt Tier-2 đầy đủ 12 role (Phase B + C):**

| Role | Expected | rowCount | Total (pagination) | mainButtons | Button verdict | Scope verdict |
|------|----------|----------|--------------------|-------------|-----------------|----------------|
| admin (QTHT) | 👁️ R | 20 | — | Tìm, Xóa, **Thêm mới**, **Xuất Excel**, Làm mới | 🐛 BUG-M2-004 | TW = full scope OK |
| qtht_tw (QTHT) | 👁️ R | 20 | — | Tìm, Xóa, **Thêm mới**, **Xuất Excel**, Làm mới | 🐛 BUG-M2-004 | TW = full scope OK |
| canbo_tw (CB_NV_TW) | ✅ CRU*D | 20 | 21 | Tìm, Xóa, **Thêm mới**, **Xuất Excel**, Làm mới | ✅ PASS | TW = full scope OK |
| canbo_bn (CB_NV_BN) | ✅ CRU*D scoped | 20 | **21** | Tìm, Xóa, **Thêm mới**, **Xuất Excel**, Làm mới | ✅ buttons OK | 🐛 BUG-M2-005 (scope fail — thấy cả TW/DP) |
| canbo_tinh (CB_NV_DP) | ✅ CRU*D scoped | 20 | **21** | Tìm, Xóa, **Thêm mới**, **Xuất Excel**, Làm mới | ✅ buttons OK | 🐛 BUG-M2-005 |
| lanhdao_tw (CB_PD_TW) | 👁️ R full | 20 | 21 | Tìm, Xóa, Làm mới | ✅ PASS | TW = full scope OK |
| lanhdao_bn (CB_PD_BN) | 👁️ R* scoped BN | 20 | **21** | Tìm, Xóa, Làm mới | ✅ buttons OK | 🐛 BUG-M2-005 |
| lanhdao_dp (CB_PD_DP) | 👁️ R* scoped DP | 20 | **21** | Tìm, Xóa, Làm mới | ✅ buttons OK | 🐛 BUG-M2-005 |
| nht_user (NHT) | ❌ | 20 | — | Tìm, Xóa, **Thêm mới**, Làm mới | 🐛 BUG-M2-002 | data leak confirmed |
| tvv_user (TVV) | ❌ | 20 | — | Tìm, Xóa, Làm mới | 🐛 BUG-M2-002 (read-only variant) | data leak confirmed |
| dn_user (DN) | 🔌 API only | 20 | — | Tìm, Xóa, **Thêm mới**, Làm mới | 🐛 BUG-M2-001 Critical | vi phạm BR-AUTH-11 |
| chuyengia_user (CG) | ❌ | (menu disabled) | — | — | ✅ PASS | — |

**Key observations:**
- Tổng pagination "21 mục" identical across **all 6 CB_NV/CB_PD (TW+BN+DP) roles** → confirm data không scope theo đơn vị
- Rows ví dụ có `HD-20260417-012 QA-R2 HD-029 BUG: NHT creates` và `HD-20260417-011 QA-R2 HD-027 DN API create` — đây là **evidence data pollution** từ bug BUG-M2-001/002 (round test trước NHT và DN đã thật sự create được)

### 3.2 PHAN_HOI × 11 role

PHAN_HOI truy cập qua click row HD-code trong `/hoi-dap` → navigate `/hoi-dap/:uuid` (detail page, không phải drawer). Phase C đã sample canbo_tw trên detail page.

| ID | TraceID | TC | Result | Evidence / Ghi chú |
|----|---------|----|--------|---------------------|
| M2-PH-03 | CB_NV_TW × PHAN_HOI (✅ CRU*) | canbo_tw tạo/sửa phản hồi | **PASS** | Detail buttons: `Sửa`, `Lưu nháp`, `Gửi phản hồi`, `Phân công`. [tier2-canbo_tw-detail.png](screenshots/tier2-canbo_tw-detail.png) |
| M2-PH-01/02/04/05..11 | (10 role còn lại) × PHAN_HOI | Verify R/RU/CRU*/❌ per role | **PARTIAL** | Detail page reach được (không crash); chưa test buttons per-role. Pattern likely giống list: QTHT + NHT + DN + TVV + CB có nút Gửi phản hồi (nếu cùng bug pattern) |

### 3.3 MAU_PHAN_HOI × 11 role

**Update sau clarification của user (2026-04-18 14:50):** Route là `/quan-tri/cau-hinh-he-thong` (Quản trị hệ thống > submenu Cấu hình hệ thống > tab Mẫu phản hồi). Probe URL này sau khi user hint:

| Probe | Result |
|-------|--------|
| Sidebar search trong Quản trị hệ thống submenu | Chỉ có: Danh mục dùng chung, Cấu hình SLA, Cấu hình phân công, Ngày lễ, Tiêu chí đánh giá hiệu quả, Tiêu chí đánh giá chi phí, Tài khoản & phân quyền, Quản lý API Consumer — **KHÔNG có menu "Cấu hình hệ thống"** |
| URL `/quan-tri/cau-hinh-he-thong` (via SPA router push) | **Route tồn tại** — header "Quản trị hệ thống" render OK |
| Content page | Chỉ có dòng chữ **"Đang phát triển — Epic 16"** → page chưa implement |

**Evidence:** [screenshots/tier2-admin-cauhinh-hethong.png](screenshots/tier2-admin-cauhinh-hethong.png)

**Kết luận:**
- Route được reserve trong router (không 404) nhưng **UI page chưa được dev xây**
- Tab "Mẫu phản hồi" cùng các tab khác của Cấu hình hệ thống thuộc Epic 16 — chưa release
- **Menu sidebar cho "Cấu hình hệ thống" CHƯA có** — có thể cố tình ẩn cho đến khi feature ready, hoặc bị miss trong config
- Evidence feature MAU_PHAN_HOI đã có data: row `HD-20260417-014 "QA-R2 HD-034 Use Mau"` (reply dùng mẫu)
- → Nghĩa là CRUD MAU_PHAN_HOI được dùng qua form Gửi phản hồi, nhưng trang quản lý mẫu (CRUD riêng cho admin/CB) chưa có

**11 TC MAU_PHAN_HOI:** `BLOCKED — feature under development (Epic 16)`. Không phải bug app, là work-in-progress.

| ID | TraceID | TC | Result | Nguyên nhân |
|----|---------|----|--------|-------------|
| M2-MP-01..11 | (11 role) × MAU_PHAN_HOI | Verify R/CRUD*/R*/❌ | **BLOCKED** | Page `/quan-tri/cau-hinh-he-thong` chưa implement (Epic 16) |

| ID | TraceID | TC | Result | Nguyên nhân |
|----|---------|----|--------|-------------|
| M2-MP-01..11 | (11 role) × MAU_PHAN_HOI | Verify R/CRUD*/R*/❌ | **BLOCKED** | Không có route UI; có thể là embedded feature (dev confirm) |

### 3.4 Tổng hợp kết quả (post Phase C)

| Entity | PASS | FAIL | PARTIAL | BLOCKED | Tổng |
|--------|------|------|---------|---------|------|
| HOI_DAP | 3 | 9 | 0 | 0 | 12 |
| PHAN_HOI | 1 | 0 | 10 | 0 | 11 |
| MAU_PHAN_HOI | 0 | 0 | 0 | 11 | 11 |
| **Tổng** | **4** | **9** | **10** | **11** | **34** |

*(34 = 11 role × 3 entity + admin riêng)*

- **PASS (4):** chuyengia_user (menu disabled), canbo_tw HOI_DAP (buttons OK), canbo_tw PHAN_HOI (reply buttons OK), lanhdao_tw (R-only buttons OK)
- **FAIL (9):** admin + qtht_tw (BUG-004), dn_user (BUG-001), nht_user + tvv_user (BUG-002), canbo_bn + canbo_tinh + lanhdao_bn + lanhdao_dp (BUG-005 scope)
- **PARTIAL (10):** PHAN_HOI cho 10 role khác canbo_tw — chưa test per-role buttons (detail page reach được, nhưng chưa enumerate)
- **BLOCKED (11):** MAU_PHAN_HOI toàn bộ — route chưa xác định

---

## 4. Detailed Test Results

### 4.1 M2-HD-01/02: QTHT (admin + qtht_tw) × HOI_DAP → Read

**Pre-conditions:** Login với `admin/Test@1234` hoặc `qtht_tw/Test@1234`.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login + OTP | Landing `/dashboard` | `/dashboard` ✅ | PASS |
| 2 | Observe sidebar | "Quản lý hỏi đáp pháp lý" enabled | Enabled ✅ | PASS |
| 3 | Click menu Hỏi đáp | Navigate `/hoi-dap`, render list với dữ liệu | Navigate OK → spinner hiện → **tab crash about:blank sau ~2s** | **PARTIAL** |
| 4 | Check action buttons | Chỉ có Xem (R) — không Tạo/Sửa/Xóa | Không verify được | **BLOCKED** |

**Notes:**
- Dashboard admin hiển thị "Hoi dap moi: 20" → đã có 20 records HOI_DAP
- Screenshot: [screenshots/admin-00-landing.png](screenshots/admin-00-landing.png), [qtht_tw-00-landing.png](screenshots/qtht_tw-00-landing.png)
- Page crash xem §6 và BUG-PERM-M2-003 (ENV blocker)

---

### 4.2 M2-HD-03/04/05: CB_NV (canbo_tw/bn/tinh) × HOI_DAP → CRU*D

**Pre-conditions:** Login từng role.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login + OTP | Session OK | Session OK (landing `/403`) | ✅ |
| 2 | Observe sidebar | Hỏi đáp enabled | Enabled ✅ | PASS |
| 3 | Click menu | Navigate `/hoi-dap` | Navigate OK → spinner → crash | PARTIAL |
| 4 | Observe "Thêm mới" button | Visible (C quyền) | Không verify được | **BLOCKED** |
| 5 | Observe row actions (Sửa/Xóa) | Visible cho own records | Không verify được | **BLOCKED** |
| 6 | Data scope (BN/DP) | Chỉ thấy data đơn vị mình | Không verify được | **BLOCKED** |

**Evidence:**
- [screenshots/canbo_tw-01-hoidap-1s.png](screenshots/canbo_tw-01-hoidap-1s.png) — spinner state
- [screenshots/canbo_bn-01-hoidap-1s.png](screenshots/canbo_bn-01-hoidap-1s.png) — spinner, user badge "CB_BN"
- [screenshots/canbo_tinh-00-landing.png](screenshots/canbo_tinh-00-landing.png) — landing

---

### 4.3 M2-HD-06/07/08: CB_PD (lanhdao_tw/bn/dp) × HOI_DAP → Read + Approve

**Pre-conditions:** Login lanhdao_*.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login + OTP | Session OK | OK (landing `/403`) | ✅ |
| 2 | Sidebar Hỏi đáp | Enabled | Enabled ✅ | PASS |
| 3 | Click → /hoi-dap | Render list R-only + nút Phê duyệt/Từ chối | Spinner → crash | **BLOCKED** |
| 4 | Verify KHÔNG có "Thêm mới" | — | Chưa verify | **BLOCKED** |

**Evidence:** [screenshots/lanhdao_tw-01-hoidap-1s.png](screenshots/lanhdao_tw-01-hoidap-1s.png), [lanhdao_dp-01-hoidap-1s.png](screenshots/lanhdao_dp-01-hoidap-1s.png)

---

### 4.4 M2-HD-09: DN × HOI_DAP → API only (CMS cấm)

**Pre-conditions:** Login `dn_user/Test@1234`.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Truy cập `/login` | Form login | OK | ✅ |
| 2 | Submit dn_user/Test@1234 + OTP | Reject login (DN chỉ dùng API) HOẶC login → landing dashboard DN-only với menu ẩn | **Login thành công, session OK, sidebar full menu** bao gồm Hỏi đáp ENABLED | **FAIL** |
| 3 | Observe user badge | DN không được hiển thị trong CMS | "Công ty TNHH Test / DOANH_NGHIEP" hiển thị | **FAIL** |
| 4 | Click Hỏi đáp | Chặn / 403 tức thì | Navigate `/hoi-dap`, loading modules (verify qua network) | **FAIL** |

**Bug:** [BUG-PERM-M2-001](bug-report-section-2.md#bug-perm-m2-001) (Critical)

**Evidence:** [screenshots/dn_user-00-landing.png](screenshots/dn_user-00-landing.png), [dn_user-01-hoidap-1s.png](screenshots/dn_user-01-hoidap-1s.png)

**Note:** Trùng lõi với [BUG-PERM-M1-001](../section-1-quan-tri-he-thong/bug-report-section-1.md) (DN login CMS — Data Isolation DI-09). Section 2 cung cấp thêm evidence trên menu Hỏi đáp cụ thể.

---

### 4.5 M2-HD-10/11: NHT, TVV × HOI_DAP → ❌

**Pre-conditions:** Login `nht_user` hoặc `tvv_user`.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login + OTP | OK | OK | ✅ |
| 2 | Observe sidebar | Menu Hỏi đáp **disabled/ẩn** | **Menu ENABLED** ❌ | **FAIL** |
| 3 | Click Hỏi đáp | Không click được (menu disabled) HOẶC /403 | Click OK, navigate `/hoi-dap`, spinner | **FAIL** |

**Bug:** [BUG-PERM-M2-002](bug-report-section-2.md#bug-perm-m2-002) (Major)

**Evidence:**
- [screenshots/nht_user-00-landing.png](screenshots/nht_user-00-landing.png) — sidebar cho NHT có Hỏi đáp ENABLED
- [screenshots/nht_user-01-hoidap-1s.png](screenshots/nht_user-01-hoidap-1s.png) — đã click + loading
- [evidence/tvv_user.log](evidence/tvv_user.log) — raw sidebar state JSON

---

### 4.6 M2-HD-12: CG × HOI_DAP → ❌ (expected correct)

**Pre-conditions:** Login `chuyengia_user`.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login + OTP | OK | OK (landing /403) | ✅ |
| 2 | Observe sidebar | Menu Hỏi đáp **disabled** | **Disabled** ✅ | **PASS** |
| 3 | Cố tình click | Không click được (visual disabled) | Click không trigger navigation | **PASS** |

**Evidence:** [screenshots/chuyengia_user-00-landing.png](screenshots/chuyengia_user-00-landing.png) — sidebar CG gần như toàn disabled, chỉ có "Quản lý chuyên gia / tư vấn viên" + Ngày lễ + 2 Tiêu chí đánh giá là active.

**Note:** Đây là role DUY NHẤT trong 4 portal roles có RBAC đúng cho menu Hỏi đáp. Điều này chứng tỏ logic RBAC đã có trong code nhưng config sai cho NHT/TVV/DN.

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| admin | QTHT | Cục BTTP | TW | M2-HD-01 |
| qtht_tw | QTHT | Cục BTTP | TW | M2-HD-02 |
| canbo_tw | CB_NV | Cục BTTP | TW | M2-HD-03 |
| canbo_bn | CB_NV | Bộ KH&ĐT | BN | M2-HD-04 |
| canbo_tinh | CB_NV | Sở TP HN | DP | M2-HD-05 |
| lanhdao_tw | CB_PD | Cục BTTP | TW | M2-HD-06 |
| lanhdao_bn | CB_PD | Bộ KH&ĐT | BN | M2-HD-07 |
| lanhdao_dp | CB_PD | Sở TP HN | DP | M2-HD-08 |
| dn_user | DN | — | Portal | M2-HD-09 (FAIL) |
| nht_user | NHT | — | Portal | M2-HD-10 (FAIL) |
| tvv_user | TVV | — | Portal | M2-HD-11 (FAIL) |
| chuyengia_user | CG | — | Portal | M2-HD-12 (PASS) |

### 5.2 Data có sẵn (không cần tạo)

| Loại | Count | Nguồn |
|------|-------|-------|
| HOI_DAP records | 20 | Dashboard admin ("Hoi dap moi: 20") |
| PHAN_HOI records | Chưa đếm (cần mở drawer) | — |
| MAU_PHAN_HOI records | Chưa đếm (cần tìm route) | — |

→ Data readiness OK cho Tier-2 khi fix §6.

---

## 6. Environment Notes

- **API endpoint pattern:** chưa scan (out-of-scope UI test)
- **Auth flow:** Username/password → 6-digit OTP qua email (MailHog) → Antd OTP input (`.ant-otp input[maxlength="1"]`)
- **OTP bypass:** KHÔNG có bypass dev — phải fetch OTP từ MailHog mỗi login
- **Antd OTP workaround (verified):** `$B type "$OTP"` sau khi form OTP render → pass (memory [qa_htpldn_otp_bypass.md](~/.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_otp_bypass.md))
- **Frontend:** React + Vite dev + Ant Design + CASL
- **Page crash pattern:** `/hoi-dap` load 20+ lazy chunks → Chromium tab crash sau ~2s (xem BUG-PERM-M2-003 environment)
- **Session lifecycle:** Cookies KHÔNG persist qua browse server restart → mỗi bash block phải login lại

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-PERM-M2-001 (Critical):** Block DN login CMS UI (hoặc ẩn toàn bộ sidebar cho DN). Đồng bộ với fix BUG-PERM-M1-001.
2. **BUG-PERM-M2-002 (Major):** Ẩn menu "Quản lý hỏi đáp pháp lý" cho NHT và TVV. Dùng logic RBAC đã work cho CG làm reference.
3. **BUG-PERM-M2-003 (Environment — Blocker):** Page `/hoi-dap` crash Chromium tab. Đề xuất: chạy production build (`npm run build && npm run preview`) thay vì Vite dev trên server test.

### Should Fix

4. Xác định route cho MAU_PHAN_HOI — hiện không tìm thấy menu sidebar riêng.

### Re-test Plan (Tier-2)

Khi fix §6 (tab crash), re-run với các TC:

| TC | Entity | Verify |
|----|--------|--------|
| M2-HD-01..02 | HOI_DAP QTHT | Page load, CHỈ có nút Xem, KHÔNG có Tạo/Sửa/Xóa |
| M2-HD-03..05 | HOI_DAP CB_NV | Nút "Thêm mới", "Sửa", "Xóa"; data scope TW/BN/DP |
| M2-HD-06..08 | HOI_DAP CB_PD | KHÔNG có "Thêm mới"; có "Phê duyệt"; data scope |
| M2-PH-01..11 | PHAN_HOI | Mở detail drawer, verify buttons Trả lời/Sửa/Xóa |
| M2-MP-01..11 | MAU_PHAN_HOI | Tìm route; verify CRUD per role |

### Additional Recommendations

5. Sau khi fix DN CMS access → test URL direct access: role ❌ goto `/hoi-dap` phải redirect `/403` (verify backend guards, không chỉ UI hide menu).
6. Bổ sung tài khoản BN2 / DP2 để verify data isolation ngang cấp (DI-04, DI-05) — hiện chỉ có 1 BN + 1 DP nên không test được ngang cấp khác đơn vị.

---

## 8. Appendix

### A — Routes đã phát hiện

| Entity | Route | Trigger |
|--------|-------|---------|
| HOI_DAP | `/hoi-dap` | Click menu "Quản lý hỏi đáp pháp lý" |
| PHAN_HOI | (detail drawer trong `/hoi-dap`) | Click row → "Xem chi tiết" |
| MAU_PHAN_HOI | (chưa phát hiện) | — |

Network evidence khi click Hỏi đáp từ canbo_tw:
```
GET /src/pages/hoi-dap/list/index.tsx → 200
GET /src/pages/hoi-dap/form/index.tsx → 200
GET /src/pages/hoi-dap/detail/HoiDapEditDrawer.tsx → 200
GET /src/services/hoi-dap/hoi-dap.service.ts → 200
```

→ Xác nhận route chính là `/hoi-dap`, drawer là `HoiDapEditDrawer`.

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [admin-00-landing.png](screenshots/admin-00-landing.png) | Dashboard admin với metrics (20 hỏi đáp) | M2-HD-01 |
| [qtht_tw-00-landing.png](screenshots/qtht_tw-00-landing.png) | Dashboard QTHT_TW | M2-HD-02 |
| [canbo_tw-00-landing.png](screenshots/canbo_tw-00-landing.png) | /403 CB_TW, sidebar Hỏi đáp enabled | M2-HD-03 |
| [canbo_tw-01-hoidap-1s.png](screenshots/canbo_tw-01-hoidap-1s.png) | /hoi-dap spinner state trước crash | M2-HD-03 |
| [canbo_bn-00-landing.png](screenshots/canbo_bn-00-landing.png) | /403 CB_BN | M2-HD-04 |
| [canbo_tinh-00-landing.png](screenshots/canbo_tinh-00-landing.png) | /403 CB_TINH | M2-HD-05 |
| [lanhdao_tw-00-landing.png](screenshots/lanhdao_tw-00-landing.png) | /403 LANH_DAO_TW | M2-HD-06 |
| [lanhdao_bn-00-landing.png](screenshots/lanhdao_bn-00-landing.png) | /403 LANH_DAO_BN | M2-HD-07 |
| [lanhdao_dp-00-landing.png](screenshots/lanhdao_dp-00-landing.png) | /403 LANH_DAO_DP | M2-HD-08 |
| [dn_user-00-landing.png](screenshots/dn_user-00-landing.png) | **BUG-PERM-M2-001 evidence** — DN trong CMS | M2-HD-09 |
| [dn_user-01-hoidap-1s.png](screenshots/dn_user-01-hoidap-1s.png) | DN reach /hoi-dap spinner | M2-HD-09 |
| [nht_user-00-landing.png](screenshots/nht_user-00-landing.png) | **BUG-PERM-M2-002 evidence** — NHT sidebar có Hỏi đáp | M2-HD-10 |
| [nht_user-01-hoidap-1s.png](screenshots/nht_user-01-hoidap-1s.png) | NHT reach /hoi-dap spinner | M2-HD-10 |
| [chuyengia_user-00-landing.png](screenshots/chuyengia_user-00-landing.png) | **CG RBAC baseline CORRECT** — Hỏi đáp disabled | M2-HD-12 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| BR-AUTH-11 (DN = API only) | M2-HD-09 | **FAIL** — BUG-PERM-M2-001 |
| permission-matrix §2 HOI_DAP | M2-HD-01..12 | 1 PASS / 3 FAIL / 8 PARTIAL |
| permission-matrix §2 PHAN_HOI | M2-PH-01..11 | 11 BLOCKED |
| permission-matrix §2 MAU_PHAN_HOI | M2-MP-01..11 | 11 BLOCKED |

### D — Raw logs per role

| File | Role |
|------|------|
| [evidence/admin.log](evidence/admin.log) | admin |
| [evidence/qtht_tw.log](evidence/qtht_tw.log) | qtht_tw |
| [evidence/canbo_tw.log](evidence/canbo_tw.log) | canbo_tw |
| [evidence/canbo_bn.log](evidence/canbo_bn.log) | canbo_bn |
| [evidence/canbo_tinh.log](evidence/canbo_tinh.log) | canbo_tinh |
| [evidence/lanhdao_tw.log](evidence/lanhdao_tw.log) | lanhdao_tw |
| [evidence/lanhdao_bn.log](evidence/lanhdao_bn.log) | lanhdao_bn |
| [evidence/lanhdao_dp.log](evidence/lanhdao_dp.log) | lanhdao_dp |
| [evidence/dn_user.log](evidence/dn_user.log) | dn_user |
| [evidence/nht_user.log](evidence/nht_user.log) | nht_user |
| [evidence/tvv_user.log](evidence/tvv_user.log) | tvv_user |
| [evidence/chuyengia_user.log](evidence/chuyengia_user.log) | chuyengia_user |
| [evidence/summary.json](evidence/summary.json) | Consolidated sidebar state + landing URL per role |

---

*Report generated: 2026-04-18 | QA Automation via Claude Code*
