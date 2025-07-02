// src/routes/consultations.js
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


const wrapControllerWithIo = (controllerFn) => (req, res, next) => {
  Promise.resolve(controllerFn(req, res, req.io, next)).catch(next);
};

router.post(
  "/",
  authenticateFirebaseToken,
  patientRoleCheck,
  wrapControllerWithIo(createOrAddMessage)
);

router.post(
  "/ai",
  authenticateFirebaseToken,
  patientRoleCheck,
  wrapControllerWithIo(aiChatBotReply)
);

router.post(
  "/staff/:id",
  authenticateFirebaseToken,
  staffRoleCheck,
  wrapControllerWithIo(staffReply)
);

router.post(
  "/handler/:id",
  authenticateFirebaseToken,
  staffRoleCheck,
  wrapControllerWithIo(setConsultationHandler)
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
