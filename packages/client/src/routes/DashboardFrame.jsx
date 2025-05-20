import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';

function DashboardFrame() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '30px', background: '#f4f7fc' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardFrame;
