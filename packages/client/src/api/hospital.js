// src/api/hospital.js
import axios from '../libs/axiosInstance.js';

export const getHospitalInfo = async () => {
  return axios.get('/hospital/info');
};

export const updateHospitalInfo = async (data) => {
  return axios.put('/hospital/info', data);
};
