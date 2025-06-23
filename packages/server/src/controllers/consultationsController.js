// consultationsController.js

import axios from "axios";
import dotenv from "dotenv";
import { db } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";
import {
  createOrAddMessageSchema,
  aiChatBotReplySchema,
  staffReplySchema,
  activeMessageSchema,
  handleConsultationSchema,
} from "../models/consultation.js";

dotenv.config();

/**
 * @function handleValidationError
 * @description Joi 유효성 검사 오류를 처리하고 표준화된 응답을 보냅니다.
 * @param {object} res - Express 응답 객체
 * @param {object} error - Joi 유효성 검사 오류 객체
 * @returns {Response} 400 Bad Request 응답
 */
const handleValidationError = (
  res,
  error,
  functionName = "Unknown Function"
) => {
  console.error(`${functionName} Validation Error:`, error.details);
  return res.status(400).json({
    message: "Validation Error",
    details: error.details.map((d) => ({
      path: d.path,
      message: d.message,
    })),
  });
};

/**
 * @function createOrAddMessage
 * @description 새로운 상담을 시작하거나 기존 상담에 고객 메시지를 추가합니다.
 * Socket.IO를 통해 새 메시지와 상담 목록 업데이트를 브로드캐스트합니다.
 * @param {object} req - Express 요청 객체 (req.user, req.io 포함)
 * @param {object} res - Express 응답 객체
 */
export const createOrAddMessage = async (req, res) => {
  const authenticatedUser = req.user;
  const consultationId = authenticatedUser.uid;
  const userId = authenticatedUser.uid;
  const ioInstance = req.io;

  const { value, error } = createOrAddMessageSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return handleValidationError(res, error, "createOrAddMessage");
  }

  const { question } = value;

  try {
    const now = Timestamp.now();
    const batch = db.batch();
    const consultationRef = db.collection("consultations").doc(consultationId);
    const consultationDoc = await consultationRef.get();

    let isNewConsultation = false;

    if (!consultationDoc.exists) {
      isNewConsultation = true;
      const newConsultationData = {
        userId: userId,
        createdAt: now,
        updatedAt: now,
        status: "pending",
        handlerId: null,
        hasUnread: true,
      };
      batch.set(consultationRef, newConsultationData);
      console.log(
        `[Firestore Batch] 새 상담 문서 생성 예정: ${consultationId}`
      );
    } else {
      const updateConsultationData = {
        updatedAt: now,
        status: "pending",
        hasUnread: true,
      };
      batch.update(consultationRef, updateConsultationData);
      console.log(
        `[Firestore Batch] 기존 상담 문서 업데이트 예정: ${consultationId}`
      );
    }

    const msgRef = consultationRef.collection("messages").doc();
    const newMessageData = {
      id: msgRef.id,
      senderId: userId,
      senderType: "patient",
      message: question,
      isActive: true,
      sentAt: now,
    };
    batch.set(msgRef, newMessageData);
    console.log(`[Firestore Batch] 새 고객 메시지 추가 예정: ${msgRef.id}`);

    await batch.commit();
    console.log(
      `[Firestore Commit] 상담 및 메시지 저장 완료: ${consultationId}`
    );

    if (ioInstance) {
      ioInstance.to(consultationId).emit("newMessage", {
        id: msgRef.id,
        senderId: userId,
        senderType: "patient",
        content: question,
        sentAt: now.toDate(),
        consultationId: consultationId,
      });
      ioInstance.emit("consultationListUpdated");
      console.log(
        `[Socket.IO] 고객 질문 broadcast 완료: 상담방 ${consultationId}, 메시지 ID ${msgRef.id}`
      );
    } else {
      console.warn(
        "createOrAddMessage: Socket.IO 인스턴스를 찾을 수 없습니다. 메시지 브로드캐스트 실패."
      );
    }

    if (isNewConsultation) {
      res.status(201).json({ message: "새 상담이 성공적으로 등록되었습니다." });
    } else {
      res.status(200).json({ message: "메시지가 성공적으로 추가되었습니다." });
    }
  } catch (error) {
    console.error("createOrAddMessage Error:", error);
    res.status(500).json({
      message: "메시지 처리 중 내부 서버 오류 발생",
      errorDetails: error.message,
    });
  }
};

/**
 * @function aiChatBotReply
 * @description AI 챗봇의 답변을 생성하고 저장하며, Socket.IO를 통해 브로드캐스트합니다.
 * @param {object} req - Express 요청 객체 (req.user, req.io 포함)
 * @param {object} res - Express 응답 객체
 */
export const aiChatBotReply = async (req, res) => {
  const authenticatedUser = req.user;
  const consultationId = authenticatedUser.uid;
  const ioInstance = req.io;

  const { value, error } = aiChatBotReplySchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return handleValidationError(res, error, "aiChatBotReply");
  }
  const { question } = value;

  try {
    const aiFunctionUrl = process.env.FIREBASE_FUNCTION_URL;
    if (!aiFunctionUrl) {
      console.error("환경 변수 'FIREBASE_FUNCTION_URL'이 설정되지 않았습니다.");
      return res
        .status(500)
        .json({ message: "AI 서비스 URL이 구성되지 않았습니다." });
    }

    const functionResponse = await axios.post(
      aiFunctionUrl,
      { question },
      { headers: { "Content-Type": "application/json" } }
    );

    if (functionResponse.status < 200 || functionResponse.status >= 300) {
      console.error(
        `AI 서비스 호출 실패: 상태 코드 ${
          functionResponse.status
        }, 응답: ${JSON.stringify(functionResponse.data)}`
      );
      return res.status(functionResponse.status).json({
        message: functionResponse.data?.message || "AI 서비스 응답 오류",
        details: functionResponse.data,
      });
    }

    const aiAnswer =
      functionResponse.data?.answer ||
      functionResponse.data?.message ||
      "답변 없음";

    const batch = db.batch();
    const now = Timestamp.now();
    const aiUid = "aiChatBot";
    const consultationRef = db.collection("consultations").doc(consultationId);
    const consultationDoc = await consultationRef.get();

    if (!consultationDoc.exists) {
      batch.set(consultationRef, {
        userId: consultationId,
        createdAt: now,
        updatedAt: now,
        status: "responded",
        handlerId: aiUid,
        hasUnread: true,
      });
      console.log(
        `[Firestore Batch] AI: 새 상담 문서 생성 예정: Consultation ID ${consultationId}`
      );
    } else {
      batch.update(consultationRef, {
        updatedAt: now,
        status: "responded",
        handlerId: aiUid,
        hasUnread: true,
      });
      console.log(
        `[Firestore Batch] AI: 기존 상담 문서 업데이트 예정: Consultation ID ${consultationId}`
      );
    }

    const messageRef = consultationRef.collection("messages").doc();
    batch.set(messageRef, {
      id: messageRef.id,
      senderId: aiUid,
      senderType: "ai",
      message: aiAnswer,
      isActive: true,
      sentAt: now,
    });
    console.log(
      `[Firestore Batch] AI: 새 AI 메시지 추가 예정: Message ID ${messageRef.id}`
    );

    await batch.commit();
    console.log(
      `[Firestore Commit] AI: 상담 처리 완료: Consultation ID ${consultationId}, AI 답변 추가.`
    );

    if (ioInstance) {
      console.log(
        `[Socket.IO] AI: Attempting to broadcast AI reply to room ${consultationId}`
      );
      ioInstance.to(consultationId).emit("newMessage", {
        id: messageRef.id,
        senderId: aiUid,
        senderType: "ai",
        content: aiAnswer,
        sentAt: now.toDate(),
        consultationId: consultationId,
      });
      console.log(
        `[Socket.IO] AI: AI 답변 broadcast 완료: 상담방 ${consultationId}, 메시지 ID ${messageRef.id}`
      );
      ioInstance.emit("consultationListUpdated");
    } else {
      console.warn(
        "aiChatBotReply: Socket.IO 인스턴스를 찾을 수 없습니다. 메시지 브로드캐스트 실패."
      );
    }

    res.status(200).json({ message: "AI 답변 처리 성공", answer: aiAnswer });
  } catch (error) {
    console.error("aiChatBotReply Error:", error);
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        message: "AI 서비스 통신 중 오류 발생",
        errorDetails: error.response?.data || error.message,
      });
    } else if (
      error.message &&
      error.message.includes("No document to update")
    ) {
      res.status(500).json({
        message: "AI 답변 저장 중 오류 발생: 대상 상담 문서 없음.",
        errorDetails: error.message,
      });
    } else if (error.message && error.message.includes("Batch commit failed")) {
      res.status(500).json({
        message: "AI 답변 저장 중 Firestore Batch Commit 실패",
        errorDetails: error.message,
      });
    } else {
      res.status(500).json({
        message: "내부 서버 오류 발생",
        errorDetails: error.message,
      });
    }
  }
};

/**
 * @function staffReply
 * @description 스태프의 답변을 저장하고, Socket.IO를 통해 브로드캐스트합니다.
 * @param {object} req - Express 요청 객체 (req.user, req.io, req.params.id 포함)
 * @param {object} res - Express 응답 객체
 */
export const staffReply = async (req, res) => {
  const authenticatedUser = req.user;
  const staffId = authenticatedUser.uid;
  const consultationId = req.params.id;
  const ioInstance = req.io;

  const { value, error } = staffReplySchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return handleValidationError(res, error, "staffReply");
  }

  const { answer } = value;

  try {
    const consultationDoc = await db
      .collection("consultations")
      .doc(consultationId)
      .get();
    if (!consultationDoc.exists) {
      console.warn(
        `staffReply: 상담 문서 ${consultationId}를 찾을 수 없습니다.`
      );
      return res
        .status(404)
        .json({ message: "답변하려는 상담을 찾을 수 없습니다." });
    }

    const now = Timestamp.now();
    const batch = db.batch();
    const consultationRef = db.collection("consultations").doc(consultationId);

    batch.update(consultationRef, {
      updatedAt: now,
      status: "completed",
      handlerId: staffId,
      hasUnread: true,
    });
    console.log(
      `[Firestore Batch] 상담 문서 ${consultationId} 업데이트 예정 (스태프 답변).`
    );

    const msgRef = consultationRef.collection("messages").doc();
    batch.set(msgRef, {
      id: msgRef.id,
      senderId: staffId,
      senderType: "staff",
      message: answer,
      isActive: true,
      sentAt: now,
    });
    console.log(`[Firestore Batch] 새 스태프 메시지 추가 예정: ${msgRef.id}`);

    await batch.commit();
    console.log(
      `[Firestore Commit] 상담 내역 ${consultationId} 갱신 및 스태프 답변 메시지 저장 완료.`
    );

    if (ioInstance) {
      ioInstance.to(consultationId).emit("newMessage", {
        id: msgRef.id,
        senderId: staffId,
        senderType: "staff",
        content: answer,
        sentAt: now.toDate(),
        consultationId: consultationId,
      });
      ioInstance.emit("consultationListUpdated");
      console.log(
        `[Socket.IO] 스태프 답변 broadcast 완료: 상담방 ${consultationId}, 메시지 ID ${msgRef.id}`
      );
    }

    res.status(200).json({ message: "답변이 성공적으로 등록되었습니다." });
  } catch (error) {
    console.error("staffReply Error:", error);
    res.status(500).json({
      message: "답변 처리 중 내부 서버 오류 발생",
      errorDetails: error.message,
    });
  }
};

/**
 * @function getAllConsultations
 * @description 모든 상담 목록을 조회하고 반환합니다.
 * 각 상담의 고객 이름과 담당자 이름(있을 경우)을 함께 조회합니다.
 * @param {object} req - Express 요청 객체
 * @param {object} res - Express 응답 객체
 */
export const getAllConsultations = async (req, res) => {
  try {
    const consultationsSnapshot = await db
      .collection("consultations")
      .orderBy("updatedAt", "desc")
      .get();

    if (consultationsSnapshot.empty) {
      console.log("[getAllConsultations] 조회된 상담 정보가 없습니다.");
      return res
        .status(200)
        .json({ consultations: [], message: "조회된 상담 정보가 없습니다." });
    }

    const consultationsData = await Promise.all(
      consultationsSnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const userId = data.userId;
        let userName = "(이름 없음)";
        let handlerName = null;

        try {
          const userDoc = await db.collection("users").doc(userId).get();
          if (userDoc.exists) {
            userName = userDoc.data().name || "(이름 없음)";
          }

          if (data.handlerId && data.handlerId !== "aiChatBot") {
            const handlerDoc = await db
              .collection("users")
              .doc(data.handlerId)
              .get();
            if (handlerDoc.exists) {
              handlerName = handlerDoc.data().name || "(알 수 없음)";
            }
          } else if (data.handlerId === "aiChatBot") {
            handlerName = "AI 챗봇";
          }
        } catch (nameFetchErr) {
          console.warn(
            `[getAllConsultations] 고객/담당자 이름 조회 오류 (ID: ${userId}/${
              data.handlerId || "none"
            }):`,
            nameFetchErr.message
          );
        }

        return {
          id: docSnap.id,
          userId: userId,
          name: userName,
          status: data.status,
          handlerId: data.handlerId || null,
          handlerName: handlerName,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
          hasUnread:
            typeof data.hasUnread === "boolean" ? data.hasUnread : false,
        };
      })
    );

    res.status(200).json({
      consultations: consultationsData,
      message: "전체 상담 조회 성공",
    });
  } catch (err) {
    console.error("getAllConsultations Error:", err);
    res.status(500).json({
      message: "상담 목록 조회 중 내부 서버 오류 발생",
      errorDetails: err.message,
    });
  }
};

/**
 * @function getMessagesById
 * @description 특정 상담 ID에 해당하는 모든 메시지를 조회합니다.
 * @param {object} req - Express 요청 객체 (req.params.id, req.user 포함)
 * @param {object} res - Express 응답 객체
 */
export const getMessagesById = async (req, res) => {
  const consultationId = req.params.id;
  const authenticatedUser = req.user;
  const requestingUserId = authenticatedUser.uid;

  try {
    const consultationRef = db.collection("consultations").doc(consultationId);
    const consultationDoc = await consultationRef.get();

    if (!consultationDoc.exists) {
      console.log(
        `getMessagesById: Consultation document for ID: ${consultationId} does not exist. Returning empty messages.`
      );
      return res.status(200).json({ messages: [] });
    }

    const consultationData = consultationDoc.data();

    const messagesRef = consultationRef.collection("messages");
    const messagesSnap = await messagesRef.orderBy("sentAt", "asc").get();

    if (messagesSnap.empty) {
      console.log(
        `getMessagesById: No messages found in subcollection for consultation ID: ${consultationId}`
      );
      return res.status(200).json({ messages: [] });
    }

    const messagesData = messagesSnap.docs.map((doc) => {
      const messageData = doc.data();
      return {
        id: doc.id,
        senderId: messageData.senderId,
        senderType: messageData.senderType,
        content: messageData.message || messageData.content,
        sentAt: messageData.sentAt?.toDate ? messageData.sentAt.toDate() : null,
        isActive:
          typeof messageData.isActive === "boolean"
            ? messageData.isActive
            : true,
      };
    });

    res.status(200).json({ messages: messagesData });
  } catch (err) {
    console.error(`getMessagesById Error for ID ${consultationId}:`, err);
    res.status(500).json({
      message: "상담 메시지 조회 중 내부 서버 오류 발생",
      errorDetails: err.message,
    });
  }
};

/**
 * @function setConsultationHandler
 * @description 특정 상담의 담당자를 지정하거나 해제합니다.
 * 이 함수는 `updatedAt`을 갱신하지 않아 상담 목록 정렬에 영향을 주지 않습니다.
 * Socket.IO를 통해 `consultationListUpdated` 이벤트를 브로드캐스트합니다.
 * @param {object} req - Express 요청 객체 (req.params.id, req.user, req.io 포함)
 * @param {object} res - Express 응답 객체
 */
export const setConsultationHandler = async (req, res) => {
  const authenticatedUser = req.user;
  const staffId = authenticatedUser.uid;
  const consultationIdFromParams = req.params.id;
  const ioInstance = req.io; // Socket.IO 인스턴스 가져오기

  // Joi 유효성 검사
  const { value, error } = handleConsultationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return handleValidationError(res, error, "setConsultationHandler");
  }

  const { handlerId, hasUnread } = value;

  // handlerId가 null이 아닐 경우, 요청을 보낸 스태프와 일치하는지 확인 (보안)
  if (handlerId !== null && staffId !== handlerId) {
    console.warn(
      `setConsultationHandler: 요청한 스태프 ID (${staffId})와 handlerId (${handlerId}) 불일치.`
    );
    return res
      .status(403)
      .json({
        message: "요청한 스태프 ID와 일치하지 않습니다. 권한이 없습니다.",
      });
  }

  try {
    const consultationRef = db
      .collection("consultations")
      .doc(consultationIdFromParams);
    const consultationDoc = await consultationRef.get();

    if (!consultationDoc.exists) {
      console.warn(
        `setConsultationHandler: 상담 문서 ${consultationIdFromParams}를 찾을 수 없습니다.`
      );
      return res.status(404).json({ message: "해당 상담을 찾을 수 없습니다." });
    }

    const updateData = {
      handlerId: handlerId, // null (해제) 또는 직원 UID (지정)
    };
    if (typeof hasUnread === "boolean") {
      updateData.hasUnread = hasUnread;
    }

    await consultationRef.update(updateData);

    const action = handlerId === null ? "해제" : "지정";
    console.log(
      `상담 ${consultationIdFromParams}의 담당자가 ${
        handlerId || "없음"
      }으로 ${action}되었습니다.`
    );

    // Socket.IO를 통해 모든 클라이언트에게 상담 목록 업데이트 알림
    if (ioInstance) {
      ioInstance.emit("consultationListUpdated");
      console.log(
        `[Socket.IO] 상담 ${consultationIdFromParams} 담당자 변경: consultationListUpdated 브로드캐스트 완료.`
      );
    } else {
      console.warn(
        "setConsultationHandler: Socket.IO 인스턴스를 찾을 수 없습니다. 브로드캐스트 실패."
      );
    }

    res
      .status(200)
      .json({ message: `상담 담당자가 성공적으로 ${action}되었습니다.` });
  } catch (error) {
    console.error("setConsultationHandler Error:", error);
    res.status(500).json({
      message: "상담 담당자 업데이트 중 내부 서버 오류 발생",
      errorDetails: error.message,
    });
  }
};

/**
 * @function enableMessage
 * @description 특정 상담 메시지를 활성화 (isActive: true) 상태로 변경합니다.
 * @param {object} req - Express 요청 객체 (req.params.id, req.body.consultationId 포함)
 * @param {object} res - Express 응답 객체
 */
export const enableMessage = async (req, res) => {
  const { value, error } = activeMessageSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return handleValidationError(res, error, "enableMessage");
  }

  const { consultationId } = value;
  const messageId = req.params.id;

  try {
    const messageRef = db
      .collection("consultations")
      .doc(consultationId)
      .collection("messages")
      .doc(messageId);

    const messageDoc = await messageRef.get();
    if (!messageDoc.exists) {
      console.warn(
        `enableMessage: 메시지 ${messageId} (상담 ${consultationId})를 찾을 수 없습니다.`
      );
      return res.status(404).json({ message: "메시지를 찾을 수 없습니다." });
    }

    await messageRef.update({ isActive: true });
    console.log(`메시지 ${messageId} 활성화 완료: 상담 ID ${consultationId}`);

    res.status(200).json({ message: `메시지 활성화 성공` });
  } catch (err) {
    console.error("enableMessage Error:", err);
    res.status(500).json({
      message: "메시지 활성화 중 내부 서버 오류 발생",
      errorDetails: err.message,
    });
  }
};

/**
 * @function disabledMessage
 * @description 특정 상담 메시지를 비활성화 (isActive: false) 상태로 변경합니다.
 * @param {object} req - Express 요청 객체 (req.params.id, req.body.consultationId 포함)
 * @param {object} res - Express 응답 객체
 */
export const disabledMessage = async (req, res) => {
  const { value, error } = activeMessageSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return handleValidationError(res, error, "disabledMessage");
  }

  const { consultationId } = value;
  const messageId = req.params.id;

  try {
    const messageRef = db
      .collection("consultations")
      .doc(consultationId)
      .collection("messages")
      .doc(messageId);

    const messageDoc = await messageRef.get();
    if (!messageDoc.exists) {
      console.warn(
        `disabledMessage: 메시지 ${messageId} (상담 ${consultationId})를 찾을 수 없습니다.`
      );
      return res.status(404).json({ message: "메시지를 찾을 수 없습니다." });
    }
    await messageRef.update({ isActive: false });
    console.log(`메시지 ${messageId} 비활성화 완료: 상담 ID ${consultationId}`);

    res.status(200).json({ message: `메시지 비활성화 성공` });
  } catch (err) {
    console.error("disabledMessage Error:", err);
    res.status(500).json({
      message: "메시지 비활성화 중 내부 서버 오류 발생",
      errorDetails: err.message,
    });
  }
};

/**
 * @function deleteConsultation
 * @description 특정 상담과 그 하위의 모든 메시지를 완전히 삭제합니다.
 * @param {object} req - Express 요청 객체 (req.params.id 포함)
 * @param {object} res - Express 응답 객체
 */
export const deleteConsultation = async (req, res) => {
  const consultationId = req.params.id;
  try {
    const consultationRef = db.collection("consultations").doc(consultationId);
    const consultationDoc = await consultationRef.get();

    if (!consultationDoc.exists) {
      console.warn(
        `deleteConsultation: 상담 문서 ${consultationId}를 찾을 수 없습니다.`
      );
      return res
        .status(404)
        .json({ message: "삭제하려는 상담을 찾을 수 없습니다." });
    }

    const messagesRef = consultationRef.collection("messages");
    const messagesSnap = await messagesRef.get();
    if (!messagesSnap.empty) {
      const batch = db.batch();
      messagesSnap.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      console.log(
        `[Firestore Commit] 상담 ${consultationId}의 모든 하위 메시지 삭제 완료.`
      );
    }

    await consultationRef.delete();
    console.log(`상담 문서 ${consultationId} 삭제 완료.`);

    res.status(200).json({ message: "상담 및 모든 관련 메시지 삭제 성공" });
  } catch (err) {
    console.error("deleteConsultation Error:", err);
    res.status(500).json({
      message: "상담 삭제 중 내부 서버 오류 발생",
      errorDetails: err.message,
    });
  }
};
