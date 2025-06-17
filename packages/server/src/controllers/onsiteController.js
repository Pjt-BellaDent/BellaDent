// src/controllers/onsiteController.js (현장 접수)
import { db } from "../config/firebase.js";

// 현장 접수 등록
export const registerPatient = async (req, res) => {
  try {
    const {
      name,
      birth,
      gender,
      phone,
      address,
      insuranceNumber,
      firstVisitDate,
      lastVisitDate,
    } = req.body;

    if (!name || !birth || !gender || !phone) {
      return res.status(400).json({ error: "필수 항목 누락" });
    }

    const ref = await db.collection("onsitePatients").add({
      name,
      birth,
      gender,
      phone,
      address,
      insuranceNumber,
      firstVisitDate,
      lastVisitDate,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, id: ref.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 전체 접수 조회 (+ 조건 필터 가능)
export const getOnsitePatients = async (req, res) => {
  try {
    let query = db.collection("onsitePatients");
    const { phone, name } = req.query;

    if (phone) query = query.where("phone", "==", phone);
    if (name) query = query.where("name", "==", name);

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, patients: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 접수 정보 수정
export const updateOnsitePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("onsitePatients").doc(id).update(req.body);
    res.json({ success: true, message: "접수 정보 수정 완료" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 접수 삭제
export const deleteOnsitePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("onsitePatients").doc(id).delete();
    res.json({ success: true, message: "접수 삭제 완료" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
