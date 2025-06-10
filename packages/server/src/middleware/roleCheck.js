// middleware/authMiddleware.js
import { auth } from "../config/firebase.js"; // Firebase Admin SDK auth 인스턴스

// Firebase ID Token 인증 미들웨어
export const authenticateFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization 헤더가 없거나 Bearer 토큰 형식이 아니면 인증 실패
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증 토큰이 필요합니다." });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    // ** Firebase Admin SDK로 ID 토큰 검증 **
    // verifyIdToken은 토큰 서명, 발행자, 만료, 취소 상태, 사용자 활성화 상태 등을 모두 확인합니다.
    const decodedToken = await auth.verifyIdToken(idToken);

    // 검증된 토큰 정보를 req 객체에 추가 (UID, 이메일, 커스텀 클레임 등 포함)
    req.user = decodedToken;

    next(); // 다음 미들웨어 또는 라우트 핸들러로 이동
  } catch (err) {
    console.error("Firebase ID 토큰 검증 실패:", err.message);
    // Firebase Auth Error 코드를 확인하여 클라이언트에게 더 상세한 메시지 전달 가능
    let message = "인증 실패: 유효하지 않은 토큰입니다.";
    if (err.code === "auth/id-token-expired") {
      message = "인증 실패: 토큰이 만료되었습니다. 다시 로그인해주세요.";
    } else if (err.code === "auth/user-disabled") {
      message = "인증 실패: 사용자 계정이 비활성화되었습니다.";
    } else if (err.code === "auth/argument-error") {
      message = "인증 실패: 토큰 형식이 잘못되었습니다.";
    } // 기타 Firebase Auth 에러 코드 핸들링 추가

    return res.status(401).json({ message, error: err.message });
  }
};

// 역할 기반 권한 부여 미들웨어 팩토리
// requiredRoles: 이 라우트에 접근하기 위해 필요한 역할 배열 (예: ['staff', 'manager', 'admin'])
export const authorizeRoles = (requiredRoles) => {
  // 미들웨어 함수 반환
  return (req, res, next) => {
    // authenticateFirebaseToken 미들웨어가 먼저 실행되어 req.user에 검증된 토큰 정보가 있다고 가정
    const userRole = req.user && req.user.role; // req.user.role은 Auth Custom Claims에서 가져옴

    // req.user가 없거나 (인증 미들웨어 통과 못함), 사용자 역할이 요구되는 역할 목록에 없으면 권한 없음
    if (!req.user || !userRole || !requiredRoles.includes(userRole)) {
      return res.status(403).json({ message: "필요한 권한이 없습니다." }); // 403 Forbidden
    }

    next(); // 권한 확인 통과
  };
};

// 개별 역할 권한 부여 미들웨어 (authorizeRoles 팩토리를 사용하여 쉽게 정의 가능)
export const patientRoleCheck = authorizeRoles([
  "patient",
  "staff",
  "manager",
  "admin",
]); // 환자 포함 모든 인증된 사용자
export const staffRoleCheck = authorizeRoles(["staff", "manager", "admin"]); // 스태프 이상
export const managerRoleCheck = authorizeRoles(["manager", "admin"]); // 매니저 이상
export const adminRoleCheck = authorizeRoles(["admin"]); // 어드민만
