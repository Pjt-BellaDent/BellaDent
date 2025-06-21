import Joi from "joi";

// createConsultation 함수 요청 body 스키마
export const createOrAddMessageSchema = Joi.object({
  question: Joi.string().min(1).required(),
});

// aiChatBot 함수 요청 body 스키마
export const aiChatBotReplySchema = Joi.object({
  question: Joi.string().min(1).required(),
});

// staffReplyConsultation 함수 요청 body 스키마
export const staffReplySchema = Joi.object({
  answer: Joi.string().min(1).required(),
});

export const activeMessageSchema = Joi.object({
  consultationId: Joi.string().required(),
});

export const handleConsultationSchema = Joi.object({
  handlerId: Joi.string().allow(null).required(),
  hasUnread: Joi.boolean().allow(null).optional(),
});
