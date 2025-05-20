import React from 'react';
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

const doctorData = [
  {
    room: '진료실 1',
    doctor: '김치과 원장',
    department: '보철과',
    current: '김민수님',
    waiting: ['이수정님', '김하늘님', '최은정님']
  },
  {
    room: '진료실 2',
    doctor: '박의사',
    department: '교정과',
    current: '구영수님',
    waiting: ['박수빈님', '정예린님']
  },
  {
    room: '진료실 3',
    doctor: '이치과 원장',
    department: '잇몸클리닉',
    current: '김지환님',
    waiting: ['김수정님', '박한주님']
  }
];

const WaitingStatus = () => {
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
