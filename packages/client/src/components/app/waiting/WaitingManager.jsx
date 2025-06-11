// src/app/waiting/components/WaitingManager.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../libs/axiosInstance';

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
const DOCTOR_MAP = {
  '보철과': ['김치과 원장', '이보철 선생'],
  '교정과': ['박교정 원장', '정교정 선생'],
  '치주과': ['최치주 원장', '한치주 선생'],
};
const DEPARTMENTS = ['전체', '보철과', '교정과', '치주과'];

const WaitingManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('전체');
  const [selectedDoctor, setSelectedDoctor] = useState('전체');
  const navigate = useNavigate();

  const fetchWaitingList = async () => {
    try {
      const { data: roomsObj } = await axios.get('/waiting/status');
      let result = [];
      Object.entries(roomsObj).forEach(([roomKey, value]) => {
        if (value.inTreatment && value.inTreatment.name) {
          result.push({
            ...value.inTreatment,
            department: roomToDepartment[roomKey],
            status: '진료중',
          });
        }
        value.waiting.forEach(waitObj => {
          if (waitObj && waitObj.name) {
            result.push({
              ...waitObj,
              department: roomToDepartment[roomKey],
              status: '대기',
            });
          }
        });
      });
      setAppointments(result);
    } catch (error) {
      console.error('대기 목록 불러오기 실패:', error);
    }
  };

  const markComplete = async (name, birth, department) => {
    try {
      await axios.put('/appointments/complete-by-name', { name, birth, department });
      fetchWaitingList();
    } catch (error) {
      alert('진료 완료 실패: ' + error.message);
    }
  };

  const callPatient = async (name, birth, department, status) => {
    if (status !== '대기') return;
    const room = departmentToRoom[department];
    try {
      await axios.post('/api/call', { name, birth, room });
      fetchWaitingList();
    } catch (error) {
      alert('환자 호출 실패: ' + error.message);
    }
  };

  const backToWaiting = async (name, birth, department) => {
    try {
      await axios.put('/appointments/back-to-waiting', { name, birth, department });
      fetchWaitingList();
    } catch (error) {
      alert('호출 취소 실패: ' + error.message);
    }
  };

  useEffect(() => {
    fetchWaitingList();
    const timer = setInterval(fetchWaitingList, 4000);
    return () => clearInterval(timer);
  }, []);

  const doctorList = selectedDept === '전체'
    ? ['전체']
    : ['전체', ...DOCTOR_MAP[selectedDept]];

  const filtered = appointments.filter(appt => {
    if (selectedDept !== '전체' && appt.department !== selectedDept) return false;
    if (selectedDoctor !== '전체' && appt.doctor !== selectedDoctor) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">진료 대기 관리</h2>
        <button
          onClick={() => navigate('/waiting-status')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          모니터링</button>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedDept}
          onChange={e => { setSelectedDept(e.target.value); setSelectedDoctor('전체'); }}
          className="p-2 border rounded"
        >
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          value={selectedDoctor}
          onChange={e => setSelectedDoctor(e.target.value)}
          className="p-2 border rounded"
        >
          {doctorList.map(doc => (
            <option key={doc} value={doc}>{doc}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600">대기 중인 환자가 없습니다.</p>
      ) : (
        filtered.map((appt, index) => (
          <div key={index} className="border p-4 rounded-xl shadow mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-blue-800">
                  이름: {appt.name} {appt.birth && <span className="text-sm text-gray-500 ml-2">({appt.birth})</span>}
                </p>
                <p>진료과: {appt.department}</p>
                <p>상태: {appt.status}</p>
                <p>담당의: {appt.doctor}</p>
                <p>시술명: {appt.procedureTitle}</p>
                {appt.memo && <p>메모: {appt.memo}</p>}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {appt.status === '대기' && (
                  <button
                    onClick={() => callPatient(appt.name, appt.birth, appt.department, appt.status)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    호출
                  </button>
                )}
                {appt.status === '진료중' && (
                  <button
                    onClick={() => backToWaiting(appt.name, appt.birth, appt.department)}
                    className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    호출 취소
                  </button>
                )}
                {(appt.status === '진료중' || appt.status === '대기') && (
                  <button
                    onClick={() => markComplete(appt.name, appt.birth, appt.department)}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    진료 완료
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WaitingManager;