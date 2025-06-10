import Joi from "joi";

export const reviewSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  authorId: Joi.string().required(),
  isPublic: Joi.boolean().default(true),
  visibilityReason: Joi.string().allow(null).optional(),
  approved: Joi.boolean().default(true),
});

export const updateReviewSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  authorId: Joi.string().optional(),
  isPublic: Joi.boolean().optional(),
  visibilityReason: Joi.string().allow(null).optional(),
  approved: Joi.boolean().optional(),
  deleteImageUrls: Joi.array().items(Joi.string()).optional().default([]),
});
