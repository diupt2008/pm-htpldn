import { Card, Skeleton, Button, Typography, Tooltip } from 'antd';
import { ReloadOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/theme/antd-theme';
import { TrendIndicator } from './TrendIndicator';
import { buildDrillDownUrl, type DrillDownFilter, type KpiWidget } from '@/data/dashboard';

interface Props {
  data: KpiWidget;
  filter: DrillDownFilter;
  /** Subtitle Stock KPI dạng "Tính đến DD/MM/YYYY" — báo rõ đây là 1 mốc snapshot (PA-Z), không phải khoảng */
  stockBoundaryLabel: string;
  state: 'ok' | 'loading' | 'empty' | 'error' | 'stale';
  onRetry?: () => void;
}

/**
 * Format số theo SRS Section 3 cấu trúc thẻ KPI:
 * • N < 1.000 → nguyên ("156")
 * • 1.000 ≤ N < 1.000.000 → dấu chấm hàng ngàn ("12.345")
 * • N ≥ 1.000.000 → rút gọn "1,2M" / "12,5M"
 */
function formatKpiValue(value: number, donViTinh: string): { display: string; tooltip?: string } {
  if (donViTinh === '%') {
    return { display: `${value.toFixed(1)}%` };
  }
  if (value >= 1_000_000) {
    const m = (value / 1_000_000).toFixed(1).replace('.', ',');
    return { display: `${m}M`, tooltip: value.toLocaleString('vi-VN') };
  }
  // Số <1M dùng locale vi-VN (dấu chấm hàng ngàn)
  return { display: value.toLocaleString('vi-VN') };
}

export function KpiCard({ data, filter, stockBoundaryLabel, state, onRetry }: Props) {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const drillDownUrl = data.drill_down ? buildDrillDownUrl(data.drill_down, filter) : null;

  const accentClass =
    data.accent === 'success'
      ? 'kpi-success'
      : data.accent === 'warn'
        ? 'kpi-warn'
        : data.accent === 'danger'
          ? 'kpi-danger'
          : data.accent === 'accent'
            ? 'kpi-accent'
            : data.accent === 'muted'
              ? 'kpi-muted'
              : '';

  const isClickable = state === 'ok' && !!drillDownUrl && data.gia_tri != null && data.gia_tri > 0;
  const handleClick = () => {
    if (isClickable && drillDownUrl) navigate(drillDownUrl);
  };

  const cardClass = `kpi-card ${accentClass} ${isClickable ? 'kpi-clickable' : ''}`;

  // ─── LOADING state (T26) ───────────────────────────
  if (state === 'loading') {
    return (
      <Card className={cardClass} style={{ minHeight: 140 }}>
        <div className="flex flex-col gap-3">
          <Skeleton.Input active size="small" style={{ width: 140, height: 18 }} />
          <Skeleton.Input active size="large" style={{ width: 100, height: 36 }} />
          <Skeleton.Input active size="small" style={{ width: 80, height: 16 }} />
        </div>
      </Card>
    );
  }

  // ─── ERROR state — T28 (first load fail) ────────────
  if (state === 'error') {
    return (
      <Card className={cardClass} style={{ minHeight: 140 }}>
        <div className="flex flex-col h-full justify-between">
          <Typography.Text style={{ color: tokens.textSecondary, fontSize: 14 }}>
            {data.nhan}
          </Typography.Text>
          <div className="flex items-center gap-2" style={{ color: tokens.danger }}>
            <WarningOutlined />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Không tải được dữ liệu</span>
          </div>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={onRetry}
            style={{ width: 'fit-content' }}
          >
            Thử lại
          </Button>
        </div>
      </Card>
    );
  }

  const isEmpty = state === 'empty' || data.gia_tri === 0;
  const isNullValue = data.gia_tri == null;
  const isStock = data.loai === 'STOCK';

  // ─── OK / STALE render ──────────────────────────────
  const valueColor = isEmpty || isNullValue ? tokens.textTertiary : tokens.textPrimary;
  const formatted =
    data.gia_tri == null ? { display: '—' } : formatKpiValue(data.gia_tri, data.don_vi_tinh);

  return (
    <Card
      className={cardClass}
      style={{ minHeight: 140 }}
      styles={{ body: { padding: 20, height: '100%', display: 'flex', flexDirection: 'column' } }}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-2 h-full">
        <Typography.Text
          style={{ color: tokens.textSecondary, fontSize: 14, lineHeight: '22px' }}
          title={data.ma}
        >
          {data.nhan}
        </Typography.Text>

        {/* Subtitle slot — render LUÔN cho mọi card để align consistent trong cùng row.
            Stock: hiển thị mốc "Tính đến DD/MM/YYYY" (PA-Z snapshot).
            Flow: render NBSP placeholder giữ height — tránh giá trị bị đẩy lên cao hơn
            các card Stock cùng hàng. */}
        <Typography.Text
          aria-hidden={!isStock}
          style={{ color: tokens.textTertiary, fontSize: 11, lineHeight: '16px', fontStyle: 'italic' }}
        >
          {isStock ? stockBoundaryLabel : '\u00A0'}
        </Typography.Text>

        {/* Giá trị chính */}
        <div>
          {formatted.tooltip ? (
            <Tooltip title={formatted.tooltip}>
              <span
                className="tabular"
                style={{
                  fontSize: 30,
                  fontWeight: 600,
                  lineHeight: '38px',
                  color: valueColor,
                  letterSpacing: '-0.01em',
                  cursor: 'help',
                }}
              >
                {formatted.display}
              </span>
            </Tooltip>
          ) : (
            <span
              className="tabular"
              style={{
                fontSize: 30,
                fontWeight: 600,
                lineHeight: '38px',
                color: valueColor,
                letterSpacing: '-0.01em',
              }}
            >
              {formatted.display}
            </span>
          )}
          {!isNullValue && data.don_vi_tinh !== '%' && (
            <span style={{ fontSize: 13, color: tokens.textTertiary, marginLeft: 6 }}>
              {data.don_vi_tinh}
            </span>
          )}
        </div>

        {/* Trend hoặc Empty text */}
        <div
          className="flex items-center justify-between"
          style={{
            paddingTop: 8,
            marginTop: 'auto',
            borderTop: `1px dashed ${tokens.border}`,
            fontSize: 12,
            color: tokens.textTertiary,
            lineHeight: '20px',
            minHeight: 28,
          }}
        >
          {isEmpty || isNullValue ? (
            <span style={{ fontStyle: 'italic' }}>Chưa có dữ liệu trong kỳ</span>
          ) : (
            <TrendIndicator
              direction={data.huong_tang_giam}
              percent={data.xu_huong_phan_tram}
              size="sm"
              invertSemantic={data.ma === 'KPI-S-01' || data.ma === 'KPI-S-02'}
            />
          )}
          {!(isEmpty || isNullValue) && <span>so kỳ trước</span>}
        </div>

        {/* Stale badge — T29: bỏ timestamp + bỏ nút retry (SRS sau CR 2026-04-26) */}
        {state === 'stale' && (
          <div
            className="flex items-center gap-1"
            style={{
              fontSize: 11,
              color: tokens.warning,
              background: tokens.warningLight,
              padding: '4px 8px',
              borderRadius: 4,
              marginTop: 4,
            }}
          >
            <ClockCircleOutlined />
            <span>Dữ liệu cũ</span>
          </div>
        )}
      </div>
    </Card>
  );
}
