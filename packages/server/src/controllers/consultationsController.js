// src/controllers/consultationsController.js (상담 요청/처리)
import { db } from "../config/firebase.js";

// 상담 등록
export const createConsultation = async (req, res) => {
  try {
    const { userId, status = "pending", handlerId = null } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId(환자) 필수" });
    }
    const doc = await db.collection("consultations").add({
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status,
      handlerId
    });
    res.status(201).json({ id: doc.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 전체/조건 상담 조회
export const getConsultations = async (req, res) => {
  try {
    let query = db.collection("consultations");
    const { userId, status } = req.query;
    if (userId) query = query.where("userId", "==", userId);
    if (status) query = query.where("status", "==", status);
    const snapshot = await query.get();
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 상담 상태/담당자 업데이트
export const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    await db.collection("consultations").doc(id).update(updateData);
    res.json({ message: "상담 정보 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 상담 삭제
export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("consultations").doc(id).delete();
    res.json({ message: "상담 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
