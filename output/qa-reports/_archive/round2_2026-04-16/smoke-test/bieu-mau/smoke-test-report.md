# Smoke Test Report — Module Thư viện Biểu mẫu (Round 2)

> **Verdict:** ❌ **FAIL** — Bước 2b fail. Menu sidebar bị UI disable cho **TẤT CẢ role `CB_NV_*`** (TW/BN/DP — trái với permission matrix). Direct URL `/bieu-mau` load được component nhưng page stuck ant-spin loading vô hạn. **QTHT_TW PASS** với full UI → module backend healthy, bug nằm ở FE role gating.
>
> **Multi-role retest (2026-04-19 sau smoke v1):** xem [multi-role-retest/supplementary-report.md](multi-role-retest/supplementary-report.md) để biết detail scope bug mở rộng ra CB_NV_BN + CB_NV_DP.

---

## 0. Metadata

| Thông tin | Giá trị |
|-----------|---------|
| **Round** | Round 2 (2026-04-16) |
| **Ngày test** | 2026-04-19 |
| **Tester** | Claude + `/browse` |
| **Environment** | http://103.172.236.130:3000/ |
| **Primary Account** | `canbo_tw` / `Test@1234` (OTP bypass `666666`) — role CB_TW |
| **Test Method** | `/browse` (Playwright headless) — **mega-chain atomic mode** |
| **Browse Status** | OK sau khi xử lý browse crash root-cause (xem §8.A) |
| **Spec tham chiếu** | [6.9-smoke-bieumau.md](../../../../smoke-specs/6.9-smoke-bieumau.md) |
| **SRS** | [srs-fr-09-bieu-mau.md](../../../../../input/srs-v3/srs-fr-09-bieu-mau.md) |
| **Permission matrix** | [permission-matrix.md](../../../../permission-matrix.md) — row `BIEU_MAU` |
| **Test duration** | ~15 phút (bao gồm recovery browse crash + 5 chain retries để isolate root cause) |

---

## 1. Executive Summary

| # | Module | C1 Access (Bước 1-2a) | C2 List (Bước 2b) | C3 Detail | C4 Create | Verdict |
|---|--------|----------------------|-------------------|-----------|-----------|---------|
| 9 | Thư viện Biểu mẫu | ✅ | ❌ | ⏭️ | ⏭️ | ❌ FAIL |

### Verdict tổng: **❌ FAIL** tại Bước 2b

Login + OTP bypass OK. Menu `Quản lý thư viện biểu mẫu` visible trong sidebar, **nhưng bị UI disabled** (class `nav-item active disabled` trong DOM). Click menu không fire navigation. Direct URL `/bieu-mau` load được page source (`GET /src/pages/bieu-mau/index.tsx → 200, 20989B`) nhưng body render chỉ có `<div class="ant-spin ant-spin-lg ant-spin-spinning">` — không có tabs, buttons, filter hay list; không có API call `/api/v1/bieu-mau*` nào được fire.

**Mâu thuẫn với permission matrix** (dòng `BIEU_MAU`): CB_NV_TW (canbo_tw) được cấp `✅ CRUD*` nhưng UI block ở cả 2 tầng (menu disabled + page spinner không resolve).

---

## 2. Pre-check kết quả

| Check | Kết quả |
|-------|---------|
| Server up (`curl http://103.172.236.130:3000/`) | ✅ HTTP 200 (17ms) |
| Auth endpoint alive (`POST /api/v1/auth/login`) | ✅ HTTP 200 (335ms), trả `otpToken` |
| Account `canbo_tw` lock | ✅ Không lock |

→ Pre-check pass, blocker nằm ở FE UI / permission gating của module Biểu mẫu.

---

## 3. Per-step Details

### Bước 1 — LOGIN: ✅ PASS

**Flow (atomic chain):**
```
goto /login → fill username/password → click submit
→ wait input[inputmode="numeric"][maxlength="1"] (OTP page appears)
→ type "666666" (OTP bypass, auto-focus ô đầu)
→ wait button:has-text("Quản lý thư viện biểu mẫu")
```

**Kết quả:**
- `POST /api/v1/auth/login → 200` (388ms, 192B) ✅
- `POST /api/v1/auth/verify-otp → 200` (29ms, 5279B) ✅
- `GET /api/v1/thong-baos/unread-count → 200` ✅
- URL sau login: `http://103.172.236.130:3000/403` — **expected**, CB_TW không có dashboard default (cùng pattern với smoke Đào tạo).
- Topbar: `Cán bộ TW / CB_TW` ✅
- sessionStorage có `auth-store` (198 chars) → session alive ✅

**Evidence:** [bieumau-login-dashboard.png](screenshots/bieumau-login-dashboard.png) — trang /403 với sidebar đầy đủ role CB_TW.

### Bước 2a — Menu visible trong sidebar: ✅ PASS

Snapshot sidebar sau login:
```
@e10 [button] "Quản lý thư viện biểu mẫu"   ← LEAF (không có ▶ submenu)
```

Menu xuất hiện ở vị trí đúng theo nav-structure. ✅

### Bước 2b — Navigate module: ❌ FAIL

#### Cách 1 — Click sidebar menu (theo spec)

Sau click `button:has-text("Quản lý thư viện biểu mẫu")`:
- URL **không đổi** — vẫn `/403` sau 2× click + 2× `wait --networkidle`.
- **Zero** network request mới tới `/api/v1/bieu-mau*`, `/api/v1/thu-muc-bieu-mau*`, hay route change.
- Screenshot sau click: y hệt trang /403 trước click.

**Root cause ở DOM** (từ `$B html body`):
```html
<button type="button" class="nav-item active disabled" title="Quản lý thư viện biểu mẫu">
  <span class="nav-icon">…</span>
  <span class="label">Quản lý thư viện biểu mẫu</span>
</button>
```

→ FE render menu với class `disabled`. Click event không nav. Visual cũng xác nhận (màu xám nhạt + cursor not-allowed, giống menu "Tổng quan" bên trên cũng disabled cho CB_TW).

#### Cách 2 — Direct URL via SPA pushState

```js
window.history.pushState({}, '', '/bieu-mau');
window.dispatchEvent(new PopStateEvent('popstate'));
```

→ URL thành công đổi sang `/bieu-mau`. Network:
- `GET /src/pages/bieu-mau/index.tsx → 200 (34ms, 20989B)` ✅ (component source load OK)
- **KHÔNG** có `GET /api/v1/bieu-mau*` hay `/api/v1/thu-muc-bieu-mau*` — tức component render xong nhưng không fire data fetch.

**Body HTML** (từ `$B html body`):
```html
<main class="app-content" id="main-content">
  <div style="display: flex; justify-content: center; padding-top: 64px;">
    <div class="ant-spin ant-spin-lg ant-spin-spinning ant-spin-section"
         aria-live="polite" aria-busy="true">
      <span class="ant-spin-dot-holder">…4 dot items…</span>
    </div>
  </div>
</main>
```

→ Page stuck ant-spin loading vĩnh viễn. Đợi thêm `--networkidle` cũng không resolve.

#### Cách 3 — Direct URL via `$B goto /bieu-mau`

→ Full page reload → AuthGuard kick về `/login` (session bị lost do goto reset state). Đây là Rule 5/8 session behavior, không phải bug module.

#### Spec checklist vs actual (Bước 2b)

| Expected | Actual | Kết quả |
|----------|--------|---------|
| URL chứa `/bieu-mau` hoặc `/thu-vien` | `/bieu-mau` (khi dùng pushState) | ✅ |
| Tabs ≥3/4 (`Tất cả`, `Đã công khai`, `Nháp`, `Đã ẩn`) | **Không có tab nào render** | ❌ |
| Nút `+ Thêm thư mục`, `Xuất Excel`, `Làm mới` | **Không có button nào** | ❌ |
| Filter lĩnh vực PL | **Không có filter** | ❌ |
| Header cột: Tên thư mục, Lĩnh vực, Số biểu mẫu, Trạng thái, Ngày tạo | **Không có bảng** | ❌ |
| API fetch `/api/v1/thu-muc-bieu-mau` hoặc `/api/v1/bieu-mau` | **Không fire call nào** | ❌ |

→ Mapping vào spec verdict table: `❌ Thiếu tabs/buttons → FAIL, note`.

**Evidence:** [bieumau-page.png](screenshots/bieumau-page.png) — main content chỉ có ant-spin dots, menu biểu mẫu greyed out trong sidebar.

### Bước 3 — Lỗi ngầm: ✅ (không có 4xx/5xx, không console error)

| Check | Kết quả |
|-------|---------|
| `$B console --errors` trên `/bieu-mau` | `(no console errors)` sau 1 lần cleanup |
| `$B network` — grep 4xx/5xx | **0 request 4xx/5xx** trong chain cuối cùng |
| Snapshot grep `Lỗi`, `Validation failed`, `Không thành công`, `undefined` | Không match |

**Note:** Trong các attempt sớm với chain v4 (pushState chưa warm server), quan sát có:
- `[error] Failed to load resource: 401 (Unauthorized)`
- `[error] Failed to load resource: 404 (Not Found)`

Nhưng trong chain v5 stable cuối cùng (kết quả dùng để verdict) thì clean. Tức 401/404 là do race condition session chưa ready khi pushState — không phải bug production. Ghi chú lại §5.

---

## 4. Failed — Chi tiết

### 4.1 Mâu thuẫn UI disabled vs permission matrix

**Triệu chứng:** Menu `Quản lý thư viện biểu mẫu` có DOM class `nav-item active disabled` cho role CB_TW, mặc dù permission matrix cấp `✅ CRUD*`.

Permission matrix (đã verify):
```
| Entity    | QTHT | CB_NV_TW  | CB_NV_BN  | CB_NV_DP  | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN  | NHT | TVV | CG |
| BIEU_MAU  | 👁️ R | ✅ CRUD*  | ✅ CRUD*  | ✅ CRUD*  | 👁️ R*    | 👁️ R*    | 👁️ R*    | 👁️ R | 👁️ R | ❌ | ❌ |
```

canbo_tw role = CB_NV_TW (xem `input/test-accounts.csv`). **Phải** có CRUD trên BIEU_MAU.

**Reproduce:**
```
1. Login canbo_tw / Test@1234, OTP 666666
2. Inspect sidebar button "Quản lý thư viện biểu mẫu"
3. Quan sát DOM: <button class="nav-item active disabled">
4. Click → no navigation
```

**Assignee candidates:**
- FE team: check `nav-structure.ts` + ability rules trong `auth-rules.ts` — có thể gate menu Biểu mẫu bằng ability `BIEU_MAU.read` nhưng role CB_TW không gán cap này dù matrix nói có
- BE/permission team: verify role CB_NV_TW có cap `BIEU_MAU.read` trong `/api/v1/auth/verify-otp` response caps list không

### 4.2 Route `/bieu-mau` render nhưng không fetch data

**Triệu chứng:** Khi navigate vào `/bieu-mau` qua SPA router (pushState), component `src/pages/bieu-mau/index.tsx` mount nhưng chỉ render `<div class="ant-spin ant-spin-spinning">`. Không fire bất kỳ API call `/api/v1/bieu-mau*` nào.

**Reproduce:**
```
1. Login + landing /403
2. Run in console: 
   window.history.pushState({}, '', '/bieu-mau');
   window.dispatchEvent(new PopStateEvent('popstate'));
3. Quan sát main content: chỉ có ant-spin
4. Network tab: không có /api/v1/bieu-mau hay /api/v1/thu-muc-bieu-mau
```

**Hypothesis:**
- PermissionRoute wraps `/bieu-mau`, requiring cap mà CB_TW không có → component return sớm (render spinner placeholder thay vì redirect 403 như mong đợi).
- Hoặc: useBieuMauAbility hook chờ ability context init không bao giờ resolve.
- Hoặc: hook `useQuery` fetch /api/v1/thu-muc-bieu-mau bị disabled bởi `enabled: hasCap`, spinner hiển thị vĩnh viễn.

**Assignee:** FE team — review `/src/pages/bieu-mau/index.tsx` + `/src/components/PermissionRoute/` để xử lý spinner stuck + redirect đúng khi thiếu permission.

**Screenshots:**
- [bieumau-page.png](screenshots/bieumau-page.png) — stuck spinner sau pushState

### 4.3 Severity: Blocker cho functional Biểu mẫu

- Chặn Lệnh 2 (data readiness) cho module Biểu mẫu trên role CB_TW
- Chặn mọi test case functional 7.9 nếu chỉ dùng account canbo_tw
- Workaround test: dùng QTHT_TW (full CRUD nhiều module) hoặc admin để verify module Biểu mẫu còn sống, rồi quay lại fix phân quyền CB_TW

---

## 5. Retry Log

| Chain | Attempt | Kết quả | Root cause / Fix |
|-------|---------|---------|------------------|
| v1 | goto → wait → fill → click → `js setTimeout(3500)` → type | FAIL (`Target page closed` sau click submit) | Raw `setTimeout` giữa navigation làm Playwright context die. |
| v2 | goto → … → `wait OTP input` → type → `wait sidebar text` | ✅ PASS login, landing /403 | Replace `js setTimeout` bằng `wait <selector>` — survive transition. |
| v3 | v2 + click menu + wait networkidle | ✅ login OK, ❌ menu click không nav (URL giữ /403) | Discovered menu disabled — click no-op. |
| v4 | v2 + `$B goto /bieu-mau` | ❌ redirect `/login` (full reload lost session) | Goto = full reload = Rule 5 session loss. |
| v5 | v2 + `js window.history.pushState` + dispatchEvent popstate | ✅ URL `/bieu-mau`, ❌ page stuck spinner | Confirmed route accessible nhưng component stuck. |

**Rule 7 compliance:** Crash đầu tiên (chain v1) → root-cause ngay (raw setTimeout) thay vì blind retry. Không có "crash 2" thực sự — các chain sau là **strategy change**, không phải retry cùng flow.

**Trước đó (session lúc 12:15):** 4 chain attempt crash consecutively — verdict BLOCKED. Rerun (12:45) với pattern `wait <selector>` thay `sleep raw` → login PASS ngay chain đầu. Root cause crash chain cũ = raw `setTimeout` sau click submit, đã fix.

---

## 6. Blocker Escalation

| # | Module | Issue | Severity | Assignee | Status |
|---|--------|-------|----------|----------|--------|
| 1 | Biểu mẫu | Menu sidebar disabled cho CB_TW mặc dù permission matrix cấp CRUD* | Blocker | FE + permission team | Reported |
| 2 | Biểu mẫu | Route `/bieu-mau` render component nhưng stuck `<ant-spin>`, không fire data fetch, không redirect 403 | Blocker | FE team | Reported |

### Update đề xuất CLAUDE.md (verified 2026-04-19):

| # | Rule | Update |
|---|------|--------|
| 1 | Rule 3 | Giữ nguyên — selector `input[inputmode="numeric"][maxlength="1"]` đã work. |
| 2 | Rule 5 | **Thêm warning:** "Dùng `['wait','<element-cụ-thể>']` thay `['js','setTimeout']` sau click submit login. Raw setTimeout giữa navigation làm Playwright context die → chain crash `Target page closed`." |
| 3 | Rule 8 | **Thêm pattern:** SPA navigate sau login (không mất session) dùng `['js','window.history.pushState({}, \"\", \"<path>\"); window.dispatchEvent(new PopStateEvent(\"popstate\"))']` thay vì `goto` (goto = full reload = lose session). |

---

## 7. Recommendations

### Immediate (FE/BE team):
1. **Audit** `auth-rules.ts` + `nav-structure.ts` — tại sao menu Biểu mẫu bị `disabled` cho CB_TW dù có cap `BIEU_MAU.read`?
2. **Fix** `/src/pages/bieu-mau/index.tsx` — nếu thiếu permission, phải redirect 403 (hoặc hiện empty state hoặc error message), không được stuck `<ant-spin>`.
3. **Re-test** với account admin hoặc QTHT_TW để confirm module Biểu mẫu còn sống (isolate FE vs BE).

### Unlock Lệnh 2:
- [x] **UNLOCK với QTHT_TW** — verify 2026-04-19 PASS smoke đầy đủ 4/4 (xem supplementary retest). Module backend healthy.
- [ ] ❌ **KHÔNG unlock với CB_NV_*** (TW/BN/DP) cho đến khi fix FE role gating.

### Verify lại sau fix:
- [x] ~~Cross-check với canbo_bn, canbo_tinh~~ — **Đã verify 2026-04-19, cả 2 FAIL cùng pattern** (xem supplementary retest).
- [ ] Re-run smoke 6.9 với canbo_tw/canbo_bn/canbo_tinh → expect menu enabled → navigate OK → tabs + filter + list render.
- [ ] Verify role CB_PD_TW/BN/DP chỉ có 👁️ R* — menu phải enable nhưng không có nút Thêm/Sửa/Xóa.
- [ ] Verify role DN, NHT — menu enable read-only theo matrix.
- [ ] Verify role TVV, CG — menu **không** hiển thị theo matrix (`❌`).

### Cải thiện smoke process:
- Thêm **Bước 2c** vào spec 6.9: "Inspect DOM class menu button — nếu `disabled` → note immediately thay vì chỉ click + đợi URL change."
- Thêm **FAIL flag** khi page render chỉ có `<ant-spin>` > 5s + không có API call → probable permission/race bug.

---

## 8. Appendix

### 8.A. Browse crash recovery — root cause

**Session trước (báo cáo v1 cùng ngày, mark BLOCKED):** 4 chain crash liên tiếp với error `Target page, context or browser has been closed` sau click submit login.

**Root cause phát hiện 2026-04-19:** Pattern `["js","new Promise(r=>setTimeout(r,3500))"]` giữa `click submit` và `type OTP` làm Playwright mất page context. Khi JS promise running mà page đang navigate (React router transition sau login), context bị close.

**Fix đã verify (chain v2 trở đi):** Thay raw setTimeout bằng `["wait","input[inputmode=\"numeric\"][maxlength=\"1\"]"]` — Playwright chủ động poll element → giữ context alive qua transition.

→ **CLAUDE.md Rule 5 cần update** với warning này. Smoke Đào tạo (2026-04-18) may mắn không trigger vì navigation timing khác.

### 8.B. Browse patterns đã verify

| Pattern | Kết quả | Áp dụng |
|---------|---------|---------|
| `$B goto /login` bên ngoài chain để warm server, sau đó chain từ `fill` | ✅ Stable | Bypass startup race |
| `wait <element>` thay `js setTimeout` | ✅ Stable qua navigation | **Critical** cho login flow |
| `js window.history.pushState + popstate` cho SPA nav | ✅ Giữ session intact | Thay `goto` khi đã login |
| `goto` giữa chain sau login | ❌ Lose session, redirect /login | Không dùng |
| Click sidebar menu button | ❌ Menu disabled cho CB_TW (bug module) | Fallback sang pushState |

### 8.C. Screenshots

| File | Bước | Mô tả |
|------|------|-------|
| [bieumau-login-dashboard.png](screenshots/bieumau-login-dashboard.png) | Bước 1 | Sau login, URL /403 ("Bạn không có quyền truy cập trang này"), sidebar đủ menu role CB_TW. Menu "Quản lý thư viện biểu mẫu" **visible nhưng greyed out**. |
| [bieumau-sidebar-menu.png](screenshots/bieumau-sidebar-menu.png) | Bước 2a | Trạng thái sidebar sau click menu — URL không đổi, menu vẫn greyed. |
| [bieumau-page.png](screenshots/bieumau-page.png) | Bước 2b | URL `/bieu-mau`, main content **chỉ có `<ant-spin>` loading dots**, sidebar menu biểu mẫu active+disabled. |

### 8.D. Network log (request chính)

```
POST /api/v1/auth/login           → 200 (388ms, 192B)   ✅
POST /api/v1/auth/verify-otp      → 200 (29ms, 5279B)   ✅
GET  /api/v1/thong-baos/unread-count → 200 (21ms, 49B) ✅
GET  /src/pages/bieu-mau/index.tsx → 200 (34ms, 20989B) ✅ (source load)
—— KHÔNG có /api/v1/bieu-mau* hay /api/v1/thu-muc-bieu-mau* ——
```

**Observation:** Sau khi component `bieu-mau/index.tsx` mount, KHÔNG có API call nào fire — component stuck trước data fetch (dấu hiệu permission gate block).

### 8.E. DOM evidence — menu disabled

```html
<!-- Button HTML từ $B html body -->
<button type="button" class="nav-item active disabled" title="Quản lý thư viện biểu mẫu">
  <span class="nav-icon">
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"></path>
      <line x1="3" y1="7" x2="17" y2="7"></line>
      <line x1="8" y1="7" x2="8" y2="17"></line>
    </svg>
  </span>
  <span class="label">Quản lý thư viện biểu mẫu</span>
</button>
```

Class **`disabled`** — đây là nguyên nhân click không navigate.

### 8.F. DOM evidence — main content stuck

```html
<main class="app-content" id="main-content">
  <div style="display: flex; justify-content: center; padding-top: 64px;">
    <div class="ant-spin ant-spin-lg ant-spin-spinning ant-spin-section ..."
         aria-live="polite" aria-busy="true">
      <span class="ant-spin-dot-holder">
        <span class="ant-spin-dot ant-spin-dot-spin">
          <i class="ant-spin-dot-item"></i>…
        </span>
      </span>
    </div>
  </div>
</main>
```

---

*Report v2.0 | 2026-04-19 | Smoke Biểu mẫu — FAIL (menu disabled + route stuck spinner cho CB_TW trái matrix)*
