import { db } from "../config/firebase.js";

// 진료실 매핑
const roomToDepartment = {
  '1': '보철과',
  '2': '교정과',
  '3': '치주과',
};
const departmentToRoom = Object.fromEntries(Object.entries(roomToDepartment).map(([k,v])=>[v,k]));

export const getWaitingStatus = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db.collection('appointments')
      .where('reservationDate', '==', today)
      .get();

    const now = Date.now();
    const rooms = { '1': { inTreatment: '', waiting: [] }, '2': { inTreatment: '', waiting: [] }, '3': { inTreatment: '', waiting: [] } };
    const departmentToRoom = { '보철과': '1', '교정과': '2', '치주과': '3' };

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const roomKey = departmentToRoom[data.department];
      if (!roomKey) return;

      // 진료중 or 진료완료(2초 이내)
      if (
        data.status === '진료중' ||
        (data.status === '진료완료' && data.completedAt && now - data.completedAt < 2000)
      ) {
        rooms[roomKey].inTreatment = data.name;
      } else if (data.status === '대기') {
        rooms[roomKey].waiting.push(data.name);
      }
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};