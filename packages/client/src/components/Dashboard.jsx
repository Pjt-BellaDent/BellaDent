import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import styled from '@emotion/styled';
import NoticeWrapper from '../components/Notice/NoticeWrapper';

const Wrapper = styled.div`
  padding: 24px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Filter = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
`;

const CardRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  flex: 1;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-align: center;
  cursor: pointer;

  div {
    font-size: 14px;
  }

  strong {
    font-size: 22px;
    color: #007bff;
    display: block;
    margin-top: 4px;
  }
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBox = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const ActivityBox = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  li {
    margin-bottom: 8px;
    font-size: 14px;
  }
`;

const Modal = styled.div`
  display: ${({ visible }) => visible ? 'flex' : 'none'};
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 10px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;

    th, td {
      padding: 8px;
      border: 1px solid #eee;
      text-align: center;
    }

    th {
      background: #f1f3f5;
    }
  }

  button {
    margin-top: 16px;
    padding: 8px 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const Dashboard = () => {
  const reservationRef = useRef(null);
  const procedureRef = useRef(null);
  const [modalData, setModalData] = useState({ visible: false, title: '', data: [] });

  const todayAppointments = [
    { time: '09:00', name: '홍길동', procedure: '라미네이트', note: '치아 6개 시술', doctor: '김치과 원장' },
    { time: '10:30', name: '김하나', procedure: '스케일링', note: '잇몸 민감', doctor: '홍의사' },
    { time: '13:00', name: '이수정', procedure: '잇몸성형', note: '지혈 체크 필요', doctor: '김치과 원장' }
  ];

  const chartData = {
    reservation: [10, 15, 7, 20, 13, 9, 4],
    procedure: [3, 5, 2]
  };

  useEffect(() => {
    new Chart(reservationRef.current, {
      type: 'line',
      data: {
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        datasets: [{
          label: '예약 수',
          data: chartData.reservation,
          fill: false,
          borderColor: '#007bff',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    new Chart(procedureRef.current, {
      type: 'bar',
      data: {
        labels: ['라미네이트', '스케일링', '잇몸성형'],
        datasets: [{
          label: '시술 횟수',
          data: chartData.procedure,
          backgroundColor: ['#007bff', '#28a745', '#ffc107']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }, []);

  const showModal = (title, data) => {
    setModalData({ visible: true, title, data });
  };

  return (
    <Wrapper>
      <Title>대시보드</Title>

      <Filter>
        <label>의료진:</label>
        <select><option>전체</option><option>김치과 원장</option><option>홍의사</option></select>
        <label>기간:</label>
        <select><option>주간</option><option>월간</option></select>
      </Filter>

      <CardRow>
        <Card onClick={() => showModal('오늘 진료 일정', todayAppointments)}>
          <div>오늘 진료</div>
          <strong>18명</strong>
        </Card>
        <Card onClick={() => showModal('예약 건수 상세', todayAppointments)}>
          <div>예약 건수</div>
          <strong>27건</strong>
        </Card>
        <Card onClick={() => showModal('대기 환자 목록', todayAppointments.filter(x => x.name !== '이수정'))}>
          <div>대기 환자</div>
          <strong>5명</strong>
        </Card>
      </CardRow>

      <ChartGrid>
        <ChartBox>
          <h4>예약 추이</h4>
          <canvas ref={reservationRef}></canvas>
        </ChartBox>
        <ChartBox>
          <h4>시술 통계</h4>
          <canvas ref={procedureRef}></canvas>
        </ChartBox>
      </ChartGrid>

      <ActivityBox>
        <h4>최근 활동</h4>
        <ul>
          <li>📝 홍길동 환자 등록 (05-13)</li>
          <li>💊 김하나 진료 완료 (05-13)</li>
          <li>📅 이철수 예약 등록 (05-14 예정)</li>
        </ul>
      </ActivityBox>

      <Modal visible={modalData.visible}>
        <ModalContent>
          <h3>{modalData.title}</h3>
          {modalData.data.length === 0 ? (
            <p>정보가 없습니다.</p>
          ) : (
            <table>
              <thead>
                <tr><th>시간</th><th>이름</th><th>시술</th><th>특이사항</th><th>의료진</th></tr>
              </thead>
              <tbody>
                {modalData.data.map((item, i) => (
                  <tr key={i}>
                    <td>{item.time}</td><td>{item.name}</td><td>{item.procedure}</td><td>{item.note}</td><td>{item.doctor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={() => setModalData({ ...modalData, visible: false })}>닫기</button>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};

export default Dashboard;
