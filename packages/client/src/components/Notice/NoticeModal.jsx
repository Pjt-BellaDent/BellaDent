// NoticeModal.jsx
import React, { useState } from 'react';
import styled from '@emotion/styled';
import NoticeDetailModal from './NoticeDetailModal';

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
`;

const Title = styled.h3`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NoticeItem = styled.li`
  margin-bottom: 10px;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 60px;
  padding: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
`;

const NoticeModal = ({ show, onClose, notices, onAdd, onDelete, onSkipToday }) => {
  // 1) 상세 모달 관리를 위한 상태
  const [detailShow, setDetailShow] = useState(false);
  // 2) 상세 모달에 전달할 “선택된 공지” 객체
  const [detailNotice, setDetailNotice] = useState(null);

  // 3) 새로 추가하거나 편집하기 위한 상태
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showOnMain, setShowOnMain] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setShowOnMain(false);
    setShowForm(false);
    setEditIndex(null);
    setDetailNotice(null);
  };

  // “등록” 혹은 “편집 완료” 버튼을 눌렀을 때 호출
  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle) {
      alert('제목을 입력하세요.');
      return;
    }
    if (!trimmedBody) {
      alert('내용도 작성해 주세요.');
      return;
    }

    const newItem = {
      title: trimmedTitle,
      body: trimmedBody,
      showOnMain,
      createdAt: new Date().toISOString(),
      author: '관리자'
    };

    // “편집 모드”인 경우: 기존 배열에서 해당 인덱스를 대체
    if (editIndex !== null) {
      const updated = [...notices];
      updated[editIndex] = { ...updated[editIndex], ...newItem };
      onAdd(updated);
    } else {
      // 신규 공지 추가
      onAdd([...notices, newItem]);
    }
    resetForm();
  };

  // 상세 모달에서 “수정” 버튼을 눌렀을 때 (NoticeDetailModal로부터 호출)
  const handleStartEdit = (idx) => {
    const n = notices[idx];
    setEditIndex(idx);
    setTitle(n.title);
    setBody(n.body);
    setShowOnMain(!!n.showOnMain);
    setShowForm(true);
    setDetailShow(false);
  };

  // 상세 모달에서 “삭제” 버튼을 눌렀을 때 (NoticeDetailModal로부터 호출)
  const handleDelete = (idx) => {
    onDelete(idx);
    setDetailShow(false);
  };

  // 상세 모달을 열 때 호출
  const openDetailModal = (idx) => {
    const n = notices[idx];
    setDetailNotice({ ...n, index: idx });
    setDetailShow(true);
  };

  return (
    <>
      {/* 메인 모달 오버레이 */}
      <Overlay show={show}>
        <Container>
          <Title>📢 직원 공지사항</Title>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {/* [A] “추가/편집 폼”이 안 보일 때, 기존 공지 목록만 나열 */}
            {!showForm &&
              notices.map((n, i) => (
                <NoticeItem key={i} onClick={() => openDetailModal(i)}>
                  <strong>{n.title}</strong>
                </NoticeItem>
              ))}

            {/* [B] “폼이 보일 때”는 입력창을 보여줌 */}
            {showForm && (
              <NoticeItem>
                <Input
                  placeholder="제목 입력 (예: 6월 10일 전체 회의 안내)"
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
                  placeholder="내용 입력 (예: 회의는 오전 10시에 진행됩니다.)"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <div style={{ marginTop: '6px', fontSize: '13px' }}>
                  <label style={{ cursor: 'pointer' }}>
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
                  <button
                    onClick={handleSubmit}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '5px'
                    }}
                  >
                    {editIndex !== null ? '수정 완료' : '등록'}
                  </button>
                  <button
                    onClick={resetForm}
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '5px'
                    }}
                  >
                    취소
                  </button>
                </ButtonRow>
              </NoticeItem>
            )}
          </ul>

          {/* [C] 목록 하단 “추가” / “닫기” / “오늘은 안 보기” */}
          {!showForm && (
            <>
              <ButtonRow>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditIndex(null);
                    setTitle('');
                    setBody('');
                    setShowOnMain(false);
                  }}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '5px'
                  }}
                >
                  추가
                </button>
                <button
                  onClick={onClose}
                  style={{
                    background: '#343a40',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '5px'
                  }}
                >
                  닫기
                </button>
              </ButtonRow>
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '13px',
                  textAlign: 'right',
                  color: '#555'
                }}
              >
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked && onSkipToday) {
                        onSkipToday();
                      }
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

      {/* 상세 보기 모달 */}
      <NoticeDetailModal
        show={detailShow}
        notice={detailNotice}
        onClose={() => setDetailShow(false)}
        onEdit={handleStartEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

export default NoticeModal;
