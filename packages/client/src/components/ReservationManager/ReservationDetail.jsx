import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const Panel = styled.div`
  margin-top: 20px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 10px;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const Badge = styled.span`
  background: #f1f3f5;
  color: #333;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 12px;
`;

const ButtonGroup = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 6px;

  button {
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }

  .edit { background-color: #ffc107; color: black; }
  .delete { background-color: #dc3545; color: white; }
`;

const EmptyBox = styled.div`
  margin-top: 20px;
  font-size: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "📭";
    font-size: 20px;
  }
`;

const ReservationDetail = ({ dateKey, onAdd, onEdit, onDelete }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (!dateKey || dateKey.length !== 10) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/test/appointments?reservationDate=${dateKey}`);
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('예약 불러오기 실패:', err);
        setReservations([]);
      }
    };

    fetchData();
  }, [dateKey]);

  return (
    <Panel>
      {reservations.length === 0 ? (
        <EmptyBox>예약이 없습니다.</EmptyBox>
      ) : (
        reservations.map((resv, i) => (
          <Card key={i}>
            <MetaRow>
              <strong>{resv.userId}</strong>
              <Badge>{resv.department}</Badge>
            </MetaRow>
            <div style={{ marginBottom: '4px' }}>
              시간: {resv.time || '-'} | 상태: {resv.status}
            </div>
            <div style={{ color: '#666' }}>{resv.notes}</div>
            <ButtonGroup>
              <button className="edit" onClick={() => onEdit(resv)}>수정</button>
              <button className="delete" onClick={() => onDelete(resv.id)}>삭제</button>
            </ButtonGroup>
          </Card>
        ))
      )}
    </Panel>
  );
};

export default ReservationDetail;
