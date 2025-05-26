import { db } from "../config/firebase.js";

export const getDashboardChart = async (req, res) => {
  try {
    // 예약 통계 (요일별)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const apptSnapshot = await db
      .collection("appointments")
      .where("reservationDate", ">=", startOfWeek.toISOString().slice(0, 10))
      .where("reservationDate", "<=", endOfWeek.toISOString().slice(0, 10))
      .get();

    const reservations = Array(7).fill(0);
    apptSnapshot.docs.forEach(doc => {
      const day = new Date(doc.data().reservationDate).getDay();
      reservations[day]++;
    });

    // 시술 통계
    const procSnapshot = await db.collection("procedures").get();
    const procedureCount = {};
    procSnapshot.docs.forEach(doc => {
      const { type } = doc.data();
      if (type) {
        procedureCount[type] = (procedureCount[type] || 0) + 1;
      }
    });

    const procedureLabels = Object.keys(procedureCount);
    const procedures = Object.values(procedureCount);

    res.json({
      reservations,
      procedureLabels,
      procedures
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
