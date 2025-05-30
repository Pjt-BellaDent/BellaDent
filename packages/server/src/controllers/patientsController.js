import { db } from "../config/firebase.js";

// 전체 환자 조회
export const getAllPatients = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 환자 정보 수정
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).update(req.body);
    res.status(200).json({ message: "환자 정보 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 환자 등록
export const createPatient = async (req, res) => {
  try {
    const doc = await db.collection("users").add(req.body);
    res.status(201).json({ id: doc.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ [수정된 부분] 환자 삭제 (Express 서버용 컨트롤러)
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    res.status(200).json({ message: "환자 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
