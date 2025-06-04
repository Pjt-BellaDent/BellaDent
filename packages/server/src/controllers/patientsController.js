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

// 환자 등록 (이름+생년월일 중복 방지)
export const createPatient = async (req, res) => {
  try {
    const { name, birth } = req.body;
    if (!name || !birth) {
      return res.status(400).json({ error: "이름과 생년월일이 필요합니다." });
    }
    // 이름+생년월일로 중복 체크
    const snapshot = await db.collection("users")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .get();

    if (!snapshot.empty) {
      return res.status(409).json({ error: "이미 동일한 이름과 생년월일의 환자가 존재합니다." });
    }
    const doc = await db.collection("users").add(req.body);
    res.status(201).json({ id: doc.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 환자 삭제
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    res.status(200).json({ message: "환자 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
