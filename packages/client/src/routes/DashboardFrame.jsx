import React, {  useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import NoticeModal from '../components/modals/NoticeModal.jsx';
import { useUserInfo } from '../contexts/UserInfoContext.jsx';

function DashboardFrame() {
  const { userInfo, isLogin } = useUserInfo();

  const [showNotice, setShowNotice] = useState(false);
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = () => {
    if (!title.trim()) return alert('제목을 입력하세요.');
    const newNotice = { title: title.trim(), body: body.trim() };

    if (editIndex !== null) {
      const updated = [...notices];
      updated[editIndex] = newNotice;
      setNotices(updated);
    } else {
      setNotices([...notices, newNotice]);
    }

    setTitle('');
    setBody('');
    setEditIndex(null);
    setShowForm(false);
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
