// src/controllers/userReadController.js
import { db } from "../config/firebase.js";

export const signIn = async (req, res) => {
  try {
    const decodedToken = req.user;

    const userId = decodedToken.uid;
    const userRole = decodedToken.role;

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      console.warn(`Firestore 문서 없음 for Auth user: ${userId}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data();

    if (!userData.isActive) {
      console.warn(`사용자 비활성화 for Auth user: ${userId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    const userInfo = {
      id: userId,
      role: userRole,
      isActive: userData.isActive,
      name: userData.name,
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
    const userDoc = await db.collection("users").doc(paramsId).get();

    if (!userDoc.exists) {
      console.warn(`Firestore 문서 없음 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data();

    if (!userData.isActive) {
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    const userInfo = {
      id: paramsId,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      role: userData.role,
      isActive: userData.isActive,
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
      .where("role", "==", "patient")
      .get();

    if (patientsDoc.empty) {
      return res.status(404).json({ message: "조회된 환자 정보가 없습니다." });
    }

    const patientPromises = patientsDoc.docs.map(async (userDoc) => {
      const userData = userDoc.data();
      const userId = userData.id;

      const patientDoc = await userDoc.ref
        .collection("patients")
        .doc(userId)
        .get();

      let patientData = null;
      if (patientDoc.exists) {
        patientData = patientDoc.data();
      }

      const userInfo = {
        id: userId,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender,
        birth: userData.birth,
        isActive: userData.isActive,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        patientInfo: patientData,
      };

      return userInfo;
    });

    const allPatients = await Promise.all(patientPromises);

    res.status(200).json({
      patientsInfo: allPatients,
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
    const userDoc = await db.collection("users").doc(paramsId).get();

    if (!userDoc.exists) {
      console.warn(`Firestore 문서 없음 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data();

    if (!userData.isActive) {
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

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

    const userInfo = {
      id: paramsId,
      email: userData.email,
      role: userData.role,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      gender: userData.gender,
      birth: userData.birth,
      isActive: userData.isActive,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      patientInfo: patientData,
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
    const usersSnapshot = await db
      .collection("users")
      .where("name", "==", paramsName)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({
        message: "해당 이름을 가진 사용자를 찾을 수 없습니다.",
      });
    }

    const patientList = [];
    for (const userDocSnap of usersSnapshot.docs) {
      const userData = userDocSnap.data();
      const userId = userDocSnap.id;
      if (!userData.isActive) {
        continue;
      }

      const userInfo = {
        id: userId,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        phone: userData.phone || null,
        address: userData.address || null,
        gender: userData.gender || null,
        birth: userData.birth || null,
        isActive: userData.isActive,
        createdAt: userData.createdAt ? userData.createdAt.toDate() : null,
        updatedAt: userData.updatedAt ? userData.updatedAt.toDate() : null,
        patientInfo: null,
      };

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

    if (patientList.length === 0) {
      return res.status(404).json({
        message: "해당 이름을 가진 활성 상태의 환자 정보를 찾을 수 없습니다.",
      });
    }

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
    const userDoc = await db.collection("users").doc(paramsId).get();

    if (!userDoc.exists) {
      console.warn(`Firestore 문서 없음 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 정보를 찾을 수 없습니다. 관리자에게 문의하세요.",
      });
    }
    const userData = userDoc.data();

    if (!userData.isActive) {
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

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

    const userInfo = {
      id: paramsId,
      email: userData.email,
      role: userData.role,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      gender: userData.gender,
      birth: userData.birth,
      isActive: userData.isActive,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      staffInfo: staffData,
    };

    res
      .status(200)
      .json({ message: "직원 정보 조회 성공", staffInfo: userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    if (usersSnapshot.empty) {
      return res.status(404).json({ message: "No users found" });
    }

    const staffPromises = usersSnapshot.docs.map(async (doc) => {
      const userData = doc.data();
      if (userData.role === "manager") {
        const staffDoc = await db
          .collection("users")
          .doc(doc.id)
          .collection("staffs")
          .doc(doc.id)
          .get();

        const baseStaffInfo = {
          uid: doc.id,
          name: userData.name,
          role: userData.role,
          department: userData.department || null,
          chairNumber: userData.chairNumber || null,
        };

        if (staffDoc.exists) {
          const staffData = staffDoc.data();
          return {
            ...baseStaffInfo,
            department: staffData.department || baseStaffInfo.department,
            chairNumber: staffData.chairNumber || baseStaffInfo.chairNumber,
          };
        }
        return baseStaffInfo;
      }
      return null;
    });

    const staffResults = await Promise.all(staffPromises);
    const allStaff = staffResults.filter((staff) => staff !== null);

    res.status(200).json(allStaff);
  } catch (err) {
    console.error("Error fetching all staff:", err);
    res.status(500).json({ error: err.message });
  }
};
