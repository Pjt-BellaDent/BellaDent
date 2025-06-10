import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useUserInfo } from '../contexts/UserInfoContext';
import NoticeModal from '../components/Notice/NoticeModal';

function DashboardFrame() {
  const { userInfo } = useUserInfo();

  const noticeRef = useRef(); // ⬅️ ref 생성
  const todayKey = new Date().toISOString().split('T')[0];

  // ✅ 처음 진입 시 자동으로 공지 표시
  useEffect(() => {
    const skipDate = sessionStorage.getItem('noticeSkipDate');
    if (skipDate !== todayKey) {
      noticeRef.current?.open(); // ref 통해 open 메서드 호출
    }
  }, []);

  setTitle('');
  setBody('');
  setEditIndex(null);
  setShowForm(false);

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

  if (!userInfo) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          role={userInfo.role}
          name={userInfo.name}
          onOpenNotice={() => setShowNotice(true)}
        />
        <main style={{ flex: 1, padding: '30px', background: '#f4f7fc' }}>
          <Outlet />
        </main>
        {showNotice && (
          <NoticeModal
            show={showNotice}
            onClose={() => {
              setShowNotice(false);
              setShowForm(false);
              setTitle('');
              setBody('');
              setEditIndex(null);
            }}
            notices={notices}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onEdit={handleEdit}
            title={title}
            setTitle={setTitle}
            body={body}
            setBody={setBody}
            showForm={showForm}
            setShowForm={setShowForm}
          />
        )}
      </div>
    </>
  );
}

export default DashboardFrame;
