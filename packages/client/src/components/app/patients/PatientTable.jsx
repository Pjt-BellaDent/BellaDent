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
            <th className="px-4 py-2">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-center">
          {data && data.length > 0 ? data.map(p => (
            <tr key={p.userId || `${p.name}_${p.phone}`}>
              <td>
                <span 
                  className="text-blue-600 font-medium cursor-pointer hover:underline"
                  onClick={() => onProcedureClick && onProcedureClick(p.name, p.birth)}
                >
                  {p.name}
                </span>
              </td>
              <td>{p.gender}</td>
              <td>{p.birth}</td>
              <td>{p.phone}</td>
              <td>{p.department}</td>
              <td>{p.lastVisit}</td>
              <td>
                <div className="flex justify-center gap-2">
                  <button 
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    onClick={() => onEditClick && onEditClick(p.name, p.birth)}
                  >
                    수정
                  </button>
                  <button 
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    onClick={() => onDeleteClick && onDeleteClick(p.userId)}
                  >
                    삭제
                  </button>
                </div>
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
