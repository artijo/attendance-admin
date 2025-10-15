import * as yup from "yup";

/**
 * Helper function to validate data with Yup schema
 * @param {yup.ObjectSchema} schema - Yup validation schema
 * @param {Object} data - Data to validate
 * @returns {Object} - { success: boolean, value?: Object, errors?: Object }
 */
function validateWithSchema(schema, data) {
  try {
    const result = schema.validateSync(data, { abortEarly: false });
    return { success: true, value: result };
  } catch (error) {
    const formattedErrors = {};
    if (error.inner && Array.isArray(error.inner)) {
      error.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
    }
    return { success: false, errors: formattedErrors };
  }
}

export function validateLogin(username, password) {
  const schema = yup.object({
    username: yup.string().required("กรุณากรอกชื่อผู้ใช้"),
    password: yup
      .string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .required("กรุณากรอกรหัสผ่าน"),
  });

  return validateWithSchema(schema, { username, password });
}

export function validatePasswordChange(
  oldPassword,
  newPassword,
  confirmPassword
) {
  const schema = yup.object({
    oldPassword: yup
      .string()
      .required("กรุณากรอกรหัสผ่านเดิม")
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    newPassword: yup
      .string()
      .required("กรุณากรอกรหัสผ่านใหม่")
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: yup
      .string()
      .required("กรุณายืนยันรหัสผ่านใหม่")
      .oneOf([yup.ref("newPassword")], "รหัสผ่านไม่ตรงกัน"),
  });

  return validateWithSchema(schema, {
    oldPassword,
    newPassword,
    confirmPassword,
  });
}

export function validateStudent(data) {
  const schema = yup.object({
    stdId: yup
      .string()
      .required("กรุณากรอกรหัสนักเรียน")
      .trim()
      .matches(/^[0-9]{5}$/, "รหัสนักเรียนต้องเป็นตัวเลข 5 หลักเท่านั้น"),
    title: yup
      .string()
      .required("กรุณาเลือกคำนำหน้า")
      .oneOf(["BOY", "GIRL", "MR", "MS"], "คำนำหน้าไม่ถูกต้อง"),
    fName: yup
      .string()
      .required("กรุณากรอกชื่อ")
      .trim()
      .test("not-empty", "กรุณากรอกชื่อ", (value) => value && value.length > 0)
      .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
      .matches(/^[ก-๙a-zA-Z\s]+$/, "ชื่อต้องเป็นตัวอักษรไทยหรืออังกฤษเท่านั้น"),
    lName: yup
      .string()
      .required("กรุณากรอกนามสกุล")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกนามสกุล",
        (value) => value && value.length > 0
      )
      .min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร")
      .matches(
        /^[ก-๙a-zA-Z\s]+$/,
        "นามสกุลต้องเป็นตัวอักษรไทยหรืออังกฤษเท่านั้น"
      ),
    email: yup
      .string()
      .nullable()
      .transform((value, originalValue) => {
        const trimmed = originalValue ? originalValue.trim() : "";
        return trimmed === "" ? null : trimmed;
      })
      .email("รูปแบบอีเมลไม่ถูกต้อง")
      .matches(
        /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "รูปแบบอีเมลไม่ถูกต้อง"
      ),
    tel: yup
      .string()
      .nullable()
      .transform((value, originalValue) => {
        const trimmed = originalValue ? originalValue.trim() : "";
        return trimmed === "" ? null : trimmed;
      })
      .matches(/^[0-9]{10}$|^$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก"),
  });

  return validateWithSchema(schema, data);
}

export function validateTeacher(data, isEdit = false) {
  const schema = yup.object({
    fName: yup
      .string()
      .required("กรุณากรอกชื่อ")
      .trim()
      .test("not-empty", "กรุณากรอกชื่อ", (value) => value && value.length > 0)
      .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
      .matches(/^[ก-๙a-zA-Z\s]+$/, "ชื่อต้องเป็นตัวอักษรไทยหรืออังกฤษเท่านั้น"),
    lName: yup
      .string()
      .required("กรุณากรอกนามสกุล")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกนามสกุล",
        (value) => value && value.length > 0
      )
      .min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร")
      .matches(
        /^[ก-๙a-zA-Z\s]+$/,
        "นามสกุลต้องเป็นตัวอักษรไทยหรืออังกฤษเท่านั้น"
      ),
    email: yup
      .string()
      .required("กรุณากรอกอีเมล")
      .trim()
      .email("รูปแบบอีเมลไม่ถูกต้อง")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "รูปแบบอีเมลไม่ถูกต้อง"
      ),
    tel: yup
      .string()
      .nullable()
      .transform((value, originalValue) => {
        const trimmed = originalValue ? originalValue.trim() : "";
        return trimmed === "" ? null : trimmed;
      })
      .matches(/^[0-9]{10}$|^$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก"),
    deptId: yup.string().required("กรุณาเลือกกลุ่มสาระ"),
    password: isEdit
      ? yup
          .string()
          .nullable()
          .transform((value, originalValue) => {
            const trimmed = originalValue ? originalValue.trim() : "";
            return trimmed === "" ? null : trimmed;
          })
          .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      : yup
          .string()
          .nullable()
          .transform((value, originalValue) => {
            const trimmed = originalValue ? originalValue.trim() : "";
            return trimmed === "" ? null : trimmed;
          }),
    confirmPassword: yup
      .string()
      .nullable()
      .transform((value, originalValue) => {
        const trimmed = originalValue ? originalValue.trim() : "";
        return trimmed === "" ? null : trimmed;
      })
      .test("passwords-match", "รหัสผ่านไม่ตรงกัน", function (value) {
        const { password } = this.parent;
        // If password is provided, confirmPassword must match
        if (password && password.length > 0) {
          return value === password;
        }
        return true;
      }),
  });

  return validateWithSchema(schema, data);
}

export function validateDepartment(data) {
  const schema = yup.object({
    deptName: yup
      .string()
      .required("กรุณากรอกชื่อกลุ่มสาระ")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกชื่อกลุ่มสาระ",
        (value) => value && value.length > 0
      )
      .min(3, "ชื่อกลุ่มสาระต้องมีอย่างน้อย 3 ตัวอักษร")
      .max(100, "ชื่อกลุ่มสาระต้องไม่เกิน 100 ตัวอักษร")
      .matches(
        /^[ก-๙a-zA-Z0-9\s\-()]+$/,
        "ชื่อกลุ่มสาระต้องเป็นตัวอักษรไทย อังกฤษ ตัวเลข เครื่องหมาย - () เท่านั้น"
      ),
  });

  return validateWithSchema(schema, data);
}

export function validateClassroom(data) {
  const schema = yup.object({
    classLevel: yup
      .number()
      .required("กรุณาเลือกระดับชั้น")
      .min(1, "ระดับชั้นต้องอยู่ระหว่าง 1-6")
      .max(6, "ระดับชั้นต้องอยู่ระหว่าง 1-6"),
    classRoom: yup
      .string()
      .required("กรุณากรอกหมายเลขห้อง")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกหมายเลขห้อง",
        (value) => value && value.length > 0
      )
      .matches(/^[0-9]+$/, "หมายเลขห้องต้องเป็นตัวเลขเท่านั้น")
      .min(1, "หมายเลขห้องต้องมีอย่างน้อย 1 หลัก")
      .max(3, "หมายเลขห้องต้องไม่เกิน 3 หลัก"),
    classTypeId: yup
      .string()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      }),
    termId: yup
      .string()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      }),
    academicYear: yup
      .number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      }),
    semester: yup
      .number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      }),
    teacherIds: yup
      .array()
      .of(yup.string())
      .nullable()
      .default([])
      .transform((value, originalValue) => {
        // Allow empty array or null
        if (!originalValue || originalValue.length === 0) {
          return [];
        }
        return value;
      }),
    leaderId: yup
      .string()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      }),
  });

  return validateWithSchema(schema, data);
}

export function validateClassroomType(data) {
  const schema = yup.object({
    classTypeNameThai: yup
      .string()
      .required("กรุณากรอกชื่อประเภทห้องเรียนภาษาไทย")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกชื่อประเภทห้องเรียนภาษาไทย",
        (value) => value && value.length > 0
      )
      .min(2, "ชื่อประเภทห้องเรียนต้องมีอย่างน้อย 2 ตัวอักษร")
      .max(100, "ชื่อประเภทห้องเรียนต้องไม่เกิน 100 ตัวอักษร")
      .matches(
        /^[ก-๙0-9\s\-()]+$/,
        "ชื่อประเภทห้องเรียนต้องเป็นภาษาไทยเท่านั้น"
      ),
    classTypeNameEng: yup
      .string()
      .required("กรุณากรอกชื่อประเภทห้องเรียนภาษาอังกฤษ")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกชื่อประเภทห้องเรียนภาษาอังกฤษ",
        (value) => value && value.length > 0
      )
      .min(2, "ชื่อประเภทห้องเรียนต้องมีอย่างน้อย 2 ตัวอักษร")
      .max(100, "ชื่อประเภทห้องเรียนต้องไม่เกิน 100 ตัวอักษร")
      .matches(
        /^[a-zA-Z0-9\s\-()]+$/,
        "ชื่อประเภทห้องเรียนต้องเป็นภาษาอังกฤษเท่านั้น"
      ),
  });

  return validateWithSchema(schema, data);
}

export function validateSubject(data) {
  const schema = yup.object({
    subCode: yup
      .string()
      .required("กรุณากรอกรหัสวิชา")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกรหัสวิชา",
        (value) => value && value.length > 0
      )
      .min(2, "รหัสวิชาต้องมีอย่างน้อย 2 ตัวอักษร")
      .max(20, "รหัสวิชาต้องไม่เกิน 20 ตัวอักษร")
      .matches(
        /^[ก-๙a-zA-Z0-9]+$/,
        "รหัสวิชาต้องเป็นตัวอักษรไทย อังกฤษ หรือตัวเลขเท่านั้น"
      ),
    subNameThai: yup
      .string()
      .required("กรุณากรอกชื่อวิชาภาษาไทย")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกชื่อวิชาภาษาไทย",
        (value) => value && value.length > 0
      )
      .min(2, "ชื่อวิชาต้องมีอย่างน้อย 2 ตัวอักษร")
      .max(200, "ชื่อวิชาต้องไม่เกิน 200 ตัวอักษร")
      .matches(/^[ก-๙0-9\s]+$/, "ชื่อวิชาภาษาไทยต้องเป็นภาษาไทยเท่านั้น"),
    subNameEng: yup
      .string()
      .required("กรุณากรอกชื่อวิชาภาษาอังกฤษ")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกชื่อวิชาภาษาอังกฤษ",
        (value) => value && value.length > 0
      )
      .min(2, "ชื่อวิชาต้องมีอย่างน้อย 2 ตัวอักษร")
      .max(200, "ชื่อวิชาต้องไม่เกิน 200 ตัวอักษร")
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        "ชื่อวิชาภาษาอังกฤษต้องเป็นภาษาอังกฤษเท่านั้น"
      ),
    subCredit: yup
      .number()
      .required("กรุณากรอกหน่วยกิต")
      .min(0, "หน่วยกิตต้องมากกว่าหรือเท่ากับ 0")
      .max(10, "หน่วยกิตต้องไม่เกิน 10")
      .test(
        "is-valid-credit",
        "หน่วยกิตต้องเป็นทศนิยม 0.5 เท่านั้น",
        (value) => {
          if (value === undefined || value === null) return false;
          return value % 0.5 === 0;
        }
      ),
    subTypeId: yup.string().required("กรุณาเลือกกลุ่มสาระการเรียนรู้"),
    tchId: yup
      .string()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      }),
  });

  return validateWithSchema(schema, data);
}

export function validateSubjectType(data) {
  const schema = yup.object({
    subTypeNameThai: yup
      .string()
      .required("กรุณากรอกชื่อกลุ่มสาระการเรียนรู้ภาษาไทย")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกชื่อกลุ่มสาระการเรียนรู้ภาษาไทย",
        (value) => value && value.length > 0
      )
      .min(3, "ชื่อกลุ่มสาระต้องมีอย่างน้อย 3 ตัวอักษร")
      .max(100, "ชื่อกลุ่มสาระต้องไม่เกิน 100 ตัวอักษร")
      .matches(/^[ก-๙0-9\s]+$/, "ชื่อกลุ่มสาระภาษาไทยต้องเป็นภาษาไทยเท่านั้น"),
    subTypeNameEng: yup
      .string()
      .required("กรุณากรอกชื่อกลุ่มสาระการเรียนรู้ภาษาอังกฤษ")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกชื่อกลุ่มสาระการเรียนรู้ภาษาอังกฤษ",
        (value) => value && value.length > 0
      )
      .min(3, "ชื่อกลุ่มสาระต้องมีอย่างน้อย 3 ตัวอักษร")
      .max(100, "ชื่อกลุ่มสาระต้องไม่เกิน 100 ตัวอักษร")
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        "ชื่อกลุ่มสาระภาษาอังกฤษต้องเป็นภาษาอังกฤษเท่านั้น"
      ),
  });

  return validateWithSchema(schema, data);
}

export function validateActivity(data) {
  const schema = yup.object({
    actName: yup
      .string()
      .required("กรุณากรอกชื่อกิจกรรม")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกชื่อกิจกรรม",
        (value) => value && value.length > 0
      )
      .min(3, "ชื่อกิจกรรมต้องมีอย่างน้อย 3 ตัวอักษร")
      .max(200, "ชื่อกิจกรรมต้องไม่เกิน 200 ตัวอักษร"),
    actDate: yup
      .string()
      .required("กรุณาเลือกวันที่เริ่มกิจกรรม")
      .test("is-valid-date", "วันที่ไม่ถูกต้อง", (value) => {
        if (!value) return false;
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
      }),
    actDateEnd: yup
      .string()
      .required("กรุณาเลือกวันที่สิ้นสุดกิจกรรม")
      .test("is-valid-date", "วันที่ไม่ถูกต้อง", (value) => {
        if (!value) return false;
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
      })
      .test(
        "is-after-start",
        "วันที่สิ้นสุดต้องมาหลังหรือเท่ากับวันที่เริ่ม",
        function (value) {
          const { actDate } = this.parent;
          if (!actDate || !value) return true;
          return new Date(value) >= new Date(actDate);
        }
      ),
    actTypeId: yup
      .mixed()
      .required("กรุณาเลือกประเภทกิจกรรม")
      .test("is-valid-type", "กรุณาเลือกประเภทกิจกรรม", (value) => {
        return value && (value.value || typeof value === "string");
      }),
    actDesc: yup
      .string()
      .required("กรุณากรอกรายละเอียดกิจกรรม")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกรายละเอียดกิจกรรม",
        (value) => value && value.length > 0
      )
      .min(10, "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร")
      .max(1000, "รายละเอียดต้องไม่เกิน 1000 ตัวอักษร"),
    actLocation: yup
      .string()
      .required("กรุณากรอกสถานที่จัดกิจกรรม")
      .trim()
      .test(
        "not-empty",
        "กรุณากรอกสถานที่จัดกิจกรรม",
        (value) => value && value.length > 0
      )
      .min(3, "สถานที่ต้องมีอย่างน้อย 3 ตัวอักษร")
      .max(200, "สถานที่ต้องไม่เกิน 200 ตัวอักษร"),
    actStartTime: yup
      .string()
      .required("กรุณาเลือกเวลาเริ่มกิจกรรม")
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "รูปแบบเวลาไม่ถูกต้อง"),
    actEndTime: yup
      .string()
      .required("กรุณาเลือกเวลาสิ้นสุดกิจกรรม")
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "รูปแบบเวลาไม่ถูกต้อง")
      .test(
        "is-after-start-time",
        "เวลาสิ้นสุดต้องมาหลังเวลาเริ่ม",
        function (value) {
          const { actStartTime, actDate, actDateEnd } = this.parent;
          if (!actStartTime || !value) return true;

          // If same day, end time must be after start time
          if (actDate === actDateEnd) {
            return value > actStartTime;
          }

          return true;
        }
      ),
    joinLimit: yup.boolean(),
    joinLimitType: yup.string().when("joinLimit", {
      is: true,
      then: (schema) =>
        schema
          .required("กรุณาเลือกประเภทการจำกัด")
          .oneOf(["classroom", "number"], "ประเภทการจำกัดไม่ถูกต้อง"),
      otherwise: (schema) => schema.notRequired(),
    }),
    joinLimitNumber: yup
      .number()
      .nullable()
      .when(["joinLimit", "joinLimitType"], {
        is: (joinLimit, joinLimitType) =>
          joinLimit === true && joinLimitType === "number",
        then: (schema) =>
          schema
            .required("กรุณากรอกรายละเอียดกิจกรรม")
            .min(1, "จำนวนผู้เข้าร่วมต้องมากกว่า 0")
            .max(10000, "จำนวนผู้เข้าร่วมต้องไม่เกิน 10,000 คน"),
        otherwise: (schema) => schema.notRequired(),
      }),
    teachers: yup.array().when("teacherAll", {
      is: false,
      then: (schema) =>
        schema
          .min(1, "กรุณาเลือกครูผู้ดูแลอย่างน้อย 1 คน")
          .required("กรุณาเลือกครูผู้ดูแล"),
      otherwise: (schema) => schema.notRequired(),
    }),
    teacherAll: yup.boolean(),
    classrooms: yup.array().when(["joinLimit", "joinLimitType"], {
      is: (joinLimit, joinLimitType) =>
        joinLimit === true && joinLimitType === "classroom",
      then: (schema) =>
        schema
          .min(1, "กรุณาเลือกห้องเรียนอย่างน้อย 1 ห้อง")
          .required("กรุณาเลือกห้องเรียน"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return validateWithSchema(schema, data);
}
