import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-size: 18px;
  text-align: left;
`;

const RoomTitle = styled.h3`
  background: #007bff;
  color: white;
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  font-size: 20px;
  margin-bottom: 15px;
`;

const StatusBox = styled.div`
  background: #f1f3f5;
  padding: 10px 14px;
  margin: 15px 0 10px;
  font-weight: bold;
  font-size: 18px;
  border-radius: 6px;
`;

const List = styled.ul`
  padding-left: 20px;
  font-size: 16px;

  li {
    margin-bottom: 6px;
  }
`;

const DoctorCard = ({ data }) => {
  const waitingList = Array.isArray(data.waiting) ? data.waiting : [];

  return (
    <Card>
      <RoomTitle>{data.room || '진료실 정보 없음'}</RoomTitle>
      <p><strong>진료과:</strong> {data.department || '정보 없음'}</p>

      <StatusBox>진료 중</StatusBox>
      <p>{data.current || '없음'}</p>

      <StatusBox>대기자 ({waitingList.length}명)</StatusBox>
      <List>
        {waitingList.map((name, idx) => (
          <li key={idx}>{idx + 1}. {name}</li>
        ))}
      </List>
    </Card>
  );
};

export default DoctorCard;
