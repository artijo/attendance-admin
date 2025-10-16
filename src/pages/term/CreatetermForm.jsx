import axios from "axios";
import { useState } from "react";
import { HOSTNAME } from "../../config";
import ErrorAlert from "../../components/alert/error";
import { Link, useNavigate } from "react-router-dom";
import { valueNumberToThaiText } from "../../helper";
import Button from "../../components/button";
import { validateTerm } from "../../validator";

function CreatetermForm() {
  // สำหรับไปหน้า Main Term page และส่ง state ที่ใช้สำหรับข้อความสร้างเทอมหรือปีการศึกษาสำเร็จ
  const navigate = useNavigate();

  // ตัวแปร state สำหรับการเก็บค่าที่รับมาจาก element input ต่างๆ
  const [formData, setFormData] = useState({
    academicYear: "",
    semester: "",
    termStart: "",
    termEnd: "",
  });

  // State สำหรับการแจ้งเตือนจาก server
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  // State สำหรับเก็บสถานะว่ากำลังส่งข้อมูลไป server
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // function สำหรับการเปลี่ยนค่า state ของแต่ละ input
  const onChangeInputFormData = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value;
    let formDataState = {
      ...formData,
      [inputName]: inputValue,
    };
    setFormData(formDataState);

    // Clear validation error for this field
    if (validationErrors[inputName]) {
      setValidationErrors({
        ...validationErrors,
        [inputName]: "",
      });
    }
  };

  // function สำหรับส่งข้อมูลไปยังฝั่ง Backend
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    // Validate using Yup
    const validation = validateTerm(formData);

    if (!validation.success) {
      const firstError = Object.values(validation.errors)[0];
      setMsg(firstError);
      setError(true);
      setValidationErrors(validation.errors);
      return;
    }

    // Clear validation errors
    setValidationErrors({});
    setError(false);

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${HOSTNAME}/a/academicYearTerm`,
        validation.value
      );
      if (!response.status === 200) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างข้อมูล");
      setError(true);
    } finally {
      let state = {
        title: "บันทึกสำเร็จ",
        status: true, // แปลว่าสร้างเทอมสำเร็จเพิ่มเทอมสำเร็จ
        msg: `เพิ่ม ${valueNumberToThaiText(formData.semester)} ปีการศึกษา ${
          formData.academicYear
        } เข้าสู่ระบบแล้ว`,
      };
      setIsSubmitting(false);
      navigate("/terms", { state: state });
    }
  };

  // function สำหรับปิด alert dialog
  const dismissAlerts = () => {
    setError(false);
    // setSuccess(false);
    setMsg("");
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          เพิ่มเทอมและปีการศึกษา
        </h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium text-text-color font-heading">
              เพิ่มข้อมูลใหม่
            </h2>
            <p className="text-sm text-text-color-alt font-body">
              กรุณากรอกข้อมูลให้ครบถ้วน
            </p>
          </div>
        </div>

        <Link
          to="/terms"
          className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          กลับไปหน้ารายการเทอม
        </Link>
      </div>

      <div className="mb-4" onClick={dismissAlerts}>
        {error && <ErrorAlert title="เกิดข้อผิดพลาด" message={msg} />}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="p-6">
          <form onSubmit={handleOnSubmit} className="grid grid-cols-1 gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Input ปีการศึกษา */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-color font-body flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  ปีการศึกษา <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => onChangeInputFormData(e)}
                  placeholder="เช่น 2566"
                  className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                    validationErrors.academicYear
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {validationErrors.academicYear && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {validationErrors.academicYear}
                  </p>
                )}
                <p className="text-xs text-text-color-alt font-body mt-1">
                  กรอกเป็นตัวเลขปีพุทธศักราช (พ.ศ.) 4 หลัก
                </p>
              </div>

              {/* Input เทอม */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-color font-body flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  เทอม <span className="text-red-500">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={(e) => onChangeInputFormData(e)}
                  className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                    validationErrors.semester
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                >
                  <option value="">-- เลือกเทอม --</option>
                  <option value="1">เทอม 1</option>
                  <option value="2">เทอม 2</option>
                  <option value="3">เทอม 3 (ภาคฤดูร้อน)</option>
                </select>
                {validationErrors.semester && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {validationErrors.semester}
                  </p>
                )}
              </div>

              {/* Input วันเริ่มต้นเทอม */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-color font-body flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  วันเริ่มต้นเทอม <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="termStart"
                  value={formData.termStart}
                  onChange={(e) => onChangeInputFormData(e)}
                  className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                    validationErrors.termStart
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {validationErrors.termStart && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {validationErrors.termStart}
                  </p>
                )}
                <p className="text-xs text-text-color-alt font-body mt-1">
                  วันแรกของเทอมการศึกษา
                </p>
              </div>

              {/* Input วันสิ้นสุดเทอม */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-color font-body flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  วันสิ้นสุดเทอม <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="termEnd"
                  value={formData.termEnd}
                  onChange={(e) => onChangeInputFormData(e)}
                  min={formData.termStart}
                  className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                    validationErrors.termEnd
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {validationErrors.termEnd && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {validationErrors.termEnd}
                  </p>
                )}
                <p className="text-xs text-text-color-alt font-body mt-1">
                  วันสุดท้ายของเทอมการศึกษา
                </p>
              </div>
            </div>

            <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-100">
              <Button isSubmitting={isSubmitting} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatetermForm;
