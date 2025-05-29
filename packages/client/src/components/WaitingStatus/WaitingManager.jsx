import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WaitingManager = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchWaitingList = async () => {
    try {
      const res = await fetch('http://localhost:3000/waiting/status');
      const data = await res.json();
      console.log("대기자 목록 응답:", data);
      setAppointments(data);
    } catch (error) {
      console.error('대기 목록 불러오기 실패:', error);
    }
  };

  const markComplete = async (id) => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('유효하지 않은 ID로 진료 완료 요청을 시도했습니다.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: '진료완료' }),
      });
      if (!res.ok) {
        throw new Error('서버 오류 발생');
      }
      fetchWaitingList();
    } catch (error) {
      console.error('진료 완료 처리 실패:', error);
    }
  };

  useEffect(() => {
    fetchWaitingList();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">진료 대기 관리</h2>
        <button
          onClick={() => navigate('/waiting-status')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          모니터링
        </button>
      </div>
      {appointments.length === 0 ? (
        <p>대기 중인 환자가 없습니다.</p>
      ) : (
        appointments.map((appt, index) => (
          <div
            key={appt.id || index}
            className="border p-4 rounded-xl shadow mb-4"
          >
            <p><strong>이름:</strong> {appt.name || '이름 정보 없음'}</p>
            <p><strong>진료과:</strong> {appt.department || '정보 없음'}</p>
            <p><strong>상태:</strong> {appt.status || '정보 없음'}</p>
            {appt.memo && <p><strong>메모:</strong> {appt.memo}</p>}
            {appt.status !== '진료완료' && (
              <button
                onClick={() => markComplete(appt.id)}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                진료 완료
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default WaitingManager;
