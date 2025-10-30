import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { summaryAttendeanceBySubjectFilterByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import axios from "axios";
import { TapAttendenceSummaryOpen } from "./tapAttendenceSummaryOpen";
import {
  convertNumberToThaiMonth,
  formatDateToThaiStyle,
  formatAttStatus,
} from "../../helper";

export const AttendenceBySubjectDetailList = ({ studentList }) => {
  // console.log(studentList);
  const navigate = useNavigate();
  const location = useLocation();
  const subject = location.state?.subject;
  const classroomId = location.state?.classroomId;
  const ref = useRef([]);
  const [classroomInfo, setClassroomInfo] = useState(null);
  const [isTabOpen, setIsTabOpen] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);

  // console.log(classroomInfo);

  // Render table header for each month
  const TableHeader = ({ month }) => {
    let indexReal = 0;
    return (
      <tr>
        <th
          className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider sticky left-0 outline-1 outline-gray-200 bg-white"
          style={{ minWidth: "80px" }}
        >
          เลขที่
        </th>
        <th
          className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider sticky left-[80px] outline-1 outline-gray-200 bg-white"
          style={{ minWidth: "128px" }}
        >
          รหัสนักเรียน
        </th>
        <th
          className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider sticky left-[208px] outline-1 outline-gray-200 bg-white"
          style={{ minWidth: "200px" }}
        >
          ชื่อ-นามสกุล
        </th>
        {studentList.data[0].attendance
          .filter((att) => att.month === month)
          .map((attendance, index) => (
            <th
              className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider outline-1 outline-gray-200"
              key={index}
              style={{ minWidth: "240px" }}
            >
              คาบที่ {++indexReal} วันที่{" "}
              {formatDateToThaiStyle(attendance.studingTimeDate)}
              {/* <div className="font-medium">คาบที่ {++indexReal}</div>
                            <div className="mt-1 text-xs font-normal text-gray-500">({dateTimeFormat(attendance.studingTimeDate)})</div> */}
            </th>
          ))}
      </tr>
    );
  };

  // Render table body for each month
  const TableBody = ({ month }) => {
    const getStatusClass = (status) => {
      if (!status) return "text-gray-400";

      const statusClasses = {
        present: "text-green-600 font-medium",
        absent: "text-red-600 font-medium",
        late: "text-orange-500 font-medium",
        activity: "text-blue-600 font-medium",
        leave: "text-purple-600 font-medium",
      };

      return statusClasses[status.toLowerCase()] || "";
    };

    return (
      <>
        {studentList.data.map((student, index) => (
          <tr
            key={index}
            className="transition-colors duration-150 hover:bg-gray-50"
          >
            <td
              className="sticky left-0 px-4 py-3 font-medium bg-white text-text-color outline-1 outline-gray-200"
              style={{ minWidth: "80px" }}
            >
              {student.stdNo}
            </td>
            <td
              className="px-4 py-3 font-medium text-text-color sticky left-[80px] bg-white outline-1 outline-gray-200"
              style={{ minWidth: "128px" }}
            >
              {student.stdId}
            </td>
            <td
              className="px-4 py-3 font-medium text-text-color sticky left-[208px] bg-white outline-1 outline-gray-200"
              style={{ minWidth: "200px" }}
            >
              {`${student.fName} ${student.lName}`}
            </td>
            {student.attendance
              .filter((att) => att.month === month)
              .map((attendance, attIndex) => (
                <td
                  key={attIndex}
                  className={`px-6 py-4  outline-1 outline-gray-200 ${getStatusClass(attendance.attStatus?.toLowerCase())}`}
                  style={{ minWidth: "200px" }}
                >
                  {attendance.attStatus != null
                    ? formatAttStatus(attendance.attStatus.toLowerCase())
                    : "-"}
                </td>
              ))}
          </tr>
        ))}
      </>
    );
  };

  // Render table footer with status summary
  const TableFooter = ({ month }) => {
    // Get all attendance records for this month
    const monthAttendance = studentList.data.flatMap((student) =>
      student.attendance.filter((att) => att.month === month),
    );

    // Group attendance records by period (using their index)
    const periodStatusCounts = {};

    monthAttendance.forEach((attendance, index) => {
      // Get period index (e.g., 1st period, 2nd period)
      const periodIndex =
        index % (monthAttendance.length / studentList.data.length);

      if (!periodStatusCounts[periodIndex]) {
        periodStatusCounts[periodIndex] = {
          present: 0,
          absent: 0,
          late: 0,
          activity: 0,
          leave: 0,
          null: 0,
        };
      }

      const status = attendance.attStatus?.toLowerCase() || "null";
      periodStatusCounts[periodIndex][status]++;
    });

    const getStatusSummaryStyle = (status) => {
      const statusStyles = {
        present: "bg-green-50 text-green-700",
        absent: "bg-red-50 text-red-700",
        late: "bg-orange-50 text-orange-700",
        activity: "bg-blue-50 text-blue-700",
        leave: "bg-purple-50 text-purple-700",
        null: "bg-gray-50 text-gray-500",
      };

      return statusStyles[status] || "bg-gray-50 text-gray-500";
    };

    const renderStatusSummary = (counts) => {
      const totalStudents = studentList.data.length;

      return (
        <div className="flex flex-col space-y-1 min-w-[100px]">
          {Object.entries(counts).map(([status, count]) => {
            if (count === 0 || status === "null") return null;

            const statusLabel = {
              present: "เข้าเรียน",
              absent: "ไม่เข้าเรียน",
              late: "มาสาย",
              activity: "เข้าร่วมกิจกรรม",
              leave: "ลา",
            }[status];

            const percentage = Math.round((count / totalStudents) * 100);

            return (
              <div
                key={status}
                className={`text-xs px-2 py-1 rounded-md flex justify-between items-center ${getStatusSummaryStyle(status)}`}
              >
                <span>{statusLabel}</span>
                <span className="font-medium">
                  {count} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <tr className="border-t-2 border-gray-200 bg-gray-50">
        <td
          colSpan={3}
          className="sticky left-0 z-20 px-6 py-3 font-medium bg-gray-50 text-text-color outline-1 outline-gray-200"
          style={{ minWidth: "280px" }}
        >
          สรุปจำนวนแต่ละสถานะ
        </td>
        {Object.entries(periodStatusCounts).map(([periodIndex, counts]) => (
          <td key={periodIndex} className="px-3 py-3">
            {renderStatusSummary(counts)}
          </td>
        ))}
      </tr>
    );
  };

  // Main table component
  const Table = ({ month, exportPdf, exportExcel, index }) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-3">
          {exportPdf}
          {exportExcel}
        </div>

        <div
          ref={(element) => (ref.current[index] = element)}
          className="overflow-auto h-[500px] border border-gray-200 rounded-lg"
        >
          <table className="w-full text-sm bg-white border-collapse border-gray-200 rounded-lg ">
            <thead className="sticky top-0 z-20 bg-white">
              <TableHeader month={month} />
            </thead>
            <tbody>
              <TableBody month={month} />
            </tbody>
            <tfoot>
              <TableFooter month={month} />
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  // Fetch classroom info
  const fetchClassroomInfo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${HOSTNAME}/a/classroom/${classroomId}`,
      );
      if (response.status === 200) {
        setClassroomInfo(response.data);
        setError(null);
      }
    } catch (error) {
      console.error(error);
      setError("ไม่สามารถโหลดข้อมูลห้องเรียนได้");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab open/close
  const handleIsTabOpen = (index) => {
    let newIsTabOpen = [...isTabOpen];
    newIsTabOpen[index] = !newIsTabOpen[index];
    setIsTabOpen(newIsTabOpen);
  };

  // Extract unique months from attendance data
  const extractAvailableMonths = () => {
    if (!studentList || !studentList.data || studentList.data.length === 0) {
      return [];
    }

    const monthsSet = new Set();
    studentList.data.forEach((student) => {
      if (student.attendance && Array.isArray(student.attendance)) {
        student.attendance.forEach((att) => {
          if (att.month !== null && att.month !== undefined) {
            monthsSet.add(att.month);
          }
        });
      }
    });

    // Convert Set to Array and sort numerically
    return Array.from(monthsSet).sort((a, b) => a - b);
  };

  // Initialize tab states
  const makeValueIsOpen = () => {
    // Start with all tabs closed
    const arrayState = new Array(availableMonths.length || 0).fill(false);
    // If only one month, open it by default
    if (arrayState.length === 1) arrayState[0] = true;
    setIsTabOpen(arrayState);
  };

  // Handle Excel export
  const handleExportExcel = (objectlist, month) => {
    const fileName = `สรุปการเข้าเรียนวิชา${subject.subNameThai}_ม.${classroomInfo.classLevel}/${classroomInfo.classRoom}_เดือน${convertNumberToThaiMonth(month)}`;
    try {
      summaryAttendeanceBySubjectFilterByDay(
        objectlist,
        month,
        fileName,
        classroomInfo,
        subject,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToPDF = (subject, classroomInfo, month) => {
    navigate("/attendances/details/bysubject/pdf", {
      state: { subject, classroomInfo, month, studentList },
    });
  };

  // Navigate to exam eligibility summary page
  const handleNavigateToExamEligibility = () => {
    navigate("/attendances/abstract/subject", {
      state: {
        classroomInfo: classroomInfo,
        subject: subject,
        studentList: studentList.data,
      },
    });
  };

  // Summary button component
  const ExamEligibilityButton = () => {
    return (
      <button
        onClick={handleNavigateToExamEligibility}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        แบบสรุปการมีสิทธิ์สอบตามรายวิชา
      </button>
    );
  };

  useEffect(() => {
    if (location.state?.classroomId) {
      fetchClassroomInfo();
    }

    if (studentList && studentList.data) {
      const months = extractAvailableMonths();
      setAvailableMonths(months);
    }
  }, [studentList, location.state]);

  useEffect(() => {
    if (availableMonths.length > 0) {
      makeValueIsOpen();
    }
  }, [availableMonths]);

  if (!studentList || !studentList.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="px-4 py-3 bg-white border rounded-lg shadow-sm border-line">
          <div className="text-sm text-text-color-alt font-body">
            จำนวนเดือนที่มีข้อมูล:
          </div>
          <div className="text-lg font-medium text-primary font-heading">
            {availableMonths.length} เดือน
          </div>
        </div>

        <ExamEligibilityButton />
      </div>

      <div className="space-y-4">
        {classroomInfo != null &&
          availableMonths.map((month, index) => (
            <div key={index}>
              <TapAttendenceSummaryOpen
                title={`เดือน${convertNumberToThaiMonth(month)}`}
                index={index}
                isTabOpen={isTabOpen}
                handleIsTabOpen={handleIsTabOpen}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
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
                }
              >
                <Table
                  month={month}
                  index={index}
                  exportPdf={
                    <ExportPdfButton
                      onClikFunction={() =>
                        navigateToPDF(subject, classroomInfo, month, index)
                      }
                    />
                  }
                  exportExcel={
                    <ExportExcelButton
                      handelOnClickFunction={() =>
                        handleExportExcel(studentList, month)
                      }
                    />
                  }
                />
              </TapAttendenceSummaryOpen>
            </div>
          ))}

        {availableMonths.length === 0 && (
          <div className="p-6 text-center bg-white border shadow-md rounded-xl border-line">
            <div className="flex justify-center mb-4 text-text-color-alt">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
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
            </div>
            <h3 className="mb-1 text-lg font-medium text-text-color">
              ไม่พบข้อมูลรายเดือน
            </h3>
            <p className="text-text-color-alt">
              ยังไม่มีข้อมูลการเข้าเรียนในรายวิชานี้
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          to="/attendances"
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
          กลับไปหน้าการเข้าเรียน
        </Link>
      </div>
    </div>
  );
};

AttendenceBySubjectDetailList.propTypes = {
  studentList: PropTypes.object.isRequired,
};
