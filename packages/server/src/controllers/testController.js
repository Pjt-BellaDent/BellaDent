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
