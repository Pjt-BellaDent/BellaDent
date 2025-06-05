import express from "express";
import { db } from "../config/firebase.js";
import {
  getTodayAppointments,
  getDashboardStats,
  getWeeklyReservations,
  getMonthlyAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailableTimes,
  getAppointmentsByName // ⭐ 추가!
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/today", getTodayAppointments);
router.get("/stats/chart", getDashboardStats);
router.get("/week", getWeeklyReservations);
router.get("/available-times", getAvailableTimes);

// ⭐⭐ 핵심! name+birth 쿼리 있으면 getAppointmentsByName로 전체 예약 이력 반환
router.get("/", (req, res, next) => {
  if (req.query.name && req.query.birth) {
    return getAppointmentsByName(req, res, next);
  }
  return getMonthlyAppointments(req, res, next);
});

router.post('/', createAppointment);

// 진료완료 처리 라우트
router.put('/complete', async (req, res) => {
  const { name, department, birth } = req.body;
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db.collection('appointments')
      .where('name', '==', name)
      .where('birth', '==', birth)
      .where('department', '==', department)
      .where('reservationDate', '==', today)
      .where('status', 'in', ['진료중', '대기'])
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    await snapshot.docs[0].ref.update({ status: '진료완료', completedAt: Date.now() });
    // === users의 lastVisit도 오늘로 업데이트 ===
    const userSnap = await db.collection('users')
      .where('name', '==', name)
      .where('birth', '==', birth)
      .get();
    userSnap.forEach(doc => {
      doc.ref.update({ lastVisit: today });
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 진료완료(이름+생년월일) 라우트 - 날짜 조건 추가!!
router.put('/complete-by-name', async (req, res) => {
  const { name, department, birth } = req.body;
  const today = new Date().toISOString().slice(0, 10); // 오늘 날짜
  try {
    const snap = await db
      .collection('appointments')
      .where('name', '==', name)
      .where('birth', '==', birth)
      .where('department', '==', department)
      .where('reservationDate', '==', today)  // 날짜 조건
      .where('status', 'in', ['대기', '진료중'])
      .get();
    if (snap.empty) {
      return res.status(404).json({ error: '해당 환자 내역 없음' });
    }
    const docRef = snap.docs[0].ref;
    await docRef.update({ status: '진료완료' });

    // 진료완료 → users.lastVisit 업데이트
    const userSnap = await db.collection('users')
      .where('name', '==', name)
      .where('birth', '==', birth)
      .get();
    userSnap.forEach(doc => {
      doc.ref.update({ lastVisit: today });
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 👇 진료중→대기로 변경하는 호출 취소 라우트
router.put('/back-to-waiting', async (req, res) => {
  const { name, department, birth } = req.body;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const snap = await db
      .collection('appointments')
      .where('name', '==', name)
      .where('birth', '==', birth)
      .where('department', '==', department)
      .where('reservationDate', '==', today)
      .where('status', '==', '진료중')
      .get();

    if (snap.empty) {
      return res.status(404).json({ error: '대상 예약이 없습니다.' });
    }
    await snap.docs[0].ref.update({ status: '대기' });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
