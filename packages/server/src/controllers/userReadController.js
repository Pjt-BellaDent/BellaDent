import { db } from "../config/firebase.js";

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
      isActive: userData.isActive, // Firestore에서 가져옴
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

// 홈페이지 회원 정보 조회 (id)
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

// 전체 환자 정보 조회
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

// 환자 상세 정보 조회 (id)
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

// 환자 상세 정보 조회 (name)
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
          } else {
            userInfo.patientInfo = null;
          }
        } catch (subCollectionError) {
          userInfo.patientInfo = null;
        }
      }
      patientList.push(userInfo);
    }

    // 모든 사용자를 순회한 후, 결과 배열이 비어있는지 확인 (활성 상태의 patient가 한 명도 없는 경우)
    if (patientList.length === 0) {
      return res.status(404).json({
        message: "해당 이름을 가진 활성 상태의 환자 정보를 찾을 수 없습니다.",
      });
    }

    // 성공적으로 정보를 추출한 활성 사용자 목록 반환
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

// 직원 상세 정보 조회 (id)
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

    res
      .status(200)
      .json({ message: "직원 정보 조회 성공", staffInfo: userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 전체 직원 정보 조회
export const getAllStaff = async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    if (usersSnapshot.empty) {
      return res.status(404).json({ message: "No users found" });
    }

    const staffPromises = usersSnapshot.docs.map(async (doc) => {
      const userData = doc.data();
      // 'manager' 역할을 가진 사용자만 필터링합니다. (의사)
      if (userData.role === 'manager') {
        const staffDoc = await db.collection("users").doc(doc.id).collection("staffs").doc(doc.id).get();
        
        const baseStaffInfo = {
          uid: doc.id,
          name: userData.name,
          role: userData.role,
          department: userData.department || null, // 기본값 설정
          chairNumber: userData.chairNumber || null, // 기본값 설정
        };

        if (staffDoc.exists) {
          const staffData = staffDoc.data();
          return {
            ...baseStaffInfo,
            department: staffData.department || baseStaffInfo.department, // staffData 우선
            chairNumber: staffData.chairNumber || baseStaffInfo.chairNumber, // staffData 우선
          };
        }
        return baseStaffInfo; // staff 문서 없으면 기본 정보만 반환
      }
      return null;
    });

    const staffResults = await Promise.all(staffPromises);
    const allStaff = staffResults.filter(staff => staff !== null);

    res.status(200).json(allStaff);
  } catch (err) {
    console.error("Error fetching all staff:", err);
    res.status(500).json({ error: err.message });
  }
};
