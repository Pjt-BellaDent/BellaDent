// src/components/app/patients/PatientTable.jsx
import React from 'react';

function formatPhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
}

function formatDateOnly(dateStr) {
  if (
    dateStr &&
    typeof dateStr === 'object' &&
    typeof dateStr._seconds === 'number'
  ) {
    const d = new Date(dateStr._seconds * 1000);
    return d.toISOString().slice(0, 10);
  }
  if (!dateStr || typeof dateStr !== 'string') return '';
  const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : dateStr;
}

const PatientTable = ({
  data,
  onProcedureClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="overflow-x-auto mb-10 rounded-lg border border-gray-300 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">이름</th>
            <th className="px-4 py-2">성별</th>
            <th className="px-4 py-2">생년월일</th>
            <th className="px-4 py-2">전화번호</th>
            <th className="px-4 py-2">최근 방문</th>
            <th className="px-4 py-2">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-center">
          {data && data.length > 0 ? (
            data.map((p, idx) => (
              <tr
                key={p.userId || `${p.name}_${p.phone}`}
                className={`${
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50 transition-colors`}
              >
                <td>
                  <span
                    className="text-blue-700 font-semibold cursor-pointer hover:underline"
                    onClick={() =>
                      onProcedureClick && onProcedureClick(p.name, p.birth)
                    }
                  >
                    {p.name}
                  </span>
                </td>
                <td>
                  {p.gender === '남' || p.gender === 'M' ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold">
                      남
                    </span>
                  ) : p.gender === '여' || p.gender === 'F' ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-pink-100 text-pink-700 text-xs font-bold">
                      여
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-bold">
                      -
                    </span>
                  )}
                </td>
                <td>{p.birth}</td>
                <td>
                  <span className="text-gray-700 font-mono">
                    {formatPhone(p.phone)}
                  </span>
                </td>
                <td>{formatDateOnly(p.lastVisitDate)}</td>
                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors shadow"
                      onClick={() =>
                        onEditClick && onEditClick(p.name, p.birth)
                      }
                    >
                      수정
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors shadow"
                      onClick={() => onDeleteClick && onDeleteClick(p.id)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-gray-500">
                환자 정보가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
