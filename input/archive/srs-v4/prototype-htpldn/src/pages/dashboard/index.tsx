import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Button, Space, Tag, Tooltip, Typography } from 'antd';
import {
  ReloadOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '@/theme/antd-theme';
import {
  kpiRow1,
  kpiRow2,
  chartHaiLongTheoDonVi,
  chartSlaTheoDonVi,
  chartHaiLongByDay,
  chartSlaByDay,
  chartHaiLongByMonth,
  chartSlaByMonth,
  chartDaoTaoData,
  uc8Meta,
  uc9Meta,
  dpOptions,
  bnOptions,
  buildStockBoundaryLabel,
  isQuaKhuDong,
  MIN_YEAR,
  type DrillDownFilter,
} from '@/data/dashboard';
import { KpiCard } from './components/KpiCard';
import { ChartHaiLong } from './components/ChartHaiLong';
import { ChartDaoTao } from './components/ChartDaoTao';
import { FilterBar, defaultFilter, type FilterState } from './components/FilterBar';

type WidgetState = 'ok' | 'loading' | 'empty' | 'error' | 'stale';

const ALL_WIDGETS = [
  'kpi-01', 'kpi-02', 'kpi-03', 'kpi-04',
  'kpi-05', 'kpi-06', 'kpi-07', 'kpi-s-01', 'kpi-s-02',
  'chart-hailong', 'chart-sla', 'chart-daotao',
] as const;
type WidgetKey = (typeof ALL_WIDGETS)[number];

const AUTO_REFRESH_MS = 60_000;

function scopeChipText(cap: 'DP' | 'BN', donViId: string): string {
  if (cap === 'DP') {
    if (!donViId) return 'Phạm vi: Tất cả địa phương';
    const match = dpOptions.find((o) => o.value === donViId);
    return `Phạm vi: ${match?.label ?? 'Địa phương'}`;
  }
  if (!donViId) return 'Phạm vi: Tất cả bộ ngành';
  const match = bnOptions.find((o) => o.value === donViId);
  return `Phạm vi: ${match?.label ?? 'Bộ ngành'}`;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const { tokens } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // ─── Filter state — lazy init từ URL, validate fallback default theo SRS ───
  // SRS quy tắc tương tác #6: URL params không hợp lệ → silently fallback default
  const initialFilter = useMemo<FilterState>(() => {
    const cap = (searchParams.get('cap') as 'DP' | 'BN') || 'DP';
    const donViId = searchParams.get('don_vi') || '';
    const namStr = searchParams.get('nam');
    const thangStr = searchParams.get('thang');
    const fb = defaultFilter();
    const currentYear = new Date().getFullYear();
    let nam = fb.nam;
    if (namStr) {
      const n = Number(namStr);
      if (Number.isInteger(n) && n >= MIN_YEAR && n <= currentYear) nam = n;
    }
    let thang: number | null = fb.thang;
    if (thangStr) {
      const m = Number(thangStr);
      if (Number.isInteger(m) && m >= 1 && m <= 12) thang = m;
    }
    return { nam, thang, don_vi_cap: cap, don_vi_id: donViId, locked: false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chỉ tính 1 lần tại mount

  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(initialFilter);

  // ─── Widget states (semantic 26-29) ─────────────────────────────────────────
  const [widgetStates, setWidgetStates] = useState<Record<WidgetKey, WidgetState>>(() =>
    Object.fromEntries(ALL_WIDGETS.map((k) => [k, 'ok'])) as Record<WidgetKey, WidgetState>,
  );

  // ─── Refresh bookkeeping ───────────────────────────────────────────────────
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Banner retry counter — SRS Trạng thái 30: sau N=3 chu kỳ liên tiếp banner ─
  // không cải thiện → kèm dòng phụ "Đã thử lại N lần... Liên hệ quản trị viên..."
  const [bannerRetryCount, setBannerRetryCount] = useState(0);
  const BANNER_RETRY_THRESHOLD = 3;

  // ─── Chart data switch theo filter applied (SRS FR-I-08 Processing bước 4) ─
  // • don_vi_id = '' (Tất cả) → compare units, trục X = các đơn vị
  // • don_vi_id ≠ '' + thang ≠ null → time series, trục X = các ngày trong tháng
  // • don_vi_id ≠ '' + thang = null → time series, trục X = 12 tháng của năm
  const uc8DataLeft = useMemo(() => {
    if (appliedFilter.don_vi_id === '') return chartHaiLongTheoDonVi;
    return appliedFilter.thang != null ? chartHaiLongByDay : chartHaiLongByMonth;
  }, [appliedFilter.don_vi_id, appliedFilter.thang]);
  const uc8DataRight = useMemo(() => {
    if (appliedFilter.don_vi_id === '') return chartSlaTheoDonVi;
    return appliedFilter.thang != null ? chartSlaByDay : chartSlaByMonth;
  }, [appliedFilter.don_vi_id, appliedFilter.thang]);
  const uc9DataScenario = chartDaoTaoData;

  // ─── Derived: banner khi ≥50% fail ────────────────────────────────────────
  const failCount = ALL_WIDGETS.filter(
    (k) => widgetStates[k] === 'error' || widgetStates[k] === 'stale',
  ).length;
  const showGlobalBanner = failCount >= Math.ceil(ALL_WIDGETS.length / 2);
  const showRetryExhaustion = bannerRetryCount >= BANNER_RETRY_THRESHOLD;

  // ─── Auto-refresh paused khi scope = quá khứ đóng (FR-I-CROSS-02 bước 3) ──
  const autoRefreshPaused = useMemo(
    () => isQuaKhuDong(appliedFilter.nam, appliedFilter.thang),
    [appliedFilter.nam, appliedFilter.thang],
  );

  // ─── URL sync — theo applied state ────────────────────────────────────────
  useEffect(() => {
    const p = new URLSearchParams();
    p.set('nam', String(appliedFilter.nam));
    if (appliedFilter.thang != null) p.set('thang', String(appliedFilter.thang));
    if (appliedFilter.don_vi_cap !== 'DP') p.set('cap', appliedFilter.don_vi_cap);
    if (appliedFilter.don_vi_id) p.set('don_vi', appliedFilter.don_vi_id);
    setSearchParams(p, { replace: true });
  }, [appliedFilter, setSearchParams]);

  // ─── Load simulation ───────────────────────────────────────────────────────
  const performLoad = useCallback(
    (isManual: boolean) => {
      setIsRefreshing(true);
      setWidgetStates(
        Object.fromEntries(ALL_WIDGETS.map((k) => [k, 'loading'])) as Record<WidgetKey, WidgetState>,
      );

      const delay = isManual ? 600 : 400;
      setTimeout(() => {
        const now = new Date();
        const nextStates = Object.fromEntries(
          ALL_WIDGETS.map((k) => [k, 'ok']),
        ) as Record<WidgetKey, WidgetState>;
        setWidgetStates(nextStates);
        setLastUpdated(now);
        setIsRefreshing(false);

        // Banner retry counter — reset on success
        setBannerRetryCount(0);
      }, delay);
    },
    [],
  );

  // ─── Auto-refresh 60s — pause khi scope quá khứ đóng (FR-I-CROSS-02) ─────
  const scheduleAutoRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (autoRefreshPaused) return; // pause khi scope đóng
    refreshTimerRef.current = setTimeout(() => {
      if (!document.hidden) performLoad(false);
      scheduleAutoRefresh();
    }, AUTO_REFRESH_MS);
  }, [performLoad, autoRefreshPaused]);

  useEffect(() => {
    scheduleAutoRefresh();
    const handleVisible = () => {
      if (!document.hidden && !autoRefreshPaused) {
        performLoad(false);
        scheduleAutoRefresh();
      }
    };
    document.addEventListener('visibilitychange', handleVisible);
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      document.removeEventListener('visibilitychange', handleVisible);
    };
  }, [scheduleAutoRefresh, performLoad, autoRefreshPaused]);

  const handleManualRefresh = () => performLoad(true);

  const handleWidgetRetry = (k: WidgetKey) => {
    setWidgetStates((prev) => ({ ...prev, [k]: 'loading' }));
    setTimeout(() => {
      setWidgetStates((prev) => ({ ...prev, [k]: 'ok' }));
    }, 500);
  };

  const handleGlobalRetry = () => {
    performLoad(true);
  };

  const handleApplyFilter = () => {
    setAppliedFilter(filter);
    performLoad(true);
  };

  const handleResetFilter = () => {
    const fb = defaultFilter();
    const next: FilterState = {
      nam: fb.nam,
      thang: fb.thang,
      don_vi_cap: 'DP',
      don_vi_id: '',
      locked: false,
    };
    setFilter(next);
    setAppliedFilter(next);
    performLoad(true);
  };

  // isDirty: filter pending khác applied → nút Áp dụng active
  const isDirty = useMemo(
    () =>
      filter.nam !== appliedFilter.nam ||
      filter.thang !== appliedFilter.thang ||
      filter.don_vi_cap !== appliedFilter.don_vi_cap ||
      filter.don_vi_id !== appliedFilter.don_vi_id,
    [filter, appliedFilter],
  );

  // Drill-down filter — applied state, không pending
  const drillDownFilter = useMemo<DrillDownFilter>(
    () => ({
      nam: appliedFilter.nam,
      thang: appliedFilter.thang,
      don_vi_cap: appliedFilter.don_vi_cap,
      don_vi_id: appliedFilter.don_vi_id,
    }),
    [appliedFilter],
  );

  const scopeText = useMemo(
    () => scopeChipText(appliedFilter.don_vi_cap, appliedFilter.don_vi_id),
    [appliedFilter.don_vi_cap, appliedFilter.don_vi_id],
  );

  // Subtitle Stock KPI — quy về 1 mốc ngày cụ thể (PA-Z snapshot)
  const stockBoundaryLabel = useMemo(
    () => buildStockBoundaryLabel(appliedFilter.nam, appliedFilter.thang),
    [appliedFilter.nam, appliedFilter.thang],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Global fail banner (component #30) ─── */}
      {showGlobalBanner && (
        <Alert
          className="global-fail-banner"
          type="error"
          showIcon
          message="Không tải được dữ liệu"
          description={
            showRetryExhaustion
              ? `Đã thử lại ${bannerRetryCount} lần không thành công. Liên hệ quản trị viên nếu vấn đề tiếp diễn.`
              : undefined
          }
          action={
            <Button size="small" type="primary" danger icon={<ReloadOutlined />} onClick={handleGlobalRetry}>
              Tải lại
            </Button>
          }
        />
      )}

      {/* ─── Vùng 1: Tiêu đề & công cụ ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Typography.Title level={3} style={{ margin: 0, fontSize: 22, lineHeight: '30px' }}>
            Tổng quan hệ thống
          </Typography.Title>
          {(() => {
            const TRUNCATE_AT = 25;
            const display =
              scopeText.length > TRUNCATE_AT ? `${scopeText.slice(0, TRUNCATE_AT)}…` : scopeText;
            const tag = (
              <Tag
                icon={<EnvironmentOutlined />}
                color="blue"
                bordered={false}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  background: tokens.brandLight,
                  color: tokens.brand,
                  padding: '2px 10px',
                  maxWidth: '100%',
                }}
              >
                {display}
              </Tag>
            );
            // SRS Vùng 1 row 5: text > 25 ký tự → truncate + tooltip full name
            return scopeText.length > TRUNCATE_AT ? <Tooltip title={scopeText}>{tag}</Tooltip> : tag;
          })()}
        </div>

        {/* SRS FR-I-CROSS-02 bước 3 (CR 2026-04-26): scope quá khứ đóng → ẨN HOÀN TOÀN
            cả nhãn timestamp lẫn nút Làm mới. User đã chủ động chọn kỳ đóng → tự hiểu data
            không cập nhật, không cần state-message thừa. */}
        {!autoRefreshPaused && (
          <Space size="middle" wrap>
            <Tooltip title="Lần tải dữ liệu gần nhất">
              <Typography.Text
                type="secondary"
                style={{ fontSize: 12 }}
                className="inline-flex items-center gap-1"
              >
                <ClockCircleOutlined />
                Cập nhật lúc {formatTime(lastUpdated)}
              </Typography.Text>
            </Tooltip>
            <Button
              icon={<ReloadOutlined spin={isRefreshing} />}
              onClick={handleManualRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Đang tải' : 'Làm mới'}
            </Button>
          </Space>
        )}
      </div>

      {/* ─── Vùng 2: Bộ lọc ─── */}
      <FilterBar
        value={filter}
        onChange={setFilter}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        isDirty={isDirty}
      />

      {/* ─── Vùng 3: 4 KPI Hỏi đáp & Vụ việc ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiRow1.map((kpi) => (
          <KpiCard
            key={kpi.key}
            data={kpi}
            filter={drillDownFilter}
            stockBoundaryLabel={stockBoundaryLabel}
            state={widgetStates[kpi.key as WidgetKey]}
            onRetry={() => handleWidgetRetry(kpi.key as WidgetKey)}
          />
        ))}
      </div>

      {/* ─── Vùng 4: 3 KPI Đào tạo/TVV + 2 KPI bổ sung ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiRow2.map((kpi) => (
          <KpiCard
            key={kpi.key}
            data={kpi}
            filter={drillDownFilter}
            stockBoundaryLabel={stockBoundaryLabel}
            state={widgetStates[kpi.key as WidgetKey]}
            onRetry={() => handleWidgetRetry(kpi.key as WidgetKey)}
          />
        ))}
      </div>

      {/* ─── Vùng 5: Biểu đồ phân tích ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartHaiLong
          title="Điểm đánh giá hiệu quả hỗ trợ pháp lý"
          data={uc8DataLeft}
          yMin={50}
          yMax={100}
          unit="điểm"
          summary={uc8Meta.diem_hai_long_tb}
          summaryFormat="score"
          trendDir={uc8Meta.diem_hai_long_xu_huong}
          trendDelta={uc8Meta.diem_hai_long_delta}
          sampleSize={uc8Meta.so_luong_danh_gia}
          sampleLabel="đánh giá"
          state={widgetStates['chart-hailong']}
          onRetry={() => handleWidgetRetry('chart-hailong')}
        />
        <ChartHaiLong
          title="Tỷ lệ tuân thủ thời hạn xử lý"
          data={uc8DataRight}
          yMin={65}
          yMax={100}
          unit="%"
          summary={uc8Meta.ty_le_tuan_thu_sla}
          summaryFormat="percent"
          trendDir={uc8Meta.ty_le_sla_xu_huong}
          trendDelta={uc8Meta.ty_le_sla_delta}
          sampleSize={uc8Meta.so_luong_vu_viec_sla}
          sampleLabel="vụ việc"
          samplePrefix="Tính trên"
          state={widgetStates['chart-sla']}
          onRetry={() => handleWidgetRetry('chart-sla')}
        />
      </div>

      <ChartDaoTao
        data={uc9DataScenario}
        meta={uc9Meta}
        state={widgetStates['chart-daotao']}
        onRetry={() => handleWidgetRetry('chart-daotao')}
      />

    </div>
  );
}
