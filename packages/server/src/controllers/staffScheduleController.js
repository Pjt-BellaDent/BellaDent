// src/controllers/staffScheduleController.js (직원 스케줄)
import { db } from "../config/firebase.js";

const collection = db.collection('staffSchedules');

// 직원 스케줄 등록
export const createSchedule = async (req, res) => {
  try {
    const data = req.body;
    const docRef = await collection.add(data);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('스케줄 등록 실패:', error);
    res.status(500).json({ error: '스케줄 등록 중 오류 발생' });
  }
};

// 월별 스케줄 조회
export const getSchedulesByMonth = async (req, res) => {
  const { month } = req.query; // yyyy-mm 형식
  if (!month) return res.status(400).json({ error: 'month 파라미터가 필요합니다' });

  try {
    const snapshot = await collection
      .where('scheduleDate', '>=', `${month}-01`)
      .where('scheduleDate', '<=', `${month}-31`)
      .get();
    const schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(schedules);
  } catch (error) {
    console.error('스케줄 조회 실패:', error);
    res.status(500).json({ error: '스케줄 조회 중 오류 발생' });
  }
};

// 스케줄 수정
export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).update(req.body);
    res.json({ message: '스케줄이 성공적으로 수정되었습니다' });
  } catch (error) {
    console.error('스케줄 수정 실패:', error);
    res.status(500).json({ error: '스케줄 수정 중 오류 발생' });
  }
};

// 스케줄 삭제
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.json({ message: '스케줄이 삭제되었습니다' });
  } catch (error) {
    console.error('스케줄 삭제 실패:', error);
    res.status(500).json({ error: '스케줄 삭제 중 오류 발생' });
  }
};

// 스케줄 조회
export const getSchedules = async (req, res) => {
  try {
    // 실제 DB 조회
    const schedulesSnapshot = await db.collection("staffSchedules").get();

    if (schedulesSnapshot.empty) {
      // 실제 데이터가 없을 때 테스트용 더미 데이터 반환
      console.log("실제 스케줄 데이터가 없어서 더미 데이터를 반환합니다.");
      const dummySchedules = [
        {
          id: "schedule1",
          uid: "staff1",
          name: "김치과 원장",
          scheduleDate: "2024-12-20",
          startTime: "09:00",
          endTime: "18:00",
          memo: "정상 근무",
          off: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "schedule2",
          uid: "staff2",
          name: "이보철 선생",
          scheduleDate: "2024-12-20",
          startTime: "09:00",
          endTime: "18:00",
          memo: "정상 근무",
          off: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "schedule3",
          uid: "staff3",
          name: "박교정 원장",
          scheduleDate: "2024-12-20",
          startTime: "09:00",
          endTime: "18:00",
          memo: "정상 근무",
          off: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      return res.status(200).json({
        schedules: dummySchedules,
        message: "더미 스케줄 조회 성공",
      });
    }

    const schedules = schedulesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      schedules,
      message: "스케줄 조회 성공",
    });

    // 테스트용 더미 데이터 - 주석 처리
    /*
    const dummySchedules = [
      {
        id: "schedule1",
        staffId: "staff1",
        staffName: "김치과 원장",
        date: "2024-03-20",
        startTime: "09:00",
        endTime: "18:00",
        type: "근무",
        memo: "정상 근무",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "schedule2",
        staffId: "staff1",
        staffName: "김치과 원장",
        date: "2024-03-21",
        startTime: "09:00",
        endTime: "13:00",
        type: "휴가",
        memo: "오전 휴가",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "schedule3",
        staffId: "staff2",
        staffName: "이보철 선생",
        date: "2024-03-20",
        startTime: "09:00",
        endTime: "18:00",
        type: "근무",
        memo: "정상 근무",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "schedule4",
        staffId: "staff3",
        staffName: "박교정 원장",
        date: "2024-03-20",
        startTime: "09:00",
        endTime: "18:00",
        type: "근무",
        memo: "정상 근무",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "schedule5",
        staffId: "staff4",
        staffName: "정교정 선생",
        date: "2024-03-20",
        startTime: "09:00",
        endTime: "18:00",
        type: "근무",
        memo: "정상 근무",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "schedule6",
        staffId: "staff5",
        staffName: "최치주 원장",
        date: "2024-03-20",
        startTime: "09:00",
        endTime: "18:00",
        type: "근무",
        memo: "정상 근무",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "schedule7",
        staffId: "staff6",
        staffName: "한치주 선생",
        date: "2024-03-20",
        startTime: "09:00",
        endTime: "18:00",
        type: "근무",
        memo: "정상 근무",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // 실제 DB 조회 대신 더미 데이터 반환
    res.status(200).json({
      schedules: dummySchedules,
      message: "스케줄 조회 성공",
    });
    */
  } catch (err) {
    console.error("스케줄 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};
