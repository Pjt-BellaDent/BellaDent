import express from 'express';

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, birth, gender, phone, address } = req.body;

  console.log('📥 현장 접수 수신:', {
    name,
    birth,
    gender,
    phone,
    address
  });

  // 여기서 DB 저장 로직 추가 예정
  res.status(200).json({ success: true, message: '접수 완료' });
});

export default router;
