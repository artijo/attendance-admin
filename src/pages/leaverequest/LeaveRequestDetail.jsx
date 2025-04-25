import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { DateTime } from "luxon";

function LeaveRequestDetail() {
    const { id } = useParams();
    const [leaveRequest, setLeaveRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaveRequest = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${HOSTNAME}/a/leave-requests/${id}`);
                
                // Process the leave request data
                const processedRequest = {
                    ...response.data,
                    studingTime: response.data.studingTime.sort((a, b) => {
                        // Sort by time - convert string times to comparable values
                        const timeA = a.studingTime.timetable.timeStart;
                        const timeB = b.studingTime.timetable.timeStart;
                        return timeA.localeCompare(timeB);
                    })
                };
                
                setLeaveRequest(processedRequest);
            } catch (err) {
                console.error("Error fetching leave request:", err);
                setError("ไม่สามารถโหลดข้อมูลการลาได้ โปรดลองอีกครั้งในภายหลัง");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaveRequest();
    }, [id]);

    const formatThaiDate = (dateString) => {
        const dt = DateTime.fromISO(dateString);
        return dt.setLocale('th').toFormat('d MMMM yyyy');
    };

    const formatThaiDateTime = (dateString) => {
        if (!dateString) return "-";
        const dt = DateTime.fromISO(dateString);
        return dt.setLocale('th').toFormat('d MMMM yyyy HH:mm น.');
    };

    const formatTime = (timeString) => {
        if (!timeString) return "-";
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes} น.`;
    };

    const getDayOfWeekThai = (dayOfWeek) => {
        const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
        return days[dayOfWeek % 7];
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "APPROVED":
                return "อนุมัติแล้ว";
            case "REJECTED":
                return "ไม่อนุมัติ";
            default:
                return "รอการอนุมัติ";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">กำลังโหลดข้อมูล</h2>
                    <p className="text-text-color-alt font-body">โปรดรอสักครู่...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">เกิดข้อผิดพลาด</h2>
                    <p className="text-text-color-alt font-body">{error}</p>
                    <div className="mt-6">
                        <Link
                            to="/leavereq"
                            className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            กลับไปหน้ารายการลา
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!leaveRequest) {
        return (
            <div className="min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูล</h2>
                    <p className="text-text-color-alt font-body">ไม่พบข้อมูลการลาที่ต้องการหรือข้อมูลถูกลบไปแล้ว</p>
                    <div className="mt-6">
                        <Link
                            to="/leavereq"
                            className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            กลับไปหน้ารายการลา
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Get classroom info from first study time entry
    const classroom = leaveRequest.studingTime[0]?.studingTime?.timetable?.classroom;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายละเอียดการลา</h1>
                    <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
                </div>
                
                <Link
                    to="/leavereq"
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้ารายการลา
                </Link>
            </div>

            {/* Main content - Student and General Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student Information */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-line">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 text-primary rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-text-color font-heading">ข้อมูลนักเรียน</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-col">
                            <span className="text-sm text-text-color-alt font-body">รหัสนักเรียน</span>
                            <span className="font-medium text-text-color">{leaveRequest.student.stdId}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-text-color-alt font-body">ชื่อ-นามสกุล</span>
                            <span className="font-medium text-text-color">{leaveRequest.student.fName} {leaveRequest.student.lName}</span>
                        </div>
                        {classroom && (
                            <div className="flex flex-col">
                                <span className="text-sm text-text-color-alt font-body">ระดับชั้น</span>
                                <span className="font-medium text-text-color">มัธยมศึกษาปีที่ {classroom.classLevel} ห้อง {classroom.classRoom}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Leave Details */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-line">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 text-primary rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-text-color font-heading">รายละเอียดการลา</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-col">
                            <span className="text-sm text-text-color-alt font-body">ประเภทการลา</span>
                            <span className="font-medium text-text-color">{leaveRequest.leaveRequestType?.leaveTypeName || "-"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-text-color-alt font-body">วันที่ลา</span>
                            <span className="font-medium text-text-color">{formatThaiDate(leaveRequest.leaveDate)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-text-color-alt font-body">เหตุผลการลา</span>
                            <span className="font-medium text-text-color whitespace-pre-wrap">{leaveRequest.leaveReason || "-"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-text-color-alt font-body">วันที่ยื่นคำร้อง</span>
                            <span className="font-medium text-text-color">{formatThaiDateTime(leaveRequest.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Leave File */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-line">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 text-primary rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-text-color font-heading">เอกสารแนบ</h2>
                    </div>
                    
                    {leaveRequest.LeaveFile ? (
                        <div className="space-y-3">
                            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="bg-gray-100 rounded-lg p-2 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-text-color truncate">{leaveRequest.LeaveFile.filename}</p>
                                    <p className="text-xs text-text-color-alt">อัพโหลดเมื่อ: {formatThaiDateTime(leaveRequest.createdAt)}</p>
                                </div>
                                <a
                                    href={`${HOSTNAME}/upload/${leaveRequest.LeaveFile.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 p-2 text-primary hover:text-accent"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-text-color-alt mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            <p className="text-text-color-alt">ไม่มีเอกสารแนบ</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Period Leave Details */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold text-text-color font-heading mb-4">รายละเอียดคาบที่ลา</h2>
                
                <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-text-color-alt uppercase tracking-wider bg-gray-50 border-b border-line">
                                <tr>
                                    <th className="px-6 py-3" width="60">ลำดับ</th>
                                    <th className="px-6 py-3">วิชา</th>
                                    <th className="px-6 py-3">ครูผู้สอน</th>
                                    <th className="px-6 py-3">เวลา</th>
                                    <th className="px-6 py-3">สถานะ</th>
                                    <th className="px-6 py-3">ผู้อนุมัติ</th>
                                    <th className="px-6 py-3">อนุมัติเมื่อ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequest.studingTime.map((studyTime, index) => {
                                    const subject = studyTime.studingTime.timetable.subject;
                                    const teacher = subject.teacher;
                                    
                                    return (
                                        <tr 
                                            key={studyTime.leaveRequestStudingTimeId}
                                            className="border-b border-line hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 font-medium text-text-color">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-text-color">{subject.subNameThai}</div>
                                                <div className="text-sm text-text-color-alt">{subject.subCode}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {teacher.fName} {teacher.lName}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>{formatTime(studyTime.studingTime.timetable.timeStart)} - {formatTime(studyTime.studingTime.timetable.timeEnd)}</div>
                                                <div className="text-sm text-text-color-alt">วัน{getDayOfWeekThai(studyTime.studingTime.timetable.dayOfWeek)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(studyTime.leaveStatus)}`}>
                                                    {getStatusText(studyTime.leaveStatus)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {studyTime.teacherApprove ? (
                                                    <div className="text-text-color">
                                                        {studyTime.teacherApprove.fName} {studyTime.teacherApprove.lName}
                                                    </div>
                                                ) : (
                                                    <span className="text-text-color-alt">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {studyTime.approverTimestamp ? (
                                                    formatThaiDateTime(studyTime.approverTimestamp)
                                                ) : (
                                                    <span className="text-text-color-alt">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Information Note */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                การอนุมัติรายการลาต้องทำโดยครูผู้สอนเท่านั้น ผู้ดูแลระบบไม่สามารถอนุมัติหรือปฏิเสธคำขอลาได้
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaveRequestDetail;