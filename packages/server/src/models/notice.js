import Joi from "joi";

export const noticeSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  authorId: Joi.string().required(),
  accessType: Joi.string().valid("internal", "external").default("internal"),
  isPublic: Joi.boolean().default(true),
});

export const updateNoticeSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  authorId: Joi.string().optional(),
  accessType: Joi.string().valid("internal", "external").default("internal"),
  isPublic: Joi.boolean().optional(),
});
