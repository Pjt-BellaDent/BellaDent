import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const departmentToRoom = {
  '보철과': '1',
  '교정과': '2',
  '치주과': '3',
};

const roomToDepartment = {
  '1': '보철과',
  '2': '교정과',
  '3': '치주과',
};

const PatientDetailModal = ({ patient, onClose }) => {
  if (!patient) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.38)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
    }}>
      <div style={{ background: 'white', padding: 32, borderRadius: 14, minWidth: 350, maxWidth: 500, position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, fontWeight: 'bold', fontSize: 22, color: '#888', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
        <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>환자 상세정보</h3>
        <div style={{ marginBottom: 10 }}><strong>이름:</strong> {patient.name}</div>
        <div style={{ marginBottom: 10 }}><strong>진료과:</strong> {patient.department}</div>
        <div style={{ marginBottom: 10 }}><strong>상태:</strong> {patient.status}</div>
        {patient.memo && <div style={{ marginBottom: 10 }}><strong>메모:</strong> {patient.memo}</div>}
        <div style={{ marginTop: 22 }}>
          <strong>시술 이력:</strong>
          <ul style={{ margin: '12px 0 0 16px', padding: 0, color: '#2863cc' }}>
            {(patient.procedures || [
              { date: '2024-03-01', name: '스케일링' },
              { date: '2024-05-02', name: '충치 치료' },
            ]).map((p, i) => (
              <li key={i}>{p.date} - {p.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const WaitingManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  const fetchWaitingList = async () => {
    try {
      const res = await fetch('http://localhost:3000/waiting/status');
      const roomsObj = await res.json();
      let result = [];
      Object.entries(roomsObj).forEach(([roomKey, value]) => {
        // 진료중 환자
        if (value.inTreatment) {
          result.push({
            name: value.inTreatment,
            department: roomToDepartment[roomKey],
            status: '진료중',
          });
        }
        // 대기 환자
        value.waiting.forEach(waitName => {
          result.push({
            name: waitName,
            department: roomToDepartment[roomKey],
            status: '대기',
          });
        });
      });
      setAppointments(result);
    } catch (error) {
      console.error('대기 목록 불러오기 실패:', error);
    }
  };

  const markComplete = async (idOrName, department) => {
    if (!idOrName || !department) return;
    try {
      await fetch(`http://localhost:3000/appointments/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: idOrName, department })
      });
      fetchWaitingList();
    } catch (error) {
      console.error('진료 완료 처리 실패:', error);
    }
  };

  // 호출 버튼: 반드시 대기환자만 노출
  const callPatient = async (name, department, status) => {
    const room = departmentToRoom[department];
    if (!name || !room) {
      alert('이름 또는 진료실 정보가 없습니다.');
      return;
    }
    if (status !== '대기') return; // 진료중/진료완료는 호출 버튼 미노출
    try {
      await fetch('http://localhost:3000/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, room })
      });
    } catch (error) {
      alert('환자 호출에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchWaitingList();
    const timer = setInterval(fetchWaitingList, 4000);
    return () => clearInterval(timer);
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
            key={appt.name + appt.status + appt.department}
            className="border p-4 rounded-xl shadow mb-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <p>
                  <strong>이름:</strong>{' '}
                  <span
                    style={{ color: '#2167d5', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => setSelectedPatient(appt)}
                  >
                    {appt.name || '이름 정보 없음'}
                  </span>
                </p>
                <p><strong>진료과:</strong> {appt.department || '정보 없음'}</p>
                <p><strong>상태:</strong> {appt.status || '정보 없음'}</p>
                {appt.memo && <p><strong>메모:</strong> {appt.memo}</p>}
              </div>
              {/* 버튼 그룹 */}
              <div className="flex flex-col gap-2 ml-4">
                {/* 대기 환자에만 호출 버튼 노출 */}
                {appt.status === '대기' && (
                  <button
                    onClick={() => callPatient(appt.name, appt.department, appt.status)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 font-bold"
                    style={{marginBottom:'6px'}}
                  >
                    호출
                  </button>
                )}
                {/* 진료중, 대기 환자에만 진료 완료 노출 */}
                {(appt.status === '진료중' || appt.status === '대기') && (
                  <button
                    onClick={() => markComplete(appt.name, appt.department)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    진료 완료
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      {/* 상세 모달 */}
      <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
    </div>
  );
};

export default WaitingManager;
