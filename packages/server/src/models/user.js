import Joi from "joi";

// 공통 회원 정보 스키마 (users/{uid} 문서의 필드 정의)
export const commonUserFieldsSchema = Joi.object({
  name: Joi.string().required(), // 이름 필수
  phone: Joi.string().required(), // 연락처 필수
  address: Joi.string().optional().allow(null, ""), // 주소 선택 사항
  gender: Joi.string().valid("M", "F").optional().allow(null), // 성별 선택 사항 (null 허용)
  birth: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .allow(null, ""), // 생년월일 (YYYY-MM-DD) 선택 사항
});

// 환자 추가 정보 스키마 (users/{uid}/patients/{uid} 문서의 필드 정의)
export const patientInfoSchema = Joi.object({
  insuranceNumber: Joi.string().optional().allow(null, ""), // 건강보험 번호 선택 사항
  firstVisitDate: Joi.date().iso().optional().allow(null), // 최초 방문일 (ISO 8601 날짜 형식) 선택 사항
  lastVisitDate: Joi.date().iso().optional().allow(null), // 마지막 방문일 (ISO 8601 날짜 형식) 선택 사항
  allergies: Joi.string().optional().allow(null, ""), // 알레르기 정보 선택 사항
  medications: Joi.string().optional().allow(null, ""), // 복용 중인 약물 정보 선택 사항
  memo: Joi.string().optional().allow(null, ""), // 환자 관련 메모 선택 사항
});

// 직원 추가 정보 스키마 (users/{uid}/staffs/{uid} 문서의 필드 정의)
export const staffInfoSchema = Joi.object({
  position: Joi.string().optional().allow(null, ""), // 직무 선택 사항
  department: Joi.string().optional().allow(null, ""), // 부서 선택 사항
  joinDate: Joi.date().iso().optional().allow(null), // 입사일 (ISO 8601 날짜 형식) 선택 사항
  isRetired: Joi.boolean().optional().default(false), // 퇴사 여부 선택 사항 (기본값 false)
  licenseNumber: Joi.string().optional().allow(null, ""), // 면허 번호 선택 사항
  memo: Joi.string().optional().allow(null, ""), // 직원 관련 메모 선택 사항
});

// 관리자의 다른 역할 사용자 생성 요청 body 스키마
export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: commonUserFieldsSchema.extract("name").required(),
  phone: commonUserFieldsSchema.extract("phone").required(),
  address: commonUserFieldsSchema.extract("address").optional(),
  gender: commonUserFieldsSchema.extract("gender").optional(),
  birth: commonUserFieldsSchema.extract("birth").optional(),
});

// 관리자의 다른 역할 사용자 생성 요청 body 스키마
export const createPatientSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: commonUserFieldsSchema.extract("name").required(),
  phone: commonUserFieldsSchema.extract("phone").required(),
  address: commonUserFieldsSchema.extract("address").optional(),
  gender: commonUserFieldsSchema.extract("gender").optional(),
  birth: commonUserFieldsSchema.extract("birth").optional(),

  // 역할에 따른 추가 정보 필드 (조건부 필수 또는 선택)
  patientInfo: patientInfoSchema.when("role", {
    is: "patient",
    then: patientInfoSchema.required(),
    otherwise: patientInfoSchema.forbidden(),
  }),
});

// 관리자의 다른 역할 사용자 생성 요청 body 스키마
export const createStaffSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("staff", "manager", "admin").required(),
  name: commonUserFieldsSchema.extract("name").required(),
  phone: commonUserFieldsSchema.extract("phone").required(),
  address: commonUserFieldsSchema.extract("address").optional(),
  gender: commonUserFieldsSchema.extract("gender").optional(),
  birth: commonUserFieldsSchema.extract("birth").optional(),

  // 역할에 따른 추가 정보 필드 (조건부 필수 또는 선택)
  staffInfo: staffInfoSchema.when("role", {
    is: Joi.exist().valid("staff", "manager", "admin"),
    then: staffInfoSchema.required(),
    otherwise: staffInfoSchema.forbidden(),
  }),
});

// 사용자 정보 업데이트 요청 body 스키마 (사용자 본인 또는 스탭, 매니져, 관리자) (/users/:id)
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
