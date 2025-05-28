import React, { useState } from 'react';
import styled from '@emotion/styled';

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
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setEditIndex(null);
    setShowForm(false);
    setSelectedIndex(null);
  };

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

  const newItem = { title: trimmedTitle, body: trimmedBody };

  if (editIndex !== null) {
    const updated = [...notices];
    updated[editIndex] = newItem;
    onAdd(updated);
  } else {
    onAdd([...notices, newItem]);
  }

  resetForm();
};
  const handleStartEdit = (i) => {
    setEditIndex(i);
    setTitle(notices[i].title);
    setBody(notices[i].body);
    setShowForm(true);
    setSelectedIndex(null);
  };

  return (
    <Overlay show={show}>
      <Container>
        <Title>📢 직원 공지사항</Title>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notices
            .filter((n) => n.title?.trim())
            .map((n, i) => (
              <NoticeItem key={i}>
                <div onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}>
                  <strong>{n.title}</strong>
                  {selectedIndex === i && (
                    <>
                      <div style={{ marginTop: 5, color: '#555' }}>{n.body}</div>
                      <ButtonRow>
                        <button
                          onClick={() => handleStartEdit(i)}
                          style={{ background: '#ffc107', color: 'black', padding: '5px 10px', borderRadius: '5px' }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => onDelete(i)}
                          style={{ background: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px' }}
                        >
                          삭제
                        </button>
                      </ButtonRow>
                    </>
                  )}
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
  <label style={{ fontSize: '14px', cursor: 'pointer' }}>
    <input
      type="checkbox"
      onChange={(e) => {
        if (e.target.checked && onSkipToday) {
          onSkipToday();
        }
      }}
      style={{ marginRight: '5px' }}
    />
    오늘은 다시 보지 않기
  </label>
</div>
                </div>
              </NoticeItem>
            ))}

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
              <ButtonRow>
                <button
                  onClick={handleSubmit}
                  style={{ background: '#28a745', color: 'white', padding: '6px 12px', borderRadius: '5px' }}
                >
                  등록
                </button>
                <button
                  onClick={resetForm}
                  style={{ background: '#6c757d', color: 'white', padding: '6px 12px', borderRadius: '5px' }}
                >
                  취소
                </button>
              </ButtonRow>
            </NoticeItem>
          )}
        </ul>

        {!showForm && (
  <>
    <ButtonRow>
      <button
        onClick={() => {
          setShowForm(true);
          setEditIndex(null);
          setTitle('');
          setBody('');
          setSelectedIndex(null);
        }}
        style={{ background: '#007bff', color: 'white', padding: '6px 12px', borderRadius: '5px' }}
      >
        추가
      </button>
      <button
        onClick={onClose}
        style={{ background: '#343a40', color: 'white', padding: '6px 12px', borderRadius: '5px' }}
      >
        닫기
      </button>
    </ButtonRow>

    {/* ✅ 오늘 다시 보지 않기 체크박스 추가 */}
    <div style={{ marginTop: '6px', fontSize: '13px', textAlign: 'right', color: '#555' }}>
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
  );
};

export default NoticeModal;
