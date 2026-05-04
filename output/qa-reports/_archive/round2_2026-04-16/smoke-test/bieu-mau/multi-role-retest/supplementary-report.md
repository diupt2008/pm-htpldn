# Supplementary Report — Multi-role retest Module Biểu mẫu

> **Mục đích:** Isolate root cause 2 bug Blocker phát hiện ở smoke v1 với `canbo_tw`. Re-smoke với 3 role khác để xác định bug thuộc layer nào (permission token / FE role-rule / nav-structure).

| Thông tin | Giá trị |
|-----------|---------|
| **Ngày test** | 2026-04-19 |
| **Parent report** | [../smoke-test-report.md](../smoke-test-report.md) |
| **Parent bug report** | [../bug-report-smoke-test.md](../bug-report-smoke-test.md) |
| **Spec** | [6.9-smoke-bieumau.md](../../../../../smoke-specs/6.9-smoke-bieumau.md) |
| **Permission matrix** | [permission-matrix.md](../../../../../permission-matrix.md) dòng `BIEU_MAU` |

---

## 1. Summary — Verdict theo role

| Role (CSV) | Username | Role code | Matrix BIEU_MAU | Login landing | Menu class | Click menu → URL | Page content | Verdict |
|-----------|----------|-----------|----------------|---------------|------------|------------------|--------------|---------|
| QTHT TW | `qtht_tw` | QTHT | 👁️ R | `/dashboard` | `nav-item` (enabled) | `/bieu-mau/thu-muc` ✅ | **FULL UI** (tabs, filters, 1 row "Thư mục 1") | ✅ **PASS** |
| CB TW | `canbo_tw` | CB_NV_TW | ✅ CRUD* | `/403` | `nav-item active disabled` | `/403` (no nav) | N/A (ant-spin when pushState) | ❌ FAIL |
| CB BN | `canbo_bn` | CB_NV_BN | ✅ CRUD* | `/403` | `nav-item disabled` | `/403` (no nav) | N/A | ❌ FAIL |
| CB Tỉnh | `canbo_tinh` | CB_NV_DP | ✅ CRUD* | `/403` | `nav-item disabled` | `/403` (no nav) | N/A | ❌ FAIL |

### Verdict tổng: **Bug ảnh hưởng toàn bộ 3 role `CB_NV_*` (TW/BN/DP), không phải chỉ CB_TW. QTHT không bị**.

---

## 2. Conclusion — root cause refined

### Trước retest (báo cáo smoke v1):
- Bug hypothesis: "có thể ability rule thiếu BIEU_MAU.read cho CB_NV_TW"

### Sau retest:
- Bug **affects tất cả CB_NV_* roles** (TW, BN, DP), không chỉ CB_TW → **không phải lỗi role-specific**, mà là **pattern FE gate cho toàn bộ role CB_NV_* group**
- QTHT_TW (role cao nhất) hoạt động bình thường → module backend khoẻ
- Permission matrix quy định CB_NV_TW/BN/DP = `✅ CRUD*` nhưng **FE role-rule code đang gate khác**

### Root cause refined:
Logic FE ability hoặc nav-structure đang check permission bằng condition **loại trừ** role CB_NV_* khỏi quyền truy cập menu/route `/bieu-mau`. Có thể:

1. `src/utils/auth-rules.ts` — rule definition cho module BIEU_MAU chỉ whitelist `QTHT`, bỏ sót `CB_NV_TW/BN/DP`.
2. `src/components/AppShell/nav-structure.ts` — field `requiredCap` / `requiredRole` cho menu Biểu mẫu chỉ chấp nhận `QTHT`.
3. BE `/api/v1/auth/verify-otp` response không gán cap `BIEU_MAU.read` cho role CB_NV_*.

→ Cần audit **một trong 3 layer trên**. Fix ở đúng layer để unlock CRUD cho CB_NV_*.

---

## 3. Evidence per role

### 3.1 QTHT_TW — ✅ PASS

**Login landing:**
- URL = `http://103.172.236.130:3000/dashboard`
- Topbar: `QT Hệ thống TW / QTHT_TW`

**Menu class:**
```json
{"type":"button","class":"nav-item","title":"Quản lý thư viện biểu mẫu"}
```
→ Enabled, clickable.

**Click menu → URL navigation:**
```
Clicked button[title="Quản lý thư viện biểu mẫu"] → now at http://103.172.236.130:3000/bieu-mau
→ auto-redirect /bieu-mau/thu-muc
```

**Page content (từ snapshot):**
- Breadcrumb: `Trang chủ / Biểu mẫu / Thư viện biểu mẫu`
- Header: `Thư viện Biểu mẫu`
- 5 filters: `Từ khóa`, `Lĩnh vực`, `Trạng thái`, `Từ ngày`, `Đến ngày` + `Tìm kiếm` + `Xóa bộ lọc`
- 4 tabs: `Tất cả (1)` [selected], `Đã công khai`, `Nháp`, `Đã ẩn`
- 3 buttons: `Thêm thư mục`, `Xuất Excel`, `Làm mới`
- Table columns: `Tên thư mục`, `Lĩnh vực`, `Số biểu mẫu`, `Trạng thái`, `Hành động`
- 1 row: `Thư mục 1` (Nháp, 0 biểu mẫu), actions: `Công khai`, `Sửa`, `Xóa`
- Pagination: `1-1 / 1 mục`

**Screenshots:**
- [qtht_tw/screenshots/login-landing.png](qtht_tw/screenshots/login-landing.png)
- [qtht_tw/screenshots/bieumau-page.png](qtht_tw/screenshots/bieumau-page.png)

**Note phụ (out of scope hôm nay):** Matrix ghi QTHT = `👁️ R` (chỉ read) nhưng UI hiển thị đầy đủ button `Sửa`, `Xóa`, `Thêm thư mục`, `Công khai`. Có thể matrix outdated hoặc QTHT bypass read-only check. **Ghi nhận để audit sau**, không phải blocker smoke.

### 3.2 canbo_bn — ❌ FAIL (same pattern with CB_TW)

**Login landing:** `/403`

**Menu class:**
```json
{"type":"button","class":"nav-item disabled","title":"Quản lý thư viện biểu mẫu"}
```
→ **`disabled`**.

**Click menu:** URL không đổi, vẫn `/403`.

**Screenshots:**
- [canbo_bn/screenshots/login-landing.png](canbo_bn/screenshots/login-landing.png)
- [canbo_bn/screenshots/bieumau-page.png](canbo_bn/screenshots/bieumau-page.png)

### 3.3 canbo_tinh — ❌ FAIL (same pattern)

**Login landing:** `/403`

**Menu class:**
```json
{"type":"button","class":"nav-item disabled","title":"Quản lý thư viện biểu mẫu"}
```
→ **`disabled`**.

**Click menu:** URL không đổi, vẫn `/403`.

**Screenshots:**
- [canbo_tinh/screenshots/login-landing.png](canbo_tinh/screenshots/login-landing.png)
- [canbo_tinh/screenshots/bieumau-page.png](canbo_tinh/screenshots/bieumau-page.png)

---

## 4. Updated bug severity & scope

BUG-R2-BM-01 và BUG-R2-BM-02 (trong parent bug report) cần cập nhật scope:

| Field cũ (smoke v1) | Cập nhật sau retest |
|---------------------|---------------------|
| Tài khoản: `canbo_tw (CB_NV_TW)` | **Tất cả role `CB_NV_*`**: CB_NV_TW, CB_NV_BN, CB_NV_DP |
| Severity: Blocker cho CB_TW | Vẫn Blocker — nhưng scope **lớn hơn**, chặn 3 role CB_NV_* khỏi module Biểu mẫu |
| Assignee: FE Team + Permission Team | FE Team + Permission Team — ưu tiên audit `auth-rules.ts` hoặc `nav-structure.ts` cho nhóm CB_NV_* |

**Priority giữ nguyên P0**. Nếu đúng ngữ cảnh dự án "round 2 test phân quyền" thì đây là blocker cho release.

**Suggested test case regression:** Sau fix, re-run smoke với:
- [ ] canbo_tw / CB_NV_TW (TW)
- [ ] canbo_bn / CB_NV_BN (BN)
- [ ] canbo_tinh / CB_NV_DP (DP)
- [ ] qtht_tw / QTHT (sanity — phải vẫn work)
- [ ] lanhdao_tw, qtht_bn, lanhdao_bn, lanhdao_dp / CB_PD_* (matrix: `👁️ R*` read only) — verify menu enabled nhưng không có nút Thêm/Sửa/Xóa
- [ ] dn_user, nht_user / DN, NHT (matrix: `👁️ R`) — verify menu enabled read-only
- [ ] tvv_user, chuyengia_user / TVV, CG (matrix: `❌`) — verify menu **không** hiển thị

---

## 5. Action items

### Ngay (FE/BE):
1. **Ưu tiên P0:** Audit `src/utils/auth-rules.ts` — tìm rule xử lý ability cho `BIEU_MAU`. Check điều kiện match `CB_NV_*` roles.
2. **Ưu tiên P0:** Audit `src/components/AppShell/nav-structure.ts` — tìm entry menu `bieu-mau`, xem field `requiredCap` / `visibleFor` có bỏ sót CB_NV_* không.
3. Check BE: login với canbo_bn, dump token, decode JWT, xem payload `caps` / `roles` có chứa entry `BIEU_MAU` không.

### Khi fix xong:
- Re-run `/browse` smoke 6.9 với 3 account CB_NV_* — expect pass 4/4 step, verdict PASS.
- Update parent `smoke-test-report.md` + `bug-report-smoke-test.md` sang status Closed.

### Dài hạn:
- Audit tương tự các module khác (Đào tạo, Vụ việc...) xem có cùng pattern FE gate bỏ sót CB_NV_* không. Nếu có, fix batch.

---

## 6. Appendix — Browse chain used

**Template chain dùng cho mỗi role** (đã verified 2026-04-19):

```json
[
  ["viewport","1440x900"],
  ["goto","http://103.172.236.130:3000/login"],
  ["wait","input[placeholder=\"Nhập tên đăng nhập\"]"],
  ["fill","input[placeholder=\"Nhập tên đăng nhập\"]","<USERNAME>"],
  ["fill","input[placeholder=\"Nhập mật khẩu\"]","Test@1234"],
  ["click","button[type=\"submit\"]"],
  ["wait","input[inputmode=\"numeric\"][maxlength=\"1\"]"],
  ["type","666666"],
  ["wait","button:has-text(\"Quản lý thư viện biểu mẫu\")"],
  ["url"],
  ["screenshot","<OUT>/login-landing.png"],
  ["attrs","button[title=\"Quản lý thư viện biểu mẫu\"]"],
  ["click","button[title=\"Quản lý thư viện biểu mẫu\"]"],
  ["js","new Promise(r=>setTimeout(()=>r(location.href),3000))"],
  ["url"],
  ["screenshot","<OUT>/bieumau-page.png"],
  ["snapshot","-i","-d","10"]
]
```

**Pattern quan trọng (update CLAUDE.md):**
- `wait <selector>` sau click submit thay vì `js setTimeout` → giữ Playwright context alive qua navigation
- Dùng `attrs` selector `button[title="..."]` (title attribute là stable identifier thay vì text)
- Browser profile nuke + server restart trước mỗi role để tránh cookie/session carry-over

---

*Supplementary report v1.0 | 2026-04-19 | Multi-role retest module Biểu mẫu*
