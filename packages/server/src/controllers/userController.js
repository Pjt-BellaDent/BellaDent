import {
  commonUserFieldsSchema,
  patientInfoSchema,
  staffInfoSchema,
  signUpSchema,
  createPatientSchema,
  createStaffSchema,
  updateUserSchema,
} from "../models/user.js";
import { db, auth } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

// 홈페이지 회원 가입
export const signUp = async (req, res) => {
  const { value, error } = signUpSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("회원 가입 유효성 검사 에러:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  const { email, password, name, phone, address, gender, birth } = value;
  const defaultRole = "patient"; // 기본 역할은 환자

  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userId = userRecord.uid; // 생성된 유저의 Auth UID

    // Auth Custom Claims에 기본 역할 설정 ('patient')
    await auth.setCustomUserClaims(userId, { role: defaultRole });
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
      address: address || null,
      gender: gender || null,
      birth: birth || null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(userDocRef, commonUserData);

    await batch.commit();
    console.log(
      `홈페이지 회원 가입 및 Firestore 정보 저장 성공: User ID ${userId}, Role ${defaultRole}`
    );

    res.status(201).json({ message: "회원 가입 성공" });
  } catch (err) {
    console.error("회원 가입 에러:", err);
    // Firebase Auth Error 코드를 확인
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }
    // 기타 Auth 또는 Batch 쓰기 오류
    res.status(500).json({ error: err.message });
  }
};

// 관리자의 다른 역할 사용자 생성 (매니저 등급 이상 가능)
export const CreatePatient = async (req, res) => {
  const { value, error } = createPatientSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("사용자 생성 유효성 검사 에러:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  // Joi 검증 통과한 value에서 모든 정보 추출
  const { email, password, name, phone, address, gender, birth, patientInfo } =
    value;
  const defaultRole = "patient"; // 기본 역할은 환자

  try {
    // ** 1. Firebase Authentication 계정 생성 **
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userId = userRecord.uid; // 생성된 유저의 Auth UID

    // ** 2. Auth Custom Claims에 지정된 역할 설정 **
    await auth.setCustomUserClaims(userId, { role: defaultRole });
    console.log(`Custom claim role:${defaultRole} set for user ${userId}`);

    // ** 3. Firestore에 회원 공통 정보 및 환자 추가 정보 저장 (Batch Writes 사용) **
    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Firestore Timestamp

    // 3-1. 회원 공통 정보 문서 (users/{userId})
    const userDocRef = db.collection("users").doc(userId);
    // commonUserFieldsSchema를 사용하여 공통 정보 필드 유효성 재검증 (선택 사항)
    const commonUserData = {
      id: userId, // 문서 ID와 동일하게 id 필드 저장 (선택 사항)
      email: userRecord.email, // Auth 계정의 이메일 (Auth 생성 시점의 이메일)
      role: defaultRole,
      name: name, // Joi 검증된 이름
      phone: phone, // Joi 검증된 전화번호
      address: address || null,
      gender: gender || null,
      birth: birth || null,
      isActive: true, // 기본 활성화 상태
      createdAt: now, // Timestamp 저장
      updatedAt: now, // Timestamp 저장
    };
    batch.set(userDocRef, commonUserData); // 공통 정보 set 작업 추가

    // 3-2. 환자 하위 컬렉션 문서 생성 (Batch 추가)

    if (defaultRole === "patient" && patientInfo) {
      const patientDocRef = userDocRef.collection("patients").doc(userId); // 하위 문서 ID도 Auth UID와 동일하게 설정
      // patientInfoSchema를 사용하여 유효성 재검증 (선택 사항)
      const patientData = {
        id: userId, // 문서 ID와 동일하게 id 필드 저장 (선택 사항)
        ...patientInfo, // patientInfoSchema를 통과한 직원 정보 필드들
      };
      batch.set(patientDocRef, patientData); // 환자 정보 set 작업 추가
    }

    // ** 4. Batch 실행 **
    // Auth 클레임 설정에 성공한 후 Firestore 쓰기를 시도합니다.
    await batch.commit();
    console.log(
      `환자 정보 생성 및 Firestore 정보 저장 성공: User ID ${userId}, Role ${defaultRole}`
    );

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

// 관리자의 다른 역할 사용자 생성 (매니저 등급 이상 가능)
export const CreateStaff = async (req, res) => {
  const { value, error } = createStaffSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("관리자 사용자 생성 유효성 검사 에러:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
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

  try {
    // ** 1. Firebase Authentication 계정 생성 **
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userId = userRecord.uid; // 생성된 유저의 Auth UID

    // ** 2. Auth Custom Claims에 지정된 역할 설정 **
    await auth.setCustomUserClaims(userId, { role: role });
    console.log(`Custom claim role:${role} set for user ${userId}`);

    // ** 3. Firestore에 회원 공통 정보 및 역할별 추가 정보 저장 (Batch Writes 사용) **
    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Firestore Timestamp

    // 3-1. 회원 공통 정보 문서 (users/{userId})
    const userDocRef = db.collection("users").doc(userId);
    // commonUserFieldsSchema를 사용하여 공통 정보 필드 유효성 재검증 (선택 사항)
    const commonUserData = {
      id: userId, // 문서 ID와 동일하게 id 필드 저장 (선택 사항)
      email: userRecord.email, // Auth 계정의 이메일 (Auth 생성 시점의 이메일)
      role: role, // 지정된 역할 정보 (Auth Custom Claims와 일치)
      name: name, // Joi 검증된 이름
      phone: phone, // Joi 검증된 전화번호
      address: address || null,
      gender: gender || null,
      birth: birth || null,
      isActive: true, // 기본 활성화 상태
      createdAt: now, // Timestamp 저장
      updatedAt: now, // Timestamp 저장
    };
    batch.set(userDocRef, commonUserData); // 공통 정보 set 작업 추가

    // 3-2. 역할에 따라 하위 컬렉션 문서 생성 (Batch 추가)

    if (["staff", "manager"].includes(role) && staffInfo) {
      const staffDocRef = userDocRef.collection("staffs").doc(userId); // 하위 문서 ID도 Auth UID와 동일하게 설정
      // staffInfoSchema를 사용하여 유효성 재검증 (선택 사항)
      const staffData = {
        id: userId, // 문서 ID와 동일하게 id 필드 저장 (선택 사항)
        ...staffInfo, // staffInfoSchema를 통과한 직원 정보 필드들
      };
      batch.set(staffDocRef, staffData); // 직원 정보 set 작업 추가
    }

    // ** 4. Batch 실행 **
    // Auth 클레임 설정에 성공한 후 Firestore 쓰기를 시도합니다.
    await batch.commit();
    console.log(
      `관리자에 의한 사용자 생성 및 Firestore 정보 저장 성공: User ID ${userId}, Role ${role}`
    );

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

// 사용자 로그인 및 정보 조회
export const signIn = async (req, res) => {
  try {
    const decodedToken = req.user;

    const userId = decodedToken.uid; // 검증된 토큰에서 사용자 UID 추출
    const userRole = decodedToken.role; // Auth Custom Claim에서 가져온 역할

    // Firestore에서 해당 사용자의 추가 정보 조회
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      // Auth 계정은 있지만 Firestore 문서가 없는 경우 (signup 과정 오류 등)
      console.warn(`Firestore 문서 없음 for Auth user: ${userId}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data(); // Firestore 공통 사용자 정보

    if (!userData.isActive) {
      // 사용자가 비활성화된 경우
      console.warn(`사용자 비활성화 for Auth user: ${userId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    // 클라이언트에 반환할 사용자 정보 객체 구성
    const userInfo = {
      id: userId, // decodedToken.uid 사용
      role: userRole, // decodedToken.role (Auth Custom Claim) 사용
      name: userData.name, // Firestore에서 가져옴
    };

    res.status(200).json({
      message: "Firebase ID 토큰 검증 및 사용자 정보 조회 성공",
      userInfo,
    });
  } catch (err) {
    console.error(
      "Firebase ID 토큰 검증 또는 사용자 정보 조회 에러:",
      err.message
    );
  }
};

export const getUserById = async (req, res) => {
  try {
    const decodedToken = req.user;
    // Firestore에서 해당 사용자의 추가 정보 조회
    const userDoc = await db.collection("users").doc(req.params.id).get();

    if (!userDoc.exists) {
      // Auth 계정은 있지만 Firestore 문서가 없는 경우 (signup 과정 오류 등)
      console.warn(`Firestore 문서 없음 for Auth user: ${req.params.id}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data(); // Firestore 공통 사용자 정보

    // 클라이언트에 반환할 사용자 정보 객체 구성
    const userInfo = {
      id: decodedToken.uid, // decodedToken.uid 사용
      email: userData.email, // Firestore에서 가져옴
      name: userData.name, // Firestore에서 가져옴
      phone: userData.phone, // Firestore에서 가져옴
      address: userData.address, // Firestore에서 가져옴
      role: decodedToken.role, // decodedToken.role (Auth Custom Claim) 사용
      // Timestamp 객체를 클라이언트에서 사용하기 편한 형식으로 변환하여 반환
      isActive: userData.isActive, // Firestore에서 가져옴
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    res.status(200).json({ message: "회원정보 조회 성공", userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patientsDoc = await db
      .collection("users")
      .where("role", "==", "patient") // 역할이 'patient'인 문서만 필터링
      .get(); // 조건에 맞는 모든 문서 가져오기

    // 조회 결과가 없는 경우 빈 배열 반환
    if (patientsDoc.empty) {
      return res.status(404).json({ message: "조회된 환자 정보가 없습니다." });
    }

    // 각 환자 문서와 해당 하위 컬렉션 데이터를 함께 가져오는 비동기 작업 배열 생성
    const patientPromises = patientsDoc.docs.map(async (userDoc) => {
      const userData = userDoc.data(); // users/{uid} 문서 데이터
      const userId = userData.id; // 사용자의 UID (문서 ID)

      // ** 2. 해당 사용자의 patients 하위 컬렉션 문서 조회 **
      const patientDoc = await userDoc.ref
        .collection("patients")
        .doc(userId)
        .get();

      let patientData = null;
      if (patientDoc.exists) {
        patientData = patientDoc.data();
      }

      // ** 3. 상위 문서 데이터와 하위 문서 데이터를 조합하여 사용자 정보 객체 구성 **
      const userInfo = {
        id: userId, // userDoc.id 사용
        email: userData.email,
        role: userData.role,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender,
        birth: userData.birth,
        isActive: userData.isActive, // 활성화 상태
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        patientInfo: patientData, // 하위 컬렉션 정보 포함
      };

      return userInfo; // 조합된 사용자 정보 객체 반환
    });

    // ** 4. 모든 비동기 작업(하위 컬렉션 조회 및 데이터 조합) 병렬 실행 대기 **
    const allPatients = await Promise.all(patientPromises);

    // ** 5. 최종 결과 응답 **
    res.status(200).json({
      reviews: allPatients, // 전체 환자 정보 배열 반환
      message: "전체 환자 정보 조회 성공",
    });
  } catch (err) {
    console.error("전체 환자 정보 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const decodedToken = req.user;
    // Firestore에서 해당 사용자의 추가 정보 조회
    const userDoc = await db.collection("users").doc(req.params.id).get();

    if (!userDoc.exists) {
      // Auth 계정은 있지만 Firestore 문서가 없는 경우 (signup 과정 오류 등)
      console.warn(`Firestore 문서 없음 for Auth user: ${req.params.id}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data(); // Firestore 공통 사용자 정보

    // 역할에 따라 하위 컬렉션 정보도 함께 조회 (선택 사항)
    let patientData = null;

    if (userData.role === "patient") {
      const patientDoc = await userDoc.ref
        .collection("patients")
        .doc(req.params.id)
        .get();
      if (patientDoc.exists) {
        patientData = patientDoc.data();
      }
    }

    // 클라이언트에 반환할 사용자 정보 객체 구성
    const userInfo = {
      id: decodedToken.uid, // decodedToken.uid 사용
      email: decodedToken.email, // decodedToken.email 사용
      role: decodedToken.role, // decodedToken.role (Auth Custom Claim) 사용
      name: userData.name, // Firestore에서 가져옴
      phone: userData.phone, // Firestore에서 가져옴
      address: userData.address, // Firestore에서 가져옴
      gender: userData.gender, // Firestore에서 가져옴
      birth: userData.birth, // Firestore에서 가져옴
      // Timestamp 객체를 클라이언트에서 사용하기 편한 형식으로 변환하여 반환
      isActive: userData.isActive, // Firestore에서 가져옴
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      patientInfo: patientData, // 하위 컬렉션 정보 포함
    };

    res.status(200).json({ message: "회원정보 조회 성공", userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const decodedToken = req.user;
    // Firestore에서 해당 사용자의 추가 정보 조회
    const userDoc = await db.collection("users").doc(req.params.id).get();

    if (!userDoc.exists) {
      // Auth 계정은 있지만 Firestore 문서가 없는 경우 (signup 과정 오류 등)
      console.warn(`Firestore 문서 없음 for Auth user: ${req.params.id}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data(); // Firestore 공통 사용자 정보

    // 역할에 따라 하위 컬렉션 정보도 함께 조회 (선택 사항)
    let staffData = null;

    if (["staff", "manager", "admin"].includes(userData.role)) {
      const staffDoc = await userDoc.ref
        .collection("staffs")
        .doc(req.params.id)
        .get();
      if (staffDoc.exists) {
        staffData = staffDoc.data();
      }
    }

    // 클라이언트에 반환할 사용자 정보 객체 구성
    const userInfo = {
      id: decodedToken.uid, // decodedToken.uid 사용
      email: decodedToken.email, // decodedToken.email 사용
      role: decodedToken.role, // decodedToken.role (Auth Custom Claim) 사용
      name: userData.name, // Firestore에서 가져옴
      phone: userData.phone, // Firestore에서 가져옴
      address: userData.address, // Firestore에서 가져옴
      gender: userData.gender, // Firestore에서 가져옴
      birth: userData.birth, // Firestore에서 가져옴
      // Timestamp 객체를 클라이언트에서 사용하기 편한 형식으로 변환하여 반환
      isActive: userData.isActive, // Firestore에서 가져옴
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      staffInfo: staffData, // 하위 컬렉션 정보 포함
    };

    res.status(200).json({ message: "회원정보 조회 성공", userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const userIdToUpdate = req.params.id;
  const authenticatedUser = req.user; // 인증된 현재 사용자의 정보 (decodedToken)

  // ** 서버 측 접근 제어 (매우 중요!) **
  if (
    authenticatedUser.uid !== userIdToUpdate &&
    !["staff", "manager", "admin"].includes(authenticatedUser.role)
  ) {
    // 현재 로그인한 사용자가 본인이 아니고, 관리자도 아닌 경우
    return res.status(403).json({ message: "정보 수정 권한이 없습니다." });
  }

  const { value, error } = updateUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error(
      `사용자 ${userIdToUpdate} 정보 수정 유효성 검사 에러:`,
      error.details
    );
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  // ** 보안 강화: value 객체에서 role 필드 및 id, email 등 수정 불가능 필드 명시적으로 제거 **
  delete value.role;
  delete value.id;
  delete value.email;

  const commonUpdateFields = value;

  try {
    // Firestore에서 수정 대상 사용자의 현재 정보 및 역할을 조회
    const userDocRef = db.collection("users").doc(userIdToUpdate);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    // 회원 공통 정보 업데이트
    const updateCommonData = {
      ...commonUpdateFields,
      updatedAt: now, // 수정 시각 업데이트
    };

    const { value: validatedCommonUpdate, error: commonUpdateError } =
      commonUserFieldsSchema.validate(updateCommonData, {
        abortEarly: false,
        allowUnknown: true,
      });
    if (commonUpdateError) {
      console.error(
        `사용자 ${userIdToUpdate} 공통 정보 업데이트 유효성 검사 에러:`,
        commonUpdateError.details
      );

      return res.status(500).json({
        message: "Internal Validation Error for common fields",
        details: commonUpdateError.details,
      });
    }

    batch.update(userDocRef, validatedCommonUpdate); // 공통 정보 update 작업 추가

    await batch.commit();
    console.log(`사용자 ${userIdToUpdate} 정보 수정 성공`);

    res.status(200).json({ message: "회원 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${userIdToUpdate} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

export const updatePatient = async (req, res) => {
  const userIdToUpdate = req.params.id;
  const authenticatedUser = req.user; // 인증된 현재 사용자의 정보 (decodedToken)

  // ** 서버 측 접근 제어 (매우 중요!) **
  // - 인증된 사용자가 'staff, manager, admin' 역할일 경우에만 허용
  if (!["staff", "manager", "admin"].includes(authenticatedUser.role)) {
    return res.status(403).json({ message: "정보 수정 권한이 없습니다." });
  }

  const { value, error } = updateUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error(
      `사용자 ${userIdToUpdate} 정보 수정 유효성 검사 에러:`,
      error.details
    );
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  // ** 보안 강화: value 객체에서 role 필드 및 id, email 등 수정 불가능 필드 명시적으로 제거 **
  delete value.role;
  delete value.id;
  delete value.email;

  const { patientInfo, ...commonUpdateFields } = value;

  try {
    // Firestore에서 수정 대상 사용자의 현재 정보 및 역할을 조회
    const userDocRef = db.collection("users").doc(userIdToUpdate);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const existingUserData = userDoc.data();
    const userRole = existingUserData.role; // 현재 사용자의 역할

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    // 회원 공통 정보 업데이트
    const updateCommonData = {
      ...commonUpdateFields,
      updatedAt: now, // 수정 시각 업데이트
    };

    const { value: validatedCommonUpdate, error: commonUpdateError } =
      commonUserFieldsSchema.validate(updateCommonData, {
        abortEarly: false,
        allowUnknown: true,
      });
    if (commonUpdateError) {
      console.error(
        `사용자 ${userIdToUpdate} 공통 정보 업데이트 유효성 검사 에러:`,
        commonUpdateError.details
      );

      return res.status(500).json({
        message: "Internal Validation Error for common fields",
        details: commonUpdateError.details,
      });
    }

    batch.update(userDocRef, validatedCommonUpdate); // 공통 정보 update 작업 추가

    // 역할에 따라 하위 컬렉션 정보 업데이트
    if (userRole === "patient" && patientInfo) {
      // 현재 역할이 'patient'이고, patientInfo 데이터가 요청 body에 포함된 경우
      const patientDocRef = userDocRef
        .collection("patients")
        .doc(userIdToUpdate);

      // patientInfo 업데이트 데이터만 포함
      const updatePatientData = {
        ...patientInfo,
      };
      // patientInfoSchema로 유효성 재검증
      const { value: validatedPatientUpdate, error: patientUpdateError } =
        patientInfoSchema.validate(updatePatientData, {
          abortEarly: false,
          allowUnknown: true,
        });
      if (patientUpdateError) {
        console.error(
          `사용자 ${userIdToUpdate} 환자 정보 업데이트 유효성 검사 에러:`,
          patientUpdateError.details
        );
        return res.status(400).json({
          message: "Validation Error for patient info",
          details: patientUpdateError.details,
        });
      }

      batch.update(patientDocRef, validatedPatientUpdate); // 환자 정보 update 작업 추가
    }

    await batch.commit();
    console.log(`사용자 ${userIdToUpdate} 정보 수정 성공`);

    res.status(200).json({ message: "회원 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${userIdToUpdate} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

export const updateStaff = async (req, res) => {
  const userIdToUpdate = req.params.id;
  const authenticatedUser = req.user; // 인증된 현재 사용자의 정보 (decodedToken)

  // ** 서버 측 접근 제어 (매우 중요!) **
  if (!["manager", "admin"].includes(authenticatedUser.role)) {
    return res.status(403).json({ message: "정보 수정 권한이 없습니다." });
  }

  const { value, error } = updateUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error(
      `사용자 ${userIdToUpdate} 정보 수정 유효성 검사 에러:`,
      error.details
    );
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  // ** 보안 강화: value 객체에서 role 필드 및 id, email 등 수정 불가능 필드 명시적으로 제거 **
  delete value.role;
  delete value.id;
  delete value.email;

  const { staffInfo, ...commonUpdateFields } = value;

  try {
    // Firestore에서 수정 대상 사용자의 현재 정보 및 역할을 조회
    const userDocRef = db.collection("users").doc(userIdToUpdate);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const existingUserData = userDoc.data();
    const userRole = existingUserData.role; // 현재 사용자의 역할

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    // 회원 공통 정보 업데이트
    const updateCommonData = {
      ...commonUpdateFields,
      updatedAt: now, // 수정 시각 업데이트
    };

    const { value: validatedCommonUpdate, error: commonUpdateError } =
      commonUserFieldsSchema.validate(updateCommonData, {
        abortEarly: false,
        allowUnknown: true,
      });
    if (commonUpdateError) {
      console.error(
        `사용자 ${userIdToUpdate} 공통 정보 업데이트 유효성 검사 에러:`,
        commonUpdateError.details
      );

      return res.status(500).json({
        message: "Internal Validation Error for common fields",
        details: commonUpdateError.details,
      });
    }

    batch.update(userDocRef, validatedCommonUpdate); // 공통 정보 update 작업 추가

    // 역할에 따라 하위 컬렉션 정보 업데이트
    if (["staff", "manager", "admin"].includes(userRole) && staffInfo) {
      // 현재 역할이 직원 이상이고, staffInfo 데이터가 요청 body에 포함된 경우
      const staffDocRef = userDocRef.collection("staffs").doc(userIdToUpdate);

      // staffInfo 업데이트 데이터만 포함
      const updateStaffData = {
        ...staffInfo,
      };
      // staffInfoSchema로 유효성 재검증
      const { value: validatedStaffUpdate, error: staffUpdateError } =
        staffInfoSchema.validate(updateStaffData, {
          abortEarly: false,
          allowUnknown: true,
        });
      if (staffUpdateError) {
        console.error(
          `사용자 ${userIdToUpdate} 직원 정보 업데이트 유효성 검사 에러:`,
          staffUpdateError.details
        );
        return res.status(400).json({
          message: "Validation Error for staff info",
          details: staffUpdateError.details,
        });
      }

      batch.update(staffDocRef, validatedStaffUpdate); // 직원 정보 update 작업 추가
    }

    await batch.commit();
    console.log(`사용자 ${userIdToUpdate} 정보 수정 성공`);

    res.status(200).json({ message: "회원 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${userIdToUpdate} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

export const enableUser = async (req, res) => {
  const userIdToUpdate = req.params.id;
  const authenticatedUser = req.user; // 인증된 현재 사용자의 정보 (decodedToken)

  // ** 서버 측 접근 제어 (매우 중요!) **
  if (!["manager", "admin"].includes(authenticatedUser.role)) {
    return res.status(403).json({ message: "정보 수정 권한이 없습니다." });
  }

  try {
    await admin.auth().updateUser(userIdToUpdate, {
      isActive: true,
    });
    res.status(201).json({ message: "회원 활성화 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const disabledUser = async (req, res) => {
  const userIdToUpdate = req.params.id;
  const authenticatedUser = req.user; // 인증된 현재 사용자의 정보 (decodedToken)

  // ** 서버 측 접근 제어 (매우 중요!) **
  if (
    authenticatedUser.uid !== userIdToUpdate &&
    !["staff", "manager", "admin"].includes(authenticatedUser.role)
  ) {
    // 현재 로그인한 사용자가 본인이 아니고, 관리자도 아닌 경우
    return res.status(403).json({ message: "정보 수정 권한이 없습니다." });
  }

  try {
    await admin.auth().updateUser(userIdToUpdate, {
      isActive: false,
    });
    res.status(201).json({ message: "회원 비활성화 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const userIdToDelete = req.params.id;
  const authenticatedUser = req.user; // 인증된 현재 사용자의 정보 (decodedToken)

  // ** 서버 측 접근 제어 (매우 중요!) **
  if (!["manager", "admin"].includes(authenticatedUser.role)) {
    return res.status(403).json({ message: "정보 수정 권한이 없습니다." });
  }

  try {
    // ** 1. Firebase Authentication 사용자 계정 삭제 **
    await auth.deleteUser(userIdToDelete);
    console.log(`Firebase Auth User ${userIdToDelete} deleted.`);

    // ** 2. Firestore 문서 삭제 **
    await db.collection("users").doc(userIdToDelete).delete();
    await db
      .collection("users")
      .doc(userIdToDelete)
      .collection("patients")
      .doc(userIdToDelete)
      .delete();
    await db
      .collection("users")
      .doc(userIdToDelete)
      .collection("staffs")
      .doc(userIdToDelete)
      .delete();
    console.log(`Firestore document ${userIdToDelete} deleted.`);

    res.status(200).json({ message: "회원 탈퇴 성공" }); // 200 또는 204 No Content도 가능
  } catch (err) {
    console.error("회원 탈퇴 에러:", err);
    // Auth 삭제 또는 Firestore 삭제 실패 시 다른 에러 코드를 고려할 수 있습니다.
    res.status(500).json({ error: err.message });
  }
};
