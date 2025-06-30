// backend/routes/reviews.js

import express from "express";
import multer from "multer";
import {
  createReview,
  readAllReviews, // 이 함수
  readReviewsByAuthorId, // <-- readReviewById 대신 이 함수 임포트
  readSingleReviewById, // <-- 새로 추가된 함수 임포트
  readDisabledReviewsByAuthorId,
  readPendingReviews,
  updateReview,
  requestReapproval,
  enableReview,
  disabledReview,
  deleteReview,
} from "../controllers/reviewController.js";
import {
  authenticateFirebaseToken,
  patientRoleCheck,
  managerRoleCheck,
  adminRoleCheck,
} from "../middleware/roleCheck.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const auth = authenticateFirebaseToken;

router.post(
  "/",
  auth,
  patientRoleCheck,
  upload.fields([{ name: "reviewImg", maxCount: 10 }]),
  createReview
);

router.get("/", auth, readAllReviews); // <-- 'auth' 미들웨어 추가! 이제 로그인해야 전체 리뷰 조회 가능
// 특정 작성자(Author ID)의 리뷰 목록 조회
router.get("/:id", auth, patientRoleCheck, readReviewsByAuthorId); // <-- 기존 /:id 라우트 연결 함수 변경

// 특정 리뷰(Review ID)의 상세 정보 조회 (수정 폼에 사용)
router.get("/single/:id", auth, patientRoleCheck, readSingleReviewById); // <-- 새로운 라우트 추가!

router.get(
  "/disabled/:id",
  auth,
  patientRoleCheck,
  readDisabledReviewsByAuthorId
);
router.get("/pending/", auth, managerRoleCheck, readPendingReviews);

router.put(
  "/:id",
  auth,
  patientRoleCheck,
  upload.fields([{ name: "reviewImg", maxCount: 10 }]),
  updateReview
);
router.put("/reapproval/:id", auth, patientRoleCheck, requestReapproval);
router.put("/enable/:id", auth, managerRoleCheck, enableReview);
router.put("/disabled/:id", auth, managerRoleCheck, disabledReview);

router.delete("/:id", auth, patientRoleCheck, deleteReview);

export default router;
