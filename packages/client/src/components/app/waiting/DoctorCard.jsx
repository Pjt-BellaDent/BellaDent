// src/app/waiting/components/DoctorCard.jsx
import React from 'react';

const DoctorCard = ({ room, doctor, department, status = '대기', current = '', waiting = [] }) => {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-xl shadow p-4 min-w-[280px] w-full">
      <div className="bg-blue-600 text-white text-center text-lg font-bold py-2 rounded-md mb-3">
        {room || '진료실 정보 없음'}
        <span
          className={`ml-3 px-3 py-1 text-sm font-semibold rounded-full ${status === '진료중' ? 'bg-green-500 text-white' : 'bg-yellow-300 text-yellow-800'}`}
        >
          {status}
        </span>
      </div>

      <div className="text-sm text-blue-800 mb-1"><strong>진료과:</strong> {department || '정보 없음'}</div>
      {current && (
        <div className="text-sm text-blue-800 mb-1"><strong>진료 중:</strong> {current}</div>
      )}

      <div className="mt-4">
        <div className="text-blue-700 font-semibold mb-2">대기자 목록 ({waiting.length}명)</div>
        <ul className="pl-4 text-sm text-gray-800 space-y-1">
          {waiting.length === 0 ? (
            <li className="text-gray-400">대기자가 없습니다.</li>
          ) : (
            waiting.map((name, idx) => (
              <li key={idx} className={idx === 0 ? 'font-bold text-blue-600' : ''}>
                {idx + 1}. {name}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default DoctorCard;
