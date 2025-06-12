import express from 'express';
const router = express.Router();

// UI 요구사항에 맞춘 더미 환자 데이터
const patients = [
  {
    id: 1,
    name: '홍길동',
    gender: '남',
    age: 35,
    phone: '010-1234-5678',
    dept: '내과',
    lastVisit: '2025-05-10'
  },
  {
    id: 2,
    name: '김하나',
    gender: '여',
    age: 29,
    phone: '010-5678-1234',
    dept: '소아과',
    lastVisit: '2025-05-12'
  }
];

// GET /patients - 환자 전체 목록 반환
router.get('/', (req, res) => {
  res.json(patients);
});

export default router; 