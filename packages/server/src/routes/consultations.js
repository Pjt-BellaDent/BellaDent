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
  authenticateFirebaseToken,
  patientRoleCheck,
  staffRoleCheck,
  managerRoleCheck,
  adminRoleCheck,
} from "../middleware/roleCheck.js";

const router = express.Router();

/**
 * @function wrapControllerWithIo
 * @description 비동기 컨트롤러 함수에 req.io (Socket.IO 인스턴스)를 주입하고,
 * 발생하는 오류를 catch하여 next()로 전달합니다.
 * 이 미들웨어는 Express 앱의 주요 미들웨어 체인에서 Socket.IO 인스턴스를
 * req 객체에 `req.io`로 설정했을 때만 올바르게 작동합니다.
 * (예: `app.use((req, res, next) => { req.io = ioInstance; next(); });`)
 * @param {Function} controllerFn - (req, res, io, next) 형태의 컨트롤러 함수
 * @returns {Function} Express 미들웨어 형태의 함수 (req, res, next)
 */
const wrapControllerWithIo = (controllerFn) => (req, res, next) => {
  // 컨트롤러 함수에 req, res, req.io, next를 전달하고,
  // Promise에서 발생하는 오류를 catch하여 다음 미들웨어로 넘깁니다.
  Promise.resolve(controllerFn(req, res, req.io, next)).catch(next);
};

// 1. 고객 메시지 추가 (환자 권한)
router.post(
  "/",
  authenticateFirebaseToken,
  patientRoleCheck,
  wrapControllerWithIo(createOrAddMessage)
);

// 2. AI 챗봇 답변 요청 (환자 권한) - req.io 필요
router.post(
  "/ai",
  authenticateFirebaseToken,
  patientRoleCheck,
  wrapControllerWithIo(aiChatBotReply)
);

// 3. 스태프 답변 등록 (스태프 권한) - req.io 필요. URL 파라미터 ':id' 사용
router.post(
  "/staff/:id", // 상담 ID를 URL 파라미터로 받음
  authenticateFirebaseToken,
  staffRoleCheck,
  wrapControllerWithIo(staffReply)
);

// 4. 상담 담당자 지정/해제 (스태프 권한)
router.post(
  "/handler/:id", // 상담 ID를 URL 파라미터로 받음
  authenticateFirebaseToken,
  staffRoleCheck,
  wrapControllerWithIo(setConsultationHandler)
);

// 5. 모든 상담 목록 조회 (스태프 권한)
router.get("/", authenticateFirebaseToken, staffRoleCheck, getAllConsultations);

// 6. 특정 상담의 메시지 조회 (환자 권한)
// 참고: getMessagesById는 req.io를 사용하지 않으므로 wrapControllerWithIo가 필요 없습니다.
router.get(
  "/:id",
  authenticateFirebaseToken,
  patientRoleCheck,
  getMessagesById
);

// 7. 메시지 활성화 (매니저 권한)
// 참고: enableMessage는 req.io를 사용하지 않으므로 wrapControllerWithIo가 필요 없습니다.
router.put(
  "/enable/:id",
  authenticateFirebaseToken,
  managerRoleCheck,
  enableMessage
);

// 8. 메시지 비활성화 (매니저 권한)
// 참고: disabledMessage는 req.io를 사용하지 않으므로 wrapControllerWithIo가 필요 없습니다.
router.put(
  "/disabled/:id",
  authenticateFirebaseToken,
  managerRoleCheck,
  disabledMessage
);

// 9. 상담 삭제 (관리자 권한)
// 참고: deleteConsultation은 req.io를 사용하지 않으므로 wrapControllerWithIo가 필요 없습니다.
router.delete(
  "/:id",
  authenticateFirebaseToken,
  adminRoleCheck,
  deleteConsultation
);

export default router;
