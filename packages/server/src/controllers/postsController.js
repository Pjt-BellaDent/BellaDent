// src/controllers/postsController.js (게시판/공지/FAQ/리뷰)
import { db } from "../config/firebase.js";

// 게시글 등록 (공지/FAQ/리뷰 모두 통합)
export const createPost = async (req, res) => {
  try {
    const { boardType, title, content, authorId, isPublic = true, approved = false, visibilityReason = '', imageUrls = [] } = req.body;
    if (!boardType || !title || !content || !authorId) {
      return res.status(400).json({ error: "필수 항목 누락" });
    }
    const post = { ...req.body, createdAt: new Date().toISOString() };
    const ref = await db.collection("posts").add(post);
    res.status(201).json({ id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 전체/조건별 게시글 조회 (공지/FAQ/리뷰 구분)
export const getPosts = async (req, res) => {
  try {
    let query = db.collection("posts");
    const { boardType } = req.query;
    if (boardType) query = query.where("boardType", "==", boardType);
    const snapshot = await query.get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게시글 수정
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("posts").doc(id).update(req.body);
    res.json({ message: "게시글 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게시글 삭제
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("posts").doc(id).delete();
    res.json({ message: "게시글 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
