import express from "express";
import {
  createNotice,
  readAllNotices,
  readDisabledNoticesById,
  updateNotice,
  enableNotice,
  disabledNotice,
  deleteNotice,
} from "../controllers/noticeController.js";
import {
  authenticateFirebaseToken, // 모든 보호된 라우트에 적용
  managerRoleCheck, // 매니저 이상
  adminRoleCheck, // 어드민만
} from "../middleware/roleCheck.js";

const router = express.Router();
const auth = authenticateFirebaseToken; // Firebase 인증 미들웨어

router.post("/", auth, managerRoleCheck, createNotice); // 공지 사항 작성
router.get("/", readAllNotices); // 모든 공지 사항 조회
router.get("/disabled", auth, managerRoleCheck, readDisabledNoticesById); // 비활성화된 공지 사항 조회
router.put("/:id", auth, managerRoleCheck, updateNotice); // 공지 사항 수정
router.put("/enable/:id", auth, managerRoleCheck, enableNotice); // 공지 사항 활성화
router.put("/disabled/:id", auth, managerRoleCheck, disabledNotice); // 공지 사항 비활성화
router.delete("/:id", auth, adminRoleCheck, deleteNotice); // 공지 사항 삭제

export default router;
