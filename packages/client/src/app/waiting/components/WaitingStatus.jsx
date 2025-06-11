// src/app/waiting/components/WaitingStatus.jsx
import React, { useEffect, useState } from 'react';
import axios from '@/libs/axiosInstance';

const ROOMS = [
  { key: '1', label: '① 진료실', doctor: '남성안', department: '보철과' },
  { key: '2', label: '② 진료실', doctor: '염현정', department: '교정과' },
  { key: '3', label: '③ 진료실', doctor: '김영철', department: '치주과' }
];

const MAX_WAIT = 5;
const makeInit = () => {
  const obj = {};
  ROOMS.forEach(r => { obj[r.key] = { inTreatment: '', waiting: [] }; });
  return obj;
};

const WaitingStatus = () => {
  const [rooms, setRooms] = useState(makeInit());

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('/waiting/status');
        if (!Array.isArray(data) && typeof data === 'object') {
          setRooms(data);
        }
      } catch (e) {}
    };
    fetchRooms();
    const interval = setInterval(fetchRooms, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-800 to-blue-400 min-h-screen flex flex-col items-center pt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {ROOMS.map(room => (
          <div key={room.key} className="bg-white border-4 border-blue-300 rounded-2xl shadow-md overflow-hidden">
            <div className="bg-blue-700 text-white text-center text-xl font-bold py-3">
              {room.label}
              <div className="text-yellow-300 font-semibold text-base mt-1">원장 {room.doctor}</div>
            </div>
            {rooms[room.key].inTreatment ? (
              <div className="text-center text-blue-700 font-bold text-2xl py-6">
                진료중 <span className="text-orange-500 text-3xl ml-2">{rooms[room.key].inTreatment.name}</span>
              </div>
            ) : (
              <div className="text-center text-red-600 text-2xl font-bold py-10">준비중</div>
            )}
            <div className="bg-blue-50 py-4 min-h-[220px]">
              {[...Array(MAX_WAIT)].map((_, i) => {
                const patient = rooms[room.key].waiting[i];
                return (
                  <div key={i} className="flex items-center text-blue-800 px-6 py-2 border-b border-blue-200">
                    <span className="w-16 font-bold">대기{i + 1}</span>
                    <span className="flex-1 text-lg font-semibold">
                      {patient ? patient.name : <span className="text-gray-400">-</span>}
                    </span>
                  </div>
                );
              })}
              <div className="flex justify-between items-center bg-blue-100 text-blue-800 font-bold px-6 py-3">
                <span>대기인수</span>
                <span>{rooms[room.key].waiting.length} 명</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaitingStatus;
