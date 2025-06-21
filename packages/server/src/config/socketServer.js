import { Server as SocketIOServer } from "socket.io";
import { admin } from "./firebase.js"; // Firebase Admin SDK admin 인스턴스

// Socket.IO 연결 시 Firebase ID Token 인증 미들웨어 (변동 없음)
const socketAuthMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    /* ... */ return next(
      new Error("Authentication error: No token provided.")
    );
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    socket.decodedToken = decodedToken;
    socket.user = decodedToken;
    console.log(`Socket 인증 성공: User UID - ${decodedToken.uid}`);
    next();
  } catch (err) {
    console.error("Socket 인증 실패:", err.message);
    let message = "Authentication error: Invalid token."; /* ... */
    next(new Error(message));
  }
};

export default function initSocketServer(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware); // 인증 미들웨어 적용

  io.on("connection", (socket) => {
    console.log(`Socket 연결됨: ${socket.id}, User UID: ${socket.user.uid}`);

    socket.on("join", (consultationId) => {
      socket.join(consultationId);
      console.log(`방 참가: ${consultationId} by ${socket.user.uid}`);
    });

    // --- chatMessage 이벤트 핸들러 수정 ---
    socket.on(
      "chatMessage",
      async ({ consultationId, senderType, content }) => {
        const senderId = socket.user.uid; // 메시지를 보낸 사용자(환자)의 UID

        try {
          const db = admin.firestore();
          const now = admin.firestore.Timestamp.now();
          const batch = db.batch();

          const consultationRef = db
            .collection("consultations")
            .doc(consultationId);
          const consultationDoc = await consultationRef.get();

          if (!consultationDoc.exists) {
            batch.set(consultationRef, {
              userId: consultationId,
              createdAt: now,
              updatedAt: now,
              status: senderType === "staff" ? "responded" : "pending",
              handlerId: senderType === "staff" ? senderId : null,
            });
          } else {
            batch.update(consultationRef, {
              updatedAt: now,
              status: senderType === "staff" ? "responded" : "pending",
              handlerId:
                senderType === "staff"
                  ? senderId
                  : consultationDoc.data().handlerId || null,
            });
          }

          const msgRef = consultationRef.collection("messages").doc();
          batch.set(msgRef, {
            id: msgRef.id,
            senderId,
            senderType, // 여기서는 'patient'
            content,
            sentAt: now,
            isActive: true,
          });

          await batch.commit();

          // **핵심 변경: 본인을 제외한 다른 클라이언트에게만 브로드캐스트**
          // 사용자 자신의 메시지는 이미 클라이언트에서 즉시 추가했으므로,
          // 서버에서 다시 자신에게 보낼 필요가 없습니다.
          socket.broadcast.to(consultationId).emit("newMessage", {
            id: msgRef.id,
            senderId, // 여기서의 senderId는 사용자 자신의 UID
            senderType,
            content,
            sentAt: now.toDate(),
            consultationId,
          });

          io.emit("consultationListUpdated"); // 전체 목록 업데이트는 모든 클라이언트에게

          console.log(
            `Socket: 사용자 메시지 처리 및 브로드캐스트 완료: ${content} by ${senderId}`
          );
        } catch (err) {
          console.error("Socket: 메시지 처리 실패:", err);
          socket.emit("error", { message: "메시지 저장 실패" });
        }
      }
    );

    // 'typing' 이벤트 핸들러 (변동 없음)
    socket.on("typing", ({ consultationId, isTyping }) => {
      const userId = socket.user.uid;
      if (!consultationId) {
        /* ... */ return;
      }
      socket.broadcast
        .to(consultationId)
        .emit("typingStatus", { isTyping: isTyping, userId: userId });
      console.log(
        `Typing status for room ${consultationId} by ${userId}: ${isTyping}`
      );
    });

    // 'leave' 이벤트 핸들러 (변동 없음)
    socket.on("leave", (consultationId) => {
      console.log(`방 나가기: ${consultationId} by ${socket.user.uid}`);
      socket.leave(consultationId);
      socket.broadcast
        .to(consultationId)
        .emit("typingStatus", { isTyping: false, userId: socket.user.uid });
    });

    // 'disconnect' 이벤트 핸들러 (변동 없음)
    socket.on("disconnect", () => {
      console.log(
        `연결 해제: ${socket.id}, User UID: ${socket.user?.uid || "미인증"}`
      );
    });
  });

  return io;
}
