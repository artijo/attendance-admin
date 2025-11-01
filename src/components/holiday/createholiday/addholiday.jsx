import React, { useState } from "react";
import {
  daybetween,
  formatDateToInputFormat,
  formatDateToThaiStyle,
  formatTypeToThai,
} from "../../../helper";
import { validateHolidayInput, validateHolidayList } from "../../../validator";
import ErrorAlert from "../../alert/error";

function AddHoliday({
  holidayList,
  setHolidayList,
  termStart,
  termEnd,
  callApiAddHoliday,
  prevStep,
  isSubmitting,
}) {
  const totalPages = Math.ceil(holidayList.length / 10);
  const [currentPage, setCurrentPage] = useState(1);
  const sliceHolidayList = holidayList.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  //form data สำหรับรับค่า เพิ่มรายการ holiday
  const [holiday, setHoliday] = useState({
    name: "",
    startDate: "",
    endDate: "",
    type: "",
  });

  // เพิ่ม state สำหรับเช็คแต่ละ holiday
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [inputError, setInputError] = useState({});

  // // ฟังก์ชันสำหรับ toggle checkbox
  const handleCheckboxChange = (index) => {
    let cloneHolidaySelected = selectedHolidays.slice();
    const isCheck = selectedHolidays.findIndex(
      (holidayIndex) => holidayIndex === index
    ); // find index จะ return เป็น -1 ถ้าไม่เจอ
    // console.log(isCheck);
    if (isCheck < 0) {
      cloneHolidaySelected.push(index);
    } else {
      cloneHolidaySelected.pop(index);
    }
    setSelectedHolidays(cloneHolidaySelected);
  };

  // ฟังก์ชันลบรายการที่เลือกจาก checkBox
  const handleDeleteSelected = () => {
    const filteredList = holidayList.filter(
      (_, index) => !selectedHolidays.includes(index)
    );
    setHolidayList(filteredList);
    setSelectedHolidays([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (e) => {
    setHoliday({ ...holiday, [e.target.name]: e.target.value });
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: "",
      });
    }
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();

    // Validate using Yup
    const validation = validateHolidayInput(holiday);

    if (!validation.success) {
      const firstError = Object.values(validation.errors)[0];
      setInputError({
        title: "เกิดข้อผิดพลาด",
        description: firstError,
      });
      setValidationErrors(validation.errors);
      return;
    }

    // Clear validation errors
    setValidationErrors({});
    setInputError({});

    const holidayRangeList = daybetween(holiday.startDate, holiday.endDate).map(
      (date) => {
        return {
          holidayname: holiday.name,
          startDate: date,
          endDate: date,
          type: holiday.type,
        };
      }
    );
    setHolidayList((prevState) => [...holidayRangeList, ...prevState]);

    // Clear form after successful add
    setHoliday({
      name: "",
      startDate: "",
      endDate: "",
      type: "",
    });
  };

  const handlePrevStep = () => {
    prevStep();
    setHolidayList([]); // เคลียร์ holiday list เมื่อย้อนกลับไป step ก่อนหน้า
  };

  const handleSubmitHolidays = () => {
    // Validate holiday list before submitting
    const holidayListData = holidayList.map((h) => ({
      holidayName: h.holidayname,
      startHolidayDate: h.startDate,
      type: h.type,
    }));

    const validation = validateHolidayList({
      holidayList: holidayListData,
      termId: "temp", // This will be added by parent component
    });

    if (!validation.success) {
      const firstError = Object.values(validation.errors)[0];
      setInputError({
        title: "เกิดข้อผิดพลาด",
        description: firstError,
      });
      return;
    }

    // Clear errors and call API
    setInputError({});
    callApiAddHoliday();
  };

  return (
    <div className="mt-4">
      {inputError.title && inputError.description && (
        <div className="mb-4" onClick={() => setInputError({})}>
          <ErrorAlert
            title={inputError.title}
            message={inputError.description}
          />
        </div>
      )}

      {holidayList.length > 0 && (
        <div className="my-4 w-full flex justify-end">
          <button
            type="button"
            onClick={handleDeleteSelected}
            disabled={selectedHolidays.length > 0 ? false : true}
            className={`px-3 py-1 rounded ${
              selectedHolidays.length > 0
                ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            ลบรายการที่เลือก
          </button>
        </div>
      )}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <form onSubmit={handleAddHoliday}>
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  ชื่อวันหยุด
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  วันที่เริ่มหยุด
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  วันที่สิ้นสุด
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  ประเภท
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="px-6 py-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="ชื่อวันหยุด"
                    value={holiday.name}
                    onChange={handleChange}
                    className={`border rounded p-1 w-full ${
                      validationErrors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.name}
                    </p>
                  )}
                </td>
                <td className="px-6 py-3">
                  <input
                    type="date"
                    name="startDate"
                    value={holiday.startDate}
                    min={formatDateToInputFormat(termStart)}
                    max={formatDateToInputFormat(termEnd)}
                    onChange={handleChange}
                    className={`border rounded p-1 w-full ${
                      validationErrors.startDate
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {validationErrors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.startDate}
                    </p>
                  )}
                </td>
                <td className="px-6 py-3">
                  <input
                    type="date"
                    name="endDate"
                    value={holiday.endDate}
                    min={holiday.startDate}
                    max={formatDateToInputFormat(termEnd)}
                    onChange={handleChange}
                    className={`border rounded p-1 w-full ${
                      validationErrors.endDate
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  {validationErrors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.endDate}
                    </p>
                  )}
                </td>
                <td className="px-6 py-3">
                  <select
                    name="type"
                    value={holiday.type}
                    onChange={handleChange}
                    className={`border rounded p-1 w-full ${
                      validationErrors.type
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <option value="" disabled>
                      เลือกประเภท
                    </option>
                    <option value="RATCHAKHAN">ราชการ</option>
                    <option value="SCHOOL">โรงเรียน</option>
                  </select>
                  {validationErrors.type && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.type}
                    </p>
                  )}
                </td>
                <td className="px-6 py-3">
                  <button
                    type="submit"
                    className="bg-primary text-white px-3 py-1 rounded hover:bg-sky-700 cursor-pointer text-nowrap"
                  >
                    เพิ่มรายการ
                  </button>
                </td>
              </tr>

              {sliceHolidayList.length > 0 &&
                sliceHolidayList.map((holiday, index) => (
                  <tr
                    key={`${holiday.holidayname}-${index}`}
                    className="border-b border-gray-200"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedHolidays.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                        className="mr-1.5"
                      />{" "}
                      {holiday.holidayname}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {formatDateToThaiStyle(holiday.startDate)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {formatDateToThaiStyle(holiday.endDate)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {formatTypeToThai(holiday.type)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </form>
      </div>
      {sliceHolidayList.length > 0 && (
        <div className="py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-color-alt">
              แสดง{" "}
              <span className="font-medium text-text-color">
                {sliceHolidayList.length}
              </span>{" "}
              จาก{" "}
              <span className="font-medium text-text-color">
                {holidayList.length}
              </span>{" "}
              รายการ
            </p>

            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 bg-white text-text-color hover:bg-gray-50 transition-colors"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show current page, first, last, and pages near current
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-text-color-alt">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "bg-white text-text-color hover:bg-gray-50 border border-gray-200 transition-colors"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 bg-white text-text-color hover:bg-gray-50 transition-colors"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => handlePrevStep()}
          className="cursor-pointer inline-flex justify-center items-center gap-2 px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-gray-200 bg-gray-400 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
          ย้อนกลับ
        </button>
        <button
          onClick={() => handleSubmitHolidays()}
          disabled={holidayList.length === 0 || isSubmitting}
          className={`inline-flex justify-center items-center gap-2 px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg transition-all duration-300
                            ${
                              holidayList.length === 0 || isSubmitting
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30"
                            }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              เพิ่มวันหยุดเข้าสู่ระบบ
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default AddHoliday;
