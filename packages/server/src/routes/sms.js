import express from 'express';
const router = express.Router();

router.post('/send', (req, res) => {
  const { recipients, message } = req.body;
  console.log('받은 대상:', recipients);
  console.log('받은 메시지:', message);

  // DB 없이 일단 성공 응답만 전송
  res.status(200).json({ success: true, count: recipients.length });
});

export default router;
