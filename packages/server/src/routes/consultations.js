import express from "express";
import {
  createOrAddMessage,
  aiChatBotReply, // 이 함수가 io 인스턴스를 필요로 합니다.
  staffReply,
  setConsultationHandler,
  getAllConsultations,
  getMessagesById,
  enableMessage,
  disabledMessage,
  deleteConsultation,
} from "../controllers/consultationsController.js";
import {
  authenticateFirebaseToken,
  patientRoleCheck,
  staffRoleCheck,
  managerRoleCheck,
  adminRoleCheck,
} from "../middleware/roleCheck.js";

const router = express.Router();

// 미들웨어 체인에 req.io를 넘겨주는 함수
const wrapAsync = (fn) => (req, res, next) => {
  // 여기서 req.io는 initSocketServer에서 app.set('io', io)를 통해 설정되거나,
  // app.use((req, res, next) => { req.io = io; next(); }); 와 같이 주입되어야 합니다.
  // 현재 코드는 wrapAsync가 req.io를 fn에 전달하고 있습니다.
  fn(req, res, req.io, next).catch(next); // req.io를 함수에 전달
};

router.post(
  "/",
  authenticateFirebaseToken,
  patientRoleCheck,
  wrapAsync(createOrAddMessage)
);

// --- 이 부분을 아래와 같이 수정하세요 ---
router.post(
  "/ai",
  authenticateFirebaseToken,
  patientRoleCheck,
  wrapAsync(aiChatBotReply) // <-- 여기에 wrapAsync를 적용해야 합니다!
);
// --- 여기까지 수정 ---

router.post(
  "/handler/:id",
  authenticateFirebaseToken,
  staffRoleCheck,
  wrapAsync(staffReply)
); // 이 라인은 상담 핸들러 설정으로 보이며, URL 파라미터가 누락된 것 같습니다.
// 실제 staffReply는 req.params.id를 사용하므로, /handler가 아니라 /handler/:id 형식이어야 합니다.
// (현재 이슈와는 별개지만 확인해보세요)

router.post(
  "/staff/:id",
  authenticateFirebaseToken,
  staffRoleCheck,
  wrapAsync(setConsultationHandler)
);
router.get("/", authenticateFirebaseToken, staffRoleCheck, getAllConsultations);
router.get(
  "/:id",
  authenticateFirebaseToken,
  patientRoleCheck,
  getMessagesById
);
router.put(
  "/enable/:id",
  authenticateFirebaseToken,
  managerRoleCheck,
  enableMessage
);
router.put(
  "/disabled/:id",
  authenticateFirebaseToken,
  managerRoleCheck,
  disabledMessage
);
router.delete(
  "/:id",
  authenticateFirebaseToken,
  adminRoleCheck,
  deleteConsultation
);

export default router;
