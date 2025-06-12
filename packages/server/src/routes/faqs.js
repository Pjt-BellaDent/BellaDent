import express from "express";
import {
  createFaq,
  readAllFaqs,
  readDisabledFaqsById,
  updateFaq,
  enableFaq,
  disabledFaq,
  deleteFaq,
} from "../controllers/faqController.js";
import {
  authenticateFirebaseToken, // 모든 보호된 라우트에 적용
  managerRoleCheck, // 매니저 이상
  adminRoleCheck, // 어드민만
} from "../middleware/roleCheck.js";

const router = express.Router();
const auth = authenticateFirebaseToken; // Firebase 인증 미들웨어

router.post("/", auth, managerRoleCheck, createFaq); // F&Q 작성
router.get("/", readAllFaqs); // 모든 F&Q 조회
router.get("/disabled", auth, managerRoleCheck, readDisabledFaqsById); // 비활성화된 F&Q 조회
router.put("/:id", auth, managerRoleCheck, updateFaq); // F&Q 수정
router.put("/enable/:id", auth, managerRoleCheck, enableFaq); // F&Q 활성화
router.put("/disabled/:id", auth, managerRoleCheck, disabledFaq); // F&Q 비활성화
router.delete("/:id", auth, adminRoleCheck, deleteFaq); // F&Q 삭제

export default router;
