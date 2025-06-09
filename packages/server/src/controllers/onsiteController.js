import { db } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

export const savePatientToFirestore = async (req, res) => {
  try {
    const data = req.body;
    const uid = uuidv4(); // 또는 전화번호 등으로 고유화

    const userRef = db.collection('users').doc(uid);
    const patientRef = userRef.collection('patients').doc(uid);

    await patientRef.set({
      ...data,
      firstVisitDate: new Date(),
      lastVisitDate: new Date(),
    });

    res.status(200).json({ message: '환자 등록 완료' });
  } catch (error) {
    console.error('Firestore 저장 실패:', error);
    res.status(500).json({ error: '환자 저장 실패' });
  }
};
