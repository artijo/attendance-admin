import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import Select from "react-select";
import { DateTime } from "luxon";

function LeaveRequest() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);

    // Fetch all data on component mount
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // In a real application, we'd fetch all data from API
                const leaveRequestsResponse = await axios.get(`${HOSTNAME}/a/leave-requests`);
                
                // Extract unique subjects and teachers from the data
                const uniqueSubjects = new Map();
                const uniqueTeachers = new Map();
                const uniqueLeaveTypes = new Map();
                
                // Process the leave requests data
                const processedRequests = leaveRequestsResponse.data.map(request => {
                    // Extract leave type info
                    const leaveType = request.leaveRequestType;
                    if (leaveType && !uniqueLeaveTypes.has(leaveType.leaveTypeId)) {
                        uniqueLeaveTypes.set(leaveType.leaveTypeId, {
                            id: leaveType.leaveTypeId,
                            name: leaveType.leaveTypeName
                        });
                    }
                    
                    // Create an overall status for the leave request based on studingTime status
                    const statusCounts = {
                        WAITING: 0,
                        APPROVED: 0,
                        REJECTED: 0
                    };
                    
                    // Process study times and extract subject/teacher info
                    request.studingTime.forEach(studyTime => {
                        // Count statuses
                        if (statusCounts.hasOwnProperty(studyTime.leaveStatus)) {
                            statusCounts[studyTime.leaveStatus]++;
                        }
                        
                        // Extract subject info
                        const subject = studyTime.studingTime.timetable.subject;
                        if (subject && !uniqueSubjects.has(subject.subId)) {
                            uniqueSubjects.set(subject.subId, {
                                id: subject.subId,
                                code: subject.subCode,
                                nameThai: subject.subNameThai,
                                nameEng: subject.subNameEng
                            });
                        }
                        
                        // Extract teacher info
                        const teacher = studyTime.studingTime.timetable.subject.teacher;
                        if (teacher && !uniqueTeachers.has(teacher.tchId)) {
                            uniqueTeachers.set(teacher.tchId, {
                                id: teacher.tchId,
                                code: teacher.tchId,
                                fName: teacher.fName,
                                lName: teacher.lName,
                                email: teacher.email
                            });
                        }
                    });
                    
                    // Determine overall status
                    let overallStatus = "WAITING";
                    if (statusCounts.REJECTED > 0) {
                        overallStatus = "REJECTED";
                    } else if (statusCounts.WAITING === 0 && statusCounts.APPROVED > 0) {
                        overallStatus = "APPROVED";
                    }
                    
                    // Return processed request
                    return {
                        ...request,
                        overallStatus
                    };
                });
                
                // Format subjects for dropdown
                const formattedSubjects = Array.from(uniqueSubjects.values()).map(subject => ({
                    value: subject.id,
                    label: `${subject.code} - ${subject.nameThai}`,
                    subject: subject
                }));
                setSubjects(formattedSubjects);

                // Format teachers for dropdown
                const formattedTeachers = Array.from(uniqueTeachers.values()).map(teacher => ({
                    value: teacher.id,
                    label: `${teacher.fName} ${teacher.lName}`,
                    teacher: teacher
                }));
                setTeachers(formattedTeachers);

                // Format leave types for dropdown
                const formattedLeaveTypes = Array.from(uniqueLeaveTypes.values()).map(type => ({
                    value: type.id,
                    label: type.name
                }));
                setLeaveTypes(formattedLeaveTypes);
                
                setLeaveRequests(processedRequests);
                setFilteredLeaveRequests(processedRequests);
                
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้งในภายหลัง");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Apply filters when filter selections change
    useEffect(() => {
        const applyFilters = () => {
            let filtered = [...leaveRequests];
            
            // Filter by subject
            if (selectedSubject) {
                filtered = filtered.filter(leave => 
                    leave.studingTime.some(study => 
                        study.studingTime.timetable.subject.subId === selectedSubject.value
                    )
                );
            }
            
            // Filter by teacher
            if (selectedTeacher) {
                filtered = filtered.filter(leave => 
                    leave.studingTime.some(study => 
                        study.studingTime.timetable.subject.teacher.tchId === selectedTeacher.value
                    )
                );
            }

            // Filter by leave type
            if (selectedLeaveType) {
                filtered = filtered.filter(leave => 
                    leave.leaveRequestType?.leaveTypeId === selectedLeaveType.value
                );
            }
            
            setFilteredLeaveRequests(filtered);
        };
        
        applyFilters();
    }, [leaveRequests, selectedSubject, selectedTeacher, selectedLeaveType]);

    // Format date to Thai format
    const formatThaiDate = (dateString) => {
        const dt = DateTime.fromISO(dateString);
        return dt.setLocale('th').toFormat('d MMMM yyyy');
    };

    // Get status badge class based on status
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

    // Get status text in Thai
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

    // Clear all filters
    const clearFilters = () => {
        setSelectedSubject(null);
        setSelectedTeacher(null);
        setSelectedLeaveType(null);
        setFilteredLeaveRequests(leaveRequests);
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายการลาทั้งหมด</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-line">
                <h2 className="text-lg font-semibold text-text-color font-heading mb-4">ตัวกรองข้อมูล</h2>
                
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Subject filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            รายวิชา
                        </label>
                        <Select
                            options={subjects}
                            value={selectedSubject}
                            onChange={setSelectedSubject}
                            placeholder="เลือกรายวิชา"
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    {/* Teacher filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            ครูผู้สอน
                        </label>
                        <Select
                            options={teachers}
                            value={selectedTeacher}
                            onChange={setSelectedTeacher}
                            placeholder="เลือกครูผู้สอน"
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    {/* Leave Type filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            ประเภทการลา
                        </label>
                        <Select
                            options={leaveTypes}
                            value={selectedLeaveType}
                            onChange={setSelectedLeaveType}
                            placeholder="เลือกประเภทการลา"
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>
                
                {/* Clear filters button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        ล้างตัวกรอง
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line mb-6">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">เกิดข้อผิดพลาด</h2>
                    <p className="text-text-color-alt font-body">{error}</p>
                </div>
            )}

            {/* Loading state */}
            {isLoading ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">กำลังโหลดข้อมูล</h2>
                    <p className="text-text-color-alt font-body">โปรดรอสักครู่...</p>
                </div>
            ) : (
                /* Results */
                <div>
                    {/* Results count */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="inline-flex items-center px-2.5 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-text-color">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            พบการลาทั้งหมด: {filteredLeaveRequests.length} รายการ
                        </div>
                    </div>

                    {filteredLeaveRequests.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                            <div className="flex justify-center mb-4 text-text-color-alt">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลการลา</h2>
                            <p className="text-text-color-alt font-body">ไม่พบข้อมูลการลาตามเงื่อนไขที่กำหนด</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-text-color-alt uppercase tracking-wider bg-gray-50 border-b border-line">
                                        <tr>
                                            <th className="px-6 py-3" width="60">ลำดับ</th>
                                            <th className="px-6 py-3">รหัสนักเรียน</th>
                                            <th className="px-6 py-3">ชื่อ-นามสกุล</th>
                                            <th className="px-6 py-3">ชั้นเรียน</th>
                                            <th className="px-6 py-3">ประเภทการลา</th>
                                            <th className="px-6 py-3">วันที่ลา</th>
                                            <th className="px-6 py-3">จำนวนคาบ</th>
                                            <th className="px-6 py-3">สถานะ</th>
                                            <th className="px-6 py-3 text-right">รายละเอียด</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeaveRequests.map((leave, index) => {
                                            // Get classroom info from first study time entry
                                            const classroom = leave.studingTime[0]?.studingTime?.timetable?.classroom;
                                            
                                            return (
                                                <tr 
                                                    key={leave.leaveId}
                                                    className="border-b border-line hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 font-medium text-text-color">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-text-color">
                                                        {leave.student.stdId}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {leave.student.fName} {leave.student.lName}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {classroom ? `ม.${classroom.classLevel}/${classroom.classRoom}` : "-"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {leave.leaveRequestType?.leaveTypeName || "-"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {formatThaiDate(leave.leaveDate)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {leave.studingTime.length} คาบ
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(leave.overallStatus)}`}>
                                                            {getStatusText(leave.overallStatus)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link
                                                            to={`/leavereq/${leave.leaveId}`}
                                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors duration-300"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            ดูรายละเอียด
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default LeaveRequest;