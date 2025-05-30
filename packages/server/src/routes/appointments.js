import express from "express";
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
router.put('/:id', updateAppointment); // 통합된 업데이트 핸들러
router.delete('/:id', deleteAppointment); // 삭제 핸들러
// appointments.js에 추가
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
      return res.status(404).json({ error: 'Appointment not found' });
    }
    await snapshot.docs[0].ref.update({ status: '진료완료', completedAt: Date.now() }); // 여기!
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
