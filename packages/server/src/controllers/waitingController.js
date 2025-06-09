// src/controllers/waitingController.js
import { db } from "../config/firebase.js";

// 대기 현황 조회
export const getWaitingStatus = async (req, res) => {
  try {
    const snapshot = await db.collection('waiting').get();
    const waitingList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(waitingList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 대기 환자 추가
export const addWaitingPatient = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.birth || !data.department) {
      return res.status(400).json({ error: "이름, 생년월일, 진료과 필수" });
    }
    data.createdAt = new Date().toISOString();
    const doc = await db.collection('waiting').add(data);
    res.status(201).json({ id: doc.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 대기 환자 수정
export const updateWaitingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('waiting').doc(id).update(req.body);
    res.json({ message: "대기 환자 정보 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 대기 환자 삭제
export const deleteWaitingPatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('waiting').doc(id).delete();
    res.json({ message: "대기 환자 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
