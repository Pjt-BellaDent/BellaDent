// src/controllers/smsLogsController.js
import { smsLogSchema } from "../models/smsLog.js";
import { db } from "../config/firebase.js";
import dotenv from "dotenv";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

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
        token_key: process.env.SMS_SERVICE_TOKEN_KEY,
      }),
    });
    const data = await response.json();

    if (
      response.ok &&
      data.content &&
      data.content.sendphones &&
      data.content.sendphones.length > 0
    ) {
      const sendingNumber = data.content.sendphones[0].number;

      if (sendingNumber) {
        res.status(200).json({
          message: "발신번호 조회 성공",
          content: { number: sendingNumber },
        });
      } else {
        console.error(
          "외부 SMS API 응답에 발신번호 필드(number)가 없거나 비어 있습니다. 원본 데이터:",
          JSON.stringify(data, null, 2)
        );
        res.status(500).json({
          message: "발신번호를 불러오지 못했습니다: 외부 API 응답 구조 불일치",
          error: data,
        });
      }
    } else {
      console.error(
        "외부 SMS API 호출 실패 또는 응답 데이터가 예상과 다릅니다:",
        response.status,
        JSON.stringify(data, null, 2)
      );
      res.status(response.status).json({
        message: "발신번호 조회 실패: 외부 API 에러",
        error: data,
      });
    }
  } catch (err) {
    console.error("발신번호 조회 중 서버 내부 오류 발생:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const SendMessage = async (req, res) => {
  const { value, error } = smsLogSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("SMS 발신 유효성 검사 오류:", error.details);
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  if (value.dest_phone.length !== value.destId.length) {
    return res.status(400).json({
      message:
        "Validation Error: dest_phone and destId array lengths do not match.",
    });
  }

  try {
    const {
      smsLogType,
      destId,
      dest_phone,
      send_phone,
      msg_body,
      msg_ad,
      ...restValue
    } = value;
    const decodedToken = req.user;
    const destPhoneJoined = dest_phone.join("|");

    const response = await fetch(process.env.SMS_SERVICE_SEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": process.env.SMS_SERVICE_CONTENT_TYPE,
        "x-api-key": process.env.SMS_SERVICE_X_API_KEY,
      },
      body: JSON.stringify({
        ...restValue,
        smsLogType,
        msg_body,
        msg_ad,
        send_phone,
        token_key: process.env.SMS_SERVICE_TOKEN_KEY,
        dest_phone: destPhoneJoined,
      }),
    });

    const overallStatus = response.ok ? "success" : "fail";
    const now = Timestamp.now();

    const batch = db.batch();

    const parentDocRef = db.collection("smsLogs").doc();
    const parentData = {
      id: parentDocRef.id,
      senderId: decodedToken.uid,
      type: smsLogType,
      message: msg_body,
      sendPhone: send_phone,
      isAdvertisement: msg_ad,
      overallStatus: overallStatus,
      createdAt: now,
    };
    batch.set(parentDocRef, parentData);

    for (let i = 0; i < dest_phone.length; i++) {
      const recipientId = destId[i];
      const recipientPhone = dest_phone[i];

      const recipientDocRef = parentDocRef
        .collection("recipients")
        .doc(recipientId);

      const recipientData = {
        id: recipientId,
        recipientPhone: recipientPhone,
      };
      batch.set(recipientDocRef, recipientData);
    }

    await batch.commit();

    if (response.ok) {
      res.status(201).json({
        message: "SMS 발신 성공 및 이력 저장 완료",
      });
    } else {
      const errorBody = await response.text();
      console.error("SMS API 호출 실패:", response.status, errorBody);
      res.status(response.status).json({
        message: "SMS API 호출 실패 (이력 저장 완료)",
        apiError: errorBody,
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
