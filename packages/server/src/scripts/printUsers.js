// server/src/scripts/printUsers.js

import { db } from '../config/firebase.js';

async function printUsers() {
  try {
    const snapshot = await db.collection('users').get();
    if (snapshot.empty) {
      console.log('No users found.');
      return;
    }
    snapshot.forEach(doc => {
      console.log('--------------------');
      console.log('id:', doc.id);
      console.log(doc.data());
    });
  } catch (err) {
    console.error('Error reading users:', err);
  }
}

printUsers();
