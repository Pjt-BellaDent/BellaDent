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
          <option>진료과 선택</option>
          <option>내과</option>
          <option>소아과</option>
          <option>정형외과</option>
        </select>
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
          <option>상태</option>
          <option>예약</option>
          <option>진료 중</option>
          <option>완료</option>
        </select>
        <button>검색</button>
      </Filters>

      <PatientTable
        data={patients}
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
