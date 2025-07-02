// src/controllers/waitingController.js
import { db } from "../config/firebase.js";

export const getWaitingStatus = async (req, res) => {
  try {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const kstNow = new Date(utc + KST_OFFSET);

    const year = kstNow.getFullYear();
    const month = String(kstNow.getMonth() + 1).padStart(2, "0");
    const day = String(kstNow.getDate()).padStart(2, "0");
    const todayKST = `${year}-${month}-${day}`;

    const snapshot = await db
      .collection("waiting")
      .where("date", "==", todayKST)
      .get();

    const waitingList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(waitingList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addWaitingPatient = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.birth || !data.department) {
      return res.status(400).json({ error: "이름, 생년월일, 진료과 필수" });
    }

    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const kstNow = new Date(utc + KST_OFFSET);
    const year = kstNow.getFullYear();
    const month = String(kstNow.getMonth() + 1).padStart(2, "0");
    const day = String(kstNow.getDate()).padStart(2, "0");
    data.date = `${year}-${month}-${day}`;

    data.createdAt = new Date().toISOString();
    data.status = data.status || "대기";
    data.patientId = data.patientId || null;
    data.doctorId = data.doctorId || null;
    data.completedAt = null;
    const doc = await db.collection("waiting").add(data);
    res.status(201).json({ id: doc.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWaitingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const waitingDocRef = db.collection("waiting").doc(id);
    const waitingDoc = await waitingDocRef.get();
    if (!waitingDoc.exists) {
      return res.status(404).json({ error: "대기 정보를 찾을 수 없음" });
    }
    const waitingData = waitingDoc.data();

    if (updateData.status === "진료완료" && waitingData.patientId) {
      const now = new Date();
      updateData.completedAt = now.toISOString();

      const patientDocRef = db
        .collection("users")
        .doc(waitingData.patientId)
        .collection("patients")
        .doc(waitingData.patientId);
      const patientDoc = await patientDocRef.get();
      if (patientDoc.exists) {
        await patientDocRef.update({
          lastVisitDate: now.toISOString().slice(0, 10),
        });
      }
    }

    await waitingDocRef.update(updateData);
    res.json({ message: "대기 환자 정보 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteWaitingPatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("waiting").doc(id).delete();
    res.json({ message: "대기 환자 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
