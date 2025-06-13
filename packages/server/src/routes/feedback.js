import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const dummyFeedback = [
    { id: 1, content: '병원 분위기가 편안하고 좋아요.', date: '2024-05-03' },
    { id: 2, content: '김간호사님 정말 친절하세요!', date: '2024-05-01' },
    { id: 3, content: '대기 시간이 너무 길어요.', date: '2024-04-30' },
    { id: 4, content: '진료 예약 시스템이 불편해요.', date: '2024-04-28' },
  ];
  res.json(dummyFeedback);
});

export default router;
