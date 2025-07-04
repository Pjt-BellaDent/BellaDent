// src/controllers/staffScheduleController.js
import { db } from "../config/firebase.js";

const collection = db.collection("staffSchedules");

export const createSchedule = async (req, res) => {
  try {
    const data = req.body;
    const docRef = await collection.add(data);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error("스케줄 등록 실패:", error);
    res.status(500).json({ error: "스케줄 등록 중 오류 발생" });
  }
};

export const getSchedulesByMonth = async (req, res) => {
  const { month } = req.query;
  if (!month)
    return res.status(400).json({ error: "month 파라미터가 필요합니다" });

  try {
    const snapshot = await collection
      .where("scheduleDate", ">=", `${month}-01`)
      .where("scheduleDate", "<=", `${month}-31`)
      .get();
    const schedules = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(schedules);
  } catch (error) {
    console.error("스케줄 조회 실패:", error);
    res.status(500).json({ error: "스케줄 조회 중 오류 발생" });
  }
};

export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).update(req.body);
    res.json({ message: "스케줄이 성공적으로 수정되었습니다" });
  } catch (error) {
    console.error("스케줄 수정 실패:", error);
    res.status(500).json({ error: "스케줄 수정 중 오류 발생" });
  }
};

export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.json({ message: "스케줄이 삭제되었습니다" });
  } catch (error) {
    console.error("스케줄 삭제 실패:", error);
    res.status(500).json({ error: "스케줄 삭제 중 오류 발생" });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const schedulesSnapshot = await db.collection("staffSchedules").get();

    if (schedulesSnapshot.empty) {
      return res.status(200).json({
        schedules: [],
        message: "조회된 스케줄이 없습니다.",
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
  } catch (err) {
    console.error("스케줄 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};
