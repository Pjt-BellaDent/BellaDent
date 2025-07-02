// src/models/user.js
import Joi from "joi";

export const commonUserFieldsSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().optional().allow(null, ""),
  gender: Joi.string().valid("M", "F").optional().allow(null),
  birth: Joi.string().optional().allow(null, ""),
});

export const patientInfoSchema = Joi.object({
  insuranceNumber: Joi.string().optional().allow(null, ""),
  firstVisitDate: Joi.date().iso().optional().allow(null),
  lastVisitDate: Joi.date().iso().optional().allow(null),
  allergies: Joi.string().optional().allow(null, ""),
  medications: Joi.string().optional().allow(null, ""),
  memo: Joi.string().optional().allow(null, ""),
});

export const staffInfoSchema = Joi.object({
  position: Joi.string().optional().allow(null, ""),
  department: Joi.string().optional().allow(null, ""),
  joinDate: Joi.date().iso().optional().allow(null),
  isRetired: Joi.boolean().optional().default(false),
  licenseNumber: Joi.string().optional().allow(null, ""),
  memo: Joi.string().optional().allow(null, ""),
});

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: commonUserFieldsSchema.extract("name").required(),
  phone: commonUserFieldsSchema.extract("phone").required(),
  address: commonUserFieldsSchema.extract("address").optional(),
  gender: commonUserFieldsSchema.extract("gender").optional(),
  birth: commonUserFieldsSchema.extract("birth").optional(),
});

export const createPatientSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("patient").default("patient"),
  name: commonUserFieldsSchema.extract("name").required(),
  phone: commonUserFieldsSchema.extract("phone").required(),
  address: commonUserFieldsSchema.extract("address").optional(),
  gender: commonUserFieldsSchema.extract("gender").optional(),
  birth: commonUserFieldsSchema.extract("birth").optional(),
  role: Joi.string().valid("patient").required(),
  patientInfo: patientInfoSchema.when("role", {
    is: "patient",
    then: patientInfoSchema.required(),
    otherwise: patientInfoSchema.forbidden(),
  }),
});

export const createStaffSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("staff", "manager", "admin").required(),
  name: commonUserFieldsSchema.extract("name").required(),
  phone: commonUserFieldsSchema.extract("phone").required(),
  address: commonUserFieldsSchema.extract("address").optional(),
  gender: commonUserFieldsSchema.extract("gender").optional(),
  birth: commonUserFieldsSchema.extract("birth").optional(),

  staffInfo: staffInfoSchema.when("role", {
    is: Joi.exist().valid("staff", "manager", "admin"),
    then: staffInfoSchema.required(),
    otherwise: staffInfoSchema.forbidden(),
  }),
});

export const updateUserSchema = Joi.object({
  role: Joi.string().valid("patient", "admin", "staff", "manager").optional(),
  name: commonUserFieldsSchema.extract("name").optional(),
  phone: commonUserFieldsSchema.extract("phone").optional(),
  address: commonUserFieldsSchema.extract("address").optional(),
  gender: commonUserFieldsSchema.extract("gender").optional(),
  birth: commonUserFieldsSchema.extract("birth").optional(),
  patientInfo: patientInfoSchema.optional(),
  staffInfo: staffInfoSchema.optional(),
});
