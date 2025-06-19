import express from "express";
import multer from "multer";
import {
  createReview,
  readAllReviews,
  readReviewById,
  readDisabledReviewsByAuthorId,
  readPendingReviews,
  updateReview,
  requestReapproval,
  enableReview,
  disabledReview,
  deleteReview,
} from "../controllers/reviewController.js";
import {
  authenticateFirebaseToken, // 모든 보호된 라우트에 적용
  patientRoleCheck, // 환자 포함 모든 인증 사용자
  managerRoleCheck, // 매니저 이상
  adminRoleCheck, // 어드민만
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
); //  치료 후기 작성 (환자 포함 모든 인증 사용자)

router.get("/", readAllReviews); // 모든 리뷰 조회
router.get("/:id", auth, patientRoleCheck, readReviewById); // 리뷰 ID로 조회
router.get(
  "/disabled/:id",
  auth,
  patientRoleCheck,
  readDisabledReviewsByAuthorId
); // 비활성화된 리뷰 작성자 ID로 조회
router.get("/pending/", auth, managerRoleCheck, readPendingReviews); // 재활성화 요청 치료 후기 조회 (매니저 이상)

router.put(
  "/:id",
  auth,
  patientRoleCheck,
  upload.fields([{ name: "reviewImg", maxCount: 10 }]),
  updateReview
); // 리뷰 수정 (환자 포함 모든 인증 사용자)
router.put("/reapproval/:id", auth, patientRoleCheck, requestReapproval); // 리뷰 재승인 요청 (환자 포함 모든 인증 사용자)
router.put("/enable/:id", auth, managerRoleCheck, enableReview); // 리뷰 활성화 (매니저 이상)
router.put("/disabled/:id", auth, managerRoleCheck, disabledReview); // 리뷰 비활성화 (매니저 이상)

router.delete("/:id", auth, adminRoleCheck, deleteReview); // 리뷰 삭제 (관리자만)

export default router;
