// src/components/app/reservations/ReservationDetail.jsx
import React, { useEffect, useState } from 'react';
import { fetchProceduresByName } from '../../../api/patients';

const DOCTOR_MAP = {
  '보철과': ['김치과 원장', '이보철 선생'],
  '교정과': ['박교정 원장', '정교정 선생'],
  '치주과': ['최치주 원장', '한치주 선생'],
};

const ReservationDetail = ({ date, events, onEdit, onDelete }) => {
  const reservations = events[date] || [];
  const [procedureMap, setProcedureMap] = useState({});
  const [selectedDept, setSelectedDept] = useState('전체');
  const [selectedDoctor, setSelectedDoctor] = useState('전체');

  const departmentList = ['전체', ...Object.keys(DOCTOR_MAP)];
  const doctorList = selectedDept === '전체' ? ['전체'] : ['전체', ...DOCTOR_MAP[selectedDept]];

  useEffect(() => {
    const fetchAllProcedures = async () => {
      const map = {};
      for (const resv of reservations) {
        if (resv.name && resv.birth) {
          try {
            const procedures = await fetchProceduresByName(resv.name, resv.birth);
            map[`${resv.name}_${resv.birth}`] = procedures;
          } catch {
            map[`${resv.name}_${resv.birth}`] = [];
          }
        }
      }
      setProcedureMap(map);
    };
    if (reservations.length > 0) fetchAllProcedures();
    else setProcedureMap({});
  }, [reservations]);

  const filterByDeptAndDoctor = (r) =>
    (selectedDept === '전체' || r.department === selectedDept) &&
    (selectedDoctor === '전체' || r.doctor === selectedDoctor);

  const filterProcedures = (procs) => {
    let filtered = procs;
    if (selectedDept !== '전체') filtered = filtered.filter(p => p.department === selectedDept);
    if (selectedDoctor !== '전체') filtered = filtered.filter(p => p.doctor === selectedDoctor);
    return filtered;
  };

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3 mb-4">
        <label>진료과</label>
        <select className="border rounded px-2 py-1 text-sm" value={selectedDept} onChange={e => { setSelectedDept(e.target.value); setSelectedDoctor('전체'); }}>
          {departmentList.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <label>담당의</label>
        <select className="border rounded px-2 py-1 text-sm" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
          {doctorList.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {reservations.length === 0 ? (
        <div className="mt-5 text-sm p-5 bg-gray-100 rounded text-gray-600 flex items-center gap-2">
          <span className="text-xl">👭</span> 예약이 없습니다.
        </div>
      ) : (
        reservations.filter(filterByDeptAndDoctor).map((resv, i) => {
          const procs = procedureMap[`${resv.name}_${resv.birth}`] || [];
          const filteredProcs = filterProcedures(procs);
          return (
            <div key={resv.id || i} className="bg-white border rounded p-4 mb-3 text-sm shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <strong>
                  {resv.name}
                  {resv.birth && <span className="text-gray-500 ml-2 text-xs">({resv.birth})</span>}
                </strong>
                <span className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs font-medium">{resv.department}</span>
              </div>
              <div className="mb-1">시간: {(resv.startTime && resv.endTime) ? `${resv.startTime}~${resv.endTime}` : '-'} | 상태: {resv.status || '대기'}</div>
              <div>연락처: {resv.phone || '-'}</div>
              <div>성별: {resv.gender || '-'}</div>
              <div>
                <b>시술: </b>
                {filteredProcs.length > 0 ? filteredProcs.map(p => `${p.title} (${p.department}, ${p.doctor})`).join(', ') : '-'}
              </div>
              <div>메모: {resv.memo || resv.notes || '-'}</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => onEdit(resv)} className="bg-yellow-400 text-black rounded px-3 py-1 text-xs font-medium">수정</button>
                <button onClick={() => onDelete(resv.id)} className="bg-red-500 text-white rounded px-3 py-1 text-xs font-medium">삭제</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ReservationDetail;
