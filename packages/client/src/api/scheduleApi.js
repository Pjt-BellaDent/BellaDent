import axios from '../libs/axiosInstance';

export const fetchSchedulesByMonth = async (month) => {
  const res = await axios.get(`/staff-schedules?month=${month}`);
  return res.data;
};

export const createSchedule = async (data) => {
  const res = await axios.post('/staff-schedules', data);
  return res.data;
};

export const updateSchedule = async (id, data) => {
  const res = await axios.patch(`/staff-schedules/${id}`, data);
  return res.data;
};

export const deleteSchedule = async (id) => {
  const res = await axios.delete(`/staff-schedules/${id}`);
  return res.data;
};
