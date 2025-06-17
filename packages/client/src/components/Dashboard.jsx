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

const DEPT_OPTIONS = [
  { label: '전체', value: '' },
  { label: '보철과', value: '보철과' },
  { label: '교정과', value: '교정과' },
  { label: '치주과', value: '치주과' }
];

export default function Dashboard() {
  const reservationRef = useRef(null);
  const procedureRef = useRef(null);
  const [appointments, setAppointments] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [modalData, setModalData] = useState({ visible: false, title: '', data: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        // 예약, 시술 데이터
        const resAppointments = await fetch('http://localhost:3000/appointments/today');
        const appointmentsData = await resAppointments.json();
        setAppointments(appointmentsData);

        const resProcedures = await fetch('http://localhost:3000/procedures/today');
        setProcedures(await resProcedures.json());

        // 최근 활동 (임시: appointments, procedures 최근 10개 merge)
        const resActivities = await fetch('http://localhost:3000/activities/recent');
        setActivities(await resActivities.json());

        // 차트 데이터(기존과 동일)
        const resChart = await fetch('http://localhost:3000/stats/chart');
        const stats = await resChart.json();

        new Chart(reservationRef.current, {
          type: 'line',
          data: {
            labels: ['일', '월', '화', '수', '목', '금', '토'],
            datasets: [{
              label: '예약 수',
              data: stats.reservations,
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
            labels: stats.procedureLabels,
            datasets: [{
              label: '시술 횟수',
              data: stats.procedures,
              backgroundColor: ['#007bff', '#28a745', '#ffc107']
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } }
          }
        });
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchData();
  }, []);

  // 진료과 필터링
  const filteredAppointments = appointments.filter(a => selectedDept ? a.department === selectedDept : true);

  // 카드용 데이터
  const todayTreatmentCount = filteredAppointments.filter(a => a.status === '진료중' || a.status === '진료완료').length;
  const todayReserveCount = filteredAppointments.length;
  const todayWaitingCount = filteredAppointments.filter(a => a.status === '대기').length;

  // 최근 활동 예시 표출용
  // activities = [{ type: '예약등록', target: '윤성훈', time: '2025-06-05 14:22' }, ...]
  const recentActivities = activities.length > 0 ? activities : [
    { type: '예약 등록', target: '윤성훈', time: '2025-06-05 14:22:12' },
    { type: '진료 완료', target: '김하나', time: '2025-06-05 13:15:32' },
    { type: '시술 등록', target: '홍길동', time: '2025-06-05 10:00:40' },
  ];

  const showModal = (title, data) => {
    setModalData({ visible: true, title, data });
  };

  return (
    <Wrapper>
      <Title>대시보드</Title>

      <Filter>
        <label>진료과:</label>
        <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
          {DEPT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <label>기간:</label>
        <select>
          <option>주간</option>
          <option>월간</option>
        </select>
      </Filter>

      <CardRow>
        <Card onClick={() => showModal('오늘 진료 일정', filteredAppointments.filter(a => a.status === '진료중' || a.status === '진료완료'))}>
          <div>오늘 진료</div>
          <strong>{todayTreatmentCount}명</strong>
        </Card>
        <Card onClick={() => showModal('예약 건수 상세', filteredAppointments)}>
          <div>예약 건수</div>
          <strong>{todayReserveCount}건</strong>
        </Card>
        <Card onClick={() => showModal('대기 환자 목록', filteredAppointments.filter(x => x.status === '대기'))}>
          <div>대기 환자</div>
          <strong>{todayWaitingCount}명</strong>
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
          {recentActivities.map((act, i) => (
            <li key={i}>
              {act.type} - <strong>{act.target}</strong>
              <span style={{ marginLeft: 12, color: '#888' }}>{act.time}</span>
            </li>
          ))}
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
                <tr><th>시간</th><th>이름</th><th>시술</th><th>특이사항</th><th>진료과</th><th>의료진</th></tr>
              </thead>
              <tbody>
                {modalData.data.map((item, i) => (
                  <tr key={i}>
                    <td>{item.time}</td>
                    <td>{item.name}</td>
                    <td>{item.title || item.procedure || '-'}</td>
                    <td>{item.memo || item.note || '-'}</td>
                    <td>{item.department || '-'}</td>
                    <td>{item.doctor || '-'}</td>
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
}
