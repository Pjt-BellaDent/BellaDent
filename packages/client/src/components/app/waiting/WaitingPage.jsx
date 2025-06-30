// src/components/app/waiting/WaitingPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from '../../../libs/axiosInstance.js';
import { fetchAllStaff } from '../../../api/scheduleApi';
import WaitingManager from './WaitingManager';

const DEPARTMENTS = ['전체', '보철과', '교정과', '치주과', '심미치료', '교정/미백', '일반 진료/보철'];

const WaitingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState('전체');

  const processWaitingData = (staff, waiting) => {
    const staffMap = new Map(staff.map(doc => [doc.uid, { ...doc, waitingPatients: [] }]));
    const activeWaitingList = waiting.filter(
      patient => patient.status !== '진료완료' && patient.status !== '완료'
    );
    activeWaitingList.forEach(patient => {
      if (staffMap.has(patient.doctorId)) {
        staffMap.get(patient.doctorId).waitingPatients.push(patient);
      }
    });
    return Array.from(staffMap.values());
  };

  const fetchData = async () => {
    try {
      console.log("A. 대기 페이지: 데이터 가져오기 시작...");
      const [staffResponse, waiting] = await Promise.all([
        fetchAllStaff(),
        axios.get('/waiting').then(res => res.data)
      ]);
      console.log("B. 대기 페이지: 가져온 원본 데이터:", { staffResponse, waiting });

      const managerStaff = staffResponse.filter(
        member => member.role === 'manager' && member.name !== '매니져'
      );
      console.log("C. 대기 페이지: 필터링된 의사 목록:", managerStaff);
      
      const processedDoctors = processWaitingData(managerStaff, waiting);
      console.log("D. 대기 페이지: 최종 처리된 데이터:", processedDoctors);
      setDoctors(processedDoctors);
    } catch (error) {
      console.error('E. 대기 페이지: 데이터 로딩 또는 처리 실패:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredDoctors = useMemo(() => {
    if (selectedDept === '전체') return doctors;
    return doctors.filter(doc => doc.department === selectedDept);
  }, [selectedDept, doctors]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <WaitingManager 
        doctors={filteredDoctors} 
        fetchData={fetchData}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
      />
    </div>
  );
};

export default WaitingPage;
