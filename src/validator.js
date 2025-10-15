import * as yup from "yup";

export function validateLogin(username, password) {
  const schema = yup.object({
    username: yup.string().required("กรุณากรอกชื่อผู้ใช้"),
    password: yup
      .string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .required("กรุณากรอกรหัสผ่าน"),
  });

  try {
    const result = schema.validateSync(
      { username, password },
      { abortEarly: false }
    );
    return { success: true, value: result };
  } catch (error) {
    // Format Yup error messages
    const formattedErrors = {};
    if (error.inner && Array.isArray(error.inner)) {
      error.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
    }
    return { success: false, errors: formattedErrors };
  }
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

  try {
    const result = schema.validateSync(
      { oldPassword, newPassword, confirmPassword },
      { abortEarly: false }
    );
    return { success: true, value: result };
  } catch (error) {
    // Format Yup error messages
    const formattedErrors = {};
    if (error.inner && Array.isArray(error.inner)) {
      error.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
    }
    return { success: false, errors: formattedErrors };
  }
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
