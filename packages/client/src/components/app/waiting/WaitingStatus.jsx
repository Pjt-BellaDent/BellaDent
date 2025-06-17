// src/app/waiting/components/WaitingStatus.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../../libs/axiosIntance';

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
        // 배열이면 진료과 기준으로 분류
        if (Array.isArray(data)) {
          const newRooms = makeInit();
          data.forEach(item => {
            const roomKey =
              item.department === '보철과' ? '1'
              : item.department === '교정과' ? '2'
              : item.department === '치주과' ? '3'
              : null;
            if (roomKey) {
              if (item.status === '진료중') {
                newRooms[roomKey].inTreatment = item;
              } else if (item.status !== '진료완료') {
                newRooms[roomKey].waiting.push(item);
              }
            }
          });
          setRooms(newRooms);
        } else {
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
            <div className="flex flex-col justify-center items-center min-h-[80px] py-10">
              {rooms[room.key].inTreatment && rooms[room.key].inTreatment.status === '진료중' ? (
                <span>
                  <span className="text-blue-700 font-bold text-2xl">진료중 </span>
                  <span className="text-orange-500 font-bold text-2xl ml-2">{rooms[room.key].inTreatment.name}</span>
                </span>
              ) : (
                <span className="text-red-600 font-bold text-2xl">준비중</span>
              )}
            </div>
            <div className="bg-blue-50 py-4 min-h-[220px]">
              {[...Array(MAX_WAIT)].map((_, i) => {
                // '진료완료' 상태 환자는 대기열에서 제외
                const waitingList = rooms[room.key].waiting.filter(p => p.status !== '진료완료');
                const patient = waitingList[i];
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
                <span>{rooms[room.key].waiting.filter(p => p.status !== '진료완료').length} 명</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaitingStatus;
