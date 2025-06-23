import express from "express";
import {
  signUp,
  CreatePatient,
  CreateStaff,
} from "../controllers/userCreateController.js";
import { deleteUser } from "../controllers/userDeleteController.js";
import {
  signIn,
  getUserById,
  getPatients,
  getPatientById,
  getPatientByName,
  getStaffById,
  getAllStaff,
} from "../controllers/userReadController.js";
import {
  updateUser,
  updatePatient,
  updateStaff,
  enableUser,
  disabledUser,
} from "../controllers/userUpdateController.js";
import {
  authenticateFirebaseToken, // 모든 보호된 라우트에 적용
  patientRoleCheck, // 환자 포함 모든 인증 사용자
  staffRoleCheck, // 스태프 이상
  managerRoleCheck, // 매니저 이상
  adminRoleCheck, // 어드민만
} from "../middleware/roleCheck.js";

const router = express.Router();
const auth = authenticateFirebaseToken;

router.post("/signUp", signUp); // 홈페이지 회원가입
router.post("/patient", auth, staffRoleCheck, CreatePatient); // 환자 등록
router.post("/staff", auth, managerRoleCheck, CreateStaff); // 직원 등록

router.post("/signIn", auth, signIn); // 로그인

// 직원 전체 목록 조회 (항상 :id 라우트보다 위에 위치해야 함)
router.get("/staff", getAllStaff);

router.get("/:id", auth, patientRoleCheck, getUserById); // 홈페이지 회원 정보 조회
router.get("/patient", auth, staffRoleCheck, getPatients); // 전체 환자 상세 정보 조회
router.get("/patient/:id", auth, staffRoleCheck, getPatientById); // 환자 상세 정보 조회 (id)
router.get("/patient/name/:id", auth, staffRoleCheck, getPatientByName); // 환자 상세 정보 조회 (name)
router.get("/staff/:id", auth, staffRoleCheck, getStaffById); // 직원 상세 정보 조회
router.get('/patients/all', getPatients);

router.put("/:id", auth, patientRoleCheck, updateUser); // 홈페이지 회원 정보 수정
router.put("/patient/:id", auth, staffRoleCheck, updatePatient); // 환자 정보 수정
router.put("/staff/:id", auth, managerRoleCheck, updateStaff); // 직원 정보 수정
router.put("/enable/:id", auth, managerRoleCheck, enableUser); // 계정 활성화
router.put("/disabled/:id", auth, patientRoleCheck, disabledUser); // 계정 비활성화

router.delete("/:id", auth, adminRoleCheck, deleteUser); // 계정 삭제

export default router;
