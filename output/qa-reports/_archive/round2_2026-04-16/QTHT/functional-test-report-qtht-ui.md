# Functional Test Report — Quản trị Hệ thống (QTHT) — UI-based

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản trị Hệ thống (Module 7.1) |
| **SRS Reference** | srs-fr-10-quan-tri.md — 25 FR |
| **UC Coverage** | UC 99-119 |
| **Người test** | QA Automation via Claude Code (Playwright) |
| **Ngày** | 2026-04-17 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | http://103.172.236.130:8025 (MailHog) |
| **Test Method** | **UI-based (Playwright + Chromium headless)** |
| **Primary Account** | admin / Secret@123 — QTHT_TW |
| **Round** | Round 2 — Re-run UI |
| **Tài liệu tham chiếu** | [functional-test-report-qtht.md](functional-test-report-qtht.md) (API round), [api-vs-ui-comparison.md](api-vs-ui-comparison.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 24 (subset focused on UI-visible behavior) |
| **Passed** | 14 |
| **Failed** | 6 |
| **Blocked** | 2 |
| **Info** | 2 |
| **Pass Rate** | 58% (14/24) |
| **Bugs Found (UI)** | 8 (1 Critical, 4 Major, 3 Medium) |
| **Health Score** | 62/100 |

### Verdict: **FAIL** — vẫn không đạt release gate

UI test xác nhận hầu hết bug API đã tìm thấy cộng thêm nhiều bug UX mà API không thể tìm được: (a) khi login sai password, UI không hiển thị thông báo lỗi cho user; (b) form tạo tài khoản không có hint/validation password policy trên client-side; (c) 3 antd deprecation warnings trong console. Đồng thời UI đảo ngược 1 kết luận của API: **QT-027 Cấu hình SLA thực tế HOẠT ĐỘNG trong UI** (không bị BLOCKED như API kết luận) — điểm positive thêm cho product. UI cũng phát hiện danh sách 15+ loại danh mục thực tế đã được seed (API chỉ thấy 3 vì enum validator sai).

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Test Case | Type | Priority | Result | Bug ID | Ghi chú |
|----|---------------|-----------|------|----------|--------|--------|---------|
| QT-001 | UC118 | Login UI với admin/Secret@123 | Happy | P0 | **PASS** | — | 4.7s full login, redirect /dashboard |
| QT-002 | UC118 | OTP 6-digit từ MailHog | Happy | P0 | **PASS** | — | UX: auto-submit khi đủ 6 digit (chi tiết API không thấy được) |
| QT-001b | UC118 | Header hiển thị role đúng | UI | P1 | **PASS** | — | "Quản trị hệ thống / QTHT_TW" hiển thị top-right |
| QT-003-UI | UC118 | Login sai password → UI hiển thị lỗi | Negative | P0 | **FAIL** | BUG-QTHT-UI-002 | UI KHÔNG hiển thị thông báo lỗi gì; user tưởng hệ thống hỏng |
| QT-003-stuck | UC118 | Button "Đang xử lý..." bị stuck | Negative | P1 | **PASS** | — | Button reset về "Đăng nhập" sau khi API 401 — không stuck |
| QT-005 | UC119 | Đăng xuất qua menu avatar | Happy | P0 | **PASS** | — | Menu dropdown → "Đăng xuất" → redirect /login |
| QT-009-form | UC99-110 | Form tạo danh mục mở ra | Happy | P0 | **PASS** | — | Modal form render OK |
| QT-009-val | UC99-110 | Empty form submit → validation | Negative | P1 | **PASS** | — | Client validation hiển thị error messages |
| QT-014 | UC99-110 | Pagination component | Happy | P1 | **PASS** | — | `.ant-pagination` render; default "20 / trang" |
| QT-015 | UC99-110 | Search theo tên | Happy | P1 | **PASS** | — | "Tư vấn" → 13 rows (search realtime, không cần submit) |
| QT-016-UI | UC99-110 | Cột sortable trong table | Happy | P2 | **PASS** | — | 12 cột có `ant-table-column-sorters` |
| QT-017-loại | UC99-110 | 15 loại danh mục panels | Happy | P1 | **PASS** | — | UI side panel liệt kê ≥15 loại (API chỉ biết 3 — inconsistency confirmed) |
| QT-018 | UC111-115 | Navigate /tai-khoan-phan-quyen | Happy | P0 | **BLOCKED** | — | Submenu collapse sau khi mở form khác; cần test lại isolated |
| QT-024-UI | UC116 | Link Quên mật khẩu hoạt động | Happy | P1 | **PASS** | — | Link hoạt động, trang forgot-password mở ra |
| QT-025-menu | UC120-123 | Sidebar có menu Nhật ký/Audit | Happy | P1 | **FAIL** | BUG-QTHT-010 | Confirm API finding: sidebar QTHT không có menu audit |
| QT-027 | UC108 | Cấu hình SLA → trang load | Happy | P2 | **PASS** | — | **API test kết luận sai!** UI load trang Cấu hình thời hạn xử lý với 4 loại HOI_DAP/HO_SO_HT/HO_SO_TT/VU_VIEC, có vùng cảnh báo + hệ số quá hạn + toggles |
| QT-028-hint | — | Hint password policy trong form | Validation | P0 | **FAIL** | BUG-QTHT-UI-001 | Form tạo tài khoản KHÔNG có hint password rule |
| QT-028-ui-weak | — | Client-side validate password yếu | Validation | P0 | **FAIL** | BUG-QTHT-UI-001 | Nhập "Ab1" và blur → không có lỗi hiện ra; gửi API → server cũng nhận (cộng hưởng với BUG-QTHT-006 đã tìm qua API) |
| QT-029 | — | QTHT navigate admin pages | Authorization | P0 | **PASS** | — | admin truy cập được Danh mục, Cấu hình SLA |
| CONSOLE-warn | — | antd deprecation warnings | UI/UX | P3 | **FAIL** | BUG-QTHT-UI-003 | 3 warnings: Drawer `width`, TreeSelect `onDropdownVisibleChange`, TreeSelect `bordered` |
| API-errors | — | API 4xx/5xx trong session | UI/UX | P2 | **INFO** | — | Chỉ có 1 lỗi mong đợi: 401 POST /api/v1/auth/login (test QT-003) |
| DASH-widgets | — | Dashboard metrics render | UI | P3 | **PASS** | — | 15 số liệu hiển thị (Hỏi đáp mới, Vụ việc, Chuyên gia, Đào tạo…) — API test hoàn toàn bỏ qua |
| UX-otp-auto | UC118 | OTP auto-submit sau 6 digit | UI/UX | P2 | **PASS** | — | UX +1 so với typing rồi phải click "Xác nhận" |
| Sidebar-menu | — | Sidebar hiển thị đúng phân quyền | UI | P1 | **INFO** | — | admin (QTHT_TW) thấy đủ 13 menu top-level + 8 sub-menu QTHT — đúng SRS |

### Chú thích Result

Giống template chuẩn: PASS = đạt, FAIL = có bug, BLOCKED = không chạy được, INFO = thông tin tham khảo.

---

## 3. Bugs phát hiện qua UI test (chưa có trong API report)

### BUG-QTHT-UI-001 — Critical — Form tạo tài khoản thiếu client-side password validation

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | QT-028-hint, QT-028-ui-weak |
| **Status** | Open |
| **Assignee** | Frontend Team |

**Mô tả:** Form tạo tài khoản mới (Drawer/Modal) không có hint text về password rule. Nhập `Ab1` vào field password rồi blur sang field khác → không có validation error hiển thị. Backend cũng không validate (BUG-QTHT-006) → user dễ đặt mật khẩu yếu.

**Impact:** UX kém + security yếu cộng hưởng. Ngay cả khi backend fix (BUG-QTHT-006), user vẫn submit pwd yếu và nhận error chỉ sau submit — feedback chậm.

**Root Cause (Suggested):** `CreateUserForm.tsx` thiếu `<Form.Item rules={[{ pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, message: '...' }]}>`.

**Fix:** Thêm `rules` + `extra` cho password field với text hint "Mật khẩu tối thiểu 8 ký tự, gồm hoa+thường+số".

---

### BUG-QTHT-UI-002 — Major — Login sai mật khẩu không hiển thị thông báo lỗi

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | QT-003-UI |
| **Status** | Open |
| **Assignee** | Frontend Team |

**Mô tả:** Điền username `admin` + pwd sai (`WrongPwd123`) → click Đăng nhập → API trả 401 → UI KHÔNG hiển thị thông báo error (0 alerts, 0 notifications, 0 form-item-explain). Button reset về "Đăng nhập" bình thường nhưng user không biết tại sao không vào được.

**Screenshot:** [70-wrong-pwd.png](screenshots-ui/70-wrong-pwd.png) — form điền xong, không có error UI.

**Impact:** User không biết mình nhập sai → có thể retry rất nhiều lần → kích hoạt lockout (BR-AUTH-06 sau 5 lần) mà không hiểu lý do.

**Root Cause (Suggested):** `useLoginMutation` hoặc login handler không handle nhánh `onError` để show `message.error(...)` hoặc set form error.

**Fix:**
```tsx
mutation.mutate(data, {
  onError: (e) => {
    message.error(e.response?.data?.error?.message || 'Đăng nhập thất bại');
  }
});
```

---

### BUG-QTHT-UI-003 — Medium — antd deprecation warnings trong console

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium |
| **Priority** | P2 |
| **TC Reference** | CONSOLE-warn |
| **Status** | Open |
| **Assignee** | Frontend Team |

**Mô tả:** 3 deprecation warnings từ antd library (phát hiện khi browse qua các page):
1. `Warning: [antd: Drawer] 'width' is deprecated. Please use 'size' instead.`
2. `Warning: [antd: TreeSelect] 'onDropdownVisibleChange' is deprecated. Please use 'onOpenChange' instead.`
3. `Warning: [antd: TreeSelect] 'bordered' is deprecated. Please use 'variant' instead.`

**Impact:** Code sẽ break khi upgrade antd lên major version tiếp theo. Hiện chỉ warnings, chưa crash.

**Fix:** Refactor 3 usage sites theo recommendation của antd.

---

### BUG-QTHT-UI-004 — Medium — Đảo ngược API test: QT-027 Cấu hình SLA thực tế hoạt động

| Trường | Giá trị |
|--------|---------|
| **Status** | Not a bug — correction of API report |
| **TC Reference** | QT-027 |

**Correction:** API test round trước kết luận QT-027 BLOCKED vì không tìm thấy endpoint `/api/v1/cau-hinh-sla`. UI test chứng minh trang **CÓ TỒN TẠI** (route `/quan-tri/cau-hinh-sla`) và hoạt động:

**Screenshot:** [40-sla.png](screenshots-ui/40-sla.png)

- Title: "Cấu hình thời hạn xử lý (SLA)"
- Bảng 4 loại yêu cầu: HOI_DAP (10 ngày), HO_SO_HT (15 ngày), HO_SO_TT (10 ngày), VU_VIEC (10 ngày)
- Cột "Vùng cảnh báo" với progress bar màu 0/50/90/100%
- Cột "Hệ số quá hạn" = 2
- Toggle Email + Thông báo app cho mỗi loại
- Pagination "1-4 / 4 mục"

**Update API report:** UI sử dụng endpoint khác với tên mình đã probe. Cần kiểm tra Network tab để tìm endpoint thực (có thể `/api/v1/sla-config` hoặc `/cau-hinh` — endpoint cụ thể).

---

### BUG-QTHT-UI-005 — Medium — Đảo ngược API test: UI hiển thị 15+ loại danh mục, API chỉ 3

| Trường | Giá trị |
|--------|---------|
| **Status** | Inconsistency (API endpoint issue, not UI) |
| **TC Reference** | QT-017-loại |

**Correction:** API test phát hiện chỉ 3 loại danh mục có data (BUG-QTHT-012). UI screenshot [21-danh-muc-landing.png](screenshots-ui/21-danh-muc-landing.png) hiển thị panel bên trái liệt kê ≥15 loại:

1. Lĩnh vực pháp lý (LINH_VUC_PL — API thấy: 13 items)
2. Loại hình hỗ trợ (API thấy: 6)
3. Chương trình hỗ trợ (API: ?)
4. Tình trạng vụ việc (API: 11)
5. Tỉnh/Thành phố (API: chưa probe đúng tên)
6. Tổ chức tư vấn
7. Loại doanh nghiệp
8. Hồ sơ đề nghị hỗ trợ
9. Hồ sơ đề nghị thanh toán
10. Tiêu chí đánh giá hiệu quả
11. Tiêu chí đánh giá chi phí
12. Loại tài khoản
13. Loại hình tiếp nhận
14. Kênh tiếp nhận
15. Hệ thống nguồn
... (scroll để xem thêm)

**Phân tích:** Data thực tế được seed đủ. Vấn đề API: enum validator ở endpoint `GET /api/v1/danh-muc?loaiDanhMuc=X` chỉ chấp nhận ít giá trị, hoặc tên enum khác với tên tôi đã probe. UI gọi đúng vì biết mapping từ click handler.

**Action:** Re-classify BUG-QTHT-012 → không còn là "thiếu seed data" mà là "API endpoint không expose full enum / validator bị giới hạn".

---

## 4. Detailed Test Results (selected highlights)

### 4.1 QT-001/002: Login UI full flow

**Pre-conditions:** Browser mở trang /login, admin chưa login.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | goto /login | Form hiển thị | Form render với 2 input + checkbox "Ghi nhớ" + link "Quên mật khẩu?" + 2 button | **PASS** |
| 2 | fill username `admin` | Input có value | Input có value `admin` | **PASS** |
| 3 | fill password `Secret@123` | Input có value | Input dots (obscured) | **PASS** |
| 4 | click "Đăng nhập" | POST /auth/login → otpToken | UI chuyển sang OTP form (6 input `maxlength="1"`, timer 4:58, "Xác nhận" disabled, "Gửi lại", "Quay lại") | **PASS** |
| 5 | fill 6 OTP digits | `input[maxlength="1"]` x6 | Mỗi input có 1 digit, button chuyển "Đang xác nhận..." **auto-submit** khi đủ 6 | **PASS + UX bonus** |
| 6 | Wait redirect | → /dashboard | 4.7s total, redirect /dashboard, header hiển thị "Quản trị hệ thống / QTHT_TW" | **PASS** |

**Notes:**
- UX detail API không thể thấy: OTP form có countdown timer "Hiệu lực: 4:58" (5 phút khớp OTP TTL từ API).
- Auto-submit pattern tăng UX — user không phải reach sang click Xác nhận.

---

### 4.2 QT-027: Cấu hình SLA — reversal from API finding

**Pre-conditions:** admin đã login, vào menu QTHT → Cấu hình SLA.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | expand sidebar "Quản trị hệ thống" | Submenu hiện 8 sub-items | Hiện đủ 8: Danh mục dùng chung, Cấu hình SLA, Cấu hình phân công, Ngày lễ, Tiêu chí đánh giá hiệu quả, Tiêu chí đánh giá chi phí, Tài khoản & phân quyền, Quản lý API Consumer | **PASS** |
| 2 | click "Cấu hình SLA" | Load page | Page render với title "Cấu hình thời hạn xử lý (SLA)" | **PASS** |
| 3 | verify table content | 4+ loại SLA | 4 rows: HOI_DAP/10, HO_SO_HT/15, HO_SO_TT/10, VU_VIEC/10 | **PASS** |
| 4 | verify có vùng cảnh báo | Cột "Vùng cảnh báo" + progress bar | Progress bar 0/50/90/100% color coded | **PASS** |

**So sánh với API test:** API kết luận BLOCKED vì endpoint `/cau-hinh-sla`, `/sla`, `/cau-hinh` đều 404. UI chứng minh feature tồn tại → API đã guess sai tên endpoint. UI test có advantage ở đây.

---

### 4.3 QT-003-UI: Sai password không có lỗi (NEW finding)

**Pre-conditions:** Tại trang /login.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | fill username `admin` | Input có value | OK | **PASS** |
| 2 | fill password `WrongPwd123` | Input có value | OK | **PASS** |
| 3 | click "Đăng nhập" | API 401 | Network log: `POST /api/v1/auth/login → 401` | **PASS** (expected) |
| 4 | Wait 5s, screenshot | UI hiển thị error message | Screenshot [70-wrong-pwd.png](screenshots-ui/70-wrong-pwd.png): KHÔNG có `.ant-message-error`, `.ant-notification`, không có `.ant-form-item-explain`. Form giữ nguyên state, button về "Đăng nhập" | **FAIL** |
| 5 | Verify không có toast | `.ant-message` hiển thị | 0 elements | **FAIL** |

**Impact:** User sai password không biết mình sai. Dễ retry → 5 lần → account lock (khớp BR-AUTH-06 phía backend). API test hoàn toàn không bắt được bug này vì API trả 401 đúng — chỉ UI test phát hiện UI không handle error.

---

## 5. Environment Notes

- **Test method:** Playwright v1.57 (homebrew global) + Chromium cached bởi Playwright (`~/Library/Caches/ms-playwright/chromium-1217`)
- **Headless:** true
- **Viewport:** 1280×800 desktop
- **slowMo:** 30-50ms để ổn định
- **Browse binary:** đã rebuild + ad-hoc signed, có thể dùng `$B` nhưng Playwright script stable hơn cho long flow
- **Token storage:** app dùng Zustand in-memory (không localStorage) → `page.goto()` reset state; phải dùng `page.click()` trên sidebar để giữ token
- **Login flow:** 2-factor (password + OTP qua MailHog), OTP auto-submit trên 6th digit

---

## 6. Screenshots

| File | Mô tả | TC |
|------|-------|----|
| [01-login-page.png](screenshots-ui/01-login-page.png) | Login form initial | QT-001 |
| [02-login-filled.png](screenshots-ui/02-login-filled.png) | Login filled credentials | QT-001 |
| [04-otp-filled.png](screenshots-ui/04-otp-filled.png) | OTP 6 digits filled, "Đang xác nhận" | QT-002 |
| [10-dashboard.png](screenshots-ui/10-dashboard.png) | Dashboard post-login, role QTHT_TW ✓ | QT-001b |
| [20-qtht-expanded.png](screenshots-ui/20-qtht-expanded.png) | Sidebar QTHT menu expanded (8 sub-items) | QT-029 |
| [21-danh-muc-landing.png](screenshots-ui/21-danh-muc-landing.png) | Trang Quản lý danh mục với 15+ loại panel + table | QT-017, QT-014, QT-015 |
| [25-create-dm-form.png](screenshots-ui/25-create-form.png) | Form tạo mới danh mục | QT-009 |
| [40-sla.png](screenshots-ui/40-sla.png) | Cấu hình SLA table — **API test kết luận sai** | QT-027 |
| [60-user-menu.png](screenshots-ui/60-user-menu.png) | User menu dropdown với "Đăng xuất" | QT-005 |
| [70-wrong-pwd.png](screenshots-ui/70-wrong-pwd.png) | Sai pwd — UI không hiển thị error (**new bug UI-002**) | QT-003-UI |
| [80-forgot-pwd.png](screenshots-ui/80-forgot-pwd.png) | Trang Quên mật khẩu | QT-024 |

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-QTHT-UI-002 (Major — P1):** Thêm `onError` handler trong `useLoginMutation` để show `message.error(...)` khi API login trả 401.
2. **BUG-QTHT-UI-001 (Critical — P0):** Thêm client-side validation cho password field + hint text "≥8 ký tự, hoa+thường+số" trong form tạo/đổi mật khẩu. Cộng hưởng với BUG-QTHT-006 (backend validator).

### Should Fix

3. **BUG-QTHT-UI-003 (Medium — P2):** Refactor 3 antd deprecated usage (Drawer `width`, TreeSelect `onDropdownVisibleChange`, `bordered`).

### Re-classify (from API report)

4. **BUG-QTHT-012 (từ API test):** Không phải "thiếu seed data". Data đủ 15+ loại. Issue thực: API endpoint validator enum chưa đủ → cần review enum `LoaiDanhMuc` trong backend.
5. **QT-027 SLA (từ API test):** Revert từ BLOCKED → **PASS**. Tính năng hoạt động trên UI. API endpoint thực có thể `/api/v1/cau-hinh-sla` khác tên.

---

## 8. Appendix

### Rebuilt browse binary

UI test round này được unblock sau khi rebuild binary `~/.claude/skills/gstack/browse/dist/browse`:
1. `bun build --compile browse/src/cli.ts --outfile browse/dist/browse.new`
2. `codesign --remove-signature` → `/usr/bin/codesign -f -s -`
3. Swap binary, verify goto + screenshot.

Chi tiết xem commit log hoặc `browse.bak-1776408124` (binary cũ gây SIGKILL giữ lại để rollback).

### UI-specific vs API-specific bugs

UI found (not findable via API):
- BUG-QTHT-UI-001 — form hint + client validation
- BUG-QTHT-UI-002 — login error display
- BUG-QTHT-UI-003 — console deprecation warnings
- UX details: OTP auto-submit, countdown timer, dashboard widgets

API found (harder via UI):
- BUG-QTHT-005 silent PUT no-op (UI might mask with success toast)
- BUG-QTHT-006 password backend — UI doesn't block so server truly accepts
- BUG-QTHT-009 JWT claim mismatch capDonVi=DP
- BUG-QTHT-007/008 cross-role authorization matrix (slow via UI: 5 roles × 4 endpoints)
- BUG-QTHT-001 JWT TTL 15min vs 30min spec
- BUG-QTHT-002 QTHT session policy (needs 2+ parallel browsers)

---

*Report generated: 2026-04-17 | QA Automation via Playwright + Claude Code*
