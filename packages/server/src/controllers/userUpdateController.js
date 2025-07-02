// src/controllers/userUpdateController.js
import { updateUserSchema } from "../models/user.js";
import { db, auth } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

export const updateUser = async (req, res) => {
  const paramsId = req.params.id;
  const authenticatedUser = req.user;

  if (
    authenticatedUser.uid !== paramsId &&
    !["staff", "manager", "admin"].includes(authenticatedUser.role)
  ) {
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

  delete value.role;
  delete value.id;
  delete value.email;

  const commonUpdateFields = value;

  try {
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    if (!userDoc.isActive) {
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    const batch = db.batch();
    const now = Timestamp.now();

    const updateCommonData = {
      ...commonUpdateFields,
      updatedAt: now,
    };

    batch.update(userDocRef, updateCommonData);

    await batch.commit();

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

  delete value.role;
  delete value.id;
  delete value.email;

  const { patientInfo, ...commonUpdateFields } = value;

  try {
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const existingUserData = userDoc.data();

    if (!existingUserData.isActive) {
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    const userRole = existingUserData.role;

    const batch = db.batch();
    const now = Timestamp.now();

    const updateCommonData = {
      ...commonUpdateFields,
      updatedAt: now,
    };

    batch.update(userDocRef, updateCommonData);

    if (userRole === "patient" && patientInfo) {
      const patientDocRef = userDocRef.collection("patients").doc(paramsId);

      const updatePatientData = {
        ...patientInfo,
      };

      batch.update(patientDocRef, updatePatientData);
    }

    await batch.commit();

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

  delete value.role;
  delete value.id;
  delete value.email;

  const { staffInfo, ...commonUpdateFields } = value;

  try {
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const existingUserData = userDoc.data();

    if (!existingUserData.isActive) {
      console.warn(`사용자 비활성화 for Auth user: ${paramsId}`);
      return res.status(404).json({
        message: "사용자 개정이 비활성화 되어 있습니다. 관리자에게 문의하세요.",
      });
    }

    const userRole = existingUserData.role;

    const batch = db.batch();
    const now = Timestamp.now();

    const updateCommonData = {
      ...commonUpdateFields,
      updatedAt: now,
    };

    batch.update(userDocRef, updateCommonData);

    if (["staff", "manager", "admin"].includes(userRole) && staffInfo) {
      const staffDocRef = userDocRef.collection("staffs").doc(paramsId);

      const updateStaffData = {
        ...staffInfo,
      };

      batch.update(staffDocRef, updateStaffData);
    }

    await batch.commit();

    res.status(200).json({ message: "직원 정보 수정 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 정보 수정 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

export const enableUser = async (req, res) => {
  const paramsId = req.params.id;

  try {
    const userRecord = await auth.getUser(paramsId);
    const currentClaims = userRecord.customClaims || {};

    await auth.setCustomUserClaims(paramsId, {
      ...currentClaims,
      isActive: true,
    });
    console.log(`Custom claim isActive: true set for user ${paramsId}`);

    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.error(`Firestore 문서 없음 for user: ${paramsId}`);
      return res
        .status(404)
        .json({ message: "활성화하려는 사용자를 찾을 수 없습니다." });
    }

    const batch = db.batch();
    const now = Timestamp.now();

    const updateData = {
      isActive: true,
      updatedAt: now,
    };

    batch.update(userDocRef, updateData);

    await batch.commit();
    console.log(`사용자 ${paramsId} 계정 활성화 성공`);

    res.status(200).json({ message: "계정 활성화 성공" });
  } catch (err) {
    console.error(`사용자 ${paramsId} 계정 활성화 중 오류 발생:`, err);
    res.status(500).json({ error: err.message });
  }
};

export const disabledUser = async (req, res) => {
  const paramsId = req.params.id;

  try {
    const userRecord = await auth.getUser(paramsId);
    const currentClaims = userRecord.customClaims || {};

    await auth.setCustomUserClaims(paramsId, {
      ...currentClaims,
      isActive: false,
    });
    console.log(`Custom claim isActive: false set for user ${paramsId}`);

    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.error(`Firestore 문서 없음 for user: ${paramsId}`);
      return res
        .status(404)
        .json({ message: "비활성화하려는 사용자를 찾을 수 없습니다." });
    }

    const batch = db.batch();
    const now = Timestamp.now();

    const updateData = {
      isActive: false,
      updatedAt: now,
    };

    batch.update(userDocRef, updateData);

    await batch.commit();
    console.log(
      `사용자 ${paramsId} 계정 비활성화 성공 (Firestore 업데이트 완료)`
    );

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
