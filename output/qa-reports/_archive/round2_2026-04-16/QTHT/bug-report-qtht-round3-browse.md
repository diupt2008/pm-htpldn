# Bug Report — Quản trị Hệ thống (QTHT) — Round 3 (Browse UI only)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation via Claude Code (/browse — gstack browse + Chromium headless) |
| **Ngày** | 2026-04-18 15:36–16:10 (UTC+7) |
| **Loại test** | Functional + Structural (UI-only, theo test-strategy §402 — `/browse` default) |
| **Round** | Round 3 — delta vs Round 2 |
| **Tài liệu tham chiếu** | [test-strategy.md §402](../../../test-strategy.md), [7.10-quan-tri-he-thong.md](../../../funtion/7.10-quan-tri-he-thong.md), [srs-fr-10-quan-tri.md](../../../../input/srs-v3/srs-fr-10-quan-tri.md), [bug-report-qtht-final.md](bug-report-qtht-final.md) |

---

## Tổng hợp

Round 3 chạy bằng `/browse` UI (đúng rule §402 "mặc định UI cho mọi TC") để **re-audit** những điểm round 2 có thể đã bỏ sót, đặc biệt là **cấu trúc sidebar QTHT**. Phát hiện **4 bug mới** liên quan đến cấu trúc menu và tab tổ chức — round 2 đã note 8 sub-menu nhưng đánh `INFO — đúng SRS` mà không đối chiếu với spec SCR-VIII-01 → SCR-VIII-10.

15 bug đã được ghi nhận ở [bug-report-qtht-final.md](bug-report-qtht-final.md) vẫn còn hiệu lực. Round 3 **bổ sung** 4 bug structural, tổng: **19 bug**.

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 19 (4 mới) | 2 | **11** (+3) | **6** (+1) | 0 | 0 |

## Bug Summary Table — Round 3 Additions

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Source | Status |
|--------|----------|----------|------|--------|--------|-------|--------|--------|
| BUG-QTHT-R3-001 | Major | P1 | UI/UX | Sidebar QTHT | SM-QT-30, SM-QT-35 | Sidebar QTHT sai cấu trúc SRS v2.1 — thiếu 2 menu, thừa 2, 2 sai level, Cấu hình chưa unified | UI | Open |
| BUG-QTHT-R3-002 | Major | P1 | UI/UX | Danh mục | SM-QT-08 | Trang Danh mục có 16 tabs (SRS chỉ định 14) — thừa "Tỉnh/Thành phố" và "Hệ thống nguồn" | UI | Open |
| BUG-QTHT-R3-003 | Major | P1 | Data | Cấu hình HT | SM-QT-30→34 | Cấu hình SLA / Phân công là 2 trang standalone — không phải 4-tab unified "Cấu hình hệ thống" (SCR-VIII-06 v2.1) | UI | Open |
| BUG-QTHT-R3-004 | Medium | P2 | UI/UX | Tài khoản | SM-QT-21 | Trang Tài khoản thiếu tabs trạng thái với số đếm (Tất cả/Hoạt động/Chờ kích hoạt/Tạm khóa/Chờ phân quyền) | UI | Open |

> **Liên quan BUG cũ:**
> - BUG-QTHT-010 (round 2 — Major): "Thiếu menu Nhật ký hệ thống" → giờ khẳng định là **structural violation** của SRS SCR-VIII-10 v2.1, không chỉ "thiếu endpoint + menu" như round 2 mô tả.
> - BUG-QTHT-R3-003 gộp luồng SCR-VIII-06 v2.1 (unified config) với BUG-010 (missing Nhật ký) thành bức tranh structural hoàn chỉnh.

---

## BUG-QTHT-R3-001 — Sidebar QTHT sai cấu trúc SRS v2.1

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-R3-001 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Sidebar (Frontend) |
| **Thành phần** | Sidebar routing config (có thể `src/layout/MainSidebar.tsx` hoặc `src/routes/index.tsx` — menu QTHT) |
| **URL** | Mọi page sau login — sidebar trái |
| **Trình duyệt** | Chromium 146 (headless via gstack browse) |
| **Tài khoản** | admin / Secret@123 (QTHT_TW) |
| **TC Reference** | SM-QT-30, SM-QT-35 (và gián tiếp SM-QT-08, SM-QT-13, SM-QT-14) |
| **SRS Reference** | [srs-fr-10-quan-tri.md §3](../../../../input/srs-v3/srs-fr-10-quan-tri.md) — SCR-VIII-01 → SCR-VIII-10, đặc biệt v2.1 note dòng 1208 |
| **Assignee** | Frontend Team |
| **Found by** | QA Automation (Round 3 — phát hiện mà round 2 đã bỏ sót) |

### Mô tả

Khi admin (QTHT_TW) expand menu "Quản trị hệ thống" trên sidebar, thấy **8 sub-item** thay vì cấu trúc SRS v2.1 quy định. Round 2 đã chụp được 8 item này nhưng đánh `INFO — đúng SRS` (xem [functional-test-report-qtht-ui.md:65](functional-test-report-qtht-ui.md#L65)) mà không đối chiếu với spec từng màn hình SCR-VIII-01 → SCR-VIII-10.

### Các bước tái hiện

1. Login `admin / Secret@123` → OTP `666666` → Dashboard.
2. Click "Quản trị hệ thống" trên sidebar trái để expand.
3. Quan sát danh sách sub-item hiển thị.
4. Screenshot: [screenshots/round3-browse/sm-qt-sidebar-qtht-expanded.png](screenshots/round3-browse/sm-qt-sidebar-qtht-expanded.png)

### Kết quả thực tế — 8 sub-item

| # | Item hiển thị | Route |
|---|---------------|-------|
| 1 | Danh mục dùng chung | `/quan-tri/danh-muc/LINH_VUC_PL` |
| 2 | Cấu hình SLA | `/quan-tri/cau-hinh-sla` |
| 3 | Cấu hình phân công | `/quan-tri/cau-hinh-phan-cong` (suy đoán) |
| 4 | Ngày lễ | `/quan-tri/ngay-le` (suy đoán) |
| 5 | Tiêu chí đánh giá hiệu quả | `/quan-tri/tieu-chi-hq` (suy đoán) |
| 6 | Tiêu chí đánh giá chi phí | `/quan-tri/tieu-chi-cp` (suy đoán) |
| 7 | Tài khoản & phân quyền | `/quan-tri/tai-khoan` |
| 8 | Quản lý API Consumer | `/quan-tri/api-consumer` (suy đoán) |

### Kết quả mong đợi — theo SRS SCR-VIII-01 → SCR-VIII-10 (v2.1)

| SCR | Menu mong đợi | Ghi chú |
|-----|---------------|---------|
| SCR-VIII-01 | Quản lý Danh mục (1 trang chứa **14 tabs** — bao gồm TC ĐG hiệu quả/chi phí) | Xem SCR-VIII-01 line 1221 SRS |
| SCR-VIII-02/03/04/05 | "Tài khoản & phân quyền" consolidated (chấp nhận) | ✅ Đã có |
| SCR-VIII-06 v2.1 | **Cấu hình Hệ thống** (1 trang `/quan-tri/cau-hinh` chứa **4 tabs**: SLA / Phân công / Mẫu phản hồi / Quy trình hỗ trợ) | SRS line 1381: *"Gop MH-10.6 (SLA), MH-02.6 (Phan cong mac dinh), MH-02.7 (Mau phan hoi) + Quy trinh ho tro vao 1 trang"* |
| SCR-VIII-10 v2.1 | **Nhật ký hệ thống** (màn hình MỚI) | SRS line 1529: *"Man hinh moi. Sub-menu Nhat ky he thong. Hien thi audit log toan he thong"* |

### Ma trận so sánh chi tiết

| Item thực tế | Hiện trạng | SRS v2.1 yêu cầu | Phân loại |
|--------------|-----------|------------------|-----------|
| Danh mục dùng chung | Top-level menu | Top-level menu ✅ | **ĐÚNG** |
| Cấu hình SLA | Top-level menu | Tab 1 trong "Cấu hình hệ thống" | ❌ **SAI LEVEL** |
| Cấu hình phân công | Top-level menu | Tab 2 trong "Cấu hình hệ thống" | ❌ **SAI LEVEL** |
| Ngày lễ | Top-level menu | Không có trong FR-10 | ❌ **THỪA** |
| Tiêu chí ĐG hiệu quả | Top-level menu | Tab trong Danh mục (SCR-VIII-01 #21) | ❌ **SAI LEVEL** |
| Tiêu chí ĐG chi phí | Top-level menu | Tab trong Danh mục (SCR-VIII-01 #23) | ❌ **SAI LEVEL** |
| Tài khoản & phân quyền | Top-level menu | Consolidated SCR-VIII-02/03/04/05 | ✅ **ĐÚNG** |
| Quản lý API Consumer | Top-level menu | Không có trong FR-10 | ❌ **THỪA** |
| — | **Không có** | "Cấu hình hệ thống" (unified) | ❌ **THIẾU** |
| — | **Không có** | "Nhật ký hệ thống" (SCR-VIII-10) | ❌ **THIẾU** |

**Tổng kết:** 1 đúng, 1 consolidated hợp lệ, 4 sai level (tab biến top-level), 2 thừa, 2 thiếu.

### Tác động (Impact)

- **User QTHT:** không tìm thấy tính năng "Nhật ký hệ thống" (SCR-VIII-10) → không audit được, vi phạm UC 120-123 (audit log requirement).
- **User QTHT:** config SLA/Phân công/Mẫu/Quy trình bị phân mảnh → 4 trang thay vì 1 trang hợp lý → UX kém, khó correlate.
- **Compliance:** cấu trúc sidebar không khớp SRS release gate → BA & dev phải resync.
- **Regression risk:** "Ngày lễ" và "API Consumer" là routes ngoài spec — code có thể chứa tính năng chưa được review hoặc lệch scope.

### So sánh với Round 2

Round 2 ghi nhận:
- [functional-test-report-qtht-ui.md:65](functional-test-report-qtht-ui.md#L65): `Sidebar hiển thị đúng phân quyền ... INFO ... admin thấy đủ 13 menu top-level + 8 sub-menu QTHT — đúng SRS`
- [functional-test-report-qtht-ui.md:230](functional-test-report-qtht-ui.md#L230): `PASS` cho "submenu hiện 8 sub-items"

**Đây là false-PASS:** round 2 đếm 8 sub-item đúng nhưng không đối chiếu với SCR-VIII-01..10 spec. Chỉ bắt được 1 phần trong BUG-QTHT-010 ("thiếu Nhật ký") mà không escalate thành structural bug. Round 3 định danh đầy đủ.

### Nguyên nhân nghi ngờ (Root Cause)

Routing config trong FE được scaffold theo từng màn hình riêng lẻ (dạng "màn hình 1 – màn hình 10" cũ, trước v2.1 consolidation), chưa cập nhật theo SRS v2.1:
- Line 1208 SRS ghi rõ: `MH-10.6 (Cấu hình SLA) gộp vào MH-10.7 tab "SLA"` + 3 tab khác
- Line 1529: Thêm mới MH-10.10 Nhật ký hệ thống

Có thể 2 file cần review:
- `src/layouts/Sidebar/items.ts` (hoặc equivalent) — thêm/xóa menu item
- `src/pages/quan-tri/cau-hinh/index.tsx` — tạo unified page với 4 tab
- `src/pages/quan-tri/nhat-ky/index.tsx` — tạo page Nhật ký

### Gợi ý sửa (Suggested Fix)

**Phase 1 — Rename & consolidate structure:**

```diff
 // sidebar items
 QTHT: [
   { label: 'Danh mục dùng chung', to: '/quan-tri/danh-muc' },
-  { label: 'Cấu hình SLA',        to: '/quan-tri/cau-hinh-sla' },
-  { label: 'Cấu hình phân công',  to: '/quan-tri/cau-hinh-phan-cong' },
-  { label: 'Ngày lễ',             to: '/quan-tri/ngay-le' },
-  { label: 'Tiêu chí ĐG hiệu quả', to: '/quan-tri/tieu-chi-hq' },
-  { label: 'Tiêu chí ĐG chi phí',  to: '/quan-tri/tieu-chi-cp' },
+  { label: 'Cấu hình hệ thống',   to: '/quan-tri/cau-hinh' },   // 4 tabs inside
+  { label: 'Nhật ký hệ thống',    to: '/quan-tri/nhat-ky' },    // MH-10.10 mới
   { label: 'Tài khoản & phân quyền', to: '/quan-tri/tai-khoan' },
-  { label: 'Quản lý API Consumer', to: '/quan-tri/api-consumer' },
 ]
```

**Phase 2 — Tạo unified page:**

```tsx
// src/pages/quan-tri/cau-hinh/index.tsx
<Tabs
  items={[
    { key: 'sla',        label: 'Thời hạn xử lý (SLA)', children: <SLATab /> },
    { key: 'phan-cong',  label: 'Phân công mặc định',   children: <PhanCongTab /> },
    { key: 'mau-ph',     label: 'Mẫu phản hồi',          children: <MauPhanHoiTab /> },
    { key: 'quy-trinh',  label: 'Quy trình hỗ trợ',      children: <QuyTrinhTab /> },
  ]}
/>
```

**Phase 3 — "Ngày lễ" và "API Consumer":**
- Nếu là tính năng yêu cầu thật (post-SRS) → cập nhật SRS, giữ menu
- Nếu ngoài scope → remove menu + move routes ra khỏi production

**Phase 4 — Di chuyển "Tiêu chí ĐG hiệu quả/chi phí":**
- Đưa vào trang Danh mục dưới dạng tab 10 và 11 (theo SCR-VIII-01 #21, #23)

---

## BUG-QTHT-R3-002 — Trang Danh mục có 16 tabs (SRS chỉ định 14)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-R3-002 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Danh mục |
| **Thành phần** | `src/pages/quan-tri/danh-muc/tabs.ts` (suy đoán) + enum `LoaiDanhMuc` backend |
| **URL** | `/quan-tri/danh-muc/LINH_VUC_PL` |
| **Tài khoản** | admin (QTHT_TW) |
| **TC Reference** | SM-QT-08 |
| **SRS Reference** | [SCR-VIII-01 line 1221](../../../../input/srs-v3/srs-fr-10-quan-tri.md#L1221) |
| **Assignee** | Frontend + Backend Team |

### Mô tả

Panel trái trang "Quản lý danh mục" hiển thị **16 tabs** thay vì 14 mà SRS SCR-VIII-01 chỉ định.

### Các bước tái hiện

1. Login admin.
2. Click sidebar "Quản trị hệ thống" → "Danh mục dùng chung".
3. Đếm số tab ở panel trái.
4. Screenshot: [sm-qt-07-danh-muc-landing.png](screenshots/round3-browse/sm-qt-07-danh-muc-landing.png)

### Kết quả mong đợi

14 tabs theo SRS:

> "14 loại danh mục: Lĩnh vực PL, Loại hình HT, Chương trình HT, Tình trạng VV, Cơ quan ĐV, Tổ chức tư vấn, Loại DN, Hồ sơ đề nghị HT, Hồ sơ đề nghị TT, Tiêu chí ĐG hiệu quả, Tiêu chí ĐG chi phí, Loại TK, Loại hình tiếp nhận, Kênh tiếp nhận"

### Kết quả thực tế — 16 tabs

| # | Tab | So với SRS |
|---|-----|------------|
| 1 | Lĩnh vực pháp lý | ✅ |
| 2 | Loại hình hỗ trợ | ✅ |
| 3 | Chương trình hỗ trợ | ✅ |
| 4 | Tình trạng vụ việc | ✅ |
| 5 | **Tỉnh/Thành phố** | ❌ **THỪA** (không có trong 14-list) |
| 6 | Tổ chức tư vấn | ✅ |
| 7 | Loại doanh nghiệp | ✅ |
| 8 | Hồ sơ đề nghị hỗ trợ | ✅ |
| 9 | Hồ sơ đề nghị thanh toán | ✅ |
| 10 | Tiêu chí đánh giá hiệu quả | ✅ |
| 11 | Tiêu chí đánh giá chi phí | ✅ |
| 12 | Loại tài khoản | ✅ |
| 13 | Loại hình tiếp nhận | ✅ |
| 14 | Kênh tiếp nhận | ✅ |
| 15 | **Hệ thống nguồn** | ❌ **THỪA** |
| 16 | Cơ quan đơn vị | ✅ |

### Tác động

- QA/BA verify theo SRS không khớp — confusion về scope.
- Liên quan BUG-QTHT-012 (round 2): enum `LoaiDanhMuc` backend không đủ. Round 3 confirm thêm rằng FE đang expose 2 loại không có trong SRS.

### Gợi ý sửa

**Option 1 — SRS đã lỗi thời:**
- Update SRS v2.2 thêm "Tỉnh/Thành phố" và "Hệ thống nguồn" vào list 16.
- Sync enum `LoaiDanhMuc` backend (fix BUG-QTHT-012).

**Option 2 — FE/BE đã lệch scope:**
- Remove 2 tab "Tỉnh/Thành phố" và "Hệ thống nguồn" (kèm route + data).
- Nếu cần data "Tỉnh/Thành phố", di chuyển vào DANH_MUC_CO_QUAN_DV (SCR-VIII-01 #17-20 tree view).

---

## BUG-QTHT-R3-003 — Cấu hình HT chưa unified (SCR-VIII-06 v2.1)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-R3-003 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Cấu hình |
| **Thành phần** | Thiếu page `src/pages/quan-tri/cau-hinh/index.tsx` + route |
| **URL** | Hiện tại: `/quan-tri/cau-hinh-sla` (standalone) — Cần: `/quan-tri/cau-hinh` với 4 tabs |
| **Tài khoản** | admin |
| **TC Reference** | SM-QT-30, SM-QT-31, SM-QT-32, SM-QT-33, SM-QT-34 |
| **SRS Reference** | [SCR-VIII-06 line 1375-1438](../../../../input/srs-v3/srs-fr-10-quan-tri.md#L1375) |
| **Assignee** | Frontend Team |

### Mô tả

SRS v2.1 line 1381 nêu rõ:

> **v2.1:** Gop MH-10.6 (SLA), MH-02.6 (Phan cong mac dinh), MH-02.7 (Mau phan hoi) + Quy trinh ho tro vao 1 trang cau hinh. URL: /quan-tri/cau-hinh. Quyen truy cap: QTHT.

Thực tế: `Cấu hình SLA` và `Cấu hình phân công` là **2 page standalone** (breadcrumb riêng, URL riêng). "Mẫu phản hồi" và "Quy trình hỗ trợ" hoàn toàn **không tồn tại** trong sidebar QTHT.

### Các bước tái hiện

1. Login admin → Dashboard.
2. Click "Quản trị hệ thống" → "Cấu hình SLA".
3. Observe: URL = `/quan-tri/cau-hinh-sla`, breadcrumb `Trang chủ › Quản trị hệ thống › Cấu hình SLA`, **không có tab bar** ở trên cùng.
4. Screenshot: [sm-qt-30-sla-page.png](screenshots/round3-browse/sm-qt-30-sla-page.png)
5. Tương tự với "Cấu hình phân công".
6. Tìm "Mẫu phản hồi" và "Quy trình hỗ trợ" trong sidebar → không có.

### Kết quả mong đợi

- 1 menu "Cấu hình hệ thống" at `/quan-tri/cau-hinh`
- Tab bar với 4 tabs: SLA / Phân công mặc định / Mẫu phản hồi / Quy trình hỗ trợ
- Mỗi tab load nội dung tương ứng

### Kết quả thực tế

- 2 menu standalone (SLA + Phân công)
- 0 tab
- 2 nội dung missing (Mẫu + Quy trình)

### Tác động

- **QTHT:** không config được Mẫu phản hồi (FR-VIII-26) và Quy trình hỗ trợ (FR-VIII-27) — block flow hỏi đáp (cần mẫu) và vụ việc (cần quy trình).
- **Compliance:** violates SRS v2.1 release criteria.

### Gợi ý sửa

Xem phần Phase 2 của BUG-QTHT-R3-001. Cần:
1. Tạo page unified
2. Move SLATab, PhanCongTab vào đó
3. Build MauPhanHoiTab + QuyTrinhTab (2 tính năng hoàn toàn mới?)
4. Remove 2 route standalone cũ, redirect 301 → new tabs
5. Update sidebar menu

---

## BUG-QTHT-R3-004 — Trang Tài khoản thiếu tabs trạng thái có số đếm

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-R3-004 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Tài khoản |
| **Thành phần** | `src/pages/quan-tri/tai-khoan/index.tsx` (suy đoán) |
| **URL** | `/quan-tri/tai-khoan` |
| **Tài khoản** | admin |
| **TC Reference** | SM-QT-21 |
| **SRS Reference** | [SCR-VIII-03 #8 line 1305](../../../../input/srs-v3/srs-fr-10-quan-tri.md#L1305) |
| **Assignee** | Frontend Team |

### Mô tả

SRS SCR-VIII-03 #8 yêu cầu:

> `| 8 | content | Tab | tab | Tất cả / Hoạt động / Chờ kích hoạt / Tạm khóa / Chờ phân quyền (số đếm) | click → filter |`

Thực tế UI không có tab bar này. Chỉ có filter dropdown "Trạng thái" (select single-value).

### Các bước tái hiện

1. Login admin → "Tài khoản & phân quyền".
2. Quan sát phần trên bảng: có 5 filter dropdown + button Thêm mới + Tìm kiếm + Xóa lọc, **không có tab bar**.
3. Screenshot: [sm-qt-20-tai-khoan.png](screenshots/round3-browse/sm-qt-20-tai-khoan.png)

### Kết quả mong đợi

Trên bảng có 5 tab với badge số:
- Tất cả (25)
- Hoạt động (N)
- Chờ kích hoạt (M)
- Tạm khóa (K)
- Chờ phân quyền (L)

### Kết quả thực tế

- Không có tab bar
- Filter trạng thái là dropdown, phải mở mới thấy options

### Tác động

- UX kém: admin phải mở dropdown để xem số lượng từng trạng thái.
- Scan nhanh bị chậm.

### Gợi ý sửa

```tsx
<Tabs
  items={[
    { key: 'all', label: `Tất cả (${total})` },
    { key: 'HOAT_DONG', label: `Hoạt động (${counts.active})` },
    { key: 'CHO_KICH_HOAT', label: `Chờ kích hoạt (${counts.pending})` },
    { key: 'TAM_KHOA', label: `Tạm khóa (${counts.locked})` },
    { key: 'CHO_PHAN_QUYEN', label: `Chờ phân quyền (${counts.pq})` },
  ]}
  onChange={setStatusFilter}
/>
```

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass tạm, xem CLAUDE.md) |
| MailHog (fallback) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design + Zustand + CASL |
| Backend | NestJS + TypeORM + PostgreSQL |
| Xác thực | JWT RS256 + OTP email 2FA (bypass dev: `666666`) |
| Test tool | gstack `/browse` (Chromium 146 headless) |
| Test rule | test-strategy.md §402 — mặc định UI, không API fallback |
| OS | macOS 15.5 (Darwin 24.5.0) ARM64 |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho bug nào |
|---------------|---------|-----|------------------|
| admin | QTHT_TW | TW | BUG-R3-001, R3-002, R3-003, R3-004 |

### C — Phân bổ bug theo team

| Team | Bugs Round 3 |
|------|--------------|
| **Frontend Team** | BUG-R3-001 (sidebar), R3-003 (unified page), R3-004 (tabs) |
| **Frontend + Backend** | BUG-R3-002 (sync tabs vs enum) |

### D — Danh mục ảnh chụp

| File | Mô tả | Dùng cho bug |
|------|-------|--------------|
| [01-dashboard.png](screenshots/round3-browse/01-dashboard.png) | Dashboard sau login admin | Baseline |
| [sm-qt-sidebar-qtht-expanded.png](screenshots/round3-browse/sm-qt-sidebar-qtht-expanded.png) | Sidebar QTHT expanded (8 sub-items) | BUG-R3-001 |
| [sm-qt-07-danh-muc-landing.png](screenshots/round3-browse/sm-qt-07-danh-muc-landing.png) | Trang Danh mục với 16 tabs | BUG-R3-002 |
| [sm-qt-30-sla-page.png](screenshots/round3-browse/sm-qt-30-sla-page.png) | Trang SLA standalone (không có tab bar) | BUG-R3-003 |
| [sm-qt-20-tai-khoan.png](screenshots/round3-browse/sm-qt-20-tai-khoan.png) | Trang Tài khoản (thiếu tabs trạng thái) | BUG-R3-004 |

### E — Liên quan Round 2

Round 2 ([bug-report-qtht-final.md](bug-report-qtht-final.md)) ghi nhận 15 bug. Round 3 bổ sung 4 bug structural, trong đó:

- **BUG-QTHT-R3-001** ← nâng cấp và mở rộng **BUG-QTHT-010** (round 2 ghi nhận "thiếu menu audit" — round 3 ghi nhận full structural deviation).
- **BUG-QTHT-R3-003** ← gộp với BUG-QTHT-010 (thiếu Nhật ký) thành 1 bức tranh SCR-VIII-06 v2.1 + SCR-VIII-10.
- 3 bug mới còn lại không trùng bug round 2.

Round 2 test ma trận phân quyền đầy đủ (QT-029 → 032) qua API + UI — **không re-test lại** trong round 3. Tham chiếu [bug-report-qtht-final.md](bug-report-qtht-final.md) BUG-007, BUG-008 cho permission issues.

---

*Round 3 bug report generated: 2026-04-18 16:10 UTC+7 | QA Automation via Claude Code (/browse)*
