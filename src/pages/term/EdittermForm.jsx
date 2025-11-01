import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME, TIME_ZONE } from "../../config";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AlertSuccess from "../../components/alert/success";
import ErrorAlert from "../../components/alert/error";
import { DateTime } from "luxon";
import { valueNumberToThaiText } from "../../helper";
import Button from "../../components/button";
import { validateTerm } from "../../validator";

function EdittermForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  // temrId สำหรับบอกว่าเรากำลังแก้ไขเทอมอะไรอยู่
  const termId = state.termId;
  // ตัวแปร state สำหรับการเก็บค่าที่รับมาจาก element input ต่างๆ
  const [formData, setFormData] = useState({
    academicYear: "",
    semester: "",
    termStart: "",
    termEnd: "",
  });
  // Loading state สำหรับสถานะกำลังโหลดข้อมูล
  const [isLoading, setIsLoading] = useState(true);
  // state ที่บ่งบอกว่ากำลังส่งข้อมูลไปยัง back end
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State สำหรับการแจ้งเตือนจาก server
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // แยกตัวอักษร time formate ด้วย T เพื่อเอาแค่ ปีเดือนวัน
  function spiltStringUtcTime(value) {
    const date = value.split("T")[0];
    return date;
  }
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
  // ดึงข้อมูล term ที่ต้องการแก้ไข
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${HOSTNAME}/a/academicterms/${location.state.termId}`
      );
      if (!response.status === 200) {
        throw new Error("ไม่สามารถโหลดข้อมูลเทอมได้");
      }
      const termStartDateTime = DateTime.fromISO(
        response.data.termStart
      ).setZone(TIME_ZONE);
      const termEndDateTime = DateTime.fromISO(response.data.termEnd).setZone(
        TIME_ZONE
      );
      setFormData({
        academicYear: response.data.academicYear + 543,
        semester: response.data.semester,
        termStart: spiltStringUtcTime(termStartDateTime.toString()),
        termEnd: spiltStringUtcTime(termEndDateTime.toString()),
      });
    } catch (error) {
      setError(true);
      setMsg(error.message || "ไม่สามารถโหลดข้อมูลเทอมได้");
    } finally {
      setIsLoading(false);
    }
  };
  // function สำหรับส่งข้อมูลไปยัง Backend
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
      const response = await axios.put(`${HOSTNAME}/a/academicterms`, {
        ...validation.value,
        termId: termId,
      });
      if (!response.status === 200) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setMsg(error.response?.data?.message || "เกิดข้อผิดพลาด");
      setError(true);
    } finally {
      let state = {
        title: "แก้ไขสำเร็จ",
        status: true, // แปลว่าสร้างเทอมสำเร็จเพิ่มเทอมสำเร็จ
        msg: `แก้ไข ${valueNumberToThaiText(formData.semester)} ปีการศึกษา ${formData.academicYear
          } เรียบร้อยแล้ว`,
      };
      setIsSubmitting(false);
      navigate("/terms", { state: state });
    }
  };
  // function สำหรับปิด alert dialog
  const dismissAlerts = () => {
    setError(false);
    setMsg("");
  };
  // useEffect เรียกใช้ function ดึงข้อมูลหาก state.termId มีค่าซึ่งแปลว่า มีค่าเทอม
  useEffect(() => {
    if (state.termId) {
      fetchData();
    }
  }, [state]);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          แก้ไขเทอมและปีการศึกษา
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium text-text-color font-heading">
              แก้ไขข้อมูล
            </h2>
            <p className="text-sm text-text-color-alt font-body">
              ปรับปรุงข้อมูลเทอมและปีการศึกษา
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
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
                    ปีการศึกษา (พ.ศ.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={(e) => onChangeInputFormData(e)}
                    placeholder="เช่น 2566"
                    className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${validationErrors.academicYear
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
                    กรอกเป็นตัวเลขปีพุทธศักราช (พ.ศ.)
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
                    className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${validationErrors.semester
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
                    className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${validationErrors.termStart
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
                    className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${validationErrors.termEnd
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      แก้ไข
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EdittermForm;
