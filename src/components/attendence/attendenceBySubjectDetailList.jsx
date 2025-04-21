import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AttendanceSummaryByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import axios from "axios";
import { TapAttendenceSummaryOpen } from "./tapAttendenceSummaryOpen";
import { convertNumberToThaiMonth, dateTimeFormat } from "../../helper";
import { tabletojson } from "tabletojson";
import BySubject from "./exportPdf/bysubject";

export const AttendenceBySubjectDetailList = ({ studentList }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const subject = location.state?.subject;
    const ref = useRef([]);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isTabOpen, setIsTabOpen] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // console.log(classroomInfo);
    
    // Format attendance status to Thai language
    const formatAttStatus = (status) => {
        const statusMap = {
            'present': 'เข้าเรียน',
            'absent': 'ไม่เข้าเรียน',
            'late': 'มาสาย',
            'activity': 'เข้าร่วมกิจกรรม',
            'leave': 'ลา'
        };
        return statusMap[status.toLowerCase()] || status;
    };

    // Render table header for each month
    const TableHeader = ({ month }) => {
        let indexReal = 0;
        return (
            <tr className="text-xs text-gray-700 uppercase bg-gray-50">
                <th className="px-4 py-3">เลขที่</th>
                <th className="px-4 py-3">รหัสนักเรียน</th>
                <th className="px-4 py-3">ชื่อ-นามสกุล</th>
                {studentList.data[0].attendance
                    .filter((att) => att.month === month)
                    .map((attendance, index) => (
                        <th key={index} className="px-4 py-3 text-center whitespace-nowrap">
                            <div className="font-medium">คาบที่ {++indexReal}</div>
                            <div className="text-xs mt-1 text-gray-500 font-normal">({dateTimeFormat(attendance.studingTimeDate)})</div>
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
                'present': 'text-green-600 font-medium',
                'absent': 'text-red-600 font-medium',
                'late': 'text-orange-500 font-medium',
                'activity': 'text-blue-600 font-medium',
                'leave': 'text-purple-600 font-medium'
            };
            
            return statusClasses[status.toLowerCase()] || "";
        };
        
        return (
            <>
                {studentList.data.map((student, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-3 text-center font-medium">{student.stdNo}</td>
                        <td className="px-4 py-3">{student.stdId}</td>
                        <td className="px-4 py-3 font-medium">{`${student.fName} ${student.lName}`}</td>
                        {student.attendance
                            .filter((att) => att.month === month)
                            .map((attendance, attIndex) => (
                                <td key={attIndex} className={`px-4 py-3 text-center ${getStatusClass(attendance.attStatus?.toLowerCase())}`}>
                                    {attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : '-'}
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
        const monthAttendance = studentList.data.flatMap(student => 
            student.attendance.filter(att => att.month === month)
        );
        
        // Group attendance records by period (using their index)
        const periodStatusCounts = {};
        
        monthAttendance.forEach((attendance, index) => {
            // Get period index (e.g., 1st period, 2nd period)
            const periodIndex = index % (monthAttendance.length / studentList.data.length);
            
            if (!periodStatusCounts[periodIndex]) {
                periodStatusCounts[periodIndex] = {
                    present: 0,
                    absent: 0,
                    late: 0,
                    activity: 0,
                    leave: 0,
                    null: 0
                };
            }
            
            const status = attendance.attStatus?.toLowerCase() || 'null';
            periodStatusCounts[periodIndex][status]++;
        });
        
        const getStatusSummaryStyle = (status) => {
            const statusStyles = {
                present: 'bg-green-50 text-green-700',
                absent: 'bg-red-50 text-red-700',
                late: 'bg-orange-50 text-orange-700',
                activity: 'bg-blue-50 text-blue-700',
                leave: 'bg-purple-50 text-purple-700',
                null: 'bg-gray-50 text-gray-500'
            };
            
            return statusStyles[status] || 'bg-gray-50 text-gray-500';
        };
        
        const renderStatusSummary = (counts) => {
            const totalStudents = studentList.data.length;
            
            return (
                <div className="flex flex-col space-y-1 min-w-[100px]">
                    {Object.entries(counts).map(([status, count]) => {
                        if (count === 0 || status === 'null') return null;
                        
                        const statusLabel = {
                            present: 'เข้าเรียน',
                            absent: 'ไม่เข้าเรียน',
                            late: 'มาสาย',
                            activity: 'เข้าร่วมกิจกรรม',
                            leave: 'ลา'
                        }[status];
                        
                        const percentage = Math.round((count / totalStudents) * 100);
                        
                        return (
                            <div 
                                key={status} 
                                className={`text-xs px-2 py-1 rounded-md flex justify-between items-center ${getStatusSummaryStyle(status)}`}
                            >
                                <span>{statusLabel}</span>
                                <span className="font-medium">{count} ({percentage}%)</span>
                            </div>
                        );
                    })}
                </div>
            );
        };
        
        return (
            <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td colSpan={3} className="px-4 py-3 font-medium text-gray-700">
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
                <div className="flex justify-end items-center gap-3">
                    {exportPdf}
                    {exportExcel}
                </div>
                
                <div ref={(element) => (ref.current[index] = element)} className="overflow-x-auto">
                    <table className="w-full text-sm text-left border border-line rounded-lg overflow-hidden">
                        <thead>
                            <TableHeader month={month} />
                        </thead>
                        <tbody className="divide-y divide-gray-200">
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
            const response = await axios.get(`${HOSTNAME}/a/classroom/${location.state?.classroomId}`);
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

    // Initialize tab states
    const makeValueIsOpen = () => {
        // Start with all tabs closed
        const arrayState = new Array(studentList?.month?.length || 0).fill(false);
        // If only one month, open it by default
        if (arrayState.length === 1) arrayState[0] = true;
        setIsTabOpen(arrayState);
    };

    // Handle Excel export
    const handleExportExcel = (index, month) => {
        const fileName = `สรุปการเข้าเรียนวิชา${subject.subNameThai}_ม.${classroomInfo.classLevel}/${classroomInfo.classRoom}_เดือน${convertNumberToThaiMonth(month)}`;
        if (ref.current[index]) {
            AttendanceSummaryByDay(ref.current[index], fileName);
        }
    };

    const navigateToPDF = (subject,classroomInfo, month) => {
        navigate('/attendances/details/bysubject/pdf', {state: { subject, classroomInfo, month, studentList}});
    }

    // Handle PDF export
    // const handleExportPdf = (index, month) => {
    //     const tableElement = ref.current[index];
    //     if (tableElement != null) {
    //         const tableJson = tabletojson.convert(tableElement.outerHTML);
    //         return (
    //             <BySubject 
    //                 subject={subject} 
    //                 classroomInfo={classroomInfo} 
    //                 month={convertNumberToThaiMonth(month)} 
    //                 tableJson={tableJson}
    //             />
    //         );
    //     }
    //     return null;
    // };

    // Export PDF button component
    // const ExportPdfButtonComponent = ({ index, month }) => {
    //     const pdfComponent = handleExportPdf(index, month);
        
    //     if (!pdfComponent) {
    //         return (
    //             <button 
    //                 disabled 
    //                 className="px-3 py-1.5 text-sm bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed inline-flex items-center"
    //             >
    //                 <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    //                 </svg>
    //                 กำลังโหลด...
    //             </button>
    //         );
    //     }
        
    //     return (
    //         <ExportPdfButton 
    //             PDFComponent={pdfComponent} 
    //             fileName={`สรุปการเข้าเรียนวิชา_${subject.subNameThai}_เดือน_${convertNumberToThaiMonth(month)}_ชั้นมัธยม${classroomInfo.classLevel}_ห้อง${classroomInfo.classRoom}`}
    //         />
    //     );
    // };

    // Navigate to exam eligibility summary page
    const handleNavigateToExamEligibility = () => {
        navigate('/attendances/abstract/subject', {
            state: {
                classroomInfo: classroomInfo,
                subject: subject,
                studentList: studentList.data
            }
        });
    };

    // Summary button component
    const ExamEligibilityButton = () => {
        return (
            <button 
                onClick={handleNavigateToExamEligibility}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                แบบสรุปการมีสิทธิ์สอบตามรายวิชา
            </button>
        );
    };

    useEffect(() => {
        if (location.state?.classroomId) {
            fetchClassroomInfo();
        }
        
        if (studentList) {
            makeValueIsOpen();
        }
    }, [studentList, location.state]);

    if (!studentList || !studentList.data) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="bg-white rounded-lg px-4 py-3 border border-line shadow-sm">
                    <div className="text-text-color-alt font-body text-sm">จำนวนเดือนที่มีข้อมูล:</div>
                    <div className="font-medium text-primary text-lg font-heading">{studentList.month.length} เดือน</div>
                </div>
                
                <ExamEligibilityButton />
            </div>
            
            <div className="space-y-4">
                {classroomInfo != null && studentList.month.map((month, index) => (
                    <div key={index}>
                        <TapAttendenceSummaryOpen 
                            title={`เดือน${convertNumberToThaiMonth(month)}`} 
                            index={index} 
                            isTabOpen={isTabOpen} 
                            handleIsTabOpen={handleIsTabOpen}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                        >
                            <Table 
                                month={month} 
                                index={index} 
                                exportPdf={<ExportPdfButton onClikFunction={() => navigateToPDF(subject,classroomInfo,month, index)}/>}
                                exportExcel={<ExportExcelButton handelOnClickFunction={() => handleExportExcel(index, month)} />}
                            />
                        </TapAttendenceSummaryOpen>
                    </div>
                ))}
                
                {studentList.month.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6 text-center border border-line">
                        <div className="flex justify-center mb-4 text-text-color-alt">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-text-color mb-1">ไม่พบข้อมูลรายเดือน</h3>
                        <p className="text-text-color-alt">ยังไม่มีข้อมูลการเข้าเรียนในรายวิชานี้</p>
                    </div>
                )}
            </div>
            
            <div className="flex justify-center mt-6">
                <Link 
                    to="/attendances" 
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้าการเข้าเรียน
                </Link>
            </div>
        </div>
    );
};

AttendenceBySubjectDetailList.propTypes = {
    studentList: PropTypes.object.isRequired
};
