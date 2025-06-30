import { Server as SocketIOServer } from "socket.io";
import { admin } from "./firebase.js"; // Firebase Admin SDK admin 인스턴스

/**
 * @function socketAuthMiddleware
 * @description Socket.IO 연결 시 Firebase ID Token을 검증하는 미들웨어.
 * 성공 시 socket 객체에 decodedToken 및 user 정보를 추가합니다.
 * @param {Socket} socket - Socket.IO 소켓 인스턴스
 * @param {Function} next - 다음 미들웨어 또는 이벤트 핸들러로 제어를 전달하는 콜백
 */
const socketAuthMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    // 토큰이 없는 경우 인증 오류 발생
    console.warn("Socket 인증 실패: 토큰이 제공되지 않았습니다.");
    return next(new Error("Authentication error: No token provided."));
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    socket.decodedToken = decodedToken; // Firebase에서 디코딩된 토큰 정보
    socket.user = decodedToken; // 사용자 정보로 편리하게 접근
    console.log(`Socket 인증 성공: User UID - ${decodedToken.uid}`);
    next(); // 인증 성공 시 다음으로 진행
  } catch (err) {
    console.error("Socket 인증 실패:", err.message);
    let message = "Authentication error: Invalid token.";
    // 토큰 만료 등 특정 오류 코드에 대한 메시지 구체화
    if (err.code === "auth/id-token-expired") {
      message = "Authentication error: ID token expired.";
    } else if (err.code === "auth/argument-error") {
      message = "Authentication error: Invalid token format.";
    }
    next(new Error(message)); // 인증 실패 시 에러 발생
  }
};

/**
 * @function initSocketServer
 * @description Express HTTP 서버에 Socket.IO 서버를 초기화하고 이벤트 핸들러를 설정합니다.
 * @param {object} server - Express HTTP 서버 인스턴스
 * @returns {SocketIOServer} 초기화된 Socket.IO 서버 인스턴스
 */
export default function initSocketServer(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://belladent.duckdns.org",
        "https://belladent.duckdns.org",
      ], // 허용할 클라이언트 도메인
      credentials: true, // 크로스-오리진 요청 시 자격 증명 허용
    },
  });

  io.use(socketAuthMiddleware); // 모든 소켓 연결에 인증 미들웨어 적용

  // Socket.IO 이벤트 리스너 설정
  io.on("connection", (socket) => {
    const userUid = socket.user?.uid || "Unknown"; // 인증된 사용자 UID
    console.log(`Socket 연결됨: ID - ${socket.id}, User UID: ${userUid}`);

    // 'join' 이벤트: 특정 상담방에 소켓을 조인시킵니다.
    socket.on("join", (consultationId) => {
      // consultationId가 객체로 전달된 경우 처리
      if (typeof consultationId === "object" && consultationId.consultationId) {
        consultationId = consultationId.consultationId;
      }

      if (!consultationId) {
        console.warn(
          `[Socket:join] consultationId가 제공되지 않았습니다. User: ${userUid}`
        );
        return;
      }
      socket.join(consultationId);
      console.log(`[Socket:join] 방 참가: ${consultationId} by ${userUid}`);
    });

    /**
     * @event chatMessage
     * @description 클라이언트로부터 새 메시지를 수신하고 Firestore에 저장한 후,
     * 해당 상담방의 다른 클라이언트와 전체 상담 목록에 브로드캐스트합니다.
     * 고객(환자)과 직원(staff) 모두 이 이벤트를 통해 메시지를 전송할 수 있습니다.
     * @param {object} data - 메시지 데이터 { consultationId, senderType, content }
     */
    socket.on("chatMessage", async (data) => {
      const { consultationId, senderType, content } = data;
      const senderId = socket.user.uid; // 메시지를 보낸 사용자(인증된 클라이언트)의 UID

      // 필수 데이터 유효성 검사
      if (!consultationId || !senderType || !content) {
        console.warn(
          `[Socket:chatMessage] 필수 데이터 누락: consultationId, senderType, content. User: ${senderId}`
        );
        socket.emit("error", { message: "메시지 데이터가 불완전합니다." });
        return;
      }

      // 'chatMessage' 이벤트는 기본적으로 'patient' senderType을 가정
      // 만약 'staff' senderType이 여기로 온다면, 이는 일반적이지 않거나
      // 백엔드의 REST API와 중복될 수 있으므로 주의
      if (senderType !== "patient" && senderType !== "staff") {
        console.warn(
          `[Socket:chatMessage] 유효하지 않은 senderType: ${senderType}. User: ${senderId}`
        );
        socket.emit("error", { message: "유효하지 않은 발신자 유형입니다." });
        return;
      }

      const db = admin.firestore();
      const now = admin.firestore.Timestamp.now();
      const batch = db.batch();

      const consultationRef = db
        .collection("consultations")
        .doc(consultationId);

      try {
        const consultationDoc = await consultationRef.get();

        // 상담 문서 생성 또는 업데이트
        if (!consultationDoc.exists) {
          // 새 상담 생성 (주로 환자의 첫 메시지)
          batch.set(consultationRef, {
            userId: consultationId, // 상담 ID와 사용자 ID 동일
            createdAt: now,
            updatedAt: now,
            status: "pending", // 새 상담은 대기 중 상태
            handlerId: null, // 초기에는 담당자 없음
            hasUnread: true, // 새 메시지가 있으므로 읽지 않음으로 표시
          });
          console.log(
            `[Firestore Batch] 새 상담 문서 생성 준비: ${consultationId}`
          );
        } else {
          // 기존 상담 업데이트 (새 메시지 추가)
          const currentConsultationData = consultationDoc.data();
          const newStatus = senderType === "staff" ? "responded" : "pending";
          batch.update(consultationRef, {
            updatedAt: now,
            status: newStatus, // 스태프 메시지면 'responded', 고객 메시지면 'pending'
            handlerId: currentConsultationData.handlerId || null, // 기존 담당자 유지
            hasUnread: true, // 새 메시지가 있으므로 읽지 않음으로 표시
          });
          console.log(
            `[Firestore Batch] 기존 상담 문서 업데이트 준비: ${consultationId} (상태: ${newStatus})`
          );
        }

        // 메시지 하위 컬렉션에 새 메시지 추가
        const msgRef = consultationRef.collection("messages").doc();
        batch.set(msgRef, {
          id: msgRef.id,
          senderId: senderId, // 인증된 사용자의 UID
          senderType: senderType,
          content: content,
          sentAt: now,
          isActive: true, // UI에 표시될 메시지 (소프트 삭제 아님)
        });
        console.log(`[Firestore Batch] 새 메시지 추가 준비: ${msgRef.id}`);

        await batch.commit();
        console.log(
          `[Firestore Commit] 메시지 ${msgRef.id} 저장 완료, 상담 ${consultationId} 업데이트 완료.`
        );

        // 본인을 제외한 해당 상담방의 다른 클라이언트에게 메시지 브로드캐스트
        // (프론트엔드는 본인 메시지를 즉시 UI에 추가하고, 서버로부터는 다른 클라이언트 메시지만 받도록)
        socket.broadcast.to(consultationId).emit("newMessage", {
          id: msgRef.id,
          senderId: senderId,
          senderType: senderType,
          content: content,
          sentAt: now.toDate(), // Date 객체로 변환하여 전송
          consultationId: consultationId,
        });

        // 모든 클라이언트에게 상담 목록 업데이트 알림
        // (새 메시지가 왔으므로 상담 상태/읽음 여부 등이 변경될 수 있음)
        io.emit("consultationListUpdated");

        console.log(
          `[Socket.IO] 메시지 처리 및 브로드캐스트 완료: 상담방 ${consultationId}, 메시지 ID ${msgRef.id}`
        );
      } catch (err) {
        console.error(
          `[Socket:chatMessage] 메시지 처리 실패 (상담 ID: ${consultationId}, User: ${senderId}):`,
          err
        );
        // 클라이언트에게 오류 알림
        socket.emit("serverError", {
          message: "메시지 저장 중 오류가 발생했습니다.",
          details: err.message, // 개발 단계에서 디버깅을 위해 상세 메시지 포함
        });
      }
    });

    // 'leave' 이벤트: 특정 상담방에서 소켓을 나갑니다.
    socket.on("leave", (consultationId) => {
      // consultationId가 객체로 전달된 경우 처리
      if (typeof consultationId === "object" && consultationId.consultationId) {
        consultationId = consultationId.consultationId;
      }

      if (!consultationId) {
        console.warn(
          `[Socket:leave] consultationId가 제공되지 않았습니다. User: ${userUid}`
        );
        return;
      }
      console.log(`[Socket:leave] 방 나가기: ${consultationId} by ${userUid}`);
      socket.leave(consultationId);
    });

    // 'disconnect' 이벤트: 소켓 연결이 끊어졌을 때 발생합니다.
    socket.on("disconnect", () => {
      console.log(
        `Socket 연결 해제: ID - ${socket.id}, User UID: ${
          socket.user?.uid || "미인증"
        }`
      );
    });
  });

  return io;
}
