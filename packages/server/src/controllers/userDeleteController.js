import { db, auth } from "../config/firebase.js";

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

    res.status(204).json({ message: "회원 탈퇴 성공" });
  } catch (err) {
    console.error("회원 탈퇴 에러:", err);
    res.status(500).json({ error: err.message });
  }
};
