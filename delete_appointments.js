const admin = require('firebase-admin');
const serviceAccount = require('./packages/server/firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

async function deleteAppointmentsAndWaiting() {
  // appointments 컬렉션 삭제
  const apptSnap = await db.collection('appointments')
    .where('name', '==', '홍길동')
    .where('birth', '==', '1990-01-01')
    .get();
  for (const doc of apptSnap.docs) {
    await doc.ref.delete();
    console.log('Deleted appointment:', doc.id);
  }

  // waiting 컬렉션 삭제
  const waitSnap = await db.collection('waiting')
    .where('name', '==', '홍길동')
    .where('birth', '==', '1990-01-01')
    .get();
  for (const doc of waitSnap.docs) {
    await doc.ref.delete();
    console.log('Deleted waiting:', doc.id);
  }
  console.log('삭제 완료!');
  process.exit(0);
}

deleteAppointmentsAndWaiting(); 