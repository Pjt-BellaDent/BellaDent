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
      .collection("appointments")
      .where("name", "==", name)
      .where("department", "==", department)
      .where("reservationDate", "==", today)
      .where("status", "in", ["대기"])
      .get();
    console.log(`[call.js] 호출 요청: ${name}, ${room}`);
    console.log(`[call.js] DB조회결과(대기):`, snapshot.size);
    if (!snapshot.empty) {
      await snapshot.docs[0].ref.update({ status: "진료중" });
      console.log(`[call.js] status -> 진료중 반영됨: ${name}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    callState = { name, room, calledAt: Date.now() };
    console.log(`[call.js] callState set:`, callState);
    res.json({ ok: true });
    setTimeout(() => {
      callState = null;
      console.log(`[call.js] callState cleared`);
    }, 2000);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// 호출 상태 조회 (모니터링)
router.get("/", (req, res) => {
  if (!callState) return res.json({});
  res.json(callState);
});

export default router;
