import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { antdTheme } from './antd-theme';

export function ThemeConfigProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={antdTheme} locale={viVN}>
      {children}
    </ConfigProvider>
  );
}
