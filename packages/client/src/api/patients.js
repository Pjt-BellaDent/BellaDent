// src/api/patients.js
import axios from '../libs/axiosInstance.js';

export const fetchAllPatients = async () => {
  const { data } = await axios.get('/users/patients/all');
  return data;
};

export const fetchProceduresByName = async (name, birth) => {
  if (!name || !birth) throw new Error("이름과 생년월일이 필요합니다.");
  const { data } = await axios.get('/procedures', {
    params: { name, birth }
  });
  return data;
};

export const fetchAppointments = async (month) => {
  const { data } = await axios.get('/appointments', {
    params: { month }
  });
  return data;
}

export const addProcedure = async (payload) => {
  const { data } = await axios.post('/procedures', payload);
  return data;
};

export const updatePatient = async (id, payload) => {
  const { data } = await axios.put(`/users/patients/${id}`, payload);
  return data;
};

export const deletePatient = async (id) => {
  await axios.delete(`/users/patients/${id}`);
  return true;
};

export const addAppointment = async (payload) => {
  const { data } = await axios.post('/appointments', payload);
  return data;
};

export const updateAppointment = async (id, payload) => {
  const { data } = await axios.put(`/appointments/${id}`, payload);
  return data;
}

export const deleteAppointment = async (id) => {
  await axios.delete(`/appointments/${id}`);
  return true;
}

export const addWaitingPatient = async (payload) => {
  const { data } = await axios.post('/waiting', payload);
  return data;
};
