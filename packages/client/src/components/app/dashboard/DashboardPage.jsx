import React, { useEffect, useRef, useState } from 'react';
import axios from '../../../libs/axiosInstance.js';
import Chart from 'chart.js/auto';

const DEPT_OPTIONS = [
  { label: '전체', value: '' },
  { label: '심미치료', value: '심미치료' },
  { label: '일반 진료/보철', value: '일반 진료/보철' },
  { label: '교정/미백', value: '교정/미백' },
];

const DashboardPage = () => {
  const reservationRef = useRef(null);
  const procedureRef = useRef(null);
  const [appointments, setAppointments] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [modalData, setModalData] = useState({
    visible: false,
    title: '',
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);

        const [resAppointments, resProcedures, resActivities, resChart] =
          await Promise.all([
            axios.get('/appointments/today'),
            axios.get('/procedures/today'),
            axios.get('/activities/recent'),
            axios.get('/stats/chart'),
          ]);

        setAppointments(resAppointments.data);
        setProcedures(resProcedures.data);
        setActivities(resActivities.data);

        const stats = resChart.data;

        new Chart(reservationRef.current, {
          type: 'line',
          data: {
            labels: ['일', '월', '화', '수', '목', '금', '토'],
            datasets: [
              {
                label: '예약 수',
                data: stats.reservations,
                fill: false,
                borderColor: '#007bff',
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
          },
        });

        new Chart(procedureRef.current, {
          type: 'bar',
          data: {
            labels: stats.procedureLabels,
            datasets: [
              {
                label: '시술 횟수',
                data: stats.procedures,
                backgroundColor: ['#007bff', '#28a745', '#ffc107'],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
          },
        });
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchData();
  }, []);

  const filteredAppointments = appointments.filter((a) =>
    selectedDept ? a.department === selectedDept : true
  );
  const todayTreatmentCount = filteredAppointments.filter(
    (a) => a.status === '진료중' || a.status === '진료완료'
  ).length;
  const todayReserveCount = filteredAppointments.length;
  const todayWaitingCount = filteredAppointments.filter(
    (a) => a.status === '대기'
  ).length;

  const recentActivities =
    activities.length > 0
      ? activities
      : [
          { type: '예약 등록', target: '윤성훈', time: '2025-06-05 14:22:12' },
          { type: '진료 완료', target: '김하나', time: '2025-06-05 13:15:32' },
          { type: '시술 등록', target: '홍길동', time: '2025-06-05 10:00:40' },
        ];

  const showModal = (title, data) => {
    setModalData({ visible: true, title, data });
  };

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">대시보드</h2>

      <div className="flex gap-4 items-center mb-6">
        <label>진료과:</label>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {DEPT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <label>기간:</label>
        <select className="border px-2 py-1 rounded">
          <option>주간</option>
          <option>월간</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() =>
            showModal(
              '오늘 진료 일정',
              filteredAppointments.filter(
                (a) => a.status === '진료중' || a.status === '진료완료'
              )
            )
          }
          className="bg-white p-4 rounded shadow cursor-pointer text-center"
        >
          <div className="text-sm">오늘 진료</div>
          <strong className="text-blue-600 text-xl block mt-1">
            {todayTreatmentCount}명
          </strong>
        </div>
        <div
          onClick={() => showModal('예약 건수 상세', filteredAppointments)}
          className="bg-white p-4 rounded shadow cursor-pointer text-center"
        >
          <div className="text-sm">예약 건수</div>
          <strong className="text-blue-600 text-xl block mt-1">
            {todayReserveCount}건
          </strong>
        </div>
        <div
          onClick={() =>
            showModal(
              '대기 환자 목록',
              filteredAppointments.filter((x) => x.status === '대기')
            )
          }
          className="bg-white p-4 rounded shadow cursor-pointer text-center"
        >
          <div className="text-sm">대기 환자</div>
          <strong className="text-blue-600 text-xl block mt-1">
            {todayWaitingCount}명
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-2">예약 추이</h4>
          <canvas ref={reservationRef}></canvas>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-2">시술 통계</h4>
          <canvas ref={procedureRef}></canvas>
        </div>
      </div>

      {modalData.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{modalData.title}</h3>
            {modalData.data.length === 0 ? (
              <p>정보가 없습니다.</p>
            ) : (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-3 py-2">시간</th>
                    <th className="border px-3 py-2">이름</th>
                    <th className="border px-3 py-2">시술</th>
                    <th className="border px-3 py-2">특이사항</th>
                    <th className="border px-3 py-2">진료과</th>
                    <th className="border px-3 py-2">의료진</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData.data.map((item, i) => (
                    <tr key={i}>
                      <td className="border px-3 py-2 text-center">
                        {item.time}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.name}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.title || item.procedure || '-'}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.memo || item.note || '-'}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.department || '-'}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.doctor || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setModalData({ ...modalData, visible: false })}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
