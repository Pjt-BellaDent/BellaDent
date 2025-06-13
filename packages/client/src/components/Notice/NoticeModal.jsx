import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios'; // axios 인스턴스 사용 안 하고 직접 baseURL 지정
import { getAuth } from 'firebase/auth';
import NoticeDetailModal from './NoticeDetailModal';

// ===== 스타일 =====
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: ${({ show }) => (show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Container = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
`;

const Title = styled.h3`
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NoticeItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f9f9f9;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: none;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
`;

const Button = styled.button`
  background: ${({ color }) => color || '#007bff'};
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: ${({ color }) =>
      color === '#dc3545' ? '#c82333' :
      color === '#6c757d' ? '#5a6268' :
      '#0056b3'};
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  margin: 20px 0;
  font-size: 14px;
`;

const NoticeModal = ({ show, onClose, onSkipToday }) => {
  const [notices, setNotices] = useState([]);
  const [detailShow, setDetailShow] = useState(false);
  const [detailNotice, setDetailNotice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showOnMain, setShowOnMain] = useState(false);
  const [editId, setEditId] = useState(null);

  const baseURL = 'http://localhost:3000/api/notice';

  const fetchNotices = async () => {
    try {
      const res = await axios.get(baseURL);
      setNotices(res.data.notices || []);
    } catch (err) {
      alert('공지사항 불러오기 실패');
      setNotices([]);
    }
  };

  useEffect(() => {
    if (show) fetchNotices();
  }, [show]);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setShowOnMain(false);
    setDetailNotice(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    try {
      const user = getAuth().currentUser;
      const token = await user.getIdToken();

      const data = editId
        ? {
            title,
            content: body,
            isPublic: !!showOnMain  // ✅ boolean 강제 처리
          }
        : {
            title,
            content: body,
            authorId: user.uid,
            isPublic: !!showOnMain
          };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (editId) {
        await axios.put(`${baseURL}/${editId}`, data, config);
      } else {
        await axios.post(baseURL, data, config);
      }

      setEditId(null);
      resetForm();
      setShowForm(false);
      fetchNotices();

    } catch (err) {
      console.error('공지 저장 실패:', err.response?.data || err.message);
      alert('저장 실패');
    }
  };

  const handleDelete = async (id) => {
    try {
      const user = getAuth().currentUser;
      const token = await user.getIdToken();

      await axios.delete(`${baseURL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDetailShow(false);
      fetchNotices();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const openDetailModal = (notice) => {
    setDetailNotice(notice);
    setDetailShow(true);
  };

  const handleStartEdit = (notice) => {
    setEditId(notice.id);
    setTitle(notice.title);
    setBody(notice.content);
    setShowOnMain(Boolean(notice.isPublic));  // ✅ boolean 보장
    setShowForm(true);
    setDetailShow(false);
  };

  return (
    <>
      <Overlay show={show} onClick={onClose}>
        <Container onClick={(e) => e.stopPropagation()}>
          <Title>📢 직원 공지사항</Title>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {!showForm && (
              <>
                {Array.isArray(notices) && notices.length > 0 ? (
                  notices.map((n) => (
                    <NoticeItem key={n.id} onClick={() => openDetailModal(n)}>
                      <strong>{n.title}</strong>
                    </NoticeItem>
                  ))
                ) : (
                  <EmptyMessage>공지사항이 없습니다.</EmptyMessage>
                )}
              </>
            )}

            {showForm && (
              <NoticeItem>
                <Input
                  placeholder="제목 입력"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <Textarea
                  placeholder="내용 입력"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <div style={{ marginTop: '6px', fontSize: '13px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={showOnMain}
                      onChange={(e) => setShowOnMain(e.target.checked)}
                      style={{ marginRight: '6px' }}
                    />
                    홈페이지에 표시
                  </label>
                </div>
                <ButtonRow>
                  <Button onClick={handleSubmit} color="#28a745">
                    {editId ? '수정 완료' : '등록'}
                  </Button>
                  <Button onClick={() => setShowForm(false)} color="#6c757d">
                    취소
                  </Button>
                </ButtonRow>
              </NoticeItem>
            )}
          </ul>

          {!showForm && (
            <>
              <ButtonRow>
                <Button
                  onClick={() => {
                    setEditId(null);
                    resetForm();
                    setShowForm(true);
                  }}
                >
                  추가
                </Button>
                <Button onClick={onClose} color="#343a40">닫기</Button>
              </ButtonRow>
              <div style={{ marginTop: '6px', fontSize: '13px', textAlign: 'right', color: '#555' }}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked && onSkipToday) onSkipToday();
                    }}
                    style={{ marginRight: '6px' }}
                  />
                  오늘은 다시 보지 않기
                </label>
              </div>
            </>
          )}
        </Container>
      </Overlay>

      <NoticeDetailModal
        show={detailShow}
        notice={detailNotice}
        onClose={() => setDetailShow(false)}
        onEdit={handleStartEdit}
        onDelete={() => handleDelete(detailNotice?.id)}
      />
    </>
  );
};

export default NoticeModal;