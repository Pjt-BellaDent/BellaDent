// src/routes/appointments.js
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
  getAppointmentsByName,
  getAppointmentsByDoctorId,
} from "../controllers/appointmentsController.js";

const router = express.Router();

router.get("/today", getTodayAppointments);
router.get("/stats/chart", getDashboardStats);
router.get("/week", getWeeklyReservations);

router.get("/", (req, res, next) => {
  if (req.query.name && req.query.birth) {
    return getAppointmentsByName(req, res, next);
  }
  return getMonthlyAppointments(req, res, next);
});

router.get("/doctor/:id", getAppointmentsByDoctorId);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

router.put("/complete", async (req, res) => {
  const { name, department, birth } = req.body;
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db
      .collection("appointments")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .where("department", "==", department)
      .where("date", "==", today)
      .where("status", "in", ["진료중", "대기"])
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    await snapshot.docs[0].ref.update({
      status: "진료완료",
      completedAt: Date.now(),
    });
    const userSnap = await db
      .collection("users")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .get();
    userSnap.forEach((doc) => {
      doc.ref.update({ lastVisit: today });
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/complete-by-name", async (req, res) => {
  const { name, department, birth } = req.body;
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snap = await db
      .collection("appointments")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .where("department", "==", department)
      .where("date", "==", today)
      .where("status", "in", ["대기", "진료중"])
      .get();
    if (snap.empty) {
      return res.status(404).json({ error: "해당 환자 내역 없음" });
    }
    const docRef = snap.docs[0].ref;
    await docRef.update({ status: "진료완료" });
    const userSnap = await db
      .collection("users")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .get();
    userSnap.forEach((doc) => {
      doc.ref.update({ lastVisit: today });
    });
    const waitingSnap = await db
      .collection("waiting")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .where("department", "==", department)
      .get();
    if (!waitingSnap.empty) {
      const waitingDocId = waitingSnap.docs[0].id;
      await db
        .collection("waiting")
        .doc(waitingDocId)
        .update({ status: "진료완료" });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/back-to-waiting", async (req, res) => {
  const { name, department, birth } = req.body;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const snap = await db
      .collection("appointments")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .where("department", "==", department)
      .where("date", "==", today)
      .where("status", "==", "진료중")
      .get();
    if (snap.empty) {
      return res.status(404).json({ error: "대상 예약이 없습니다." });
    }
    await snap.docs[0].ref.update({ status: "대기" });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
