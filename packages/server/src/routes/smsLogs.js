import express from "express";
import {
  GetSendNumber,
  SendMessage,
} from "../controllers/smsLogsController.js";
import {
  authenticateFirebaseToken, // 모든 보호된 라우트에 적용
  staffRoleCheck, // 스태프 이상
} from "../middleware/roleCheck.js";

const router = express.Router();

router.get("/number", authenticateFirebaseToken, staffRoleCheck, GetSendNumber); // 발신번호 조회 (스태프 이상)
router.post("/send", authenticateFirebaseToken, staffRoleCheck, SendMessage); // sms 발신 (스태프 이상)

export default router;
