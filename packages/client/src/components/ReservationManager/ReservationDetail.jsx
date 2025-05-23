import React, { useState } from 'react';
import styled from '@emotion/styled';
import ReservationModal from './ReservationModal';

const DetailWrapper = styled.div`
  background: white;
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
  position: relative;
`;

const Info = styled.div`
  font-size: 14px;
`;

const Actions = styled.div`
  button {
    margin-left: 6px;
    padding: 4px 10px;
    font-size: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
  }

  .edit-btn {
    background: #ffc107;
  }

  .delete-btn {
    background: #dc3545;
  }
`;

const AddButton = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const EditModalWrapper = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  z-index: 100;
`;

const ReservationDetail = ({ dateKey, events, onAdd, onEdit, onDelete }) => {

  if (!dateKey) {
    return (
      <DetailWrapper>
        <h3>날짜를 클릭하면 예약 정보가 표시됩니다.</h3>
      </DetailWrapper>
    );
  }

  const reservations = [...(events[dateKey] || [])].sort((a, b) =>
    a.time.localeCompare(b.time)
  );


  return (
    <DetailWrapper>
      <h3>{dateKey} 예약 목록</h3>
      {reservations.length === 0 ? (
        <p>등록된 예약이 없습니다.</p>
      ) : (
        reservations.map((item, index) => (
          <Item key={index}>
            <Info>
              🦷 {item.type || '진료과 미지정'} | ⏰ {item.time || '시간 없음'} | 👤 {item.name || '이름 없음'}
              {item.memo && <> | 📝 {item.memo}</>}
            </Info>
            <Actions>
            <button className="edit-btn" onClick={() => onEdit(item)}>수정</button>
            <button
                className="delete-btn"
                onClick={() => {
                  if (window.confirm("이 예약을 삭제하시겠습니까?")) {
                    onDelete(dateKey, index);
                  }
                }}
              >
                삭제
              </button>
            </Actions>

          </Item>
        ))
      )}
      <AddButton onClick={onAdd}>+ 예약 추가</AddButton>
    </DetailWrapper>
  );
};

export default ReservationDetail;
