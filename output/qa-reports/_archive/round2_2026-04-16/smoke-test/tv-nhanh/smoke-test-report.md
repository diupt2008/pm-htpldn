# Smoke Test Report — FR-13 Tư vấn Nhanh (Round 2)

> **Spec:** [6.13-smoke-tuvan-nhanh.md](../../../../smoke-specs/6.13-smoke-tuvan-nhanh.md)
> **Test strategy:** [test-strategy.md §1.2 + §9](../../../../test-strategy.md)
> **Template:** [smoke-test-report-template.md](../../../../template/smoke-test-report-template.md)

---

## 0. Metadata

| Thông tin | Giá trị |
|-----------|---------|
| **Round** | Round 2 (deploy 2026-04-16) |
| **Module** | FR-13 Tư vấn Nhanh (TVNHANH) |
| **Ngày test** | 2026-04-19 23:10–23:20 |
| **Tester** | Claude Code + `/browse` |
| **Environment** | http://103.172.236.130:3000/ |
| **Primary Account** | `canbo_tw` / `Test@1234` (CB_NV_TW, OTP bypass `666666`) |
| **Test Method** | Playwright headless + API probe (curl) |
| **Browse Status** | OK (crash 1 lần do xung đột session khác đồng thời — đã cleanup + retry 1 lần; screenshot 01/02 captured, 03 không chụp được do navigate bị chặn) |
| **Time Budget** | ~10 phút |
| **Tài liệu tham chiếu** | [test-strategy.md](../../../../test-strategy.md), [srs-fr-13-tv-nhanh.md](../../../../../input/srs-v3/srs-fr-13-tv-nhanh.md) |

---

## 1. Executive Summary

| Bước | Kết quả | Note |
|------|---------|------|
| **Bước 1 — Login** | ✅ PASS | Dashboard = `/403` (CB_TW landing chuẩn), sidebar đầy đủ |
| **Bước 2a — Menu + submenu sidebar** | ❌ **FAIL** | Menu cha `Quản lý tư vấn ▶` hiện OK, expand OK — nhưng submenu **`Tư vấn nhanh` bị DISABLED** (grayed out). Pattern lặp với BUG-PERM-M8.3-002 (TV Chuyên sâu). |
| **Bước 2b — Navigate module** | ❌ **FAIL** | Click submenu → URL giữ `/403`, trang hiển thị "403 Bạn không có quyền truy cập". Không vào được module — không verify được 2 tab / filter / header cột. |
| **Bước 3 — Lỗi ngầm** | ❌ **FAIL** | 3 BE endpoint chính (`/api/v1/kho-cau-hoi`, `/api/v1/tu-van-nhanh`, `/api/v1/phien-tu-van-nhanh`) đều trả HTTP 404 (route chưa scaffold). |

### Verdict tổng: **❌ FAIL**

**Unlock Lệnh 2 (Data Readiness):** ❌ **NO** — module không vận hành được. Cần FE enable menu + BE deploy 3 endpoint trước khi test tiếp.

**1 câu kết luận:** Module Tư vấn Nhanh chưa ship end-to-end — FE disable submenu sidebar cho `CB_NV_TW` (dù JWT đã emit đầy đủ 14 permissions TVNHANH), BE chưa có route cho `kho-cau-hoi` / `tu-van-nhanh` / `phien-tu-van-nhanh`. Không thể chạy functional/permission cho FR-13 ở round này.

---

## 2. BAGM Checks — Không áp dụng đầy đủ

Smoke 4-bước spec 6.13 dừng ở Bước 2b do module không load. C3/C4 BAGM truyền thống không áp dụng vì `List load` đã fail (C2 blocker).

| Check | Status | Observation |
|-------|--------|-------------|
| C1. Access (menu + submenu) | ⚠️ **PARTIAL FAIL** | Menu cha có + expand OK. Submenu `Tư vấn nhanh` DISABLED. Pass rate 50% |
| C2. List load | ❌ **FAIL** | Click submenu → `/403`, module không vào được |
| C3. Read detail | ⏭️ **SKIP** | Blocker ở C2 |
| C4. Create stub | ⏭️ **SKIP** | Blocker ở C2 |

---

## 3. Chi tiết từng bước

### 3.1 Bước 1 — LOGIN (✅ PASS)

**Observation:**
- `curl` pre-flight: server `http://103.172.236.130:3000/` → HTTP 200
- `POST /api/v1/auth/login` với `canbo_tw` / `Test@1234` → trả `otpToken`, không lock
- Atomic chain login: fill username/password → click submit → OTP `666666` qua bypass → sau 8s, URL = `/403`
- Sidebar render đầy đủ 14 menu items, avatar `CT Cán bộ TW CB_TW` đúng role

**Note:** Landing `/403` là PASS theo [CLAUDE.md Rule 5](../../../../../CLAUDE.md#rule-5) — CB_TW không có dashboard default, sidebar vẫn đủ → không nhầm với auth failure.

**Evidence:**
![Login dashboard CB_TW](screenshots/tvnhanh-01-login-dashboard.png)

---

### 3.2 Bước 2a — Verify menu + submenu sidebar (❌ FAIL)

**Observation:**
- Menu cha `Quản lý tư vấn ▶` hiện ở sidebar (icon search)
- Click → menu expand, hiện 3 submenu:
  | Submenu | Enabled? | Note |
  |---------|----------|------|
  | `Tư vấn chuyên sâu` | ❌ DISABLED (grayed) | Duplicate BUG-PERM-M8.3-002 |
  | **`Tư vấn nhanh`** | ❌ **DISABLED (grayed)** | **Bug mới FR-13** |
  | `Hợp đồng tư vấn` | ✅ ENABLED (blue bullet, hover-able) | OK cho FR-14 |

- Nói cách khác: trong cùng menu cha, 1 submenu enabled + 2 submenu disabled → bug xảy ra ở **ability rule riêng cho TVCS + TVNHANH**, không phải FE disable toàn menu cha.

**Permission crosscheck:**
- JWT của `canbo_tw` (CB_TW) đã emit đủ 14 permissions TVNHANH:
  - `read_kho_cau_hoi`, `create_kho_cau_hoi`, `update_kho_cau_hoi`, `delete_kho_cau_hoi`, `approve_kho_cau_hoi`
  - `read_phien_tu_van`, `create_phien_tu_van`, `update_phien_tu_van`, `delete_phien_tu_van`
  - (và các perm tương tự cho `khoa_hoc`)
- → Kết luận: contract permission đúng. Bug ở FE ability gate / menu config (hardcoded disable).

**Evidence:**
![Menu expanded — Tư vấn nhanh grayed out](screenshots/tvnhanh-02-menu-expanded.png)

---

### 3.3 Bước 2b — Navigate module (❌ FAIL)

**Observation:**
- Chain `click text=Tư vấn nhanh` log: `Clicked text=Tư vấn nhanh → now at http://103.172.236.130:3000/403`
- URL giữ `/403` — click không navigate được (click handler disabled hoặc route guard chặn)
- Trang hiện icon "khóa" + text "403 Bạn không có quyền truy cập trang này" + nút `Trở về trang chủ`
- Screenshot `03-kho-page.png` KHÔNG chụp được do browser crash ngay sau click (JS context closed). Ảnh `02` đã đủ chứng minh trạng thái `/403`.

**Không verify được:**
- URL route expect (`/tu-van-nhanh` / `/tvn` / `/kho-cau-hoi`) — không vào trang
- 2 tab chính (`Kho câu hỏi` + `Phiên tư vấn`)
- 3 sub-tab `Tất cả / Đã duyệt / Chờ duyệt`
- Nút `+ Thêm câu hỏi`, `Nhập Excel`, `Làm mới`
- Filter bar: Lĩnh vực / Nguồn / Trạng thái
- Table header: Mã / Câu hỏi / Câu trả lời / ...

---

### 3.4 Bước 3 — Kiểm tra lỗi ngầm (❌ FAIL — BE endpoints 404)

**BE endpoint probe (API độc lập, token hợp lệ):**

| Endpoint | HTTP | Note |
|----------|------|------|
| `GET /api/v1/auth/me` | **200** | Sanity — role CB_TW, donViId, capDonVi DP đúng |
| `GET /api/v1/kho-cau-hoi?page=1&pageSize=5` | **404** | `Cannot GET /api/v1/kho-cau-hoi` — route chưa scaffold |
| `GET /api/v1/tu-van-nhanh?page=1&pageSize=5` | **404** | Route chưa scaffold |
| `GET /api/v1/phien-tu-van-nhanh?page=1&pageSize=5` | **404** | Route chưa scaffold |
| `GET /api/v1/tu-van-chuyen-sau?page=1&pageSize=5` | **404** | (Crosscheck FR-12 — cũng chưa có route) |

**Logic so sánh:** `/auth/me` trả 200 → auth pipeline healthy. 404 ở 3 endpoint TVNHANH là **route không tồn tại**, không phải permission deny (nếu deny sẽ 403 với body error khác).

**Console errors:** Không capture được do browser crash. Dù vậy, nguồn gốc BE 404 cùng với submenu disabled đã đủ evidence.

---

## 4. Failed / Blocked — Chi tiết

### 4.1 BUG-SMOKE-TVN-001 — Critical — Submenu `Tư vấn nhanh` DISABLED cho CB_NV_TW (pattern lặp M8.3-002)

**Triệu chứng:**
- Submenu `Tư vấn nhanh` bị grayed out trên sidebar, click không navigate được. Trang giữ `/403`.

**Reproduction:**
1. Login `canbo_tw` / `Test@1234` / OTP `666666`
2. Click menu cha `Quản lý tư vấn ▶` → expand OK
3. Quan sát submenu → `Tư vấn nhanh` grayed out (disabled)
4. Click `Tư vấn nhanh` → URL giữ `/403`, page vẫn "403 không có quyền"

**Expected:** CB_NV_TW (theo SRS FR-13 §Permission) PHẢI có Create kho Q&A thủ công + trả lời phiên → menu phải enabled + click navigate tới `/tu-van-nhanh` (hoặc route tương đương).

**Permission matrix (contract):** JWT đã emit 14/14 perms TVNHANH (xem §3.2) → FE should show menu + route.

**Assignee:** FE team (ability-rule / menu config)
**Priority:** P0 Blocker
**Duplicate:** BUG-PERM-M8.3-002 (cùng pattern cho TVCS)

### 4.2 BUG-SMOKE-TVN-002 — Critical — BE TVNHANH endpoints 404 (module chưa deploy)

**Triệu chứng:**
- `/api/v1/kho-cau-hoi`, `/api/v1/tu-van-nhanh`, `/api/v1/phien-tu-van-nhanh` đều trả HTTP 404 với body `Cannot GET ...`

**Reproduction:** Xem §3.4 — curl trực tiếp với JWT hợp lệ

**Expected:** BE scaffold 3 route chính (đọc từ SRS FR-13 mục 4.2) — ít nhất `GET list` + `POST create` + `GET /:id`.

**Assignee:** BE team
**Priority:** P0 Blocker

---

## 5. Retry Log

| Attempt | Action | Kết quả | Note |
|---------|--------|---------|------|
| 1 | Atomic chain login + click menu + click submenu | CRASH mid-chain (type OTP) | Root cause: xung đột session — PID 46185 concurrent bash khác đang chạy smoke module `chuong-trinh-HTPLDN` → 2 browse-server conflict |
| — | Cleanup FULL (pkill browse-server + playwright-go + chromium) | Sạch, RAM 0 MB | Theo CLAUDE.md Rule 6 |
| 2 | Retry atomic chain | PASS login + PASS menu expand + click submenu → CRASH sau click | Screenshot 01/02 capture được. Crash do JS context closed (nghi click disabled handler throw). Đủ evidence từ screenshot 02 để kết luận — KHÔNG retry lần 3 theo Rule 7 |
| — | API probe BE endpoints (curl, không cần browse) | 3/3 TVNHANH route trả 404 | Xác nhận BE chưa deploy |

**Kết luận retry:** Theo [CLAUDE.md Rule 7](../../../../../CLAUDE.md) — crash 1 lần real (sau cleanup sạch), **STOP không retry lần 3**. Đã có đủ diagnostic (screenshot menu + API 404) để phân loại APP BUG + BE NOT DEPLOYED.

---

## 6. Blocker Escalation

| # | Issue | Severity | Assignee | Status |
|---|-------|----------|----------|--------|
| 1 | Submenu `Tư vấn nhanh` disabled cho CB_NV_TW dù JWT có perm | Critical / P0 | FE team | Reported (chờ gửi dev) |
| 2 | BE thiếu 3 route chính `/api/v1/kho-cau-hoi`, `/api/v1/tu-van-nhanh`, `/api/v1/phien-tu-van-nhanh` | Critical / P0 | BE team | Reported (chờ gửi dev) |

**Report cần gửi kèm:**
- [bug-report-smoke-test.md](bug-report-smoke-test.md) (chi tiết BUG-SMOKE-TVN-001 + 002)
- Screenshot: `screenshots/tvnhanh-02-menu-expanded.png`

---

## 7. Recommendations

### Chặn Lệnh 2 (Data Readiness FR-13)
- ❌ **KHÔNG chạy Lệnh 2** cho FR-13 ở round này. Chờ FE + BE fix.

### Cần verify lại sau fix
- [ ] Sau khi BE deploy 3 route + FE enable menu → rerun smoke 6.13 từ Bước 2a
- [ ] Crosscheck 3 role khác (CB_NV_BN, CB_NV_DP) cùng bị menu disable hay chỉ TW
- [ ] Crosscheck role QTHT_TW / CB_PD_TW — xem menu có enabled không (phân biệt bug ability-rule vs bug menu config)

### Cải thiện process
- Trước khi chạy smoke, `ps aux | grep browse-server` để bảo đảm không có session khác concurrent (tránh crash như Attempt 1)
- Với module nghi chưa deploy: **probe BE endpoint trước** (curl với JWT) để phân loại FE bug vs BE bug sớm — tiết kiệm 1 retry browse

---

## 8. Appendix

### A. Tài khoản dùng

| Username | Role | Đơn vị | Cấp | Dùng cho |
|----------|------|--------|-----|---------|
| `canbo_tw` | CB_NV (mã `CB_TW`) | Cục BTTP | TW | Smoke B1–B3, Bug TVN-001/002 |

### B. Browse patterns áp dụng

Tham chiếu [CLAUDE.md](../../../../../CLAUDE.md):
- Rule 1: `$B wait` trước mọi `fill`/`click` ✅
- Rule 3: OTP bypass `$B type "666666"` ✅
- Rule 5: Atomic chain JSON (không gộp sleep ở bash) ✅
- Rule 6: Full cleanup khi crash (pkill playwright-go + chromium) ✅ (đã dọn sau Attempt 1)
- Rule 7: Retry max 1 lần ✅ (dừng sau retry, không lần 3)
- Rule 9: Phân loại trước khi react — screenshot + API probe → APP BUG (FE + BE) ✅

### C. Screenshots

| File | Mô tả | Bước |
|------|-------|------|
| [tvnhanh-01-login-dashboard.png](screenshots/tvnhanh-01-login-dashboard.png) | Login `/403` + sidebar đủ 14 menu | B1 |
| [tvnhanh-02-menu-expanded.png](screenshots/tvnhanh-02-menu-expanded.png) | Menu `Quản lý tư vấn` expand, 3 submenu: TVCS disabled / TVN disabled / HDTV enabled | B2a |
| _tvnhanh-03-kho-page.png_ | **Không chụp được** — browser crash ngay sau click submenu disabled; ảnh `02` đã đủ chứng minh trạng thái `/403` | B2b |

### D. API response logs (BE 404)

```
GET /api/v1/kho-cau-hoi?page=1&pageSize=5
  → HTTP 404, {"success":false,"error":{"code":"ERR-SYS-00-04-01","message":"Cannot GET /api/v1/kho-cau-hoi"}}

GET /api/v1/tu-van-nhanh?page=1&pageSize=5
  → HTTP 404, {"success":false,"error":{"code":"ERR-SYS-00-04-01","message":"Cannot GET /api/v1/tu-van-nhanh"}}

GET /api/v1/phien-tu-van-nhanh?page=1&pageSize=5
  → HTTP 404, {"success":false,"error":{"code":"ERR-SYS-00-04-01","message":"Cannot GET /api/v1/phien-tu-van-nhanh"}}
```

Sanity check auth:
```
GET /api/v1/auth/me
  → HTTP 200, {"success":true,"data":{"userId":"11111111-0001-4000-8000-000000000003","vaiTro":["CB_TW"],"capDonVi":"DP",...}}
```

### E. JWT permissions TVNHANH-related (contract OK)

```
approve_kho_cau_hoi    create_kho_cau_hoi    delete_kho_cau_hoi    read_kho_cau_hoi    update_kho_cau_hoi
create_phien_tu_van    delete_phien_tu_van   read_phien_tu_van     update_phien_tu_van
approve_khoa_hoc       create_khoa_hoc       delete_khoa_hoc       read_khoa_hoc       update_khoa_hoc
```

→ Contract permission đúng, bug nằm ở FE menu gating + BE route chưa deploy.

---

## 9. Unlock quyết định

| Câu hỏi | Kết luận |
|---------|----------|
| FR-13 TVNHANH sẵn sàng cho Lệnh 2 (Data Readiness)? | ❌ **NO** |
| Có cần re-test không? | Có — sau khi FE fix menu + BE deploy 3 route |
| Pattern fix có thể gộp? | Có — BUG-SMOKE-TVN-001 nên fix cùng BUG-PERM-M8.3-002 (cùng ability-rule gate); BUG-SMOKE-TVN-002 có thể scaffold cùng đợt với TVCS routes (đều 404) |

---

*Report v1.0 | 2026-04-19 23:20 | QA Automation via Claude Code*
