import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import DoctorCard from './DoctorCard';

const Container = styled.div`
  padding: 30px;
  text-align: center;
`;

const FooterMessage = styled.div`
  background: #ffc107;
  color: #333;
  padding: 14px;
  border-radius: 6px;
  font-size: 16px;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 30px;
`;

const WaitingStatus = () => {
  const [doctorData, setDoctorData] = useState([]);

  useEffect(() => {
    const fetchWaitingStatus = async () => {
      try {
        const res = await fetch('http://localhost:3000/waiting/status');
        const data = await res.json();
        setDoctorData(data);
      } catch (err) {
        console.error('대기 현황 불러오기 실패:', err);
      }
    };

    fetchWaitingStatus();
  }, []);

  return (
    <Container>
      <h2>⏳ 진료 대기 현황</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
        {doctorData.map((item, idx) => (
          <DoctorCard key={idx} data={item} />
        ))}
      </div>
      <FooterMessage>
        진료실 대기자 순번의 환자분은 지정 대기석에 잠시만 기다려주세요. 진료 순서가 되시면 음성으로 안내해드립니다.
      </FooterMessage>
    </Container>
  );
};

export default WaitingStatus;
