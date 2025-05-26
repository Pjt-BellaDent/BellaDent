import { db } from "../config/firebase.js";

export const insertSampleAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = [
      { reservationDate: today, department: "보철과", doctor: "김치과 원장", status: "진료중", name: "김민수" },
      { reservationDate: today, department: "보철과", doctor: "김치과 원장", status: "대기", name: "이수정" },
      { reservationDate: today, department: "보철과", doctor: "김치과 원장", status: "대기", name: "박하늘" },
      { reservationDate: today, department: "교정과", doctor: "박의사", status: "진료중", name: "구영수" },
      { reservationDate: today, department: "교정과", doctor: "박의사", status: "대기", name: "정예린" },
      { reservationDate: today, department: "잇몸클리닉", doctor: "이치과 원장", status: "대기", name: "김지환" }
    ];

    const batch = db.batch();
    data.forEach(item => {
      const docRef = db.collection("appointments").doc(); // 자동 ID
      batch.set(docRef, item);
    });

    await batch.commit();
    res.json({ message: "샘플 예약 데이터 삽입 완료", count: data.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAppointmentsByDate = async (req, res) => {
    const { reservationDate, month } = req.query;
  
    try {
      let snapshot;
  
      if (reservationDate) {
        // 특정 날짜 조회
        snapshot = await db.collection("appointments")
          .where("reservationDate", "==", reservationDate)
          .get();
      } else if (month) {
        // YYYY-MM 포맷
        const [year, m] = month.split("-");
        const start = `${year}-${m.padStart(2, '0')}-01`;
        const endDate = new Date(year, parseInt(m), 0).getDate(); // 말일
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
  
  
  export const deleteAppointment = async (req, res) => {
    try {
      await db.collection('appointments').doc(req.params.id).delete();
      res.json({ message: "예약 삭제 완료" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const updateAppointment = async (req, res) => {
    try {
      await db.collection('appointments').doc(req.params.id).update(req.body);
      res.json({ message: "예약 수정 완료" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  