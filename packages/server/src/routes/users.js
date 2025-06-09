import express from 'express';
import { db } from '../config/firebase.js';
import * as usersController from '../controllers/usersController.js';

const router = express.Router();

// 모든 사용자 조회
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사용자 추가
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    const docRef = await db.collection('users').add(userData);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 환자 목록 조회 (patients 라우트는 상세 조회보다 위에)
router.get('/patients/all', usersController.getAllPatients);
// 환자 등록 (중복 검사 포함)
router.post('/patients', usersController.createPatient);

// 이름+생년월일로 userId 조회 API
router.get('/userId', usersController.getUserIdByNameBirth);

// 사용자 수정
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    await db.collection('users').doc(id).update(updateData);
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사용자 삭제
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('users').doc(id).delete();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
