import { db } from '../config/firebase.js';

const checkPatientExists = async (id) => {
  const ref = db.collection('users').doc(id);  // ✅ 이렇게 접근해야 함
  const snap = await ref.get();                // admin SDK는 getDoc() 대신 get()

  if (snap.exists) {
    console.log(`✅ ID ${id} 환자 있어요!`);
    console.log(snap.data());
  } else {
    console.log(`❌ ID ${id} 환자 없어요...`);
  }
};

checkPatientExists('q8XUYwgjQsXE6AAxBray');
