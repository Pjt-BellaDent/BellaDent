import express from 'express';
const router = express.Router();

// UI 요구사항에 맞춘 더미 환자 데이터
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

// GET /patients - 환자 전체 목록 반환
router.get('/', (req, res) => {
  res.json(patients);
});

// DELETE /patients/:id - 환자 삭제 (더미 데이터에서 삭제)
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