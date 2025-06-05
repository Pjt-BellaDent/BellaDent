import { db } from "../config/firebase.js";

// 진료실 매핑
const roomToDepartment = {
  '1': '보철과',
  '2': '교정과',
  '3': '치주과',
};
const departmentToRoom = Object.fromEntries(Object.entries(roomToDepartment).map(([k, v]) => [v, k]));

// 환자별 최신 시술 불러오기 함수 (비동기)
async function getLatestProcedure(name, birth) {
  try {
    const snapshot = await db.collection("procedures")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .orderBy("date", "desc")
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  } catch {
    return null;
  }
}

export const getWaitingStatus = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db.collection('appointments')
      .where('reservationDate', '==', today)
      .get();

    const rooms = {
      '1': { inTreatment: null, waiting: [] },
      '2': { inTreatment: null, waiting: [] },
      '3': { inTreatment: null, waiting: [] }
    };

    // 병렬 비동기 처리
    const promises = snapshot.docs.map(async doc => {
      const data = doc.data();
      const roomKey = departmentToRoom[data.department];
      if (!roomKey) return;

      // 최신 시술 정보 가져오기
      const latestProcedure = await getLatestProcedure(data.name, data.birth);
      const doctor = latestProcedure?.doctor || null;
      const procedureTitle = latestProcedure?.title || latestProcedure?.name || null;

      if (data.status === '진료중') {
        rooms[roomKey].inTreatment = {
          name: data.name,
          birth: data.birth,
          doctor,
          procedureTitle,
          memo: data.memo || null,
        };
      } else if (data.status === '대기') {
        rooms[roomKey].waiting.push({
          name: data.name,
          birth: data.birth,
          doctor,
          procedureTitle,
          memo: data.memo || null,
        });
      }
    });

    await Promise.all(promises);

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
