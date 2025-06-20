import express from "express";
import {
  createOrAddMessage,
  aiChatBotReply,
  staffReply,
  setConsultationHandler,
  getAllConsultations,
  getMessagesById,
  enableMessage,
  disabledMessage,
  deleteConsultation,
} from "../controllers/consultationsController.js";
import {
  authenticateFirebaseToken, // 모든 보호된 라우트에 적용
  patientRoleCheck, // 환자 포함 모든 인증 사용자
  staffRoleCheck, // 스태프 이상
  managerRoleCheck, // 매니저 이상
  adminRoleCheck, // 어드민만
} from "../middleware/roleCheck.js";

const router = express.Router();

router.post(
  "/",
  authenticateFirebaseToken,
  patientRoleCheck,
  createOrAddMessage
);
router.post("/ai", authenticateFirebaseToken, patientRoleCheck, aiChatBotReply);
router.post("/handler", authenticateFirebaseToken, staffRoleCheck, staffReply);
router.post("/staff/:id", authenticateFirebaseToken, staffRoleCheck, setConsultationHandler);
router.get(
  "/",
  authenticateFirebaseToken,
  staffRoleCheck,
  getAllConsultations
);
router.get(
  "/:id",
  authenticateFirebaseToken,
  patientRoleCheck,
  getMessagesById
);
router.put("/enable/:id", authenticateFirebaseToken, managerRoleCheck, enableMessage);
router.put("/disabled/:id", authenticateFirebaseToken, managerRoleCheck, disabledMessage);
router.delete("/:id", authenticateFirebaseToken, adminRoleCheck, deleteConsultation);

export default router;
