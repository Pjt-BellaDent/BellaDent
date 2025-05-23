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

const Input = styled.input`
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  margin-top: 10px;
  padding: 8px;
  font-size: 14px;
  resize: none;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 5px;
  border: none;
  color: white;
  cursor: pointer;
`;

const NoticeModal = ({
  show,
  onClose,
  notices,
  onAdd,
  onDelete,
  onEdit,
  title,
  setTitle,
  body,
  setBody,
  showForm,
  setShowForm
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleSubmit = () => {
    if (!title.trim()) return alert('제목을 입력하세요.');
    onAdd({ title: title.trim(), body: body.trim() });
    setTitle('');
    setBody('');
    setShowForm(false);
  };

  return (
    <Overlay show={show}>
      <Container>
        <h3>📢 직원 공지사항</h3>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notices
            .filter(n => n.title?.trim())
            .map((item, i) => (
              <li key={i} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                <div
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                >
                  {item.title}
                </div>
                {expandedIndex === i && (
                  <>
                    <div style={{ marginTop: '5px', fontSize: '14px', color: '#555' }}>{item.body}</div>
                    <div style={{ marginTop: '5px' }}>
                      <Button style={{ background: '#ffc107', marginRight: '5px' }} onClick={() => onEdit(i)}>수정</Button>
                      <Button style={{ background: 'red' }} onClick={() => onDelete(i)}>삭제</Button>
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>

        {showForm && (
          <>
            <Input
              placeholder="제목 입력 (예: 5월 30일 회의 일정)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextArea
              placeholder="내용 입력 (예: 회의는 5월 30일 14시 회의실에서 진행됩니다.)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button onClick={handleSubmit} style={{ background: '#28a745' }}>등록</Button>
              <Button onClick={() => {
                setTitle('');
                setBody('');
                setShowForm(false);
              }} style={{ background: '#6c757d' }}>취소</Button>
            </div>
          </>
        )}

        {!showForm && (
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowForm(true)} style={{ background: '#007bff' }}>추가</Button>
            <Button onClick={onClose} style={{ background: '#343a40', marginLeft: '10px' }}>닫기</Button>
          </div>
        )}
      </Container>
    </Overlay>
  );
};

export default NoticeModal;
