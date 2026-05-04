import { Card, Typography, Empty, Skeleton, Button } from 'antd';
import { ReloadOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { useTheme } from '@/theme/antd-theme';
import { TrendIndicator } from './TrendIndicator';
import type { TrendDir } from '@/data/dashboard';

interface Props {
  data: { label: string; value: number }[];
  meta: {
    ty_le_dat: number;
    ty_le_dat_xu_huong: TrendDir;
    ty_le_dat_phan_tram_change: number;
    diem_tb: number;
    diem_tb_xu_huong: TrendDir;
    diem_tb_delta: number;
    sample_size: number;
  };
  state: 'ok' | 'loading' | 'empty' | 'error' | 'stale';
  onRetry?: () => void;
}

export function ChartDaoTao({ data, meta, state, onRetry }: Props) {
  const { tokens } = useTheme();
  const hasData = data.length > 0 && data.some((d) => d.value > 0);

  const sliceColor = (label: string): string =>
    label === 'Đạt' ? tokens.success : '#d9d9d9';

  return (
    <Card
      styles={{ body: { padding: 20 } }}
      style={{ height: '100%' }}
      title={
        <div className="flex items-center justify-between">
          <Typography.Text strong style={{ fontSize: 15, lineHeight: '22px' }}>
            Chất lượng đào tạo, bồi dưỡng pháp lý
          </Typography.Text>
          {state === 'stale' && (
            <span
              className="inline-flex items-center gap-1"
              style={{ fontSize: 11, color: tokens.warning }}
            >
              <ClockCircleOutlined /> Dữ liệu cũ
            </span>
          )}
        </div>
      }
    >
      {state === 'loading' && <Skeleton active paragraph={{ rows: 5 }} />}

      {state === 'error' && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-8"
          style={{ color: tokens.textTertiary }}
        >
          <WarningOutlined style={{ fontSize: 24, color: tokens.danger }} />
          <span>Không tải được dữ liệu</span>
          <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>
            Thử lại
          </Button>
        </div>
      )}

      {(state === 'ok' || state === 'stale') && !hasData && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có dữ liệu trong kỳ"
        />
      )}

      {(state === 'ok' || state === 'stale') && hasData && (
        // Layout: donut (260px fixed) + 2 metric block side-by-side stretch — tận dụng
        // full row width thay vì max-width 860px (gây trống nửa phải trên màn rộng).
        // Footer "Dựa trên N học viên" span full row qua col-span-full.
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-x-8 gap-y-4 items-center">
          {/* Donut chart với center label custom */}
          <div style={{ position: 'relative', height: 240 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={72}
                  outerRadius={100}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {data.map((d) => (
                    <Cell key={d.label} fill={sliceColor(d.label)} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="inside"
                    fill="#fff"
                    fontSize={13}
                    fontWeight={600}
                    formatter={(v) => {
                      const n = typeof v === 'number' ? v : Number(v);
                      // Chỉ hiện label trong slice đủ lớn (>= 15%)
                      return n >= 15 ? `${n}%` : '';
                    }}
                  />
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    const v = typeof value === 'number' ? value : Number(value);
                    return [`${v}%`, 'Tỷ lệ'];
                  }}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: `1px solid ${tokens.border}`,
                    boxShadow: '0 6px 16px 0 rgba(0,0,0,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center overlay label — format theo SRS FR-I-09 AC5: "Điểm trung bình: {X.X}/10" */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              style={{ lineHeight: 1.2 }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: tokens.textTertiary,
                  letterSpacing: '0.02em',
                  marginBottom: 4,
                }}
              >
                Điểm trung bình
              </span>
              <span
                className="tabular"
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: tokens.textPrimary,
                  letterSpacing: '-0.01em',
                }}
              >
                {meta.diem_tb.toFixed(1)}
                <span style={{ fontSize: 14, color: tokens.textTertiary, fontWeight: 500 }}>
                  /10
                </span>
              </span>
            </div>
          </div>

          {/* Metric block 1 — Tỷ lệ đạt chứng nhận */}
          <div className="flex flex-col">
            <Typography.Text
              style={{ fontSize: 12, color: tokens.textTertiary, display: 'block' }}
            >
              Tỷ lệ đạt chứng nhận
            </Typography.Text>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="tabular"
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: tokens.success,
                  lineHeight: '40px',
                }}
              >
                {meta.ty_le_dat}%
              </span>
              <TrendIndicator
                direction={meta.ty_le_dat_xu_huong}
                percent={null}
                delta={meta.ty_le_dat_phan_tram_change}
                deltaUnit="%"
              />
            </div>
            {/* Legend dots */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5"
                style={{ fontSize: 12, color: tokens.textSecondary }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: tokens.success,
                    display: 'inline-block',
                  }}
                />
                Đạt ({data.find((d) => d.label === 'Đạt')?.value}%)
              </span>
              <span
                className="inline-flex items-center gap-1.5"
                style={{ fontSize: 12, color: tokens.textSecondary }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: '#d9d9d9',
                    display: 'inline-block',
                  }}
                />
                Không đạt ({data.find((d) => d.label === 'Không đạt')?.value}%)
              </span>
            </div>
          </div>

          {/* Metric block 2 — Điểm kiểm tra trung bình */}
          <div className="flex flex-col">
            <Typography.Text
              style={{ fontSize: 12, color: tokens.textTertiary, display: 'block' }}
            >
              Điểm kiểm tra trung bình
            </Typography.Text>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="tabular"
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: tokens.textPrimary,
                  lineHeight: '40px',
                }}
              >
                {meta.diem_tb.toFixed(1)}
                <span style={{ fontSize: 14, color: tokens.textTertiary }}>/10</span>
              </span>
              <TrendIndicator
                direction={meta.diem_tb_xu_huong}
                percent={null}
                delta={meta.diem_tb_delta}
                deltaUnit="pt"
              />
            </div>
          </div>

          {/* Footer span full row — caption sample size */}
          <div
            className="md:col-span-3"
            style={{
              fontSize: 12,
              color: tokens.textTertiary,
              paddingTop: 12,
              borderTop: `1px dashed ${tokens.border}`,
            }}
          >
            Dựa trên{' '}
            <strong style={{ color: tokens.textSecondary }}>
              {meta.sample_size.toLocaleString('vi-VN')}
            </strong>{' '}
            học viên
          </div>
        </div>
      )}
    </Card>
  );
}
