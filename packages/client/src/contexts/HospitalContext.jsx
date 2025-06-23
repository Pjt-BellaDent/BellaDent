import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getHospitalInfo, updateHospitalInfo as updateHospitalInfoApi } from '../api/hospital';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHospitalInfo = useCallback(async () => {
    try {
      setLoading(true);
      const info = await getHospitalInfo();
      setHospitalInfo(info);
    } catch (error) {
      console.error("병원 정보를 불러오는데 실패했습니다:", error);
      // 실패 시 기본값 또는 빈 객체 설정 가능
      setHospitalInfo({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitalInfo();
  }, [fetchHospitalInfo]);

  // 병원 정보 업데이트 함수
  const saveHospitalInfo = useCallback(async (newInfo) => {
    try {
      await updateHospitalInfoApi(newInfo);
      // 로컬 상태를 즉시 업데이트하여 빠른 피드백 제공
      setHospitalInfo(prevInfo => ({ ...prevInfo, ...newInfo }));
    } catch (error) {
      console.error("병원 정보 업데이트 실패:", error);
      throw error; // 에러를 호출한 컴포넌트로 다시 던져서 처리할 수 있도록 함
    }
  }, []);

  const value = { hospitalInfo, loading, fetchHospitalInfo, updateHospitalInfo: saveHospitalInfo };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospitalInfo = () => useContext(HospitalContext);
