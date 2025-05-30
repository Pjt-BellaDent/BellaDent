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
    console.log('PUT /appointments/:id', { id, updateData });
    const apptRef = db.collection("appointments").doc(id);
    await apptRef.update(updateData);
    // 진료완료 처리 동기화 시도 (에러시 로그)
    if (updateData.status === '진료완료') {
      const apptDoc = await apptRef.get();
      const appt = apptDoc.data();
      console.log('동기화용 appt:', appt);
      if (appt.userId) {
        // userId 기준 동기화 (존재하면만 update, 아니면 name fallback)
        const userRef = db.collection('users').doc(appt.userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          await userRef.update({ lastVisit: appt.reservationDate });
        } else if (appt.name) {
          // userId 없으면 name 기준 fallback
          const qs = await db.collection('users').where('name', '==', appt.name).get();
          qs.forEach(doc => doc.ref.update({ lastVisit: appt.reservationDate }));
        }
      } else if (appt.name) {
        const qs = await db.collection('users').where('name', '==', appt.name).get();
        qs.forEach(doc => doc.ref.update({ lastVisit: appt.reservationDate }));
      }
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("진료완료 상태변경 서버에러:", err);
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
      status = '대기',
      phone = '',
      gender = '',
      birth = ''
    } = req.body;
    if (!name || !department || !reservationDate || !time) {
      return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
    }
    // 1. users에서 name 기준 검색
    const patientSnap = await db
      .collection("users")
      .where("name", "==", name)
      .get();
    let actualUserId = '';
    if (patientSnap.empty) {
      // 2. 신규 환자 등록 (doc id를 userId로)
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
    // 3. appointments 등록 시 userId: actualUserId
    const appointmentRef = await db.collection("appointments").add({
      name,
      userId: actualUserId,
      department,
      reservationDate,
      time,
      memo: memo || '',
      phone,
      gender,
      birth,
      status
    });
    res.status(201).json({ id: appointmentRef.id });
  } catch (err) {
    console.error("예약 등록 실패:", err);
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
