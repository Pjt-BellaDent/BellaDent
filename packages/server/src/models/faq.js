// src/models/faq.js
import Joi from "joi";

export const faqSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().allow('').optional(),
  authorId: Joi.string().required(),
  isPublic: Joi.boolean().default(true),
  startTime: Joi.date().iso().optional().allow(null),
  endTime: Joi.date().iso().optional().allow(null)
});

export const updateFaqSchema = Joi.object({
  id: Joi.string().required(),
  question: Joi.string().optional(),
  answer: Joi.string().optional(),
  authorId: Joi.string().optional(),
  isPublic: Joi.boolean().optional(),
  startTime: Joi.date().iso().optional().allow(null),
  endTime: Joi.date().iso().optional().allow(null)
});
