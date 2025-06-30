// src/app/patients/index.jsx
import React, { useState, useEffect } from 'react';
import PatientTable from "./PatientTable";
import EditPatientModal from "./EditPatientModal";
import ProcedureModal from "./ProcedureModal";
import SurveyModal from "./SurveyModal";
import axios from '../../../libs/axiosInstance.js';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { fetchAllPatients } from '../../../api/patients';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];

const SORT_OPTIONS = [
  { value: 'lastVisit', label: '최근 방문일자순' },
  { value: 'name', label: '이름순' },
  { value: 'age', label: '나이순' },
];

// 나이대 계산 함수
function getAgeGroup(birth) {
  if (!birth) return '기타';
  const year = Number(birth.split('-')[0]);
  if (!year || isNaN(year)) return '기타';
  const age = new Date().getFullYear() - year;
  if (age < 10) return '10세 미만';
  if (age < 20) return '10대';
  if (age < 30) return '20대';
  if (age < 40) return '30대';
  if (age < 50) return '40대';
  if (age < 60) return '50대';
  if (age < 70) return '60대';
  if (age < 80) return '70대';
  return '80세 이상';
}

const AGE_ORDER = [
  '10세 미만', '10대', '20대', '30대', '40대', '50대', '60대', '70대', '80세 이상', '기타'
];
const AgeChart = ({ patients }) => {
  const groups = {};
  patients.forEach(p => {
    const g = getAgeGroup(p.birth);
    groups[g] = (groups[g] || 0) + 1;
  });
  // 나이대 라벨을 미리 정해진 순서로 정렬
  const labels = AGE_ORDER.filter(label => groups[label]);
  const data = labels.map(label => groups[label] || 0);
  return (
    <Bar
      data={{
        labels,
        datasets: [{
          label: '인원수',
          data,
          backgroundColor: '#4f8cff',
        }]
      }}
      options={{
        plugins: { legend: { display: false } },
        responsive: true,
        scales: { y: { beginAtZero: true, stepSize: 1 } }
      }}
    />
  );
};

const GenderChart = ({ patients }) => {
  const counts = { 남: 0, 여: 0, 기타: 0 };
  patients.forEach(p => {
    if (p.gender === '남' || p.gender === 'M') counts['남']++;
    else if (p.gender === '여' || p.gender === 'F') counts['여']++;
    else counts['기타']++;
  });
  return (
    <Bar
      data={{
        labels: Object.keys(counts),
        datasets: [{
          label: '인원수',
          data: Object.values(counts),
          backgroundColor: ['#4f8cff', '#ff6b81', '#aaa'],
        }]
      }}
      options={{
        plugins: { legend: { display: false } },
        responsive: true,
        scales: { y: { beginAtZero: true, stepSize: 1 } }
      }}
    />
  );
};

const PatientPage = ({ events }) => {
  const [patients, setPatients] = useState([]);
  const [proceduresData, setProceduresData] = useState({});
  const [filter, setFilter] = useState({ name: '', date: '', dept: '' });
  const [procedureModalOpen, setProcedureModalOpen] = useState(false);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editProcedures, setEditProcedures] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('lastVisit');

  const fetchPatients = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const waitingRes = await axios.get('/waiting', { params: { date: today } });

      // [key, value] 쌍의 배열을 사용하여 Map을 올바르게 생성합니다.
      const patientLastVisit = (waitingRes.data || []).reduce((acc, p) => {
        if (p.status === '완료' && p.completedAt) {
          const key = `${p.name}-${p.birth}`;
          if (!acc[key] || new Date(p.completedAt) > new Date(acc[key])) {
            acc[key] = p.completedAt;
          }
        }
        return acc;
      }, {});
      const waitingMap = new Map(Object.entries(patientLastVisit));
      
      const patientsRes = await fetchAllPatients();
      // API 응답 구조에 맞게 patientsRes.patientsInfo 배열을 사용합니다.
      const patientsArray = patientsRes.patientsInfo || [];

      // 이름, 성별, 생년월일, 전화번호가 모두 있는 환자만 필터링합니다.
      const validPatients = patientsArray.filter(p => 
        p.name && p.gender && p.birth && p.phone
      );

      const combined = validPatients.map(p => ({
        ...p,
        lastVisitDate: waitingMap.get(`${p.name}-${p.birth}`) || p.patientInfo?.lastVisitDate || ''
      }));
      setPatients(combined);

      const procData = {};
      for (let p of combined) {
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
      (!filter.dept || p.dept === filter.dept)
    );
  };

  const filteredPatients = applyFilter(patients);
  // 정렬
  filteredPatients.sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortBy === 'age') {
      // 생년월일 내림차순(나이 많은 순)
      return (a.birth || '').localeCompare(b.birth || '');
    } else if (sortBy === 'lastVisit') {
      // 최근 방문일자 내림차순
      return (b.lastVisit || '').localeCompare(a.lastVisit || '');
    }
    return 0;
  });
  const pageCount = Math.ceil(filteredPatients.length / pageSize);
  const pagedPatients = filteredPatients.slice((page - 1) * pageSize, page * pageSize);

  // 네이버 카페 스타일 페이지네이션 계산
  const pageGroup = Math.floor((page - 1) / 10);
  const startPage = pageGroup * 10 + 1;
  const endPage = Math.min(startPage + 9, pageCount);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  // 페이지/표시개수 변경 시 첫 페이지로 이동
  useEffect(() => { setPage(1); }, [pageSize, filter]);

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

      <div className="flex flex-wrap gap-4 mb-4 items-center">
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
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPatients(applyFilter(patients))}
        >검색</button>
        {/* 표시 개수 드롭다운 */}
        <select
          className="p-2 border rounded ml-4"
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}명씩 보기</option>
          ))}
        </select>
      </div>

      <PatientTable
        data={pagedPatients}
        onProcedureClick={(name, birth) => openProcedureModal({ name, birth })}
        onEditClick={(name, birth) => openEditModal({ name, birth })}
        onDeleteClick={handleDelete}
      />

      {/* 네이버 카페 스타일 페이지네이션 */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-1 mb-8">
          <button
            className="px-2 py-1 rounded border text-sm"
            disabled={startPage === 1}
            onClick={() => setPage(startPage - 1)}
          >
            이전
          </button>
          {pageNumbers.map(num => (
            <button
              key={num}
              className={`px-3 py-1 rounded border text-sm ${num === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="px-2 py-1 rounded border text-sm"
            disabled={endPage === pageCount}
            onClick={() => setPage(endPage + 1)}
          >
            다음
          </button>
        </div>
      )}

      <EditPatientModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        patientData={editTarget}
        procedures={editProcedures}
      />

      {/* 나이대/성별 차트 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold mb-4">환자 나이대 분포</h3>
          <AgeChart patients={patients} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold mb-4">환자 성별 분포</h3>
          <GenderChart patients={patients} />
        </div>
      </div>

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