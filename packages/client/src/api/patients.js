// src/api/patients.js
import axiosInstance from '../libs/axiosInstance';

export const fetchAllPatients = async () => {
  const { data } = await axiosInstance.get('/users/patients/all');
  return data;
};

export const fetchProceduresByName = async (name, birth) => {
  if (!name || !birth) throw new Error('이름과 생년월일이 필요합니다.');
  const { data } = await axiosInstance.get('/procedures', {
    params: { name, birth },
  });
  return data;
};

export const fetchAppointments = async (month) => {
  const { data } = await axiosInstance.get('/appointments', {
    params: { month },
  });
  return data;
};

export const addProcedure = async (payload) => {
  const { data } = await axiosInstance.post('/procedures', payload);
  return data;
};

export const updatePatient = async (id, payload) => {
  const { data } = await axiosInstance.put(`/users/patients/${id}`, payload);
  return data;
};

export const deletePatient = async (id) => {
  await axiosInstance.delete(`/users/patients/${id}`);
  return true;
};

export const addAppointment = async (payload) => {
  const { data } = await axiosInstance.post('/appointments', payload);
  return data;
};

export const updateAppointment = async (id, payload) => {
  const { data } = await axiosInstance.put(`/appointments/${id}`, payload);
  return data;
};

export const deleteAppointment = async (id) => {
  await axiosInstance.delete(`/appointments/${id}`);
  return true;
};

export const addWaitingPatient = async (payload) => {
  const { data } = await axiosInstance.post('/waiting', payload);
  return data;
};
