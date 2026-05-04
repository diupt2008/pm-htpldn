import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  UserSwitchOutlined,
  FileSearchOutlined,
  WalletOutlined,
  BankOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  LineChartOutlined,
  MessageOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { createElement } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

function item(
  label: string,
  key: string,
  icon?: ReturnType<typeof createElement>,
  children?: MenuItem[],
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

export const menuItems: MenuItem[] = [
  item('Tổng quan', '/dashboard', createElement(DashboardOutlined)),
  item('Hỏi đáp pháp lý', '/hoi-dap', createElement(QuestionCircleOutlined), [
    item('Quản lý hỏi đáp', '/hoi-dap/danh-sach'),
    item('Phê duyệt', '/hoi-dap/phe-duyet'),
  ]),
  item('Đào tạo, tập huấn', '/dao-tao', createElement(ReadOutlined), [
    item('Chương trình đào tạo', '/dao-tao/chuong-trinh'),
    item('Khóa học', '/dao-tao/khoa-hoc'),
    item('Giảng viên', '/dao-tao/giang-vien'),
  ]),
  item('Mạng lưới TVV', '/chuyen-gia-tvv', createElement(UserSwitchOutlined), [
    item('Danh sách TVV', '/chuyen-gia-tvv/danh-sach'),
    item('Thẩm định', '/chuyen-gia-tvv/tham-dinh'),
  ]),
  item('Vụ việc HTPL', '/vu-viec', createElement(FileSearchOutlined), [
    item('Danh sách vụ việc', '/vu-viec/danh-sach'),
    item('Phân công', '/vu-viec/phan-cong'),
  ]),
  item('Chi trả chi phí', '/chi-tra', createElement(WalletOutlined)),
  item('Doanh nghiệp', '/doanh-nghiep', createElement(BankOutlined)),
  item('Đánh giá hiệu quả', '/danh-gia', createElement(BarChartOutlined)),
  item('Biểu mẫu', '/bieu-mau', createElement(FileTextOutlined)),
  item('CT HTPLDN', '/chuong-trinh', createElement(FolderOpenOutlined)),
  item('Tư vấn', '/tu-van', createElement(MessageOutlined), [
    item('Tư vấn chuyên sâu', '/tu-van/chuyen-sau'),
    item('Tư vấn nhanh', '/tu-van/nhanh'),
  ]),
  item('Báo cáo thống kê', '/bao-cao', createElement(LineChartOutlined)),
  item('Quản trị hệ thống', '/quan-tri', createElement(SettingOutlined), [
    item('Danh mục', '/quan-tri/danh-muc'),
    item('Tài khoản', '/quan-tri/tai-khoan'),
    item('Phân quyền', '/quan-tri/phan-quyen'),
    item('Cấu hình SLA', '/quan-tri/cau-hinh-sla'),
    item('Nhật ký', '/quan-tri/nhat-ky'),
  ]),
];
