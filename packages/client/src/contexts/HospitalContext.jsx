import React, { createContext, useContext, useState, useEffect } from 'react';
import { getHospitalInfo, updateHospitalInfo } from '../api/hospital';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [hospitalInfo, setHospitalInfoState] = useState({
    name: '', address: '', ceo: '', bizNumber: '', phone: ''
  });
  const [loading, setLoading] = useState(true);

  // 서버에서 병원 정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHospitalInfo();
        setHospitalInfoState(data);
        localStorage.setItem('hospitalInfo', JSON.stringify(data));
      } catch (e) {
        // 서버에 정보 없으면 localStorage fallback
        const saved = localStorage.getItem('hospitalInfo');
        if (saved) setHospitalInfoState(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 병원 정보 저장 (서버+Context+localStorage)
  const setHospitalInfo = async (info) => {
    setHospitalInfoState(info);
    localStorage.setItem('hospitalInfo', JSON.stringify(info));
    try {
      await updateHospitalInfo(info);
    } catch (e) {
      // 서버 저장 실패 시 fallback
    }
  };

  return (
    <HospitalContext.Provider value={{ hospitalInfo, setHospitalInfo, loading }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospitalInfo = () => useContext(HospitalContext);
