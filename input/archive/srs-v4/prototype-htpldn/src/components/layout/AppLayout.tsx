import { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Breadcrumb, Typography, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { menuItems } from '@/data/menu';
import { useTheme } from '@/theme/antd-theme';

const { Header, Sider, Content } = Layout;

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Tổng quan hệ thống',
  'hoi-dap': 'Hỏi đáp pháp lý',
  'dao-tao': 'Đào tạo, tập huấn',
  'chuyen-gia-tvv': 'Mạng lưới TVV',
  'vu-viec': 'Vụ việc HTPL',
  'chi-tra': 'Chi trả chi phí',
  'doanh-nghiep': 'Doanh nghiệp',
  'danh-gia': 'Đánh giá hiệu quả',
  'bieu-mau': 'Biểu mẫu',
  'chuong-trinh': 'Chương trình HTPLDN',
  'tu-van': 'Tư vấn',
  'bao-cao': 'Báo cáo thống kê',
  'quan-tri': 'Quản trị hệ thống',
  'danh-sach': 'Danh sách',
  'khoa-hoc': 'Khóa học',
  'tham-dinh': 'Thẩm định',
  'phe-duyet': 'Phê duyệt',
  'phan-cong': 'Phân công',
  'chuyen-sau': 'Tư vấn chuyên sâu',
  nhanh: 'Tư vấn nhanh',
  'cau-hinh-sla': 'Cấu hình SLA',
  'nhat-ky': 'Nhật ký',
  'tai-khoan': 'Tài khoản',
  'phan-quyen': 'Phân quyền',
  'danh-muc': 'Danh mục',
  'giang-vien': 'Giảng viên',
};

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { tokens } = useTheme();

  const segments = location.pathname.split('/').filter(Boolean);

  const breadcrumbItems = useMemo(
    () => [
      { title: 'Trang chủ', href: '/dashboard' },
      ...segments.map((seg, i) => ({
        title: breadcrumbMap[seg] || seg,
        ...(i < segments.length - 1
          ? { href: '/' + segments.slice(0, i + 1).join('/') }
          : {}),
      })),
    ],
    [segments],
  );

  const openKey = '/' + segments[0];
  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
    { key: 'password', icon: <KeyOutlined />, label: 'Đổi mật khẩu' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ];

  const siderWidth = collapsed ? 64 : 260;

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={64}
        theme="dark"
        style={{
          position: 'fixed',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          zIndex: 20,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Brand block — design-system .brand-block specimen */}
          <div className="flex-shrink-0">
            {collapsed ? (
              <div
                className="h-14 flex items-center justify-center"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    background: tokens.brand,
                    color: '#fff',
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.02em',
                  }}
                >
                  HT
                </div>
              </div>
            ) : (
              <div className="sidebar-brand">
                <span className="cq">Bộ Tư Pháp</span>
                <span className="name">Hỗ trợ pháp lý doanh nghiệp</span>
                <span className="sys">HTPLDN · v1.0</span>
              </div>
            )}
          </div>

          {/* Menu — scrollable middle */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              defaultOpenKeys={segments.length > 1 ? [openKey] : []}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
              style={{ borderInlineEnd: 'none', background: tokens.brandDark }}
            />
          </div>

          {/* Footer — version */}
          <div
            className="flex-shrink-0 px-4 py-3 text-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Typography.Text
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.04em' }}
            >
              {collapsed ? 'v1.0' : 'Bộ Tư Pháp · Cục BLDS&KT'}
            </Typography.Text>
          </div>
        </div>
      </Sider>

      <Layout style={{ marginInlineStart: siderWidth, transition: 'margin-inline-start 200ms cubic-bezier(0.215, 0.61, 0.355, 1)' }}>
        <Header
          className="px-4 flex items-center justify-between sticky top-0 z-10"
          style={{
            background: tokens.bgElevated,
            borderBottom: `1px solid ${tokens.border}`,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Breadcrumb items={breadcrumbItems} />
          </Space>

          <Space size="middle">
            <Typography.Text
              style={{ color: tokens.textTertiary, fontSize: 12 }}
              className="hidden lg:inline"
            >
              BTP · Cục BLDS&KT · CB Nghiệp vụ TW
            </Typography.Text>

            <Badge count={5} size="small" color={tokens.brand}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer">
                <Avatar
                  size="small"
                  style={{ background: tokens.brand, color: '#fff', fontWeight: 600 }}
                >
                  NA
                </Avatar>
                <span
                  style={{ color: tokens.textSecondary, fontSize: 13, fontWeight: 500 }}
                  className="hidden lg:inline"
                >
                  Nguyễn Văn A
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
