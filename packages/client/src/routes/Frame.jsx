// Frame.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Sidebar from '../components/Sidebar';
import NoticeModal from '../components/Notice/NoticeModal';

function Frame() {
  const [showNotice, setShowNotice] = useState(false);
  const [notices, setNotices] = useState([
    '✅ 5월 20일 전 직원 회의 예정',
    '🦷 신규 장비 설치 일정: 5월 22일',
  ]);
  const [newNotice, setNewNotice] = useState('');

  const handleAdd = () => {
    const text = newNotice.trim();
    if (!text) return alert('공지사항을 입력하세요.');
    setNotices([...notices, `🆕 ${text}`]);
    setNewNotice('');
  };

  const handleDelete = (index) => {
    setNotices(notices.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flexGrow: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </div>

      {showNotice && (
        <NoticeModal
          show={showNotice}
          onClose={() => setShowNotice(false)}
          notices={notices}
          newNotice={newNotice}
          setNewNotice={setNewNotice}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Frame;
