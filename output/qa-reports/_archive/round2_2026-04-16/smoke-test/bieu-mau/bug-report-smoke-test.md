# Báo cáo Lỗi — Smoke Test Module Thư viện Biểu mẫu (Round 2)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | Test — http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code + headless Chromium / Playwright) |
| **Ngày** | 2026-04-19 |
| **Loại test** | Smoke Test — Module 7.9 Biểu mẫu |
| **Tài liệu tham chiếu** | [smoke-test-report.md](smoke-test-report.md), [6.9-smoke-bieumau.md](../../../../smoke-specs/6.9-smoke-bieumau.md) |
| **Permission matrix** | [permission-matrix.md](../../../../permission-matrix.md) — dòng `BIEU_MAU` |

---

## Tổng hợp

Phát hiện **2 lỗi Blocker** ở module Biểu mẫu khiến smoke test **FAIL** tại Bước 2b.

> **Scope update sau multi-role retest (2026-04-19):** 2 bug này ảnh hưởng **TẤT CẢ role `CB_NV_*`** (TW/BN/DP), không chỉ CB_TW như ban đầu phát hiện. QTHT_TW PASS → module backend healthy, bug thuần FE role gating. Chi tiết retest: [multi-role-retest/supplementary-report.md](multi-role-retest/supplementary-report.md).

| Tổng | Blocker | Critical | Major | Minor | Trivial |
|------|---------|----------|-------|-------|---------|
| 2    | 2       | 0        | 0     | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| BUG-R2-BM-01 | Blocker | P0 | Permission | Biểu mẫu | Smoke 6.9 — Bước 2a/2b | Menu sidebar `Quản lý thư viện biểu mẫu` bị disabled cho role CB_TW, trái với permission matrix | Open |
| BUG-R2-BM-02 | Blocker | P0 | Happy | Biểu mẫu | Smoke 6.9 — Bước 2b | Route `/bieu-mau` render component nhưng stuck `<ant-spin>` loading vô hạn, không fire API, không redirect 403 | Open |

---

## BUG-R2-BM-01 — Menu Biểu mẫu bị disabled cho CB_TW trái permission matrix

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-R2-BM-01 |
| **Severity** | Blocker |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Thư viện Biểu mẫu (7.9) |
| **Thành phần** | `src/components/AppShell/Sidebar.tsx` + `src/components/AppShell/nav-structure.ts` + `src/utils/auth-rules.ts` |
| **URL** | http://103.172.236.130:3000/403 (khi ở sidebar) |
| **Trình duyệt** | Chromium 146 (headless, viewport 1440x900) |
| **Tài khoản bị ảnh hưởng** | **canbo_tw (CB_NV_TW), canbo_bn (CB_NV_BN), canbo_tinh (CB_NV_DP)** — toàn bộ role `CB_NV_*`. QTHT_TW không bị (verified). |
| **TC Reference** | Smoke 6.9 Bước 2a/2b |
| **SRS Reference** | [srs-fr-09-bieu-mau.md](../../../../../input/srs-v3/srs-fr-09-bieu-mau.md) |
| **Assignee** | FE Team + Permission/Ability Team |
| **Found by** | QA Automation |

### Mô tả

Permission matrix (`output/permission-matrix.md` dòng `BIEU_MAU`) quy định **CB_NV_TW có `✅ CRUD*`** trên entity BIEU_MAU. Tài khoản test `canbo_tw` thuộc role `CB_NV_TW` (xem `input/test-accounts.csv` dòng 5).

Tuy nhiên sau khi login, menu `Quản lý thư viện biểu mẫu` ở sidebar được render với class DOM `nav-item active disabled` (trái với `nav-item` bình thường). Click button không trigger navigate, URL giữ nguyên `/403`. Visual: màu xám nhạt, cursor not-allowed.

### Các bước tái hiện

1. Truy cập http://103.172.236.130:3000/login
2. Đăng nhập `canbo_tw` / `Test@1234`
3. Nhập OTP `666666` (bypass dev)
4. Landing page: `/403` (đúng behavior CB_TW không có dashboard default)
5. Inspect sidebar button `Quản lý thư viện biểu mẫu` qua DevTools (hoặc `$B html body`)
6. Quan sát class: `nav-item active disabled`
7. Click button → không có network request mới, URL giữ `/403`

### Kết quả mong đợi

Theo permission matrix `BIEU_MAU` dòng CB_NV_TW = `✅ CRUD*`:
- Menu button class = `nav-item` (không có `disabled`)
- Click → SPA navigate đến `/bieu-mau`
- Page render list thư mục biểu mẫu với tabs + buttons + filter

### Kết quả thực tế

- Menu button class = `nav-item active disabled`
- Click → không fire event, URL không đổi
- CB_TW không vào được module Biểu mẫu qua UI

### Evidence

**DOM (từ `$B html body`):**
```html
<button type="button" class="nav-item active disabled" title="Quản lý thư viện biểu mẫu">
  <span class="nav-icon">…</span>
  <span class="label">Quản lý thư viện biểu mẫu</span>
</button>
```

**Screenshot:** [bieumau-login-dashboard.png](screenshots/bieumau-login-dashboard.png) — sidebar với menu Biểu mẫu greyed out.

**So sánh permission matrix:**
```
| Entity    | QTHT | CB_NV_TW  | CB_NV_BN  | CB_NV_DP  | ...
| BIEU_MAU  | 👁️ R | ✅ CRUD*  | ✅ CRUD*  | ✅ CRUD*  | ...
```

### Root cause hypothesis

Candidate locations:
1. **`src/utils/auth-rules.ts`** — hàm define abilities bằng CASL có thể không cấp `manage` hoặc `read` cho `BIEU_MAU` khi role=CB_NV_TW. Check điều kiện gán cap.
2. **`src/components/AppShell/nav-structure.ts`** — nav item có field `requiredCap` hoặc tương tự. Xem value có khớp với ability cấp cho CB_NV_TW không.
3. **`/api/v1/auth/verify-otp` response** — trường `caps` / `permissions` trả về cho user CB_TW có include `BIEU_MAU.read` không.

### Gợi ý sửa

**Bước 1 — Verify layer bị sai:**
```bash
# 1. Check verify-otp response caps
curl -X POST http://103.172.236.130:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"canbo_tw","password":"Test@1234"}' | jq
# → lấy otpToken
curl -X POST http://103.172.236.130:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"otpToken":"<token>","otp":"666666"}' | jq '.data.user.caps, .data.user.permissions'
# → xem có "BIEU_MAU.read" / "BIEU_MAU.manage" không
```

**Bước 2 — Fix theo layer:**
- BE thiếu cap trong token: gán trong role-caps DB seed cho CB_NV_TW
- FE ability rule sai: sửa `auth-rules.ts`
- nav-structure check cap sai tên: sửa key trong `nav-structure.ts`

---

## BUG-R2-BM-02 — Route `/bieu-mau` stuck ant-spin, không fetch API, không redirect 403

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-R2-BM-02 |
| **Severity** | Blocker |
| **Priority** | P0 |
| **Type** | Happy (infrastructure) |
| **Status** | Open |
| **Module** | Thư viện Biểu mẫu (7.9) |
| **Thành phần** | `src/pages/bieu-mau/index.tsx` + `src/components/PermissionRoute/permission-route.tsx` |
| **URL** | http://103.172.236.130:3000/bieu-mau |
| **Trình duyệt** | Chromium 146 (headless, viewport 1440x900) |
| **Tài khoản bị ảnh hưởng** | **canbo_tw (CB_NV_TW), canbo_bn (CB_NV_BN), canbo_tinh (CB_NV_DP)** — toàn bộ role `CB_NV_*`. QTHT_TW không bị (verified). |
| **TC Reference** | Smoke 6.9 Bước 2b |
| **SRS Reference** | [srs-fr-09-bieu-mau.md](../../../../../input/srs-v3/srs-fr-09-bieu-mau.md) |
| **Assignee** | FE Team |
| **Found by** | QA Automation |

### Mô tả

Khi SPA navigate đến `/bieu-mau` (qua `window.history.pushState` + `PopStateEvent`), component `src/pages/bieu-mau/index.tsx` được Vite load thành công (`GET /src/pages/bieu-mau/index.tsx → 200, 20989B`). Tuy nhiên main content chỉ render `<div class="ant-spin ant-spin-spinning">` mãi không resolve. **Không** có bất kỳ API call `/api/v1/bieu-mau*` hay `/api/v1/thu-muc-bieu-mau*` được fire.

Nếu user không có permission cho module này (giả thuyết), page **phải** redirect `/403` ngay thay vì kẹt loading vô hạn — đây là bad UX (user tưởng app bị treo).

### Các bước tái hiện

1. Login `canbo_tw` / `Test@1234`, OTP `666666`
2. Ở trang /403, mở DevTools Console chạy:
   ```js
   window.history.pushState({}, '', '/bieu-mau');
   window.dispatchEvent(new PopStateEvent('popstate'));
   ```
3. Quan sát:
   - URL bar: đã thành `/bieu-mau` ✅
   - Main content: chỉ có 4 ant-spin dot xoay ở giữa ❌
   - Network tab: không có request `/api/v1/bieu-mau*` hay `/api/v1/thu-muc-bieu-mau*`
4. Chờ `--networkidle` → spinner vẫn xoay, không có thay đổi

### Kết quả mong đợi

Một trong 2 behavior:
- **(A)** Nếu role có permission: Page render tabs (`Tất cả`, `Đã công khai`, `Nháp`, `Đã ẩn`), button (`+ Thêm thư mục`, `Xuất Excel`, `Làm mới`), filter lĩnh vực PL, bảng danh sách thư mục. Fire API `GET /api/v1/thu-muc-bieu-mau?page=1&…`.
- **(B)** Nếu role thiếu permission: Redirect sang `/403` với message "Bạn không có quyền truy cập trang này" (giống route `/` cho CB_TW). KHÔNG được stuck ở `<ant-spin>`.

### Kết quả thực tế

Page mount component, hiển thị `<ant-spin>` loading và **không bao giờ** resolve:
- Không có API call nào được fire
- Không có redirect
- Không có error message / toast
- Không có empty state

### Evidence

**DOM (từ `$B html body`):**
```html
<main class="app-content" id="main-content">
  <div style="display: flex; justify-content: center; padding-top: 64px;">
    <div class="ant-spin ant-spin-lg ant-spin-spinning ant-spin-section ..."
         aria-live="polite" aria-busy="true">
      <span class="ant-spin-dot-holder">
        <span class="ant-spin-dot ant-spin-dot-spin">
          <i class="ant-spin-dot-item"></i>
          <i class="ant-spin-dot-item"></i>
          <i class="ant-spin-dot-item"></i>
          <i class="ant-spin-dot-item"></i>
        </span>
      </span>
    </div>
  </div>
</main>
```

**Network log đầy đủ sau navigate:**
```
GET  /src/pages/bieu-mau/index.tsx → 200 (34ms, 20989B)  ✅ (source only)
— KHÔNG có GET /api/v1/bieu-mau* hay GET /api/v1/thu-muc-bieu-mau* —
```

**Screenshot:** [bieumau-page.png](screenshots/bieumau-page.png) — main content với spinner dots.

### Root cause hypothesis

Khả năng cao nhất:
1. **PermissionRoute gate** — `src/components/PermissionRoute/permission-route.tsx` wrap `/bieu-mau` route, check ability. Nếu ability check chưa resolve (async) hoặc không có cap, có thể component return `<Spin>` thay vì redirect. Bug: không xử lý case "no cap" → infinite spinner.
2. **useQuery + enabled flag** — page component dùng `useQuery({ queryKey: [...], enabled: hasPermission })`. `hasPermission = false` nên query không fire, nhưng loading state mặc định true → spinner.
3. **Ability context race** — CASL ability context init async, component mount trước khi context ready, state isLoading=true và không có useEffect update khi context ready.

### Gợi ý sửa

**Bước 1 — Add timeout + fallback trong component:**
```tsx
// src/pages/bieu-mau/index.tsx
const { data, isLoading, error } = useBieuMauList();
const canRead = useAbility('BIEU_MAU', 'read');

if (!canRead) {
  return <Navigate to="/403" replace />;  // redirect thay vì spinner
}

if (error) return <ErrorState />;
if (isLoading) return <Spin />;
return <BieuMauListUI data={data} />;
```

**Bước 2 — Fix PermissionRoute để handle case thiếu cap:**
```tsx
// src/components/PermissionRoute/permission-route.tsx
if (abilityReady && !hasRequiredCap) {
  return <Navigate to="/403" replace />;
}
if (!abilityReady) {
  return <Spin size="large" />;  // với timeout fallback sau 5s
}
return children;
```

**Bước 3 — Cross-check các module khác**
Module khác (Đào tạo, Vụ việc...) có cùng pattern PermissionRoute này không? Nếu có, cần audit toàn site.

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| API base | http://103.172.236.130:3000/api/v1/ |
| Frontend | React + Vite (dev mode) + Ant Design + React Router + Zustand + CASL |
| Xác thực | JWT + OTP qua email (dev có bypass `666666`) |
| Source path | /home/ubuntu/dopai/pm-htpldn/source_code/ |

### B — Tài khoản dùng (đã test 4 role — 2026-04-19)

| Username | Role code | Matrix expected | Login landing | Menu class | Click nav | Content | Kết quả |
|----------|-----------|----------------|---------------|------------|-----------|---------|---------|
| qtht_tw | QTHT | 👁️ R | `/dashboard` | `nav-item` | `/bieu-mau/thu-muc` | full UI (tabs + filters + 1 row) | ✅ PASS |
| canbo_tw | CB_NV_TW | ✅ CRUD* | `/403` | `nav-item active disabled` | no nav | spinner stuck | ❌ FAIL |
| canbo_bn | CB_NV_BN | ✅ CRUD* | `/403` | `nav-item disabled` | no nav | — | ❌ FAIL |
| canbo_tinh | CB_NV_DP | ✅ CRUD* | `/403` | `nav-item disabled` | no nav | — | ❌ FAIL |

**Kết luận retest:** Bug ảnh hưởng **toàn bộ `CB_NV_*`** (TW/BN/DP), không phải role-specific. QTHT_TW không bị → module backend healthy, FE role gating bug.

Chi tiết multi-role retest: [multi-role-retest/supplementary-report.md](multi-role-retest/supplementary-report.md).

### C — Screenshots

| File | Bug ref | Mô tả |
|------|---------|-------|
| [bieumau-login-dashboard.png](screenshots/bieumau-login-dashboard.png) | BUG-R2-BM-01 | Sidebar sau login, menu Biểu mẫu greyed out |
| [bieumau-sidebar-menu.png](screenshots/bieumau-sidebar-menu.png) | BUG-R2-BM-01 | Sau click menu, URL không đổi, menu vẫn disabled |
| [bieumau-page.png](screenshots/bieumau-page.png) | BUG-R2-BM-02 | URL /bieu-mau, main chỉ có ant-spin dots |

### D — Priority đề xuất cho round 2

Cả 2 bug **Blocker P0** vì:
- Chặn toàn bộ functional test module Biểu mẫu (Lệnh 2-4) với role chính CB_TW
- Mâu thuẫn rõ ràng với spec permission matrix → cần fix trước khi release
- Bug BM-02 là bad UX (infinite spinner) — ảnh hưởng cả khi user cuối phát hiện

---

*Bug report v1.0 | 2026-04-19 | QA Automation — Smoke Biểu mẫu FAIL*
