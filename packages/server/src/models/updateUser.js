import Joi from "joi";

export const updateUserSchema = Joi.object({
  id: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^01[016789]-\d{3,4}-\d{4}$/)
    .required(),
  address: Joi.string().required(),
  updatedAt: Joi.date().required(),
});
