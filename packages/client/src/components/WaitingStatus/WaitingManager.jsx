import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { fetchProceduresByName, fetchAppointmentsByName } from '../../api/patients';

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

const PatientDetailModal = ({ patient, onClose }) => {
  const [procedures, setProcedures] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (patient?.name && patient?.birth) {
      fetchAppointmentsByName(patient.name, patient.birth)
        .then(data => setAppointments(data))
        .catch(() => setAppointments([]));
      fetchProceduresByName(patient.name, patient.birth)
        .then(data => setProcedures(data))
        .catch(() => setProcedures([]));
    } else {
      setAppointments([]);
      setProcedures([]);
    }
  }, [patient]);

  const latest = procedures.length > 0
    ? [...procedures].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  if (!patient) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.38)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
    }}>
      <div style={{
        background: 'white', padding: 32, borderRadius: 14, minWidth: 350, maxWidth: 540, position: 'relative',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)', maxHeight: '85vh', overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 16, fontWeight: 'bold', fontSize: 22, color: '#888',
            border: 'none', background: 'none', cursor: 'pointer'
          }}>
          ×
        </button>
        <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>환자 상세정보</h3>
        <div style={{ marginBottom: 10 }}><strong>이름:</strong> {patient.name}</div>
        <div style={{ marginBottom: 10 }}><strong>생년월일:</strong> {patient.birth || '-'}</div>
        <div style={{ marginBottom: 10 }}><strong>진료과:</strong> {patient.department}</div>
        <div style={{ marginBottom: 10 }}><strong>상태:</strong> {patient.status}</div>
        <div style={{ marginBottom: 10 }}><strong>담당의:</strong> {latest?.doctor || '-'}</div>
        <div style={{ marginBottom: 10 }}><strong>시술명:</strong> {latest?.title || latest?.name || '-'}</div>
        {patient.memo && <div style={{ marginBottom: 10 }}><strong>메모:</strong> {patient.memo}</div>}

        <div style={{ marginTop: 18 }}>
          <strong>예약 이력:</strong>
          <ul style={{ margin: '10px 0 0 16px', padding: 0, color: '#2679db' }}>
            {appointments.length === 0 ? (
              <li>등록된 예약이 없습니다.</li>
            ) : (
              appointments.map((a, i) => (
                <li key={a.id || i}>
                  {a.reservationDate || '날짜 없음'} {a.time || '시간 없음'} / {a.department || '진료과 없음'} / {a.doctor || '담당의 없음'}
                </li>
              ))
            )}
          </ul>
        </div>
        <div style={{ marginTop: 22 }}>
          <strong>시술 이력:</strong>
          <ul style={{ margin: '12px 0 0 16px', padding: 0, color: '#2863cc' }}>
            {procedures.length === 0 ? (
              <li>등록된 시술 이력이 없습니다.</li>
            ) : (
              procedures.map((p, i) => (
                <li key={i} style={{ marginBottom: 7 }}>
                  <b>{p.date ? `${p.date} - ` : ''}{p.title}</b>
                  <span style={{ color: '#444', marginLeft: 6 }}>
                    / {p.doctor || '-'}
                    {p.note && <span style={{ color: '#888', marginLeft: 4 }}>({p.note})</span>}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const WaitingManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDept, setSelectedDept] = useState('전체');
  const [selectedDoctor, setSelectedDoctor] = useState('전체');
  const navigate = useNavigate();

  const fetchWaitingList = async () => {
    try {
      const res = await fetch('http://localhost:3000/waiting/status');
      const roomsObj = await res.json();
      let result = [];
      Object.entries(roomsObj).forEach(([roomKey, value]) => {
        if (value.inTreatment && value.inTreatment.name) {
          result.push({
            name: value.inTreatment.name,
            birth: value.inTreatment.birth,
            department: roomToDepartment[roomKey],
            status: '진료중',
            doctor: value.inTreatment.doctor,
            procedureTitle: value.inTreatment.procedureTitle,
            memo: value.inTreatment.memo,
          });
        }
        value.waiting.forEach(waitObj => {
          if (waitObj && waitObj.name) {
            result.push({
              name: waitObj.name,
              birth: waitObj.birth,
              department: roomToDepartment[roomKey],
              status: '대기',
              doctor: waitObj.doctor,
              procedureTitle: waitObj.procedureTitle,
              memo: waitObj.memo,
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
    if (!name || !birth || !department) return;
    try {
      const res = await fetch('http://localhost:3000/appointments/complete-by-name', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birth, department })
      });
      if (!res.ok) throw new Error('진료 완료 실패');
      fetchWaitingList();
    } catch (error) {
      alert('진료 완료 처리 실패: ' + error.message);
    }
  };

  const callPatient = async (name, birth, department, status) => {
    const room = departmentToRoom[department];
    if (!name || !birth || !room) {
      alert('이름/생년월일/진료실 정보가 없습니다.');
      return;
    }
    if (status !== '대기') return;
    try {
      const res = await fetch('http://localhost:3000/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birth, room })
      });
      if (!res.ok) throw new Error('환자 호출 실패');
    } catch (error) {
      alert('환자 호출에 실패했습니다.');
    }
  };

  const backToWaiting = async (name, birth, department) => {
    try {
      await fetch('http://localhost:3000/appointments/back-to-waiting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birth, department })
      });
      fetchWaitingList();
    } catch (e) {
      alert('호출 취소(대기로 전환)에 실패했습니다.');
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

  const filteredAppointments = appointments.filter(appt => {
    if (selectedDept !== '전체' && appt.department !== selectedDept) return false;
    if (selectedDoctor !== '전체' && appt.doctor !== selectedDoctor) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">진료 대기 관리</h2>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
        <button
          onClick={() => navigate('/waiting-status')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          모니터링
        </button>
        <select
          value={selectedDept}
          onChange={e => { setSelectedDept(e.target.value); setSelectedDoctor('전체'); }}
          style={{ padding: '7px 18px', borderRadius: 6, border: '1px solid #b0b5be', fontSize: 15 }}
        >
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept === '전체' ? '전체 진료과' : dept}</option>
          ))}
        </select>
        <select
          value={selectedDoctor}
          onChange={e => setSelectedDoctor(e.target.value)}
          style={{ padding: '7px 18px', borderRadius: 6, border: '1px solid #b0b5be', fontSize: 15 }}
        >
          {doctorList.map(doc => (
            <option key={doc} value={doc}>{doc === '전체' ? '전체 담당의' : doc}</option>
          ))}
        </select>
      </div>
      {filteredAppointments.length === 0 ? (
        <p>대기 중인 환자가 없습니다.</p>
      ) : (
        filteredAppointments.map((appt, index) => (
          <div
            key={appt.name + appt.birth + appt.status + appt.department}
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
                    {appt.name} {appt.birth && <span style={{ color: '#888', fontSize: 13 }}>({appt.birth})</span>}
                  </span>
                </p>
                <p><strong>진료과:</strong> {appt.department || '정보 없음'}</p>
                <p><strong>상태:</strong> {appt.status || '정보 없음'}</p>
                <p><strong>담당의:</strong> {appt.doctor || '-'}</p>
                <p><strong>시술명:</strong> {appt.procedureTitle || '-'}</p>
                {appt.memo && <p><strong>메모:</strong> {appt.memo}</p>}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {appt.status === '대기' && (
                  <button
                    onClick={() => callPatient(appt.name, appt.birth, appt.department, appt.status)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 font-bold"
                    style={{ marginBottom: '6px' }}
                  >
                    호출
                  </button>
                )}
                {appt.status === '진료중' && (
                  <button
                    onClick={() => backToWaiting(appt.name, appt.birth, appt.department)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 font-bold"
                    style={{ marginBottom: '6px' }}
                  >
                    호출 취소
                  </button>
                )}
                {(appt.status === '진료중' || appt.status === '대기') && (
                  <button
                    onClick={() => markComplete(appt.name, appt.birth, appt.department)}
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
      <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
    </div>
  );
};

export default WaitingManager;
