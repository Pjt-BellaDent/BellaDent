import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

export const messageSchema = Joi.object({
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
    .required(),
  send_phone: Joi.string()
    .pattern(/^01[016789]-\d{3,4}-\d{4}$/)
    .required(),
  subject: Joi.string().optional(),
  send_time: Joi.string().optional(),
  msg_ad: Joi.string().valid("N", "Y").default("N"),
  unsub_phone: Joi.string().optional(),
  attached_file: Joi.string().optional(),
});
