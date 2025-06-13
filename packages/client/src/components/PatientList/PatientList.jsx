import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PatientTable from './PatientTable';
import ProcedureModal from './ProcedureModal';
import Charts from './Charts';
import EditPatientModal from './EditPatientModal';
import SurveyModal from './SurveyModal';
import { fetchAllPatients, fetchProceduresByName, deletePatient } from '../../api/patients';

const Container = styled.div`
  padding: 30px;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  input, select, button {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
`;

const PatientList = ({ events }) => {
  const [patients, setPatients] = useState([]);
  const [proceduresData, setProceduresData] = useState({});
  const [filter, setFilter] = useState({ name: '', date: '', dept: '', status: '' });
  const [procedureModalOpen, setProcedureModalOpen] = useState(false);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); // 전체 환자 객체!
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editProcedures, setEditProcedures] = useState([]);

  // 환자 데이터 및 시술이력 불러오기 (이름+생년월일로 조회)
  const fetchPatients = async () => {
    try {
      const res = await fetchAllPatients();
      setPatients(res);

      const procData = {};
      for (let p of res) {
        if (!p.name || !p.birth) continue;
        const history = await fetchProceduresByName(p.name, p.birth);
        procData[`${p.name}_${p.birth}`] = history;
      }
      setProceduresData(procData);
    } catch (err) {
      console.error("데이터 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const applyFilter = (list) => {
    return list.filter(p =>
      (!filter.name || p.name.includes(filter.name)) &&
      (!filter.date || p.lastVisit?.includes(filter.date)) &&
      (!filter.dept || p.dept === filter.dept) &&
      (!filter.status || p.status === filter.status)
    );
  };

  const openProcedureModal = (patientObj) => {
    const patient = patients.find(
      p => p.name === patientObj.name && p.birth === patientObj.birth
    );
    if (!patient) return;

    setSelectedPatient({
      ...patient,
      userId: patient.id
    });
    setProcedureModalOpen(true);
  };

  const openEditModal = (patientObj) => {
    const patient = patients.find(
      p => p.name === patientObj.name && p.birth === patientObj.birth
    );
    const key = `${patientObj.name}_${patientObj.birth}`;
    const history = proceduresData[key] || [];
    setEditTarget(patient);
    setEditProcedures(history);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제 중 오류 발생");
    }
  };

  return (
    <Container>
      <h2>📋 환자 리스트</h2>
      <Filters>
        <input
          placeholder="이름"
          value={filter.name}
          onChange={e => setFilter({ ...filter, name: e.target.value })}
        />
        <input
          type="date"
          value={filter.date}
          onChange={e => setFilter({ ...filter, date: e.target.value })}
        />
        <select
          value={filter.dept}
          onChange={e => setFilter({ ...filter, dept: e.target.value })}
        >
          <option value="">진료과 선택</option>
          <option>보철과</option>
          <option>교정과</option>
          <option>치주과</option>
        </select>
        <select
          value={filter.status}
          onChange={e => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">상태</option>
          <option value="예약">예약</option>
          <option value="대기">대기</option>
          <option value="진료완료">진료완료</option>
        </select>
        <button onClick={() => setPatients(applyFilter(patients))}>검색</button>
        <button style={{ marginLeft: 10, background: "#6c757d" }} onClick={fetchPatients}>새로고침</button>
      </Filters>

      <PatientTable
        data={applyFilter(patients)}
        onProcedureClick={(name, birth) => openProcedureModal({ name, birth })}
        onEditClick={(name, birth) => openEditModal({ name, birth })}
        onDeleteClick={handleDelete}
      />

      <EditPatientModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        patientData={editTarget}
        procedures={editProcedures}
      />

      <Charts proceduresData={proceduresData} />

      <ProcedureModal
        open={procedureModalOpen}
        onClose={() => setProcedureModalOpen(false)}
        patient={selectedPatient}
        events={events}
      />

      <SurveyModal
        open={surveyModalOpen}
        onClose={() => setSurveyModalOpen(false)}
        patient={selectedPatient}
      />
    </Container>
  );
};

export default PatientList;
