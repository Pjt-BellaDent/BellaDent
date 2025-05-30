// ✅ Firestore에 테스트용 환자 1명 등록하는 코드
// 실행 후 ID를 콘솔로 출력하여 삭제 테스트에 활용 가능

import { db } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

const addTestPatient = async () => {
  const newPatient = {
    name: '홍길동',
    gender: '남',
    age: '30',
    phone: '010-1234-5678',
    dept: '보철과',
    lastVisit: new Date().toISOString().slice(0, 10)
  };

  try {
    const ref = await db.collection('users').add(newPatient);
    console.log(`✅ 환자 등록 완료! 문서 ID: ${ref.id}`);
  } catch (err) {
    console.error('❌ 환자 등록 실패:', err);
  }
};

addTestPatient();
