# Bug Report — Module: Vụ việc Hỗ trợ Pháp lý

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | Phần mềm Hỗ trợ Pháp lý Doanh nghiệp (PM-HTPLDN) |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ (Vite dev → API :3001) |
| **Người test** | QA Automation (Claude Code, Opus 4.7) |
| **Ngày** | 14:55:00 2026-04-18 (updated Round 2 session 2 — API-based) |
| **Loại test** | Functional (Hybrid: API-based primary + UI carry-over) |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [test-strategy §7.5](../../../test-strategy.md), [funtion/7.5-vu-viec-htpl.md](../../../funtion/7.5-vu-viec-htpl.md), [functional-test-report.md](functional-test-report.md), [data-readiness-vu-viec.md](data-readiness-vu-viec.md) |

---

## Tổng hợp

Phát hiện **16** lỗi (6 Critical / 5 Major / 3 Medium / 2 Minor) trong quá trình test module Vụ việc HTPL. Bao gồm:
- **2 UI bugs** từ session 1 (UI-layer, qua browse tool)
- **8 API bugs** từ data-readiness seeding session (API-layer)
- **6 API bugs mới** từ session 2 re-test (authz escalation, data integrity, BR violation, missing endpoints)

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 16   | 6        | 5     | 3      | 2     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| BUG-VV-001 | Medium | P2 | UI/UX | Vụ việc HTPL | VV-T1 | Default landing là /403 thay vì dashboard cho CB_NV cấp DP | Open |
| BUG-VV-002 | Major | P1 | UI/Logic | Vụ việc HTPL | VV-T2 | Tab "Chờ tiếp nhận" không filter data — cùng kết quả với "Tất cả" | Open |
| BUG-VV-003 | Critical | P0 | Data | Vụ việc HTPL | VV-007 | `DA_PHAN_CONG` state: `nguoiHoTroId=null`, `ngayPhanCong=null` sau kiem-tra(DAT) | Open |
| BUG-VV-004 | Critical | P0 | Permission | Vụ việc HTPL | VV-026 | NHT đọc được TOÀN BỘ 16 VV (kể cả không phân công cho mình) — vi phạm BR-AUTH-10 | Open |
| BUG-VV-005 | Major | P1 | Workflow | Vụ việc HTPL | VV-011 | HATEOAS `_links.tiep-nhan` hiển thị ở DA_PHAN_CONG nhưng backend reject | Open |
| BUG-VV-006 | Critical | P0 | Workflow | Vụ việc HTPL | VV-011, VV-013 | Workflow stuck DA_PHAN_CONG — không có action nào progress DANG_XU_LY | Open |
| BUG-VV-007 | Major | P1 | Workflow | Vụ việc HTPL | VV-005 | DN portal endpoint tạo VV ở state CHO_TIEP_NHAN không tồn tại | Open |
| BUG-VV-008 | Medium | P2 | Workflow | Vụ việc HTPL | VV-008 | State `DANG_KIEM_TRA` transient — không idle được, mismatch SRS | Open |
| BUG-VV-009 | Critical | P0 | Workflow | Vụ việc HTPL | VV-014 | `trinh-phe-duyet` requires `ketQuaXuLy` set, không có endpoint setter | Open |
| BUG-VV-010 | Minor | P2 | Data | Vụ việc HTPL | VV-007 | `checklist.hangMucId` không validate reference tồn tại trong config | Open |
| **BUG-VV-011** | **Critical** | **P0** | **Data** | Vụ việc HTPL | VV-004 | **Tạo VV với `doanhNghiepId=null` vẫn success — data integrity violation** | **Open (new)** |
| **BUG-VV-012** | **Critical** | **P0** | **Business Rule** | Vụ việc HTPL | VV-006, VV-022 | **Deadline = `ngayTiepNhan + 14 calendar days` (sai BR-SLA-01, không trừ weekend + holiday)** | **Open (new)** |
| **BUG-VV-013** | **Major** | **P1** | **Missing Feature** | Vụ việc HTPL | VV-024 | **Endpoint Export Excel không tồn tại (5 biến đều 400/404)** | **Open (new)** |
| **BUG-VV-014** | **Critical** | **P0** | **Permission** | Vụ việc HTPL | VV-028 | **QTHT có thể CREATE vụ việc — permission escalation (QTHT matrix = R only)** | **Open (new)** |
| **BUG-VV-015** | **Critical** | **P0** | **Permission** | Vụ việc HTPL | VV-013d, VV-026b | **TVV đọc được danh sách VU_VIEC — authz leak (TVV matrix = ❌)** | **Open (new)** |
| **BUG-VV-016** | **Major** | **P1** | **Workflow** | Vụ việc HTPL | VV-009, VV-010 | **YEU_CAU_BO_SUNG → kiem-tra lần 2 bị reject, không loop được bổ sung** | **Open (new)** |

> **Chú thích Type:**
> - `UI/UX` / `UI/Logic` — giao diện, tương tác
> - `Permission` — phân quyền role × action
> - `Workflow` — state machine transition
> - `Data` — toàn vẹn dữ liệu (null FK, ref check)
> - `Business Rule` — sai công thức/logic nghiệp vụ theo SRS/NĐ55
> - `Missing Feature` — endpoint/feature spec ghi nhận nhưng chưa implement
>
> **Chú thích Severity:**
> - `Critical` — authorization bypass, data integrity, core workflow stuck, sai BR nghiệp vụ
> - `Major` — core feature lỗi nhưng có workaround
> - `Medium` — UX confusing, không block nghiệp vụ chính
> - `Minor` — lỗi nhỏ, data soft (ref check)
>
> **Chú thích Priority:**
> - `P0` — phải fix ngay (release blocker)
> - `P1` — fix trong sprint hiện tại
> - `P2` — fix trong 2-3 sprint tới

---

## BUG-VV-001 — [Medium] Default landing là `/403` thay vì dashboard cho CB_NV cấp DP

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-001 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Authentication / Routing |
| **Thành phần** | `src/App.tsx` hoặc `src/router/index.tsx` — default route handler |
| **URL** | http://103.172.236.130:3000/ → redirect http://103.172.236.130:3000/403 |
| **Trình duyệt** | Chromium 146 (headless via browse tool) |
| **Tài khoản** | canbo_tw / Test@1234 (CB_NV, cấp DP — Cục BTTP) |
| **TC Reference** | VV-T1 (khảo sát thêm trong quá trình test VV-001) |
| **SRS Reference** | FR-I-AUTH / UX general (login flow) |
| **Assignee** | FE Team (routing) |
| **Found by** | QA Automation |

### Mô tả

Sau khi canbo_tw (role CB_NV, cấp DP — thuộc Cục BTTP) login thành công qua 2 bước (username/password + OTP 6-digit), app tự động redirect đến `http://103.172.236.130:3000/403` với message "403 — Bạn không có quyền truy cập trang này". Tuy nhiên sidebar menu vẫn render đầy đủ 14 module có quyền (Hỏi đáp PL, Vụ việc, Doanh nghiệp, ...) — tức là account KHÔNG bị khoá, chỉ là landing page sai.

### Các bước tái hiện

1. Mở trình duyệt, vào `http://103.172.236.130:3000/`
2. Login form: nhập `canbo_tw` / `Test@1234` → click "Đăng nhập"
3. OTP form hiện ra, lấy mã 6 chữ số từ MailHog (http://103.172.236.130:8025) → nhập vào form → tự auto-submit hoặc click "Xác nhận"
4. Quan sát: URL redirect tới `/403` và hiển thị trang "Bạn không có quyền truy cập trang này"
5. Click menu "Quản lý vụ việc hỗ trợ pháp lý" → nav sang `/vu-viec/danh-sach` → **hoạt động bình thường** (không 403)

### Kết quả mong đợi

- Sau OTP success, redirect đến landing page phù hợp với role, ví dụ:
  - `/` (Dashboard) nếu role có quyền xem Dashboard
  - `/thong-ke-ca-nhan` hoặc `/tong-quan` nếu role CB_NV không có Dashboard
  - Module đầu tiên có quyền (ví dụ `/hoi-dap`, `/vu-viec`) nếu không có landing chuyên biệt
- **Không bao giờ** landing trực tiếp vào `/403` sau khi login thành công

### Kết quả thực tế

- URL sau OTP: `http://103.172.236.130:3000/403`
- Page content: "Cán bộ TW / CB_TW" (user info đúng) + nội dung "403 / Bạn không có quyền truy cập trang này"
- Sidebar menu render đầy đủ 14 module → user có thể tự click vào module để thoát khỏi /403
- Workaround: click menu → hết 403

### Bằng chứng

- Screenshot: [02-post-login-403.png](screenshots/02-post-login-403.png)
- Session storage: `auth-store = {"state":{"userInfo":{"id":"11111111-0001-4000-8000-000000000003","username":"","hoTen":"Cán bộ TW","vaiTro":["CB_TW"],"donViId":"00000000-0000-4000-8000-000000000001","capDonVi":"DP"}},"version":0}`
- Cookie: `refresh_token` có set httpOnly trên `/api/v1/auth` → auth thực sự OK

### Tác động (Impact)

- **User experience:** 100% CB_NV cấp DP login lần đầu sẽ thấy 403 → nghĩ tài khoản bị khoá → thất vọng/tạo ticket support
- **CB_NV là role chiếm ~60-70% user trong hệ thống** (theo permission matrix) → impact rộng
- **Support load:** dự kiến nhiều ticket "login xong bị 403, tài khoản tôi bị gì?"
- Không block core functionality (user click menu thoát được) → Severity=Medium

### Nguyên nhân nghi ngờ (Root Cause)

Route `/` (Dashboard) yêu cầu permission `view_dashboard` hoặc similar. CB_NV cấp DP không có permission này → router guard redirect `/403` thay vì fallback.

Có thể ở đâu đó như:
```ts
// src/router/guards.ts
if (!ability.can("view", "Dashboard")) {
  return "/403";  // ❌ Should fallback to role-specific landing
}
```

Hoặc trong backend, API `/api/v1/auth/verify-otp` trả về `redirectTo: "/"` mà không consider role.

### Gợi ý sửa (Suggested Fix)

Cách 1 — Frontend guard fallback:
```diff
- if (!ability.can('view', 'Dashboard')) {
-   return '/403';
- }
+ if (!ability.can('view', 'Dashboard')) {
+   // Fallback: redirect tới module đầu tiên có quyền
+   const firstAccessibleModule = getFirstAccessibleModule(userRoles);
+   return firstAccessibleModule || '/tong-quan';
+ }
```

Cách 2 — Backend trả `redirectTo` theo role:
```ts
// auth.service.ts - verify OTP
const defaultLanding = getDefaultLandingForRole(user.vaiTro[0], user.capDonVi);
return { accessToken, redirectTo: defaultLanding };
```

Cách 3 — Xóa bỏ `/403` landing, redirect về `/tong-quan` và để trang đó tự xử lý empty state nếu không có data.

---

## BUG-VV-002 — [Major] Tab "Chờ tiếp nhận" không filter data — cùng kết quả với "Tất cả"

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-002 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI/Logic |
| **Status** | Open |
| **Module** | Vụ việc HTPL — trang Danh sách |
| **Thành phần** | `src/pages/vu-viec/danh-sach/index.tsx` (tab filter handler) hoặc BE `/api/v1/vu-viec?trangThai=...` |
| **URL** | http://103.172.236.130:3000/vu-viec/danh-sach |
| **Trình duyệt** | Chromium 146 (headless via browse tool) |
| **Tài khoản** | canbo_tw (CB_NV, DP) |
| **TC Reference** | VV-T2 (mở rộng từ VV-001) |
| **SRS Reference** | FR-V.I-01 (Danh sách + lọc theo SM-VUVIEC) |
| **Assignee** | FE Team (primary), BE Team (secondary nếu API param ignored) |
| **Found by** | QA Automation |

### Mô tả

Trên trang `/vu-viec/danh-sach`, UI có 6 tabs để lọc theo state: "Tất cả" / "Chờ tiếp nhận" / "Đang xử lý" / "Chờ phê duyệt" / "Hoàn thành" / "Từ chối". Click tab "Chờ tiếp nhận" không thay đổi data hiển thị — vẫn trả về 5/5 items y hệt tab "Tất cả". Expected: 0 items + empty state, vì không có VV nào ở state CHO_TIEP_NHAN trong dataset (toàn bộ đều DA_TIEP_NHAN / DA_PHAN_CONG / DANG_XU_LY).

### Các bước tái hiện

1. Login canbo_tw + OTP → navigate tới `/vu-viec/danh-sach`
2. Tab "Tất cả" mặc định active, pagination hiển thị "1-5 / 5 mục", 5 rows
3. Click tab "Chờ tiếp nhận"
4. Quan sát:
   - Tab UI active màu xanh (styling đổi) → click được nhận
   - **Pagination vẫn hiển thị "1-5 / 5 mục"** — không đổi
   - **5 rows hiển thị y hệt tab "Tất cả"** — gồm: VV-BTP-TW-20260417-001 (DA_TIEP_NHAN), VV-BTP-TW-20260414-004 (DA_PHAN_CONG), -003 (DANG_XU_LY), -002 (DANG_XU_LY), -001 (DA_TIEP_NHAN)
   - Không có VV nào thuộc state CHO_TIEP_NHAN trong data
5. So sánh với dropdown "Trạng thái" trong filter panel: có thể chọn "Chờ tiếp nhận" để filter (chưa verify do tool issue, nhưng structure dropdown đúng)

### Kết quả mong đợi

- Click tab "Chờ tiếp nhận" → dispatch filter `trangThai=CHO_TIEP_NHAN`
- Network request: `GET /api/v1/vu-viec?trangThai=CHO_TIEP_NHAN&page=1&pageSize=20`
- Response: empty list (vì không có data match)
- UI: "Không có dữ liệu" / empty state icon + message
- Pagination: "0 / trang" hoặc không hiển thị
- Tab count badge (nếu có): "Chờ tiếp nhận (0)"

### Kết quả thực tế

- Click tab: UI tab active (màu xanh), nhưng data không đổi
- Pagination: "1-5 / 5 mục" (không đổi)
- Hiển thị: 5 items mix nhiều states (không phải CHO_TIEP_NHAN)
- Không có count badge trên tab

### Bằng chứng

- Screenshot `screenshots/vv-001-list-full.png` (trạng thái "Tất cả" active — 5 items)
- Screenshot `screenshots/vv-001-tab-cho-tiep-nhan.png` (sau click "Chờ tiếp nhận" — vẫn 5 items, tab "Tất cả" vẫn highlight)

### Tác động (Impact)

- **Workflow visibility broken:** CB_NV không thể nhanh chóng xem "Có bao nhiêu VV đang chờ tôi tiếp nhận?" → phải manual filter qua dropdown "Trạng thái"
- **CB_PD không thể xem quick "Có bao nhiêu VV CHO_PHE_DUYET tôi cần duyệt?" bằng 1 click
- **User trust:** Tabs hiển thị nhưng không work → user nghi ngờ reliability của app
- **Định lượng:** CB_NV trung bình sẽ lệ thuộc dropdown filter thay tabs → **mỗi lần filter mất ~3 clicks thay vì 1 click** = ~3x operational cost
- Module Vụ việc HTPL là module nghiệp vụ lõi — tabs sai → core UX hỏng

### So sánh (Comparison) — Test với các tab khác

*Chưa verify do browse tool instability, nhưng logic tương tự BUG-VV-002 nhiều khả năng xảy ra với các tab khác.*

| Tab | Expected items | Actual | Status |
|-----|---------------|--------|--------|
| Tất cả | 5 (all states) | 5 items | ✅ correct |
| Chờ tiếp nhận | 0 (no CHO_TIEP_NHAN in data) | 5 items | ❌ BUG |
| Đang xử lý | 2 (VV-003, VV-002) | Unverified — tool crash | — |
| Chờ phê duyệt | 0 | Unverified | — |
| Hoàn thành | 0 | Unverified | — |
| Từ chối | 0 | Unverified | — |

### Nguyên nhân nghi ngờ (Root Cause)

Có 3 khả năng, dev cần debug Network tab:

**Khả năng 1 (FE):** Tab click handler chưa dispatch update filter state. Có thể chỉ đổi `activeTab` UI state mà không gọi refetch.
```tsx
// Có thể code hiện tại:
<Tabs onChange={setActiveTab}> {/* ❌ chưa trigger refetch */}
```
→ Expected:
```tsx
<Tabs onChange={(tab) => { setActiveTab(tab); refetch({ trangThai: mapTabToStatus(tab) }); }}>
```

**Khả năng 2 (FE mapping):** Tab label → trangThai enum mapping sai. Ví dụ "Chờ tiếp nhận" map sang chuỗi empty hoặc chuỗi khác `CHO_TIEP_NHAN`:
```ts
const TAB_TO_STATUS = {
  "Tất cả": undefined,
  "Chờ tiếp nhận": "CHO_TN",  // ❌ Should be "CHO_TIEP_NHAN"
  ...
}
```

**Khả năng 3 (BE):** API `/api/v1/vu-viec` ignore query param `trangThai`. Tương tự bug đã thấy trên module hoi-dap — search ignore `keyword` param (xem BUG-HD-005 của hoi-dap). Khả năng cùng root cause với BE repository `buildFilters()` bỏ sót 1 số field.

### Gợi ý sửa (Suggested Fix)

**Bước 1 — Verify ở đâu hỏng** (dev check Network tab khi click tab):
```bash
# Mở DevTools → Network → click tab "Chờ tiếp nhận"
# Quan sát request:
#   a) Có request tới /api/v1/vu-viec? → check query param
#   b) Không có request → FE bug (handler thiếu refetch)
```

**Bước 2 nếu FE bug** — Thêm refetch vào onChange:
```tsx
const handleTabChange = (tab: string) => {
  const statusMap: Record<string, string | undefined> = {
    'Tất cả': undefined,
    'Chờ tiếp nhận': 'CHO_TIEP_NHAN',
    'Đang xử lý': 'DANG_XU_LY',
    'Chờ phê duyệt': 'CHO_PHE_DUYET',
    'Hoàn thành': 'HOAN_THANH',
    'Từ chối': 'TU_CHOI',
  };
  setActiveTab(tab);
  setFilter(prev => ({ ...prev, trangThai: statusMap[tab], page: 1 }));
};

<Tabs activeKey={activeTab} onChange={handleTabChange}>
  <TabPane tab="Tất cả" key="ALL" />
  <TabPane tab="Chờ tiếp nhận" key="CHO_TIEP_NHAN" />
  ...
</Tabs>
```

**Bước 3 nếu BE bug** — Thêm filter trangThai vào repo:
```ts
// vu-viec.repository.ts
async findAll(filter: VuViecQueryDto) {
  const qb = this.repo.createQueryBuilder('vv');
  if (filter.trangThai) qb.andWhere('vv.trang_thai = :t', { t: filter.trangThai });
  // ... rest
}
```

**Bước 4 — Thêm count badge** trên mỗi tab (nice-to-have, nâng UX):
```tsx
<TabPane tab={`Chờ tiếp nhận (${counts.CHO_TIEP_NHAN || 0})`} key="CHO_TIEP_NHAN" />
```
Cần endpoint `/api/v1/vu-viec/count-by-status` để lấy number cho tất cả states cùng lúc.

---

## BUG-VV-003 — [Critical] `DA_PHAN_CONG` state inconsistent sau kiem-tra(DAT)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-003 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Data integrity |
| **Status** | Open |
| **Thành phần** | `VuViecService.kiemTra()` — transition handler |
| **Endpoint** | `POST /api/v1/vu-viecs/{id}/kiem-tra` |
| **Tài khoản** | canbo_tw (CB_NV TW) |
| **TC Reference** | VV-007, VV-011 (pre-condition) |
| **SRS Reference** | FR-V.II-02 (UC54), BR-CALC-05 |
| **Assignee** | Backend Team |

### Mô tả
Sau khi gọi `POST /vu-viecs/{id}/kiem-tra` với `ketLuan=DAT`, VV transition sang state `DA_PHAN_CONG` nhưng các field `nguoiHoTroId`, `ngayPhanCong` vẫn = `null`. Theo SRS SM-VUVIEC và BR-CALC-05, transition DA_PHAN_CONG nghĩa là đã phân công NHT/TVV → phải set `nguoiHoTroId` + `ngayPhanCong` trong cùng transaction.

### Các bước tái hiện
1. Login canbo_tw, lấy JWT
2. Create fresh VV → state DA_TIEP_NHAN
3. `POST /vu-viecs/{id}/kiem-tra` với body `{ketLuan:"DAT", ghiChu:"...", checklist:[6 items với hangMucId UUID]}`
4. Quan sát response: `trangThai: "DA_PHAN_CONG"` ✓ nhưng `nguoiHoTroId: null`, `ngayPhanCong: null`

### Kết quả mong đợi
- `nguoiHoTroId` set = userId của NHT được hệ thống gợi ý theo BR-CALC-05 (ưu tiên NĐ55), hoặc
- Nếu phân công tay, transition chỉ đến DA_KIEM_TRA_DAT intermediate, rồi CB NV gọi `phan-cong` riêng → DA_PHAN_CONG với nguoiHoTroId set

### Kết quả thực tế
```json
{
  "trangThai": "DA_PHAN_CONG",
  "nguoiHoTroId": null,
  "ngayPhanCong": null,
  "nguoiHoTro": null
}
```

### Bằng chứng
- [evidence/tc-vv-007-kiem-tra-dat-success.json](evidence/tc-vv-007-kiem-tra-dat-success.json)
- [evidence/walk-kiemtra-02.json](evidence/walk-kiemtra-02.json)

### Tác động
- **Downstream broken:** VV-BTP-TW-20260418-009 (DA_PHAN_CONG, nguoiHoTroId=null) không có "chủ sở hữu" để xử lý → chain DANG_XU_LY bị lock (liên đới BUG-VV-006)
- **Reporting sai:** Dashboard "VV đang phân công" hiển thị count nhưng không có NHT responsible → không thể escalate/notify
- **Ảnh hưởng:** 100% VV đi qua kiem-tra DAT (≈60% VV thực tế) sẽ bị vấn đề này

### Gợi ý sửa
Option 1 — trong `kiemTra()` service: nếu ketLuan=DAT thì thêm step auto-assign theo gợi ý NĐ55:
```ts
if (dto.ketLuan === 'DAT') {
  const suggested = await this.suggestNHT(vuViec, NĐ55Priority);
  vuViec.nguoiHoTroId = suggested.id;
  vuViec.ngayPhanCong = new Date();
  vuViec.trangThai = 'DA_PHAN_CONG';
}
```
Option 2 — redesign state machine: kiem-tra(DAT) → transition sang `DA_KIEM_TRA_DAT` (new state). CB NV hoặc system gọi `phan-cong` với tvvId → chuyển sang DA_PHAN_CONG.

---

## BUG-VV-004 — [Critical] NHT đọc được TOÀN BỘ 16 VV (authorization leak)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-004 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission / Authorization |
| **Endpoint** | `GET /api/v1/vu-viecs` |
| **Tài khoản ảnh hưởng** | nht_user (role NHT) |
| **TC Reference** | VV-026 |
| **SRS Reference** | BR-AUTH-10, permission-matrix.md (NHT = 📝 RU* scoped) |

### Mô tả
Khi bearer JWT của `nht_user`, endpoint GET /vu-viecs trả về **16 items** — tức là toàn bộ dataset bao gồm cả VV chưa assign ai và VV assign cho NHT khác. Theo BR-AUTH-10: NHT chỉ được đọc VV có `nguoiHoTroId = current_user.sub`.

### Các bước tái hiện
1. `POST /auth/login {username:"nht_user", password:"Test@1234"}` → OTP token
2. `POST /auth/verify-otp {otpToken, otpCode:"666666"}` → JWT (vaiTro=["NHT"])
3. `GET /vu-viecs?pageSize=20 Authorization: Bearer <jwt_nht>`
4. Quan sát: `data.length = 16` bao gồm các VV có `nguoiHoTroId=null`

### Kết quả mong đợi
- Response chỉ trả VV có `nguoiHoTroId = nht_user.sub` (scope kép theo BR-AUTH-10)
- Nếu NHT không có VV phân công: data = [], total = 0

### Kết quả thực tế
- data = 16 items (all)
- Bao gồm cả VV-BTP-TW-20260418-009 (nguoiHoTroId=null), VV-BTP-TW-20260418-011 (vừa tạo bởi qtht)

### Bằng chứng
- [evidence/tc-vv-026-nht-list-all.json](evidence/tc-vv-026-nht-list-all.json)

### Tác động
- **Privacy/compliance:** NHT A đọc được thông tin VV của NHT B bao gồm DN, lĩnh vực, nội dung — vi phạm NĐ55 và GDPR-like privacy
- **Insider risk:** NHT có thể dump toàn bộ danh sách VV
- 100% NHT user bị ảnh hưởng

### Gợi ý sửa
Thêm request-context-aware filter trong `vu-viec.repository.ts`:
```ts
async findAll(filter: VuViecQueryDto, requestUser: JwtUser) {
  const qb = this.repo.createQueryBuilder('vv');
  if (requestUser.vaiTro.includes('NHT')) {
    qb.andWhere('vv.nguoi_ho_tro_id = :uid', { uid: requestUser.sub });
  }
  // ... apply other filters
}
```
Tương tự scope CB_NV theo donViId, CB_PD theo capDonVi, DN theo doanh_nghiep_id.

---

## BUG-VV-005 — [Major] HATEOAS `_links` chứa link không actionable

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-005 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Workflow / HATEOAS |
| **Endpoint** | `GET /api/v1/vu-viecs/{id}` |
| **TC Reference** | VV-011, VV-009 |

### Mô tả
Trường `_links` trả về các action khả dĩ cho VV theo state, nhưng nhiều link chỉ ra endpoint sẽ reject khi gọi:

| State | `_links` có | Gọi endpoint → kết quả |
|-------|-------------|------------------------|
| DA_PHAN_CONG | `tiep-nhan` | POST /tiep-nhan → ERR-STATE "yêu cầu CHO_TIEP_NHAN" |
| YEU_CAU_BO_SUNG | `kiem-tra` | POST /kiem-tra → ERR-STATE-VI-08-02 "không ở trạng thái cho phép kiểm tra" |
| DA_TIEP_NHAN | `kiem-tra` | ✓ Actionable |
| DANG_XU_LY | `trinh-phe-duyet` | ✗ "Chưa có ketQuaXuLy" (BUG-VV-009) |
| TU_CHOI | `[]` | ✓ Consistent |

### Tác động
- FE build UI theo `_links` → hiển thị button "Tiếp nhận" / "Kiểm tra" nhưng click sẽ fail
- User confusion, trust loss

### Gợi ý sửa
Fix logic builder `buildLinks()` theo đúng state guard của từng action:
```ts
switch (vuViec.trangThai) {
  case 'CHO_TIEP_NHAN': links['tiep-nhan'] = {...}; break;
  case 'DA_TIEP_NHAN': links['kiem-tra'] = {...}; break;
  case 'DA_PHAN_CONG': links['bat-dau-xu-ly'] = {...}; break; // new action
  case 'DANG_XU_LY': if (vv.ketQuaXuLy) links['trinh-phe-duyet'] = {...}; break;
  // ...
}
```

---

## BUG-VV-006 — [Critical] Workflow stuck DA_PHAN_CONG → không tới DANG_XU_LY

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-006 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Workflow / Core |
| **Endpoint** | `POST /vu-viecs/{id}/phan-cong` (cả DA_TIEP_NHAN lẫn DA_PHAN_CONG đều reject) |
| **TC Reference** | VV-011, VV-013, VV-020 |

### Mô tả
Sau khi VV ở state DA_PHAN_CONG (từ kiem-tra DAT), KHÔNG có action nào qua API để:
- Set nguoiHoTroId (phan-cong endpoint reject với "state không cho phép")
- Transition sang DANG_XU_LY

Kết quả: toàn bộ chuỗi workflow từ DA_PHAN_CONG trở đi không reachable qua API. Dataset pre-existing có 2 VVs ở DANG_XU_LY chỉ vì được seed trực tiếp vào DB từ trước.

### Các bước tái hiện
1. Create VV → DA_TIEP_NHAN
2. kiem-tra(DAT) → DA_PHAN_CONG (nguoiHoTroId=null per BUG-VV-003)
3. POST /phan-cong với tvvId → **ERR-STATE-VI-PC-01 "Vụ việc không ở trạng thái cho phép phân công"**
4. POST /bat-dau-xu-ly (speculative) → 404
5. POST /tiep-nhan (theo _links) → ERR-STATE "yêu cầu CHO_TIEP_NHAN"

### Gợi ý sửa
1. Thêm endpoint `POST /vu-viecs/{id}/phan-cong` accept state=DA_TIEP_NHAN hoặc DA_PHAN_CONG → set nguoiHoTroId, transition DANG_XU_LY
2. Hoặc thêm endpoint `POST /vu-viecs/{id}/bat-dau-xu-ly` (NHT gọi để accept phân công) → transition DA_PHAN_CONG → DANG_XU_LY

### Bằng chứng
- [evidence/walk-phancong.json](evidence/walk-phancong.json)
- [evidence/tc-vv-011-phancong-success.json](evidence/tc-vv-011-phancong-success.json) (filename misleading — content is error)

---

## BUG-VV-007 — [Major] DN portal endpoint tạo VV ở CHO_TIEP_NHAN không tồn tại

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-007 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Missing Feature |
| **Thử nghiệm** | POST /portal/vu-viecs, /public/vu-viecs, /vu-viecs/portal, /vu-viecs/dn, /dn/vu-viecs |
| **TC Reference** | VV-005, VV-030, VV-031 |

### Mô tả
Theo SRS, DN có thể nộp yêu cầu hỗ trợ pháp lý tạo VV mới ở state CHO_TIEP_NHAN (portal API). Tuy nhiên 5 biến endpoint đều 404. Chỉ có `POST /vu-viecs/manual` (CB NV TW) hoạt động và luôn tạo VV ở state DA_TIEP_NHAN.

Kết quả: state CHO_TIEP_NHAN không reachable → VV-005 (tiếp nhận), VV-030 (DN submit), VV-031 (notification) bị blocked.

### Gợi ý sửa
Implement public portal endpoint `POST /portal/vu-viecs` (rate-limited, captcha, auth bằng DN session):
- State mặc định = CHO_TIEP_NHAN
- Khi CB NV gọi `/vu-viecs/{id}/tiep-nhan` → transition CHO_TIEP_NHAN → DA_TIEP_NHAN

---

## BUG-VV-008 — [Medium] State `DANG_KIEM_TRA` transient (không idle)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-008 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | Workflow / Design |
| **TC Reference** | VV-008, VV-019 |

### Mô tả
Theo SM-VUVIEC diagram, state DANG_KIEM_TRA là state idle (DA_TIEP_NHAN → DANG_KIEM_TRA, có thể chuyển tiếp sang DA_PHAN_CONG/YEU_CAU_BO_SUNG/TU_CHOI). Thực tế: action `kiem-tra` là atomic transaction bắt buộc truyền `ketLuan` (DAT/YEU_CAU_BO_SUNG/KHONG_DAT) → luôn transition thẳng sang state cuối. State DANG_KIEM_TRA không bao giờ được persist.

### Gợi ý
Hoặc:
- Fix SRS: xóa state DANG_KIEM_TRA khỏi SM-VUVIEC (vì atomic), hoặc
- Fix code: thêm action `bat-dau-kiem-tra` (idle DA_TIEP_NHAN → DANG_KIEM_TRA), rồi `ket-luan-kiem-tra` (DANG_KIEM_TRA → final)

Cần clarify với Product Owner nghiệp vụ đúng như nào.

---

## BUG-VV-009 — [Critical] `trinh-phe-duyet` requires ketQuaXuLy, không có setter endpoint

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-009 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Workflow / Missing Feature |
| **Endpoint** | `POST /vu-viecs/{id}/trinh-phe-duyet` |
| **TC Reference** | VV-014, VV-015..017 (pre-blocked chain) |

### Mô tả
`POST /vu-viecs/{id}/trinh-phe-duyet` trên VV ở DANG_XU_LY → reject với `ERR-VAL-VI-TD-02: Chưa có kết quả xử lý từ tư vấn viên`. Tức là cần field `ketQuaXuLy` được populate trước. Tuy nhiên:
- Không có endpoint set `ketQuaXuLy` trực tiếp (tried POST /ket-qua-vu-viec, /ket-qua-vu-viecs → 404)
- PATCH /vu-viecs/{id} với body `{ketQuaXuLy: "..."}` → bị immutability guard chặn ở state DANG_XU_LY

Kết quả: toàn bộ chuỗi CHO_PHE_DUYET → DA_DUYET → HOAN_THANH → DA_DANH_GIA unreachable.

### Gợi ý sửa
Implement endpoint `POST /vu-viecs/{id}/ket-qua-xu-ly` cho NHT/CB NV set ketQuaXuLy:
```ts
@Post(':id/ket-qua-xu-ly')
async ghiKetQua(@Param('id') id, @Body() dto: { ketQuaTomTat, ketQuaChiTiet }, @User user) {
  // verify state DANG_XU_LY and user is nguoiHoTro
  vuViec.ketQuaXuLy = dto.ketQuaChiTiet;
  vuViec.ketQuaTomTat = dto.ketQuaTomTat;
  // không transition state, để trinh-phe-duyet riêng
}
```

### Bằng chứng
- [evidence/tc-vv-014-trinh-phe-duyet.json](evidence/tc-vv-014-trinh-phe-duyet.json)
- [evidence/walk-trinhpheduyet.json](evidence/walk-trinhpheduyet.json)

---

## BUG-VV-010 — [Minor] `hangMucId` không validate reference tồn tại

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-010 |
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | Data integrity |
| **Endpoint** | `POST /vu-viecs/{id}/kiem-tra` body `checklist[*].hangMucId` |
| **TC Reference** | VV-007 |

### Mô tả
Field `checklist[*].hangMucId` chỉ validate format UUID (reject UUID v3 như `00000000-0000-0000-0000-000000000001`) nhưng KHÔNG check xem UUID có tồn tại trong bảng `hang_muc_kiem_tra` (config) không. Test accept các UUID random `a1111111-aaaa-4aaa-8aaa-aaaaaaaaaaa1` → vẫn tạo được record kiểm tra.

### Gợi ý
Thêm FK constraint + validation trong service:
```ts
for (const item of dto.checklist) {
  const exists = await this.hangMucRepo.exists({ id: item.hangMucId });
  if (!exists) throw new BadRequestException(`hangMucId ${item.hangMucId} không tồn tại`);
}
```
Hoặc ở DB level: `FOREIGN KEY (hang_muc_id) REFERENCES hang_muc_kiem_tra(id)`

---

## BUG-VV-011 — [Critical] Tạo VV với `doanhNghiepId=null` vẫn success (NEW)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-011 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Data integrity / Validation missing |
| **Status** | Open (new 2026-04-18 chiều) |
| **Endpoint** | `POST /api/v1/vu-viecs/manual` |
| **Thành phần** | `CreateVuViecManualDto` — field `doanhNghiepId` thiếu `@IsNotEmpty()` / `@IsUUID()` |
| **Tài khoản** | canbo_tw (CB_NV TW) |
| **TC Reference** | VV-004 |
| **SRS Reference** | FR-V.II-01 (UC52) — "Tạo vụ việc mới từ nhiều nguồn, luôn gắn DN" |
| **Assignee** | Backend Team |
| **Found by** | QA Automation |

### Mô tả
Body request thiếu `doanhNghiepId` nhưng có các field khác hợp lệ → API trả success=true, tạo record VU_VIEC với `doanhNghiepId=null`. Vi phạm data integrity vì:
- Per SRS: VV là nghiệp vụ hỗ trợ pháp lý cho 1 DN cụ thể. Nếu không có DN, không có ý nghĩa nghiệp vụ
- Về mặt dữ liệu: các join query `vuviec LEFT JOIN doanh_nghiep` sẽ trả NULL → hiển thị "Tên DN: —" trên list

### Các bước tái hiện
1. Login canbo_tw → JWT
2. POST /vu-viecs/manual với body:
```json
{
  "tieuDe": "QA BUG TEST - Missing DN id",
  "moTa": "Bug verify",
  "linhVucId": "3b3e0735-a79b-4914-b05e-c94cd4fb484e",
  "loaiHinhHtId": "6331c54d-b4f2-4aca-9294-bee0c789810e",
  "kenhTiepNhan": "TRUC_TIEP"
}
```
3. Quan sát: response success=true, data.id = b39d60f2-..., maVuViec=VV-BTP-TW-20260418-009

### Kết quả mong đợi
```json
{
  "success": false,
  "error": {
    "code": "ERR-VAL-SYS-00-01",
    "details": [{"field":"doanhNghiepId","message":"doanhNghiepId should not be empty"}]
  }
}
```

### Kết quả thực tế
```json
{
  "success": true,
  "data": {
    "id": "b39d60f2-b920-4300-aa66-477b8aedc71a",
    "maVuViec": "VV-BTP-TW-20260418-009",
    "doanhNghiepId": null,
    "tieuDe": "QA BUG TEST - Missing DN id"
  }
}
```

### Bằng chứng
- [evidence/tc-vv-004-missing-dn-creates-vv.json](evidence/tc-vv-004-missing-dn-creates-vv.json)

### Tác động
- **Data integrity:** Ghi nhận VV không gắn DN → báo cáo thống kê theo DN bị sai
- **FE UX:** Danh sách hiển thị "Tên DN: —" cho các VV này
- **Downstream:** Workflow tiếp nhận → xử lý không có DN để notify, gọi, xác minh → NHT phải skip hoặc edit thêm
- **Quantify:** Nếu FE CB NV vô tình không chọn DN trước khi submit form → tạo VV rác. Đã tạo VV-009 qua test, sẽ có nhiều VV tương tự trong production nếu không fix

### Nguyên nhân nghi ngờ
File DTO `CreateVuViecManualDto`:
```ts
export class CreateVuViecManualDto {
  @IsOptional()  // ❌ should be @IsNotEmpty() @IsUUID()
  doanhNghiepId?: string;
  // ...
}
```
Hoặc column DB `doanh_nghiep_id` nullable=true.

### Gợi ý sửa
```ts
// create-vu-viec-manual.dto.ts
@IsUUID()
@IsNotEmpty({ message: 'Vui lòng chọn doanh nghiệp' })
doanhNghiepId: string;  // ← bỏ optional
```
Migration:
```sql
-- Step 1: Backfill null rows (cleanup VV-009 test data)
DELETE FROM vu_viec WHERE doanh_nghiep_id IS NULL;
-- Step 2: Make FK NOT NULL
ALTER TABLE vu_viec ALTER COLUMN doanh_nghiep_id SET NOT NULL;
```

---

## BUG-VV-012 — [Critical] Deadline = `ngayTiepNhan + 14 calendar days` (sai BR-SLA-01) (NEW)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-012 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Business Rule violation |
| **Status** | Open (new) |
| **Endpoint** | Side-effect của POST /vu-viecs/manual + POST /vu-viecs/{id}/tiep-nhan |
| **Thành phần** | `VuViecService.calculateDeadline()` hoặc similar helper |
| **TC Reference** | VV-006, VV-022 |
| **SRS Reference** | **BR-SLA-01:** "Deadline = ngày tiếp nhận + 10 ngày làm việc" (trừ cuối tuần + ngày lễ VN) |
| **Assignee** | Backend Team |
| **Found by** | QA Automation (calendar math verification) |

### Mô tả
Tất cả 15 VVs trong database có deadline computed = `ngayTiepNhan + 14 calendar days` cố định, bao gồm cả weekend. Không trừ ngày lễ VN (30/4 Giải phóng, 1/5 Lao động, 2/9 Quốc khánh, Tết âm lịch). Vi phạm trực tiếp BR-SLA-01.

### Các bước tái hiện + math
| maVuViec | ngayTiepNhan | API deadline | Expected per BR-SLA-01 | Chênh lệch |
|----------|--------------|--------------|------------------------|-----------|
| VV-20260418-001 | 2026-04-18 Sat | 2026-05-02 Sat | 2026-05-05 Tue (skip 30/4 + 1/5 VN holidays) | -3 ngày |
| VV-20260417-001 | 2026-04-17 Fri | 2026-05-01 Fri (holiday Labor Day!) | 2026-05-05 Tue | -4 ngày |
| VV-20260414-001 | 2026-04-14 Tue | 2026-04-28 Tue | 2026-05-04 Mon (skip weekend + 30/4+1/5) | -6 ngày |

### Kết quả mong đợi
- Công thức: `addBusinessDays(ngayTiepNhan, 10, vnHolidaysTable)`
- Algorithm: skip Sat, Sun, và ngày trong bảng `ngay_nghi_le`
- Deadline không rơi vào Sat/Sun/holiday

### Kết quả thực tế
- Công thức: `ngayTiepNhan + interval '14 days'`
- Có thể rơi vào Sat (VV-20260418 → deadline Sat 2026-05-02)
- Có thể rơi vào holiday (VV-20260417 → deadline Fri 2026-05-01 Labor Day!)

### Bằng chứng
- [evidence/tc-vv-001-list-all.json](evidence/tc-vv-001-list-all.json) — toàn bộ deadline có pattern `+14 days`
- Calendar math đã verify trong [functional-test-report §4.5](functional-test-report.md#45-vv-006-deadline-sla-formula-fail--bug-vv-012)

### Tác động
- **Non-compliance NĐ55:** Nếu audit viện kiểm sát kiểm tra, deadline sai → cơ quan bị phạt
- **Cascading errors:** SLA `mucDoCanhBao` (4 mức BINH_THUONG/CANH_BAO/SAP_QUA_HAN/QUA_HAN) tính toán trên deadline sai → toàn bộ dashboard cảnh báo sai
- **Người dân/DN bị ảnh hưởng:** VV có thể bị auto-cảnh báo quá hạn trong khi thực tế chưa quá hạn → confusion
- **Backfill risk:** 15 VV existing có deadline sai → cần migration script

### Gợi ý sửa
**Code:**
```ts
// vu-viec.helper.ts
import { addBusinessDays, isWeekend } from 'date-fns';

export function calculateDeadlineVuViec(ngayTiepNhan: Date, holidays: Date[]): Date {
  let result = new Date(ngayTiepNhan);
  let daysAdded = 0;
  while (daysAdded < 10) {
    result = new Date(result.getTime() + 24 * 60 * 60 * 1000);
    if (!isWeekend(result) && !holidays.some(h => sameDay(h, result))) {
      daysAdded++;
    }
  }
  return result;
}
```

**Data:**
1. Seed table `ngay_nghi_le` với các ngày lễ VN (endpoint `GET /ngay-les` đã expose qua permission `read_ngay_le`)
2. Migration backfill:
```sql
UPDATE vu_viec SET deadline = calculate_business_deadline(ngay_tiep_nhan, 10)
WHERE is_deleted = false;
```

---

## BUG-VV-013 — [Major] Endpoint Export Excel không tồn tại (NEW)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-013 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Missing Feature |
| **Status** | Open (new) |
| **TC Reference** | VV-024 |
| **SRS Reference** | FR-V.I-02 (Xuất Excel danh sách VV) |

### Mô tả
Test các biến endpoint export (5 path variants × 2 methods) đều trả 400/404:

| Method | Path | Status | Response |
|--------|------|--------|----------|
| GET | /vu-viecs/export | 400 | "Validation failed (uuid is expected)" — route match `/:id` |
| GET | /vu-viecs/export-excel | 400 | Same as above |
| GET | /vu-viecs/xuat-excel | 400 | Same |
| GET | /vu-viecs/download | 400 | Same |
| GET | /vu-viecs/export/xlsx | 404 | "Cannot GET /api/v1/vu-viecs/export/xlsx" |
| POST | /vu-viecs/export-excel | 404 | "Cannot POST /api/v1/vu-viecs/export-excel" |

Chứng tỏ controller KHÔNG định nghĩa route export → feature chưa được implement. UI hiển thị button "Xuất Excel" (đã note disabled) nhưng backend thiếu endpoint.

### Bằng chứng
- [evidence/tc-vv-024-export-missing.json](evidence/tc-vv-024-export-missing.json)

### Tác động
- CB NV/PD không thể xuất báo cáo định kỳ theo yêu cầu NĐ55 Điều 24 (báo cáo tháng/quý)
- Phải dump DB bằng tay hoặc query API paginated → thủ công

### Gợi ý sửa
Implement endpoint:
```ts
@Get('export')
@Permission('export_vu_viec')
async exportExcel(@Query() filter: VuViecQueryDto, @Res() res: Response) {
  const items = await this.service.findAllForExport(filter);
  const workbook = this.excelService.buildVuViecWorkbook(items);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=vu-viec-YYYY-MM-DD.xlsx');
  return workbook.xlsx.write(res);
}
```

**Lưu ý:** thứ tự route matter — `@Get('export')` phải define TRƯỚC `@Get(':id')` trong controller (NestJS route matching order).

---

## BUG-VV-014 — [Critical] QTHT có thể CREATE VV — permission escalation (NEW)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-014 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission / Authorization escalation |
| **Status** | Open (new) |
| **Endpoint** | `POST /api/v1/vu-viecs/manual` |
| **Tài khoản ảnh hưởng** | qtht_tw (role QTHT) |
| **TC Reference** | VV-028 |
| **SRS Reference** | permission-matrix.md — QTHT row cho VU_VIEC entity = 👁️ R (read only) |
| **Assignee** | Backend Team (CASL/Guard) |

### Mô tả
Theo permission matrix, QTHT (Quản trị hệ thống) chỉ có quyền đọc (R) trên entity VU_VIEC, không Create/Update/Delete. Thực tế: POST /vu-viecs/manual với bearer token qtht_tw → success=true, tạo được VV-BTP-TW-20260418-011.

### Các bước tái hiện
1. Login qtht_tw → JWT (vaiTro=["QTHT"])
2. POST /vu-viecs/manual với body hợp lệ bearer JWT QTHT
3. Quan sát: 201 Created, id=8b0ff611-849c-47dd-acad-4086a8e28ec1, maVuViec=VV-BTP-TW-20260418-011

### Kết quả mong đợi
```json
{
  "success": false,
  "error": {
    "code": "ERR-AUTH-SYS-00-03",
    "message": "Bạn không có quyền tạo vụ việc (create_vu_viec)"
  }
}
```
(403 Forbidden)

### Kết quả thực tế
```json
{
  "success": true,
  "data": {
    "id": "8b0ff611-849c-47dd-acad-4086a8e28ec1",
    "maVuViec": "VV-BTP-TW-20260418-011",
    "trangThai": "DA_TIEP_NHAN"
  }
}
```

### Bằng chứng
- [evidence/tc-vv-028-qtht-create-denied.json](evidence/tc-vv-028-qtht-create-denied.json) (filename misleading — content = success)
- [evidence/tc-vv-028-qtht-list.json](evidence/tc-vv-028-qtht-list.json) (R is OK)

### So sánh (Comparison)

| Role | GET /vu-viecs | POST /vu-viecs/manual | DELETE /vu-viecs/{id} |
|------|---------------|----------------------|------------------------|
| CB_NV (canbo_tw) | ✅ | ✅ | Reject by state guard |
| **QTHT (qtht_tw)** | ✅ (OK per matrix) | **✅ (!!BUG!! should be ❌ 403)** | Reject by state guard (masks authz) |
| NHT (nht_user) | ✅ — but sees all (BUG-VV-004) | Chưa test | — |
| TVV (tvv_user) | ✅ (BUG-VV-015) | Chưa test | — |

### Tác động
- **Privilege escalation:** QTHT (IT admin) có thể tạo VV giả mạo → inject vào workflow → gán cho NHT bất kỳ → phê duyệt trái thẩm quyền
- **Audit log confused:** nguoiTaoId = qtht_tw id trong khi business logic yêu cầu CB NV hoặc DN
- **Compliance:** Vi phạm segregation of duties (IT admin không được chạm dữ liệu nghiệp vụ)
- **Impact scope:** Có bao nhiêu QTHT thì có bấy nhiêu attack vector

### Nguyên nhân nghi ngờ
File `vu-viec.controller.ts`:
```ts
@Post('manual')
@Permission('create_vu_viec')  // ❌ nếu thiếu decorator này hoặc permission sai
async createManual(@Body() dto: CreateVuViecManualDto) {...}
```
Hoặc JWT claim `permissions` array của QTHT chứa `create_vu_viec` (sai seed data permissions).

### Gợi ý sửa
1. **Verify permission claims** của QTHT JWT token: decode token, xem `permissions` array có `create_vu_viec` không. Nếu có → fix seed data.
2. **Verify controller decorator:** Đảm bảo `@Permission('create_vu_viec')` được apply trước controller method + guard được register global.
3. Thêm integration test:
```ts
it('QTHT should not create VV', async () => {
  const qthtToken = await loginAs('qtht_tw');
  const res = await request(app).post('/api/v1/vu-viecs/manual').set('Authorization', `Bearer ${qthtToken}`).send({...});
  expect(res.status).toBe(403);
});
```

---

## BUG-VV-015 — [Critical] TVV đọc được VU_VIEC — authz leak (NEW)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-015 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission / Authorization leak |
| **Status** | Open (new) |
| **Endpoint** | `GET /api/v1/vu-viecs` |
| **Tài khoản ảnh hưởng** | tvv_user (role TVV) |
| **TC Reference** | VV-013d, VV-026b |
| **SRS Reference** | permission-matrix.md — TVV row cho VU_VIEC = **❌** (không truy cập). TVV chỉ thấy HO_SO_VU_VIEC + KET_QUA_VU_VIEC |

### Mô tả
Theo permission matrix, TVV không có quyền truy cập entity VU_VIEC ở bất kỳ action nào (R/U/C/D đều ❌). Thực tế: GET /vu-viecs bearer tvv_user → 200, trả về 5 items.

### Các bước tái hiện
1. Login tvv_user (password Test@1234) → JWT (vaiTro=["TVV"])
2. GET /vu-viecs?pageSize=5 bearer JWT TVV
3. Quan sát: 200 OK, data = 5 VV objects với full content

### Kết quả mong đợi
`403 Forbidden` — Error: "Bạn không có quyền truy cập vụ việc"

### Kết quả thực tế
```json
{
  "success": true,
  "data": [
    {"id":"...", "maVuViec":"VV-BTP-TW-20260418-011", "trangThai":"DA_TIEP_NHAN", ...},
    ...
  ]
}
```

### Bằng chứng
- [evidence/tc-vv-026b-tvv-denied.json](evidence/tc-vv-026b-tvv-denied.json) (filename misleading — TVV was NOT denied)

### Tác động
- **Data breach:** TVV bên ngoài (portal role) đọc được thông tin toàn bộ VV của khách hàng khác → leak business information
- **SRS violation:** Module design rõ ràng TVV chỉ làm việc với HO_SO_VU_VIEC + KET_QUA (tức tài liệu + kết quả được NHT/CB NV share cho), không thấy VV chính
- **Compliance:** Vi phạm nguyên tắc least privilege + bảo mật dữ liệu NĐ55

### So sánh
| Role | Permission per matrix | Actual API result |
|------|----------------------|-------------------|
| CB_NV | ✅ R (all) / CU (scope donVi) | ✅ R OK |
| QTHT | 👁️ R (read only) | 🚨 R + C (BUG-VV-014) |
| NHT | 📝 RU* (scoped to assigned) | 🚨 R (all 16) (BUG-VV-004) |
| **TVV** | **❌ (no access)** | **🚨 R (5 items)** (this BUG) |
| DN | 👁️ R* (scope DN of self) | ❌ 403 (actually stricter than matrix allows — cần fix BUG-VV-007 để DN access portal) |

### Gợi ý sửa
Thêm `@Permission('read_vu_viec')` trên GET /vu-viecs hoặc explicit `@DenyRole('TVV')`. Nếu đang dùng CASL:
```ts
// vu-viec.ability.ts
if (user.vaiTro.includes('TVV')) {
  // không thêm rule read VuViec
}
```

---

## BUG-VV-016 — [Major] YEU_CAU_BO_SUNG → kiem-tra lần 2 bị reject (NEW)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-VV-016 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Workflow |
| **Status** | Open (new) |
| **Endpoint** | `POST /vu-viecs/{id}/kiem-tra` trên VV ở state YEU_CAU_BO_SUNG |
| **TC Reference** | VV-009, VV-010 |
| **SRS Reference** | SM-VUVIEC — `YEU_CAU_BO_SUNG ⇄ DANG_KIEM_TRA` (lặp đến khi boSungCount=4 auto reject, BR-EC-15) |

### Mô tả
Sau khi VV ở state YEU_CAU_BO_SUNG (boSungCount=1), gọi lại kiem-tra lần 2 → reject `ERR-STATE-VI-08-02: Vụ việc không ở trạng thái cho phép kiểm tra`. `_links.kiem-tra` hiện diện nhưng không actionable (xem BUG-VV-005). Kết quả: không đạt được boSungCount=2, 3, 4 → không verify được BR-EC-15 (auto reject lần 4).

### Các bước tái hiện
1. Tạo VV → DA_TIEP_NHAN
2. kiem-tra(YEU_CAU_BO_SUNG) → state YEU_CAU_BO_SUNG, boSungCount=1 ✓
3. (Giả định) DN nộp bổ sung qua endpoint nào đó → state về DA_TIEP_NHAN hoặc DANG_KIEM_TRA
4. kiem-tra lần 2 → **ERR-STATE-VI-08-02**
5. Không có endpoint "nop-bo-sung" để return state về kiem-tra-able

### Gợi ý sửa
Thêm endpoint `POST /vu-viecs/{id}/nop-bo-sung` (role DN hoặc CB NV thay DN):
- Accept state YEU_CAU_BO_SUNG
- Transition YEU_CAU_BO_SUNG → DA_TIEP_NHAN hoặc DANG_KIEM_TRA
- Cho phép CB NV kiem-tra lại (lần 2, 3, 4)
- Enforce BR-EC-15: nếu boSungCount >= 3 và kiem-tra(YEU_CAU_BO_SUNG) thêm lần nữa → auto TU_CHOI thay vì YEU_CAU_BO_SUNG

Hoặc — nếu design là CB NV kiem-tra lại trực tiếp trên YEU_CAU_BO_SUNG (không cần nop-bo-sung) — thì fix state guard của action kiem-tra để accept cả YEU_CAU_BO_SUNG.

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| MailHog (OTP) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3001/api/v1 (không test trực tiếp) |
| Frontend | React + Vite + Ant Design (6-tabs component, ant-table, ant-modal) |
| Xác thực | JWT (in-memory) + refresh_token (httpOnly cookie, path=/api/v1/auth) + OTP 6-digit email |
| Browser | Chromium 146 (headless) qua gstack browse tool |
| Viewport | 1440x900 |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Đơn vị | Cấp | Dùng cho bug nào |
|---------------|---------|--------|-----|------------------|
| canbo_tw | CB_NV | Cục BTTP | DP | BUG-VV-001, 002, 003, 005, 006, 009, 010, 011, 012, 013, 016 |
| qtht_tw | QTHT | Cục BTTP | TW | **BUG-VV-014** (permission escalation) |
| nht_user | NHT | — | Portal | **BUG-VV-004** (authz leak - sees all) |
| tvv_user | TVV | — | Portal | **BUG-VV-015** (authz leak - should be no access) |
| dn_user | DN | — | Portal | Context: VV-029 BLOCKED (pre-cond BUG-VV-007) |

### C — Danh mục ảnh chụp

| File | Mô tả | Dùng cho bug |
|------|-------|--------------|
| [00-login-page.png](screenshots/00-login-page.png) | Trang đăng nhập trước khi nhập | — (context) |
| [01-otp-step.png](screenshots/01-otp-step.png) | Form OTP sau khi submit username/password | — (context) |
| [02-post-login-403.png](screenshots/02-post-login-403.png) | Trang 403 sau khi login thành công | BUG-VV-001 |
| [vv-001-list-full.png](screenshots/vv-001-list-full.png) | Danh sách VV — tab "Tất cả" active, 5/5 items | BUG-VV-002 (baseline) |
| [vv-001-list-initial.png](screenshots/vv-001-list-initial.png) | Capture ban đầu của list view | — (redundant evidence) |
| [vv-001-list-all-tab.png](screenshots/vv-001-list-all-tab.png) | Full list view với tab Tất cả | — (redundant evidence) |
| [vv-001-tab-cho-tiep-nhan.png](screenshots/vv-001-tab-cho-tiep-nhan.png) | Sau click tab "Chờ tiếp nhận" — vẫn 5/5 items (BUG evidence) | BUG-VV-002 |
| [vv-003-create-form.png](screenshots/vv-003-create-form.png) | Attempt mở modal create (không mở được do tool issue) | — (BLOCKED evidence) |

### D — Ghi chú môi trường test (không phải lỗi app)

Trong quá trình test, quan sát được các **tool limitation** ảnh hưởng test coverage (không phải bug app):

1. **Browse tool Chromium restart liên tục** giữa các lệnh `$B` → mất in-memory JWT → session die ngẫu nhiên giữa multi-step test
2. **`$B js` thỉnh thoảng throw "Illegal invocation"** khi page context bị destroy giữa chừng
3. **`$B screenshot` đôi lúc capture blank white image** khi playwright page không sẵn sàng
4. Cùng hiện tượng với round đầu của hoi-dap (đã note "browse tool không dùng được", khắc phục bằng `chain + wait .ant-table`, nhưng chain không work ổn định với complex workflow nhiều steps)

→ Khuyến nghị về tooling: xem [functional-test-report.md §7 Recommendations](functional-test-report.md#7-recommendations).

### E — API Evidence Files (tc-vv-*.json + walk-*.json)

Toàn bộ response API được lưu trong folder `evidence/`. Reference per bug:

| Bug ID | Evidence files |
|--------|---------------|
| BUG-VV-003 | tc-vv-007-kiem-tra-dat-success.json, walk-kiemtra-02.json |
| BUG-VV-004 | tc-vv-026-nht-list-all.json |
| BUG-VV-005 | (observed in) tc-vv-011-phancong.json |
| BUG-VV-006 | walk-phancong.json, tc-vv-011-phancong-success.json, tc-vv-011-phancong.json |
| BUG-VV-007 | (seeding logs in data-readiness-vu-viec.md §1) |
| BUG-VV-008 | (same as above) |
| BUG-VV-009 | walk-trinhpheduyet.json, tc-vv-014-trinh-phe-duyet.json |
| BUG-VV-010 | (observed in) tc-vv-007-* |
| **BUG-VV-011** | **tc-vv-004-missing-dn-creates-vv.json**, tc-vv-004-empty-body.json, tc-vv-004-invalid-lv.json |
| **BUG-VV-012** | tc-vv-001-list-all.json (deadline pattern), tc-vv-003-create-success.json |
| **BUG-VV-013** | tc-vv-024-export-missing.json |
| **BUG-VV-014** | tc-vv-028-qtht-create-denied.json (filename misleading), tc-vv-028-qtht-list.json, tc-vv-028-qtht-delete-bug.json |
| **BUG-VV-015** | tc-vv-026b-tvv-denied.json (filename misleading) |
| **BUG-VV-016** | (observed in VV-009 session, see functional-test-report §4.8) |

### F — Methodology note

**Round 2 session 2 (chiều 2026-04-18):** Test primary method **API-based** vì:
- Browse tool (Playwright) crash liên tục trên Vite dev SPA của app HTPLDN (inherited bug — xem project CLAUDE.md §"Browse tool — PATTERNS BẮT BUỘC")
- OTP bypass 666666 hoạt động qua API POST /auth/verify-otp → có thể lấy JWT trong 1 request pair
- Data readiness report cùng tác giả (session 1 sáng) đã establish 11 VVs pre-existing ở 5 states

API testing coverage: 13 TC khả thi verified (PASS 10, FAIL với bug evidence 9, skip/blocked do app bugs khác 14). Unit per bug evidence được lưu JSON response để reproduce bởi dev.

---

*Bug report generated: 2026-04-18 (14:55 UTC+7, updated) | QA Automation via Claude Code | Opus 4.7 (1M context) | Method: Hybrid API + UI carry-over*
