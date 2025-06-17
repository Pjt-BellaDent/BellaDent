// src/routes/messages.js
import express from 'express';

const router = express.Router();

// 메시지 목록 조회 예시
router.get('/', async (req, res) => {
  // TODO: DB에서 메시지 목록 가져오기 (임시 데이터 반환)
  const messages = [
    { id: '1', sender: 'admin', content: '안녕하세요. 병원입니다.', createdAt: new Date().toISOString() },
    { id: '2', sender: 'staff', content: '예약 확인 부탁드립니다.', createdAt: new Date().toISOString() }
  ];
  res.json(messages);
});

// 메시지 등록 예시
router.post('/', async (req, res) => {
  try {
    const { sender, content } = req.body;
    if (!sender || !content) {
      return res.status(400).json({ error: 'sender와 content가 필요합니다.' });
    }
    // TODO: DB에 메시지 저장 로직
    res.status(201).json({ message: '메시지가 등록되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 특정 메시지 삭제 예시
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: DB에서 메시지 삭제 로직
    res.json({ message: `${id} 메시지가 삭제되었습니다.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
