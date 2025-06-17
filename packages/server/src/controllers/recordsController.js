// src/controllers/recordsController.js (진료기록)
import { db } from "../config/firebase.js";

// 진료기록 등록
export const createRecord = async (req, res) => {
  try {
    const {
      userId, appointmentId, diagnosis, treatment, doctorId, date
    } = req.body;
    if (!userId || !appointmentId || !diagnosis || !treatment || !doctorId || !date) {
      return res.status(400).json({ error: "필수 항목 누락" });
    }
    const ref = await db.collection("records").add({
      userId, appointmentId, diagnosis, treatment, doctorId, date
    });
    res.status(201).json({ id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 진료기록 전체/조건 조회
export const getRecords = async (req, res) => {
  try {
    let query = db.collection("records");
    const { userId, appointmentId } = req.query;
    if (userId) query = query.where("userId", "==", userId);
    if (appointmentId) query = query.where("appointmentId", "==", appointmentId);
    const snapshot = await query.get();
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 진료기록 수정
export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("records").doc(id).update(req.body);
    res.json({ message: "진료기록 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 진료기록 삭제
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("records").doc(id).delete();
    res.json({ message: "진료기록 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
