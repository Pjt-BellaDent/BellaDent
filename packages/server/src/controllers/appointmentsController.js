// src/controllers/appointmentsController.js
// ERD 완전 호환 버전 (진료 예약/대기/통계)
import { db } from "../config/firebase.js";

// 오늘의 예약 전체 조회
export const getTodayAppointments = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db.collection("appointments")
      .where("date", "==", today)
      .get();
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 예약 생성
export const createAppointment = async (req, res) => {
  try {
    const {
      userId,
      doctorId,
      date,
      startTime,
      endTime,
      chairNumber,
      status
    } = req.body;
    if (!userId || !doctorId || !date || !startTime || !endTime || !chairNumber) {
      return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
    }
    const ref = await db.collection("appointments").add({
      userId, doctorId, date, startTime, endTime, chairNumber, status: status || "reserved"
    });
    res.status(201).json({ id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 예약 수정
export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("appointments").doc(id).update(req.body);
    res.json({ message: "예약 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 예약 삭제
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("appointments").doc(id).delete();
    res.json({ message: "예약 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 환자(이름+생년월일) 전체 예약 조회
export const getAppointmentsByName = async (req, res) => {
  try {
    const { name, birth } = req.query;
    if (!name || !birth) {
      return res.status(400).json({ error: "이름과 생년월일이 필요합니다." });
    }
    const snapshot = await db
      .collection("appointments")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .get();
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 예약 대시보드/통계 (주간/월간 등은 추가 함수로 분리 권장)
export const getDashboardStats = async (req, res) => {
  try {
    // 통계용 데이터 샘플, 필요 시 쿼리 직접 구현
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

export const getMonthlyAppointments = async (req, res) => {
  try {
    const { month } = req.query; // "YYYY-MM" 형식

    if (!month) {
      return res.status(400).json({ error: "month 쿼리 파라미터가 필요합니다." });
    }

    // 예약일자 기준으로 필터링 (예: 예약일자 컬럼명이 reservationDate일 경우)
    const snapshot = await db.collection("appointments")
      .where("reservationDate", ">=", `${month}-01`)
      .where("reservationDate", "<=", `${month}-31`)
      .get();

    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 주간 예약 조회 예시 (이번 주 시작~끝 날짜 기준)
export const getWeeklyReservations = async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDay(); // 요일 (0~6)
    const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1); // 월요일 날짜 계산

    const monday = new Date(today.setDate(diffToMonday));
    const sunday = new Date(today.setDate(monday.getDate() + 6));

    const formatDate = (date) => date.toISOString().slice(0, 10);

    const snapshot = await db.collection("appointments")
      .where("reservationDate", ">=", formatDate(monday))
      .where("reservationDate", "<=", formatDate(sunday))
      .get();

    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
