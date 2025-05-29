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

export default router;
