## INVENTORY MÀN HÌNH — Module Dashboard

**Trạng thái:** ✅ Hoàn thành
**Tiến độ:** 1/1 màn hình — 30/30 components
**SRS nguồn:** `_bmad-output/planning-artifacts/srs-v3-no-screen/srs-fr-01-dashboard.md`
**Design source:** `design-system/tokens.css` + `design-system/styles.css` (single theme, Ant Blue-7, Be Vietnam Pro)

| # | SCR ID | Tên màn hình | Loại | Số components trong SRS | Route | File React | Trạng thái |
|---|--------|-------------|------|------------------------|-------|------------|-----------|
| 1 | SCR-I-01 | Tổng quan hệ thống | Dashboard (read-only) | 30 | `/dashboard` | `pages/dashboard/index.tsx` | ✅ |

**Verification (Phase 3):**
- ✅ `npm run build` clean (TypeScript strict + Vite)
- ✅ Screenshot 1440×1800 fullpage — all 5 vùng + 9 KPI + 3 charts visible với bar hierarchy + donut center label
- ✅ Screenshot 1024×2100 — layout intact, không vỡ grid (lg:grid-cols-4 / lg:grid-cols-5 / lg:grid-cols-2 giữ gọn)
- ✅ Sidebar fixed (`position: fixed` + `marginInlineStart` trên inner Layout) — không cuộn theo page
- ✅ Antd tokens rendered: `--ant-color-primary:#0958d9`, `--ant-font-family:"Be Vietnam Pro"`, `--ant-border-radius:6px`, `--ant-control-height:32px` — khớp tokens.css

**Lịch sử fix sau user feedback (v2):**
- **v1 → v2**: 3 lỗi user báo
  - *Menu không fixed*: Đổi `Sider className="h-screen sticky top-0"` trong Layout flex stretch → `style={{ position: 'fixed' }}` + `Layout style={{ marginInlineStart: siderWidth }}` trên inner Layout
  - *Mã UC/FR/KPI lộ UI*: Bỏ tag `{data.ma}` trong `KpiCard`, bỏ `<Tag>{ucCode}</Tag>` trong `ChartHaiLong`, `ChartDaoTao`. Mã spec chỉ còn trong `title` attribute (browser tooltip) + internal data model
  - *Biểu đồ xấu*: 3 nguyên nhân fix:
    - Rút tên "Sở TP Hà Nội" → "Hà Nội" (cấp đã biết từ chip phạm vi)
    - Y domain zoom: chart trái 50-100 (data 68-86), chart phải 65-100 (data 71-94), kèm annotation "(Y: 50-100)" + "(Y: 65-100)" cảnh báo user
    - Rank-based fill color: top-1 primary-7 đậm, top-2/3 primary-6, middle-3 primary-5, bottom primary-3 nhạt
- **Lib charts**: Gỡ `@ant-design/charts` (G2 wrapper, 500KB+), thay bằng `recharts@^3.8.1` — bundle 2.46MB → 1.37MB, gzip 730KB → 410KB
- **Recharts v3 gotcha**: Bar cần `isAnimationActive={false}` + `minPointSize={2}` + YAxis `type="number"` + `allowDataOverflow={false}` rõ ràng để tính baseline đúng

**Tổng: 1 màn hình, 27 components semantic (sau CR 2026-04-24 filter consolidation — Vùng 2 consolidated 8→5 components; Vùng 3+4+5+state giữ nguyên số #14-30 tránh churn cross-reference, component #11-13 cũ vacated)**

---

### SCR-I-01: Tổng quan hệ thống (Dashboard)

**Bố cục 5 vùng (dọc, semantic — SRS §3.SCR-I-01 Bố cục tổng quan):**

| Vùng | Nội dung | Route / Container |
|---|---|---|
| 1 | Tiêu đề & công cụ | Header row trong `pages/dashboard/index.tsx` |
| 2 | Bộ lọc | `FilterBar` |
| 3 | 4 thẻ KPI Vụ việc & Hỏi đáp | Grid row 1 |
| 4 | 5 thẻ KPI Đào tạo/TVV/Vận hành | Grid row 2 |
| 5 | 3 biểu đồ phân tích | UC8 trái + UC8 phải + UC9 |

**Components cần render (từ SRS §3 Bảng Thành phần màn hình — semantic):**

| # | Component | Vùng | Ant Design mapping | File |
|---|---|---|---|---|
| 1 | Breadcrumb "Trang chủ > Tổng quan" | 1 | `Breadcrumb` (AppLayout) | `components/layout/AppLayout.tsx` |
| 2 | Tiêu đề "Tổng quan hệ thống" | 1 | `Typography.Title` level={3} | `index.tsx` |
| 3 | Nút Làm mới + chỉ dấu loading | 1 | `Button` icon=`ReloadOutlined` spin khi loading | `index.tsx` |
| 4 | Nhãn "Cập nhật lúc HH:mm" | 1 | `Typography.Text` | `index.tsx` |
| 5 | Chip phạm vi dữ liệu | 1 | `Tag` + `EnvironmentOutlined`, text theo bảng 6 states | `index.tsx` |
| 6 | Date Range Picker "Kỳ thời gian" (7 preset gợi ý INSIDE popover: 7 ngày qua / 30 ngày qua / Tháng này / Quý này / Năm nay / Quý trước / Năm trước + calendar tùy chỉnh) | 2 | `DatePicker.RangePicker` + `presets` prop | `FilterBar` |
| 7 | Dropdown Cấp đơn vị L1 ∈ {DP, BN} | 2 | `Select` — bắt buộc có value, locked cho BN/ĐP | `FilterBar` |
| 8 | Dropdown Đơn vị L2 (Tất cả/cụ thể) | 2 | `Select` cascading theo L1, locked cho BN/ĐP | `FilterBar` |
| 9 | Nút Áp dụng | 2 | `Button` type="primary" | `FilterBar` |
| 10 | Nút Trở về mặc định | 2 | `Button` type="text" | `FilterBar` |
| — | ~~Preset buttons row~~ (cũ #6) | — | **Consolidated vào #6 RangePicker popover** (CR 2026-04-24) | — |
| — | ~~Dropdown Năm~~ (cũ #7) | — | **Bỏ** — redundant với preset "Năm nay" + "Năm trước" (CR 2026-04-24) | — |
| — | ~~DatePicker Từ ngày + Đến ngày~~ (cũ #8+#9) | — | **Gộp** vào #6 RangePicker (CR 2026-04-24) | — |
| 14 | KPI-01 Hỏi đáp mới (Flow) | 3 | `KpiCard` — drill-down `/hoi-dap/danh-sach?trang_thai=MOI&...` | `components/KpiCard.tsx` |
| 15 | KPI-02 Vụ việc tiếp nhận (Flow) | 3 | `KpiCard` — `/vu-viec/danh-sach?ngay_tiep_nhan_tu=...` | |
| 16 | KPI-03 Vụ việc đang hỗ trợ (Stock) | 3 | `KpiCard` — `/vu-viec/danh-sach?trang_thai=DA_TIEP_NHAN,DANG_KIEM_TRA,YEU_CAU_BO_SUNG,DA_PHAN_CONG,DANG_XU_LY&...` | |
| 17 | KPI-04 Vụ việc hoàn thành (Flow) | 3 | `KpiCard` — `/vu-viec/danh-sach?trang_thai=HOAN_THANH&ngay_hoan_thanh_tu=...` | |
| 18 | KPI-05 Khóa học đang diễn ra (Stock) | 4 | `KpiCard` — `/dao-tao/khoa-hoc?trang_thai=DANG_DIEN_RA&...` | |
| 19 | KPI-06 Khóa học đã kết thúc (Flow) | 4 | `KpiCard` — `/dao-tao/khoa-hoc?trang_thai=DA_KET_THUC&ngay_ket_thuc_tu=...` | |
| 20 | KPI-07 TVV đang hoạt động (Stock) | 4 | `KpiCard` — `/chuyen-gia-tvv/danh-sach?trang_thai=DANG_HOAT_DONG&...` | |
| 21 | KPI-S-01 Tỷ lệ vụ phải bổ sung (%) | 4 | `KpiCard` no-drilldown, value nullable → "—" | |
| 22 | KPI-S-02 Thời gian xử lý TB (ngày LV) | 4 | `KpiCard` no-drilldown, value nullable → "—" | |
| 23 | Chart UC8 trái — Điểm hài lòng TB (0-100) | 5 | `@ant-design/charts` Column — header tổng TB + trend + caption N đánh giá | `components/ChartHaiLong.tsx` |
| 24 | Chart UC8 phải — Tỷ lệ SLA (%) | 5 | Column — header % + trend + caption N vụ | `components/ChartSLA.tsx` |
| 25 | Chart UC9 — Donut Đạt/Không đạt + center "Điểm TB: X.X/10" | 5 | Pie innerRadius + annotation center + 2 metric trend | `components/ChartDaoTao.tsx` |
| 26 | Trạng thái Loading (Skeleton) | widget-level | `Skeleton.Button` / `Skeleton` block trong mỗi KpiCard/Chart | inline |
| 27 | Trạng thái Không có dữ liệu | widget-level | `Empty` + "Chưa có dữ liệu..." text — KpiCard value=0 hoặc chart empty | inline |
| 28 | Trạng thái Widget hỏng lần đầu | widget-level | Alert cục bộ "Không tải được" + `Button` "Thử lại" | inline |
| 29 | Trạng thái Widget stale sau fail | widget-level | Giữ value cũ + `Tag` "Dữ liệu từ HH:mm" + retry | inline |
| 30 | Banner global ≥50% widget fail | page-level | `Alert` type="error" showIcon + "Thử lại tất cả" button | `index.tsx` top |

**Quy tắc tương tác tổng thể (SRS §3):**

- Auto-refresh 60s + Page Visibility API (pause khi tab hidden → resume + refresh ngay khi visible)
- Đồng bộ 2 chiều: preset (INSIDE RangePicker popover) ↔ Date Range Picker — click preset auto-apply, chọn tùy chỉnh calendar → pending (sau CR 2026-04-24)
- URL sync: filter state synced vào URL (shareable link)
- Click KPI card → navigate drill-down với filter hiện tại
- Validation: từ > đến → disable Áp dụng + inline error banner
- Per-widget fail isolation: 1 widget fail không kéo fail widget khác
- User TW: default L1='DP' + L2='Tất cả ĐP'. User BN/ĐP: locked.

**Ma trận phân quyền (SRS §3 P1-P8):** mô phỏng user TW cho prototype. Các role khác out-of-scope (cần trang login).

**Entity nguồn (SRS §4):** HOI_DAP, VU_VIEC, KHOA_HOC, TU_VAN_VIEN, KET_QUA_DANH_GIA, KET_QUA_DAO_TAO, CAU_HINH_SLA, DON_VI, TAI_KHOAN — tất cả mock data trong `data/dashboard.ts`.

**Demo controls (prototype-only, không phải spec SRS):** Nút dev "Mô phỏng lỗi widget" + "Mô phỏng lỗi hạ tầng" để demo state 28/29/30. Đặt ở cuối page hoặc trong dev toolbar.
