import express from "express";
import { getTodayAppointments, getDashboardStats } from "../controllers/appointmentController.js";
import { getWeeklyReservations } from "../controllers/appointmentController.js";
import { getMonthlyAppointments } from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/today", getTodayAppointments);
router.get("/stats/chart", getDashboardStats);
router.get("/week", getWeeklyReservations);
router.get("/", getMonthlyAppointments);

export default router;
