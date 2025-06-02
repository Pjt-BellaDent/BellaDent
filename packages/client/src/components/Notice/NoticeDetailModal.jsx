// NoticeDetailModal.jsx
import React from 'react';
import styled from '@emotion/styled';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin-bottom: 12px;
`;

const Body = styled.p`
  white-space: pre-wrap;
  margin-bottom: 16px;
  color: #333;
`;

const Meta = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 16px;   /* margin-bottom 대신 margin-top 으로 간격 조정 */
  margin-bottom: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  ${({ variant }) => {
    switch (variant) {
      case 'close':
        return `
          background: #343a40;
          color: white;
        `;
      case 'edit':
        return `
          background: #f0c040;
          color: black;
          border: 1px solid #aaa;
        `;
      case 'delete':
        return `
          background: #eee;
          color: #c00;
          border: 1px solid #c00;
        `;
      default:
        return '';
    }
  }}
`;

const NoticeDetailModal = ({
  show,
  notice,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!notice) return null;

  return (
    <Overlay show={show}>
      <Modal>
        {/* 1) 제목 */}
        <Title>{notice.title}</Title>

        {/* 2) 본문 */}
        <Body>{notice.body}</Body>

        {/* 3) 작성자/작성일: 본문 바로 아래로 이동 */}
        <Meta>
          작성자: {notice.author || '관리자'}<br />
          작성일: {new Date(notice.createdAt).toLocaleString('ko-KR')}
        </Meta>

        {/* 4) 버튼 */}
        <ButtonRow>
          <Button
            variant="edit"
            onClick={() => {
              onEdit(notice.index);
              onClose();
            }}
          >
            수정
          </Button>

          <Button
            variant="delete"
            onClick={() => {
              onDelete(notice.index);
              onClose();
            }}
          >
            삭제
          </Button>

          <Button variant="close" onClick={onClose}>
            닫기
          </Button>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

export default NoticeDetailModal;
