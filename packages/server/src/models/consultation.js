import Joi from "joi";

// createOrAddMessage 함수 요청 body 스키마 (고객 질문)
export const createOrAddMessageSchema = Joi.object({
  question: Joi.string().min(1).required(),
});

// aiChatBotReply 함수 요청 body 스키마 (AI 질문)
export const aiChatBotReplySchema = Joi.object({
  question: Joi.string().min(1).required(),
});

// staffReply 함수 요청 body 스키마 (스태프 답변)
export const staffReplySchema = Joi.object({
  answer: Joi.string().min(1).required(),
});

// 메시지 활성화/비활성화 함수 요청 body 스키마
export const activeMessageSchema = Joi.object({
  consultationId: Joi.string().required(),
});

// setConsultationHandler 함수 요청 body 스키마
export const handleConsultationSchema = Joi.object({
  // 담당자 ID: 문자열이거나 null일 수 있으며, 필수
  handlerId: Joi.string().allow(null).required(),
  // 읽지 않은 메시지 여부: 불리언이거나 null일 수 있으며, 선택 사항
  hasUnread: Joi.boolean().allow(null).optional(),
});