import { Server as SocketIOServer } from "socket.io";
import { admin } from "./firebase.js";

export default function initSocketServer(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket 연결됨: ${socket.id}`);

    socket.on("join", (consultationId) => {
      socket.join(consultationId);
      console.log(`방 참가: ${consultationId}`);
    });

    socket.on(
      "chatMessage",
      async ({ consultationId, senderId, senderType, content }) => {
        try {
          const db = admin.firestore();
          const msgRef = db
            .collection("consultations")
            .doc(consultationId)
            .collection("messages")
            .doc();
          const now = admin.firestore.Timestamp.now();

          await msgRef.set({
            id: msgRef.id,
            senderId,
            senderType,
            content,
            sentAt: now,
            isActive: true,
          });

          await db
            .collection("consultations")
            .doc(consultationId)
            .update({
              updatedAt: now,
              status: senderType === "staff" ? "responded" : "pending",
              handlerId: senderType === "staff" ? senderId : null,
            });

          io.to(consultationId).emit("newMessage", {
            id: msgRef.id,
            senderId,
            senderType,
            content,
            sentAt: now.toDate(),
          });

          console.log(`메시지 broadcast 완료: ${content}`);
        } catch (err) {
          console.error("메시지 처리 실패:", err);
          socket.emit("error", { message: "메시지 저장 실패" });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`연결 해제: ${socket.id}`);
    });
  });
}
