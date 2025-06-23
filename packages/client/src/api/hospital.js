import axios from '../libs/axiosIntance';

// 병원 정보 조회 API
export const getHospitalInfo = () => {
  return axios.get('/hospital/info');
};

// 병원 정보 업데이트 API
export const updateHospitalInfo = (data) => {
  return axios.put('/hospital/info', data); // 백엔드 명세에 따라 경로 수정 필요
};
