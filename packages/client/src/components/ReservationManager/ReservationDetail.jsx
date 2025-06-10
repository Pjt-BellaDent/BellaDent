import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { fetchProceduresByName } from '../../api/patients';

const DOCTOR_MAP = {
  '보철과': ['김치과 원장', '이보철 선생'],
  '교정과': ['박교정 원장', '정교정 선생'],
  '치주과': ['최치주 원장', '한치주 선생'],
};

const Panel = styled.div`
  margin-top: 20px;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 10px;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const Badge = styled.span`
  background: #f1f3f5;
  color: #333;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 12px;
`;

const ButtonGroup = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 6px;

  button {
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }

  .edit { background-color: #ffc107; color: black; }
  .delete { background-color: #dc3545; color: white; }
`;

const EmptyBox = styled.div`
  margin-top: 20px;
  font-size: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "\\ud83d\\udc6d";
    font-size: 20px;
  }
`;

const ReservationDetail = ({ date, events, onEdit, onDelete }) => {
  const reservations = events[date] || [];
  const [procedureMap, setProcedureMap] = useState({});
  const [selectedDept, setSelectedDept] = useState('전체');
  const [selectedDoctor, setSelectedDoctor] = useState('전체');

  const departmentList = ['전체', ...Object.keys(DOCTOR_MAP)];
  const doctorList = selectedDept === '전체'
    ? ['전체']
    : ['전체', ...DOCTOR_MAP[selectedDept]];

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

  // 진료과/의사별 필터
  const filterByDeptAndDoctor = (r) =>
    (selectedDept === '전체' || r.department === selectedDept) &&
    (selectedDoctor === '전체' || r.doctor === selectedDoctor);

  // 시술이력 필터
  const filterProcedures = (procs) => {
    let filtered = procs;
    if (selectedDept !== '전체') filtered = filtered.filter(p => p.department === selectedDept);
    if (selectedDoctor !== '전체') filtered = filtered.filter(p => p.doctor === selectedDoctor);
    return filtered;
  };

  return (
    <Panel>
      <FilterRow>
        <label>진료과</label>
        <select value={selectedDept} onChange={e => { setSelectedDept(e.target.value); setSelectedDoctor('전체'); }}>
          {departmentList.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <label>담당의</label>
        <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
          {doctorList.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </FilterRow>
      {reservations.length === 0 ? (
        <EmptyBox>예약이 없습니다.</EmptyBox>
      ) : (
        reservations
          .filter(filterByDeptAndDoctor)
          .map((resv, i) => {
            const procs = procedureMap[`${resv.name}_${resv.birth}`] || [];
            const filteredProcs = filterProcedures(procs);
            return (
              <Card key={resv.id || i}>
                <MetaRow>
                  <strong>
                    {resv.name}
                    {resv.birth && (
                      <span style={{ fontSize: 13, color: '#888', marginLeft: 6 }}>
                        ({resv.birth})
                      </span>
                    )}
                  </strong>
                  <Badge>{resv.department}</Badge>
                </MetaRow>
                <div style={{ marginBottom: '4px' }}>
                  시간: {(resv.startTime && resv.endTime) ? `${resv.startTime}~${resv.endTime}` : '-'} | 상태: {resv.status || '대기'}
                </div>
                <div>연락처: {resv.phone || '-'}</div>
                <div>성별: {resv.gender || '-'}</div>
                <div>
                  <b>시술: </b>
                  {filteredProcs.length > 0
                    ? filteredProcs.map(p => `${p.title} (${p.department}, ${p.doctor})`).join(', ')
                    : '-'}
                </div>
                <div>메모: {resv.memo || resv.notes || '-'}</div>
                <ButtonGroup>
                  <button className="edit" onClick={() => onEdit(resv)}>수정</button>
                  <button className="delete" onClick={() => onDelete(resv.id)}>삭제</button>
                </ButtonGroup>
              </Card>
            );
          })
      )}
    </Panel>
  );
};

export default ReservationDetail;
