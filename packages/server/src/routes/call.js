import express from "express";
import { db } from "../config/firebase.js"; // Firestore 연동
const router = express.Router();

let callState = null;

// room 번호 → 진료과 매핑
const roomToDepartment = {
  '1': '보철과',
  '2': '교정과',
  '3': '치주과',
};

// 환자 호출 (직원)
router.post("/", async (req, res) => {
  const { name, room } = req.body;

  if (!name || !room) {
    return res.status(400).json({ error: "name, room required" });
  }
  const department = roomToDepartment[room];
  if (!department) {
    return res.status(400).json({ error: "invalid room" });
  }

  const today = new Date().toISOString().slice(0, 10);
  try {
    // 진료실/진료과로 검색 후 진료중으로 업데이트
    const snapshot = await db
      .collection('appointments')
      .where('name', '==', name)
      .where('department', '==', department)
      .where('reservationDate', '==', today)
      .where('status', '==', '대기')
      .get();

    if (!snapshot.empty) {
      await snapshot.docs[0].ref.update({ status: '진료중' });
      // 🔥 상태 DB에 저장 후 0.2초 대기!
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    callState = { name, room, calledAt: Date.now() };
    res.json({ ok: true });
    setTimeout(() => { callState = null; }, 3000);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to call patient", details: err.message });
  }
});

// 호출 상태 조회 (모니터링)
router.get("/", (req, res) => {
  if (!callState) return res.json({});
  res.json(callState);
});

export default router;
