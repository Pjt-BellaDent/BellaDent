import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

export const userSchema = Joi.object({
  id: Joi.string().default(() => uuidv4()),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^01[016789]-\d{3,4}-\d{4}$/)
    .required(),
  address: Joi.string().required(),
  birthDate: Joi.string().length(8).required(),
  gender: Joi.string().valid("남성", "여성").required(),
  role: Joi.string().valid("patient", "staff", "admin").default("patient"),
  createdAt: Joi.date().default(() => new Date()),
});
