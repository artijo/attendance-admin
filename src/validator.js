import * as yup from 'yup';

export function validateLogin(username, password) {
    const schema = yup.object({
        username: yup.string()
                    .required("กรุณากรอกชื่อผู้ใช้"),
        password: yup.string()
                    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
                    .required("กรุณากรอกรหัสผ่าน"),
    });
    
    try {
        const result = schema.validateSync({ username, password }, { abortEarly: false });
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
