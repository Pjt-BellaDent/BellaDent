import express from "express";
import {
  signUp,
  CreatePatient,
  CreateStaff,
  signIn,
  getUserById,
  getPatients,
  getPatientById,
  getStaffById,
  updateUser,
  updatePatient,
  updateStaff,
  enableUser,
  disabledUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  authenticateFirebaseToken, // 모든 보호된 라우트에 적용
  patientRoleCheck, // 환자 포함 모든 인증 사용자
  staffRoleCheck, // 스태프 이상
  managerRoleCheck, // 매니저 이상
  adminRoleCheck, // 어드민만
} from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/signUp", signUp); // 홈페이지 회원가입
router.post(
  "/patient",
  authenticateFirebaseToken,
  staffRoleCheck,
  CreatePatient
); // 환자 등록 (스태프 이상)
router.post("/staff", authenticateFirebaseToken, managerRoleCheck, CreateStaff); // 직원 등록 (매니져 이상)
router.post("/signIn", authenticateFirebaseToken, signIn); // 로그인
router.get("/:id", authenticateFirebaseToken, patientRoleCheck, getUserById); // 홈페이지 사용자 정보 조회
router.get(
  "/patient",
  authenticateFirebaseToken,
  staffRoleCheck,
  getPatients
); // 전체 환자 상세 정보 조회 (스태프 이상)
router.get(
  "/patient/:id",
  authenticateFirebaseToken,
  staffRoleCheck,
  getPatientById
); // 환자 상세 정보 조회 (스태프 이상)
router.get(
  "/patient/:id",
  authenticateFirebaseToken,
  staffRoleCheck,
  getStaffById
); // 직원 상세 정보 조회 (매니져 이상)
router.put("/:id", authenticateFirebaseToken, patientRoleCheck, updateUser); // 홈페이지 사용자 정보 수정
router.put(
  "/patient/:id",
  authenticateFirebaseToken,
  staffRoleCheck,
  updatePatient
); // 환자 정보 수정
router.put(
  "/staff/:id",
  authenticateFirebaseToken,
  managerRoleCheck,
  updateStaff
); // 직원 정보 수정
router.put(
  "/enable/:id",
  authenticateFirebaseToken,
  managerRoleCheck,
  enableUser
); // 사용자 활성화 (매니저 이상)
router.put(
  "/disabled/:id",
  authenticateFirebaseToken,
  patientRoleCheck,
  disabledUser
);  // 사용자 비활성화 (환자 포함 모든 인증 사용자)
router.delete("/:id", authenticateFirebaseToken, adminRoleCheck, deleteUser); // 사용자 삭제 (관리자만)

export default router;
