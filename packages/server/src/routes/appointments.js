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
  getAvailableTimes
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/today", getTodayAppointments);
router.get("/stats/chart", getDashboardStats);
router.get("/week", getWeeklyReservations);
router.get("/available-times", getAvailableTimes); // 예약가능 시간조회 라우트
router.get("/", getMonthlyAppointments);
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
    // === 이 부분에서 users의 lastVisit도 오늘로 업데이트 ===
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

// 진료완료(이름+생년월일) 라우트
router.put('/complete-by-name', async (req, res) => {
  const { name, department, birth } = req.body;
  try {
    const snap = await db
      .collection('appointments')
      .where('name', '==', name)
      .where('birth', '==', birth)
      .where('department', '==', department)
      .where('status', 'in', ['대기', '진료중'])
      .get();
    if (snap.empty) {
      return res.status(404).json({ error: '해당 환자 내역 없음' });
    }
    const docRef = snap.docs[0].ref;
    await docRef.update({ status: '진료완료' });

    // === 진료완료 → users.lastVisit 업데이트 ===
    const today = new Date().toISOString().slice(0, 10);
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

router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
