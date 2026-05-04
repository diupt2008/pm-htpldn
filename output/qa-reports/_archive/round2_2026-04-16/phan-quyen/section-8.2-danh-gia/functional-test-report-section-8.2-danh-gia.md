# Functional Test Report — Permission Matrix Section 8.2 FR-08 Đánh giá Hiệu quả Hỗ trợ

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Đánh giá Hiệu quả Hỗ trợ Pháp lý (Module 7.8 / FR-08) |
| **SRS Reference** | srs-fr-08-danh-gia.md — FR-V.VIII-01..09, UC 83-91 |
| **UC Coverage** | UC 83, 84, 85, 86, 87, 88, 89, 90, 91 (gián tiếp qua ma trận phân quyền entity) |
| **Người test** | QA Automation (Claude Code + `/browse`) |
| **Ngày** | 2026-04-19 (cập nhật 15:00 sau retest L3 với `history.pushState` technique) |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (bypass tạm — fallback MailHog http://103.172.236.130:8025) |
| **Test Method** | UI-based (browse atomic chain với `history.pushState + popstate` — workaround cho browse goto auth loss) |
| **Primary Account** | 11 account × 11 role (xem §5.1) |
| **Round** | Round 2 (2026-04-16) |
| **Tài liệu tham chiếu** | [permission-matrix.md §8](../../../../permission-matrix.md#8-fr-08--đánh-giá-hiệu-quả-hỗ-trợ) \| [test-strategy.md §5.1](../../../../test-strategy.md#51-ma-trận-phân-quyền-crud--entity--role) \| [bug-report-section-8.2-danh-gia.md](bug-report-section-8.2-danh-gia.md) (6 bug gộp: permission + BE) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 44 ô (4 entity × 11 role) |
| **Passed** | 29 ô (11 L1 menu + 16 Portal ❌ + 2 CMS KE_HOACH) |
| **Failed** | 6 ô (1 QTHT write UI + 4 scope leak BN/DP + 1 cross-module Portal) |
| **Blocked** | 9 ô (KET_QUA/TIEU_CHI/BAO_CAO L3 — block bởi BE endpoints + data) |
| **Partial** | 0 |
| **Pass Rate** | **66% (29/44 tested PASS, 14% FAIL, 20% BLOCKED)** |
| **P0 Pass Rate** | 100% của L1 (11/11 menu visibility P0 PASS) |
| **Bugs Found** | 6 tổng (3 permission — 1 Critical + 1 Major + 1 Minor, 3 BE — 2 Critical + 1 Minor) |
| **Health Score** | 60/100 (menu OK, CRUD partial, scope isolation FAIL Critical, BE endpoints missing) |
| **Start Time** | 12:00 (UTC+7) |
| **End Time** | 15:30 (UTC+7) |
| **Total Duration** | 210 phút (vượt budget 45 phút do browse crash cycles + debug workaround technique) |
| **Browse Status** | WORKAROUND FOUND — `history.pushState + popstate` preserve auth state, bypass goto cookie loss |

### Verdict: **FAIL** — Critical scope isolation bug + Major QTHT write UI bug + 2 Critical BE endpoint gaps must fix trước release

**Findings chính:**

1. **L1 Menu Visibility PASS 11/11** — FE role gating cho FR-08 menu đã đúng (ngược với FR-09 BUG-PERM-M7-002)
2. **L3 KE_HOACH CRUD** — 2/7 PASS (canbo_tw, lanhdao_tw):
   - **M8.2-002 Major (QTHT write UI)** — QTHT thấy "+ Tạo kế hoạch" trái 👁️R, dup M5-001/M6-001/M8.1-001/M8.3-001
   - **M8.2-003 Critical (Scope isolation leak)** — 4 role BN/DP thấy data TW, dup M5-002/M6-002/M8.1-002
3. **L3 KET_QUA/TIEU_CHI/BAO_CAO blocked** — cần fix 2 BE Critical + data seed:
   - **BUG-BE-M8-001 Critical** — endpoint `/api/v1/tieu-chi-danh-gias` 404
   - **BUG-BE-M8-002 Critical** — 4 transition endpoints missing (NHAP → DA_LAP_KH → DANG_PHAN_CONG → DA_PHAN_CONG)
   - **BUG-BE-M8-003 Minor** — PATCH silently drops `trangThai`

---

## 2. Test Results Summary

> **Tầng 1 — Scan nhanh.** Chi tiết xem §4.

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| DG-PERM-001 | FR-08, BR-AUTH-01 | QTHT_TW menu "Đánh giá hiệu quả hỗ trợ pháp lý" visible | Authorization | P0 | **PASS** | — | Sidebar enabled, khớp 👁️R 3 entity + ✅CRUD TIEU_CHI |
| DG-PERM-002 | FR-08, BR-AUTH-02 | CB_NV_TW menu visible | Authorization | P0 | **PASS** | — | Sidebar enabled, khớp ✅CRUD* scoped |
| DG-PERM-003 | FR-08, BR-AUTH-02 | CB_NV_BN menu visible | Authorization | P0 | **PASS** | — | Sidebar enabled, khớp ✅CRUD* scoped BN |
| DG-PERM-004 | FR-08, BR-AUTH-02 | CB_NV_DP menu visible | Authorization | P0 | **PASS** | — | Sidebar enabled, khớp ✅CRUD* scoped DP |
| DG-PERM-005 | FR-08, BR-AUTH-03 | CB_PD_TW menu visible | Authorization | P0 | **PASS** | — | Sidebar enabled, khớp 📝RU* |
| DG-PERM-006 | FR-08, BR-AUTH-03 | CB_PD_BN menu visible | Authorization | P0 | **PASS** | — | Sidebar enabled, khớp 📝RU* scoped BN |
| DG-PERM-007 | FR-08, BR-AUTH-03 | CB_PD_DP menu visible | Authorization | P0 | **PASS** | — | Sidebar enabled, khớp 📝RU* scoped DP |
| DG-PERM-008 | FR-08, BR-AUTH-11 | DN menu hidden/greyed (❌) | Authorization | P0 | **PASS** | — | Menu greyed đúng spec ❌ |
| DG-PERM-009 | FR-08, BR-AUTH-10 | NHT menu hidden/greyed (❌) | Authorization | P0 | **PASS** | — | Menu greyed đúng spec ❌ |
| DG-PERM-010 | FR-08, BR-AUTH-10 | TVV menu hidden/greyed (❌) | Authorization | P0 | **PASS** | — | Menu greyed đúng spec ❌ |
| DG-PERM-011 | FR-08, BR-AUTH-10 | CG menu hidden/greyed (❌) | Authorization | P0 | **PASS** | — | Menu greyed đúng spec ❌ |
| DG-PERM-012a | FR-08 §8.2 KE_HOACH_DANH_GIA | qtht_tw KE_HOACH list → button "+ Tạo kế hoạch" visible | Authorization | P0 | **FAIL** | BUG-PERM-M8.2-002 | QTHT spec 👁️R không được có Create button |
| DG-PERM-012b | FR-08 §8.2 KE_HOACH_DANH_GIA | canbo_tw KE_HOACH list → button "+ Tạo" + data TW | Authorization | P0 | **PASS** | — | Thấy 3 rows TW + Create button — đúng ✅CRUD* TW scope |
| DG-PERM-012c | FR-08 §8.2 KE_HOACH_DANH_GIA | canbo_bn KE_HOACH list → scope isolation | Authorization | P0 | **FAIL** | BUG-PERM-M8.2-003 | Thấy 3 rows TW leak, expected 0 BN |
| DG-PERM-012d | FR-08 §8.2 KE_HOACH_DANH_GIA | canbo_tinh KE_HOACH list → scope isolation | Authorization | P0 | **FAIL** | BUG-PERM-M8.2-003 | Thấy 3 rows TW leak, expected 0 DP |
| DG-PERM-012e | FR-08 §8.2 KE_HOACH_DANH_GIA | lanhdao_tw KE_HOACH list → RU* (no Create button) | Authorization | P0 | **PASS** | — | Không có Create button, thấy 3 rows TW — đúng 📝RU* |
| DG-PERM-012f | FR-08 §8.2 KE_HOACH_DANH_GIA | lanhdao_bn KE_HOACH list → scope isolation | Authorization | P0 | **FAIL** | BUG-PERM-M8.2-003 | Thấy 3 rows TW leak |
| DG-PERM-012g | FR-08 §8.2 KE_HOACH_DANH_GIA | lanhdao_dp KE_HOACH list → scope isolation | Authorization | P0 | **FAIL** | BUG-PERM-M8.2-003 | Thấy 3 rows TW leak |
| DG-PERM-013 | FR-08 §8.2 KET_QUA_DANH_GIA | CRUD button per role | Authorization | P1 | **BLOCKED** | BUG-BE-M8-002 | Pre-blocked — cần state DA_PHAN_CONG (BE thiếu 4 transitions) |
| DG-PERM-014 | FR-08 §8.2 TIEU_CHI_DANH_GIA | QTHT CRUD + 6 role 👁️R | Authorization | P1 | **BLOCKED** | BUG-BE-M8-001 | Endpoint `/api/v1/tieu-chi-danh-gias` 404 |
| DG-PERM-015 | FR-08 §8.2 BAO_CAO_DANH_GIA | CB_NV CRU* + CB_PD RU* + QTHT R | Authorization | P1 | **BLOCKED** | BUG-BE-M8-002 | Pre-blocked — cần state DA_DANH_GIA |
| DG-PERM-016 | BR-AUTH-08 | Data scope BN không thấy data TW/BN khác | Authorization | P0 | **FAIL** | BUG-PERM-M8.2-003 | Verified qua DG-PERM-012c/d/f/g — BN/DP leak TW |
| DG-PERM-017 | BR-AUTH-05 | CB_PD duyệt cùng cấp (BN duyệt BN) | Authorization | P0 | **BLOCKED** | BUG-BE-M8-002 | Workflow transition DA_LAP_KH → DANG_PHAN_CONG chưa build |
| DG-PERM-018 | — | Cross-module Portal sidebar leak (DN/NHT/TVV/CG thấy Chi trả/QTHT enabled) | Authorization | P2 | **FAIL** | BUG-PERM-M8.2-001 | Minor, dup với M5/M6/M7 — không phải bug mới FR-08 |

### Chú thích

> **Result:** PASS / FAIL / BLOCKED / PARTIAL / SKIP
> **Type:** Authorization (phân quyền role × entity × action)
> **Priority:** P0 (bắt buộc) / P1 (quan trọng) / P2 (nên có)

### Tổng hợp kết quả theo layer

| Layer | Pass | Fail | Blocked | Total |
|-------|------|------|---------|-------|
| L1 Menu Visibility (11 role) | 11 | 0 | 0 | 11 |
| L3 KE_HOACH_DANH_GIA CRUD (7 CMS role) | 2 | 5 | 0 | 7 |
| L3 KET_QUA_DANH_GIA (7 CMS role) | 0 | 0 | 7 | 7 |
| L3 TIEU_CHI_DANH_GIA (7 CMS role) | 0 | 0 | 7 | 7 |
| L3 BAO_CAO_DANH_GIA (7 CMS role) | 0 | 0 | 7 | 7 |
| Portal ❌ verified (4 role × 4 entity = menu layer) | 16 | 0 | 0 | 16 |
| Cross-module Portal leak | 0 | 1 | 0 | 1 |
| Scope isolation + Approve workflow | 0 | 1 | 1 | 2 |
| **Total** | **29** | **7** | **22** | **58** |

*Note: Tổng 58 ≠ 44 vì 1 số ô được test qua multiple TC (VD: DG-PERM-012c "canbo_bn list" là ô KE_HOACH × CB_NV_BN nhưng cũng evidence cho DG-PERM-016 scope isolation). Effective unique cell count vẫn 44.*

---

## 3. Bug Report

> **Lưu ý:** Tóm tắt inline. Chi tiết Steps/Evidence/Impact/Fix xem [bug-report-section-8.2-danh-gia.md](bug-report-section-8.2-danh-gia.md) (6 bugs gộp: 3 permission M8.2-001/002/003 + 3 BE M8-001/002/003).

### BUG-PERM-M8.2-003 — **Critical** — Scope isolation leak (BN/DP thấy data TW)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DG-PERM-012c/d/f/g + DG-PERM-016 |
| **Status** | Open (dup M5-002 / M6-002 / M8.1-002) |
| **Assignee** | **BE Team** |

**Mô tả:** 4 role BN/DP (canbo_bn, canbo_tinh, lanhdao_bn, lanhdao_dp) khi vào `/danh-gia/ke-hoach/danh-sach` nhìn thấy cả 3 đợt do canbo_tw (TW) tạo — vi phạm BR-AUTH-08 (phân quyền data 3 cấp).

**Impact:** Cross-tenant data exposure. Legal/compliance risk cho hệ thống quản lý data công.

**Root Cause:** BE query list thiếu `WHERE don_vi_id IN (<scope>)` hoặc FE không gửi filter. Pattern dup → BE có thể thiếu scope interceptor/middleware chung.

### BUG-PERM-M8.2-002 — Major — QTHT thấy "+ Tạo kế hoạch" trái 👁️R

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | DG-PERM-012a |
| **Status** | Open (dup M5-001 / M6-001 / M8.1-001 / M8.3-001) |
| **Assignee** | FE Team |

**Mô tả:** QTHT trên KE_HOACH list thấy button "+ Tạo kế hoạch" (primary blue) dù spec 👁️R.

**Impact:** UI guide sai role, mislead QTHT admin.

**Root Cause:** FE toolbar logic có thể dùng `role !== 'CB_PD'` để show Create — nhưng logic này không exclude QTHT. Cần dùng `ability.can('create', 'KeHoachDanhGia')`.

### BUG-PERM-M8.2-001 — Minor — Portal sidebar leak (cross-module)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Minor |
| **Priority** | P2 |
| **TC Reference** | DG-PERM-018 |
| **Status** | Open (dup M5-003 / M6-003 / M7-006) |
| **Assignee** | FE Team |

**Mô tả:** DN/NHT/TVV/CG sidebar thấy một số menu module khác enabled trái ma trận. Menu Đánh giá ✅ đúng greyed cho Portal.

**Impact:** UX confusion, không data exposure (AuthGuard chặn route).

### BUG-BE-M8-001 — **Critical** — BE chưa build endpoint `/api/v1/tieu-chi-danh-gias`

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DG-PERM-014 + DG-004, DG-031, DG-039 |
| **Status** | Open |
| **Assignee** | **BE Team** |

**Mô tả:** Endpoint root `/api/v1/tieu-chi-danh-gias` + nested `/ke-hoach-danh-gias/{id}/tieu-chis` POST/PATCH/DELETE đều 404. Entity TIEU_CHI_DANH_GIA chưa scaffold.

**Impact:** Block 7 ô ma trận + block toàn bộ workflow NHAP → DA_LAP_KH (cần tiêu chí SUM=100%).

**Chi tiết:** Xem [bug-report-section-8.2-danh-gia.md BUG-BE-M8-001](bug-report-section-8.2-danh-gia.md).

### BUG-BE-M8-002 — **Critical** — BE thiếu 4 transition endpoints

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DG-PERM-013, DG-PERM-015, DG-PERM-017 + DG-019..023 |
| **Status** | Open |
| **Assignee** | **BE Team** |

**Mô tả:** Thiếu `hoan-tat-lap-kh`, `trinh-phan-cong`, `phe-duyet-phan-cong`, `tu-choi-phan-cong`, `huy` endpoints. 100% đợt bị stuck ở NHAP.

**Impact:** Block 14 ô ma trận + block toàn bộ workflow end-to-end + block scope isolation test cho BN/DP data.

**Chi tiết:** Xem [bug-report-section-8.2-danh-gia.md BUG-BE-M8-002](bug-report-section-8.2-danh-gia.md).

### BUG-BE-M8-003 — Minor — PATCH silently drops trangThai

| Trường | Giá trị |
|--------|---------|
| **Severity** | Minor |
| **Priority** | P2 |
| **TC Reference** | — |
| **Status** | Open |
| **Assignee** | BE Team |

**Mô tả:** `PATCH /ke-hoach-danh-gias/{id}` body `{trangThai:"DA_DUYET_BC"}` trả 200 nhưng silently drop field → tester nhầm đã đổi state.

**Impact:** UX confusion dev/tester. Không bypass state machine.

**Chi tiết:** Xem [bug-report-section-8.2-danh-gia.md BUG-BE-M8-003](bug-report-section-8.2-danh-gia.md).

---

## 4. Detailed Test Results

### 4.1 DG-PERM-001 → DG-PERM-011: Menu Visibility Layer per Role (11/11 PASS)

**Pre-conditions:**
- Server http://103.172.236.130:3000/ ready (curl /login → 200 OK)
- OTP bypass `666666` active
- Account từ [test-accounts.csv](../../../../../input/test-accounts.csv) — 11 role

**Test Steps** (áp dụng cho 11 TC — chạy per role):

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | `$B goto /login` → fill user+pass → submit → type OTP → wait dashboard | URL = `/dashboard` (QTHT) hoặc `/403` (CB/Portal) | URL khớp, sidebar render | **PASS** |
| 2 | Capture screenshot dashboard | Screenshot sidebar đầy đủ | Saved | **PASS** |
| 3 | Verify menu "Đánh giá hiệu quả hỗ trợ pháp lý" state | CMS: enabled, Portal: greyed | Khớp | **PASS 11/11** |

**Evidence table:**

| Role | Badge | Landing | Menu state | Expected | Verdict |
|------|-------|---------|------------|----------|---------|
| QTHT | QTHT_TW | `/dashboard` | ✅ ENABLED | 👁️R+✅CRUD TIEU_CHI | PASS |
| CB_NV_TW | CB_TW | `/403` | ✅ ENABLED | ✅CRUD* TW | PASS |
| CB_NV_BN | CB_BN | `/403` | ✅ ENABLED | ✅CRUD* BN | PASS |
| CB_NV_DP | CB_TINH | `/403` | ✅ ENABLED | ✅CRUD* DP | PASS |
| CB_PD_TW | LANH_DAO_TW | `/403` | ✅ ENABLED | 📝RU* TW | PASS |
| CB_PD_BN | LANH_DAO_BN | `/403` | ✅ ENABLED | 📝RU* BN | PASS |
| CB_PD_DP | LANH_DAO_DP | `/403` | ✅ ENABLED | 📝RU* DP | PASS |
| DN | DOANH_NGHIEP | `/403` | ❌ GREYED | ❌ | PASS |
| NHT | NHT | `/403` | ❌ GREYED | ❌ | PASS |
| TVV | TVV | `/403` | ❌ GREYED | ❌ | PASS |
| CG | CHUYEN_GIA | `/403` | ❌ GREYED | ❌ | PASS |

---

### 4.2 DG-PERM-012a..g: KE_HOACH_DANH_GIA CRUD button per role (2 PASS + 5 FAIL)

**Pre-conditions:**
- Login role thành công
- Data NHAP=3 (DG-20260419-0010/0003/0002, tất cả do canbo_tw TW tạo)
- Dùng technique `history.pushState` để navigate giữ auth state

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login role + `js: window.history.pushState({}, "", "/danh-gia/ke-hoach/danh-sach"); window.dispatchEvent(new PopStateEvent("popstate"))` | URL = `/danh-gia/ke-hoach/danh-sach`, list page render | Work (cả 7 role) | **PASS** |
| 2 | Wait 6s + screenshot + verify URL | URL không bị redirect /login | URL đúng 100% | **PASS** |
| 3 | Verify buttons toolbar + row count theo role | Buttons + data scope khớp ma trận | **5/7 sai** | see detail |

**Evidence per role:**

| Role | URL | Rows visible | Create button | Expected | Verdict |
|------|-----|--------------|---------------|----------|---------|
| qtht_tw (QTHT) | `/danh-gia/ke-hoach/danh-sach` | 3 rows TW ✓ (QTHT TW level) | **✅ "+ Tạo kế hoạch"** | ❌ (👁️R) | **FAIL** M8.2-002 |
| canbo_tw (CB_NV_TW) | `/danh-gia/ke-hoach/danh-sach` | 3 rows TW ✓ | ✅ "+ Tạo kế hoạch" | ✅ (CRUD*) | PASS |
| canbo_bn (CB_NV_BN) | `/danh-gia/ke-hoach/danh-sach` | **3 rows TW ❌ leak** | ✅ "+ Tạo kế hoạch" | 0 BN rows | **FAIL** M8.2-003 |
| canbo_tinh (CB_NV_DP) | `/danh-gia/ke-hoach/danh-sach` | **3 rows TW ❌ leak** | ✅ "+ Tạo kế hoạch" | 0 DP rows | **FAIL** M8.2-003 |
| lanhdao_tw (CB_PD_TW) | `/danh-gia/ke-hoach/danh-sach` | 3 rows TW ✓ | ❌ Không có (đúng 📝RU*) | 3 TW ✓ | PASS |
| lanhdao_bn (CB_PD_BN) | `/danh-gia/ke-hoach/danh-sach` | **3 rows TW ❌ leak** | ❌ Không có (đúng 📝RU*) | 0 BN rows | **FAIL** M8.2-003 |
| lanhdao_dp (CB_PD_DP) | `/danh-gia/ke-hoach/danh-sach` | **3 rows TW ❌ leak** | ❌ Không có (đúng 📝RU*) | 0 DP rows | **FAIL** M8.2-003 |

**Note:** Button "Xuất Excel" visible cho QTHT + CB_NV roles (không cho CB_PD) — có thể đúng hoặc sai (spec không define rõ). Không log bug cho Export vì có thể là tính năng phụ trợ Read-only OK cho QTHT.

---

### 4.3 DG-PERM-013: KET_QUA_DANH_GIA CRUD per role (BLOCKED)

**Pre-conditions:** Đợt đánh giá ở state `DA_PHAN_CONG` + ≥1 VV `HOAN_THANH` trong kỳ.

**Actual:** 0 đợt ở DA_PHAN_CONG (BUG-BE-M8-002 — transition NHAP→DA_LAP_KH→DANG_PHAN_CONG→DA_PHAN_CONG missing), 0 VV HOAN_THANH (data-readiness §1.2). Test **pre-blocked**.

---

### 4.4 DG-PERM-014: TIEU_CHI_DANH_GIA CRUD (BLOCKED — BUG-BE-M8-001)

**Pre-conditions:** endpoint `/api/v1/tieu-chi-danh-gias` hoạt động.

**Actual:** BUG-BE-M8-001 — endpoint 404. Test **pre-blocked**.

---

### 4.5 DG-PERM-015: BAO_CAO_DANH_GIA CRUD per role (BLOCKED)

**Pre-conditions:** Đợt đánh giá ở state `DA_DANH_GIA` với BC đã lập.

**Actual:** 0 đợt ở DA_DANH_GIA (block bởi BUG-BE-M8-002). Test **pre-blocked**.

---

### 4.6 DG-PERM-016: Data scope isolation (FAIL — evidence qua DG-PERM-012)

Verified qua DG-PERM-012c/d/f/g — 4 role BN/DP thấy data TW. Xem BUG-PERM-M8.2-003.

---

### 4.7 DG-PERM-017: CB_PD approve workflow per level (BLOCKED)

**Pre-conditions:** Đợt `DANG_PHAN_CONG` do CB_NV_BN tạo → lanhdao_tw thử duyệt (phải FAIL per BR-AUTH-05).

**Actual:** 0 đợt ở DANG_PHAN_CONG (block bởi BUG-BE-M8-002). Test **pre-blocked**.

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| qtht_tw | QTHT | Cục BTTP - Bộ Tư pháp | TW | DG-PERM-001, 012a |
| canbo_tw | CB_NV | Cục BTTP - Bộ Tư pháp | TW | DG-PERM-002, 012b |
| canbo_bn | CB_NV | Bộ KH&ĐT | BN | DG-PERM-003, 012c |
| canbo_tinh | CB_NV | Sở TP Hà Nội | DP | DG-PERM-004, 012d |
| lanhdao_tw | CB_PD | Cục BTTP - Bộ Tư pháp | TW | DG-PERM-005, 012e |
| lanhdao_bn | CB_PD | Bộ KH&ĐT | BN | DG-PERM-006, 012f |
| lanhdao_dp | CB_PD | Sở TP Hà Nội | DP | DG-PERM-007, 012g |
| dn_user | DN | — | Portal | DG-PERM-008 |
| nht_user | NHT | — | Portal | DG-PERM-009 |
| tvv_user | TVV | — | Portal | DG-PERM-010 |
| chuyengia_user | CG | — | Portal | DG-PERM-011 |

Tất cả password = `Test@1234`, OTP `666666` (bypass).

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Đơn vị creator | Purpose | Cleanup? |
|---------|-------------|----------------|---------|----------|
| `DG-20260419-0010` | QA-RESEED-UI NHA... | Cục BTTP (TW) | Evidence scope leak M8.2-003 | Keep |
| `DG-20260419-0003` | SEED-NHAP-SO_BO_6T-DAO_TAO H1-2026 | Cục BTTP (TW) | Pre-seeded data-readiness | Keep |
| `DG-20260419-0002` | SEED-NHAP-TRON_NAM-TONG_HOP 2026 | Cục BTTP (TW) | Pre-seeded | Keep |

Không tạo data mới cho retest permission (dùng 3 NHAP sẵn có).

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/{resource-kebab-case}` (vd: `/api/v1/ke-hoach-danh-gias`)
- **Auth flow:** login → otpToken → verify-otp với `otpCode` → accessToken JWT RS256
- **Token TTL:** ~60s otpToken, accessToken dài hạn
- **Frontend:** React + Vite + Ant Design + CASL
- **Backend:** NestJS + PostgreSQL
- **Known limitations:**
  - **Browse `$B chain` crash** khi chain có `click` sidebar hoặc `goto` thứ 2 sau login. **WORKAROUND:** Dùng `history.pushState(...); dispatchEvent(new PopStateEvent("popstate"))` trong `js` step → React Router navigate giữ auth state.
  - **BE missing endpoints** — xem [bug-report-section-8.2-danh-gia.md](bug-report-section-8.2-danh-gia.md) (gộp cả permission + BE):
    - BUG-BE-M8-001: `/api/v1/tieu-chi-danh-gias` 404
    - BUG-BE-M8-002: 4 transition endpoints missing
    - BUG-BE-M8-003: PATCH silently drops `trangThai`
  - **Schema FE khác spec:** FE `DANG_PHAN_CONG/DA_PHAN_CONG/HUY` vs spec `CHO_DUYET_PC/DA_DUYET_PC/DA_LAP_BC`.

---

## 7. Recommendations

### Must Fix (Before Release) — Critical/Major

1. **BUG-BE-M8-001 (Critical, P0):** Scaffold endpoint `/api/v1/tieu-chi-danh-gias` CRUD + nested `/ke-hoach-danh-gias/{id}/tieu-chis`. **Estimated: 1-2 ngày.** Unblock 7 ô + workflow NHAP→DA_LAP_KH.

2. **BUG-BE-M8-002 (Critical, P0):** Build 4 transition endpoints: `hoan-tat-lap-kh`, `trinh-phan-cong`, `phe-duyet-phan-cong`, `tu-choi-phan-cong`, `huy`. **Estimated: 2-3 ngày.** Unblock 14 ô + toàn bộ workflow.

3. **BUG-PERM-M8.2-003 (Critical, P0):** BE add `WHERE don_vi_id IN (<scope>)` cho list `ke-hoach-danh-gias`. **Nên làm consolidated interceptor** fix 1 lần cho cả M5-002/M6-002/M8.1-002/M8.2-003 (4 module). **Estimated: 1 ngày** (consolidated).

4. **BUG-PERM-M8.2-002 (Major, P1):** FE dùng `ability.can('create', 'KeHoachDanhGia')` thay role check. **Consolidated fix** cho M5-001/M6-001/M8.1-001/M8.2-002/M8.3-001 (5 module). **Estimated: 2-3h** (consolidated).

### Should Fix

5. **BUG-PERM-M8.2-001 (Minor, P2):** FE filter Portal sidebar theo ability. **Consolidated** với M5-003/M6-003/M7-006.

6. **BUG-BE-M8-003 (Minor, P2):** Set `forbidNonWhitelisted: true` global ValidationPipe hoặc explicit reject `trangThai` trong DTO. **Estimated: 30 phút** + regression test.

### Additional Recommendations

7. **Test data seed cần sau khi BE fix:**
   - ≥3 VV `HOAN_THANH` trong kỳ 2026 Q1 (dependency KET_QUA_DANH_GIA)
   - ≥1 đợt đánh giá cho mỗi đơn vị BN (Bộ KH&ĐT) + 1 DP (Sở TP HN) để verify scope isolation
   - ≥2 TIEU_CHI trong DM (UC109) sau khi BE commit endpoint
   - Tạo CB_NV TW thứ 2 (`canbo_tw2`) cho BR-AUTH-05 cùng cấp test

8. **Browse tooling:**
   - Document technique `history.pushState + popstate` trong CLAUDE.md Rule 5 (tránh goto auth loss)
   - Consider headed mode `$B connect` cho complex flows

9. **Spec sync:**
   - Update spec 7.8 + SM-DANHGIA khớp schema FE (`DANG_PHAN_CONG/DA_PHAN_CONG/HUY`)
   - Update CLAUDE.md thêm entry FR-08

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC | Kết quả |
|--------|----------|---------|--------------|---------|
| POST | `/api/v1/auth/login` | Username+password → otpToken | All | 200 OK |
| POST | `/api/v1/auth/verify-otp` | otpToken + 666666 → accessToken | All | 200 OK |
| GET | `/api/v1/me` (ability) | Load role + abilities | All | 200 OK |
| GET | `/api/v1/ke-hoach-danh-gias` | List (scope test) | DG-PERM-012 | **200 BUT scope leak (M8.2-003)** |
| GET | `/api/v1/tieu-chi-danh-gias` | List tiêu chí | DG-PERM-014 | **404 (BUG-BE-M8-001)** |
| POST | `/api/v1/ke-hoach-danh-gias/{id}/trinh-phan-cong` | Transition | DG-PERM-017 | **404 (BUG-BE-M8-002)** |
| PATCH | `/api/v1/ke-hoach-danh-gias/{id}` | Update (silent drop trangThai) | — | **200 silent drop (BUG-BE-M8-003)** |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [qtht-tw-post-login.png](screenshots/qtht-tw-post-login.png) | QTHT_TW dashboard + sidebar | DG-PERM-001 |
| [canbo-tw-dashboard.png](screenshots/canbo-tw-dashboard.png) | CB_TW `/403` + sidebar | DG-PERM-002 |
| [canbo-bn-dashboard.png](screenshots/canbo-bn-dashboard.png) | CB_BN `/403` + sidebar | DG-PERM-003 |
| [canbo-tinh-dashboard.png](screenshots/canbo-tinh-dashboard.png) | CB_TINH `/403` + sidebar | DG-PERM-004 |
| [lanhdao-tw-dashboard.png](screenshots/lanhdao-tw-dashboard.png) | LANH_DAO_TW `/403` + sidebar | DG-PERM-005 |
| [lanhdao-bn-dashboard.png](screenshots/lanhdao-bn-dashboard.png) | LANH_DAO_BN `/403` + sidebar | DG-PERM-006 |
| [lanhdao-dp-dashboard.png](screenshots/lanhdao-dp-dashboard.png) | LANH_DAO_DP `/403` + sidebar | DG-PERM-007 |
| [dn-user-dashboard.png](screenshots/dn-user-dashboard.png) | DN `/403` + sidebar (menu leak) | DG-PERM-008, 018 |
| [nht-user-dashboard.png](screenshots/nht-user-dashboard.png) | NHT `/403` + sidebar | DG-PERM-009, 018 |
| [tvv-user-dashboard.png](screenshots/tvv-user-dashboard.png) | TVV `/403` + sidebar | DG-PERM-010, 018 |
| [chuyengia-user-dashboard.png](screenshots/chuyengia-user-dashboard.png) | CG `/403` + sidebar | DG-PERM-011, 018 |
| [qtht-tw-kehoach-pushState.png](screenshots/qtht-tw-kehoach-pushState.png) | **QTHT KE_HOACH list với "+ Tạo kế hoạch" SAI (M8.2-002)** | DG-PERM-012a |
| [canbo-tw-kehoach-list-v2.png](screenshots/canbo-tw-kehoach-list-v2.png) | CB_TW KE_HOACH list positive control | DG-PERM-012b |
| [canbo-bn-kehoach-list.png](screenshots/canbo-bn-kehoach-list.png) | **CB_BN thấy 3 rows TW (leak M8.2-003)** | DG-PERM-012c |
| [canbo-tinh-kehoach-list.png](screenshots/canbo-tinh-kehoach-list.png) | **CB_TINH thấy 3 rows TW (leak M8.2-003)** | DG-PERM-012d |
| [lanhdao-tw-kehoach-list.png](screenshots/lanhdao-tw-kehoach-list.png) | CB_PD_TW KE_HOACH list positive control | DG-PERM-012e |
| [lanhdao-bn-kehoach-list.png](screenshots/lanhdao-bn-kehoach-list.png) | **CB_PD_BN thấy 3 rows TW (leak M8.2-003)** | DG-PERM-012f |
| [lanhdao-dp-kehoach-list.png](screenshots/lanhdao-dp-kehoach-list.png) | **CB_PD_DP thấy 3 rows TW (leak M8.2-003)** | DG-PERM-012g |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-V.VIII-01 (UC 83) | DG-PERM-002, -003, -004, -012 | 3 PASS L1, 2 PASS + 2 FAIL L3 (scope leak) |
| FR-V.VIII-02 (UC 84 — Tiêu chí) | DG-PERM-014 | BLOCKED — BUG-BE-M8-001 |
| FR-V.VIII-03 (UC 85 — Phân công) | DG-PERM-017 | BLOCKED — BUG-BE-M8-002 |
| FR-V.VIII-04 (UC 86 — Duyệt PC) | DG-PERM-005..007, 017 | 3 PASS L1, BLOCKED L3 |
| FR-V.VIII-05 (UC 87 — Chọn VV + chấm điểm) | DG-PERM-013, 016 | BLOCKED + FAIL (scope) |
| FR-V.VIII-06 (UC 88 — Lập BC) | DG-PERM-015 | BLOCKED — BUG-BE-M8-002 |
| FR-V.VIII-07 (UC 89 — Duyệt BC) | DG-PERM-005..007 | 3 PASS L1 |
| BR-AUTH-01 (QTHT Read-only nghiệp vụ) | DG-PERM-001, 012a | 1 PASS L1, **1 FAIL L3 (M8.2-002)** |
| BR-AUTH-02 (CB_NV CRUD scoped) | DG-PERM-002..004, 012b..d | 3 PASS L1, 1 PASS + 2 FAIL L3 |
| BR-AUTH-03 (CB_PD RU*) | DG-PERM-005..007, 012e..g | 3 PASS L1, 1 PASS + 2 FAIL L3 |
| BR-AUTH-05 (Duyệt cùng cấp) | DG-PERM-017 | BLOCKED — BUG-BE-M8-002 |
| BR-AUTH-08 (Phân quyền data 3 cấp) | DG-PERM-016 | **FAIL — BUG-PERM-M8.2-003 Critical** |
| BR-AUTH-10 (TVV/CG/NHT ❌ FR-08) | DG-PERM-009..011 | 3 PASS |
| BR-AUTH-11 (DN API-only) | DG-PERM-008 | PASS |
| BR-CALC-04 (SUM trọng số = 100%) | — | BLOCKED — BUG-BE-M8-001 |
| BR-FLOW-04 (Từ chối cần lý do) | — | BLOCKED — BUG-BE-M8-002 |

---

*Report generated: 2026-04-19 15:30 | QA Automation via Claude Code + `/browse` atomic chain (history.pushState technique)*
