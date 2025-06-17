// src/api/appointments.js
import axios from '../libs/axiosIntance';

export const fetchAppointments = async (month) => {
  const { data } = await axios.get('/appointments', {
    params: { month },
  });
  return data;
};

export const fetchAppointmentsByName = async (name, birth) => {
  if (!name || !birth) throw new Error("이름과 생년월일이 필요합니다.");
  const { data } = await axios.get('/appointments', {
    params: { name, birth },
  });
  return data;
};

export const addAppointment = async (payload) => {
  const { data } = await axios.post('/appointments', payload);
  return data;
};

export const updateAppointment = async (id, payload) => {
  const { data } = await axios.put(`/appointments/${id}`, payload);
  return data;
};

export const deleteAppointment = async (id) => {
  await axios.delete(`/appointments/${id}`);
  return true;
};

export const fetchAllAppointments = async () => {
  const { data } = await axios.get('/appointments');
  return data;
};

export const addWaitingPatient = async (payload) => {
  const { data } = await axios.post('/waiting', payload);
  return data;
};
