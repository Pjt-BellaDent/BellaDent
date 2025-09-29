// src/app/waiting/components/WaitingManager.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../libs/axiosInstance.js';

const DEPARTMENTS = [
  '전체',
  '보철과',
  '교정과',
  '치주과',
  '심미치료',
  '교정/미백',
  '일반 진료/보철',
];

const WaitingManager = ({
  doctors = [],
  fetchData,
  selectedDept,
  setSelectedDept,
}) => {
  const navigate = useNavigate();

  const handleAction = async (action, patient) => {
    const { id } = patient;
    try {
      let newStatus = '';
      switch (action) {
        case 'call':
          newStatus = '진료중';
          break;
        case 'complete':
          newStatus = '진료완료';
          break;
        case 'cancel':
          newStatus = '대기';
          break;
        default:
          return;
      }
      await axios.put(`/waiting/${id}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert(`${action} 처리 실패: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">진료 대기 관리</h2>
        <button
          onClick={() => navigate('/waiting-status')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition"
        >
          모니터링
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="p-2 border rounded-md"
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center">
            해당 진료과의 의사가 없거나 대기 환자가 없습니다.
          </p>
        ) : (
          doctors.map((doctor) => (
            <div
              key={doctor.uid}
              className="bg-white border rounded-xl shadow-md p-4"
            >
              <h3 className="text-lg font-bold text-gray-800">
                {doctor.name}{' '}
                <span className="text-sm font-normal text-gray-500">
                  ({doctor.department})
                </span>
              </h3>
              <div className="mt-3 space-y-3">
                {doctor.waitingPatients.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4 text-center">
                    대기 환자가 없습니다.
                  </p>
                ) : (
                  doctor.waitingPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="border p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-blue-800">
                            {patient.name}{' '}
                            <span className="text-sm text-gray-500 ml-1">
                              ({patient.birth})
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            상태: {patient.status}
                          </p>
                          <p className="text-sm text-gray-600">
                            시술:{' '}
                            {patient.procedureTitle || patient.title || '-'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {patient.status === '대기' && (
                            <button
                              onClick={() => handleAction('call', patient)}
                              className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                            >
                              호출
                            </button>
                          )}
                          {patient.status === '진료중' && (
                            <button
                              onClick={() => handleAction('cancel', patient)}
                              className="px-3 py-1 bg-gray-400 text-white rounded-md text-sm hover:bg-gray-500"
                            >
                              호출 취소
                            </button>
                          )}
                          {(patient.status === '진료중' ||
                            patient.status === '대기') && (
                            <button
                              onClick={() => handleAction('complete', patient)}
                              className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                            >
                              완료
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WaitingManager;
