// src/components/app/waiting/WaitingStatus.jsx 
import React, { useEffect, useState } from 'react';
import axios from '../../../libs/axiosInstance.js';
import { fetchAllStaff } from '../../../api/scheduleApi';

const WaitingStatus = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = async () => {
    try {
      const [staffRes, waitingRes] = await Promise.all([
        fetchAllStaff(),
        axios.get('/waiting'),
      ]);

      const staff = staffRes.filter(
        (s) => s.role === 'manager' && s.name !== '매니져'
      );
      const waitingList = waitingRes.data;

      const doctorsMap = new Map(
        staff.map((doc) => [doc.uid, { ...doc, 진료중: [], 대기: [] }])
      );

      waitingList.forEach((patient) => {
        const doctor = doctorsMap.get(patient.doctorId);
        if (doctor) {
          if (patient.status === '진료중') {
            doctor.진료중.push(patient);
          } else if (patient.status === '대기') {
            doctor.대기.push(patient);
          }
        }
      });
      setDoctors(Array.from(doctorsMap.values()));
    } catch (err) {
      console.error('데이터 로딩 실패', err);
    }
  };

  useEffect(() => {
    fetchData();
    const fetchInterval = setInterval(fetchData, 5000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <header className="flex justify-between items-center pb-6 border-b border-gray-700">
        <h1 className="text-4xl font-bold">진료 현황</h1>
        <div className="text-right">
          <p className="text-2xl font-semibold">
            {currentTime.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-4xl font-bold text-blue-400">
            {currentTime.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {doctors.map((doctor) => (
          <div
            key={doctor.uid}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold">{doctor.name}</h2>
            <p className="text-blue-400 mb-6">{doctor.department}</p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-400 border-b-2 border-green-400 pb-2 mb-3">
                진료중
              </h3>
              <div className="bg-gray-700 rounded-lg p-4 h-24 flex items-center justify-center">
                {doctor.진료중.length > 0 ? (
                  <span className="text-2xl font-bold">
                    {doctor.진료중[0].name}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-yellow-400 border-b-2 border-yellow-400 pb-2 mb-3">
                대기
              </h3>
              <ul className="space-y-3">
                {doctor.대기.slice(0, 5).map((patient) => (
                  <li
                    key={patient.id}
                    className="bg-gray-700 rounded-lg p-4 text-xl font-semibold text-center"
                  >
                    {patient.name}
                  </li>
                ))}
                {doctor.대기.length === 0 && (
                  <li className="bg-gray-700 rounded-lg p-4 text-xl font-semibold text-center text-gray-500">
                    -
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default WaitingStatus;
