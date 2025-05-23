import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function DashboardFrame() {
  // ✅ 임시 로그인 사용자 정보
  const currentUser = {
    name: '최나영',
    role: 'super_admin',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ✅ name도 같이 전달 */}
      <Sidebar role={currentUser.role} name={currentUser.name} />
      <main style={{ flex: 1, padding: '30px', background: '#f4f7fc' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardFrame;
