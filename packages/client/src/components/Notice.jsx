import React, { useState } from 'react';
import styled from '@emotion/styled';

const ModalOverlay = styled.div`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const Notice = () => {
  const [notices, setNotices] = useState([
    '✅ 5월 20일 전 직원 회의 예정',
    '🦷 신규 장비 설치 일정: 5월 22일',
  ]);
  const [newNotice, setNewNotice] = useState('');
  const [open, setOpen] = useState(true);

  const addNotice = () => {
    const text = newNotice.trim();
    if (!text) return alert('공지사항을 입력해주세요.');
    setNotices([...notices, `🆕 ${text}`]);
    setNewNotice('');
  };

  const deleteNotice = (index) => {
    setNotices(notices.filter((_, i) => i !== index));
  };

  return (
    <>
      {open ? (
        <ModalOverlay show={open}>
          <ModalContent>
            <h3 style={{ marginBottom: '15px' }}>📢 직원 공지사항</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '20px' }}>
              {notices.map((text, index) => (
                <li key={index} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{text}</span>
                  <button
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px' }}
                    onClick={() => deleteNotice(index)}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="공지사항 입력..."
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '10px',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                style={{ background: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}
                onClick={addNotice}
              >
                추가
              </button>
              <button
                style={{ background: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}
                onClick={() => setOpen(false)}
              >
                닫기
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      ) : (
        <button onClick={() => setOpen(true)}>공지사항 열기</button>
      )}
    </>
  );
};

export default Notice;
