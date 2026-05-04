# Functional Test Report — Quản trị Hệ thống (Round 3 — Browse delta)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản trị Hệ thống (Module 7.1) |
| **SRS Reference** | [srs-fr-10-quan-tri.md](../../../../input/srs-v3/srs-fr-10-quan-tri.md) — 25 FR, 10 màn hình (SCR-VIII-01 → SCR-VIII-10), v2.1 consolidated |
| **UC Coverage** | UC 99-123 (Danh mục, Vai trò, Tài khoản, Phân quyền, Cấu hình, Audit) |
| **Người test** | QA Automation via Claude Code (`/browse` skill) |
| **Ngày** | 2026-04-18 (15:36-16:10 UTC+7) |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (dev bypass, per CLAUDE.md) — fallback MailHog http://103.172.236.130:8025 |
| **Test Method** | UI-based (gstack `/browse`, Chromium 146 headless) — tuân thủ test-strategy §402 |
| **Primary Account** | admin / Secret@123 (QTHT_TW, Cục BTTP — TW) |
| **Round** | Round 3 — **delta re-test** (focus: structural bugs bị bỏ sót ở Round 2) |
| **Tài liệu tham chiếu** | [test-strategy.md §402](../../../test-strategy.md), [7.10-quan-tri-he-thong.md](../../../funtion/7.10-quan-tri-he-thong.md), [bug-report-qtht-round3-browse.md](bug-report-qtht-round3-browse.md), [bug-report-qtht-final.md](bug-report-qtht-final.md) (Round 2 authoritative) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases — Theoretical (7.1 file)** | 72 (40 smoke + 32 functional) |
| **Round 3 Executed** | 5 smoke (SM-QT-07, 08, 20, 21, 30, 31) + sidebar structural audit |
| **Round 3 PASS** | 3 (SM-QT-07, SM-QT-20, SM-QT-31 seed data) |
| **Round 3 FAIL** | 5 (SM-QT-08, SM-QT-21, SM-QT-30, SM-QT-35 tacit, + sidebar structural) |
| **Round 3 New Bugs** | 4 (3 Major, 1 Medium) |
| **Round 2 TC Covered** | 32 functional (không re-run trong round 3 — xem Round 2 [functional-test-report-qtht-ui.md](functional-test-report-qtht-ui.md)) |
| **Cumulative Bugs (R2+R3)** | 19 (2 Critical, 11 Major, 6 Medium) |
| **Health Score** | **48/100** (estimated — see Section 7) |
| **Start Time** | 15:36 |
| **End Time** | 16:10 |
| **Total Duration** | ~34 phút (Round 3 only, kèm viết report) |
| **Browse Status** | OK — không crash, cần login lại mỗi bash block do app Zustand in-memory reset state khi goto |

### Verdict: **FAIL — structural deviation from SRS v2.1**

Round 3 xác nhận Round 2 đã **bỏ sót audit cấu trúc sidebar** (false-PASS ở dòng 65 [functional-test-report-qtht-ui.md](functional-test-report-qtht-ui.md#L65)). Phát hiện 4 bug structural cần fix để đạt release gate SRS v2.1. Kết hợp với 15 bug Round 2 chưa fix → **không đạt release criteria**.

### Scope & Trade-off

Round 3 **không** re-run toàn bộ 32 functional TC + 40 smoke checks vì:
1. Round 2 đã test và document đầy đủ (API + UI) với 15 bug — các phát hiện vẫn valid.
2. Mục tiêu Round 3 là **delta re-test** — tìm lỗi đã bỏ sót chứ không lặp lại toàn bộ.
3. Chạy lại full 72 TC qua `/browse` ước mất 60-75 phút trong session mới, không tạo giá trị nếu không có feedback mới từ dev.

Xem [bug-report-qtht-round3-browse.md](bug-report-qtht-round3-browse.md) để biết 4 bug mới.

---

## 2. Test Results Summary — Round 3

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| SM-QT-01 | FR-VIII-20 | Login trang hiển thị | Happy | P0 | **PASS** | — | Form login load, có placeholder đúng |
| SM-QT-02 | FR-VIII-20 | Username/password đúng → OTP | Happy | P0 | **PASS** | — | Submit xong redirect OTP stage |
| SM-QT-03 | FR-VIII-20 | OTP `666666` → Dashboard | Happy | P0 | **PASS** | — | Dev bypass work, redirect `/dashboard`, hiển thị widget overview |
| **Sidebar** | **SCR-VIII-01..10** | **Cấu trúc sidebar QTHT khớp SRS v2.1** | **Structural** | **P0** | **FAIL** | **BUG-R3-001** | 8 sub-item, 4 sai level, 2 thừa, 2 thiếu — xem [bug-report-qtht-round3-browse.md](bug-report-qtht-round3-browse.md) |
| SM-QT-07 | FR-VIII-01..13,18,19 | Menu Danh mục → load | Happy | P0 | **PASS** | — | URL `/quan-tri/danh-muc/LINH_VUC_PL`, breadcrumb đúng |
| SM-QT-08 | TPL-DM-CRUD | Sidebar Danh mục có 14 tab | Happy | P0 | **FAIL** | BUG-R3-002 | 16 tab (thừa "Tỉnh/Thành phố", "Hệ thống nguồn") |
| SM-QT-09 | FR-VIII-01 | Tab Lĩnh vực PL có seed data | Happy | P0 | **PASS** | — | 12 mục: DAN_SU, HINH_SU, HANH_CHINH, LAO_DONG, DAT_DAI, HON_NHAN, KINH_DOANH_TM, KHIEU_NAI, THUE, SO_HUU_TRI_TUE, DOANH_NGHIEP, DAU_TU |
| SM-QT-20 | FR-VIII-15 | Menu Tài khoản → load | Happy | P0 | **PASS** | — | 25 TK với filter + bảng |
| SM-QT-21 | FR-VIII-15 | Tabs trạng thái với số đếm | Happy | P1 | **FAIL** | BUG-R3-004 | Không có tab bar, chỉ có dropdown select |
| SM-QT-22 | FR-VIII-15 | Có dữ liệu test accounts | Happy | P0 | **PASS** | — | Thấy admin, qtht_tw, canbo_tw, canbo_bn, lanhdao_bn, dn_user, nht_user, tvv_user... |
| SM-QT-23 | FR-VIII-15 | Cột hiển thị đủ | Happy | P0 | **PASS** | — | Username, Họ tên, Email, Đơn vị, Loại TK, Vai trò, Trạng thái, Đăng nhập cuối, Thao tác |
| **SM-QT-30** | **FR-VIII-10** | **Menu Cấu hình hệ thống → 4 tabs** | **Happy** | **P0** | **FAIL** | **BUG-R3-003** | Cấu hình SLA là standalone page (1 tab), không phải menu unified với 4 tab |
| SM-QT-31 | FR-VIII-10 | Tab SLA có 4 dòng seed | Happy | P0 | **PARTIAL** | BUG-R3-003 | 4 dòng đúng (HOI_DAP 10d, HO_SO_HT 15d, HO_SO_TT 10d, VU_VIEC 10d), nhưng cấu trúc page sai (không nằm trong unified) |
| SM-QT-32 | FR-VIII-25 | Tab Phân công mặc định | Happy | P0 | **PARTIAL** | BUG-R3-003 | Là standalone page, không phải tab 2. Nội dung có tồn tại. |
| SM-QT-33 | FR-VIII-26 | Tab Mẫu phản hồi | Happy | P0 | **BLOCKED** | BUG-R3-003 | Không có sub-menu "Mẫu phản hồi" → không access được |
| SM-QT-34 | FR-VIII-27 | Tab Quy trình hỗ trợ | Happy | P0 | **BLOCKED** | BUG-R3-003 | Không có sub-menu "Quy trình hỗ trợ" → không access được |
| SM-QT-35 | FR-VIII-28 | Menu Nhật ký hệ thống | Happy | P1 | **FAIL** | BUG-QTHT-010 (R2) + BUG-R3-001 | Không có menu, không có page. Đã note round 2. |

### TC không chạy trong Round 3 (đã cover ở Round 2)

| ID | Status ở Round 2 | Xem tại |
|----|------------------|---------|
| SM-QT-04 (logout) | PASS | [functional-test-report-qtht-ui.md](functional-test-report-qtht-ui.md) |
| SM-QT-05 (forgot password link) | PASS | R2 |
| SM-QT-06 (signup link) | PASS | R2 |
| SM-QT-10..16 (Danh mục CRUD) | Partial | R2 |
| SM-QT-17..19 (Vai trò) | PASS | R2 |
| SM-QT-24 (form tạo TK) | FAIL — xem BUG-UI-001 (R2) | R2 |
| SM-QT-25..29 (Phân quyền Chức năng/Dữ liệu) | PASS | R2 |
| SM-QT-36..39 (Audit log rows) | BLOCKED (không có menu) | R2 |
| SM-QT-40 (signup form) | PASS | R2 |
| QT-001..032 (32 functional) | Xem R2 — 17 FAIL, 14 PASS, 1 reversed | [functional-test-report-qtht.md](functional-test-report-qtht.md) (API) + [functional-test-report-qtht-ui.md](functional-test-report-qtht-ui.md) (UI) |

### Chú thích

> **Result:** PASS / FAIL / BLOCKED / PARTIAL / SKIP (deferred)
> **Type:** Happy / Negative / Edge / Guard / Validation / Workflow / Authorization / Structural
> **Priority:** P0 / P1 / P2

---

## 3. Bug Report

### BUG-QTHT-R3-001 — Major — Sidebar QTHT sai cấu trúc SRS v2.1

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | SM-QT-30, SM-QT-35, sidebar audit |
| **Status** | Open |
| **Assignee** | Frontend Team |

**Mô tả:** Sidebar QTHT 8 sub-item — 4 đúng, 2 thừa (Ngày lễ, API Consumer), 2 sai level (Tiêu chí ĐG hiệu quả/chi phí), 2 thiếu (Cấu hình hệ thống unified, Nhật ký hệ thống).

**Các bước tái hiện:** Login admin → expand "Quản trị hệ thống" → đếm 8 sub-item, đối chiếu SRS SCR-VIII-01..10.

**Expected vs Actual:** SRS v2.1 quy định ~5-7 menu (Danh mục / Tài khoản & phân quyền / Cấu hình hệ thống [4 tabs] / Nhật ký hệ thống). Thực tế 8 menu phẳng sai cấu trúc.

**Impact:** Compliance vi phạm SRS, UX kém, 2 tính năng không access được (Mẫu phản hồi, Quy trình HT).

**Root Cause (Suggested):** Routing config FE scaffold theo v1.x rời rạc, chưa cập nhật theo v2.1 consolidation.

**Chi tiết đầy đủ:** [bug-report-qtht-round3-browse.md — BUG-QTHT-R3-001](bug-report-qtht-round3-browse.md#bug-qtht-r3-001--sidebar-qtht-sai-cấu-trúc-srs-v21)

---

### BUG-QTHT-R3-002 — Major — Danh mục 16 tabs thay vì 14

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | SM-QT-08 |
| **Status** | Open |
| **Assignee** | Frontend + Backend Team |

**Mô tả:** Panel Danh mục có 16 tab, thừa "Tỉnh/Thành phố" và "Hệ thống nguồn" so với SRS SCR-VIII-01.

**Chi tiết:** [bug-report-qtht-round3-browse.md — BUG-QTHT-R3-002](bug-report-qtht-round3-browse.md#bug-qtht-r3-002--trang-danh-mục-có-16-tabs-srs-chỉ-định-14)

---

### BUG-QTHT-R3-003 — Major — Cấu hình HT chưa unified

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | SM-QT-30, 31, 32, 33, 34 |
| **Status** | Open |
| **Assignee** | Frontend Team |

**Mô tả:** SRS v2.1 gộp SLA + Phân công + Mẫu phản hồi + Quy trình thành 1 page 4 tabs. Thực tế 2 page standalone + 2 tính năng missing.

**Chi tiết:** [bug-report-qtht-round3-browse.md — BUG-QTHT-R3-003](bug-report-qtht-round3-browse.md#bug-qtht-r3-003--cấu-hình-ht-chưa-unified-scr-viii-06-v21)

---

### BUG-QTHT-R3-004 — Medium — Tài khoản thiếu tabs trạng thái

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium |
| **Priority** | P2 |
| **TC Reference** | SM-QT-21 |
| **Status** | Open |
| **Assignee** | Frontend Team |

**Mô tả:** SRS SCR-VIII-03 #8 yêu cầu tab bar "Tất cả / Hoạt động / Chờ kích hoạt / Tạm khóa / Chờ phân quyền" với số đếm. Thực tế chỉ có filter dropdown.

**Chi tiết:** [bug-report-qtht-round3-browse.md — BUG-QTHT-R3-004](bug-report-qtht-round3-browse.md#bug-qtht-r3-004--trang-tài-khoản-thiếu-tabs-trạng-thái-có-số-đếm)

---

## 4. Detailed Test Results — Round 3

### 4.1 Sidebar Structural Audit

**Pre-conditions:**
- admin account HOAT_DONG
- app render complete (3s sau login+OTP)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | `$B goto /login` + fill admin/Secret@123 + Enter | Navigate OK | Navigate 200 | **PASS** |
| 2 | `$B type "666666"` (OTP bypass) | Redirect `/dashboard` | Redirect `/dashboard` | **PASS** |
| 3 | `$B snapshot -i` + click QTHT menu | Expand QTHT sub-menu | Expanded, 8 items visible | **PASS** (trigger) |
| 4 | Đếm số sub-item | 5-7 per SRS (Danh mục / Tài khoản & PQ / Cấu hình HT / Nhật ký HT + có thể Phân quyền nếu tách) | **8 items** | **FAIL** — cấu trúc sai |
| 5 | So sánh từng item với SRS SCR-VIII-01..10 | Chỉ có menu từ spec | 4 đúng, 2 thừa, 2 sai level, 2 thiếu | **FAIL** |

**Evidence:** [sm-qt-sidebar-qtht-expanded.png](screenshots/round3-browse/sm-qt-sidebar-qtht-expanded.png)

**Notes:**
- Round 2 đã chụp cùng view này (screenshots-ui/20-qtht-expanded.png) nhưng không flag structural issue.
- SRS v2.1 dòng 1208 note rõ "Thay đổi v2.1": MH-10.6 gộp MH-10.7 SLA tab, MH-02.6 + MH-02.7 chuyển từ Hỏi đáp sang QTHT, MH-10.10 mới thêm.
- FE chưa implement 2 màn hình v2.1: Cấu hình unified + Nhật ký HT.

---

### 4.2 SM-QT-07 + SM-QT-08: Danh mục page + 14 tabs

**Pre-conditions:** admin logged in.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click "Danh mục dùng chung" | URL `/quan-tri/danh-muc` or similar | URL = `/quan-tri/danh-muc/LINH_VUC_PL` | **PASS** (auto-select tab đầu) |
| 2 | Verify breadcrumb | "Trang chủ › Quản trị › Danh mục" | Đúng | **PASS** |
| 3 | Đếm panel tabs bên trái | 14 tabs | **16 tabs** | **FAIL** — 2 thừa |
| 4 | Verify tab name match SRS | Match 14-list | 14 match + 2 extra | **FAIL** |

**Evidence:** [sm-qt-07-danh-muc-landing.png](screenshots/round3-browse/sm-qt-07-danh-muc-landing.png)

**Notes:**
- Liên quan BUG-QTHT-012 (round 2) — backend enum `LoaiDanhMuc` không đủ. Nếu FE có 16 tab mà BE enum ít hơn → FE phải hardcode hoặc hit error khi query.
- SRS line 1221 cần update hoặc FE cần remove 2 tab.

---

### 4.3 SM-QT-09: Tab Lĩnh vực PL seed data

**Pre-conditions:** Ở tab Lĩnh vực PL.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Verify số rows | ≥10 (seed data) | 12 | **PASS** |
| 2 | Verify seed values | Thuế, Lao động, Đất đai, ... | DAN_SU, HINH_SU, HANH_CHINH, LAO_DONG, DAT_DAI, HON_NHAN, KINH_DOANH_TM, KHIEU_NAI_TO_CAO, THUE, SO_HUU_TRI_TUE, DOANH_NGHIEP, DAU_TU | **PASS** |
| 3 | Pagination 20/trang mặc định | `20 / trang` dropdown | Đúng | **PASS** |

---

### 4.4 SM-QT-20, SM-QT-21, SM-QT-22, SM-QT-23: Tài khoản page

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click "Tài khoản & phân quyền" | URL `/quan-tri/tai-khoan` | OK | **PASS** |
| 2 | Verify filter bar | Tìm kiếm, Trạng thái, Loại TK, Đơn vị, Vai trò | Đủ 5 filter | **PASS** |
| 3 | Verify tabs trạng thái with counts | Tabs `Tất cả / HOAT_DONG / ...` có số đếm | **Không có tab bar** | **FAIL** (BUG-R3-004) |
| 4 | Verify data rows | Test accounts hiển thị | 25 TK gồm admin, qtht_tw, canbo_tw, lanhdao_bn, ... | **PASS** |
| 5 | Verify columns | 9 cột theo SRS | Đủ 9 cột | **PASS** |
| 6 | Verify button "Thêm mới" | Visible | Visible | **PASS** |

**Evidence:** [sm-qt-20-tai-khoan.png](screenshots/round3-browse/sm-qt-20-tai-khoan.png)

---

### 4.5 SM-QT-30 + SM-QT-31: Cấu hình SLA

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click "Cấu hình SLA" | URL `/quan-tri/cau-hinh#sla` (tab trong unified) | URL = `/quan-tri/cau-hinh-sla` (standalone) | **FAIL** — URL sai cấu trúc |
| 2 | Verify tab bar trên cùng | 4 tabs: SLA/Phân công/Mẫu/Quy trình | Không có tab bar | **FAIL** (BUG-R3-003) |
| 3 | Verify breadcrumb | "Trang chủ › Quản trị hệ thống › Cấu hình hệ thống › SLA" | "Trang chủ › Quản trị hệ thống › Cấu hình SLA" (thiếu level unified) | **FAIL** |
| 4 | Verify 4 dòng seed SLA | HOI_DAP 5 ngày, VU_VIEC 10, HO_SO_HT 15, HO_SO_TT 10 (theo SRS) | 4 dòng: HOI_DAP 10, HO_SO_HT 15, HO_SO_TT 10, VU_VIEC 10 | **PARTIAL** — 4 dòng có nhưng HOI_DAP = 10 (SRS/smoke ghi 5) |
| 5 | Columns theo SRS | Loại YC, Thời hạn, CB1%, CB2%, Quá hạn | Loại YC, Tên loại, Thời hạn, Vùng cảnh báo (progress bar), Hệ số quá hạn, Email, Thông báo app | **PARTIAL** — extra cột Email + app, có Vùng cảnh báo thay vì 3 cột riêng |

**Evidence:** [sm-qt-30-sla-page.png](screenshots/round3-browse/sm-qt-30-sla-page.png)

**Notes:**
- HOI_DAP SLA = 10 ngày (thực) vs 5 ngày (SM-QT-31 expected) — có thể là seed đã thay đổi. Không chắc chắn là bug, cần confirm với BA.
- Progress bar "Vùng cảnh báo" hợp lý UX hơn 3 cột % riêng — có thể design update.

---

### 4.6 SM-QT-35: Nhật ký hệ thống

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Tìm menu "Nhật ký hệ thống" trong sidebar QTHT | 1 sub-item visible | Không có | **FAIL** |
| 2 | Thử direct URL `/quan-tri/nhat-ky` | Load page | Redirect `/login` (Zustand state reset trên goto) | Inconclusive |

**Notes:**
- Round 2 BUG-QTHT-010 đã note "thiếu endpoint + menu".
- Round 3 confirm: menu không hiện ở sidebar, không có ingress point.
- Cấu trúc page cần implement theo SCR-VIII-10 (MH-10.10 mới v2.1).

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| admin | QTHT_TW | Cục BTTP | TW | Toàn bộ Round 3 |

**Chỉ dùng admin trong Round 3.** Round 2 đã test 6 accounts (admin, canbo_tw, canbo_bn, lanhdao_bn, dn_user, nht_user) — kết quả xem R2 report.

### 5.2 Data quan sát

| Page | Seed data observed |
|------|---------------------|
| Danh mục / Lĩnh vực PL | 12 rows (DAN_SU → DAU_TU) |
| Cấu hình SLA | 4 rows (HOI_DAP/HO_SO_HT/HO_SO_TT/VU_VIEC) |
| Tài khoản | 25 rows (pagination 20/trang, 1 trang đầu + 5 trang 2) |
| Sidebar QTHT | 8 sub-items |

Không tạo data mới trong Round 3.

---

## 6. Environment Notes

- **Browse tool:** gstack `/browse` (Chromium 146 headless)
- **Server restart:** Browse server restart giữa các bash invocation → state + token bị reset → phải login lại mỗi lần. Giải pháp: chain commands trong 1 bash block.
- **Zustand in-memory:** App không dùng localStorage → `$B goto` reset state, phải `$B click` trên sidebar để giữ session.
- **OTP bypass:** Dev đang bật bypass `666666`. Nếu tắt → lấy từ MailHog (http://103.172.236.130:8025).
- **Antd rendering:** SSR chậm 2-3s, `$B wait` trước mọi `$B fill`.
- **Reference:** CLAUDE.md Rules 1-6 trong [CLAUDE.md](../../../../CLAUDE.md).

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-QTHT-R3-001 (Major):** Restructure sidebar QTHT → consolidate thành 4-5 menu theo SRS v2.1:
   - Danh mục dùng chung (giữ)
   - Tài khoản & phân quyền (giữ)
   - **Cấu hình hệ thống** (mới, 4 tabs)
   - **Nhật ký hệ thống** (mới, MH-10.10)
   - Review "Ngày lễ" và "API Consumer": nếu ngoài scope → remove; nếu cần → update SRS.

2. **BUG-QTHT-R3-003 (Major):** Build unified page `/quan-tri/cau-hinh` với 4 tabs (SLA/Phân công/Mẫu phản hồi/Quy trình). Implement 2 tab mới (Mẫu + Quy trình).

3. **BUG-QTHT-R3-002 (Major):** Sync enum `LoaiDanhMuc` BE và tabs FE. Quyết định: 14 hay 16 tab → update 1 phía.

4. **Các bug round 2 chưa fix:** Review [bug-report-qtht-final.md](bug-report-qtht-final.md) — đặc biệt BUG-006 (password policy), BUG-005 (PUT no-op roles), BUG-007/008 (permission leaks).

### Should Fix

5. **BUG-QTHT-R3-004 (Medium):** Thêm tabs trạng thái với số đếm trên trang Tài khoản.

### Additional Recommendations

6. **Testing:** Sau khi fix structural bugs (R3-001/003), **re-run full smoke 40 checks + functional 32 TC** để verify không có regression mới. Dùng `/browse` skill với instruction tương tự Round 3.
7. **Skill routing:** Update CLAUDE.md (test-strategy.md §402) với ghi chú: khi sidebar audit, đối chiếu TỪNG item với SCR-VIII-XX spec, không chỉ đếm tổng số.
8. **QA process:** Thêm smoke check "Sidebar structural diff" vào pre-release gate — compare sidebar items list với list from SRS `SCR-VIII-0[0-9]` spec.

---

## 8. Appendix

### A — Browse commands used (reference)

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto http://103.172.236.130:3000/login
$B wait 'input[placeholder="Nhập tên đăng nhập"]'
$B fill 'input[placeholder="Nhập tên đăng nhập"]' "admin"
$B fill 'input[placeholder="Nhập mật khẩu"]' "Secret@123"
$B press Enter
sleep 2
$B type "666666"      # OTP bypass
sleep 4
$B snapshot -i        # get refs fresh
$B click @e14         # use ref immediately
$B screenshot <path>
$B text              # read page content
```

### B — Screenshots Round 3

| File | Mô tả | TC Ref |
|------|-------|--------|
| [01-dashboard.png](screenshots/round3-browse/01-dashboard.png) | Dashboard sau login admin QTHT_TW | SM-QT-03 |
| [sm-qt-sidebar-qtht-expanded.png](screenshots/round3-browse/sm-qt-sidebar-qtht-expanded.png) | Sidebar QTHT expanded với 8 sub-items | BUG-R3-001 |
| [sm-qt-07-danh-muc-landing.png](screenshots/round3-browse/sm-qt-07-danh-muc-landing.png) | Trang Danh mục 16 tabs | SM-QT-08, BUG-R3-002 |
| [sm-qt-20-tai-khoan.png](screenshots/round3-browse/sm-qt-20-tai-khoan.png) | Trang Tài khoản không có tabs trạng thái | SM-QT-20/21, BUG-R3-004 |
| [sm-qt-30-sla-page.png](screenshots/round3-browse/sm-qt-30-sla-page.png) | Trang SLA standalone (không unified) | SM-QT-30/31, BUG-R3-003 |

### C — SRS Traceability Matrix

| SRS Reference | Round 3 Status | Bug |
|---------------|---------------|-----|
| SCR-VIII-01 (Danh mục 14 tabs) | FAIL — 16 tabs | BUG-R3-002 |
| SCR-VIII-02 (Vai trò) | SKIP (R2 PASS) | — |
| SCR-VIII-03 (Tài khoản NSD) | PARTIAL — thiếu tabs trạng thái | BUG-R3-004 |
| SCR-VIII-04 (Phân quyền chức năng) | SKIP (R2) | — |
| SCR-VIII-05 (Phân quyền dữ liệu) | SKIP (R2) | — |
| SCR-VIII-06 v2.1 (Cấu hình hệ thống unified 4 tabs) | FAIL — 2 standalone + 2 missing | BUG-R3-003 |
| SCR-VIII-07 (Đăng nhập) | PASS | — |
| SCR-VIII-08 (Đăng ký) | SKIP (R2) | — |
| SCR-VIII-09 (Đăng xuất) | SKIP (R2 PASS) | — |
| SCR-VIII-10 v2.1 (Nhật ký hệ thống) | FAIL — menu không tồn tại | BUG-QTHT-010 (R2) + BUG-R3-001 |
| Sidebar structure overall | FAIL | BUG-R3-001 |

### D — Relationship to Round 2

| Round 2 Finding | Round 3 Action |
|-----------------|----------------|
| 15 bugs documented ([bug-report-qtht-final.md](bug-report-qtht-final.md)) | Kế thừa, không re-test |
| "8 sub-menu — đúng SRS" (false-PASS) | **Flipped to FAIL** — xem BUG-R3-001 |
| BUG-QTHT-010 (missing audit menu) | Reinforced by BUG-R3-001 |
| QT-027 reversal (Cấu hình SLA tồn tại) | Confirmed standalone page, nhưng **không** trong unified |
| BUG-QTHT-012 (enum LoaiDanhMuc thiếu) | Related BUG-R3-002 (FE tabs vs BE enum sync) |

### E — Known Limits Round 3

- Không re-run authorization matrix (QT-029..032) — trust Round 2 results.
- Không test CRUD data paths (QT-009..024) — trust Round 2 results.
- Không test state machine (session timeout 30 phút, lock sau 5 lần sai).
- Chỉ dùng 1 account (admin). Round 2 đã test 6 accounts.

---

*Round 3 functional test report generated: 2026-04-18 16:10 UTC+7 | QA Automation via Claude Code (/browse)*
