// src/app/patients/index.jsx
import React, { useState, useEffect } from 'react';
import PatientTable from "./components/PatientTable";
import EditPatientModal from "./components/EditPatientModal";
import ProcedureModal from "./components/ProcedureModal";
import SurveyModal from "./components/SurveyModal";
import Charts from "./components/Charts";
import axios from '../../../libs/axiosIntance';

const PatientPage = ({ events }) => {
  const [patients, setPatients] = useState([]);
  const [proceduresData, setProceduresData] = useState({});
  const [filter, setFilter] = useState({ name: '', date: '', dept: '', status: '' });
  const [procedureModalOpen, setProcedureModalOpen] = useState(false);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editProcedures, setEditProcedures] = useState([]);

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get('/patients');
      setPatients(data);

      const procData = {};
      for (let p of data) {
        if (!p.name || !p.birth) continue;
        const res = await axios.get(`/procedures/name/${p.name}/${p.birth}`);
        procData[`${p.name}_${p.birth}`] = res.data;
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
    const patient = patients.find(p => p.name === patientObj.name && p.birth === patientObj.birth);
    if (!patient) return;
    setSelectedPatient({ ...patient, userId: patient.id });
    setProcedureModalOpen(true);
  };

  const openEditModal = (patientObj) => {
    const patient = patients.find(p => p.name === patientObj.name && p.birth === patientObj.birth);
    const key = `${patientObj.name}_${patientObj.birth}`;
    const history = proceduresData[key] || [];
    setEditTarget(patient);
    setEditProcedures(history);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/patients/${id}`);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제 중 오류 발생");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">📋 환자 리스트</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          className="p-2 border rounded"
          placeholder="이름"
          value={filter.name}
          onChange={e => setFilter({ ...filter, name: e.target.value })}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={filter.date}
          onChange={e => setFilter({ ...filter, date: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={filter.dept}
          onChange={e => setFilter({ ...filter, dept: e.target.value })}
        >
          <option value="">진료과 선택</option>
          <option>보철과</option>
          <option>교정과</option>
          <option>치주과</option>
        </select>
        <select
          className="p-2 border rounded"
          value={filter.status}
          onChange={e => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">상태</option>
          <option value="예약">예약</option>
          <option value="대기">대기</option>
          <option value="진료완료">진료완료</option>
        </select>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPatients(applyFilter(patients))}
        >검색</button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={fetchPatients}
        >새로고침</button>
      </div>

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
    </div>
  );
};

export default PatientPage;