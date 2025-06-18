import React from 'react';
import styled from '@emotion/styled';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: ${({ show }) => (show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 10px;
  padding: 24px;
  width: 480px;
  max-width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Content = styled.div`
  font-size: 14px;
  color: #333;
  white-space: pre-wrap;
  margin-bottom: 16px;
`;

const Meta = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  background: ${({ color }) => color || '#007bff'};
  color: white;

  &:hover {
    background: ${({ color }) =>
      color === '#dc3545' ? '#c82333' :
      color === '#6c757d' ? '#5a6268' :
      '#0056b3'};
  }
`;

const NoticeDetailModal = ({ show, notice, onClose, onEdit, onDelete }) => {
  if (!notice) return null;

  return (
    <Overlay show={show}>
      <ModalBox>
        <Title>{notice.title}</Title>
        <Meta>작성자: {notice.author || '관리자'}</Meta>
        <Content>{notice.content}</Content>

        <ButtonRow>
          <Button onClick={() => onEdit(notice)}>수정</Button>
          <Button color="#dc3545" onClick={() => onDelete(notice.id)}>삭제</Button>
          <Button color="#6c757d" onClick={onClose}>닫기</Button>
        </ButtonRow>
      </ModalBox>
    </Overlay>
  );
};

export default NoticeDetailModal;