import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { AttendanceSummaryByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";

export const AttendanceBySubjectCanExam = () => {
    const location = useLocation();
    const { subject, classroomInfo } = location.state || {};
    const [studentList, setStudentList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const ref = useRef();

    // Summary stats
    const [summaryStats, setSummaryStats] = useState({
        total: 0,
        canExam: 0,
        cannotExam: 0,
        percentCanExam: 0,
        percentCannotExam: 0
    });

    const abstractCanExam = async () => {
        if (!subject?.subId || !classroomInfo?.classId) {
            setError("ข้อมูลไม่ครบถ้วน กรุณาเลือกห้องเรียนและรายวิชาอีกครั้ง");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.get(
                `${HOSTNAME}/a/atttendence/abstract/${classroomInfo.classId}/${subject.subId}`
            );
            const data = response.data || [];
            setStudentList(data);
            // console.log(data);

            if (data.length > 0) {
                const cannotExamCount = data.filter(student => student.canExam === "ไม่มีสิทธิ์สอบ").length;
                const canExamCount = data.length - cannotExamCount;
                
                setSummaryStats({
                    total: data.length,
                    canExam: canExamCount,
                    cannotExam: cannotExamCount,
                    percentCanExam: Math.round((canExamCount / data.length) * 100),
                    percentCannotExam: Math.round((cannotExamCount / data.length) * 100)
                });
            }
            
            setError(null);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลสรุปการมีสิทธิ์สอบได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        abstractCanExam();
    }, []);

    const navigateToPDFpage = () => {
        navigate("/attendances/details/bysubject/iscanexam/pdfpage", {
            state: { classroomInfo, studentList, subject }
        });
    }

    const handleExportExcel = () => {
        if (ref.current) {
            const fileName = `สรุปการมีสิทธ์สอบวิชา_${subject.subNameThai}_ชั้นม.${classroomInfo.classLevel}/${classroomInfo.classRoom}`;
            AttendanceSummaryByDay(ref.current, fileName);
        }
    };

    // Create a summary component
    const ExamEligibilitySummary = () => {
        if (studentList.length === 0) return null;
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-sm text-blue-700 font-medium">นักเรียนทั้งหมด</h4>
                            <p className="text-2xl font-bold text-blue-800 mt-1">{summaryStats.total} คน</p>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-sm text-green-700 font-medium">มีสิทธิ์สอบ</h4>
                            <div className="flex items-baseline mt-1">
                                <p className="text-2xl font-bold text-green-800">{summaryStats.canExam} คน</p>
                                <p className="text-sm ml-2 text-green-700">({summaryStats.percentCanExam}%)</p>
                            </div>
                        </div>
                        <div className="bg-green-100 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-sm text-red-700 font-medium">ไม่มีสิทธิ์สอบ (มส)</h4>
                            <div className="flex items-baseline mt-1">
                                <p className="text-2xl font-bold text-red-800">{summaryStats.cannotExam} คน</p>
                                <p className="text-sm ml-2 text-red-700">({summaryStats.percentCannotExam}%)</p>
                            </div>
                        </div>
                        <div className="bg-red-100 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!subject || !classroomInfo) {
        return (
            <div className="min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ข้อมูลไม่ครบถ้วน</h2>
                    <p className="text-text-color-alt font-body mb-6">กรุณาเลือกห้องเรียนและรายวิชาเพื่อดูรายละเอียดการมีสิทธิ์สอบ</p>
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
    }

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">แบบสรุปการมีสิทธิ์สอบ</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-text-color font-heading">
                            {subject.subNameThai}
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {subject.subCode}
                            </span>
                        </h2>
                        <p className="text-sm text-text-color-alt font-body mt-1">
                            {subject.subNameEng}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                ม.{classroomInfo.classLevel}/{classroomInfo.classRoom}
                            </span>
                            <span className="text-sm text-text-color-alt">
                                ปีการศึกษา {classroomInfo.term?.academicYear + 543} เทอม {classroomInfo.term?.semester}
                            </span>
                        </div>
                    </div>
                </div>
                
                <Link 
                    to="/attendances"
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ย้อนกลับ
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-text-color font-heading flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            สรุปการมีสิทธิ์สอบ
                        </h3>
                        
                        {studentList.length > 0 && (
                            <div className="flex gap-3">
                                <ExportPdfButton onClikFunction={navigateToPDFpage}/>
                                {/* <ExportPdfButtonComponent /> */}
                                <ExportExcelButton handelOnClickFunction={handleExportExcel} />
                            </div>
                        )}
                    </div>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>{error}</div>
                            </div>
                        </div>
                    ) : studentList.length === 0 ? (
                        <div className="bg-white rounded-lg border border-line p-8 text-center">
                            <div className="flex justify-center mb-4 text-text-color-alt">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-text-color mb-1">ไม่พบข้อมูลสรุป</h3>
                            <p className="text-text-color-alt">ยังไม่มีข้อมูลการเข้าเรียนในรายวิชานี้</p>
                        </div>
                    ) : (
                        <>
                            {/* Add the summary component here */}
                            <ExamEligibilitySummary />
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm" ref={ref}>
                                    <thead className="text-xs text-text-color-alt uppercase tracking-wider bg-gray-50 border-y border-line">
                                        <tr>
                                            <th className="px-4 py-3.5 text-left">เลขที่</th>
                                            <th className="px-4 py-3.5 text-left">รหัสนักเรียน</th>
                                            <th className="px-4 py-3.5 text-left">ชื่อ-สกุล</th>
                                            <th className="px-4 py-3.5 text-center whitespace-nowrap">ขาดเรียน<br/>(ครั้ง)</th>
                                            <th className="px-4 py-3.5 text-center whitespace-nowrap">เข้าสาย<br/>(ครั้ง)</th>
                                            <th className="px-4 py-3.5 text-center whitespace-nowrap">ลา<br/>(ครั้ง)</th>
                                            <th className="px-4 py-3.5 text-center whitespace-nowrap">กิจกรรม<br/>(ครั้ง)</th>
                                            <th className="px-4 py-3.5 text-center whitespace-nowrap">เข้าเรียน<br/>(ครั้ง)</th>
                                            <th className="px-4 py-3.5 text-center whitespace-nowrap">ร้อยละ<br/>การเข้าเรียนรวมลา</th>
                                            <th className="px-4 py-3.5 text-center">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {studentList.map((student, index) => (
                                            <tr 
                                                key={index} 
                                                className={`hover:bg-gray-50 transition-colors duration-150 ${
                                                    student.canExam === "ไม่มีสิทธิ์สอบ" 
                                                        ? "bg-red-50" 
                                                        : "bg-white"
                                                }`}
                                            >
                                                <td className="px-4 py-3 font-medium text-text-color text-center">{student.stdNo}</td>
                                                <td className="px-4 py-3">{student.stdId}</td>
                                                <td className="px-4 py-3 font-medium text-text-color">{`${student.fName} ${student.lName}`}</td>
                                                <td className={`px-4 py-3 text-center ${student.attendenceAbsentCount > 0 ? 'text-red-600 font-medium' : ''}`}>
                                                    {student.attendenceAbsentCount}
                                                </td>
                                                <td className={`px-4 py-3 text-center ${student.attendenceLateCount > 0 ? 'text-orange-500 font-medium' : ''}`}>
                                                    {student.attendenceLateCount}
                                                </td>
                                                <td className={`px-4 py-3 text-center ${student.attendenceLeaveCount > 0 ? 'text-purple-600 font-medium' : ''}`}>
                                                    {student.attendenceLeaveCount}
                                                </td>
                                                <td className={`px-4 py-3 text-center ${student.attendenceActivity > 0 ? 'text-blue-600 font-medium' : ''}`}>
                                                    {student.attendenceActivity}
                                                </td>
                                                <td className={`px-4 py-3 text-center ${student.attendenceCount > 0 ? 'text-green-600 font-medium' : ''}`}>
                                                    {student.attendenceCount}
                                                </td>
                                                <td className={`px-4 py-3 text-center font-medium ${
                                                    student.attendencePercent < 80 
                                                        ? 'text-red-600' 
                                                        : student.attendencePercent >= 90
                                                            ? 'text-green-600'
                                                            : 'text-yellow-600'
                                                }`}>
                                                    {student.attendencePercent}%
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {student.canExam === "มส." ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            ไม่มีสิทธิ์สอบ
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            มีสิทธิ์สอบ
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="10" className="px-4 py-3 text-text-color-alt">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs">
                                                        รายงานนี้ไม่เป็นทางการ กรุณาตรวจสอบกับครูผู้สอนก่อนการประกาศอย่างเป็นทางการ
                                                    </span>
                                                    <span className="text-xs">
                                                        นักเรียนทั้งหมด: {studentList.length} คน
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {studentList.length > 0 && (
                <div className="mt-6 flex justify-end">
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
            )}
        </div>
    );
};
