import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NoticeWrapper from '../components/Notice/NoticeWrapper';

function DashboardFrame() {
  // ✅ 임시 로그인 사용자 정보
  const currentUser = {
    name: '최나영',
    role: 'super_admin',
  };

  const noticeRef = useRef(); // ⬅️ ref 생성
  const todayKey = new Date().toISOString().split('T')[0];

  // ✅ 처음 진입 시 자동으로 공지 표시
  useEffect(() => {
    const skipDate = sessionStorage.getItem('noticeSkipDate');
    if (skipDate !== todayKey) {
      noticeRef.current?.open(); // ref 통해 open 메서드 호출
    }
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        role={currentUser.role}
        name={currentUser.name}
        onOpenNotice={() => noticeRef.current?.open()} // ⬅️ 사이드바에서 수동 호출
      />
      <main style={{ flex: 1, padding: '30px', background: '#f4f7fc' }}>
        <Outlet />
      </main>

      <NoticeWrapper ref={noticeRef} />
    </div>
  );
}

export default DashboardFrame;
  