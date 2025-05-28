import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NoticeModal from '../components/Notice/NoticeModal';

function DashboardFrame() {
  // ✅ 임시 로그인 사용자 정보
  const currentUser = {
    name: '최나영',
    role: 'super_admin',
  };

  const [showNotice, setShowNotice] = useState(false);
  const [notices, setNotices] = useState([]);

  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const skipDate = sessionStorage.getItem('noticeSkipDate');
    if (skipDate !== todayKey) {
      setShowNotice(true);
    }
  }, []);

  const handleDoNotShowToday = () => {
    sessionStorage.setItem('noticeSkipDate', todayKey);
    setShowNotice(false);
  };


  const handleAdd = (newList) => {
    setNotices(newList); // NoticeModal에서 새 목록 전체를 전달받음
  };

  const handleDelete = (idx) => {
    setNotices(notices.filter((_, i) => i !== idx));
  };

  const handleEdit = (idx) => {
    const item = notices[idx];
    setTitle(item.title);
    setBody(item.body);
    setEditIndex(idx);
    setShowForm(true);
  };

 return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        role={currentUser.role}
        name={currentUser.name}
        onOpenNotice={() => setShowNotice(true)}
      />
      <main style={{ flex: 1, padding: '30px', background: '#f4f7fc' }}>
        <Outlet />
      </main>
      {showNotice && (
        <NoticeModal
          show={showNotice}
          onClose={() => setShowNotice(false)}
          notices={notices}
          onAdd={(newList) => setNotices(newList)}
          onDelete={(idx) => setNotices(notices.filter((_, i) => i !== idx))}
          onSkipToday={handleDoNotShowToday}
        />
      )}
    </div>
  );
}

export default DashboardFrame;
