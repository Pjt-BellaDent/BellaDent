import express from "express";
import { db } from "../config/firebase.js";
import {
  getTodayAppointments,
  getDashboardStats,
  getWeeklyReservations,
  getMonthlyAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/today", getTodayAppointments);
router.get("/stats/chart", getDashboardStats);
router.get("/week", getWeeklyReservations);
router.get("/", getMonthlyAppointments);
router.post('/', createAppointment);

// 🔥 반드시 고정 라우트 먼저!
router.put('/complete', async (req, res) => {
  const { name, department } = req.body;
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db.collection('appointments')
      .where('name', '==', name)
      .where('department', '==', department)
      .where('reservationDate', '==', today)
      .where('status', 'in', ['진료중', '대기'])
      .get();
    if (snapshot.empty) {
      console.log('No appointment found for:', { name, department, today, status: ['대기', '진료중'] });
      return res.status(404).json({ error: 'Appointment not found' });
    }
    await snapshot.docs[0].ref.update({ status: '진료완료', completedAt: Date.now() });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/complete-by-name', async (req, res) => {
  const { name, department } = req.body;
  try {
    const snap = await db
      .collection('appointments')
      .where('name', '==', name)
      .where('department', '==', department)
      .where('status', 'in', ['대기', '진료중'])
      .get();
    console.log('쿼리 조건:', { name, department });
    console.log('쿼리 결과 문서수:', snap.size);
    if (snap.empty) {
      console.log('쿼리 결과 없음!');
      return res.status(404).json({ error: '해당 환자 내역 없음' });
    }
    const docRef = snap.docs[0].ref;
    await docRef.update({ status: '진료완료' });
    return res.json({ success: true });
  } catch (err) {
    console.error('에러 메시지:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// 동적 파라미터 라우트는 제일 마지막!
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment); // 삭제 핸들러

export default router;
