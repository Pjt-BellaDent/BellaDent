import React from 'react';
import styled from '@emotion/styled';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
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

const NoticeModal = ({ show, onClose, notices, onAdd, onDelete, newNotice, setNewNotice }) => (
  <Overlay show={show}>
    <Container>
      <h3>📢 직원 공지사항</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notices.map((text, index) => (
          <li key={index} style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>{text}</span>
            <button onClick={() => onDelete(index)} style={{ color: 'white', background: 'red', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>삭제</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newNotice}
        onChange={(e) => setNewNotice(e.target.value)}
        placeholder="공지사항 입력..."
        style={{ width: '100%', marginTop: '10px', padding: '8px' }}
      />
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={onAdd} style={{ background: '#28a745', color: 'white', padding: '6px 12px', borderRadius: '5px' }}>추가</button>
        <button onClick={onClose} style={{ background: '#007bff', color: 'white', padding: '6px 12px', borderRadius: '5px' }}>닫기</button>
      </div>
    </Container>
  </Overlay>
);

export default NoticeModal;
