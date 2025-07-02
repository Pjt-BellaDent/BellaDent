// src/config/socketServer.js
import { Server as SocketIOServer } from "socket.io";
import { admin } from "./firebase.js";

const socketAuthMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.warn("Socket 인증 실패: 토큰이 제공되지 않았습니다.");
    return next(new Error("Authentication error: No token provided."));
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    socket.decodedToken = decodedToken;
    socket.user = decodedToken;
    console.log(`Socket 인증 성공: User UID - ${decodedToken.uid}`);
    next();
  } catch (err) {
    console.error("Socket 인증 실패:", err.message);
    let message = "Authentication error: Invalid token.";
    if (err.code === "auth/id-token-expired") {
      message = "Authentication error: ID token expired.";
    } else if (err.code === "auth/argument-error") {
      message = "Authentication error: Invalid token format.";
    }
    next(new Error(message));
  }
};

export default function initSocketServer(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://belladent.duckdns.org",
        "https://belladent.duckdns.org",
      ],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userUid = socket.user?.uid || "Unknown";
    console.log(`Socket 연결됨: ID - ${socket.id}, User UID: ${userUid}`);

    socket.on("join", (consultationId) => {
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

    socket.on("chatMessage", async (data) => {
      const { consultationId, senderType, content } = data;
      const senderId = socket.user.uid;

      if (!consultationId || !senderType || !content) {
        console.warn(
          `[Socket:chatMessage] 필수 데이터 누락: consultationId, senderType, content. User: ${senderId}`
        );
        socket.emit("error", { message: "메시지 데이터가 불완전합니다." });
        return;
      }

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

        if (!consultationDoc.exists) {
          batch.set(consultationRef, {
            userId: consultationId,
            createdAt: now,
            updatedAt: now,
            status: "pending",
            handlerId: null,
            hasUnread: true,
          });
          console.log(
            `[Firestore Batch] 새 상담 문서 생성 준비: ${consultationId}`
          );
        } else {
          const currentConsultationData = consultationDoc.data();
          const newStatus = senderType === "staff" ? "responded" : "pending";
          batch.update(consultationRef, {
            updatedAt: now,
            status: newStatus,
            handlerId: currentConsultationData.handlerId || null,
            hasUnread: true,
          });
          console.log(
            `[Firestore Batch] 기존 상담 문서 업데이트 준비: ${consultationId} (상태: ${newStatus})`
          );
        }

        const msgRef = consultationRef.collection("messages").doc();
        batch.set(msgRef, {
          id: msgRef.id,
          senderId: senderId,
          senderType: senderType,
          content: content,
          sentAt: now,
          isActive: true,
        });
        console.log(`[Firestore Batch] 새 메시지 추가 준비: ${msgRef.id}`);

        await batch.commit();
        console.log(
          `[Firestore Commit] 메시지 ${msgRef.id} 저장 완료, 상담 ${consultationId} 업데이트 완료.`
        );

        socket.broadcast.to(consultationId).emit("newMessage", {
          id: msgRef.id,
          senderId: senderId,
          senderType: senderType,
          content: content,
          sentAt: now.toDate(),
          consultationId: consultationId,
        });

        io.emit("consultationListUpdated");

        console.log(
          `[Socket.IO] 메시지 처리 및 브로드캐스트 완료: 상담방 ${consultationId}, 메시지 ID ${msgRef.id}`
        );
      } catch (err) {
        console.error(
          `[Socket:chatMessage] 메시지 처리 실패 (상담 ID: ${consultationId}, User: ${senderId}):`,
          err
        );
        socket.emit("serverError", {
          message: "메시지 저장 중 오류가 발생했습니다.",
          details: err.message,
        });
      }
    });

    socket.on("leave", (consultationId) => {
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
