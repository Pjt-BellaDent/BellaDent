import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import DoctorCard from './DoctorCard';

const Container = styled.div`
  padding: 30px;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
`;

const Message = styled.div`
  margin-top: 30px;
  padding: 16px;
  background: #ffeeba;
  color: #856404;
  border-radius: 8px;
`;

const List = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const WaitingStatus = () => {
  const [doctorData, setDoctorData] = useState([]);

  useEffect(() => {
    const fetchWaiting = async () => {
      try {
        const res = await fetch('http://localhost:3000/waiting/status');
        const data = await res.json();
        const waiting = data.filter(d => d.status === '대기');
        setDoctorData(waiting);
      } catch (err) {
        console.error('대기 현황 불러오기 실패:', err);
      }
    };

    fetchWaiting();
  }, []);

  return (
    <Container>
      <Header>⏳ 진료 대기 현황</Header>

      <List>
        {doctorData.length === 0 ? (
          <p>현재 대기 중인 환자가 없습니다.</p>
        ) : (
          doctorData.map((item, i) => (
            <DoctorCard key={i} data={item} />
          ))
        )}
      </List>

      <Message>
        진료실 대기자 순번의 환자분은 지정 대기석에 잠시만 기다려주세요. 진료 순서가 되시면 음성으로 안내해드립니다.
      </Message>
    </Container>
  );
};

export default WaitingStatus;
