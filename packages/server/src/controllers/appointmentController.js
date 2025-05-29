// appointmentController.js (fully updated)
import { db } from "../config/firebase.js";

export const getTodayAppointments = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db
      .collection("appointments")
      .where("reservationDate", "==", today)
      .get();

    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const snapshot = await db
      .collection("appointments")
      .where("reservationDate", ">=", startOfWeek.toISOString().slice(0, 10))
      .where("reservationDate", "<=", endOfWeek.toISOString().slice(0, 10))
      .get();

    const weekData = Array(7).fill(0);

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

export const getMonthlyAppointments = async (req, res) => {
  try {
    const month = req.query.month;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: "Invalid or missing month param" });
    }
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    const snapshot = await db
      .collection("appointments")
      .where("reservationDate", ">=", startDate)
      .where("reservationDate", "<=", endDate)
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const apptRef = db.collection("appointments").doc(id);
    await apptRef.update(updateData);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("수정 실패:", err);
    res.status(500).json({ error: "예약 수정 중 오류가 발생했습니다." });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const {
      name,
      userId = `${name}-${Date.now()}`, // ✅ 누락 방지
      department,
      reservationDate,
      time,
      memo,
      status = '대기',
      phone = '',
      gender = ''
    } = req.body;

    if (!name || !department || !reservationDate || !time) {
      return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
    }

    const ref = await db.collection("appointments").add({
      name,
      userId,
      department,
      reservationDate,
      time,
      memo: memo || '',
      phone,
      gender,
      status
    });

    const patientSnap = await db
      .collection("users")
      .where("name", "==", name)
      .get();

    if (patientSnap.empty) {
      await db.collection("users").add({
        name,
        dept: department,
        phone,
        gender,
        lastVisit: reservationDate,
        status
      });
    }

    res.status(201).json({ id: ref.id });
  } catch (error) {
    console.error("예약 생성 실패:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};


export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const apptRef = db.collection("appointments").doc(id);
    await apptRef.delete();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("삭제 실패:", error);
    res.status(500).json({ error: "삭제 중 오류가 발생했습니다." });
  }
};
