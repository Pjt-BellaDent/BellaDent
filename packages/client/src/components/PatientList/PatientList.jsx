import React, { useState } from 'react';
import styled from '@emotion/styled';
import PatientTable from './PatientTable';
import ProcedureModal from './ProcedureModal';
import SurveyModal from './SurveyModal';
import Charts from './Charts';
import EditPatientModal from './EditPatientModal';

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
  const [patients] = useState([
    {
      name: '홍길동', gender: '남', age: 35, phone: '010-1234-5678',
      dept: '내과', lastVisit: '2025-05-10', status: '진료 완료'
    },
    {
      name: '김하나', gender: '여', age: 29, phone: '010-5678-1234',
      dept: '소아과', lastVisit: '2025-05-12', status: '예약'
    }
  ]);

  const [proceduresData] = useState({
    "홍길동": [
      { title: "라미네이트", date: "2025-04-02", doctor: "김치과", note: "앞니 6개 시술, 밝기 톤 조정" },
      { title: "스케일링", date: "2025-01-20", doctor: "홍의사", note: "치석 제거, 잇몸 출혈 있음" }
    ],
    "김하나": [
      { title: "잇몸 성형", date: "2025-02-15", doctor: "이치과", note: "미세 잇몸 커팅" }
    ]
  });

  const [filter, setFilter] = useState({ name: '', date: '', dept: '', status: '' });
  const [procedureModalOpen, setProcedureModalOpen] = useState(false);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ✅ 수정용 상태
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editProcedures, setEditProcedures] = useState([]);

  const openProcedureModal = (name) => {
    setSelectedPatient(name);
    setProcedureModalOpen(true);
  };

  const openSurveyModal = (name) => {
    setSelectedPatient(name);
    setSurveyModalOpen(true);
  };

  // ✅ 수정 모달 열기
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

      {/* ✅ 수정 모달 */}
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
