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
