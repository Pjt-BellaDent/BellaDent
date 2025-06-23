import { updateUserSchema } from "../models/user.js";
import { db, auth } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

// 홈페이지 회원 정보 수정
export const updateUser = async (req, res) => {
  const paramsId = req.params.id;
  const authenticatedUser = req.user; // 인증된 현재 사용자의 정보 (decodedToken)

  // ** 서버 측 접근 제어 (매우 중요!) **
  if (
    authenticatedUser.uid !== paramsId &&
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
      `사용자 ${paramsId} 정보 수정 유효성 검사 에러:`,
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
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    if (!userDoc.isActive) {
      // 사용자가 비활성화된 경우
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    // 회원 공통 정보 업데이트
    const updateCommonData = {
      ...commonUpdateFields,
      updatedAt: now, // 수정 시각 업데이트
    };

    batch.update(userDocRef, updateCommonData); // 공통 정보 update 작업 추가

    await batch.commit();

    res.status(200).json({ message: "회원 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

// 환자 정보 수정
export const updatePatient = async (req, res) => {
  const paramsId = req.params.id;

  const { value, error } = updateUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error(
      `사용자 ${paramsId} 정보 수정 유효성 검사 에러:`,
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
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const existingUserData = userDoc.data();

    if (!existingUserData.isActive) {
      // 사용자가 비활성화된 경우
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    const userRole = existingUserData.role; // 현재 사용자의 역할

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    // 회원 공통 정보 업데이트
    const updateCommonData = {
      ...commonUpdateFields,
      updatedAt: now, // 수정 시각 업데이트
    };

    batch.update(userDocRef, updateCommonData); // 공통 정보 update 작업 추가

    // 역할에 따라 하위 컬렉션 정보 업데이트
    if (userRole === "patient" && patientInfo) {
      // 현재 역할이 'patient'이고, patientInfo 데이터가 요청 body에 포함된 경우
      const patientDocRef = userDocRef.collection("patients").doc(paramsId);

      // patientInfo 업데이트 데이터만 포함
      const updatePatientData = {
        ...patientInfo,
      };

      batch.update(patientDocRef, updatePatientData); // 환자 정보 update 작업 추가
    }

    await batch.commit();

    res.status(200).json({ message: "환자 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

// 직원 정보 수정
export const updateStaff = async (req, res) => {
  const paramsId = req.params.id;

  const { value, error } = updateUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error(
      `사용자 ${paramsId} 정보 수정 유효성 검사 에러:`,
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
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const existingUserData = userDoc.data();

    if (!existingUserData.isActive) {
      // 사용자가 비활성화된 경우
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    const userRole = existingUserData.role; // 현재 사용자의 역할

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    // 회원 공통 정보 업데이트
    const updateCommonData = {
      ...commonUpdateFields,
      updatedAt: now, // 수정 시각 업데이트
    };

    batch.update(userDocRef, updateCommonData); // 공통 정보 update 작업 추가

    // 역할에 따라 하위 컬렉션 정보 업데이트
    if (["staff", "manager", "admin"].includes(userRole) && staffInfo) {
      // 현재 역할이 직원 이상이고, staffInfo 데이터가 요청 body에 포함된 경우
      const staffDocRef = userDocRef.collection("staffs").doc(paramsId);

      // staffInfo 업데이트 데이터만 포함
      const updateStaffData = {
        ...staffInfo,
      };

      batch.update(staffDocRef, updateStaffData); // 직원 정보 update 작업 추가
    }

    await batch.commit();

    res.status(200).json({ message: "직원 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

// 계정 활성화
export const enableUser = async (req, res) => {
  const paramsId = req.params.id;

  try {
    // 1. Firebase Authentication Custom Claim 업데이트
    const userRecord = await auth.getUser(paramsId);
    const currentClaims = userRecord.customClaims || {};

    await auth.setCustomUserClaims(paramsId, {
      ...currentClaims,
      isActive: true, // isActive를 true로 설정
    });
    console.log(`Custom claim isActive: true set for user ${paramsId}`);

    // 2. Firestore 문서 업데이트 (isActive 필드)
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.error(`Firestore 문서 없음 for user: ${paramsId}`);
      return res
        .status(404)
        .json({ message: "활성화하려는 사용자를 찾을 수 없습니다." });
    }

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    const updateData = {
      isActive: true, // 활성화 상태 true로 설정
      updatedAt: now, // 수정 시각 업데이트
    };

    batch.update(userDocRef, updateData);

    await batch.commit(); // Batch 실행
    console.log(`사용자 ${paramsId} 계정 활성화 성공`);

    res.status(200).json({ message: "계정 활성화 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 계정 활성화 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

// 계정 비활성화
export const disabledUser = async (req, res) => {
  const paramsId = req.params.id;

  try {
    // 1. Firebase Authentication Custom Claim 업데이트
    const userRecord = await auth.getUser(paramsId);
    const currentClaims = userRecord.customClaims || {};

    await auth.setCustomUserClaims(paramsId, {
      ...currentClaims,
      isActive: false, // isActive를 false로 설정
    });
    console.log(`Custom claim isActive: false set for user ${paramsId}`);

    // 2. Firestore 문서 업데이트 (isActive 필드)
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.error(`Firestore 문서 없음 for user: ${paramsId}`);
      return res
        .status(404)
        .json({ message: "비활성화하려는 사용자를 찾을 수 없습니다." });
    }

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    const updateData = {
      isActive: false, // 활성화 상태 false로 설정
      updatedAt: now, // 수정 시각 업데이트
    };

    batch.update(userDocRef, updateData);

    await batch.commit(); // Batch 실행
    console.log(
      `사용자 ${paramsId} 계정 비활성화 성공 (Firestore 업데이트 완료)`
    );

    // 3. (선택 사항이지만 권장) 사용자의 기존 세션 무효화
    await auth.revokeRefreshTokens(paramsId);
    console.log(
      `Refresh tokens revoked for user ${paramsId}. User must re-authenticate.`
    );

    res.status(200).json({ message: "계정 비활성화 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 계정 비활성화 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};
