// controllers/smsLogsController.js
import { smsLogSchema } from "../models/smsLog.js";
import { db } from "../config/firebase.js";
import dotenv from "dotenv";
import { Timestamp, FieldValue } from "firebase-admin/firestore"; // FieldValue 임포트 (createdAt, updatedAt에 필요)
import { collection, doc } from "firebase/firestore"; // Firestore v9 호환성 위해 추가 (주석 처리)

dotenv.config();

export const GetSendNumber = async (req, res) => {
  try {
    const url = process.env.SMS_SERVICE_GET_NUMBER_URL;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": process.env.SMS_SERVICE_CONTENT_TYPE,
        "x-api-key": process.env.SMS_SERVICE_X_API_KEY,
      },
      body: JSON.stringify({
        "token_key": process.env.SMS_SERVICE_TOKEN_KEY,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      res.status(200).json({
        message: "발신번호 조회 성공",
        data: data,
      });
    } else {
      res.status(response.status).json({
        message: "발신번호 조회 실패",
        error: data,
      });
    }
  } catch (err) {
    console.error("발신번호 조회 에러:", err); // 에러 로깅 상세화
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const SendMessage = async (req, res) => {
  const { value, error } = smsLogSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("SMS 발신 유효성 검사 오류:", error.details); // 상세 에러 로깅 추가
    return res.status(400).json({ message: "Validation Error", details: error.details });
  }

  // **추가 검증: dest_phone과 destId 배열의 길이가 같은지 확인**
  if (value.dest_phone.length !== value.destId.length) {
    return res.status(400).json({
      message: "Validation Error: dest_phone and destId array lengths do not match.",
    });
  }

  try {
    // dest_phone과 destId를 value에서 직접 구조 분해하여 사용
    const { smsLogType, destId, dest_phone, send_phone, msg_body, msg_ad, ...restValue } = value;
    const decodedToken = req.user;
    const destPhoneJoined = dest_phone.join("|"); // 배열을 | 로 조인

    const response = await fetch(process.env.SMS_SERVICE_SEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": process.env.SMS_SERVICE_CONTENT_TYPE,
        "x-api-key": process.env.SMS_SERVICE_X_API_KEY,
      },
      body: JSON.stringify({
        ...restValue, // 스키마에서 받아온 나머지 값들
        smsLogType,
        msg_body,
        msg_ad,
        send_phone, // 스키마에서 받아온 send_phone 사용
        "token_key": process.env.SMS_SERVICE_TOKEN_KEY,
        "dest_phone": destPhoneJoined,
      }),
    });

    const overallStatus = response.ok ? "success" : "fail";
    const now = Timestamp.now(); // Firestore Timestamp 객체

    const batch = db.batch(); // Batch 인스턴스 생성

    // 1. 상위 문서 참조 가져오기 및 데이터 설정
    const parentDocRef = db.collection("smsLogs").doc(); // 자동 ID 생성
    const parentData = {
      id: parentDocRef.id,
      senderId: decodedToken.uid, // 발신자 ID (Firebase Auth UID)
      type: smsLogType, // 문자 유형
      message: msg_body, // 메시지 내용
      sendPhone: send_phone, // 발신자 번호 (Joi 검증 통과한 값)
      isAdvertisement: msg_ad, // 광고성 여부
      overallStatus: overallStatus, // 외부 API 호출 결과 (성공/실패)
      createdAt: now, // 발송 시각
    };
    batch.set(parentDocRef, parentData);

    // 2. 하위 컬렉션 'recipients'에 각 착신자별 문서 추가
    // 'collection' 함수는 'firebase-admin'에서 직접 제공되지 않을 수 있으므로,
    // db.collection('컬렉션').doc('문서').collection('하위컬렉션') 방식을 사용합니다.
    for (let i = 0; i < dest_phone.length; i++) { // ★★★ 수정된 부분: dest_phone 사용
      const recipientId = destId[i]; // 착신자 ID (클라이언트에서 보낸 ID)
      const recipientPhone = dest_phone[i]; // 해당 착신자의 전화번호

      // 하위 문서 참조: smsLogs/{parentId}/recipients/{recipientId}
      const recipientDocRef = parentDocRef.collection("recipients").doc(recipientId);

      const recipientData = {
        id: recipientId, // 문서 자체 ID (선택 사항, destId와 동일)
        recipientPhone: recipientPhone, // 착신자 전화번호
        // 여기에 추가적으로 필요한 수신자별 정보 (예: 발송 상태, 이름 등) 추가 가능
      };
      batch.set(recipientDocRef, recipientData);
    }

    await batch.commit(); // 모든 작업을 원자적으로 커밋

    // API 호출 결과에 따라 응답 상태 및 메시지 조정
    if (response.ok) {
      res.status(201).json({
        message: "SMS 발신 성공 및 이력 저장 완료",
      });
    } else {
      const errorBody = await response.text();
      console.error("SMS API 호출 실패:", response.status, errorBody);
      res.status(response.status).json({
        message: "SMS API 호출 실패 (이력 저장 완료)",
        apiError: errorBody, // API 응답 에러를 클라이언트에 전달
      });
    }
  } catch (err) {
    console.error("SMS 발신 및 이력 저장 중 심각한 오류 발생:", err);
    res.status(500).json({
      message: "Internal Server Error during SMS sending or logging",
      error: err.message,
    });
  }
};