const BASE_URL = 'http://localhost:3000/staff-schedules';

// 월별 스케줄 조회
export const fetchSchedulesByMonth = async (month) => {
  try {
    const res = await fetch(`${BASE_URL}?month=${month}`);
    return await res.json();
  } catch (err) {
    console.error('📥 스케줄 불러오기 실패:', err);
    return [];
  }
};

// 스케줄 등록
export const createSchedule = async (data) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('➕ 스케줄 등록 실패:', err);
  }
};

// 스케줄 수정
export const updateSchedule = async (id, data) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('✏️ 스케줄 수정 실패:', err);
  }
};

// 스케줄 삭제
export const deleteSchedule = async (id) => {
  try {
    await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.error('🗑️ 스케줄 삭제 실패:', err);
  }
};
