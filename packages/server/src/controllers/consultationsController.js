import axios from "axios";
import dotenv from "dotenv";
import { db } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";
import {
  createOrAddMessageSchema,
  aiChatBotReplySchema,
  staffReplySchema,
  activeMessageSchema,
} from "../models/consultation.js";

dotenv.config();

// 상담 시작 또는 메시지 추가
export const createOrAddMessage = async (req, res) => {
  const authenticatedUser = req.user;
  const consultationId = authenticatedUser.uid;
  const userId = authenticatedUser.uid;

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

  const { question } = value;

  try {
    const now = Timestamp.now();
    const batch = db.batch();

    const consultationRef = db.collection("consultations").doc(consultationId);
    const consultationDoc = await consultationRef.get();

    let isNewConsultation = false;

    // ** 1. 상담 문서 존재 확인 및 처리 (새로 생성 vs 기존 업데이트) **
    if (!consultationDoc.exists) {
      isNewConsultation = true;

      // 새로운 상담 문서에 저장할 초기 데이터 정의
      const newConsultationData = {
        userId: userId, // 상담을 생성한 사용자 ID (문서 ID와 동일)
        createdAt: now, // 상담 생성 시각
        updatedAt: now, // 첫 메시지 전송 시각
        status: "pending", // 초기 상태는 '대기'
        handlerId: null, // 초기 담당자는 없음
      };

      batch.set(consultationRef, newConsultationData);
      console.log(
        `새 상담 생성 준비: Consultation ID ${consultationId}, User ID ${userId}`
      );
    } else {
      // 해당 사용자의 상담 문서가 이미 존재하는 경우 -> 기존 상담에 메시지 추가
      isNewConsultation = false;

      // 기존 상담 문서에 업데이트할 데이터 정의
      const updateConsultationData = {
        updatedAt: now, // 마지막 메시지 시각으로 업데이트
        status: "pending",
      };
      batch.update(consultationRef, updateConsultationData);
      console.log(`기존 상담 ${consultationId} 상위 문서 상태 갱신 준비.`);
    }

    // ** 2. 메시지 하위 컬렉션(messages)에 새 사용자 메시지 추가 **
    const messageRef = consultationRef.collection("messages").doc();

    // 새 메시지 문서에 저장할 데이터 정의
    const newMessageData = {
      senderId: userId, // 메시지를 보낸 사용자의 ID
      senderType: "patient", // 사용자 메시지는 'patient' 타입
      message: question, // 메시지 내용 (요청 body에서 받은 'question' 사용)
      isActive: true, // 메시지 활성화 상태 (기본값 true)
      sentAt: now, // 메시지 전송 시각 (Timestamp)
    };
    // Batch에 새 메시지 set 작업 추가
    batch.set(messageRef, newMessageData);
    console.log(`새 사용자 메시지 저장 준비: Message ID ${messageRef.id}`);

    // ** 3. Batch 실행 (상위 문서 처리와 하위 메시지 추가를 원자적으로 처리) **
    await batch.commit();
    console.log(
      `상담 처리 완료: Consultation ID ${consultationId}, ${
        isNewConsultation
          ? "새 상담 생성 및 첫 메시지 추가"
          : "기존 상담에 메시지 추가"
      }.`
    );

    // ** 4. 성공 응답 **
    if (isNewConsultation) {
      // 새 상담 생성 성공 응답
      res.status(201).json({
        message: "새 상담이 등록되었습니다.",
      });
    } else {
      // 기존 상담에 메시지 추가 성공 응답
      res.status(200).json({
        message: "메시지가 추가되었습니다.",
      });
    }
  } catch (error) {
    console.error(
      `createOrAddMessage Error for consultation ${consultationId || "new"}:`,
      error
    );

    // Firestore Batch commit 실패 시 발생하는 에러 포함
    if (error.message && error.message.includes("Batch commit failed")) {
      console.error("Firestore Batch Commit 에러 (createOrAddMessage):", error);
      res.status(500).json({
        message: "메시지 저장 중 오류 발생 (데이터베이스 쓰기 실패)",
        errorDetails: error.message, // 에러 상세 정보를 포함
      });
    } else if (error.code && error.code === "permission-denied") {
      // Firestore 보안 규칙 등으로 인한 권한 오류
      console.error("Firestore Permission Denied Error:", error);
      res.status(403).json({
        message: "데이터베이스 쓰기 권한이 없습니다.",
        errorDetails: error.message,
      });
    } else {
      // Firestore 조회 실패 등 기타 예상치 못한 오류
      console.error("Unexpected createOrAddMessage Error:", error);
      res.status(500).json({
        message: "메시지 처리 중 내부 서버 오류 발생",
        errorDetails: error.message,
      });
    }
  }
};

// ai 답변 등록 및 상담 갱신
export const aiChatBotReply = async (req, res) => {
  const authenticatedUser = req.user; // 요청한 사용자의 정보
  const consultationId = authenticatedUser.uid; // 사용자의 UID

  // ** Joi 유효성 검사 **
  const { value, error } = aiChatBotReplySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("aiChatBot Validation Error:", error.details);
    return res.status(400).json({ message: "Validation Error" });
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
      { question },
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
    const consultationRef = db.collection("consultations").doc(consultationId);

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
      });
    } else if (error.message && error.message.includes("Batch commit failed")) {
      // Batch 쓰기 작업 중 Firestore 오류 발생
      console.error("Firestore Batch Commit 에러 (aiChatBot):", error);
      res.status(500).json({
        message: "AI 답변 저장 중 오류 발생",
      });
    } else {
      // 네트워크 오류, 코드 내부 오류 등 기타 예상치 못한 오류
      console.error("Unexpected aiChatBot Error:", error);
      res.status(500).json({
        message: "내부 서버 오류 발생",
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
    return res.status(400).json({ message: "Validation Error" });
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
      });
    } else {
      // Firestore 조회 실패 등 기타 예상치 못한 오류
      console.error("Unexpected staffReplyConsultation Error:", error);
      res.status(500).json({ message: "내부 서버 오류 발생" });
    }
  }
};

// 전체 상담 조회
export const getAllConsultations = async (req, res) => {
  try {
    const consultationsSnapshot = await db
      .collection("consultations")
      .orderBy("updatedAt", "desc")
      .get();
    if (consultationsSnapshot.empty) {
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

          if (data.handlerId) {
            const handlerDoc = await db
              .collection("users")
              .doc(data.handlerId)
              .get();
            if (handlerDoc.exists) {
              handlerName = handlerDoc.data().name || "(알 수 없음)";
            }
          }
        } catch (userErr) {
          console.error(
            `Error fetching user/handler name for ${userId}/${data.handlerId}:`,
            userErr
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
        };
      })
    );

    res.status(200).json({
      consultations: consultationsData,
      message: "전체 상담 조회 성공",
    });
  } catch (err) {
    console.error("Error in getAllConsultations:", err);
    res.status(500).json({ error: err.message });
  }
};

// 상담 ID로 메시지 조회
export const getMessagesById = async (req, res) => {
  const consultationId = req.params.id; // URL 파라미터에서 상담 ID 추출
  const authenticatedUser = req.user; // authenticateFirebaseToken 미들웨어를 통해 전달된 사용자 정보
  const requestingUserId = authenticatedUser.uid; // 요청을 보낸 사용자의 UID

  try {
    const consultationRef = db.collection("consultations").doc(consultationId);
    const consultationDoc = await consultationRef.get();

    // ** 1. 상담 문서 존재 여부 확인 **
    if (!consultationDoc.exists) {
      console.warn(`Consultation not found for ID: ${consultationId}`);
      return res
        .status(404)
        .json({ message: "조회된 상담 정보를 찾을 수 없습니다." });
    }

    const consultationData = consultationDoc.data();

    // ** 3. 메시지 하위 컬렉션 조회 **
    const messagesRef = consultationRef.collection("messages");
    // 'sentAt' 필드를 기준으로 오름차순 정렬하여 메시지 문서들 조회
    const messagesSnap = await messagesRef.orderBy("sentAt", "asc").get();

    if (messagesSnap.empty) {
      // 메시지 하위 컬렉션에 문서가 없는 경우
      console.log(`No messages found for consultation ID: ${consultationId}`);
      // 메시지 배열만 반환하도록 요청하셨으므로, 빈 배열을 담아 200 응답
      return res.status(200).json({ messages: [] });
    }

    // 조회된 메시지 문서들을 순회하며 데이터 추출 및 가공
    const messagesData = messagesSnap.docs.map((doc) => {
      const messageData = doc.data();
      // 프론트엔드에서 사용할 형식으로 데이터를 가공
      // sentAt Timestamp 객체를 JavaScript Date 객체로 변환 (선택 사항)
      return {
        id: doc.id, // 메시지 문서의 자동 생성 ID 포함
        senderType: messageData.senderType,
        message: messageData.message, // 메시지 내용
        sentAt: messageData.sentAt, // Timestamp
        senderId: messageData.senderId, // 누가 보냈는지 ID
        senderType: messageData.senderType, // 보낸 사람 타입 (user, staff, ai)
        isActive: messageData.isActive, // 활성화 상태
      };
    });

    // ** 4. 성공 응답 (요청하신 형태로 변경!) **
    res.status(200).json({
      messages: messagesData,
    });
  } catch (err) {
    console.error(`getMessagesById Error for ID ${consultationId}:`, err);
    // Firestore 조회 등 예상치 못한 오류 발생 시 500 응답
    res.status(500).json({
      message: "상담 메시지 조회 중 내부 서버 오류 발생", // 오류 메시지는 'message' 키로 유지
      errorDetails: err.message, // 추가 디버깅 정보
    });
  }
};

// 상담 담당자 지정/해제
export const setConsultationHandler = async (req, res) => {
  const authenticatedUser = req.user;
  const staffId = authenticatedUser.uid; // 요청을 보낸 스태프의 UID

  // Joi 유효성 검사
  const { value, error } = handleConsultationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("setConsultationHandler Validation Error:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  const { consultationId, handlerId } = value; // handlerId는 null 또는 직원 UID가 됨

  // handlerId가 null이 아닐 경우, 요청을 보낸 스태프와 일치하는지 확인 (보안 강화)
  if (handlerId !== null && staffId !== handlerId) {
    return res
      .status(403)
      .json({ message: "요청한 스태프 ID와 일치하지 않습니다." });
  }

  try {
    const consultationRef = db.collection("consultations").doc(consultationId);
    const consultationDoc = await consultationRef.get();

    if (!consultationDoc.exists) {
      return res.status(404).json({ message: "해당 상담을 찾을 수 없습니다." });
    }

    const updateData = {
      handlerId: handlerId, // null 또는 직원 UID
      updatedAt: Timestamp.now(), // 업데이트 시각
    };

    await consultationRef.update(updateData);

    const action = handlerId === null ? "해제" : "지정";
    console.log(
      `상담 ${consultationId}의 담당자가 ${
        handlerId || "없음"
      }으로 ${action}되었습니다.`
    );
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

// 상담 메시지 활성화
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

    const messageDoc = await messageRef.get();
    if (!messageDoc.exists) {
      return res.status(404).json({ message: "메시지를 찾을 수 없습니다." });
    }

    await messageRef.update({ isActive: true });
    console.log(`메시지 ${messageId} 활성화 완료: 상담 ID ${consultationId}`);

    res.status(200).json({ message: `메시지 활성화 성공` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 상담 메시지 비활성화
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

    const messageDoc = await messageRef.get();
    if (!messageDoc.exists) {
      return res.status(404).json({ message: "메시지를 찾을 수 없습니다." });
    }
    // 메시지 활성화 상태를 false로 업데이트

    await messageRef.update({ isActive: false });
    console.log(`메시지 ${messageId} 비활성화 완료: 상담 ID ${consultationId}`);

    res.status(200).json({ message: `메시지 비활성화 성공` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 상담 삭제
export const deleteConsultation = async (req, res) => {
  const consultationId = req.params.id;
  try {
    const consultationRef = db.collection("consultations").doc(consultationId);
    const consultationDoc = await consultationRef.get();

    if (!consultationDoc.exists) {
      return res.status(404).json({ message: "상담을 찾을 수 없습니다." });
    }

    // 하위 messages 컬렉션의 모든 문서 삭제
    const messagesRef = db
      .collection("consultations")
      .doc(consultationId)
      .collection("messages");
    const messagesSnap = await messagesRef.get();
    if (!messagesSnap.empty) {
      const batch = db.batch();
      messagesSnap.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    // 상담 문서 삭제
    await consultationRef.delete();

    res.status(200).json({ message: "상담 삭제 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
