// src/contexts/HospitalContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  getHospitalInfo,
  updateHospitalInfo as updateHospitalInfoApi,
} from '../api/hospital.js'; // 경로 확인: hospitalApi 대신 hospital.js로 수정되었을 수 있음

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [hospitalInfoState, setHospitalInfoState] = useState(null);
  const [loading, setLoading] = useState(true);

  // 병원 정보를 서버에서 불러오는 함수
  const fetchHospitalInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getHospitalInfo(); // API 호출
      setHospitalInfoState(response.data); // 상태 업데이트
    } catch (error) {
      console.error('Failed to fetch hospital information:', error);
      alert('Failed to load hospital information.'); // 사용자에게 알림
      setHospitalInfoState({}); // 실패 시 빈 객체로 초기화
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchHospitalInfo();
  }, [fetchHospitalInfo]); // fetchHospitalInfo 의존성 추가 (변하지 않으므로 안전)

  // 병원 정보를 서버에 업데이트하고 로컬 상태를 갱신하는 함수
  const updateHospitalInfo = useCallback(async (newInfo) => {
    setLoading(true); // 저장 시작 시 로딩 상태 설정
    try {
      // 서버 API 호출 (이 함수는 Promise를 반환해야 합니다)
      await updateHospitalInfoApi(newInfo); // 이 호출이 Promise를 반환해야 함

      setHospitalInfoState(newInfo); // 서버 업데이트 성공 시 로컬 상태도 업데이트
      console.log('Hospital information successfully updated:', newInfo);
      return Promise.resolve(); // 성공적으로 완료되었음을 알리는 Promise 반환
    } catch (error) {
      console.error('Failed to update hospital information:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to update hospital information.';
      alert(errorMessage); // 사용자에게 에러 메시지 표시
      return Promise.reject(error); // 에러 발생 시 Promise reject
    } finally {
      setLoading(false); // 저장 완료 시 로딩 상태 해제
    }
  }, []); // 의존성 배열 비워두기 (혹은 필요한 경우 추가)

  const value = {
    hospitalInfo: hospitalInfoState, // 실제 사용될 값
    loading,
    fetchHospitalInfo, // 필요 시 수동으로 다시 불러올 함수
    setHospitalInfo: updateHospitalInfo, // 병원 정보 업데이트 함수 (클라이언트 컴포넌트에서 await 가능하도록 래핑)
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospitalInfo = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospitalInfo must be used within a HospitalProvider');
  }
  return context;
};
