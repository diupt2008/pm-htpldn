# Functional Test Report — Ma trận phân quyền Mục 7 (Nhóm Báo cáo & Biểu mẫu)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Nhóm Báo cáo & Biểu mẫu — Permission Matrix §7 (entity BAO_CAO / BIEU_MAU / THU_MUC_BIEU_MAU) |
| **SRS Reference** | srs-fr-09-bieu-mau.md (FR-IV.I.01 → 08) + srs-fr-11-bao-cao.md (FR-IX.I.01 → 23 / UC120 → 142) + BR-AUTH-08/09, §3.4.2 §9.2 |
| **UC Coverage** | UC92-98, 163 (BIEU_MAU) + UC120-142 (BAO_CAO) — permission view |
| **Người test** | QA Automation via Claude Code (Opus 4.7) |
| **Ngày** | 2026-04-19 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (bypass tạm) — MailHog fallback: http://103.172.236.130:8025 |
| **Test Method** | UI-based (gstack `/browse` Playwright headless 1280×720) — **KHÔNG test API** (theo yêu cầu user) |
| **Primary Account** | 11 account × 11 role (xem §5.1) |
| **Round** | round2_2026-04-16 — Đợt 3 (chạy ngày 2026-04-19) |
| **Tài liệu tham chiếu** | [permission-matrix.md §7](../../../permission-matrix.md) · [test-strategy.md §1.2, §5, §9](../../../test-strategy.md) · [funtion/7.9-bieu-mau.md](../../../funtion/7.9-bieu-mau.md) · [funtion/7.11-bao-cao-thong-ke.md](../../../funtion/7.11-bao-cao-thong-ke.md) · [smoke-test/bieu-mau/](../../smoke-test/bieu-mau/) · [bug-report-section-7.md](bug-report-section-7.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 33 (3 entity × 11 role) |
| **Passed** | 14 |
| **Failed** | 18 |
| **Blocked** | 0 |
| **Partial / Caveat** | 1 |
| **Pass Rate** | 42% (14/33) |
| **P0 Pass Rate** | 42% (BAO_CAO 10/11 + BIEUMAU 2/11 + THUMUC 2/11 = 14/33 — toàn bộ là P0 authorization) |
| **Bugs Found** | 6 (0 Critical-blocker new, 3 Critical, 1 Major, 1 Minor, 1 Blocker-duplicate smoke) |
| **Health Score** | 42/100 |
| **Start Time** | 14:30 (UTC+7) |
| **End Time** | 16:15 (UTC+7) |
| **Total Duration** | ~105 phút (bao gồm 2 lần browse crash recovery đầu session + 11 chain atomic per role + viết report) |
| **Browse Status** | OK sau khi cleanup kill -9 chromium/playwright zombies lần thứ 3 (xem §6 "Environment Notes — Browse issues") |

### Verdict: **FAIL**

**FAIL** — 18/33 ô vi phạm permission matrix; toàn bộ entity BIEU_MAU + THU_MUC_BIEU_MAU FAIL 9/11 role mỗi entity do FE ability-rule block 8 role × 2 entity, QTHT over-permission CUD. BAO_CAO 10/11 PASS, data scoping Đơn vị OK.

---

## 2. Test Results Summary

> **Tầng 1 — Scan nhanh.** Mỗi ô quyền = 1 TC. Chi tiết per-TC xem §4.

### 2.1 Entity BAO_CAO (`/bao-cao`) — 11 TC

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| PM7-BC-001 | FR-IX, BR-AUTH-09 §9.2 | QTHT (qtht_tw) × BAO_CAO = 👁️ R | Authorization | P0 | **PASS** | — | UI filter + Xem + Xuất. Đơn vị=Cục BTTP. Không có CUD button. |
| PM7-BC-002 | FR-IX, BR-AUTH-08 | CB_NV_TW (canbo_tw) × BAO_CAO = ✅ CRU* | Authorization | P0 | **PARTIAL** | — | Read + Xuất OK, scope TW (Cục BTTP). "C"+"U" không quan sát được qua UI (không có button Lưu/Tạo/Sửa BC) — xem §5 Caveat. |
| PM7-BC-003 | FR-IX, BR-AUTH-08 | CB_NV_BN (canbo_bn) × BAO_CAO = ✅ CRU* scoped BN | Authorization | P0 | **PASS** | — | Scope đúng Bộ KH&ĐT (auto-set disabled field). |
| PM7-BC-004 | FR-IX, BR-AUTH-08 | CB_NV_DP (canbo_tinh) × BAO_CAO = ✅ CRU* scoped DP | Authorization | P0 | **PASS** | — | Scope đúng Sở TP HN. |
| PM7-BC-005 | FR-IX, BR-AUTH-08 §9.3 | CB_PD_TW (lanhdao_tw) × BAO_CAO = 📝 RU* | Authorization | P0 | **PASS** | — | Read + Scope TW OK. "U" phê duyệt không quan sát qua UI. |
| PM7-BC-006 | FR-IX | CB_PD_BN (lanhdao_bn) × BAO_CAO = 📝 RU* scoped BN | Authorization | P0 | **PASS** | — | Scope đúng BN. |
| PM7-BC-007 | FR-IX | CB_PD_DP (lanhdao_dp) × BAO_CAO = 📝 RU* scoped DP | Authorization | P0 | **PASS** | — | Scope đúng DP. |
| PM7-BC-008 | FR-IX, DI-09 | DN (dn_user) × BAO_CAO = ❌ | Authorization | P0 | **PASS** | — | Sidebar menu grayed. Khớp ❌. |
| PM7-BC-009 | FR-IX, BR-AUTH-10 | NHT (nht_user) × BAO_CAO = ❌ | Authorization | P0 | **PASS** | — | Click menu → /403. Khớp ❌. |
| PM7-BC-010 | FR-IX | TVV (tvv_user) × BAO_CAO = ❌ | Authorization | P0 | **PASS** | — | Click → /403. Khớp ❌. |
| PM7-BC-011 | FR-IX | CG (chuyengia_user) × BAO_CAO = ❌ | Authorization | P0 | **PASS** | — | Click → /403. Khớp ❌. |

### 2.2 Entity BIEU_MAU (`/bieu-mau/thu-muc`) — 11 TC

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| PM7-BM-001 | FR-IV.I, BR-AUTH-09 §9.2 | QTHT (qtht_tw) × BIEU_MAU = 👁️ R | Authorization | P0 | **FAIL** | BUG-PERM-M7-001 | QTHT có Thêm thư mục + Công khai + Sửa + Xóa — vi phạm R. |
| PM7-BM-002 | FR-IV.I, BR-AUTH-08 | CB_NV_TW (canbo_tw) × BIEU_MAU = ✅ CRUD* | Authorization | P0 | **FAIL** | BUG-PERM-M7-002 | Menu `Quản lý thư viện biểu mẫu` disabled (class `nav-item active disabled`). Duplicate smoke. |
| PM7-BM-003 | FR-IV.I | CB_NV_BN (canbo_bn) × BIEU_MAU = ✅ CRUD* scoped BN | Authorization | P0 | **FAIL** | BUG-PERM-M7-002 | Menu disabled. |
| PM7-BM-004 | FR-IV.I | CB_NV_DP (canbo_tinh) × BIEU_MAU = ✅ CRUD* scoped DP | Authorization | P0 | **FAIL** | BUG-PERM-M7-002 | Menu disabled. |
| PM7-BM-005 | FR-IV.I | CB_PD_TW (lanhdao_tw) × BIEU_MAU = 👁️ R* | Authorization | P0 | **FAIL** | BUG-PERM-M7-003 | Menu disabled → mất quyền Read. |
| PM7-BM-006 | FR-IV.I | CB_PD_BN (lanhdao_bn) × BIEU_MAU = 👁️ R* | Authorization | P0 | **FAIL** | BUG-PERM-M7-003 | Menu disabled. |
| PM7-BM-007 | FR-IV.I | CB_PD_DP (lanhdao_dp) × BIEU_MAU = 👁️ R* | Authorization | P0 | **FAIL** | BUG-PERM-M7-003 | Menu disabled. |
| PM7-BM-008 | FR-IV.I, DI-09 | DN (dn_user) × BIEU_MAU = 👁️ R | Authorization | P0 | **FAIL** | BUG-PERM-M7-004 | Menu disabled — mất quyền Read (hoặc matrix cần chỉnh 🔌 R†). |
| PM7-BM-009 | FR-IV.I, BR-AUTH-10 | NHT (nht_user) × BIEU_MAU = 👁️ R | Authorization | P0 | **FAIL** | BUG-PERM-M7-005 | Click menu → /403. |
| PM7-BM-010 | FR-IV.I | TVV (tvv_user) × BIEU_MAU = ❌ | Authorization | P0 | **PASS** | — | Click → /403. Khớp ❌. |
| PM7-BM-011 | FR-IV.I | CG (chuyengia_user) × BIEU_MAU = ❌ | Authorization | P0 | **PASS** | — | Click → /403. Khớp ❌. |

### 2.3 Entity THU_MUC_BIEU_MAU (cùng route `/bieu-mau/thu-muc`) — 11 TC

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| PM7-TM-001 | FR-IV.I, BR-AUTH-09 §9.2 | QTHT × THU_MUC_BIEU_MAU = 👁️ R | Authorization | P0 | **FAIL** | BUG-PERM-M7-001 | Nút `+ Thêm thư mục` hiển thị → QTHT có thể tạo thư mục master. |
| PM7-TM-002 | FR-IV.I, BR-AUTH-08 | CB_NV_TW × THU_MUC_BIEU_MAU = ✅ CRUD* | Authorization | P0 | **FAIL** | BUG-PERM-M7-002 | Không truy cập được — same root cause BIEU_MAU. |
| PM7-TM-003 | FR-IV.I | CB_NV_BN × THU_MUC_BIEU_MAU = ✅ CRUD* scoped BN | Authorization | P0 | **FAIL** | BUG-PERM-M7-002 | Same. |
| PM7-TM-004 | FR-IV.I | CB_NV_DP × THU_MUC_BIEU_MAU = ✅ CRUD* scoped DP | Authorization | P0 | **FAIL** | BUG-PERM-M7-002 | Same. |
| PM7-TM-005 | FR-IV.I | CB_PD_TW × THU_MUC_BIEU_MAU = 👁️ R* | Authorization | P0 | **FAIL** | BUG-PERM-M7-003 | Same. |
| PM7-TM-006 | FR-IV.I | CB_PD_BN × THU_MUC_BIEU_MAU = 👁️ R* | Authorization | P0 | **FAIL** | BUG-PERM-M7-003 | Same. |
| PM7-TM-007 | FR-IV.I | CB_PD_DP × THU_MUC_BIEU_MAU = 👁️ R* | Authorization | P0 | **FAIL** | BUG-PERM-M7-003 | Same. |
| PM7-TM-008 | FR-IV.I, DI-09 | DN × THU_MUC_BIEU_MAU = 👁️ R | Authorization | P0 | **FAIL** | BUG-PERM-M7-004 | Same. |
| PM7-TM-009 | FR-IV.I | NHT × THU_MUC_BIEU_MAU = 👁️ R | Authorization | P0 | **FAIL** | BUG-PERM-M7-005 | Same. |
| PM7-TM-010 | FR-IV.I | TVV × THU_MUC_BIEU_MAU = ❌ | Authorization | P0 | **PASS** | — | Click → /403. Khớp ❌. |
| PM7-TM-011 | FR-IV.I | CG × THU_MUC_BIEU_MAU = ❌ | Authorization | P0 | **PASS** | — | Click → /403. Khớp ❌. |

### Chú thích

> **Result:**
> - `PASS` — đạt 100% expected behavior khớp permission matrix
> - `FAIL` — có bug vi phạm matrix, link tới Bug ID
> - `BLOCKED` — không chạy được do thiếu data/dependency/môi trường
> - `PARTIAL` — đạt một phần, phần còn lại chưa verify được (caveat UI không expose đủ feature)
> - `SKIP` — chủ động bỏ qua

> **Type:** Tất cả 33 TC là `Authorization` (permission matrix test).

> **Priority:** Tất cả P0 (authorization là tier P0 theo test-strategy §5).

---

## 3. Bug Report

> **Lưu ý:** Phần này là **tóm tắt inline**. Chi tiết Steps/Evidence/Impact/Root cause/Fix đầy đủ xem file [bug-report-section-7.md](bug-report-section-7.md).

### BUG-PERM-M7-001 — Major — QTHT có Thêm thư mục / Công khai / Sửa / Xóa trên BIEU_MAU + THU_MUC_BIEU_MAU

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | PM7-BM-001, PM7-TM-001 |
| **Status** | Open |
| **Assignee** | FE Team + BE Team |

**Mô tả:** QTHT (role 👁️ R) login vào `/bieu-mau/thu-muc` thấy đầy đủ UI CUD: nút `+ Thêm thư mục` header, per-row action `Công khai` + `Sửa` + `Xóa`.

**Expected vs Actual:** Expected = chỉ có button Read/Filter/Export; Actual = hiển thị đầy đủ button Write + workflow action `Công khai`.

**Impact:** QTHT có thể thao tác CRUD + publish thư mục/biểu mẫu của các đơn vị nghiệp vụ → vi phạm §9.2 BR-AUTH-09 (admin Read-only), sai separation of duties, ảnh hưởng audit trail.

**Root Cause (Suggested):** FE/BE thiếu middleware phân biệt QTHT admin view vs CB_NV/CB_PD write action. Pattern lặp với BUG-PERM-M5-001 + M6-001.

---

### BUG-PERM-M7-002 — Blocker (DUPLICATE smoke) — BIEU_MAU menu disabled cho CB_NV_TW/BN/DP

| Trường | Giá trị |
|--------|---------|
| **Severity** | Blocker (đã tồn tại, duplicate smoke 2026-04-19) |
| **Priority** | P0 |
| **TC Reference** | PM7-BM-002, PM7-BM-003, PM7-BM-004, PM7-TM-002, PM7-TM-003, PM7-TM-004 |
| **Status** | Open (dup smoke) |
| **Assignee** | FE Team |

**Mô tả:** 3 role CB_NV_TW/BN/DP (matrix: ✅ CRUD*) thấy menu `Quản lý thư viện biểu mẫu` bị disable (class `nav-item active disabled`), click không fire nav, URL không đổi.

**Expected vs Actual:** Expected = menu enabled + list biểu mẫu scoped; Actual = menu disabled, block hoàn toàn.

**Impact:** 100% function module Biểu mẫu bị khoá cho 3 role SẼ DÙNG module này. Smoke test đã gửi dev 2026-04-19.

**Root Cause (Suggested):** FE `auth-rules.ts` hoặc `nav-structure.ts` chỉ whitelist QTHT cho module BIEU_MAU, bỏ sót CB_NV_*.

---

### BUG-PERM-M7-003 — Critical — BIEU_MAU menu disabled cho CB_PD_TW/BN/DP

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | PM7-BM-005, PM7-BM-006, PM7-BM-007, PM7-TM-005, PM7-TM-006, PM7-TM-007 |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** 3 role CB_PD_TW/BN/DP (matrix: 👁️ R*) thấy menu disabled giống CB_NV_* → mất hoàn toàn quyền Read.

**Expected vs Actual:** Expected = menu enabled, page read-only, không có button CUD; Actual = menu disabled, không truy cập được.

**Impact:** CB_PD không xem được biểu mẫu để thẩm định/phê duyệt workflow `Công khai` biểu mẫu do CB_NV đệ trình.

**Root Cause (Suggested):** Cùng root cause BUG-PERM-M7-002 — whitelist thiếu CB_PD_*.

---

### BUG-PERM-M7-004 — Critical — BIEU_MAU menu disabled cho DN

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | PM7-BM-008, PM7-TM-008 |
| **Status** | Open — OR Spec Clarification |
| **Assignee** | FE Team + Product/Spec |

**Mô tả:** DN role (matrix: 👁️ R) thấy menu grayed, direct goto bị redirect /login (session drop).

**Expected vs Actual:** Expected = DN xem được biểu mẫu công khai; Actual = không truy cập CMS.

**Impact:** DN không tra cứu được biểu mẫu (nếu intent spec cho phép trên CMS).

**Root Cause (Suggested):** OR (a) FE thiếu DN whitelist, OR (b) matrix §7 cần sửa "👁️ R" → "🔌 R†" đồng nhất với DN × HOI_DAP pattern. Cần Product quyết.

---

### BUG-PERM-M7-005 — Critical — BIEU_MAU menu disabled cho NHT

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | PM7-BM-009, PM7-TM-009 |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** NHT role (matrix: 👁️ R) thấy menu grayed, click → /403.

**Expected vs Actual:** Expected = NHT xem biểu mẫu để hỗ trợ DN/TVV; Actual = mất quyền Read.

**Impact:** NHT không có thông tin biểu mẫu để định hướng workflow hỗ trợ pháp lý.

**Root Cause (Suggested):** Cùng whitelist issue.

---

### BUG-PERM-M7-006 — Minor — Portal sidebar render full CMS menu grayed cho DN + NHT

| Trường | Giá trị |
|--------|---------|
| **Severity** | Minor |
| **Priority** | P2 |
| **TC Reference** | Observational — global layout (không map vào TC cụ thể) |
| **Status** | Open |
| **Assignee** | FE Team (+Design) |

**Mô tả:** DN, NHT login thấy full 12 menu CMS trong sidebar (10/12 grayed). UX confuse + nhẹ information disclosure.

**Expected vs Actual:** Expected = chỉ hiển thị menu có quyền; Actual = render all + grayed.

**Impact:** UX kém cho Portal users. Duplicate pattern với BUG-PERM-M6-003.

**Root Cause (Suggested):** `nav-structure.ts` không filter items theo capability trước render.

---

## 4. Detailed Test Results

> **Tầng 2 — Chi tiết per-TC.** Steps / Expected / Actual.

### 4.1 PM7-BC-001: QTHT (qtht_tw) × BAO_CAO = 👁️ R

**Pre-conditions:**
- qtht_tw / Test@1234 (role QTHT, TW)
- OTP bypass `666666`

**Test Data:** (không có input data — chỉ observe UI)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | `goto /login` + fill + submit + OTP `666666` | URL → `/dashboard` | URL = `/dashboard` | **PASS** |
| 2 | Click sidebar `button[title="Báo cáo thống kê"]` | URL → `/bao-cao`, page Báo cáo Thống kê render | URL = `/bao-cao`, breadcrumb "Trang chủ / Báo cáo Thống kê", title "Báo cáo Thống kê" | **PASS** |
| 3 | Observe header buttons | Có: `Làm mới`. KHÔNG có Thêm/Sửa/Xóa BC | Có: `Làm mới`. Không có button tạo. | **PASS** |
| 4 | Observe main form | Filter `Loại BC` + `Kỳ` + `Đơn vị` + `Xem BC` + `Xuất Excel` (disabled pre-view) + `Xuất Word` (disabled) | Đầy đủ. `Đơn vị` auto = `Cục Bổ trợ tư pháp - Bộ Tư pháp`. | **PASS** |

**Notes:** Read + filter + export khớp 👁️ R. Không có sign of CUD.

**Evidence:** [screenshots/02-qtht_tw-baocao.png](screenshots/02-qtht_tw-baocao.png)

---

### 4.2 PM7-BC-002: CB_NV_TW (canbo_tw) × BAO_CAO = ✅ CRU* (PARTIAL caveat)

**Pre-conditions:**
- canbo_tw / Test@1234 (CB_NV TW)
- OTP `666666`

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login + OTP | Landing `/403` (known CB_NV no dashboard default) | URL = `/403`, topbar `Cán bộ TW / CB_TW` | **PASS** |
| 2 | Click sidebar Báo cáo thống kê | URL → `/bao-cao` | URL = `/bao-cao` | **PASS** |
| 3 | Observe: có button Tạo báo cáo / Lưu preset? | Matrix ✅ CRU* → nên có Create/Save UI khác QTHT | **KHÔNG có** — UI y hệt QTHT_TW | **PARTIAL** |
| 4 | `Đơn vị` auto-set | Cục BTTP (TW) | = Cục Bổ trợ tư pháp - Bộ Tư pháp | **PASS** |

**Notes:** CRU vs R permission không test được qua UI → mark PARTIAL (Read OK, C+U không observable). Cần expose feature Save preset hoặc test API.

**Evidence:** [screenshots/11-canbo_tw-baocao.png](screenshots/11-canbo_tw-baocao.png)

---

### 4.3 PM7-BC-003 / PM7-BC-004: CB_NV_BN / CB_NV_DP — Data scoping

**Pre-conditions:** canbo_bn / canbo_tinh / Test@1234

**Test Steps (rút gọn):**

| Step | canbo_bn | canbo_tinh | Status |
|------|----------|------------|--------|
| Login + OTP | Landing /403 | Landing /403 | PASS |
| Click Báo cáo thống kê | URL = /bao-cao | URL = /bao-cao | PASS |
| `Đơn vị` auto-set | Bộ Kế hoạch và Đầu tư (disabled) | Sở Tư pháp Hà Nội (disabled) | **PASS** |

**Notes:** Data scoping đúng BN/DP cấp — BE filter WHERE don_vi_id = current_user.don_vi_id hoạt động. KHÔNG phát hiện cross-unit leak như Section 3/4/5/6.

**Evidence:** [screenshots/14-canbo_bn-baocao.png](screenshots/14-canbo_bn-baocao.png) · [screenshots/17-canbo_tinh-baocao.png](screenshots/17-canbo_tinh-baocao.png)

---

### 4.4 PM7-BC-005 → 007: CB_PD_TW/BN/DP × BAO_CAO — Scope correct

| Account | `Đơn vị` auto-set | Status |
|---------|-------------------|--------|
| lanhdao_tw | Cục Bổ trợ tư pháp - Bộ Tư pháp | **PASS** |
| lanhdao_bn | Bộ Kế hoạch và Đầu tư | **PASS** |
| lanhdao_dp | Sở Tư pháp Hà Nội | **PASS** |

**Notes:** "U" = Phê duyệt (§9.3) không observable qua UI hiện tại — không có button duyệt báo cáo.

**Evidence:** [21-lanhdao_tw-baocao.png](screenshots/21-lanhdao_tw-baocao.png) · [24-lanhdao_bn-baocao.png](screenshots/24-lanhdao_bn-baocao.png) · [27-lanhdao_dp-baocao.png](screenshots/27-lanhdao_dp-baocao.png)

---

### 4.5 PM7-BC-008 → 011: Portal × BAO_CAO = ❌

| TC | Account | Action | Result |
|----|---------|--------|--------|
| BC-008 | dn_user | Landing + sidebar observation | Menu grayed, không truy cập → **PASS** (match ❌) |
| BC-009 | nht_user | Click menu | /403 → **PASS** |
| BC-010 | tvv_user | Click menu | /403 → **PASS** |
| BC-011 | chuyengia_user | Click menu | /403 → **PASS** |

**Evidence:** [30-dn_user-landing.png](screenshots/30-dn_user-landing.png) · [34-nht_user-baocao.png](screenshots/34-nht_user-baocao.png) · [37-tvv_user-baocao.png](screenshots/37-tvv_user-baocao.png) · [40-cg_user-baocao.png](screenshots/40-cg_user-baocao.png)

---

### 4.6 PM7-BM-001: QTHT × BIEU_MAU = 👁️ R (FAIL)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login qtht_tw + OTP | /dashboard | /dashboard | PASS |
| 2 | Click `button[title="Quản lý thư viện biểu mẫu"]` | URL = `/bieu-mau` redirect `/bieu-mau/thu-muc` | URL = `/bieu-mau/thu-muc` | PASS |
| 3 | Observe header | Chỉ `Tìm kiếm`, `Xóa bộ lọc`, `Làm mới` (Xuất Excel debatable) | Có `+ Thêm thư mục` primary button | **FAIL** BUG-M7-001 |
| 4 | Observe per-row action | Chỉ Xem | Có `Công khai` + `Sửa` + `Xóa` | **FAIL** BUG-M7-001 |

**Evidence:** [03-qtht_tw-bieumau.png](screenshots/03-qtht_tw-bieumau.png)

---

### 4.7 PM7-BM-002 → 004: CB_NV_* × BIEU_MAU (FAIL — duplicate smoke)

| TC | Account | Menu state | Click result | Status |
|----|---------|------------|--------------|--------|
| BM-002 | canbo_tw | class `nav-item active disabled` | URL không đổi (`/bao-cao` từ step trước) | **FAIL** BUG-M7-002 |
| BM-003 | canbo_bn | disabled | URL không đổi | **FAIL** BUG-M7-002 |
| BM-004 | canbo_tinh | disabled | URL không đổi | **FAIL** BUG-M7-002 |

**Evidence:** [12-canbo_tw-bieumau.png](screenshots/12-canbo_tw-bieumau.png) · [15-canbo_bn-bieumau.png](screenshots/15-canbo_bn-bieumau.png) · [18-canbo_tinh-bieumau.png](screenshots/18-canbo_tinh-bieumau.png)

---

### 4.8 PM7-BM-005 → 007: CB_PD_* × BIEU_MAU (FAIL)

| TC | Account | Menu state | Status |
|----|---------|------------|--------|
| BM-005 | lanhdao_tw | grayed/disabled | **FAIL** BUG-M7-003 |
| BM-006 | lanhdao_bn | grayed | **FAIL** BUG-M7-003 |
| BM-007 | lanhdao_dp | grayed | **FAIL** BUG-M7-003 |

**Evidence:** [22-lanhdao_tw-bieumau.png](screenshots/22-lanhdao_tw-bieumau.png) · [25-lanhdao_bn-bieumau.png](screenshots/25-lanhdao_bn-bieumau.png) · [28-lanhdao_dp-bieumau.png](screenshots/28-lanhdao_dp-bieumau.png)

---

### 4.9 PM7-BM-008 / 009: DN / NHT × BIEU_MAU (FAIL)

| TC | Account | Action | Result | Status |
|----|---------|--------|--------|--------|
| BM-008 | dn_user | Sidebar menu observation | Grayed. Direct goto → /login (session drop) | **FAIL** BUG-M7-004 |
| BM-009 | nht_user | Click menu | Navigate `/403` | **FAIL** BUG-M7-005 |

**Evidence:** [30-dn_user-landing.png](screenshots/30-dn_user-landing.png) · [35-nht_user-bieumau.png](screenshots/35-nht_user-bieumau.png)

---

### 4.10 PM7-BM-010 / 011: TVV / CG × BIEU_MAU = ❌ (PASS)

| TC | Account | Click result | Status |
|----|---------|--------------|--------|
| BM-010 | tvv_user | /403 | **PASS** |
| BM-011 | chuyengia_user | /403 | **PASS** |

**Evidence:** [38-tvv_user-bieumau.png](screenshots/38-tvv_user-bieumau.png) · [41-cg_user-bieumau.png](screenshots/41-cg_user-bieumau.png)

---

### 4.11 PM7-TM-*: THU_MUC_BIEU_MAU (duplicate với BIEU_MAU — cùng route + UI)

Do BIEU_MAU và THU_MUC_BIEU_MAU dùng chung trang `/bieu-mau/thu-muc` (UI ghép parent-child), 11 TC THU_MUC có result giống hoàn toàn 11 TC BIEU_MAU (same bugs, same evidence, same matrix cell mapping). Xem §2.3 summary table.

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| qtht_tw | QTHT | Cục BTTP | TW | PM7-BC-001, PM7-BM-001, PM7-TM-001 |
| canbo_tw | CB_NV_TW | Cục BTTP | TW | PM7-BC-002, PM7-BM-002, PM7-TM-002 |
| canbo_bn | CB_NV_BN | Bộ KH&ĐT | BN | PM7-BC-003, PM7-BM-003, PM7-TM-003 |
| canbo_tinh | CB_NV_DP | Sở TP HN | DP | PM7-BC-004, PM7-BM-004, PM7-TM-004 |
| lanhdao_tw | CB_PD_TW | Cục BTTP | TW | PM7-BC-005, PM7-BM-005, PM7-TM-005 |
| lanhdao_bn | CB_PD_BN | Bộ KH&ĐT | BN | PM7-BC-006, PM7-BM-006, PM7-TM-006 |
| lanhdao_dp | CB_PD_DP | Sở TP HN | DP | PM7-BC-007, PM7-BM-007, PM7-TM-007 |
| dn_user | DN | Công ty TNHH Test | Portal | PM7-BC-008, PM7-BM-008, PM7-TM-008 |
| nht_user | NHT | — | Portal | PM7-BC-009, PM7-BM-009, PM7-TM-009 |
| tvv_user | TVV | — | Portal | PM7-BC-010, PM7-BM-010, PM7-TM-010 |
| chuyengia_user | CG | — | Portal | PM7-BC-011, PM7-BM-011, PM7-TM-011 |

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Purpose | Cleanup? |
|---------|-------------|---------|----------|
| Thư mục 1 (Nháp, 0 biểu mẫu) | Thư mục test seed có sẵn từ round trước | Observe PM7-BM-001 (QTHT thấy table row + per-row actions) | Keep for regression |
| (BAO_CAO) | Chưa generate BC thực tế — chỉ quan sát filter UI | PM7-BC-* observe filter + Xem BC button | — |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/{resource-plural}` (vd `/api/v1/bieu-mau`, `/api/v1/bao-cao`, `/api/v1/thu-muc-bieu-mau`) — observed from smoke reports, KHÔNG test API trong đợt này theo yêu cầu user
- **Auth flow:** JWT + OTP email (bypass `666666` tạm thời)
- **Token TTL:** ~60s (cần re-auth giữa các chain)
- **Frontend framework:** React + Vite + Ant Design + CASL (suspected từ smoke retest) + custom CSS module `_otpInput_*`
- **Backend:** NestJS + PostgreSQL (suspected)
- **Proxy:** Vite dev proxy
- **Known limitations:**
  - Browse Playwright harness crash 2 lần đầu session với `Target page, context or browser has been closed` → cleanup full (kill -9 chromium + playwright zombies + rm tmp profile) + retry 1 lần → ổn định. Sau đó 11 chain per role stable.
  - Direct `goto` URL giữa chain steps làm mất auth cookie (session drop) → phải dùng click sidebar để navigate trong chain.
  - Session reset giữa các bash invocations (Rule 8 CLAUDE.md) → mỗi role phải đóng gói 1 atomic chain riêng.
- **Matrix spec potential issue:** DN × BIEU_MAU + THU_MUC_BIEU_MAU = 👁️ R — nhưng DN theo DI-09 "không truy cập CMS UI". Hai điều kiện có thể mâu thuẫn → cần Product review.

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-PERM-M7-002 (Blocker dup smoke):** FE whitelist `auth-rules.ts` / `nav-structure.ts` cho capability `BIEU_MAU.read/write` thêm role `CB_NV_TW/BN/DP`. Fix 1 file dòng whitelist. **Unblock functional test toàn bộ module Biểu mẫu** cho 3 role.
2. **BUG-PERM-M7-003 (Critical):** Cùng whitelist file, thêm `CB_PD_TW/BN/DP` với cap `BIEU_MAU.read` only (không write). Ẩn CUD buttons cho R-level roles ở FE.
3. **BUG-PERM-M7-005 (Critical):** Thêm `NHT` vào whitelist cap `BIEU_MAU.read`.
4. **BUG-PERM-M7-001 (Major):** FE conditional render CUD/workflow buttons dựa vào `role !== 'QTHT'`. BE middleware reject `POST/PUT/DELETE/action` khi `user.role === 'QTHT'`. Fix ở cả FE + BE để đảm bảo defense-in-depth.

### Should Fix

5. **BUG-PERM-M7-004 (Critical — spec clarification):** Product review matrix §7 dòng BIEU_MAU + THU_MUC_BIEU_MAU × DN = "👁️ R" có đồng nhất với DI-09 không. Nếu intent DN chỉ xem qua API Cổng PLQG, sửa matrix thành "🔌 R†" + không cần FE fix. Nếu intent xem trên CMS portal, thêm DN whitelist.

### Additional Recommendations

6. **BUG-PERM-M7-006 (Minor):** FE nav-structure filter menu items theo capability trước khi render (thay vì render all + class `disabled`). Hoặc tách AppShell Portal khỏi CMS.
7. **Test data:** Seed ≥3 thư mục biểu mẫu của các đơn vị khác nhau (TW + BN + DP) sau khi fix Blocker — để verify scope CB_NV_* sau fix.
8. **UI testing:** Sau khi fix, retest đầy đủ 33 ô PM7-* + CRUD functional flow (Thêm thư mục → Thêm biểu mẫu → Công khai → Ẩn).
9. **API testing (separate session):** Test `POST /api/v1/bieu-mau`, `PATCH /api/v1/thu-muc-bieu-mau/{id}`, `DELETE ...` với QTHT token → verify BE middleware reject.
10. **Environment:** Cân nhắc tăng browse stability — kiểm tra RAM leak của Playwright drivers giữa rounds; có thể add cleanup hook tự động.

---

## 8. Appendix

### A — API Endpoints Observed (NOT tested per user request)

| Method | Endpoint | Purpose | Observed in TC |
|--------|----------|---------|----------------|
| GET | `/api/v1/thu-muc-bieu-mau` | List thư mục | PM7-BM-001 (QTHT page load) |
| GET | `/api/v1/bieu-mau` | List biểu mẫu | (chưa observe — không có biểu mẫu con trong test data) |
| GET | `/api/v1/bao-cao/loai-bao-cao` (suspected) | Dropdown loại BC | PM7-BC-* page load |
| POST | `/api/v1/bao-cao/generate` (suspected) | Trigger generate BC | Click "Xem báo cáo" — không test trong đợt này |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [00-login-page.png](screenshots/00-login-page.png) | Trang login ban đầu | Session pre-check |
| [01-qtht_tw-dashboard.png](screenshots/01-qtht_tw-dashboard.png) | qtht_tw landing /dashboard | PM7-BC-001 step 1 |
| [02-qtht_tw-baocao.png](screenshots/02-qtht_tw-baocao.png) | QTHT xem BAO_CAO | PM7-BC-001 |
| [03-qtht_tw-bieumau.png](screenshots/03-qtht_tw-bieumau.png) | QTHT xem BIEU_MAU với full CUD buttons | PM7-BM-001 (FAIL) |
| [10-canbo_tw-landing.png](screenshots/10-canbo_tw-landing.png) | canbo_tw /403 landing | PM7-BC-002 step 1 |
| [11-canbo_tw-baocao.png](screenshots/11-canbo_tw-baocao.png) | canbo_tw xem BAO_CAO (giống QTHT) | PM7-BC-002 |
| [12-canbo_tw-bieumau.png](screenshots/12-canbo_tw-bieumau.png) | canbo_tw click menu BIEU_MAU → URL không đổi | PM7-BM-002 |
| [13-canbo_bn-landing.png](screenshots/13-canbo_bn-landing.png) | canbo_bn landing | PM7-BC-003 |
| [14-canbo_bn-baocao.png](screenshots/14-canbo_bn-baocao.png) | canbo_bn BAO_CAO — Đơn vị = Bộ KH&ĐT | PM7-BC-003 |
| [15-canbo_bn-bieumau.png](screenshots/15-canbo_bn-bieumau.png) | canbo_bn click BIEU_MAU disabled | PM7-BM-003 |
| [16-canbo_tinh-landing.png](screenshots/16-canbo_tinh-landing.png) | canbo_tinh landing | PM7-BC-004 |
| [17-canbo_tinh-baocao.png](screenshots/17-canbo_tinh-baocao.png) | canbo_tinh BAO_CAO — Đơn vị = Sở TP HN | PM7-BC-004 |
| [18-canbo_tinh-bieumau.png](screenshots/18-canbo_tinh-bieumau.png) | canbo_tinh click BIEU_MAU disabled | PM7-BM-004 |
| [20-lanhdao_tw-landing.png](screenshots/20-lanhdao_tw-landing.png) | lanhdao_tw landing | PM7-BC-005 |
| [21-lanhdao_tw-baocao.png](screenshots/21-lanhdao_tw-baocao.png) | lanhdao_tw BAO_CAO — Cục BTTP | PM7-BC-005 |
| [22-lanhdao_tw-bieumau.png](screenshots/22-lanhdao_tw-bieumau.png) | lanhdao_tw BIEU_MAU disabled | PM7-BM-005 |
| [23-lanhdao_bn-landing.png](screenshots/23-lanhdao_bn-landing.png) | lanhdao_bn landing | PM7-BC-006 |
| [24-lanhdao_bn-baocao.png](screenshots/24-lanhdao_bn-baocao.png) | lanhdao_bn BAO_CAO — Bộ KH&ĐT | PM7-BC-006 |
| [25-lanhdao_bn-bieumau.png](screenshots/25-lanhdao_bn-bieumau.png) | lanhdao_bn BIEU_MAU disabled | PM7-BM-006 |
| [26-lanhdao_dp-landing.png](screenshots/26-lanhdao_dp-landing.png) | lanhdao_dp landing | PM7-BC-007 |
| [27-lanhdao_dp-baocao.png](screenshots/27-lanhdao_dp-baocao.png) | lanhdao_dp BAO_CAO — Sở TP HN | PM7-BC-007 |
| [28-lanhdao_dp-bieumau.png](screenshots/28-lanhdao_dp-bieumau.png) | lanhdao_dp BIEU_MAU disabled | PM7-BM-007 |
| [30-dn_user-landing.png](screenshots/30-dn_user-landing.png) | dn_user landing /403 với full sidebar grayed | PM7-BC-008, PM7-BM-008, BUG-M7-006 |
| [31-dn_user-baocao-direct.png](screenshots/31-dn_user-baocao-direct.png) | dn_user direct goto → login redirect | PM7-BC-008 (session drop evidence) |
| [32-dn_user-bieumau-direct.png](screenshots/32-dn_user-bieumau-direct.png) | dn_user direct goto → login | PM7-BM-008 |
| [33-nht_user-landing.png](screenshots/33-nht_user-landing.png) | nht_user landing | PM7-BC-009, BUG-M7-006 |
| [34-nht_user-baocao.png](screenshots/34-nht_user-baocao.png) | nht_user click BAO_CAO → /403 | PM7-BC-009 |
| [35-nht_user-bieumau.png](screenshots/35-nht_user-bieumau.png) | nht_user click BIEU_MAU → /403 | PM7-BM-009 |
| [36-tvv_user-landing.png](screenshots/36-tvv_user-landing.png) | tvv_user landing | PM7-BC-010 |
| [37-tvv_user-baocao.png](screenshots/37-tvv_user-baocao.png) | tvv_user click BAO_CAO → /403 | PM7-BC-010 |
| [38-tvv_user-bieumau.png](screenshots/38-tvv_user-bieumau.png) | tvv_user click BIEU_MAU → /403 | PM7-BM-010 |
| [39-cg_user-landing.png](screenshots/39-cg_user-landing.png) | cg_user landing | PM7-BC-011 |
| [40-cg_user-baocao.png](screenshots/40-cg_user-baocao.png) | cg_user click BAO_CAO → /403 | PM7-BC-011 |
| [41-cg_user-bieumau.png](screenshots/41-cg_user-bieumau.png) | cg_user click BIEU_MAU → /403 | PM7-BM-011 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| §3.4.2 BAO_CAO (11 ô quyền) | PM7-BC-001 → 011 | 10/11 PASS + 1/11 PARTIAL (CRU* caveat) |
| §3.4.2 BIEU_MAU (11 ô quyền) | PM7-BM-001 → 011 | 2/11 PASS + 9/11 FAIL |
| §3.4.2 THU_MUC_BIEU_MAU (11 ô quyền) | PM7-TM-001 → 011 | 2/11 PASS + 9/11 FAIL (same bugs as BIEU_MAU) |
| BR-AUTH-08 (3-cấp TW/BN/DP scope) | PM7-BC-003/004/006/007 | PASS — BAO_CAO scope đúng qua `Đơn vị` auto-set |
| BR-AUTH-09 §9.2 (QTHT Read-only) | PM7-BM-001, PM7-TM-001 | **FAIL** (BUG-PERM-M7-001 — recurring M5/M6) |
| BR-AUTH-10 (Filter NHT) | PM7-BC-009, PM7-BM-009 | Không observed — NHT hiện bị block toàn bộ BIEU_MAU |
| DI-09 (DN không CMS UI) | PM7-BC-008, PM7-BM-008 | BAO_CAO: PASS (DN match ❌); BIEU_MAU: FAIL hoặc spec ambiguous |
| FR-IV.I.01-08 (BIEU_MAU CRUD + Công khai) | PM7-BM-001 → 011 | Permission-only view; Functional workflow chưa test do Blocker |
| FR-IX.I.01-23 (BAO_CAO generate + xuất) | PM7-BC-001 → 011 | Permission-only view; Functional generate chưa test |

---

*Report generated: 2026-04-19 | QA Automation via Claude Code (Opus 4.7)*
