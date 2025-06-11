import axios from '@/libs/axiosInstance';

// 병원 정보 업데이트 API
export const updateHospitalInfo = (data) => {
  return axios.put('/hospital/info', data); // 백엔드 명세에 따라 경로 수정 필요
};
