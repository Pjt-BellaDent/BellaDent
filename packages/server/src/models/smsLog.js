// src/models/smsLog.js
import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

export const smsLogSchema = Joi.object({
  senderId: Joi.string().required(),
  smsLogType: Joi.string().valid("예약알림", "진료알림", "광고").required(),
  destId: Joi.array().items(Joi.string().required()).min(1).required(),
  msg_type: Joi.valid("sms", "mms").default("sms"),
  dest_phone: Joi.array()
    .items(
      Joi.string().valid(
        process.env.TEAM_NUMBER_1,
        process.env.TEAM_NUMBER_2,
        process.env.TEAM_NUMBER_3,
        process.env.TEAM_NUMBER_4
      )
    )
    .min(1)
    .required(),
  send_phone: Joi.string()
    .pattern(/^01[016789]-\d{3,4}-\d{4}$/)
    .required(),
  msg_body: Joi.string().max(2000).required(),
  subject: Joi.string().optional(),
  send_time: Joi.string().optional(),
  msg_ad: Joi.string().valid("N", "Y").default("N"),
  unsub_phone: Joi.string().optional(),
  attached_file: Joi.string().optional(),
});
