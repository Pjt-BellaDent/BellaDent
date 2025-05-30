import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
  background: #fff;
  padding: 28px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  font-size: 18px;
  text-align: left;
  margin-bottom: 14px;
  min-width: 320px;
`;

const RoomTitle = styled.h3`
  background: #1976d2;
  color: white;
  padding: 14px 0;
  text-align: center;
  border-radius: 10px;
  font-size: 23px;
  margin-bottom: 15px;
  letter-spacing:0.06em;
`;

const InfoLine = styled.div`
  font-size: 15px;
  margin-bottom: 9px;
  color: #1565c0;
`;

const StatusBadge = styled.span`
  background: ${props => props.status === '진료중' ? '#2ecc71' : '#ffd43b'};
  color: ${props => props.status === '진료중' ? 'white' : '#856404'};
  font-weight: bold;
  font-size: 13px;
  border-radius: 7px;
  padding: 4px 13px;
  margin-left: 10px;
`;

const WaitingListWrap = styled.div`
  margin-top: 20px;
`;

const WaitingListTitle = styled.div`
  font-weight: bold;
  color: #29549a;
  font-size: 16px;
  margin-bottom: 8px;
  letter-spacing:0.04em;
`;

const List = styled.ul`
  padding-left: 16px;
  font-size: 15px;
  color: #444;
  margin-bottom: 0;
  li {
    margin-bottom: 5px;
    font-size: 15px;
    font-weight: ${({ highlight }) => (highlight ? 'bold' : 'normal')};
    color: ${({ highlight }) => (highlight ? '#1662be' : '#444')};
  }
`;

const DoctorCard = ({ data }) => {
  const waitingList = Array.isArray(data.waiting) ? data.waiting : [];
  return (
    <Card>
      <RoomTitle>
        {data.room || '진료실 정보 없음'}
        <StatusBadge status={data.status || '대기'}>
          {data.status || '대기'}
        </StatusBadge>
      </RoomTitle>
      <InfoLine><strong>진료과:</strong> {data.department || '정보 없음'}</InfoLine>
      {data.current && (
        <InfoLine><strong>진료 중:</strong> {data.current}</InfoLine>
      )}
      <WaitingListWrap>
        <WaitingListTitle>대기자 목록 ({waitingList.length}명)</WaitingListTitle>
        <List>
          {waitingList.length === 0 ? (
            <li style={{ color: '#aaa' }}>대기자가 없습니다.</li>
          ) : (
            waitingList.map((name, idx) => (
              <li key={idx} style={{fontWeight: idx===0 ? 'bold' : 'normal', color: idx===0 ? '#1662be' : '#444'}}>
                {idx + 1}. {name}
              </li>
            ))
          )}
        </List>
      </WaitingListWrap>
    </Card>
  );
};

export default DoctorCard;
