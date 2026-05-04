// Mock data cho SCR-I-01 Dashboard.
// Phản ánh cấu trúc output của TPL-DASH-KPI (SRS §2) và outputs của FR-I-08/09.
// Agent build: tất cả giá trị là mock realistic cho user TW default
// (don_vi_cap='DP', don_vi_id=NULL, tu_ngay=01/01/2026, den_ngay=hôm nay).

export type TrendDir = 'TANG' | 'GIAM' | 'KHONG_DOI';

/**
 * Năm bắt đầu sử dụng phần mềm (dropdown Năm — min year).
 * SRS Vùng 2 row 6: query động `MIN(YEAR(ngay_tao))` từ entity nguồn.
 * Prototype hardcode 2024 cho mock — production sẽ query API config.
 */
export const MIN_YEAR = 2024;

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Subtitle Stock KPI (PA-Z snapshot tại `den_ngay_boundary`).
 * Luôn quy về **một mốc ngày cụ thể**, tránh user nhầm "Tháng 4/2026" là
 * khoảng (Flow) hay 1 thời điểm (Stock).
 * Quy ước:
 *   • Tháng/năm hiện tại → "Tính đến hôm nay (DD/MM/YYYY)"
 *   • Năm Y + Tháng N (đã đóng) → "Tính đến {ngày cuối tháng N}/Y"
 *   • Năm Y + Tháng = NULL (đã đóng) → "Tính đến 31/12/Y"
 */
export function buildStockBoundaryLabel(nam: number, thang: number | null): string {
  const now = new Date();
  const cy = now.getFullYear();
  const cm = now.getMonth() + 1;
  const isCurrentScope = nam === cy && (thang == null || thang === cm);
  if (isCurrentScope) {
    return `Tính đến hôm nay (${pad2(now.getDate())}/${pad2(cm)}/${cy})`;
  }
  if (thang == null) return `Tính đến 31/12/${nam}`;
  // Last day of month — `new Date(year, month, 0)` returns last day of `month`
  const lastDay = new Date(nam, thang, 0).getDate();
  return `Tính đến ${pad2(lastDay)}/${pad2(thang)}/${nam}`;
}

/** Scope hiện tại có phải quá khứ đóng không? Dùng để pause auto-refresh. */
export function isQuaKhuDong(nam: number, thang: number | null): boolean {
  const now = new Date();
  const cy = now.getFullYear();
  const cm = now.getMonth() + 1;
  if (nam < cy) return true;
  if (nam === cy && thang != null && thang < cm) return true;
  return false;
}

/**
 * Drill-down spec — build URL động tại click time với filter hiện tại
 * (SRS §F3 flowchart + FR-I-01..07 Drill-down: filter bắt buộc kèm
 * để số click xuống khớp số đếm Dashboard).
 */
export type DrillDownSpec = {
  path: string;
  static_params: Record<string, string>;
  /**
   * Sau CR 2026-04-26: Flow KPI dùng `date_field` (vd 'ngay_tao', 'ngay_tiep_nhan') để target
   * module suy ra boundary thời gian từ `nam` + `thang`. Stock KPI = null (không kèm time).
   */
  date_field: string | null;
};

export interface DrillDownFilter {
  nam: number; // bắt buộc, năm hiện tại default
  thang: number | null; // null = "Tất cả tháng" của năm
  don_vi_cap: 'DP' | 'BN';
  don_vi_id: string; // '' = Tất cả [cấp]
}

export function buildDrillDownUrl(spec: DrillDownSpec, f: DrillDownFilter): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(spec.static_params)) params.set(k, v);
  if (spec.date_field) {
    params.set('date_field', spec.date_field);
    params.set('nam', String(f.nam));
    if (f.thang != null) params.set('thang', String(f.thang));
  }
  params.set('don_vi_cap', f.don_vi_cap);
  if (f.don_vi_id) params.set('don_vi_id', f.don_vi_id);
  return `${spec.path}?${params.toString()}`;
}

/** Output chuẩn của 1 KPI widget (khớp TPL-DASH-KPI outputs) */
export type KpiWidget = {
  key: string;
  ma: string; // KPI-01..07 / KPI-S-01/02
  nhan: string;
  gia_tri: number | null; // null → "—" (UI convention)
  don_vi_tinh: string; // yêu cầu / vụ việc / khóa / người / % / ngày làm việc
  xu_huong_phan_tram: number | null; // % chênh, null = không tính được (new từ 0 / mẫu = 0)
  huong_tang_giam: TrendDir;
  drill_down: DrillDownSpec | null;
  loai: 'FLOW' | 'STOCK' | 'SUPP';
  accent?: 'brand' | 'success' | 'warn' | 'danger' | 'accent' | 'muted';
};

/** Vùng 3 — 4 KPI Hỏi đáp & Vụ việc */
export const kpiRow1: KpiWidget[] = [
  {
    key: 'kpi-01',
    ma: 'KPI-01',
    nhan: 'Hỏi đáp / vướng mắc mới',
    gia_tri: 156,
    don_vi_tinh: 'yêu cầu',
    xu_huong_phan_tram: 12.5,
    huong_tang_giam: 'TANG',
    drill_down: {
      path: '/hoi-dap/danh-sach',
      static_params: { trang_thai: 'MOI' },
      date_field: 'ngay_tao',
    },
    loai: 'FLOW',
    accent: 'brand',
  },
  {
    key: 'kpi-02',
    ma: 'KPI-02',
    nhan: 'Vụ việc đã tiếp nhận',
    gia_tri: 89,
    don_vi_tinh: 'vụ việc',
    xu_huong_phan_tram: 5.3,
    huong_tang_giam: 'TANG',
    drill_down: {
      path: '/vu-viec/danh-sach',
      static_params: {},
      date_field: 'ngay_tiep_nhan',
    },
    loai: 'FLOW',
    accent: 'brand',
  },
  {
    key: 'kpi-03',
    ma: 'KPI-03',
    nhan: 'Vụ việc đang hỗ trợ',
    gia_tri: 45,
    don_vi_tinh: 'vụ việc',
    xu_huong_phan_tram: -3.2,
    huong_tang_giam: 'GIAM',
    drill_down: {
      path: '/vu-viec/danh-sach',
      static_params: {
        trang_thai: 'DA_TIEP_NHAN,DANG_KIEM_TRA,YEU_CAU_BO_SUNG,DA_PHAN_CONG,DANG_XU_LY',
      },
      date_field: null, // STOCK — snapshot tại cuối scope (PA-Z), không kèm time filter
    },
    loai: 'STOCK',
    accent: 'warn',
  },
  {
    key: 'kpi-04',
    ma: 'KPI-04',
    nhan: 'Vụ việc đã hoàn thành',
    gia_tri: 44,
    don_vi_tinh: 'vụ việc',
    xu_huong_phan_tram: 8.0,
    huong_tang_giam: 'TANG',
    drill_down: {
      path: '/vu-viec/danh-sach',
      static_params: { trang_thai: 'HOAN_THANH' },
      date_field: 'ngay_hoan_thanh',
    },
    loai: 'FLOW',
    accent: 'success',
  },
];

/** Vùng 4 — 5 KPI Chất lượng vụ việc / TVV / Đào tạo (sau reorder).
 *  Thứ tự nghiệp vụ: chất lượng vụ việc (S-01, S-02) → người xử lý (KPI-07) → đào tạo người (KPI-05, 06). */
export const kpiRow2: KpiWidget[] = [
  {
    key: 'kpi-s-01',
    ma: 'KPI-S-01',
    nhan: 'Tỷ lệ vụ việc phải bổ sung',
    gia_tri: 18.2,
    don_vi_tinh: '%',
    xu_huong_phan_tram: -2.1,
    huong_tang_giam: 'GIAM',
    drill_down: null,
    loai: 'SUPP',
    accent: 'muted',
  },
  {
    key: 'kpi-s-02',
    ma: 'KPI-S-02',
    nhan: 'Thời gian xử lý trung bình',
    gia_tri: 4.5,
    don_vi_tinh: 'ngày làm việc',
    xu_huong_phan_tram: -6.3,
    huong_tang_giam: 'GIAM',
    drill_down: null,
    loai: 'SUPP',
    accent: 'muted',
  },
  {
    key: 'kpi-07',
    ma: 'KPI-07',
    nhan: 'Chuyên gia / Tư vấn viên đang hoạt động',
    gia_tri: 230,
    don_vi_tinh: 'người',
    xu_huong_phan_tram: 6.5,
    huong_tang_giam: 'TANG',
    drill_down: {
      path: '/chuyen-gia-tvv/danh-sach',
      static_params: { trang_thai: 'DANG_HOAT_DONG' },
      date_field: null, // STOCK PA-Z
    },
    loai: 'STOCK',
    accent: 'accent',
  },
  {
    key: 'kpi-05',
    ma: 'KPI-05',
    nhan: 'Khóa đào tạo / tập huấn đang diễn ra',
    gia_tri: 5,
    don_vi_tinh: 'khóa',
    xu_huong_phan_tram: 0,
    huong_tang_giam: 'KHONG_DOI',
    drill_down: {
      path: '/dao-tao/khoa-hoc',
      static_params: { trang_thai: 'DANG_DIEN_RA' },
      date_field: null, // STOCK PA-Z
    },
    loai: 'STOCK',
    accent: 'brand',
  },
  {
    key: 'kpi-06',
    ma: 'KPI-06',
    nhan: 'Khóa đào tạo / tập huấn đã hoàn thành',
    gia_tri: 12,
    don_vi_tinh: 'khóa',
    xu_huong_phan_tram: 20.0,
    huong_tang_giam: 'TANG',
    drill_down: {
      path: '/dao-tao/khoa-hoc',
      static_params: { trang_thai: 'DA_KET_THUC' },
      date_field: 'ngay_ket_thuc',
    },
    loai: 'FLOW',
    accent: 'success',
  },
];

/* ---------- UC8 — 2 bar chart small multiples ---------- */

export type BarPoint = {
  label: string;
  value: number;
  /** Sample size N cho bar này — hiển thị trong tooltip chart (SRS Vùng 5 hover spec) */
  n?: number;
  /** N < 10 → bar có asterisk + "Mẫu nhỏ, tham khảo" */
  small?: boolean;
};

// Default user TW: L1='DP', L2='Tất cả ĐP' → trục X = tất cả ĐP có data, sort DESC
export const chartHaiLongTheoDonVi: BarPoint[] = [
  { label: 'Sở Tư phápHà Nội', value: 86.2, n: 245 },
  { label: 'Sở Tư phápTP.HCM', value: 84.7, n: 218 },
  { label: 'Sở Tư phápĐà Nẵng', value: 82.1, n: 156 },
  { label: 'Sở Tư phápHải Phòng', value: 80.4, n: 132 },
  { label: 'Sở Tư phápCần Thơ', value: 78.9, n: 98 },
  { label: 'Sở Tư phápNghệ An', value: 76.3, n: 87 },
  { label: 'Sở Tư phápQuảng Ninh', value: 74.8, n: 72 },
  { label: 'Sở Tư phápThanh Hóa', value: 72.1, n: 65 },
  { label: 'Sở Tư phápBình Dương', value: 70.5, n: 54 },
  { label: 'Sở Tư phápĐồng Nai', value: 68.9, n: 8, small: true },
];

export const chartSlaTheoDonVi: BarPoint[] = [
  { label: 'Sở Tư phápHà Nội', value: 94.1 },
  { label: 'Sở Tư phápĐà Nẵng', value: 91.5 },
  { label: 'Sở Tư phápTP.HCM', value: 89.8 },
  { label: 'Sở Tư phápHải Phòng', value: 87.3 },
  { label: 'Sở Tư phápCần Thơ', value: 85.0 },
  { label: 'Sở Tư phápQuảng Ninh', value: 83.2 },
  { label: 'Sở Tư phápNghệ An', value: 80.7 },
  { label: 'Sở Tư phápThanh Hóa', value: 78.1 },
  { label: 'Sở Tư phápBình Dương', value: 74.6 },
  { label: 'Sở Tư phápĐồng Nai', value: 71.2, small: true },
];

// ── Variants cho verify FR-I-08 AC3-5 (chia kỳ 3-tier theo độ dài filter) ──

/** V1a: Filter ≤ 31 ngày + 1 đơn vị → trục X = các ngày (chronological) */
export const chartHaiLongByDay: BarPoint[] = [
  { label: '18/04', value: 76.2 },
  { label: '19/04', value: 78.5 },
  { label: '20/04', value: 77.1 },
  { label: '21/04', value: 81.3 },
  { label: '22/04', value: 80.7 },
  { label: '23/04', value: 79.4, small: true },
  { label: '24/04', value: 82.1 },
];

export const chartSlaByDay: BarPoint[] = [
  { label: '18/04', value: 88.0 },
  { label: '19/04', value: 90.1 },
  { label: '20/04', value: 87.5 },
  { label: '21/04', value: 91.2 },
  { label: '22/04', value: 89.8 },
  { label: '23/04', value: 86.4, small: true },
  { label: '24/04', value: 92.3 },
];

/** V1b: 1 đơn vị + Năm "Tất cả tháng" → trục X = các tháng (format MM/YYYY) */
export const chartHaiLongByMonth: BarPoint[] = [
  { label: '01/2026', value: 72.5 },
  { label: '02/2026', value: 74.1 },
  { label: '03/2026', value: 75.8 },
  { label: '04/2026', value: 77.2 },
];

export const chartSlaByMonth: BarPoint[] = [
  { label: '01/2026', value: 82.3 },
  { label: '02/2026', value: 84.7 },
  { label: '03/2026', value: 86.1 },
  { label: '04/2026', value: 85.5 },
];

/** V1c: Filter > 365 ngày → trục X = các quý */
export const chartHaiLongByQuarter: BarPoint[] = [
  { label: 'Q1/2025', value: 68.3 },
  { label: 'Q2/2025', value: 71.2 },
  { label: 'Q3/2025', value: 73.8 },
  { label: 'Q4/2025', value: 75.5 },
  { label: 'Q1/2026', value: 77.2 },
  { label: 'Q2/2026', value: 77.5 },
];

export const chartSlaByQuarter: BarPoint[] = [
  { label: 'Q1/2025', value: 78.2 },
  { label: 'Q2/2025', value: 80.5 },
  { label: 'Q3/2025', value: 82.1 },
  { label: 'Q4/2025', value: 83.8 },
  { label: 'Q1/2026', value: 85.0 },
  { label: 'Q2/2026', value: 83.6 },
];

/** V5: > 30 đơn vị → verify scroll + bar width không vỡ */
export const chartHaiLongMany: BarPoint[] = Array.from({ length: 35 }, (_, i) => ({
  label: `Sở Tư pháp ${[
    'Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nghệ An', 'Quảng Ninh',
    'Thanh Hóa', 'Bình Dương', 'Đồng Nai', 'An Giang', 'Bà Rịa-VT', 'Bắc Giang',
    'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên',
    'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Tĩnh', 'Hải Dương',
    'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa',
  ][i]}`,
  value: Math.round((85 - i * 0.4 + Math.random() * 3) * 10) / 10,
  small: i > 30,
}));

export const uc8Meta = {
  diem_hai_long_tb: 77.5,
  diem_hai_long_xu_huong: 'TANG' as TrendDir,
  diem_hai_long_delta: 2.8,
  so_luong_danh_gia: 1_470,

  ty_le_tuan_thu_sla: 83.6,
  ty_le_sla_xu_huong: 'GIAM' as TrendDir,
  ty_le_sla_delta: -1.4,
  so_luong_vu_viec_sla: 528,
};

/* ---------- UC9 — Donut + center label ---------- */

export const chartDaoTaoData = [
  { label: 'Đạt', value: 78 },
  { label: 'Không đạt', value: 22 },
];

export const uc9Meta = {
  ty_le_dat: 78,
  ty_le_dat_xu_huong: 'TANG' as TrendDir,
  ty_le_dat_phan_tram_change: 3,
  diem_tb: 7.8,
  diem_tb_xu_huong: 'TANG' as TrendDir,
  diem_tb_delta: 0.3,
  sample_size: 1_245,
};

/* ---------- Filter options ---------- */

export const capDonViOptions = [
  { label: 'Địa phương', value: 'DP' },
  { label: 'Bộ ngành', value: 'BN' },
];

export const dpOptions = [
  { label: 'Tất cả địa phương', value: '' },
  { label: 'Sở Tư pháp Hà Nội', value: 'hanoi' },
  { label: 'Sở Tư pháp TP.HCM', value: 'hcm' },
  { label: 'Sở Tư pháp Đà Nẵng', value: 'danang' },
  { label: 'Sở Tư pháp Hải Phòng', value: 'haiphong' },
  { label: 'Sở Tư pháp Cần Thơ', value: 'cantho' },
  { label: 'Sở Tư pháp Nghệ An', value: 'nghean' },
  { label: 'Sở Tư pháp Quảng Ninh', value: 'quangninh' },
  { label: 'Sở Tư pháp Thanh Hóa', value: 'thanhhoa' },
];

export const bnOptions = [
  { label: 'Tất cả bộ ngành', value: '' },
  { label: 'Bộ Tư pháp', value: 'btp' },
  { label: 'Bộ Công Thương', value: 'bct' },
  { label: 'Bộ Tài chính', value: 'btc' },
  { label: 'Bộ Kế hoạch và Đầu tư', value: 'bkhdt' },
  { label: 'Bộ Y tế', value: 'byt' },
  { label: 'Bộ Lao động - Thương binh và Xã hội', value: 'bldtbxh' },
];

