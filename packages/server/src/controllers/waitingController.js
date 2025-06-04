import { db } from "../config/firebase.js";

// 진료실 매핑
const roomToDepartment = {
  '1': '보철과',
  '2': '교정과',
  '3': '치주과',
};
const departmentToRoom = Object.fromEntries(Object.entries(roomToDepartment).map(([k, v]) => [v, k]));
export const getWaitingStatus = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db.collection('appointments')
      .where('reservationDate', '==', today)
      .get();

    const rooms = { '1': { inTreatment: '', waiting: [] }, '2': { inTreatment: '', waiting: [] }, '3': { inTreatment: '', waiting: [] } };
    const departmentToRoom = { '보철과': '1', '교정과': '2', '치주과': '3' };
    let debugState = [];

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const roomKey = departmentToRoom[data.department];
      if (!roomKey) return;
      // 확장: 이름+생년월일 모두 넘기기 위해 waiting.push({ name, birth })
      if (data.status === '진료중') {
        rooms[roomKey].inTreatment = { name: data.name, birth: data.birth };
      } else if (data.status === '대기') {
        rooms[roomKey].waiting.push({ name: data.name, birth: data.birth });
      }
      debugState.push({ name: data.name, birth: data.birth, department: data.department, status: data.status });
    });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
