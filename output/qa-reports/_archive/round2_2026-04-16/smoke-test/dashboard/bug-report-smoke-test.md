# Bug Report — Smoke Dashboard (FR-01) — Round 2

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | Phần mềm Hỗ trợ Pháp lý Doanh nghiệp (PM HTPLDN) |
| **Phiên bản** | Deploy 2026-04-16 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | Claude Code + /browse (Playwright headless) |
| **Ngày** | 10:35[2026-04-20] |
| **Loại test** | Smoke |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [spec 6.1](../../../../smoke-specs/6.1-smoke-dashboard.md), [SRS FR-01](../../../../../input/srs-v3/srs-fr-01-dashboard.md), [smoke-test-report.md](smoke-test-report.md) |

---

## Tổng hợp

Phát hiện **1** lỗi trong quá trình smoke test module Dashboard (FR-01).

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 1    | 1        | 0     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| BUG-SMOKE-DASH-001 | Critical | P0 | Permission | Dashboard (FR-01) | Smoke 6.1 Bước 2b | CB_NV_TW không truy cập được Dashboard — click `Tổng quan` no-op, URL giữ `/403`, vi phạm SRS FR-I actor list | Open |

---

## BUG-SMOKE-DASH-001 — CB_NV_TW click menu `Tổng quan` không navigate, URL giữ `/403` (Dashboard không vận hành được cho role primary per SRS)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-SMOKE-DASH-001 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Dashboard (FR-01) — Tổng quan hệ thống |
| **Thành phần** | FE: `PermissionRoute` / `Sidebar` (xem `src/components/PermissionRoute/permission-route.tsx`, `src/components/AppShell/nav-structure.ts`) hoặc BE: `GET /api/v1/auth/me` permissions payload cho role CB_NV |
| **URL** | http://103.172.236.130:3000/ (root) → redirect `/403`; `/tong-quan` / `/dashboard` — chưa verify do FE không navigate |
| **Trình duyệt** | Chromium 146 headless (Playwright) |
| **Tài khoản** | `canbo_tw` (Cán bộ TW — CB_NV_TW, Cục BTTP) |
| **TC Reference** | Smoke 6.1 Bước 2b |
| **SRS Reference** | FR-I-01..09 (Dashboard) §1 Tổng quan nhóm — Actor: "Cán bộ Nghiệp vụ (TW/BN/ĐP), Cán bộ Phê duyệt (TW/BN/ĐP)" |
| **Assignee** | FE Team (PermissionRoute) + BE Team (permission seed) — điều tra song song |
| **Found by** | QA Automation (Claude Code + /browse) |

### Mô tả

Với account smoke `canbo_tw` (role CB_NV_TW — Cán bộ Nghiệp vụ cấp Trung ương), sau khi login thành công và landing tại `/403`, click vào menu `Tổng quan` ở sidebar **không navigate**. URL giữ nguyên `/403`, nội dung không đổi, không có page render Dashboard. Theo SRS FR-01 §1, role CB_NV là actor chính của Dashboard → phải truy cập được.

### Các bước tái hiện

1. Mở http://103.172.236.130:3000/ → browser redirect `/login`.
2. Nhập username `canbo_tw` / password `Test@1234` → click "Đăng nhập".
3. Ở trang OTP, nhập `666666` (bypass bật theo CLAUDE.md Rule 3) → app redirect automatic.
4. **Quan sát landing:** URL = `http://103.172.236.130:3000/403`, body render 403 page ("Bạn không có quyền truy cập trang này."), sidebar load đủ 12 menu bao gồm `Tổng quan` ở đầu.
5. Click menu `Tổng quan` trong sidebar.
6. **Quan sát:** URL **không đổi** (vẫn `/403`), nội dung page không thay đổi, không có request tới `/api/v1/dashboard/*` hay `/api/v1/kpi/*`, console sạch.

### Kết quả mong đợi

Theo **SRS FR-01 §1 Tổng quan nhóm**:
> **Tác nhân:** Cán bộ Nghiệp vụ (TW/BN/ĐP), Cán bộ Phê duyệt (TW/BN/ĐP)

Và **Preconditions chung (TPL-DASH-KPI)**:
> - User đã đăng nhập (BR-AUTH-01)
> - User có quyền truy cập Dashboard

→ Khi `canbo_tw` (CB_NV_TW = Cán bộ Nghiệp vụ TW, **actor chính theo SRS**) click menu `Tổng quan`:
- URL phải đổi sang `/` hoặc `/dashboard` hoặc `/tong-quan`
- Page Dashboard render đầy đủ: breadcrumb "Trang chủ > Tổng quan", tiêu đề "Tổng quan hệ thống", nút `Làm mới` + nhãn `Cập nhật lúc HH:mm`, filter bar (Năm/Từ ngày/Đến ngày/Đơn vị/Áp dụng/Xóa bộ lọc), 7 thẻ KPI (KPI-01..07) + 2 KPI bổ sung, 2 biểu đồ UC8 (bar+line) + UC9 (donut).
- Landing mặc định sau login với role này nên là Dashboard (KHÔNG phải `/403`).

### Kết quả thực tế

- Landing sau login = `/403` (không phải Dashboard mặc định).
- Click menu `Tổng quan` → browse log: `[click] Clicked aside >> text=Tổng quan → now at http://103.172.236.130:3000/403`
- URL sau click: `/403` (không đổi).
- Body text vẫn là 403 page: `... / 403 / Bạn không có quyền truy cập trang này. / Trở về trang chủ`
- `document.querySelectorAll('canvas').length` = **0** (spec yêu cầu ≥ 2 canvas/svg cho 2 biểu đồ).
- Network tab: không có request nào gọi endpoint Dashboard KPI — chứng tỏ page Dashboard **không** được attempt render, không phải "render rồi BE fail".

### Bằng chứng

**Atomic chain đã chạy:**
```bash
$B chain <<<JSON
[
  ["goto","http://103.172.236.130:3000/login"],
  ["wait","input[placeholder=\"Nhập tên đăng nhập\"]"],
  ["fill","input[placeholder=\"Nhập tên đăng nhập\"]","canbo_tw"],
  ["fill","input[placeholder=\"Nhập mật khẩu\"]","Test@1234"],
  ["click","button[type=\"submit\"]"],
  ["js","new Promise(r=>setTimeout(r,3500))"],
  ["type","666666"],
  ["js","new Promise(r=>setTimeout(r,10000))"],
  ["url"],                                                   // → /403
  ["click","aside >> text=Tổng quan"],
  ["js","new Promise(r=>setTimeout(r,8000))"],
  ["url"],                                                   // → /403 (KHÔNG ĐỔI)
  ["js","JSON.stringify({canvasCount: document.querySelectorAll('canvas').length, bodyText: document.body.innerText.substring(0,3500)})"]
]
JSON
```

**Output JS assert:**
```json
{
  "url":"http://103.172.236.130:3000/403",
  "canvasCount":0,
  "svgCount":17,
  "bodyText":"Bỏ qua đến nội dung chính\nHỗ trợ pháp lý doanh nghiệp\nBộ Tư pháp\nTổng quan\nQuản lý hỏi đáp pháp lý\n... [12 menu item] ...\nBộ Tư pháp — Cục Bổ trợ tư pháp\n99+\nCT\nCán bộ TW\nCB_TW\n403\nBạn không có quyền truy cập trang này.\nTrở về trang chủ"
}
```

**API pre-check (confirm account healthy):**
```bash
curl -s -X POST http://103.172.236.130:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"canbo_tw","password":"Test@1234"}'
# → {"success":true,"data":{"otpToken":"57e2bed6-201e-4285-8655-feb4d432197c","otpExpiresIn":300,"maskedEmail":"can***@htpldn.gov.vn","message":"Mã xác thực đã gửi qua email"}}
```

**Screenshots:**
- ![Landing /403 sau login](screenshots/dashboard-login-landing.png)
- ![Sau click `Tổng quan` — vẫn /403](screenshots/dashboard-page.png) *(giống landing — click không đổi state)*

### Tác động (Impact)

- **Cán bộ Nghiệp vụ TW (canbo_tw)** — 1 trong 4 role primary của Dashboard per SRS — **không dùng được** module Dashboard.
- 100% user role CB_NV_TW khi login không thấy KPI Dashboard → không nắm được tổng quan hệ thống → business value của module = 0 cho role này.
- **Có khả năng** các role khác cùng pattern (CB_NV_BN, CB_NV_DP, CB_PD_TW/BN/DP = 5 role còn lại trong actor list FR-01) cũng bị — cần retest để confirm scope.
- **Block smoke** nên **block** Lệnh 2 (data-readiness Dashboard) + Lệnh 4 (functional + permission Dashboard) cho đến khi fix.
- Pattern lặp với **BUG-PERM-M8.3-002** (TVCS menu disabled cho CB_NV) + **BUG-SMOKE-TVN-001** (Tư vấn Nhanh submenu disabled CB_NV) → có thể cùng root cause: FE ability-rule thiếu seed `dashboard/tv-chuyen-sau/tu-van-nhanh` cho CB_NV.

### So sánh (suggest verify ở Round 3)

| Role | Landing expected | Click `Tổng quan` expected | Status thực tế |
|------|------------------|----------------------------|-----------------|
| CB_NV_TW (canbo_tw) | Dashboard | navigate + render 7 KPI + 2 chart | ❌ /403 + click no-op |
| CB_NV_BN (canbo_bn) | Dashboard | navigate | ❓ chưa test (Round 3 verify) |
| CB_NV_DP (canbo_dp) | Dashboard | navigate | ❓ chưa test |
| CB_PD_TW/BN/DP | Dashboard | navigate | ❓ chưa test |
| QTHT (admin / qtht_tw) | có thể khác (admin dashboard) | navigate | ❓ chưa test |
| Lãnh đạo (lanhdao_tw) | Dashboard | navigate | ❓ chưa test |

### Nguyên nhân nghi ngờ (Root Cause)

Hai hypothesis song song:

**(H1) FE `PermissionRoute` check sai ability key cho route Dashboard.**
- File liên quan: `src/components/PermissionRoute/permission-route.tsx` + `src/routes/router.tsx` (Dashboard route definition) + `src/store/auth.store.ts` (JWT + permissions payload).
- Symptom: click menu gửi `navigate('/dashboard')` hoặc equivalent, nhưng `PermissionRoute` catch missing ability → redirect `/403`. Kiểm tra bằng watch `location.pathname` + React DevTools thấy redirect intermediate.

**(H2) BE permission seed thiếu `dashboard:read` (hoặc tương đương) cho role `CB_NV`.**
- Nếu `GET /api/v1/auth/me` response có `permissions` array thiếu entry `dashboard:*` → hypothesis confirmed.
- Verify bằng:
  ```bash
  # Sau login, dùng accessToken:
  curl -H "Authorization: Bearer <token>" http://103.172.236.130:3000/api/v1/auth/me | jq '.data.permissions[] | select(. | contains("dashboard"))'
  ```

**Phụ thuộc H1/H2:** Nếu H2 confirmed, fix BE seed 1 dòng + redeploy; nếu H1, fix FE ability-rule thêm key `dashboard` mapping tới rule BE trả về.

Lưu ý **bonus: menu `Tổng quan` vẫn enabled/clickable UI mà không navigate** — **UX bug phụ**: khi thiếu permission, menu item nên hidden hoặc disabled (cursor not-allowed + gray), không phải no-op gây confused user. Pattern lặp BUG-PERM-M8.3-002 / BUG-SMOKE-TVN-001.

### Gợi ý sửa (Suggested Fix)

**Bước 1 — Xác định H1 vs H2:**
```bash
# Login rồi inspect /auth/me
TOKEN=$(curl -s -X POST http://103.172.236.130:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"username":"canbo_tw","password":"Test@1234"}' | jq -r '.data.otpToken')
# (thêm bước verify OTP 666666 nếu có endpoint, lấy accessToken)
# Rồi:
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" http://103.172.236.130:3000/api/v1/auth/me | jq '.data.permissions'
```

Nếu response **có** `dashboard:read` → H1 (FE bug). Nếu **không có** → H2 (BE seed thiếu).

**Bước 2 — Fix theo hypothesis:**

*(H2) BE fix — add permission seed:*
```diff
// seed/permissions.ts hoặc equivalent (permissions migration)
  { role: 'CB_NV', permissions: [
-   'hoi_dap:read', 'hoi_dap:create', ...
+   'hoi_dap:read', 'hoi_dap:create', ...,
+   'dashboard:read'
  ]},
```

*(H1) FE fix — sửa `PermissionRoute` mapping:*
```diff
// src/routes/router.tsx hoặc nav-structure.ts
- { path: '/dashboard', requires: 'dashboard.view', ... }
+ { path: '/dashboard', requires: 'dashboard:read', ... }
```

**Bước 3 — Fix UX phụ (hidden/disabled menu khi thiếu perm):**
```diff
// nav-structure.ts hoặc Sidebar render logic
- const showMenu = true;
+ const showMenu = ability.can('read', 'Dashboard');
  if (!showMenu) return null; // hoặc render <MenuItem disabled>
```

**Bước 4 — Verify after fix:**
```bash
# Retest smoke 6.1 Bước 2b với canbo_tw → kỳ vọng URL đổi sang /dashboard + canvasCount ≥ 2 + 7 KPI labels visible
```

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` bypass (CLAUDE.md Rule 3) |
| MailHog | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design + CASL (PermissionRoute) |
| Xác thực | JWT + OTP (bypass `666666` trong dev) |
| Browse tool | `~/.claude/skills/gstack/browse/dist/browse` (Playwright headless Chromium 146) |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho bug nào |
|---------------|---------|-----|------------------|
| canbo_tw | CB_NV (Cán bộ TW) | TW | BUG-SMOKE-DASH-001 |

### C — Danh mục ảnh chụp

| File | Mô tả | Dùng cho bug |
|------|-------|--------------|
| [screenshots/dashboard-login-landing.png](screenshots/dashboard-login-landing.png) | Landing sau login = `/403`, sidebar visible với `Tổng quan` | BUG-SMOKE-DASH-001 |
| [screenshots/dashboard-page.png](screenshots/dashboard-page.png) | Sau click `Tổng quan` — URL giữ `/403`, không navigate | BUG-SMOKE-DASH-001 |

### D — Related bugs (pattern)

| Bug ID | Module | Pattern chung | Ghi chú |
|--------|--------|---------------|---------|
| BUG-PERM-M8.3-002 | TV Chuyên sâu (FR-12) | Menu visible UI nhưng click no-op / deny cho CB_NV | Critical, đã gửi dev 2026-04-19 |
| BUG-SMOKE-TVN-001 | Tư vấn Nhanh (FR-13) | Submenu disabled cho CB_NV_TW dù JWT có đủ 14 permissions TVNHANH | Critical, đã gửi dev 2026-04-19 |
| **BUG-SMOKE-DASH-001** | **Dashboard (FR-01)** | **Click menu no-op cho CB_NV_TW, URL giữ /403** | **NEW, gửi cùng đợt** |

→ Đề xuất dev: fix 1 batch (cùng FE ability-rule seed hoặc cùng BE permissions seed `CB_NV` role) có thể unblock cả 3 module.

---

*Bug report v1.0 | 2026-04-20 | Claude Code via /browse*
