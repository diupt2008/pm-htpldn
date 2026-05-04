import { useMemo } from 'react';
import { Card, Typography, Empty, Skeleton, Button } from 'antd';
import { ReloadOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { useTheme } from '@/theme/antd-theme';
import { TrendIndicator } from './TrendIndicator';
import type { BarPoint, TrendDir } from '@/data/dashboard';

interface Props {
  title: string;
  data: BarPoint[];
  yMin?: number;
  yMax: number;
  unit: '%' | 'điểm';
  summary: number;
  summaryFormat: 'percent' | 'score';
  trendDir: TrendDir;
  trendDelta: number;
  sampleSize: number;
  sampleLabel: string;
  /**
   * Prefix caption mẫu. SRS §3 row 23 = "Dựa trên {N} đánh giá" (điểm hài lòng),
   * row 24 = "Tính trên {N} vụ việc" (tỷ lệ SLA). Default 'Dựa trên'.
   */
  samplePrefix?: string;
  state: 'ok' | 'loading' | 'empty' | 'error' | 'stale';
  onRetry?: () => void;
}

/** Rút "Sở Tư pháp Hà Nội" → "Hà Nội" — cấp đã biết từ chip phạm vi */
function shortenLabel(label: string): string {
  return label.replace(/^Sở Tư pháp\s+/i, '').replace(/^Bộ\s+/i, '');
}

export function ChartHaiLong({
  title,
  data,
  yMin,
  yMax,
  unit,
  summary,
  summaryFormat,
  trendDir,
  trendDelta,
  sampleSize,
  sampleLabel,
  samplePrefix = 'Dựa trên',
  state,
  onRetry,
}: Props) {
  const { tokens } = useTheme();

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        shortLabel: shortenLabel(d.label),
      })),
    [data],
  );

  // Rank-based fillOpacity (W9 — hierarchy khi > 5 categories)
  const sorted = useMemo(
    () => [...data].map((d) => d.value).sort((a, b) => b - a),
    [data],
  );
  const fillForRank = (value: number): string => {
    const rank = sorted.indexOf(value);
    if (rank === 0) return tokens.brandActive; // top-1 đậm nhất
    if (rank < 3) return tokens.brand; // top-3
    if (rank < 6) return '#4096ff'; // primary-5
    return '#91caff'; // primary-3 nhạt — bottom
  };

  const summaryText =
    summaryFormat === 'percent' ? `${summary.toFixed(1)}%` : `${summary.toFixed(1)}/100`;

  // Y axis ticks — render đẹp hơn khi zoom domain
  const yTickFormatter = (v: number) => (unit === '%' ? `${v}%` : `${v}`);

  return (
    <Card
      styles={{ body: { padding: 20 } }}
      style={{ height: '100%' }}
      title={
        <div className="flex items-center justify-between">
          <Typography.Text strong style={{ fontSize: 15, lineHeight: '22px' }}>
            {title}
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
      {/* Summary header */}
      {state !== 'loading' && state !== 'error' && (
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <span
            className="tabular"
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: tokens.textPrimary,
              lineHeight: '36px',
              letterSpacing: '-0.01em',
            }}
          >
            {summaryText}
          </span>
          <TrendIndicator
            direction={trendDir}
            percent={null}
            delta={trendDelta}
            deltaUnit={unit === '%' ? '%' : 'pt'}
          />
          <span style={{ color: tokens.textTertiary, fontSize: 12, marginLeft: 'auto' }}>
            {samplePrefix}{' '}
            <strong style={{ color: tokens.textSecondary, fontWeight: 600 }}>
              {sampleSize.toLocaleString('vi-VN')}
            </strong>{' '}
            {sampleLabel}
          </span>
        </div>
      )}

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

      {(state === 'ok' || state === 'stale') && data.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có dữ liệu trong kỳ"
        />
      )}

      {(state === 'ok' || state === 'stale') && data.length > 0 && (
        // SRS FR-I-08: scroll ngang khi tổng chiều rộng các cột vượt chiều rộng
        // container, trục Y cố định bên trái. Mỗi cột tối thiểu ~60px.
        // Wrapper width:100% + child có explicit width (chart-driven) → overflow-x kích hoạt khi chart > container.
        <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
          <div style={{ width: data.length * 60 + 60, height: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 16, left: -8, bottom: 24 }}
                barCategoryGap="22%"
              >
            <CartesianGrid
              strokeDasharray="2 3"
              vertical={false}
              stroke={tokens.chartGridStroke}
            />
            <XAxis
              dataKey="shortLabel"
              tick={{ fontSize: 11, fill: tokens.chartAxisLabel }}
              tickLine={false}
              axisLine={{ stroke: tokens.border }}
              interval={0}
              angle={-28}
              textAnchor="end"
              height={56}
            />
            <YAxis
              type="number"
              domain={[yMin ?? 0, yMax]}
              ticks={
                // Explicit ticks để tránh Recharts auto-calc số lẻ (65/74/83/92/100).
                // Chia 5 khoảng đều: yMin → yMax, step = (yMax-yMin)/5 làm tròn 5.
                yMin != null
                  ? (() => {
                      const step = Math.max(5, Math.round((yMax - yMin) / 5 / 5) * 5);
                      const arr: number[] = [];
                      for (let v = yMin; v <= yMax; v += step) arr.push(v);
                      if (arr[arr.length - 1] !== yMax) arr.push(yMax);
                      return arr;
                    })()
                  : undefined
              }
              allowDataOverflow={false}
              tick={{ fontSize: 11, fill: tokens.chartAxisLabel }}
              tickLine={false}
              axisLine={false}
              tickFormatter={yTickFormatter}
              width={42}
            />
            <Tooltip
              cursor={{ fill: tokens.bgSubtle }}
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: `1px solid ${tokens.border}`,
                boxShadow: '0 6px 16px 0 rgba(0,0,0,0.08)',
              }}
              labelStyle={{ color: tokens.textSecondary, fontWeight: 500 }}
              formatter={(value, _name, item) => {
                const v = typeof value === 'number' ? value : Number(value);
                const payload = (item as { payload?: { small?: boolean; n?: number } } | undefined)?.payload;
                const isSmall = payload?.small;
                const n = payload?.n;
                // SRS Vùng 5: tooltip hover hiển thị tên + giá trị + N (sample size)
                const valueStr = `${v.toFixed(1)}${unit === '%' ? '%' : '/100'}${isSmall ? ' *' : ''}`;
                const valueWithN = n != null ? `${valueStr} (N=${n.toLocaleString('vi-VN')})` : valueStr;
                return [valueWithN, unit === '%' ? 'Tỷ lệ tuân thủ' : 'Điểm đánh giá'];
              }}
              labelFormatter={(lbl, payload) => {
                const p = payload?.[0] as { payload?: { label?: string; small?: boolean } } | undefined;
                const original = p?.payload?.label;
                const isSmall = p?.payload?.small;
                const name = original ?? String(lbl ?? '');
                if (!isSmall) return name;
                // SRS FR-I-08 edge case "Mẫu N < 10": label dùng dạng generic — không
                // hiện số N cụ thể (đảm bảo đồng nhất giữa các chart, kể cả chart không
                // có sample size per bar). Số N nếu có vẫn hiển thị tại value row `(N=...)`.
                return `${name} · Lưu ý: mẫu nhỏ (< 10 ${sampleLabel}) — kết quả tham khảo`;
              }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
              isAnimationActive={false}
              minPointSize={2}
            >
              {chartData.map((d, i) => (
                <Cell key={i} fill={fillForRank(d.value)} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                fontSize={11}
                fontWeight={500}
                fill={tokens.chartLabelFill}
                content={(props: unknown) => {
                  const p = props as {
                    x?: number; y?: number; width?: number; value?: number;
                    index?: number;
                  };
                  const x = (p.x ?? 0) + (p.width ?? 0) / 2;
                  const y = (p.y ?? 0) - 4;
                  const rec = chartData[p.index ?? -1];
                  const small = rec?.small;
                  const n = typeof p.value === 'number' ? p.value : Number(p.value ?? 0);
                  const text = `${n.toFixed(1)}${unit === '%' ? '%' : ''}${small ? ' *' : ''}`;
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={500}
                      fill={small ? tokens.warning : tokens.chartLabelFill}
                    >
                      {text}
                    </text>
                  );
                }}
              />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
}
