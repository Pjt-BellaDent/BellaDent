import Joi from "joi";

export const noticeSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  authorId: Joi.string().required(),
  isPublic: Joi.boolean().default(true),
});

export const updateNoticeSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  authorId: Joi.string().optional(),
  isPublic: Joi.boolean().optional(),
});
