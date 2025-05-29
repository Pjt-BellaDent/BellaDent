import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PatientTable from './PatientTable';
import ProcedureModal from './ProcedureModal';
import SurveyModal from './SurveyModal';
import Charts from './Charts';
import EditPatientModal from './EditPatientModal';
import { fetchAllPatients, fetchProceduresByName } from '../../api/patients';

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

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [proceduresData, setProceduresData] = useState({});
  const [filter, setFilter] = useState({ name: '', date: '', dept: '', status: '' });
  const [procedureModalOpen, setProcedureModalOpen] = useState(false);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editProcedures, setEditProcedures] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetchAllPatients();
        setPatients(res);

        const procData = {};
        for (let p of res) {
          const history = await fetchProceduresByName(p.name);
          procData[p.name] = history;
        }
        setProceduresData(procData);
      } catch (err) {
        console.error("데이터 불러오기 실패", err);
      }
    };
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

  const openProcedureModal = (name) => {
    setSelectedPatient(name);
    setProcedureModalOpen(true);
  };

  const openSurveyModal = (name) => {
    setSelectedPatient(name);
    setSurveyModalOpen(true);
  };

  const openEditModal = (name) => {
    const patient = patients.find(p => p.name === name);
    const history = proceduresData[name] || [];
    setEditTarget(patient);
    setEditProcedures(history);
    setEditModalOpen(true);
  };

  return (
    <Container>
      <h2>📋 환자 리스트</h2>

      <Filters>
        <input placeholder="이름" value={filter.name} onChange={e => setFilter({ ...filter, name: e.target.value })} />
        <input type="date" value={filter.date} onChange={e => setFilter({ ...filter, date: e.target.value })} />
        <select value={filter.dept} onChange={e => setFilter({ ...filter, dept: e.target.value })}>
          <option value="">진료과 선택</option>
          <option>보철과</option>
          <option>교정과</option>
          <option>치주과</option>
        </select>
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
          <option value="">상태</option>
          <option value="예약">예약</option>
          <option value="대기">대기</option>
          <option value="진료완료">진료완료</option>
        </select>
        <button onClick={() => setPatients(applyFilter(patients))}>검색</button>
      </Filters>

      <PatientTable
        data={applyFilter(patients)}
        onProcedureClick={openProcedureModal}
        onSurveyClick={openSurveyModal}
        onEditClick={openEditModal}
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
        patientName={selectedPatient}
      />

      <SurveyModal
        open={surveyModalOpen}
        onClose={() => setSurveyModalOpen(false)}
        patientName={selectedPatient}
      />
    </Container>
  );
};

export default PatientList;
