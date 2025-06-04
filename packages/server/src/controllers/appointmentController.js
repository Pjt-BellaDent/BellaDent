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

    // 진료완료 처리 시 lastVisit도 자동 동기화
    if (updateData.status === '진료완료') {
      const apptDoc = await apptRef.get();
      const appt = apptDoc.data();
      if (appt.userId) {
        const userRef = db.collection('users').doc(appt.userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          await userRef.update({ lastVisit: appt.reservationDate });
        } else if (appt.name && appt.birth) {
          const qs = await db.collection('users')
            .where('name', '==', appt.name)
            .where('birth', '==', appt.birth)
            .get();
          qs.forEach(doc => doc.ref.update({ lastVisit: appt.reservationDate }));
        }
      } else if (appt.name && appt.birth) {
        const qs = await db.collection('users')
          .where('name', '==', appt.name)
          .where('birth', '==', appt.birth)
          .get();
        qs.forEach(doc => doc.ref.update({ lastVisit: appt.reservationDate }));
      }
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "예약 수정 중 오류가 발생했습니다.", detail: err.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const {
      name,
      department,
      reservationDate,
      time,
      memo,
      phone = '',
      gender = '',
      birth = ''
    } = req.body;
    const status = req.body.status || '대기'; // 항상 '대기' 보장
    if (!name || !department || !reservationDate || !time) {
      return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
    }
    // name + birth로 환자 식별 (추후 확장)
    const patientSnap = await db
      .collection("users")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .get();
    let actualUserId = '';
    if (patientSnap.empty) {
      const ref = await db.collection("users").add({
        name,
        phone,
        gender,
        birth,
        dept: department
      });
      actualUserId = ref.id;
    } else {
      actualUserId = patientSnap.docs[0].id;
    }
    const appointmentRef = await db.collection("appointments").add({
      name,
      birth,
      userId: actualUserId,
      department,
      reservationDate,
      time,
      memo: memo || '',
      phone,
      gender,
      status
    });
    res.status(201).json({ id: appointmentRef.id });
  } catch (err) {
    res.status(500).json({ error: "예약 생성 중 오류가 발생했습니다." });
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
export const getAvailableTimes = async (req, res) => {
  try {
    const { date, department } = req.query;
    if (!date || !department) {
      return res.status(400).json({ error: "날짜와 진료과가 필요합니다." });
    }
    // 이미 예약된 시간 조회
    const snapshot = await db.collection("appointments")
      .where("reservationDate", "==", date)
      .where("department", "==", department)
      .get();
    const reservedTimes = snapshot.docs.map(doc => doc.data().time);
    const allTimes = [10, 11, 13, 14, 15, 16, 17, 18];
    const availableTimes = allTimes.filter(t => !reservedTimes.includes(t));
    res.json({ availableTimes, reservedTimes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};