import axios from '../libs/axiosIntance';

export const fetchSchedulesByMonth = async (month) => {
  try {
    const res = await axios.get(`/staff-schedules?month=${month}`);
    return res.data;
  } catch (error) {
    console.error('스케줄 조회 실패:', error);
    return [];
  }
};

export const createSchedule = async (data) => {
  try {
    const scheduleData = {
      ...data,
      uid: data.uid || data.staffId || data.id,
      scheduleDate: data.scheduleDate,
      position: data.position || data.rank,
      name: data.name,
      time: data.time || '',
      memo: data.memo || '',
      off: data.off || false
    };
    const res = await axios.post('/staff-schedules', scheduleData);
    return res.data;
  } catch (error) {
    console.error('스케줄 생성 실패:', error);
    throw error;
  }
};

export const updateSchedule = async (id, data) => {
  try {
    const scheduleData = {
      ...data,
      uid: data.uid || data.staffId || data.id,
      scheduleDate: data.scheduleDate,
      position: data.position || data.rank,
      name: data.name,
      time: data.time || '',
      memo: data.memo || '',
      off: data.off || false
    };
    const res = await axios.patch(`/staff-schedules/${id}`, scheduleData);
    return res.data;
  } catch (error) {
    console.error('스케줄 수정 실패:', error);
    throw error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    const res = await axios.delete(`/staff-schedules/${id}`);
    return res.data;
  } catch (error) {
    console.error('스케줄 삭제 실패:', error);
    throw error;
  }
};

export const fetchAllStaff = async () => {
  try {
    const res = await axios.get('/users/staff');
    return res.data.staffInfo;
  } catch (error) {
    console.error('직원 목록 조회 실패:', error);
    return [];
  }
};
