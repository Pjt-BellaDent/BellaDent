// src/controllers/appointmentsController.js
import { db } from "../config/firebase.js";

// 오늘의 예약 전체 조회
export const getTodayAppointments = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db
      .collection("appointments")
      .where("date", "==", today)
      .get();
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 예약 생성
export const createAppointment = async (req, res) => {
  try {
    const {
      name,
      phone,
      birth,
      gender,
      date,
      department,
      doctor,
      doctorUid,
      chairNumber,
      title,
      startTime,
      endTime,
      memo,
      patientUid,
      status,
    } = req.body;

    // --- 👇 기존에 추가했던 로깅 코드는 유지하여 입력 값 확인에는 도움이 되도록 합니다. 👇 ---
    console.log("--- 서버: createAppointment 요청 바디 수신 ---");
    console.log("수신된 req.body:", req.body);
    console.log("주요 필드 값 및 타입 확인:");
    const fieldsToCheck = {
      name,
      phone,
      birth,
      gender,
      date,
      department,
      doctor,
      doctorUid,
      chairNumber,
      title,
      startTime,
      endTime,
      memo,
      patientUid,
      status,
    };
    for (const key in fieldsToCheck) {
      if (fieldsToCheck.hasOwnProperty(key)) {
        console.log(
          `  ${key}: ${fieldsToCheck[key]} (타입: ${typeof fieldsToCheck[key]})`
        );
        if (fieldsToCheck[key] === undefined) {
          console.error(`  🚨 서버 경고: ${key} 필드가 undefined 입니다!`);
        }
      }
    }
    console.log("-------------------------------------------");

    // Firestore 문서에 들어가는 모든 데이터가 정의되었는지 확인합니다.
    const newAppointmentRef = await db.collection("appointments").add({
      name,
      phone,
      birth,
      gender,
      date,
      department,
      doctor,
      doctorUid, // 이 값은 여전히 유효해야 합니다.
      chairNumber, // 이 값도 여전히 유효해야 합니다.
      title,
      startTime,
      endTime,
      memo,
      patientUid: patientUid || null,
      status,
      createdAt: new Date(),
    });

    res.status(201).json({ id: newAppointmentRef.id, ...req.body });
  } catch (error) {
    console.error("--- 서버: 예약 생성 중 오류 발생 ---");
    console.error("오류 메시지:", error.message);
    console.error("오류 스택 트레이스:", error.stack);
    console.error("------------------------------------");
    res.status(500).json({
      error:
        "예약 생성 중 서버 오류가 발생했습니다. 모든 필수 필드가 제공되었는지 확인하세요.",
      details: error.message,
    });
  }
};

// 예약 수정
export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  try {
    // --- 👇 이 아래에 로깅 코드를 추가하여 입력 값 확인에 도움이 되도록 합니다. 👇 ---
    console.log("--- 서버: updateAppointment 요청 수신 ---");
    console.log(`업데이트 대상 예약 ID: ${id}`);
    console.log("수신된 payload:", payload);
    console.log("주요 필드 값 및 타입 확인:");
    const fieldsToCheck = {
      name: payload.name,
      phone: payload.phone,
      birth: payload.birth,
      gender: payload.gender,
      date: payload.date,
      department: payload.department,
      doctor: payload.doctor,
      doctorUid: payload.doctorUid,
      chairNumber: payload.chairNumber,
      title: payload.title,
      startTime: payload.startTime,
      endTime: payload.endTime,
      memo: payload.memo,
      patientUid: payload.patientUid,
      status: payload.status,
    };
    for (const key in fieldsToCheck) {
      if (fieldsToCheck.hasOwnProperty(key)) {
        console.log(
          `  ${key}: ${fieldsToCheck[key]} (타입: ${typeof fieldsToCheck[key]})`
        );
        if (fieldsToCheck[key] === undefined) {
          console.error(`  🚨 서버 경고: ${key} 필드가 undefined 입니다!`);
        }
      }
    }
    console.log("-------------------------------------------");
    // --- 👆 로깅 코드 추가 끝 👆 ---

    const appointmentRef = db.collection("appointments").doc(id);
    await appointmentRef.update(payload);

    res.status(200).json({ id, ...payload });
  } catch (error) {
    console.error("--- 서버: 예약 수정 중 오류 발생 ---");
    console.error("오류 메시지:", error.message);
    console.error("오류 스택 트레이스:", error.stack);
    console.error("------------------------------------");
    res.status(500).json({ error: error.message });
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
    const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 의사의 모든 예약 조회
export const getAppointmentsByDoctorId = async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await db
      .collection("appointments")
      .where("doctorId", "==", id)
      .get();
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 예약 대시보드/통계 (주간/월간 등은 추가 함수로 분리 권장)
export const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      reservations: [10, 12, 8, 15, 9, 5, 7],
      procedureLabels: ["라미네이트", "스케일링", "잇몸성형"],
      procedures: [3, 5, 2],
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 월간 예약 조회 (date 필드 기준)
export const getMonthlyAppointments = async (req, res) => {
  try {
    const { month } = req.query; // "YYYY-MM" 형식
    if (!month) {
      return res
        .status(400)
        .json({ error: "month 쿼리 파라미터가 필요합니다." });
    }
    const snapshot = await db
      .collection("appointments")
      .where("date", ">=", `${month}-01`)
      .where("date", "<=", `${month}-31`)
      .get();
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 주간 예약 조회 (date 필드 기준)
export const getWeeklyReservations = async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDay(); // 요일 (0~6)
    const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1); // 월요일 날짜 계산

    const monday = new Date(today.setDate(diffToMonday));
    const sunday = new Date(today.setDate(monday.getDate() + 6));

    const formatDate = (date) => date.toISOString().slice(0, 10);

    const snapshot = await db
      .collection("appointments")
      .where("date", ">=", formatDate(monday))
      .where("date", "<=", formatDate(sunday))
      .get();
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
