// src/middleware/roleCheck.js
import { auth } from "../config/firebase.js";

export const authenticateFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증 토큰이 필요합니다." });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    req.user = decodedToken;

    next();
  } catch (err) {
    console.error("Firebase ID 토큰 검증 실패:", err.message);
    let message = "인증 실패: 유효하지 않은 토큰입니다.";
    if (err.code === "auth/id-token-expired") {
      message = "인증 실패: 토큰이 만료되었습니다. 다시 로그인해주세요.";
    } else if (err.code === "auth/user-disabled") {
      message = "인증 실패: 사용자 계정이 비활성화되었습니다.";
    } else if (err.code === "auth/argument-error") {
      message = "인증 실패: 토큰 형식이 잘못되었습니다.";
    }

    return res.status(401).json({ message, error: err.message });
  }
};

export const authorizeRoles = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;

    if (!req.user || !userRole || !requiredRoles.includes(userRole)) {
      return res.status(403).json({ message: "필요한 권한이 없습니다." });
    }

    next();
  };
};

export const patientRoleCheck = authorizeRoles([
  "patient",
  "staff",
  "manager",
  "admin",
]);
export const staffRoleCheck = authorizeRoles(["staff", "manager", "admin"]);
export const managerRoleCheck = authorizeRoles(["manager", "admin"]);
export const adminRoleCheck = authorizeRoles(["admin"]);
