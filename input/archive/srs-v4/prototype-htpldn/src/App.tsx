import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Empty, Typography } from 'antd';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/dashboard';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<PlaceholderPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function PlaceholderPage() {
  const location = useLocation();
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null} />
      <Typography.Title level={4} style={{ margin: 0 }}>
        Trang đang được xây dựng
      </Typography.Title>
      <Typography.Text type="secondary">
        Route: <code>{location.pathname}</code>
      </Typography.Text>
    </div>
  );
}
