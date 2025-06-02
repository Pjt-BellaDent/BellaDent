import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

export const reviewSchema = Joi.object({
  id: Joi.string().default(() => uuidv4()),
  review: Joi.string().required(),
  reviewImg: Joi.string().required(),
  author: Joi.string().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().default(() => new Date()),
});

export const updateReviewSchema = Joi.object({
  id: Joi.string().required(),
  review: Joi.string().required(),
  reviewImg: Joi.string().required(),
  updatedAt: Joi.date().required(),
});
