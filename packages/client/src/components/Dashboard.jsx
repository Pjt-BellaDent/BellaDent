import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import styled from '@emotion/styled';

const DashboardContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

const Stats = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  flex: 1;
  background: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-size: 14px;
  cursor: pointer;

  strong {
    font-size: 22px;
    color: #007bff;
    display: block;
    margin-top: 6px;
  }
`;

const ChartBox = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 20px;
`;

const RecentActivity = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const Modal = styled.div`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Dashboard = () => {
  const reservationRef = useRef(null);
  const procedureRef = useRef(null);
  const [modalData, setModalData] = useState({ visible: false, title: '', data: [] });

  const chartData = {
    reservation: [10, 15, 7, 20, 13, 9, 4],
    procedure: [3, 5, 2]
  };

  const todayAppointments = [
    { time: '09:00', name: '홍길동', procedure: '라미네이트', note: '치아 6개 시술', doctor: '김치과 원장' },
    { time: '10:30', name: '김하나', procedure: '스케일링', note: '잇몸 민감', doctor: '홍의사' },
    { time: '13:00', name: '이수정', procedure: '잇몸성형', note: '지혈 체크 필요', doctor: '김치과 원장' }
  ];

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
    <DashboardContainer>
      <h2>🏠 대시보드</h2>

      <FilterContainer>
        <label>의료진 선택:</label>
        <select><option>전체</option><option>김치과 원장</option><option>홍의사</option></select>

        <label>기간 선택:</label>
        <select><option>주간</option><option>월간</option><option>기간 설정</option></select>

        <input type="date" style={{ display: 'none' }} />
        <input type="date" style={{ display: 'none' }} />
      </FilterContainer>

      <Stats>
        <Card onClick={() => showModal('오늘 진료 일정', todayAppointments)}>오늘 진료<strong>18명</strong></Card>
        <Card onClick={() => showModal('예약 건수 상세', todayAppointments)}>예약 건수<strong>27건</strong></Card>
        <Card onClick={() => showModal('대기 환자 목록', todayAppointments.filter(x => x.name !== '이수정'))}>대기 환자<strong>5명</strong></Card>
        <Card onClick={() => showModal('응급 환자 정보', [{ time: '12:00', name: '박철수', procedure: '응급진료', note: '외상 출혈', doctor: '홍의사' }])}>응급 건수<strong>1건</strong></Card>
      </Stats>

      <ChartBox>
        <h3>예약 추이</h3>
        <canvas ref={reservationRef}></canvas>
      </ChartBox>

      <ChartBox>
        <h3>시술 통계</h3>
        <canvas ref={procedureRef}></canvas>
      </ChartBox>

      <RecentActivity>
        <h3>최근 활동</h3>
        <ul>
          <li>📝 홍길동 환자 등록 (05-13)</li>
          <li>💊 김하나 진료 완료 (05-13)</li>
          <li>📅 이철수 예약 등록 (05-14 예정)</li>
        </ul>
      </RecentActivity>

      <Modal visible={modalData.visible}>
        <ModalContent>
          <h3>{modalData.title}</h3>
          {modalData.data.length === 0 ? (
            <p>정보가 없습니다.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f1f3f5' }}>
                  <th>시간</th><th>이름</th><th>시술명</th><th>특이사항</th><th>의료진</th>
                </tr>
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
    </DashboardContainer>
  );
};

export default Dashboard;
