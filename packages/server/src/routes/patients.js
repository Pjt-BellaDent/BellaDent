// src/routes/patients.js
import express from 'express';
const router = express.Router();

const patients = [
  {
    id: 1,
    name: '홍길동',
    gender: '남',
    birth: '1990-01-01',
    phone: '010-1234-5678',
    dept: '내과',
    lastVisit: '2025-05-10'
  },
  {
    id: 2,
    name: '김하나',
    gender: '여',
    birth: '1995-05-12',
    phone: '010-5678-1234',
    dept: '소아과',
    lastVisit: '2025-05-12'
  }
];

router.get('/', (req, res) => {
  res.json(patients);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const idx = patients.findIndex(p => String(p.id) === String(id));
  if (idx === -1) {
    return res.status(404).json({ error: '환자를 찾을 수 없습니다.' });
  }
  patients.splice(idx, 1);
  res.json({ success: true });
});

export default router; 