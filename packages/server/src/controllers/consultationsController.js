import axios from "axios";
import dotenv from "dotenv";
import { db } from "../config/firebase.js"; // db 임포트
import { Timestamp } from "firebase-admin/firestore"; // Timestamp 임포트
// Auth Admin SDK가 필요하다면 임포트: import { auth } from "../config/firebase.js";
import {
  createOrAddMessageSchema,
  aiChatBotReplySchema,
  staffReplySchema,
  activeMessageSchema,
} from "../models/consultation.js"; // 상담 스키마 임포트

dotenv.config();

// 상담 시작 또는 메시지 추가
export const createOrAddMessage = async (req, res) => {
  const authenticatedUser = req.user; // 상담을 생성/메시지 추가하는 사용자 정보 (decodedToken)
  const userId = authenticatedUser.uid; // 사용자의 UID

  // ** Joi 유효성 검사 **
  const { value, error } = createOrAddMessageSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("createOrAddMessage Validation Error:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  // Joi 검증 통과한 value에서 정보 추출
  const { question } = value;

  try {
    const now = Timestamp.now(); // 현재 시각 Firestore Timestamp
    const batch = db.batch(); // Batch 인스턴스 생성

    let consultationRef;
    let isNewConsultation = false;
    let currentConsultationId = userId; // 현재 처리할 상담 ID

    // ** 1. 상담 문서 존재 확인 또는 생성 **
    if (userId) {
      // consultationId가 요청에 포함되어 있으면 기존 상담 조회
      consultationRef = db.collection("consultations").doc(userId);
      const consultationDoc = await consultationRef.get();

      if (!consultationDoc.exists) {
        // 요청된 consultationId의 상담 문서가 존재하지 않으면 에러
        return res
          .status(404)
          .json({ message: `상담을 찾을 수 없습니다: ${userId}` });
      }

      // ** 서버 측 접근 제어: 기존 상담에 메시지 추가 권한 확인 **
      // 요청한 사용자가 해당 상담의 userId와 일치하는지 확인
      const consultationData = consultationDoc.data();
      if (consultationData.userId !== userId) {
        return res.status(403).json({
          message: "다른 사용자의 상담에 메시지를 추가할 권한이 없습니다.",
        });
      }

      isNewConsultation = false; // 기존 상담에 메시지 추가
      console.log(`기존 상담 ${userId}에 메시지 추가 시도.`);
    } else {
      // userId가 요청에 포함되어 있지 않으면 새로운 상담 생성
      consultationRef = db.collection("consultations").doc(userId);
      currentConsultationId = consultationRef.id; // 새로 생성된 상담 ID

      const consultationData = {
        userId: userId, // 상담을 생성한 사용자의 ID
        createdAt: now,
        updatedAt: now,
        status: "pending", // 초기 상태는 '대기'
        handlerId: null, // 초기 담당자는 없음
      };
      batch.set(consultationRef, consultationData); // 새 상담 문서 set 작업 추가

      isNewConsultation = true; // 새로운 상담 생성
      console.log(
        `새 상담 생성 및 첫 메시지 추가 시도: Consultation ID ${currentConsultationId}, User ID ${userId}`
      );
    }

    // ** 2. 메시지 하위 컬렉션에 새 메시지 추가 **
    const messageRef = consultationRef.collection("messages").doc(); // 새 메시지 문서 자동 생성 ID

    const newMessageData = {
      senderId: userId, // 메시지를 보낸 사용자의 ID
      senderType: "patient", // 사용자 메시지는 'patient' 타입
      message: question, // 메시지 내용
      isActive: true, // 메시지 활성화 상태 (기본값 true)
      sentAt: now, // 메시지 전송 시각 (Timestamp)
    };
    batch.set(messageRef, newMessageData); // 새 메시지 set 작업 추가

    // ** 3. 기존 상담인 경우, 상위 상담 문서 업데이트 **
    if (!isNewConsultation) {
      batch.update(consultationRef, {
        updatedAt: now, // 마지막 메시지 시각으로 업데이트
        status: "pending", // 사용자가 질문했으므로 상태를 다시 '대기'로 변경
      });
      console.log(`기존 상담 ${currentConsultationId} 상위 문서 상태 갱신.`);
    }

    // ** 4. Batch 실행 **
    await batch.commit();
    console.log(
      `상담 처리 완료: Consultation ID ${currentConsultationId}, ${
        isNewConsultation ? "새 상담 생성" : "메시지 추가"
      }.`
    );

    // ** 5. 응답 **
    if (isNewConsultation) {
      // 새 상담 생성 응답
      res.status(201).json({
        message: "새 상담이 등록되었습니다.",
      });
    } else {
      // 기존 상담에 메시지 추가 응답
      res.status(200).json({
        message: "메시지가 추가되었습니다.",
      }); // 200 OK, 생성된 메시지 ID 반환
    }
  } catch (error) {
    console.error(
      `createOrAddMessage Error for consultation ${consultationId || "new"}:`,
      error
    );
    // Batch commit 실패 시 발생하는 에러 포함
    if (error.message && error.message.includes("Batch commit failed")) {
      console.error("Firestore Batch Commit 에러 (createOrAddMessage):", error);
      res.status(500).json({
        message: "메시지 저장 중 오류 발생",
        error: "Firestore 쓰기 작업 실패",
        details: error.message,
      });
    } else {
      // Firestore 조회 실패 등 기타 예상치 못한 오류
      console.error("Unexpected createOrAddMessage Error:", error);
      res
        .status(500)
        .json({ message: "내부 서버 오류 발생", error: error.message });
    }
  }
};

// ai 답변 등록 및 상담 갱신
export const aiChatBotReply = async (req, res) => {
  const authenticatedUser = req.user; // 요청한 사용자의 정보
  const userId = authenticatedUser.uid; // 사용자의 UID

  // ** Joi 유효성 검사 **
  const { value, error } = aiChatBotReplySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("aiChatBot Validation Error:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  // Joi 검증 통과한 value에서 데이터 추출
  const { question } = value;

  try {
    // 1. 외부 AI Function 호출
    const aiFunctionUrl = process.env.FIREBASE_FUNCTION_URL;
    if (!aiFunctionUrl) {
      console.error(
        "aiChatBot Error: FIREBASE_FUNCTION_URL environment variable is not set."
      );
      return res.status(500).json({ message: "AI 서비스 URL 설정 오류." });
    }

    const functionResponse = await axios.post(
      aiFunctionUrl,
      { message: question },
      { headers: { "Content-Type": "application/json" } }
    );

    // 외부 Function 응답 상태 확인 (성공적인 응답 코드가 아니면 AI 응답 실패로 간주)
    if (functionResponse.status < 200 || functionResponse.status >= 300) {
      console.error(
        "AI Function 호출 실패:",
        functionResponse.status,
        functionResponse.data
      );
      // AI Function에서 오류 응답을 보낸 경우
      // message 필드로 응답을 통일하는 것을 고려
      return res.status(functionResponse.status).json({
        message: functionResponse.data?.message || "AI 서비스 응답 오류", // AI 응답 에러 메시지 사용 시도
        details: functionResponse.data,
      });
    }

    // AI 응답 본문에서 답변 추출 (필드 이름 통일)
    const aiAnswer =
      functionResponse.data?.answer ||
      functionResponse.data?.message ||
      "답변 없음"; // 둘 다 없으면 기본값

    // ** Batch Writes 시작 **
    const batch = db.batch(); // Batch 인스턴스 생성
    const now = Timestamp.now(); // 현재 시각 Firestore Timestamp

    const aiUid = "aiChatBot"; // 시스템에서 사용하는 ai UID (상수로 분리 고려)
    const consultationRef = db.collection("consultations").doc(userId);

    // Batch에 상담 내역 문서 update 작업 추가
    batch.update(consultationRef, {
      updatedAt: now, // 수정 시각 업데이트
      status: "responded", // 상담 상태 업데이트 (AI 응답 완료)
      handlerId: aiUid, // AI가 응답했음을 표시
    });

    // 하위 컬렉션(messages)에 ai 답변 메시지 추가를 위한 새 문서 참조 생성
    const messageRef = consultationRef.collection("messages").doc(); // Firestore 자동 생성 ID

    // Batch에 하위 컬렉션 메시지 set 작업 추가
    batch.set(messageRef, {
      id: messageRef.id, // 자동 생성된 메시지 ID
      senderId: aiUid, // AI sender ID
      senderType: "ai", // sender 타입
      message: aiAnswer, // 메시지 내용 (consistent name: message)
      isActive: true, // 메시지 활성화 상태 (기본값 true)
      sentAt: now, // 메시지 전송 시각 (Timestamp)
    });

    // ** Batch 실행 (상담 업데이트와 AI 메시지 추가를 원자적으로 처리) **
    await batch.commit();
    console.log(
      `상담 내역 ${consultationId} 갱신 및 AI 답변 메시지 저장 완료.`
    );

    // 2. 프론트엔드로 AI 답변 반환
    res.status(200).json({ message: "AI 답변 처리 성공", answer: aiAnswer }); // 상태 코드는 200으로 통일, 메시지 추가
  } catch (error) {
    console.error("aiChatBot 에러:", error);

    // axios 오류 (AI Function 호출 자체 실패 또는 응답 상태 코드 오류)
    if (error.response) {
      res.status(error.response.status).json({
        message: error.response.data?.message || "AI 서비스 응답 오류", // AI 응답의 에러 메시지 사용 시도
        details: error.response.data, // AI 응답 본문 전체 포함 (디버깅 용이)
      });
    } else if (error.message && error.message.includes("Batch commit failed")) {
      // Batch 쓰기 작업 중 Firestore 오류 발생
      console.error("Firestore Batch Commit 에러 (aiChatBot):", error);
      res.status(500).json({
        message: "AI 답변 저장 중 오류 발생",
        error: "Firestore 쓰기 작업 실패",
        details: error.message,
      });
    } else {
      // 네트워크 오류, 코드 내부 오류 등 기타 예상치 못한 오류
      console.error("Unexpected aiChatBot Error:", error);
      res.status(500).json({
        message: "내부 서버 오류 발생",
        error: "AI 서비스 통신 또는 내부 처리 실패",
        details: error.message,
      });
    }
  }
};

// 스태프 답변 등록 및 상담 갱신
export const staffReply = async (req, res) => {
  const authenticatedUser = req.user; // 답변을 등록하는 스태프/관리자 정보 (decodedToken)
  const staffId = authenticatedUser.uid; // 답변하는 스태프/관리자의 UID
  const consultationId = req.params.id; // URL 파라미터에서 상담 ID 추출
  
  // ** Joi 유효성 검사 **
  const { value, error } = staffReplySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("staffReplyConsultation Validation Error:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  // Joi 검증 통과한 value에서 데이터 추출 (staffId는 req.user에서 가져옴)
  const { answer } = value;

  try {
    const consultationDoc = await db
      .collection("consultations")
      .doc(consultationId)
      .get();
    if (!consultationDoc.exists) {
      return res
        .status(404)
        .json({ message: "답변하려는 상담을 찾을 수 없습니다." });
    }

    const now = Timestamp.now(); // 현재 시각

    // ** Batch Writes 시작 **
    const batch = db.batch();

    const consultationRef = db.collection("consultations").doc(consultationId);

    // 1. 상담 내역 문서 갱신 (상태 및 담당자 업데이트)
    batch.update(consultationRef, {
      updatedAt: now, // 수정 시각 업데이트
      status: "completed", // 스태프 답변 완료 상태 (또는 'responded' 등)
      handlerId: staffId, // 답변한 스태프/관리자의 ID
    });

    // 2. 하위 컬렉션(messages)에 답변 메시지 추가
    const messageRef = consultationRef.collection("messages").doc(); // 답변 메시지 문서 자동 생성 ID

    batch.set(messageRef, {
      id: messageRef.id, // 자동 생성된 메시지 ID
      senderId: staffId, // 답변한 스태프/관리자의 ID
      senderType: "staff", // sender 타입은 'staff'
      message: answer, // 메시지 내용 (consistent name: message)
      isActive: true, // 메시지 활성화 상태 (기본값 true)
      sentAt: now, // 메시지 전송 시각 (Timestamp)
    });

    // ** Batch 실행 (상담 업데이트와 스태프 메시지 추가를 원자적으로 처리) **
    await batch.commit();
    console.log(
      `상담 내역 ${consultationId} 갱신 및 스태프 답변 메시지 저장 완료. Staff ID: ${staffId}`
    );

    res.status(200).json({ message: "답변이 등록되었습니다." });
  } catch (error) {
    console.error("staffReplyConsultation Error:", error);
    // Batch commit 실패 시 발생하는 에러 포함
    if (error.message && error.message.includes("Batch commit failed")) {
      console.error(
        "Firestore Batch Commit 에러 (staffReplyConsultation):",
        error
      );
      res.status(500).json({
        message: "답변 저장 중 오류 발생",
        error: "Firestore 쓰기 작업 실패",
        details: error.message,
      });
    } else {
      // Firestore 조회 실패 등 기타 예상치 못한 오류
      console.error("Unexpected staffReplyConsultation Error:", error);
      res
        .status(500)
        .json({ message: "내부 서버 오류 발생", error: error.message });
    }
  }
};

export const getAllConsultations = async (req, res) => {
  try {
    const snapshot = await db.collection("consultations").get();
    const consultations = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({ consultations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessagesById = async (req, res) => {
  const consultationId = req.params.id; // URL 파라미터에서 상담 ID 추출
  try {
    const consultationDoc = await db
      .collection("consultations")
      .doc(consultationId)
      .get();

    if (consultationDoc.empty) {
      return res.status(404).json({ message: "조회된 상담 정보가 없습니다." });
    }

    const consultationData = consultationDoc.data();
    const messagesDoc = await consultationDoc.ref.collection("messages").get();

    let messageData = null;
    const messagePromises = messagesDoc.docs.map(async (messageDoc) => {
      messageData = messageDoc.data();

      // ** 3. 상위 문서 데이터와 하위 문서 데이터를 조합하여 사용자 정보 객체 구성 **
      const messageInfo = {
        userId: consultationData.userId, // 상담을 요청한 사용자 ID
        status: consultationData.status, // 상담 상태
        handlerId: consultationData.handlerId, // 상담을 처리한 스태프/관리자 ID
        createdAt: consultationData.createdAt, // 상담 생성 시각
        updatedAt: consultationData.updatedAt, // 상담 마지막 업데이트 시각
        senderId: messageData.senderId, // 메시지를 보낸 사용자 ID
        senderType: messageData.senderType, // 메시지 보낸 사람 타입 (patient, staff, ai 등)
        message: messageData.message, // 메시지 내용
        isActive: messageData.isActive, // 메시지 활성화 상태
        sentAt: messageData.sentAt, // 메시지 전송 시각
      };

      return messageInfo; // 조합된 사용자 정보 객체 반환
    });

    // ** 4. 모든 비동기 작업(하위 컬렉션 조회 및 데이터 조합) 병렬 실행 대기 **
    const allMessages = await Promise.all(messagePromises);

    res.status(200).json({ messages: allMessages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const enableMessage = async (req, res) => {
  // ** Joi 유효성 검사 **
  const { value, error } = activeMessageSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("staffReplyConsultation Validation Error:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  // Joi 검증 통과한 value에서 데이터 추출 (staffId는 req.user에서 가져옴)
  const { consultationId } = value;
  const messageId = req.params.id; // URL 파라미터에서 messageId 추출

  try {
    const messageRef = db
      .collection("consultations")
      .doc(consultationId)
      .collection("messages")
      .doc(messageId);

    await messageRef.update({ isActive: true });
    console.log(`메시지 ${messageId} 활성화 완료: 상담 ID ${consultationId}`);

    res.status(200).json({ message: `메시지 활성화 성공` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const disabledMessage = async (req, res) => {
  // ** Joi 유효성 검사 **
  const { value, error } = activeMessageSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("staffReplyConsultation Validation Error:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  // Joi 검증 통과한 value에서 데이터 추출 (staffId는 req.user에서 가져옴)
  const { consultationId } = value;
  const messageId = req.params.id; // URL 파라미터에서 messageId 추출

  try {
    const messageRef = db
      .collection("consultations")
      .doc(consultationId)
      .collection("messages")
      .doc(messageId);

    await messageRef.update({ isActive: false });
    console.log(`메시지 ${messageId} 비활성화 완료: 상담 ID ${consultationId}`);

    res.status(200).json({ message: `메시지 비활성화 성공` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteConsultation = async (req, res) => {
  const consultationId = req.params.id;
  try {
    // 하위 messages 컬렉션의 모든 문서 삭제
    const messagesRef = db
      .collection("consultations")
      .doc(consultationId)
      .collection("messages");
    const messagesSnap = await messagesRef.get();
    const batch = db.batch();
    messagesSnap.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    // 상담 문서 삭제
    await db.collection("consultations").doc(consultationId).delete();

    res.status(200).json({ message: "상담 삭제 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
