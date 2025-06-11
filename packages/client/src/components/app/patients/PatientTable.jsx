// src/app/patients/components/PatientTable.jsx
import React from 'react';

const PatientTable = ({ data, onProcedureClick, onEditClick, onDeleteClick }) => {
  return (
    <div className="overflow-x-auto mb-10 rounded-lg border border-gray-300 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">이름</th>
            <th className="px-4 py-2">성별</th>
            <th className="px-4 py-2">생년월일</th>
            <th className="px-4 py-2">전화번호</th>
            <th className="px-4 py-2">진료과</th>
            <th className="px-4 py-2">최근 방문</th>
            <th className="px-4 py-2">기능</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-center">
          {data && data.length > 0 ? data.map(p => (
            <tr key={p.id || `${p.name}_${p.birth}`}>
              <td
                className="text-blue-600 font-medium cursor-pointer hover:underline"
                onClick={() => onProcedureClick(p.name, p.birth)}
              >
                {p.name}
              </td>
              <td>{p.gender}</td>
              <td>{p.birth || '-'}</td>
              <td>{p.phone}</td>
              <td>{p.dept}</td>
              <td>{p.lastVisit}</td>
              <td>
                <button
                  onClick={() => onEditClick(p.name, p.birth)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                >
                  수정
                </button>
                <button
                  onClick={() => onDeleteClick(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" className="py-4 text-gray-500">환자 정보가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
