# Smoke Test Report — FR-12 Tư vấn Chuyên sâu (Round 2)

> **Spec:** [output/smoke-specs/6.12-smoke-tv-chuyensau.md](../../../../smoke-specs/6.12-smoke-tv-chuyensau.md)
> **Test strategy:** [output/test-strategy.md](../../../../test-strategy.md)
> **Phương pháp:** 4 check BAGM qua `/browse` (Playwright headless) với atomic chain theo CLAUDE.md Rule 5.

---

## 0. Metadata

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | FR-12 — Tư vấn Chuyên sâu (TVCS) |
| **Round** | Round 2 (deploy 2026-04-16) |
| **Ngày test** | 2026-04-19 |
| **Tester** | Claude Code + `/browse` (Playwright headless) |
| **Environment** | http://103.172.236.130:3000/ |
| **Primary account** | `canbo_tw` / `Test@1234` (OTP bypass `666666`) — kỳ vọng role **CB_TW** per CLAUDE.md |
| **Browse Status** | OK (0 crash) |
| **Time budget** | 5-7 phút / module |
| **Tài liệu tham chiếu** | [CLAUDE.md Rule 5/7/9](../../../../../CLAUDE.md), [srs-fr-12-tv-chuyen-sau.md](../../../../../input/srs-v3/srs-fr-12-tv-chuyen-sau.md) |

---

## 1. Executive Summary

| Check | Status | Observation |
|-------|--------|-------------|
| **C1 (Bước 1). Login + landing** | ✅ PASS | Login `canbo_tw`+OTP `666666` OK. Landing `/403` = correct per CLAUDE.md (CB_TW không có dashboard default). |
| **C2 (Bước 2a). Menu `Quản lý tư vấn` + submenu `Tư vấn chuyên sâu`** | ✅ PASS | Menu + 3 submenu (`Tư vấn chuyên sâu`, `Tư vấn nhanh`, `Hợp đồng tư vấn`) visible trong DOM, ARIA role=button. |
| **C3 (Bước 2b). Navigate + render TVCS page** | ❌ **FAIL** | Click `Tư vấn chuyên sâu` → URL **không đổi** (vẫn `/403`). Menu không trigger navigation. Không render list/tab/filter. |
| **C4 (Bước 3). Kiểm tra lỗi ngầm** | ⚠️ WARN | Console sạch (0 error), network không 5xx — nhưng module effectively không vận hành (silent fail UI). |

### Verdict tổng: ❌ **FAIL**

Module Tư vấn Chuyên sâu **không sẵn sàng** cho functional test với account `canbo_tw` (role CB_TW). Menu submenu tồn tại trong DOM nhưng click không navigate — triệu chứng trùng hoàn toàn với **BUG-PERM-M8.3-002 Critical** đã báo dev ngày 2026-04-19 (menu disabled UI cho 8/11 role gồm CB_NV×3, CB_PD×3, TVV, CG).

Phát hiện thêm **1 bug MỚI** chưa từng báo, khi test với session cache role QTHT_TW (xem §4.2): route `/tv-chuyen-sau` render data thành công rồi **auto-redirect** về `/danh-gia/ke-hoach/danh-sach` sau ~1s.

**Unlock Lệnh 2 (Data Readiness):** ❌ **NO**. Chờ fix BUG-PERM-M8.3-002 + điều tra bug auto-redirect QTHT.

---

## 2. BAGM Check Definitions

| Check | Mục đích | Pass criteria | Blocker? |
|-------|---------|---------------|----------|
| **C1. Login + landing** | Login OK, landing đúng theo role | URL `/dashboard` hoặc `/403` (CB_TW) + avatar role đúng | ✅ Yes |
| **C2. Menu visible** | Menu `Quản lý tư vấn ▶` + submenu `Tư vấn chuyên sâu` xuất hiện ở sidebar | Element có trong ARIA tree, có role=button | ✅ Yes |
| **C3. Navigate OK** | Click submenu → URL đổi sang `/tv-chuyen-sau` → 3 tabs TVCS (`Chờ xử lý`/`Đang tư vấn`/`Hoàn thành`) render | URL đổi + 3 tabs + button `+ Thêm yêu cầu TV` visible | ✅ Yes |
| **C4. No silent errors** | Console sạch, network không 4xx/5xx, không toast đỏ | 0 error + 0 5xx | ⚠️ Warn |

> **Không test trong smoke:** detail stepper 6 bước, rich-text editor nội dung tư vấn, workflow transition, phân quyền theo role, edge case.

---

## 3. Per-Check Details

### 3.1 C1 — Login + Landing ✅ PASS

**Duration:** ~15s (bao gồm render form + OTP bypass)

| Step | Evidence |
|------|----------|
| `POST /api/v1/auth/login` | 200 (333ms, 192B) → return `otpToken` |
| `POST /api/v1/auth/verify-otp` (OTP `666666`) | 200 (29ms, 5279B) → auth successful |
| Landing URL | `/403` ← đúng per CLAUDE.md "CB_TW không có dashboard default" |
| Sidebar vẫn đầy đủ | ✅ Verified via snapshot — menu + submenu visible |
| Avatar user | `CT / Cán bộ TW / CB_TW` (@c27-31) |

**Screenshots:** `screenshots/tvcs-t1-1500ms.png` (sau login, URL `/403`, sidebar expanded)

### 3.2 C2 — Menu + Submenu Visible ✅ PASS

Snapshot interactive tree (sau khi click `Quản lý tư vấn ▶` để expand):

```
@e11 [button] "Quản lý tư vấn ▶"
@e12 [button] "Tư vấn chuyên sâu"    ← TARGET
@e13 [button] "Tư vấn nhanh"
@e14 [button] "Hợp đồng tư vấn"
```

- **Parent menu:** `Quản lý tư vấn ▶` — present
- **Target submenu:** `Tư vấn chuyên sâu` — present, có `role=button`
- **Siblings:** `Tư vấn nhanh`, `Hợp đồng tư vấn` (confirm sub-module grouping đúng per SRS)

**Screenshot:** `screenshots/tvcs-sidebar-expanded.png`

### 3.3 C3 — Navigate ❌ FAIL

**Action chain:**
```
click "Quản lý tư vấn" → expand submenu (OK)
click "Tư vấn chuyên sâu" → EXPECT: URL → /tv-chuyen-sau + 3 tabs TVCS render
                            ACTUAL: URL stays at /403, không render gì
```

**Diagnostic captured per CLAUDE.md Rule 9 Step 1:**

| Phép đo | Expected | Actual |
|---------|----------|--------|
| `$B url` sau click | `.../tv-chuyen-sau` | `.../403` ❌ |
| Snapshot tabs | `Chờ xử lý`, `Đang tư vấn`, `Hoàn thành` | — (không render, vẫn là trang 403) ❌ |
| Button `+ Thêm yêu cầu TV` | Visible | Không xuất hiện ❌ |
| Button `Trở về trang chủ` (trang 403) | N/A | Vẫn visible = trang chưa đổi ❌ |
| Filter (Chuyên gia/DN/Lĩnh vực) | Visible | Không render ❌ |
| Table header `Mã | DN | Chuyên gia...` | Visible | Không render ❌ |

**Phân loại per Rule 9 bảng:**
- `wait` không fail (vì không dùng `wait`, dùng click trực tiếp)
- Console sạch (0 error, xem §3.4)
- Network: không 4xx/5xx, nhưng **không có request nào tới `/api/v1/noi-dung-tu-van-cs`** được phát ra sau click → click không trigger navigate
- Element tồn tại nhưng không có hành vi → **APP/FE BUG** (permission-guard FE chặn click, hoặc menu item thiếu `href`/`onClick`)

**Root cause assessment:** Khớp BUG-PERM-M8.3-002 Critical (đã báo 2026-04-19 trong section-8.3 permission report). Menu disabled UI cho CB_NV/CB_PD/TVV/CG — `canbo_tw` (role CB_TW tương đương CB_NV) không thể truy cập TVCS module qua sidebar.

**Screenshot evidence:** `screenshots/tvcs-t1-1500ms.png`, `screenshots/tvcs-t2-4500ms.png`

### 3.4 C4 — Silent Errors ⚠️ WARN

| Check | Result |
|-------|--------|
| `$B console --errors` | `(no console errors)` ✅ |
| `$B network` grep 4xx/5xx | 0 request 4xx/5xx sau click `Tư vấn chuyên sâu` ✅ |
| Toast lỗi (`Lỗi` / `Không có quyền`) | Không xuất hiện ✅ |

**Vì sao WARN không PASS:** Module effectively **không vận hành**, nhưng app **không phát tín hiệu lỗi cho user** (không toast, không 403 modal, không console). User click chỉ thấy "nothing happens" — đây là UX anti-pattern (silent fail). Ít nhất FE nên:
- Disable nút submenu nếu không có quyền (xám + tooltip `Không có quyền`), hoặc
- Hiện toast `Bạn không có quyền truy cập module này` khi click

---

## 4. Failed / Blocked Analysis

### 4.1 [BUG] Menu `Tư vấn chuyên sâu` — click không navigate cho CB_TW (= KNOWN BUG-PERM-M8.3-002)

**Triệu chứng:**
- Account `canbo_tw` (role CB_TW) login OK → landing `/403`
- Menu sidebar `Quản lý tư vấn ▶` → expand → 3 submenu visible
- Click `Tư vấn chuyên sâu` → **không có hành vi** (URL giữ nguyên `/403`)
- Không toast, không console error, không 4xx/5xx network
- Menu item có `role=button` nhưng không handler / không href

**Reproduction:**
```
1. Login canbo_tw / Test@1234 / OTP 666666
2. Landing trang /403 (đúng per CLAUDE.md CB_TW không dashboard default)
3. Click menu "Quản lý tư vấn ▶" ở sidebar → submenu expand
4. Click submenu "Tư vấn chuyên sâu" → URL giữ nguyên /403, nothing happens
```

**Severity:** Critical — Module TVCS 100% không dùng được cho CB_TW (primary account của CBNV TW theo SRS FR-12 §2.1 — "CB NV TW có Create TVCS").

**Classification:** Duplicate của **BUG-PERM-M8.3-002** đã báo section-8.3 permission report ngày 2026-04-19 — "menu Tư vấn chuyên sâu disabled UI cho 8 role (CB_NV×3, CB_PD×3, TVV, CG primary user)".

**Assignee:** FE team
**Priority:** Blocker cho functional test FR-12
**Status:** Already reported → chờ FE fix

### 4.2 [BUG MỚI — chưa từng báo] Route `/tv-chuyen-sau` auto-redirect về `/danh-gia/ke-hoach/danh-sach` (quan sát khi session cache là QTHT_TW)

**Bối cảnh phát hiện:** Trong lần chạy đầu (browse server profile còn session cache từ test phân quyền QTHT_TW), click `Tư vấn chuyên sâu` → URL **đổi** sang `/tv-chuyen-sau` → page load module TVCS (network xác nhận fetch `src/pages/tv-chuyen-sau/index.tsx` + `src/pages/tv-chuyen-sau/list/index.tsx` + 4 API TVCS return 200) → nhưng sau ~1s **app tự chuyển URL sang `/danh-gia/ke-hoach/danh-sach`** (module Đánh giá). Snapshot sau redirect hiển thị các tabs của Đánh giá (`Nháp`, `Đã lập KH`, `Đang phân công`, `Đã phân công`, `Đang đánh giá`, `Đã đánh giá`, `Chờ duyệt BC`, `Đã duyệt BC`, `Hủy`) thay vì 3 tabs TVCS mong đợi (`Chờ xử lý`, `Đang tư vấn`, `Hoàn thành`).

**Triệu chứng (trích từ network log chain 1):**
```
GET /src/pages/tv-chuyen-sau/index.tsx → 200
GET /src/pages/tv-chuyen-sau/list/index.tsx → 200
GET /api/v1/tu-van-viens?trangThai=HOAT_DONG&pageSize=50 → 200, 83B
GET /api/v1/doanh-nghieps?search=&pageSize=50 → 200, 9381B
GET /api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_PL → 200, 2433B
GET /api/v1/noi-dung-tu-van-cs?page=1&pageSize=20 → 200, 83B   ← TVCS list API
─── ngay sau đó ───
GET /src/pages/danh-gia/index.tsx → 200                        ← redirect sang Đánh giá
GET /api/v1/ke-hoach-danh-gias?page=1&pageSize=20 → 200, 2339B
```

**Hypothesis root cause (để FE điều tra):**
- Có logic `Navigate` / `useEffect` trong `tv-chuyen-sau/index.tsx` hoặc guard component (PermissionRoute/AuthGuard) redirect khi permission check fail hoặc khi data empty
- Hoặc có default-redirect trong router config cho role QTHT_TW không bind `tv-chuyen-sau`
- Response API `/noi-dung-tu-van-cs` size 83B (~empty list) có thể trigger redirect logic "nếu không có data → chuyển về default module"

**Severity:** Major (cho role QTHT_TW) — nhưng trong smoke spec gốc yêu cầu test với `canbo_tw` (CB_TW), nên bug này **thứ yếu** so với §4.1. Đáng báo dev để tránh silent redirect khó debug.

**Severity re-evaluation:** Nếu dev fix BUG-PERM-M8.3-002 để CB_NV/CB_PD/TVV/CG click menu navigate được → có thể họ cũng gặp cùng bug redirect này → Major.

**Severity final:** Major
**Assignee:** FE team (router + PermissionRoute logic)
**Priority:** Cần điều tra trước Lệnh 2

---

## 5. Retry Log

| Attempt | Account session | Action | Result | Ghi chú |
|---------|-----------------|--------|--------|---------|
| Chain 1 | QTHT_TW (profile cache từ test trước) | Login + click submenu TVCS | ⚠️ Redirect | URL `/tv-chuyen-sau` → auto-redirect `/danh-gia/ke-hoach/danh-sach` — phát hiện bug MỚI §4.2 |
| Chain 2 | CB_TW (fresh login canbo_tw sau cleanup full) | Login + click submenu TVCS | ❌ FAIL | URL không đổi, menu click no-op — khớp BUG-PERM-M8.3-002 §4.1 |

**Rule áp dụng:**
- Chain 2 = retry duy nhất per Rule 7 (max 1 lần khi REAL CRASH). Nhưng đây không phải crash — đây là APP BUG phân loại theo Rule 9 (action không navigate mà không có error). Dừng retry, escalate ngay.
- Không retry thêm lần 3 (per Rule 7 không retry mù; per Rule 9 với APP BUG: STOP + escalate).

---

## 6. Blocker Escalation

| # | Issue | Severity | Assignee | Status |
|---|-------|----------|----------|--------|
| 1 | Menu `Tư vấn chuyên sâu` disabled UI cho 8 role (CB_NV/CB_PD/TVV/CG) — ĐÃ BÁO (duplicate BUG-PERM-M8.3-002) | Critical | FE | 🔧 Chờ FE fix |
| 2 | Route `/tv-chuyen-sau` auto-redirect về `/danh-gia/ke-hoach/danh-sach` cho role QTHT_TW (MỚI) | Major | FE (router/PermissionRoute) | 🆕 Cần báo dev |

**Gộp khi gửi:** Phần §4.2 append vào bug-report-section-8.3.md hoặc tạo `bug-report-smoke-test-tvcs.md` riêng (lựa chọn theo workflow dev team).

---

## 7. Recommendations

### Unlock Lệnh 2 (Data Readiness)
- ❌ **KHÔNG unlock** cho FR-12 TVCS. Chờ fix BUG-PERM-M8.3-002 trước.
- Nếu dev fix trong sprint này → re-run smoke trước khi start Lệnh 2.

### Cần verify lại sau fix
- [ ] `canbo_tw` click `Tư vấn chuyên sâu` → URL phải đổi sang `/tv-chuyen-sau` + 3 tabs render
- [ ] 3 tabs TVCS với số đếm đúng: `Chờ xử lý` (TIEP_NHAN+PHAN_CONG), `Đang tư vấn` (DANG_TU_VAN+HOAN_THANH+CHO_PHE_DUYET), `Hoàn thành` (DA_DUYET+HUY)
- [ ] Button `+ Thêm yêu cầu TV` visible (SRS FR-12 §2.1: CB NV TW có Create)
- [ ] Filter (Chuyên gia / DN / Lĩnh vực / Trạng thái / Khoảng ngày) render đúng
- [ ] Route `/tv-chuyen-sau` không bị auto-redirect về `/danh-gia/ke-hoach/danh-sach` nữa (test với nhiều role: QTHT_TW, CB_NV, CB_PD)

### Cải thiện UX cho app
- FE thêm fallback khi click menu mà role không có quyền: toast `Bạn không có quyền truy cập module này` thay vì silent no-op — tránh confusion cho user.

---

## 8. Appendix

### A. Tài khoản dùng

| Username | Password | Role expected | Role actual (chain 2) | Dùng cho |
|----------|----------|---------------|----------------------|----------|
| `canbo_tw` | `Test@1234` | CB_TW (per CLAUDE.md) | CB_TW ✅ | Primary smoke account per spec 6.12 |
| (cached) QTHT_TW | — | — | QTHT_TW (chain 1 accidental) | Phát hiện thêm bug §4.2 |

OTP bypass: `666666` (áp dụng universal per CLAUDE.md Rule 3).

### B. Browse patterns áp dụng

Per CLAUDE.md:
- **Rule 3:** OTP bypass `666666` ✅ work
- **Rule 5:** Atomic chain với JSON file ✅ (gộp login + navigate + snapshot + console + network vào 1 chain `$B chain`)
- **Rule 6:** Full cleanup giữa chain 1 → chain 2 (`pkill playwright-go + chromium + Singleton*`)
- **Rule 7:** Đã áp dụng — chain 2 = retry sau full cleanup. Không retry lần 3.
- **Rule 9:** Phân loại trước khi react:
  - Chain 1 → APP BUG (redirect logic) → escalate, không retry cùng mode
  - Chain 2 → APP BUG (menu click no-op) → escalate, không retry mù

### C. Screenshots

| File | Khi nào | Mô tả |
|------|---------|-------|
| `screenshots/tvcs-login-dashboard.png` | Chain 1, sau OTP bypass | Landing `/dashboard` (session cache QTHT_TW) với avatar QTHT_TW |
| `screenshots/tvcs-sidebar-expanded.png` | Chain 1, sau click `Quản lý tư vấn` | 3 submenu TVCS/TVN/HĐTV visible |
| `screenshots/tvcs-page.png` | Chain 1, sau click `Tư vấn chuyên sâu` + 5s | URL đã redirect về `/danh-gia/ke-hoach/danh-sach` — evidence bug §4.2 |
| `screenshots/tvcs-t1-1500ms.png` | Chain 2, 1.5s sau click submenu | URL `/403`, avatar CB_TW — evidence bug §4.1 |
| `screenshots/tvcs-t2-4500ms.png` | Chain 2, 4.5s sau click submenu | URL `/403` vẫn không đổi (snapshot source `/login` do timing, nhưng screenshot là trang rỗng trắng — confirm menu click no-op) |

### D. Console + Network logs

- **Console errors (chain 2):** `(no console errors)` — silent fail
- **Network 5xx (chain 2):** 0 (filter grep không match) — không request nào được gửi sau click submenu
- **Network 5xx (chain 1):** 0 — nhưng có sequence suspicious: TVCS APIs 200 → ngay sau đó Đánh giá APIs 200 (redirect pattern)

### E. Per-role expected behavior (theo SRS FR-12 §2.1 + permission matrix §8.3)

| Role | Menu visible? | Click → navigate? | Create TVCS? |
|------|--------------|-------------------|--------------|
| QTHT_TW | ✅ | ✅ → `/tv-chuyen-sau` | ❌ (chỉ view) |
| CB_NV_TW (`canbo_tw`) | ✅ | ✅ → `/tv-chuyen-sau` | ✅ |
| CB_PD_TW/BN/DP | ✅ | ✅ → `/tv-chuyen-sau` | ❌ (duyệt) |
| TVV / CG | ✅ | ✅ → `/tv-chuyen-sau` | ❌ (chỉ xác nhận/trả lời) |
| NHT | ❌ greyed | — | — |

**Actual per smoke:** 2/11 role PASS trước đây (QTHT list access + NHT correctly blocked). Smoke hôm nay confirm CB_TW vẫn FAIL → chưa có tiến triển từ báo 2026-04-19.

---

## 9. Summary (TL;DR)

> **FAIL.** Click `Tư vấn chuyên sâu` với `canbo_tw` không navigate — khớp BUG-PERM-M8.3-002 Critical đã báo. Không unlock Lệnh 2. Phát hiện thêm 1 bug mới chưa báo: khi có quyền vào được route (case QTHT session), page TVCS tự redirect về Đánh giá sau ~1s — Major bug FE router/PermissionRoute. Cần fix cả 2 trước khi chạy functional test FR-12.

---

*Smoke test report v1.0 | 2026-04-19 | FR-12 TV Chuyên sâu | Round 2*
