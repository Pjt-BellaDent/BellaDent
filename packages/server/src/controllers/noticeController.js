import { db } from "../config/firebase.js";

const noticeRef = db.collection("notices");

export const getNotices = async (req, res) => {
  try {
    const snapshot = await noticeRef.orderBy("createdAt", "desc").get();
    const notices = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ error: "공지사항 불러오기 실패", detail: error.message });
  }
};

export const addNotice = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body)
      return res.status(400).json({ message: "제목과 내용은 필수입니다." });

    const newDoc = await noticeRef.add({
      title,
      body,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ id: newDoc.id, title, body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await noticeRef.doc(id).delete();
    res.status(201).json({ message: "공지사항 삭제 성공", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    await noticeRef.doc(id).update({ title, body });
    res.status(201).json({ message: "공지사항 수정 성공", id, title, body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};