// src/controllers/noticeController.js

let notices = [
  { title: '시스템 점검 안내', body: '5월 10일 오전 점검 예정입니다.' }
];

// GET 전체 공지사항 조회
export const getNotices = (req, res) => {
  res.json(notices);
};

// POST 공지사항 전체 저장 (add/edit/delete 후 전체 반영)
export const saveNotices = (req, res) => {
  notices = req.body.map(n => ({
    title: n.title,
    body: n.body,
    isPublic: !!n.showOnMain,
    createdAt: n.createdAt || new Date().toISOString(), // ✅ 없으면 자동 추가
    updatedAt: new Date().toISOString(),
    author: n.author || '관리자',
  }));
  res.json({ success: true });
};