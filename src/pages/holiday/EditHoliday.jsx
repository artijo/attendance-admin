import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { formatDateTimeISOToDate } from "../../helper.js";
import ErrorAlert from "../../components/alert/error.jsx";
import { validateHoliday } from "../../validator.js";

function EditHoliday() {
  const params = useParams();
  const navigate = useNavigate();
  const [holidayName, setHolidayName] = useState("");
  const [dateStartDateEndDate, setDateStartDateEndDate] = useState("");
  const [holidayType, setHolidayType] = useState("RATCHAKHAN");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalHoliday, setOriginalHoliday] = useState(null);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const onSubmitEdit = async (event) => {
    event.preventDefault();

    // Prepare validation data
    const validationData = {
      holidayName: holidayName,
      startHolidayDate: dateStartDateEndDate,
      type: holidayType,
    };

    // Validate using Yup
    const validation = validateHoliday(validationData);

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
      const response = await axios.put(`${HOSTNAME}/a/holiday/${params.id}`, {
        holidayName: validation.value.holidayName,
        startHolidayDate: validation.value.startHolidayDate,
        type: validation.value.type,
      });
      if (!response.status === 200) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setMsg(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไขวันหยุด"
      );
      setError(true);
    } finally {
      setIsSubmitting(false);
      let state = {
        title: "แก้ไขวันหยุดสำเร็จ",
        status: true,
        msg: `แก้ไขวันหยุด ${holidayName} สำเร็จ`,
      };
      navigate("/holiday", { state: state });
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${HOSTNAME}/a/holiday/one/${params.id}`
      );
      if (response.status === 200) {
        const holiday = response.data;
        setOriginalHoliday(holiday);
        setHolidayName(holiday.holidayName || "");
        setDateStartDateEndDate(
          formatDateTimeISOToDate(holiday.startHolidayDate) || ""
        );
        setHolidayType(holiday.type || "RATCHAKHAN");
      } else {
        throw new Error("ไม่สามารถโหลดข้อมูลวันหยุดได้");
      }
    } catch (error) {
      console.error(error);
      setError(true);
      setMsg(error.message || "ไม่สามารถโหลดข้อมูลวันหยุด");
    } finally {
      setIsLoading(false);
    }
  };

  const dismissAlerts = () => {
    setError(false);
    setMsg("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          แก้ไขข้อมูลวันหยุด
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
              {originalHoliday?.holidayName || "แก้ไขวันหยุด"}
            </h2>
            <p className="text-sm text-text-color-alt font-body">
              ปรับปรุงข้อมูลวันหยุด
            </p>
          </div>
        </div>

        <Link
          to="/holiday"
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
          กลับไปหน้ารายการวันหยุด
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
            <form className="grid grid-cols-1 gap-6" onSubmit={onSubmitEdit}>
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
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  ชื่อวันหยุด <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                    validationErrors.holidayName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  type="text"
                  name="holidayName"
                  value={holidayName}
                  onChange={(e) => {
                    setHolidayName(e.target.value);
                    if (validationErrors.holidayName) {
                      setValidationErrors({
                        ...validationErrors,
                        holidayName: "",
                      });
                    }
                  }}
                  placeholder="เช่น วันมาฆบูชา"
                />
                {validationErrors.holidayName && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {validationErrors.holidayName}
                  </p>
                )}
                <p className="text-xs text-text-color-alt font-body mt-1">
                  ตัวอย่าง: วันมาฆบูชา, วันสงกรานต์
                </p>
              </div>

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
                  วันและเวลาที่หยุด <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                    validationErrors.startHolidayDate
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  type="date"
                  name="dateStartDateEndDate"
                  value={dateStartDateEndDate}
                  onChange={(e) => {
                    setDateStartDateEndDate(e.target.value);
                    if (validationErrors.startHolidayDate) {
                      setValidationErrors({
                        ...validationErrors,
                        startHolidayDate: "",
                      });
                    }
                  }}
                />
                {validationErrors.startHolidayDate && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {validationErrors.startHolidayDate}
                  </p>
                )}
              </div>

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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  ประเภทวันหยุด <span className="text-red-500">*</span>
                </label>
                <select
                  name="holidayType"
                  className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                    validationErrors.type
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  value={holidayType}
                  onChange={(e) => {
                    setHolidayType(e.target.value);
                    if (validationErrors.type) {
                      setValidationErrors({ ...validationErrors, type: "" });
                    }
                  }}
                >
                  <option value="RATCHAKHAN">วันหยุดราชการ</option>
                  <option value="SCHOOL">วันหยุดโรงเรียน</option>
                </select>
                {validationErrors.type && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {validationErrors.type}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white transition-colors duration-300 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      บันทึกการแก้ไข
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

export default EditHoliday;
