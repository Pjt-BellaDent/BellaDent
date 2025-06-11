import {
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
    console.error("입력값 유효성 검사 실패:", error.details);
    return res
      .status(400)
      .json({ message: "입력값 유효성 검사 실패", details: error.details });
  }

  const { email, password, name, phone } = value;
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
      isActive: true,
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
    return res
      .status(400)
      .json({ message: "입력값 유효성 검사 실패", details: error.details });
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

    const commonUserData = {
      id: userId, // 문서 ID와 동일하게 id 필드 저장
      email: userRecord.email, // Auth 계정의 이메일
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
    return res
      .status(400)
      .json({ message: "입력값 유효성 검사 실패", details: error.details });
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

    const commonUserData = {
      id: userId, // 문서 ID와 동일하게 id 필드 저장
      email: userRecord.email, // Auth 계정의 이메일
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

// 계정 로그인
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
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const paramsId = req.params.id;
    // Firestore에서 해당 사용자의 추가 정보 조회
    const userDoc = await db.collection("users").doc(paramsId).get();

    if (!userDoc.exists) {
      // Auth 계정은 있지만 Firestore 문서가 없는 경우 (signup 과정 오류 등)
      console.warn(`Firestore 문서 없음 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data(); // Firestore 공통 사용자 정보

    if (!userData.isActive) {
      // 사용자가 비활성화된 경우
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    // 클라이언트에 반환할 사용자 정보 객체 구성
    const userInfo = {
      id: paramsId, // paramsId 사용
      email: userData.email, // Firestore에서 가져옴
      name: userData.name, // Firestore에서 가져옴
      phone: userData.phone, // Firestore에서 가져옴
      address: userData.address, // Firestore에서 가져옴
      role: userData.role, // Firestore에서 가져옴
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
      patientsInfo: allPatients, // 전체 환자 정보 배열 반환
      message: "전체 환자 정보 조회 성공",
    });
  } catch (err) {
    console.error("전체 환자 정보 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const paramsId = req.params.id;
    // Firestore에서 해당 사용자의 추가 정보 조회
    const userDoc = await db.collection("users").doc(paramsId).get();

    if (!userDoc.exists) {
      // Auth 계정은 있지만 Firestore 문서가 없는 경우 (signup 과정 오류 등)
      console.warn(`Firestore 문서 없음 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data(); // Firestore 공통 사용자 정보

    if (!userData.isActive) {
      // 사용자가 비활성화된 경우
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    // 하위 컬렉션 정보도 함께 조회
    let patientData = null;
    if (userData.role === "patient") {
      const patientDoc = await userDoc.ref
        .collection("patients")
        .doc(paramsId)
        .get();

      if (patientDoc.exists) {
        patientData = patientDoc.data();
      }
    }

    // 클라이언트에 반환할 사용자 정보 객체 구성
    const userInfo = {
      id: paramsId, // paramsId 사용
      email: userData.email, // Firestore에서 가져옴
      role: userData.role, // Firestore에서 가져옴
      name: userData.name, // Firestore에서 가져옴
      phone: userData.phone, // Firestore에서 가져옴
      address: userData.address, // Firestore에서 가져옴
      gender: userData.gender, // Firestore에서 가져옴
      birth: userData.birth, // Firestore에서 가져옴
      isActive: userData.isActive, // Firestore에서 가져옴
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      patientInfo: patientData, // 하위 컬렉션 정보 포함
    };

    res
      .status(200)
      .json({ message: "환자 정보 조회 성공", patientInfo: userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatientByName = async (req, res) => {
  try {
    const paramsName = req.params.id;
    // Firestore에서 해당 이름을 가진 모든 사용자 문서 조회
    const usersSnapshot = await db
      .collection("users")
      .where("name", "==", paramsName)
      .get();

    // 조회 결과가 비어있는 경우
    if (usersSnapshot.empty) {
      console.log(`사용자 찾을 수 없음 (이름: ${paramsName})`);
      return res.status(404).json({
        message: "해당 이름을 가진 사용자를 찾을 수 없습니다.",
      });
    }

    // 조회된 사용자 목록을 순회하며 정보를 추출하고 patient인 경우 하위 컬렉션 조회
    const patientList = []; // 결과를 담을 배열
    for (const userDocSnap of usersSnapshot.docs) {
      const userData = userDocSnap.data(); // 각 문서의 데이터
      const userId = userDocSnap.id; // 문서 ID
      // 사용자가 비활성화 상태인 경우 건너뛰기
      if (!userData.isActive) {
        console.log(`사용자 비활성화 상태, 건너뜀: ${userId}`);
        continue; // 다음 사용자로 이동
      }

      // 클라이언트에 반환할 기본 사용자 정보 객체 구성
      const userInfo = {
        id: userId, // 문서 ID 사용
        email: userData.email,
        role: userData.role,
        name: userData.name, // 쿼리 조건과 일치하는 이름
        phone: userData.phone || null, // 값이 없을 수 있으니 null 처리
        address: userData.address || null,
        gender: userData.gender || null,
        birth: userData.birth || null,
        isActive: userData.isActive,
        createdAt: userData.createdAt ? userData.createdAt.toDate() : null, // Timestamp를 Date 객체로 변환
        updatedAt: userData.updatedAt ? userData.updatedAt.toDate() : null, // Timestamp를 Date 객체로 변환
        patientInfo: null, // patient가 아니거나 데이터가 없을 경우 null 유지
      };

      // 역할이 "patient"인 경우 하위 컬렉션 정보 조회
      if (userData.role === "patient") {
        try {
          const patientDocSnap = await userDocSnap.ref
            .collection("patients")
            .doc(userId)
            .get();

          if (patientDocSnap.exists) {
            userInfo.patientInfo = patientDocSnap.data();
            console.log(`환자 정보 조회 성공: ${userId}`);
          } else {
            console.warn(
              `환자 하위 컬렉션 문서 찾을 수 없음: ${userId}/patients/${userId}`
            );

            userInfo.patientInfo = null;
          }
        } catch (subCollectionError) {
          console.error(
            `환자 하위 컬렉션 조회 오류 (${userId}):`,
            subCollectionError
          );

          userInfo.patientInfo = null;
        }
      }
      patientList.push(userInfo);
    }

    // 모든 사용자를 순회한 후, 결과 배열이 비어있는지 확인 (활성 상태의 patient가 한 명도 없는 경우)
    if (patientList.length === 0) {
      console.log(
        `해당 이름의 활성 사용자 중 patient 역할을 가진 사용자가 없습니다: ${paramsName}`
      );
      return res.status(404).json({
        message: "해당 이름을 가진 활성 상태의 환자 정보를 찾을 수 없습니다.",
      });
    }

    // 성공적으로 정보를 추출한 활성 사용자 목록 반환
    console.log(`총 ${patientList.length}명의 사용자 정보 조회 성공`);
    res.status(200).json({
      message: "사용자(들) 정보 조회 성공",
      patientInfo: patientList,
    });
  } catch (err) {
    console.error("사용자 정보 조회 중 서버 오류 발생:", err);
    res.status(500).json({
      message: "사용자 정보 조회 중 오류가 발생했습니다.",
    });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const paramsId = req.params.id;
    // Firestore에서 해당 사용자의 추가 정보 조회
    const userDoc = await db.collection("users").doc(paramsId).get();

    if (!userDoc.exists) {
      // Auth 계정은 있지만 Firestore 문서가 없는 경우 (signup 과정 오류 등)
      console.warn(`Firestore 문서 없음 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data(); // Firestore 공통 사용자 정보

    if (!userData.isActive) {
      // 사용자가 비활성화된 경우
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    // 하위 컬렉션 정보도 함께 조회
    let staffData = null;
    if (["staff", "manager", "admin"].includes(userData.role)) {
      const staffDoc = await userDoc.ref
        .collection("staffs")
        .doc(paramsId)
        .get();

      if (staffDoc.exists) {
        staffData = staffDoc.data();
      }
    }

    // 클라이언트에 반환할 사용자 정보 객체 구성
    const userInfo = {
      id: paramsId, // paramsId 사용
      email: userData.email, // Firestore에서 가져옴
      role: userData.role, // Firestore에서 가져옴
      name: userData.name, // Firestore에서 가져옴
      phone: userData.phone, // Firestore에서 가져옴
      address: userData.address, // Firestore에서 가져옴
      gender: userData.gender, // Firestore에서 가져옴
      birth: userData.birth, // Firestore에서 가져옴
      isActive: userData.isActive, // Firestore에서 가져옴
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      staffInfo: staffData, // 하위 컬렉션 정보 포함
    };

    res.status(200).json({ message: "직원 정보 조회 성공", staffInfo: userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
    console.log(`사용자 ${paramsId} 정보 수정 성공`);

    res.status(200).json({ message: "회원 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

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
    console.log(`사용자 ${paramsId} 정보 수정 성공`);

    res.status(200).json({ message: "환자 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

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
    console.log(`사용자 ${paramsId} 정보 수정 성공`);

    res.status(200).json({ message: "직원 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

export const enableUser = async (req, res) => {
  const paramsId = req.params.id;

  try {
    // Firestore에서 수정 대상 사용자의 현재 정보 및 역할을 조회
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    const updateData = {
      isActive: true, // 활성화 상태 true로 설정
      updatedAt: now, // 수정 시각 업데이트
    };

    batch.update(userDocRef, updateData);

    await batch.commit();
    console.log(`사용자 ${paramsId} 계정 활성화 성공`);

    res.status(200).json({ message: "계정 활성화 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const disabledUser = async (req, res) => {
  const paramsId = req.params.id;

  try {
    // Firestore에서 수정 대상 사용자의 현재 정보 및 역할을 조회
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Timestamp

    const updateData = {
      isActive: false, // 활성화 상태 false로 설정
      updatedAt: now, // 수정 시각 업데이트
    };

    batch.update(userDocRef, updateData);

    await batch.commit();
    console.log(`사용자 ${paramsId} 계정 비활성화 성공`);

    res.status(200).json({ message: "계정 비활성화 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const paramsId = req.params.id;

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
    const userRole = existingUserData.role; // 현재 사용자의 역할

    // ** 1. Firebase Authentication 사용자 계정 삭제 **
    await auth.deleteUser(paramsId);
    console.log(`Firebase Auth User ${paramsId} deleted.`);

    // ** 2. Firestore 문서 삭제 **
    const batch = db.batch(); // Batch 인스턴스 생성

    const userInfoDelete = db.collection("users").doc(paramsId);
    batch.delete(userInfoDelete); // 사용자 공통 정보 문서 삭제

    if (userRole === "patient") {
      const patientInfoDelete = db
        .collection("users")
        .doc(paramsId)
        .collection("patients")
        .doc(paramsId);
      batch.delete(patientInfoDelete); // 환자 정보 문서 삭제
    }

    if (["staff", "manager", "admin"].includes(userRole)) {
      const staffInfoDelete = db
        .collection("users")
        .doc(paramsId)
        .collection("staffs")
        .doc(paramsId);
      batch.delete(staffInfoDelete); // 직원 정보 문서 삭제
    }

    await batch.commit();
    console.log(`Firestore document ${paramsId} deleted.`);

    res.status(200).json({ message: "회원 탈퇴 성공" });
  } catch (err) {
    console.error("회원 탈퇴 에러:", err);
    res.status(500).json({ error: err.message });
  }
};
