# Smoke Test Report — Dashboard (FR-01) — Round 2

> **Gate check** trước functional test. PASS = module đủ khỏe để chạy Lệnh 2. FAIL/BLOCKED = dừng, báo dev.
>
> **Phương pháp:** 4 bước theo [6.1-smoke-dashboard.md](../../../../smoke-specs/6.1-smoke-dashboard.md) (Pre-check + Bước 1 Login + Bước 2 Vào module + Bước 3 Lỗi ngầm + Bước 4 Ghi kết quả).

---

## 0. Metadata

| Thông tin | Giá trị |
|-----------|---------|
| **Round** | Round 2 (deploy 2026-04-16) |
| **Ngày test** | 2026-04-20 |
| **Tester** | Claude Code + /browse (Playwright headless) |
| **Environment** | http://103.172.236.130:3000/ |
| **Primary Account** | `canbo_tw` / `Test@1234` (Cán bộ TW — Cục BTTP, OTP bypass `666666`) |
| **Test Method** | `/browse` atomic chain JSON |
| **Browse Status** | ⚠️ 2 REAL CRASH trong session (Rule 7 STOP lần 2) nhưng đã lấy đủ evidence từ chain trước crash |
| **Time Budget** | ~25 phút (bao gồm 2 lần cleanup + retry) |
| **Tài liệu tham chiếu** | [spec 6.1](../../../../smoke-specs/6.1-smoke-dashboard.md), [SRS FR-01](../../../../../input/srs-v3/srs-fr-01-dashboard.md), [CLAUDE.md Rule 5-9](../../../../../CLAUDE.md) |

---

## 1. Executive Summary

| Bước | Check | Kết quả | Ghi chú |
|------|-------|---------|---------|
| **Pre-check** | Server 200 + account chưa khóa | ✅ PASS | `curl /` → 200; `POST /api/v1/auth/login` trả `otpToken` |
| **Bước 1** | Login canbo_tw + OTP `666666` + landing | ✅ PASS | Landing = `/403`, sidebar render đầy đủ 12 menu |
| **Bước 2a** | Sidebar có menu Dashboard (`Tổng quan`) | ✅ PASS | Label "Tổng quan" visible ở vị trí đầu sidebar |
| **Bước 2b** | Click menu → URL đổi + 7 KPI + 2 chart + filter | ❌ **FAIL** | Click "Tổng quan" → URL vẫn `/403`, không navigate; body vẫn render 403 page (không có canvas/chart, `canvasCount=0`) |
| **Bước 3** | Console + network + toast lỗi | ✅ PASS | `console --errors` sạch; 0 request 4xx/5xx; không có toast đỏ |

### Verdict tổng: **❌ FAIL**

**Nguyên nhân:** Với account smoke `canbo_tw` (Cán bộ Nghiệp vụ TW — per SRS FR-I actor), click menu `Tổng quan` trong sidebar **không navigate** tới trang Dashboard. URL giữ nguyên `/403` và nội dung không thay đổi. Không thể verify các element bắt buộc ở Bước 2b (7 KPI + 2 biểu đồ + filter bar).

Per **SRS FR-01 §1 Tổng quan nhóm**: "Tác nhân: Cán bộ Nghiệp vụ (TW/BN/ĐP), Cán bộ Phê duyệt (TW/BN/ĐP)". → CB_NV_TW bắt buộc phải truy cập được Dashboard.

**Unlock Lệnh 2:** ❌ NO — module Dashboard không vận hành được cho role primary, chờ FE/BE fix.

---

## 2. Bước chi tiết

### Pre-check — ✅ PASS

| Check | Command | Kết quả |
|-------|---------|---------|
| Server up | `curl -o /dev/null -w "%{http_code}" http://103.172.236.130:3000/` | `200` |
| Account chưa khóa | `POST /api/v1/auth/login {username:"canbo_tw",password:"Test@1234"}` | `{"success":true,"data":{"otpToken":"57e2bed6-...","maskedEmail":"can***@htpldn.gov.vn"}}` → OTP gửi OK |

---

### Bước 1 — Login — ✅ PASS

**Atomic chain đã chạy:**
```json
[
  ["goto","http://103.172.236.130:3000/login"],
  ["wait","input[placeholder=\"Nhập tên đăng nhập\"]"],
  ["fill","input[placeholder=\"Nhập tên đăng nhập\"]","canbo_tw"],
  ["fill","input[placeholder=\"Nhập mật khẩu\"]","Test@1234"],
  ["click","button[type=\"submit\"]"],
  ["js","new Promise(r=>setTimeout(r,3500))"],
  ["type","666666"],
  ["js","new Promise(r=>setTimeout(r,10000))"],
  ["url"],
  ["screenshot","screenshots/dashboard-login-landing.png"]
]
```

**Kết quả:**
- Login → OTP bypass `666666` → landing URL = `http://103.172.236.130:3000/403`
- Sidebar render đầy đủ với 12 menu label: `Tổng quan`, `Quản lý hỏi đáp pháp lý`, `Quản lý đào tạo, tập huấn`, `Quản lý chuyên gia / tư vấn viên`, `Quản lý vụ việc hỗ trợ pháp lý`, `Quản lý chi trả chi phí`, `Quản lý doanh nghiệp được hỗ trợ`, `Đánh giá hiệu quả hỗ trợ pháp lý`, `Quản lý thư viện biểu mẫu`, `Quản lý tư vấn` (có submenu ▶), `Quản lý chương trình hỗ trợ pháp lý doanh nghiệp`, `Báo cáo thống kê`, `Quản trị hệ thống` (có submenu ▶)
- User badge: `Cán bộ TW — CB_TW` (Cục Bổ trợ Tư pháp — Bộ Tư pháp)

Screenshot: [dashboard-login-landing.png](screenshots/dashboard-login-landing.png)

Per [CLAUDE.md Rule 5](../../../../../CLAUDE.md): "Role CB_TW landing `/403` sau login = PASS (role không có dashboard default), sidebar vẫn đầy đủ" → Bước 1 PASS.

---

### Bước 2a — Verify menu Dashboard trong sidebar — ✅ PASS

**Kết quả:** Label `Tổng quan` xuất hiện ở vị trí đầu sidebar (index 0 của menu tree, ngay dưới tiêu đề "Hỗ trợ pháp lý doanh nghiệp / Bộ Tư pháp").

Verify bằng JS query: `document.body.innerText.substring(0,800)` trả về block text có `Tổng quan` ngay sau `Bộ Tư pháp`.

---

### Bước 2b — Dashboard render đủ element — ❌ FAIL

**Atomic chain đã chạy (sau Bước 1):**
```json
[
  ["click","aside >> text=Tổng quan"],
  ["js","new Promise(r=>setTimeout(r,8000))"],
  ["url"],
  ["screenshot","screenshots/dashboard-page.png"],
  ["js","JSON.stringify({url:location.href, canvasCount: document.querySelectorAll('canvas').length, svgCount: document.querySelectorAll('svg').length, bodyText: document.body.innerText.substring(0,3500)})"]
]
```

**Kết quả thực tế:**
- Browse log: `[click] Clicked aside >> text=Tổng quan → now at http://103.172.236.130:3000/403`
- URL sau click: `http://103.172.236.130:3000/403` (**không thay đổi** so với landing)
- `canvasCount`: **0** (spec yêu cầu ≥ 2 canvas/svg cho UC8 + UC9)
- `svgCount`: 17 (toàn SVG của 403 illustration)
- Body text vẫn là 403 page: `...403 / Bạn không có quyền truy cập trang này. / Trở về trang chủ`
- Không có bất kỳ phần tử nào trong spec Bước 2b: **không có** breadcrumb "Trang chủ > Tổng quan", **không có** nút `Làm mới`, **không có** filter bar (Năm/Từ ngày/Đến ngày/Đơn vị), **không có** 7 thẻ KPI, **không có** 2 biểu đồ UC8+UC9.

Screenshot: [dashboard-page.png](screenshots/dashboard-page.png) (hình giống hệt `dashboard-login-landing.png` vì URL không đổi).

**Phân loại (Rule 9):** APP/FE BUG — `text=Tổng quan` locator match được phần tử (click event accepted), nhưng phần tử không có href/onclick navigate hợp lệ, hoặc route `/dashboard` (hoặc equivalent) bị `PermissionRoute` redirect về `/403`.

---

### Bước 3 — Lỗi ngầm — ✅ PASS

- `$B console --errors` (khi landing /403): `(no console errors)`
- `$B network`: Toàn bộ là GET `200` cho Vite dev bundles + assets. Không có endpoint `/api/v1/dashboard/*` hay `/api/v1/kpi/*` nào được gọi (vì chưa vào được Dashboard).
- Không có toast đỏ / message "Lỗi tải dữ liệu" / "Validation failed" / "Có lỗi xảy ra".

→ Không có lỗi ngầm FE/BE khi stuck ở trang 403.

---

## 3. Browse stability log (Rule 7-9)

| # | Chain | Observation | Phân loại (Rule 9) | Action |
|---|-------|-------------|--------------------|--------|
| 1 | `/tmp/dashboard-v3.json` | `Target page, context or browser has been closed` giữa `["type"]` và `["js"]` 10s wait | REAL CRASH (mid-chain) | Rule 6 full cleanup + Rule 7 retry lần 1 — thành công, lấy được HTML body |
| 2 | `/tmp/dashboard-inspect-full.json` | `Target page closed` sau `["click submit"]`, trước `["type"]` | REAL CRASH (mid-chain) | Rule 7 STOP lần 2 — KHÔNG retry tiếp |

**Lý do vẫn ra verdict FAIL** (không phải BLOCKED do crash): Chain atomic `/tmp/dashboard-atomic.json` trước crash #2 đã chạy full và cho evidence rõ ràng (click Tổng quan no-op, URL giữ /403, canvasCount=0). Bug app-level đã verified ngoài tầm ảnh hưởng của crash browser.

---

## 4. Bug đi kèm

Xem [bug-report-smoke-test.md](bug-report-smoke-test.md).

| Bug ID | Severity | Title |
|--------|----------|-------|
| BUG-SMOKE-DASH-001 | Critical | Dashboard 100% không truy cập được cho `canbo_tw` (CB_NV_TW) — click menu `Tổng quan` no-op, URL giữ `/403`, vi phạm SRS FR-I actor |

---

## 5. Recommendations

### Cho dev

1. **FE + BE (Critical):** Kiểm tra `PermissionRoute` / ability-rule cho route Dashboard. SRS FR-01 actor là "Cán bộ Nghiệp vụ (TW/BN/ĐP), Cán bộ Phê duyệt (TW/BN/ĐP)" nhưng CB_NV_TW bị deny. 2 hypothesis:
   - (a) BE permission seed thiếu `dashboard:read` cho role `CB_NV`
   - (b) FE `PermissionRoute` check sai ability key
2. **FE (Minor):** Nếu role thực sự không được phép → menu "Tổng quan" nên hidden hoặc disabled UI (cursor not-allowed, grayed), không phải clickable no-op gây nhầm lẫn user (pattern lặp với BUG-PERM-M8.3-002 / BUG-SMOKE-TVN-001).

### Cho QA (Round tiếp)

- **Retest với `qtht_tw` (admin) + `lanhdao_tw`:** nếu 2 role này PASS → khẳng định bug chỉ đánh role CB_NV (hẹp hơn), nếu 2 role này cũng FAIL → bug BE permission seed / route deploy.
- **Sửa spec 6.1:** bổ sung alternate account khi primary FAIL (vd `qtht_tw`) để smoke Dashboard không bị block.
- **CLAUDE.md note CB_TW landing /403 = PASS** cần review lại — có mâu thuẫn với SRS FR-01 actor list.

### Unlock Lệnh 2

❌ **NO** — module Dashboard không truy cập được, chờ dev fix BUG-SMOKE-DASH-001 trước khi functional.

---

## 6. Appendix

### A. Browse commands effective (post-crash retry)

```bash
B=~/.claude/skills/gstack/browse/dist/browse
# Full cleanup Rule 6
$B stop; pkill -f browse-server; pkill -f ms-playwright-go; pkill -f "chromium.*remote-debugging"; sleep 2
# Atomic chain: login + navigate + verify
cat /tmp/dashboard-atomic.json | $B chain
```

### B. Tài khoản dùng

| Username | Role | Đơn vị | Cấp | Dùng cho |
|----------|------|--------|-----|---------|
| canbo_tw | CB_NV (Cán bộ TW) | Cục BTTP | TW | Primary smoke (per spec 6.1 Metadata) |

### C. Screenshots

| File | Mô tả |
|------|-------|
| [dashboard-login-landing.png](screenshots/dashboard-login-landing.png) | Landing sau login = `/403`, sidebar visible với menu `Tổng quan` |
| [dashboard-page.png](screenshots/dashboard-page.png) | Sau click `Tổng quan` — URL giữ `/403`, không có dashboard render |

### D. Environment

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass DEV, xem [CLAUDE.md Rule 3](../../../../../CLAUDE.md)) |
| MailHog | http://103.172.236.130:8025 |
| Frontend stack | React + Vite + Ant Design + CASL (PermissionRoute) |

---

*Report v1.0 | 2026-04-20 | PM HTPLDN QA — Smoke Dashboard (FR-01) Round 2*
