// client/src/api/appointments.js
import axios from "../libs/axiosInstance";

export const fetchAppointments = async () => {
  const res = await axios.get("/appointments");
  return res.data;
};

export const fetchAppointmentById = async (appointmentId) => {
  const res = await axios.get(`/appointments/${appointmentId}`);
  return res.data;
};

export const createAppointment = async (appointmentData) => {
  const res = await axios.post("/appointments", appointmentData);
  return res.data;
};

export const updateAppointment = async (appointmentId, updateData) => {
  const res = await axios.put(`/appointments/${appointmentId}`, updateData);
  return res.data;
};

export const deleteAppointment = async (appointmentId) => {
  const res = await axios.delete(`/appointments/${appointmentId}`);
  return res.data;
};
