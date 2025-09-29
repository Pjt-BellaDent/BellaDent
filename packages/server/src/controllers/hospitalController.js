// src/controllers/hospitalController.js
import { db } from '../config/firebase.js';
import * as admin from 'firebase-admin';

const HOSPITAL_DOC = 'hospital/info';

export const getHospitalInfo = async (req, res) => {
  try {
    const docRef = db.doc(HOSPITAL_DOC);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ message: '병원 정보가 없습니다.' });
    }
    res.json(docSnap.data());
  } catch (err) {
    res.status(500).json({ message: '병원 정보 조회 실패', error: err.message });
  }
};

export const updateHospitalInfo = async (req, res) => {
  try {
    const docRef = db.doc(HOSPITAL_DOC);
    const updateData = { ...req.body };

    if (updateData.isChatEnabled !== undefined) {
      updateData.isChatEnabled = Boolean(updateData.isChatEnabled);
    }

    await docRef.set(updateData, { merge: true });
    res.json({ message: '병원 정보가 저장되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '병원 정보 저장 실패', error: err.message });
  }
}; 