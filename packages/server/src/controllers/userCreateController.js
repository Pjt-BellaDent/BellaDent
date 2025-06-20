import {
  signUpSchema,
  createPatientSchema,
  createStaffSchema,
} from "../models/user.js";
import { db, auth } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

// 홈페이지 회원 가입
export const signUp = async (req, res) => {
  const { value, error } = signUpSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("입력값 유효성 검사 실패:", error.details);
    return res.status(400).json({ message: "입력값 유효성 검사 실패" });
  }

  const { email, password, name, phone } = value;
  const defaultRole = "patient"; // 기본 역할은 환자
  const isActive = true; // 기본 활성화 상태

  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userId = userRecord.uid; // 생성된 유저의 Auth UID

    // Auth Custom Claims에 기본 역할 설정 ('patient')
    await auth.setCustomUserClaims(userId, {
      role: defaultRole,
      isActive: isActive,
    });
    console.log(`Custom claim role:${defaultRole} set for user ${userId}`);

    // Firestore에 회원 공통 정보 및 환자 정보 저장 (Batch Writes 사용)
    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Firestore Timestamp

    // 회원 공통 정보 문서 (users/{userId})
    const userDocRef = db.collection("users").doc(userId);
    const commonUserData = {
      id: userId,
      email: userRecord.email,
      role: defaultRole,
      name: name,
      phone: phone,
      isActive: isActive,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(userDocRef, commonUserData);

    await batch.commit();
    console.log(
      `사용자 개정 생성 성공: User ID ${userId}, Role ${defaultRole}`
    );

    res.status(201).json({ message: "사용자 개정 생성 성공" });
  } catch (err) {
    console.error("회원 가입 에러:", err);
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }
    res.status(500).json({ error: err.message });
  }
};

// 환자 계정 생성
export const CreatePatient = async (req, res) => {
  const { value, error } = createPatientSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("입력값 유효성 검사 실패:", error.details);
    return res.status(400).json({ message: "입력값 유효성 검사 실패" });
  }

  // Joi 검증 통과한 value에서 모든 정보 추출
  const { email, password, name, phone, address, gender, birth, patientInfo } =
    value;
  const defaultRole = "patient"; // 기본 역할은 환자
  const isActive = true; // 기본 활성화 상태

  try {
    // ** 1. Firebase Authentication 계정 생성 **
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userId = userRecord.uid; // 생성된 유저의 Auth UID

    // ** 2. Auth Custom Claims에 지정된 역할 설정 **
    await auth.setCustomUserClaims(userId, {
      role: defaultRole,
      isActive: isActive,
    });
    console.log(`Custom claim role:${defaultRole} set for user ${userId}`);

    // ** 3. Firestore에 회원 공통 정보 및 환자 추가 정보 저장 (Batch Writes 사용) **
    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Firestore Timestamp

    // 3-1. 회원 공통 정보 문서 (users/{userId})
    const userDocRef = db.collection("users").doc(userId);

    const commonUserData = {
      id: userId, // 문서 ID와 동일하게 id 필드 저장
      email: userRecord.email, // Auth 계정의 이메일
      role: defaultRole,
      name: name, // Joi 검증된 이름
      phone: phone, // Joi 검증된 전화번호
      address: address || null,
      gender: gender || null,
      birth: birth || null,
      isActive: isActive, // 기본 활성화 상태
      createdAt: now, // Timestamp 저장
      updatedAt: now, // Timestamp 저장
    };
    batch.set(userDocRef, commonUserData); // 공통 정보 set 작업 추가

    // 3-2. 환자 하위 컬렉션 문서 생성 (Batch 추가)

    if (defaultRole === "patient" && patientInfo) {
      const patientDocRef = userDocRef.collection("patients").doc(userId);

      const patientData = {
        id: userId, // 문서 ID와 동일하게 id 필드 저장
        ...patientInfo, // patientInfoSchema를 통과한 직원 정보 필드들
      };
      batch.set(patientDocRef, patientData); // 환자 정보 set 작업 추가
    }

    // ** 4. Batch 실행 **
    await batch.commit();
    console.log(`환자 계정 생성 성공: User ID ${userId}, Role ${defaultRole}`);

    res.status(201).json({ message: `${defaultRole} 환자 계정 생성 성공` });
  } catch (err) {
    console.error("환자 계정 생성 에러:", err);
    // Firebase Auth Error 코드를 확인 (특히 auth/email-already-exists)
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }
    res.status(500).json({ error: err.message });
  }
};

// 직원 계정 생성
export const CreateStaff = async (req, res) => {
  const { value, error } = createStaffSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("입력값 유효성 검사 실패:", error.details);
    return res.status(400).json({ message: "입력값 유효성 검사 실패" });
  }

  // Joi 검증 통과한 value에서 모든 정보 추출
  const {
    email,
    password,
    role,
    name,
    phone,
    address,
    gender,
    birth,
    staffInfo,
  } = value;
  const isActive = true; // 기본 활성화 상태

  try {
    // ** 1. Firebase Authentication 계정 생성 **
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userId = userRecord.uid; // 생성된 유저의 Auth UID

    // ** 2. Auth Custom Claims에 지정된 역할 설정 **
    await auth.setCustomUserClaims(userId, { role: role, isActive: isActive });
    console.log(`Custom claim role:${role} set for user ${userId}`);

    // ** 3. Firestore에 회원 공통 정보 및 역할별 추가 정보 저장 (Batch Writes 사용) **
    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Firestore Timestamp

    // 3-1. 회원 공통 정보 문서 (users/{userId})
    const userDocRef = db.collection("users").doc(userId);

    const commonUserData = {
      id: userId, // 문서 ID와 동일하게 id 필드 저장
      email: userRecord.email, // Auth 계정의 이메일
      role: role, // 지정된 역할 정보 (Auth Custom Claims와 일치)
      name: name, // Joi 검증된 이름
      phone: phone, // Joi 검증된 전화번호
      address: address || null,
      gender: gender || null,
      birth: birth || null,
      isActive: isActive, // 기본 활성화 상태
      createdAt: now, // Timestamp 저장
      updatedAt: now, // Timestamp 저장
    };
    batch.set(userDocRef, commonUserData); // 공통 정보 set 작업 추가

    // 3-2. 역할에 따라 하위 컬렉션 문서 생성 (Batch 추가)

    if (["staff", "manager", "admin"].includes(role) && staffInfo) {
      const staffDocRef = userDocRef.collection("staffs").doc(userId);

      const staffData = {
        id: userId, // 문서 ID와 동일하게 id 필드 저장
        ...staffInfo, // staffInfoSchema를 통과한 직원 정보 필드들
      };
      batch.set(staffDocRef, staffData); // 직원 정보 set 작업 추가
    }

    // ** 4. Batch 실행 **
    await batch.commit();
    console.log(`직원 계정 생성 성공: User ID ${userId}, Role ${role}`);

    res.status(201).json({ message: `${role} 직원 계정 생성 성공` });
  } catch (err) {
    console.error("직원 계정 생성 에러:", err);
    // Firebase Auth Error 코드를 확인 (특히 auth/email-already-exists)
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }
    res.status(500).json({ error: err.message });
  }
};
