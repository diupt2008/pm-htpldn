import type { ThemeConfig } from 'antd';

// Design tokens mapped 1-1 từ design-system/tokens.css (single theme).
// Không được sửa giá trị ở file này mà không sync với tokens.css.

const c = {
  // Brand (Ant Blue-7 family)
  primary1: '#e6f4ff',
  primary3: '#91caff',
  primary5: '#1677ff',
  primary6: '#0958d9', // PRIMARY
  primary7: '#003eb3',
  primary10: '#001448', // sidebar hero

  // Neutral (Ant Gray)
  neutral1: '#ffffff',
  neutral2: '#fafafa',
  neutral3: '#f5f5f5',
  neutral4: '#f0f0f0',
  neutral5: '#d9d9d9',
  neutral6: '#bfbfbf',
  neutral7: '#8c8c8c',
  neutral8: '#595959',
  neutral9: '#434343',
  neutral10: '#262626',
  neutral11: '#1f1f1f',

  // Accent (Gold)
  accent1: '#fffbe6',
  accent3: '#ffe58f',
  accent5: '#faad14',
  accent7: '#d48806',

  // Semantic
  success1: '#f6ffed',
  success5: '#52c41a',
  success6: '#389e0d',
  success7: '#237804',
  warn1: '#fffbe6',
  warn5: '#faad14',
  warn6: '#d48806',
  warn7: '#ad6800',
  danger1: '#fff2f0',
  danger5: '#ff4d4f',
  danger6: '#f5222d',
  danger7: '#cf1322',
  info6: '#0958d9',
};

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: c.primary6,
    colorSuccess: c.success6,
    colorWarning: c.warn6,
    colorError: c.danger6,
    colorInfo: c.info6,

    fontFamily: '"Be Vietnam Pro", "Segoe UI", -apple-system, system-ui, sans-serif',
    fontSize: 14,
    lineHeight: 22 / 14,

    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    controlHeight: 32,
    controlHeightSM: 24,
    controlHeightLG: 40,

    colorText: c.neutral11,
    colorTextSecondary: c.neutral8,
    colorTextTertiary: c.neutral7,
    colorTextQuaternary: c.neutral6,
    colorBorder: c.neutral5,
    colorBorderSecondary: c.neutral4,
    colorBgContainer: c.neutral1,
    colorBgElevated: c.neutral1,
    colorBgLayout: c.neutral3,
    colorSplit: c.neutral4,

    boxShadow:
      '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
    boxShadowTertiary:
      '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
  },
  components: {
    Layout: {
      siderBg: c.primary10,
      headerBg: c.neutral1,
      bodyBg: c.neutral3,
      headerHeight: 56,
      headerPadding: '0 16px',
    },
    Menu: {
      darkItemBg: c.primary10,
      darkSubMenuItemBg: c.primary10,
      darkItemSelectedBg: c.primary7,
      darkItemColor: 'rgba(255,255,255,0.72)',
      darkItemSelectedColor: '#ffffff',
      darkItemHoverColor: 'rgba(255,255,255,0.92)',
      darkItemHoverBg: 'rgba(255,255,255,0.04)',
      itemHeight: 36,
      iconSize: 16,
    },
    Button: {
      fontWeight: 400,
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none',
    },
    Card: {
      headerBg: 'transparent',
      paddingLG: 20,
      borderRadiusLG: 8,
    },
    Table: {
      headerBg: c.neutral2,
      headerColor: c.neutral10,
      rowHoverBg: c.neutral2,
      borderColor: c.neutral4,
    },
    Input: { paddingInline: 11 },
    Select: { optionSelectedBg: c.primary1, optionActiveBg: c.neutral3 },
    DatePicker: {},
    Tabs: {
      inkBarColor: c.primary6,
      itemSelectedColor: c.primary6,
      itemHoverColor: c.primary5,
      colorBorderSecondary: c.neutral5,
    },
    Tag: { defaultBg: c.neutral3, defaultColor: c.neutral9 },
    Breadcrumb: {
      separatorColor: c.neutral6,
      linkColor: c.neutral8,
      linkHoverColor: c.primary6,
      lastItemColor: c.neutral10,
    },
    Alert: {},
    Statistic: { contentFontSize: 30, titleFontSize: 14 },
    Skeleton: { color: c.neutral3, colorGradientEnd: c.neutral4 },
    Radio: { buttonSolidCheckedBg: c.primary6, buttonBg: c.neutral1 },
  },
};

// Semantic tokens cho inline styles (ngoài antd components).
// Dùng qua useTheme() — KHÔNG hardcode hex trong page components.
export const tokens = {
  textPrimary: c.neutral11,
  textSecondary: c.neutral8,
  textTertiary: c.neutral7,
  textQuaternary: c.neutral6,
  border: c.neutral5,
  borderSubtle: c.neutral4,
  bgElevated: c.neutral1,
  bgLayout: c.neutral3,
  bgSubtle: c.neutral2,

  brand: c.primary6,
  brandHover: c.primary5,
  brandActive: c.primary7,
  brandLight: c.primary1,
  brandDark: c.primary10,
  accent: c.accent5,
  accentDark: c.accent7,
  accentLight: c.accent1,

  success: c.success6,
  successLight: c.success1,
  warning: c.warn6,
  warningLight: c.warn1,
  danger: c.danger6,
  dangerLight: c.danger1,
  info: c.info6,

  // Status pill tints — map --state-*
  status: {
    draft: { bg: '#f0f0f0', fg: c.neutral8 },
    pending: { bg: '#fffbe6', fg: c.warn7 },
    review: { bg: c.primary1, fg: c.primary6 },
    active: { bg: c.success1, fg: c.success6 },
    reject: { bg: c.danger1, fg: c.danger7 },
    closed: { bg: c.neutral2, fg: c.neutral7 },
  },

  // Chart tokens
  chartAxisLabel: c.neutral8,
  chartGridStroke: c.neutral4,
  chartLabelFill: c.neutral9,
  chartColors: {
    primary: c.primary6,
    accent: c.accent5,
    success: c.success6,
    danger: c.danger6,
    warn: c.warn5,
    neutral: c.neutral5,
  },
};

export type Tokens = typeof tokens;

export function useTheme() {
  return { tokens };
}
