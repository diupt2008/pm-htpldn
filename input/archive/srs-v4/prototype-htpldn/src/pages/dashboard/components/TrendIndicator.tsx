import { Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useTheme } from '@/theme/antd-theme';
import type { TrendDir } from '@/data/dashboard';

interface Props {
  direction: TrendDir;
  /** % chênh so kỳ trước. null = kỳ trước không có data / mẫu = 0 / audit log không đủ */
  percent: number | null;
  /** Delta tuyệt đối (cho chart UC9 điểm TB). Nếu set, hiển thị thay % */
  delta?: number | null;
  deltaUnit?: '%' | 'pt' | 'ngày LV';
  size?: 'sm' | 'md';
  /** Đảo semantic: GIAM là tốt (KPI-S-01/02 giảm = chất lượng tăng) */
  invertSemantic?: boolean;
}

export function TrendIndicator({
  direction,
  percent,
  delta,
  deltaUnit = '%',
  size = 'md',
  invertSemantic = false,
}: Props) {
  const { tokens } = useTheme();

  let color = tokens.textTertiary;
  if (direction === 'TANG') {
    color = invertSemantic ? tokens.danger : tokens.success;
  } else if (direction === 'GIAM') {
    color = invertSemantic ? tokens.success : tokens.danger;
  }

  const fontSize = size === 'sm' ? 11 : 12;
  const iconSize = size === 'sm' ? 10 : 12;

  // SRS sau CR 2026-04-26: bỏ nhãn "Mới" — tất cả case NULL đều hiển thị "—"
  // + tooltip "Chưa đủ dữ liệu lịch sử để so sánh"
  if (percent === null && delta == null) {
    return (
      <Tooltip title="Chưa đủ dữ liệu lịch sử để so sánh">
        <span
          className="inline-flex items-center gap-1"
          style={{ color: tokens.textTertiary, fontSize, lineHeight: '20px', cursor: 'help' }}
        >
          —
        </span>
      </Tooltip>
    );
  }

  // KHONG_DOI dùng glyph "=" thay vì MinusOutlined để TRÁNH trùng hình với "—"
  // (placeholder cho xu_huong_phan_tram = NULL — case mẫu = 0 hoặc thiếu audit log).
  const icon =
    direction === 'TANG' ? (
      <ArrowUpOutlined style={{ fontSize: iconSize }} />
    ) : direction === 'GIAM' ? (
      <ArrowDownOutlined style={{ fontSize: iconSize }} />
    ) : (
      <span
        aria-hidden
        style={{ fontSize: iconSize + 1, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.5px' }}
      >
        =
      </span>
    );

  const value = delta != null ? delta : percent;
  const formatted =
    value == null
      ? '—'
      : deltaUnit === '%'
        ? `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
        : deltaUnit === 'pt'
          ? `${value > 0 ? '+' : ''}${value.toFixed(1)} điểm`
          : `${value > 0 ? '+' : ''}${value.toFixed(1)} ngày`;

  return (
    <span
      className="inline-flex items-center gap-1"
      style={{ color, fontSize, fontWeight: 500, lineHeight: '20px' }}
    >
      {icon}
      {formatted}
    </span>
  );
}
