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

export function validatePasswordChange(oldPassword, newPassword, confirmPassword) {
    const schema = yup.object({
        oldPassword: yup.string()
            .required("กรุณากรอกรหัสผ่านเดิม")
            .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
        newPassword: yup.string()
            .required("กรุณากรอกรหัสผ่านใหม่")
            .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
        confirmPassword: yup.string()
            .required("กรุณายืนยันรหัสผ่านใหม่")
            .oneOf([yup.ref('newPassword')], "รหัสผ่านไม่ตรงกัน")
    });
    
    try {
        const result = schema.validateSync({ oldPassword, newPassword, confirmPassword }, { abortEarly: false });
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
