// server/controllers/appointmentController.js
import { db } from "../config/firebase.js";

export const getTodayAppointments = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const snapshot = await db
      .collection("appointments")
      .where("reservationDate", "==", today)
      .get();

    const appointments = snapshot.docs.map(doc => doc.data());
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 이거 여기에 같이!
export const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      reservations: [10, 12, 8, 15, 9, 5, 7],
      procedureLabels: ['라미네이트', '스케일링', '잇몸성형'],
      procedures: [3, 5, 2]
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeeklyReservations = async (req, res) => {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // 일요일
      startOfWeek.setHours(0, 0, 0, 0);
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6); // 토요일
  
      const snapshot = await db
        .collection("appointments")
        .where("reservationDate", ">=", startOfWeek.toISOString().slice(0, 10))
        .where("reservationDate", "<=", endOfWeek.toISOString().slice(0, 10))
        .get();
  
      const weekData = Array(7).fill(0); // 일 ~ 토
  
      snapshot.docs.forEach(doc => {
        const { reservationDate } = doc.data();
        const date = new Date(reservationDate);
        const day = date.getDay();
        weekData[day]++;
      });
  
      res.json({ days: ["일", "월", "화", "수", "목", "금", "토"], counts: weekData });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  