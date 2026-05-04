import { useMemo } from 'react';
import { Card, Select, Button, Space, Typography, Divider } from 'antd';
import { UndoOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTheme } from '@/theme/antd-theme';
import { capDonViOptions, dpOptions, bnOptions, MIN_YEAR } from '@/data/dashboard';

export interface FilterState {
  /** Năm bắt buộc, từ MIN_YEAR đến năm hiện tại */
  nam: number;
  /** null = "Tất cả tháng" của năm. Khi nam=current year: chỉ ≤ tháng hiện tại */
  thang: number | null;
  don_vi_cap: 'DP' | 'BN';
  don_vi_id: string; // '' = "Tất cả [cấp]"
  locked: boolean; // user BN/ĐP
}

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  /** true nếu filter có pending change khác applied. Dùng để disable nút Áp dụng. */
  isDirty: boolean;
}

/** Default = năm hiện tại + Tháng "Tất cả" (Q2.a). */
export function defaultFilter(): { nam: number; thang: number | null } {
  return { nam: dayjs().year(), thang: null };
}

export function FilterBar({ value, onChange, onApply, onReset, isDirty }: Props) {
  const { tokens } = useTheme();

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1; // 1-12

  // Năm options: MIN_YEAR → current year (descending)
  const namOptions = useMemo(() => {
    const opts = [];
    for (let y = currentYear; y >= MIN_YEAR; y--) {
      opts.push({ label: `Năm ${y}`, value: y });
    }
    return opts;
  }, [currentYear]);

  // Tháng options — Antd Select không nhận null làm value, dùng string 'all' sentinel
  const thangOptions = useMemo(() => {
    const opts: { label: string; value: string; disabled?: boolean }[] = [
      { label: 'Tất cả', value: 'all' },
    ];
    for (let m = 1; m <= 12; m++) {
      opts.push({
        label: `Tháng ${m}`,
        value: String(m),
        disabled: value.nam === currentYear && m > currentMonth,
      });
    }
    return opts;
  }, [value.nam, currentYear, currentMonth]);

  const thangSelectValue = value.thang == null ? 'all' : String(value.thang);

  const donViL2Options = useMemo(
    () => (value.don_vi_cap === 'DP' ? dpOptions : bnOptions),
    [value.don_vi_cap],
  );

  const handleNamChange = (nam: number) => {
    // Nếu nam = current year mà thang pending > current month → reset thang về Tất cả
    let nextThang = value.thang;
    if (nam === currentYear && nextThang != null && nextThang > currentMonth) {
      nextThang = null;
    }
    onChange({ ...value, nam, thang: nextThang });
  };

  const handleCapChange = (cap: 'DP' | 'BN') => {
    onChange({ ...value, don_vi_cap: cap, don_vi_id: '' });
  };

  const sectionLabelStyle = {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: tokens.textTertiary,
    marginBottom: 6,
    display: 'block',
  };

  return (
    <Card
      size="small"
      styles={{ body: { padding: 16 } }}
      style={{ border: `1px solid ${tokens.border}` }}
    >
      <div className="flex flex-wrap items-end gap-4">
        {/* ─── PRIMARY 1 — Thời gian (Năm + Tháng) ─── */}
        <div>
          <Typography.Text style={sectionLabelStyle}>Thời gian</Typography.Text>
          <Space size={8}>
            <Select
              value={value.nam}
              options={namOptions}
              onChange={handleNamChange}
              style={{ width: 130 }}
              disabled={value.locked}
            />
            <Select
              value={thangSelectValue}
              options={thangOptions}
              onChange={(v) => onChange({ ...value, thang: v === 'all' ? null : Number(v) })}
              style={{ width: 120 }}
              disabled={value.locked}
            />
          </Space>
        </div>

        <Divider
          type="vertical"
          style={{ height: 40, borderColor: tokens.borderSubtle, margin: '0 4px' }}
        />

        {/* ─── PRIMARY 2 — Phạm vi dữ liệu ─── */}
        <div>
          <Typography.Text style={sectionLabelStyle}>Phạm vi dữ liệu</Typography.Text>
          <Space size={8}>
            <Select
              value={value.don_vi_cap}
              options={capDonViOptions}
              onChange={(v) => handleCapChange(v as 'DP' | 'BN')}
              style={{ width: 140 }}
              disabled={value.locked}
            />
            <Select
              value={value.don_vi_id}
              options={donViL2Options}
              onChange={(v) => onChange({ ...value, don_vi_id: v as string })}
              style={{ width: 240 }}
              disabled={value.locked}
              showSearch
              optionFilterProp="label"
              placeholder="Chọn đơn vị"
            />
          </Space>
        </div>

        {/* ─── Actions — phải ─── */}
        <div className="ml-auto self-end">
          <Space size={8}>
            <Button
              icon={<UndoOutlined />}
              onClick={onReset}
              type="text"
              style={{ color: tokens.textSecondary }}
              title="Reset bộ lọc về mặc định (Năm hiện tại + Tất cả tháng + Tất cả địa phương) và áp dụng ngay"
            >
              Trở về mặc định
            </Button>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={onApply}
              disabled={!isDirty}
              title={!isDirty ? 'Không có thay đổi để áp dụng' : 'Áp dụng bộ lọc'}
            >
              Áp dụng
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
}
