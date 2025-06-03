import { messageSchema } from "../models/message.js";
import { db } from "../config/firebase.js";
import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

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
  const { value, error } = messageSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  try {
    let destPhone = "";
    value.dest_phone.map((phone) => {
      if (destPhone === "") {
        destPhone = phone;
      } else {
        destPhone += `|${phone}`;
      }
    });
    const response = await axios.post(
      process.env.SMS_SERVICE_SEND_URL,
      {
        ...value,
        token_key: process.env.SMS_SERVICE_TOKEN_KEY,
        dest_phone: destPhone,
      },
      {
        headers: {
          "x-api-key": process.env.SMS_SERVICE_X_API_KEY,
          "Content-Type": process.env.SMS_SERVICE_CONTENT - TYPE,
        },
      }
    );
    res.status(200).json({
      message: "SMS 발신 성공",
    });

    let messageData = {
      id: uuidv4(),
      createdAt: new Date(),
    };
    if (res.statusCode === 200) {
      messageData = { messageStatus: "success", ...value, ...messageData };
    } else {
      messageData = { messageStatus: "fail", ...value, ...messageData };
    }

    const docRef = db.collection("messages").doc(messageData.id);
    await docRef.set(messageData);
    res.status(201).json({ message: "SMS 발신 이력 저장 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
