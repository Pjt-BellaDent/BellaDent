// src/routes/posts.js (게시판/공지/FAQ/리뷰 라우트)
import express from 'express';
import {
  createPost,
  getPosts,
  updatePost,
  deletePost
} from '../controllers/postsController.js';

const router = express.Router();

router.post('/', createPost);        // 게시글 등록
router.get('/', getPosts);           // 전체/조건별 조회
router.put('/:id', updatePost);      // 게시글 수정
router.delete('/:id', deletePost);   // 게시글 삭제

export default router;
