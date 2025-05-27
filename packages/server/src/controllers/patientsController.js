import { db } from "../config/firebase.js";

export const getAllPatients = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).update(req.body);
    res.status(200).json({ message: "환자 정보 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPatient = async (req, res) => {
    try {
      const doc = await db.collection("users").add(req.body);
      res.status(201).json({ id: doc.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  