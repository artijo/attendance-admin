import { PropTypes } from "prop-types";
import { useEffect, useRef, useState } from "react";
import { AttendanceSummaryByDay, summaryAttendeanceByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { dateTimeFormat, formatDateToThai, formatDayOfWeeks } from "../../helper";
import ByDay from "./exportPdf/byday.jsx";
import { DateTime } from "luxon";

export const AttendanceByDayDetailList = ({ studentList }) => {
    const ref = useRef(null);
    const location = useLocation();
    const date = location.state?.date;
    const navigate = useNavigate();
    const [totalStatus, setTotalStatus] = useState(null);
    const [periodStatus, setPeriodStatus] = useState([]);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState({ excel: false, pdf: false });
    const [error, setError] = useState(null);

    const setupTotalStatus = () => {
        if (!studentList || !studentList.length) return;

        const updatedTotalStatus = {
            present: 0,
            late: 0,
            absent: 0,
            activity: 0,
            leave: 0
        };
        
        // Calculate per-period statistics
        const periodsCount = studentList[0].attendance.length;
        const periodStats = Array(periodsCount).fill().map(() => ({
            present: 0,
            late: 0,
            absent: 0,
            activity: 0,
            leave: 0
        }));
        
        studentList.forEach((student) => {
            student.attendance.forEach((attendance, periodIndex) => {
                if (attendance.attStatus !== null) {
                    const status = attendance.attStatus.toLowerCase();
                    if (updatedTotalStatus.hasOwnProperty(status)) {
                        updatedTotalStatus[status]++;
                        
                        // Update per-period statistics
                        if (periodStats[periodIndex].hasOwnProperty(status)) {
                            periodStats[periodIndex][status]++;
                        }
                    }
                }
            });
        });
        
        setTotalStatus(updatedTotalStatus);
        setPeriodStatus(periodStats);
    };

    const formatAttStatus = (status) => {
        const statusMap = {
            'present': 'เข้าเรียน',
            'absent': 'ไม่เข้าเรียน',
            'late': 'มาสาย',
            'activity': 'เข้าร่วมกิจกรรม',
            'leave': 'ลา'
        };
        
        return statusMap[status] || status;
    };

    const getAttStatusClassName = (status) => {
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

    const handleExportExcel = () => {
        if (ref.current) {
            setExportLoading(prev => ({ ...prev, excel: true }));
            
            try {
                const dateformat = DateTime.fromISO(`${date}T00:00:00`).setZone('Asia/Bangkok');
                const fileName = `สรุปการเข้าเรียนตามรายวันห้องม.${classroomInfo.classLevel}/${classroomInfo.classRoom} วัน${formatDayOfWeeks(dateformat.weekday)} วันที่${formatDateToThai(dateformat.toString())}`;
                summaryAttendeanceByDay(studentList, fileName, classroomInfo, dateformat);
            } catch (error) {
                console.error("Export Excel error:", error);
            } finally {
                setExportLoading(prev => ({ ...prev, excel: false }));
            }
        }
    };

    const fetchClassroomInfo = async () => {
        if (!location.state?.classroomId) return;
        
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/classroom/${location.state.classroomId}`);
            if (response.status === 200) {
                setClassroomInfo(response.data);
                setError(null);
            }
        } catch (error) {
            console.log(error);
            setError("ไม่สามารถโหลดข้อมูลห้องเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePdfComponent = () => {
        if (studentList.length > 0 && totalStatus && classroomInfo) {
            return <ByDay studentList={studentList} totalStatus={totalStatus} date={date} classroomInfo={classroomInfo} />;
        }
        return null;
    };

    const navigatePdfPage = () => {
        navigate("/attendances/details/byday/pdf", {state: { studentList, totalStatus, date, classroomInfo }});
    }
  
    useEffect(() => {
        fetchClassroomInfo();
    }, []);

    useEffect(() => {
        setupTotalStatus();
    }, [studentList]);

    if (studentList.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-line p-8 text-center">
                <div className="flex justify-center mb-4 text-text-color-alt">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-text-color mb-1">ไม่มีการเรียนในวันนี้</h3>
                <p className="text-text-color-alt">ไม่มีการเรียนในวันนี้หรือยังไม่สร้างปฏิทินการเรียน</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {studentList.length > 0 && totalStatus && classroomInfo && (
                <div className="flex justify-end items-center space-x-2 mb-4">
                     <ExportPdfButton
                        onClikFunction={navigatePdfPage} 
                    />
                    <ExportExcelButton 
                        handelOnClickFunction={handleExportExcel}
                        isLoading={exportLoading.excel} 
                    />
                </div>
            )}
            
            <div>
                <div className="overflow-x-auto">
                    <table 
                        ref={ref} 
                        className="w-full border-collapse text-sm bg-white rounded-lg overflow-hidden"
                    >
                        <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider border-r border-gray-200" colSpan={3}>คาบที่</th>
                                {studentList[0].attendance.map((attendance, index) => (
                                    <th 
                                        className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider border-r border-gray-200" 
                                        key={index}
                                    >
                                        {index + 1}
                                        <span className="block text-xs font-normal mt-1 text-gray-500">
                                            ({dateTimeFormat(attendance.studingTimeDate)})
                                        </span>
                                    </th>
                                ))}
                            </tr>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider border-r border-gray-200" colSpan={3}>รหัสวิชา</th>
                                {studentList[0].attendance.map((attendance, index) => (
                                    <th 
                                        className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider border-r border-gray-200" 
                                        key={index}
                                    >
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {attendance.subjectCode}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider border-r border-gray-200">เลขที่</th>
                                <th className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider border-r border-gray-200">รหัสนักเรียน</th>
                                <th className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider border-r border-gray-200">ชื่อ-นามสกุล</th>
                                {studentList[0].attendance.map((attendance, index) => (
                                    <th 
                                        className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider border-r border-gray-200" 
                                        key={index}
                                    >
                                        <div className="truncate max-w-[150px]">{attendance.subjectName}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {studentList.map((student, index) => (
                                <tr 
                                    key={index} 
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 border-r border-gray-200 font-medium text-text-color">{student.stdNo}</td>
                                    <td className="px-6 py-4 border-r border-gray-200 text-text-color">{student.stdId}</td>
                                    <td className="px-6 py-4 border-r border-gray-200 font-medium text-text-color">{`${student.fName} ${student.lName}`}</td>
                                    {student.attendance.map((attendance, idx) => (
                                        <td 
                                            key={idx} 
                                            className={`px-6 py-4 border-r border-gray-200 ${getAttStatusClassName(attendance.attStatus?.toLowerCase())}`}
                                        >
                                            {attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50">
                                <td className="px-6 py-3 border-r border-gray-200 font-medium text-text-color" colSpan={3}>มาเรียน</td>
                                {periodStatus.map((period, index) => (
                                    <td key={index} className="px-6 py-3 border-r border-gray-200 text-green-600 font-medium text-center">
                                        {period.present || 0} คน
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="px-6 py-3 border-r border-gray-200 font-medium text-text-color" colSpan={3}>มาสาย</td>
                                {periodStatus.map((period, index) => (
                                    <td key={index} className="px-6 py-3 border-r border-gray-200 text-orange-500 font-medium text-center">
                                        {period.late || 0} คน
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="px-6 py-3 border-r border-gray-200 font-medium text-text-color" colSpan={3}>ขาดเรียน</td>
                                {periodStatus.map((period, index) => (
                                    <td key={index} className="px-6 py-3 border-r border-gray-200 text-red-600 font-medium text-center">
                                        {period.absent || 0} คน
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="px-6 py-3 border-r border-gray-200 font-medium text-text-color" colSpan={3}>ลา</td>
                                {periodStatus.map((period, index) => (
                                    <td key={index} className="px-6 py-3 border-r border-gray-200 text-purple-600 font-medium text-center">
                                        {period.leave || 0} คน
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="px-6 py-3 border-r border-gray-200 font-medium text-text-color" colSpan={3}>กิจกรรม</td>
                                {periodStatus.map((period, index) => (
                                    <td key={index} className="px-6 py-3 border-r border-gray-200 text-blue-600 font-medium text-center">
                                        {period.activity || 0} คน
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div className="mt-6">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-text-color mb-3">คำอธิบายสถานะ:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                                <span className="text-sm">เข้าเรียน</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                                <span className="text-sm">ไม่เข้าเรียน</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                                <span className="text-sm">มาสาย</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                                <span className="text-sm">เข้าร่วมกิจกรรม</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
                                <span className="text-sm">ลา</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AttendanceByDayDetailList.propTypes = {
    studentList: PropTypes.array.isRequired
};
