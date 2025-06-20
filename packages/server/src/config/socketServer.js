import { Server as SocketIOServer } from "socket.io";
import { admin } from "./firebase.js"; // Firebase Admin SDK admin 인스턴스

// 1. Socket.IO 연결 시 Firebase ID Token 인증 미들웨어
const socketAuthMiddleware = async (socket, next) => {
  // 클라이언트가 Socket.IO 연결 시 'auth' 옵션에 토큰을 담아 보낼 것으로 가정
  // 예: io('...', { auth: { token: 'YOUR_FIREBASE_ID_TOKEN' } })
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log('Socket 연결 시 인증 토큰 없음: 연결 거부');
    // next(new Error(...))를 통해 연결을 거부하고 에러 메시지를 클라이언트에 전달
    return next(new Error("Authentication error: No token provided."));
  }

  try {
    // Firebase Admin SDK를 사용하여 ID 토큰 검증
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 검증된 토큰 정보를 socket 객체에 저장하여 이후 이벤트 핸들러에서 사용
    socket.decodedToken = decodedToken;
    socket.user = decodedToken; // req.user와 유사하게 socket.user로 접근 가능하도록 추가
    console.log(`Socket 인증 성공: User UID - ${decodedToken.uid}`);
    next(); // 연결 허용
  } catch (err) {
    console.error('Socket 인증 실패:', err.message);
    let message = "Authentication error: Invalid token.";
    if (err.code === "auth/id-token-expired") {
      message = "Authentication error: Token expired. Please log in again.";
    } else if (err.code === "auth/user-disabled") {
      message = "Authentication error: User account is disabled.";
    } else if (err.code === "auth/argument-error") {
      message = "Authentication error: Invalid token format.";
    }

    next(new Error(message)); // 에러 발생 시 연결 거부 및 에러 메시지 전달
  }
};


// 2. Socket.IO 서버 초기화 및 이벤트 핸들러 설정
export default function initSocketServer(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  // --- Socket.IO 인증 미들웨어 적용 ---
  // 모든 들어오는 소켓 연결은 이 미들웨어를 먼저 거쳐 인증됩니다.
  io.use(socketAuthMiddleware);
  // --- 인증 미들웨어 적용 끝 ---


  io.on("connection", (socket) => {
    // 이 시점에 도달한 socket은 이미 인증이 완료된 상태입니다.
    // socket.user 객체에 인증된 사용자 정보(uid, email 등)가 담겨 있습니다.
    console.log(`Socket 연결됨: ${socket.id}, User UID: ${socket.user.uid}`);

    // 특정 상담 방에 참가
    socket.on("join", (consultationId) => {
      // (선택적) 여기서 socket.user.uid를 사용하여 해당 상담방에 참여할 권한이 있는지 추가 검증 가능
      socket.join(consultationId);
      console.log(`방 참가: ${consultationId} by ${socket.user.uid}`);
    });

    // 메시지 수신 및 처리
    socket.on(
      "chatMessage",
      async ({ consultationId, senderType, content }) => {
        // senderId는 클라이언트에서 보내지 않고, 인증된 socket.user.uid를 사용합니다.
        const senderId = socket.user.uid;
        // (선택적) senderType이 'staff'인 경우, 해당 유저가 실제로 스태프 권한이 있는지 추가 검증
        // if (senderType === 'staff' && !['staff', 'manager', 'admin'].includes(socket.user.role)) {
        //    console.warn(`비인가 사용자(${senderId})가 staffType 메시지 전송 시도`);
        //    return; // 비인가 요청 무시 또는 에러 반환
        // }

        try {
          const db = admin.firestore(); // Firestore 인스턴스 가져오기
          const msgRef = db
            .collection("consultations")
            .doc(consultationId)
            .collection("messages")
            .doc();
          const now = admin.firestore.Timestamp.now(); // Firestore Timestamp 생성

          // 메시지 데이터를 Firestore에 저장
          await msgRef.set({
            id: msgRef.id,
            senderId, // 인증된 senderId 사용
            senderType, // 클라이언트가 보내는 senderType (patient/staff)
            content,
            sentAt: now,
            isActive: true, // 기본 활성 상태
          });

          // 상담 문서의 `updatedAt`, `status`, `handlerId` 업데이트
          await db
            .collection("consultations")
            .doc(consultationId)
            .update({
              updatedAt: now,
              status: senderType === "staff" ? "responded" : "pending", // 스태프 답변 시 responded, 환자 질문 시 pending
              handlerId: senderType === "staff" ? senderId : null, // 스태프 답변 시 담당자 지정, 환자 질문 시 null 또는 기존 유지
              // hasUnread 필드는 여기서 직접 변경하지 않고, setConsultationHandler 등에서 관리
            });

          // 해당 방의 모든 클라이언트에게 새 메시지 브로드캐스트
          io.to(consultationId).emit("newMessage", {
            id: msgRef.id,
            senderId,
            senderType,
            content,
            sentAt: now.toDate(), // 클라이언트 측에서 Date 객체로 파싱할 수 있도록 변환하여 전송
          });

          console.log(`메시지 broadcast 완료: ${content} by ${senderId} to room ${consultationId}`);

          // **상담 목록 업데이트 알림 (모든 클라이언트에게)**
          // 메시지 저장으로 상담 목록의 updatedAt, status 등이 변경될 수 있으므로 알립니다.
          io.emit("consultationListUpdated");

        } catch (err) {
          console.error("메시지 처리 실패:", err);
          socket.emit("error", { message: "메시지 저장 실패" }); // 클라이언트에게 에러 알림
        }
      }
    );

    // '입력 중...' 상태 처리 (Firestore 사용 안 함)
    socket.on('typing', ({ consultationId, isTyping }) => {
        const userId = socket.user.uid; // 인증된 사용자 UID 사용
        if (!consultationId) {
          console.warn(`Typing event received without consultationId from ${userId}`);
          return;
        }

        // 본인을 제외한 해당 방의 모든 클라이언트에게 'typingStatus' 이벤트 브로드캐스트
        // 이렇게 함으로써 데이터베이스 쓰기 없이 실시간으로 타이핑 상태를 전달합니다.
        socket.broadcast.to(consultationId).emit('typingStatus', {
            isTyping: isTyping,
            userId: userId // 누가 타이핑하는지 구분하기 위해 사용자 ID도 함께 보냄
        });
        // console.log(`Typing status for room ${consultationId} by ${userId}: ${isTyping}`);
    });

    // 클라이언트가 특정 방을 떠날 때
    socket.on('leave', (consultationId) => {
      console.log(`방 나가기: ${consultationId} by ${socket.user.uid}`);
      socket.leave(consultationId);
      // 나가는 사용자가 타이핑 중이었다면, 해당 사용자의 타이핑 상태를 해제하여 다른 사용자에게 알립니다.
      socket.broadcast.to(consultationId).emit('typingStatus', { isTyping: false, userId: socket.user.uid });
    });

    // 클라이언트 연결 해제 시
    socket.on("disconnect", () => {
      console.log(`연결 해제: ${socket.id}, User UID: ${socket.user?.uid || '미인증'}`);
      // (선택적) 연결이 끊긴 사용자가 이전에 참여했던 모든 방에 대해 해당 사용자의 타이핑 상태를 해제하는 로직을 추가할 수 있습니다.
      // 이를 위해서는 서버에서 socket.id와 참여했던 방 목록을 매핑하는 추가적인 상태 관리가 필요할 수 있습니다.
      // 현재는 `leave` 이벤트에서 명시적으로 처리하는 것을 권장합니다.
    });
  });

  // --- 중요: REST API에서 Socket.IO 이벤트를 발생시키려면,
  // initSocketServer 함수가 io 인스턴스를 반환하여 다른 모듈에서 접근할 수 있도록 하거나,
  // 컨트롤러 함수들이 io 인스턴스를 인자로 받도록 수정해야 합니다.
  // 예를 들어, server.js (메인 앱 파일)에서 initSocketServer(httpServer)를 호출하고,
  // io 객체를 Express app의 locals나 req 객체에 바인딩하여 컨트롤러에 전달할 수 있습니다.
  //
  // server.js (예시):
  // import express from 'express';
  // import http from 'http';
  // import initSocketServer from './initSocketServer.js';
  // const app = express();
  // const server = http.createServer(app);
  // const io = initSocketServer(server); // <-- io 인스턴스 초기화

  // app.use((req, res, next) => {
  //   req.io = io; // req 객체에 io 인스턴스 바인딩
  //   next();
  // });
  // app.use('/api', router); // 라우터 미들웨어
  // server.listen(3000, () => console.log('Server running on port 3000'));
  //
  // consultationController.js (예시):
  // export const setConsultationHandler = async (req, res) => {
  //   const ioInstance = req.io; // req.io로 io 인스턴스 접근
  //   // ... (기존 로직)
  //   await consultationRef.update(updateData);
  //   ioInstance.emit("consultationListUpdated"); // 여기서 이벤트 발생
  //   // ...
  // };
  //
  // staffReply 함수에서도 유사하게 적용.
  // 이는 클라이언트가 실시간으로 목록을 업데이트하도록 돕는 핵심 부분입니다.

  return io; // io 인스턴스를 반환하여 외부에서 접근할 수 있도록 함
}