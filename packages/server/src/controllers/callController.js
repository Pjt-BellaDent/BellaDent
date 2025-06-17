import { db } from "../config/firebase.js";

export const callPatient = async (req, res) => {
  try {
    const { name, birth, room, department } = req.body;
    if (!name || !birth || !room || !department) {
      return res.status(400).json({ error: "필수값 누락" });
    }
    // TODO: 진료실별 inTreatment에 환자 정보 저장, waiting 컬렉션에서 해당 환자 삭제/상태변경
    // 예시: 대기 환자 정보 조회
    const snapshot = await db.collection('waiting')
      .where('name', '==', name)
      .where('birth', '==', birth)
      .where('department', '==', department)
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "해당 환자를 찾을 수 없습니다." });
    }
    const docId = snapshot.docs[0].id;
    await db.collection('waiting').doc(docId).update({ status: '진료중' });
    res.json({ message: "환자 호출 처리 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 