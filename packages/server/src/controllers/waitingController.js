import { db } from "../config/firebase.js";

export const getWaitingStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const snapshot = await db
      .collection("appointments")
      .where("reservationDate", "==", today)
      .get();

    const list = snapshot.docs
      .map(doc => {
        const appt = doc.data();
        return {
          id: doc.id,
          name: appt.name || '이름 정보 없음',
          department: appt.department || '진료과 정보 없음',
          status: appt.status || '상태 정보 없음',
          memo: appt.memo || '',
        };
      })
      .filter(item => item.status === '대기' || item.status === '진료중');

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
