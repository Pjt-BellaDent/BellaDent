import { db } from "../config/firebase.js";

// 예약 등록
export const createAppointment = async (req, res) => {
  try {
    const { userId, reservationDate, time, department, notes } = req.body;

    if (!userId || !reservationDate || !time || !department) {
      return res.status(400).json({ error: "userId, reservationDate, time, department 필수입니다." });
    }

    const newAppointment = {
      userId,
      reservationDate,
      time,
      department,
      status: "대기",
      notes: notes || "",
    };

    const docRef = await db.collection("appointments").add(newAppointment);
    res.status(201).json({ id: docRef.id, ...newAppointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 예약 조회 (날짜 or 월)
export const getAppointmentsByDate = async (req, res) => {
  const { reservationDate, month } = req.query;

  try {
    let snapshot;

    if (reservationDate) {
      snapshot = await db.collection("appointments")
        .where("reservationDate", "==", reservationDate)
        .get();
    } else if (month) {
      const [year, m] = month.split("-");
      const start = `${year}-${m.padStart(2, '0')}-01`;
      const endDate = new Date(year, parseInt(m), 0).getDate();
      const end = `${year}-${m.padStart(2, '0')}-${String(endDate).padStart(2, '0')}`;

      snapshot = await db.collection("appointments")
        .where("reservationDate", ">=", start)
        .where("reservationDate", "<=", end)
        .get();
    } else {
      return res.status(400).json({ error: "Missing reservationDate or month param" });
    }

    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 삭제
export const deleteAppointment = async (req, res) => {
  try {
    await db.collection('appointments').doc(req.params.id).delete();
    res.json({ message: "예약 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 수정
export const updateAppointment = async (req, res) => {
  try {
    await db.collection('appointments').doc(req.params.id).update(req.body);
    res.json({ message: "예약 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
