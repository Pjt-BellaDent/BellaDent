import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  background: white;
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
`;

const Entry = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
`;

const Info = styled.div`
  font-size: 14px;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;

  button {
    padding: 4px 8px;
    font-size: 12px;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
  }

  .edit {
    background: #ffc107;
  }

  .delete {
    background: #dc3545;
  }
`;

const AddButton = styled.button`
  margin-top: 12px;
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
`;

const ScheduleList = ({ selectedDate, scheduleData, onDelete, onOpenPopup, onEdit }) => {
  if (!selectedDate) {
    return (
      <Wrapper>
        <h4>📅 날짜를 클릭해 스케줄을 확인하세요.</h4>
      </Wrapper>
    );
  }

  const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const list = scheduleData[key] || [];

  return (
    <Wrapper>
      <h3>{key} 스케줄 목록</h3>
      {list.length === 0 ? (
        <p>등록된 스케줄이 없습니다.</p>
      ) : (
        list.map((item) => (

          <Entry key={item.id}>
            <Info>
              👤 {item.rank} {item.name} | 🕒 {item.time} {item.off ? '🌙휴무' : ''} <br />
              📝 {item.memo || '메모 없음'}
            </Info>
            <Actions>
              <button className="edit" onClick={() => onEdit(item)}>수정</button>
              <button
                className="delete"
                onClick={() => {
                  onDelete(item.id); // ❗ 꼭 이렇게
                }}
              >
                삭제
              </button>

            </Actions>
          </Entry>
        ))
      )}
      <AddButton onClick={onOpenPopup}>+ 스케줄 추가</AddButton>
    </Wrapper>
  );
};

export default ScheduleList;
