import { smsLogSchema } from "../models/smsLog.js";
import { db } from "../config/firebase.js";
import dotenv from "dotenv";
import { Timestamp } from "firebase-admin/firestore";

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
        // "token_key": 문서 서식 작업시 "" 삭제 됨 필히 확인 요함
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
    console.error(err);
  }
};

export const SendMessage = async (req, res) => {
  const { value, error } = smsLogSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: "Validation Error" });
  }

  // **추가 검증: dest_phone과 destId 배열의 길이가 같은지 확인**
  if (value.dest_phone.length !== value.destId.length) {
    return res.status(400).json({
      message: "Validation Error",
    });
  }

  try {
    const { smsLogType, destId, ...restValue } = value;
    const decodedToken = req.user;
    const destPhone = value.dest_phone.join("|");
    const response = await fetch(process.env.SMS_SERVICE_SEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": process.env.SMS_SERVICE_CONTENT_TYPE,
        "x-api-key": process.env.SMS_SERVICE_X_API_KEY,
      },
      body: JSON.stringify({
        ...restValue,
        "token_key": process.env.SMS_SERVICE_TOKEN_KEY,
        "dest_phone": destPhone,
        // "token_key": 문서 서식 작업시 "" 삭제 됨 필히 확인 요함
      }),
    });

    // API 응답 상태에 따른 전체 상태 결정
    const overallStatus = response.ok ? "success" : "fail";
    const now = Timestamp.now();

    const batch = db.batch(); // Batch 인스턴스 생성

    // **1. 상위 문서 참조 가져오기
    const parentDocRef = db.collection("smsLogs").doc();

    // **2. Batch에 상위 문서 생성 (set) 작업 추가**
    const parentData = {
      // id 필드는 굳이 저장하지 않아도 되지만, 쿼리 편의를 위해 저장하는 경우가 많습니다.
      id: parentDocRef.id, // 문서 ID (자동 생성된 ID)
      senderId: decodedToken.uid, // 발신자 ID (Firebase Auth UID)
      type: value.smsLogType, // 문자 유형
      message: value.msg_body, // 메시지 내용
      sendPhone: value.send_phone, // 발신자 번호
      isAdvertisement: value.msg_ad, // 광고성 여부
      overallStatus: overallStatus, // 외부 API 호출 결과 (성공/실패)
      createdAt: now, // 발송 시각
    };
    batch.set(parentDocRef, parentData);

    // **3. 하위 컬렉션 참조 가져오기 ('recipients')**
    const recipientsCollectionRef = collection(parentDocRef, "recipients");

    // **4. Batch에 각 착신자별 하위 문서 추가 (set)**
    // destPhonesArray와 destId 배열의 길이가 같으므로 인덱스로 접근
    for (let i = 0; i < destPhonesArray.length; i++) {
      const recipientId = destId[i]; // 착신자 ID를 하위 문서 ID로 사용
      const recipientPhone = destPhonesArray[i]; // 해당 착신자의 전화번호

      // 하위 문서 참조 (착신자 ID를 문서 ID로 사용)
      const recipientDocRef = doc(recipientsCollectionRef, recipientId);

      // 하위 문서 데이터 (필요한 정보 추가 가능)
      const recipientData = {
        id: recipientId, // 문서 자체 ID (선택 사항)
        recipientPhone: recipientPhone, // 착신자 전화번호
      };

      // Batch에 하위 문서 set 작업 추가
      batch.set(recipientDocRef, recipientData);
    }

    // **5. Batch 실행 (모든 작업을 원자적으로 커밋)**
    await batch.commit();

    // API 호출 결과에 따라 응답 상태 및 메시지 조정
    if (response.ok) {
      res.status(201).json({
        message: "SMS 발신 성공 및 이력 저장 완료",
      });
    } else {
      // API 호출은 실패했지만 이력 저장은 시도했음
      const errorBody = await response.text(); // 또는 response.json()
      console.error("SMS API 호출 실패:", response.status, errorBody);
      res.status(response.status).json({
        message: "SMS API 호출 실패 (이력 저장 완료)",
      });
    }
  } catch (err) {
    console.error("SMS 발신 및 이력 저장 중 심각한 오류 발생:", err);
    // Batch commit 중 오류 발생 시 err 객체에 상세 정보가 포함될 수 있습니다.
    res.status(500).json({
      message: "Internal Server Error during SMS sending or logging",
      error: err.message,
    });
  }
};
