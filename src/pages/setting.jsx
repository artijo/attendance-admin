import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { HOSTNAME } from "../config";
import { validatePasswordChange } from "../validator.js";
import ErrorAlert from "../components/alert/error";
import AlertSuccess from "../components/alert/success";

function Setting() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate form data
      const { success: isValid, errors: validationErrors } = validatePasswordChange(
        data.oldPassword,
        data.newPassword,
        data.confirmPassword
      );

      if (!isValid) {
        // Set first error found
        const firstError = Object.values(validationErrors)[0];
        setError({
          title: "ข้อมูลไม่ถูกต้อง",
          message: firstError
        });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${HOSTNAME}/auth/a/change-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        },
      );

      if (response.data.status === "success") {
        setSuccess({
          title: "สำเร็จ",
          message: "เปลี่ยนรหัสผ่านสำเร็จ"
        });
        reset(); // Reset form fields
      }
    } catch (err) {
      console.error("Error changing password:", err);
      
      if (err.response && err.response.data) {
        // Handle different error messages based on backend response
        if (err.response.status === 400) {
          setError({
            title: "รหัสผ่านไม่ถูกต้อง",
            message: "รหัสผ่านเดิมไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง"
          });
        } else if (err.response.status === 401) {
          setError({
            title: "ไม่สามารถเปลี่ยนรหัสผ่านได้",
            message: "กรุณาเข้าสู่ระบบใหม่"
          });
        } else {
          setError({
            title: "เกิดข้อผิดพลาด",
            message: err.response.data.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง"
          });
        }
      } else {
        setError({
          title: "เกิดข้อผิดพลาด",
          message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">ตั้งค่าระบบ</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-line p-6">
        <div className="border-b border-line pb-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-primary font-heading flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 10.5V6.75C16.5 4.26472 14.4853 2.25 12 2.25C9.51472 2.25 7.5 4.26472 7.5 6.75V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15.75V17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.25 21.75H18.75C19.4404 21.75 20 21.1904 20 20.5V11.75C20 11.0596 19.4404 10.5 18.75 10.5H5.25C4.55964 10.5 4 11.0596 4 11.75V20.5C4 21.1904 4.55964 21.75 5.25 21.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            เปลี่ยนรหัสผ่าน
          </h2>
          <p className="text-sm text-text-color-alt mb-4">กรุณากรอกรหัสผ่านเดิมและรหัสผ่านใหม่ที่ต้องการเปลี่ยน</p>
          
          {error && <div className="mb-4"><ErrorAlert title={error.title} message={error.message} /></div>}
          {success && <div className="mb-4"><AlertSuccess title={success.title} message={success.message} /></div>}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-text-color text-sm font-medium mb-2 font-body" htmlFor="oldPassword">
                รหัสผ่านเดิม
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75C16.5 4.26472 14.4853 2.25 12 2.25C9.51472 2.25 7.5 4.26472 7.5 6.75V10.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15.75V17.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.25 21.75H18.75C19.4404 21.75 20 21.1904 20 20.5V11.75C20 11.0596 19.4404 10.5 18.75 10.5H5.25C4.55964 10.5 4 11.0596 4 11.75V20.5C4 21.1904 4.55964 21.75 5.25 21.75Z" />
                  </svg>
                </div>
                <input
                  {...register("oldPassword")}
                  type="password"
                  id="oldPassword"
                  className="w-full pl-10 py-2.5 px-3 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary font-body"
                  placeholder="กรอกรหัสผ่านเดิม"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-text-color text-sm font-medium mb-2 font-body" htmlFor="newPassword">
                รหัสผ่านใหม่
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75C16.5 4.26472 14.4853 2.25 12 2.25C9.51472 2.25 7.5 4.26472 7.5 6.75V10.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15.75V17.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.25 21.75H18.75C19.4404 21.75 20 21.1904 20 20.5V11.75C20 11.0596 19.4404 10.5 18.75 10.5H5.25C4.55964 10.5 4 11.0596 4 11.75V20.5C4 21.1904 4.55964 21.75 5.25 21.75Z" />
                  </svg>
                </div>
                <input
                  {...register("newPassword")}
                  type="password"
                  id="newPassword"
                  className="w-full pl-10 py-2.5 px-3 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary font-body"
                  placeholder="กรอกรหัสผ่านใหม่"
                />
              </div>
              <p className="mt-1 text-xs text-text-color-alt">รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร</p>
            </div>
            
            <div>
              <label className="block text-text-color text-sm font-medium mb-2 font-body" htmlFor="confirmPassword">
                ยืนยันรหัสผ่านใหม่
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15L15 9.75" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75C16.5 4.26472 14.4853 2.25 12 2.25C9.51472 2.25 7.5 4.26472 7.5 6.75V10.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.25 21.75H18.75C19.4404 21.75 20 21.1904 20 20.5V11.75C20 11.0596 19.4404 10.5 18.75 10.5H5.25C4.55964 10.5 4 11.0596 4 11.75V20.5C4 21.1904 4.55964 21.75 5.25 21.75Z" />
                  </svg>
                </div>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  id="confirmPassword"
                  className="w-full pl-10 py-2.5 px-3 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary font-body"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังดำเนินการ...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    เปลี่ยนรหัสผ่าน
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* You can add more settings sections here if needed */}
      </div>
    </div>
  );
}

export default Setting;