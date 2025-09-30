// src/models/consultation.js
import Joi from "joi";

export const createOrAddMessageSchema = Joi.object({
  question: Joi.string().min(1).required(),
});

export const aiChatBotReplySchema = Joi.object({
  question: Joi.string().min(1).required(),
});

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
