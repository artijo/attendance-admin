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
                const cannotExamCount = data.filter(student => student.canExam === "มส.").length;
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
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-blue-700">นักเรียนทั้งหมด</h4>
                            <p className="mt-1 text-2xl font-bold text-blue-800">{summaryStats.total} คน</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 border border-green-100 rounded-lg bg-green-50">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-green-700">มีสิทธิ์สอบ</h4>
                            <div className="flex items-baseline mt-1">
                                <p className="text-2xl font-bold text-green-800">{summaryStats.canExam} คน</p>
                                <p className="ml-2 text-sm text-green-700">({summaryStats.percentCanExam}%)</p>
                            </div>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 border border-red-100 rounded-lg bg-red-50">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-red-700">ไม่มีสิทธิ์สอบ (มส)</h4>
                            <div className="flex items-baseline mt-1">
                                <p className="text-2xl font-bold text-red-800">{summaryStats.cannotExam} คน</p>
                                <p className="ml-2 text-sm text-red-700">({summaryStats.percentCannotExam}%)</p>
                            </div>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="p-8 text-center bg-white border shadow-md rounded-xl border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-text-color font-heading">ข้อมูลไม่ครบถ้วน</h2>
                    <p className="mb-6 text-text-color-alt font-body">กรุณาเลือกห้องเรียนและรายวิชาเพื่อดูรายละเอียดการมีสิทธิ์สอบ</p>
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
                <h1 className="text-2xl font-bold md:text-3xl text-primary font-heading">แบบสรุปการมีสิทธิ์สอบ</h1>
                <div className="w-16 h-1 mt-2 rounded-full bg-secondary"></div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-start gap-3">
                    <div className="p-2 mt-1 rounded-full bg-primary/10 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <p className="mt-1 text-sm text-text-color-alt font-body">
                            {subject.subNameEng}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
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
                    to="/attendances/details/bysubject"
                    state={{subject: subject, classroomId: classroomInfo.classId}}
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ย้อนกลับ
                </Link>
            </div>

            <div className="overflow-hidden bg-white border shadow-md rounded-xl border-line">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="flex items-center text-lg font-medium text-text-color font-heading">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            สรุปการมีสิทธิ์สอบ
                        </h3>
                        
                        {studentList.length > 0 && (
                            <div className="flex gap-3">
                                <ExportExcelButton handelOnClickFunction={handleExportExcel} />
                                <ExportPdfButton onClikFunction={navigateToPDFpage}/>
                                {/* <ExportPdfButtonComponent /> */}
                                
                            </div>
                        )}
                    </div>
                    
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>{error}</div>
                            </div>
                        </div>
                    ) : studentList.length === 0 ? (
                        <div className="p-8 text-center bg-white border rounded-lg border-line">
                            <div className="flex justify-center mb-4 text-text-color-alt">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h3 className="mb-1 text-lg font-medium text-text-color">ไม่พบข้อมูลสรุป</h3>
                            <p className="text-text-color-alt">ยังไม่มีข้อมูลการเข้าเรียนในรายวิชานี้</p>
                        </div>
                    ) : (
                        <>
                            {/* Add the summary component here */}
                            <ExamEligibilitySummary />
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm" ref={ref}>
                                    <thead className="text-xs tracking-wider uppercase text-text-color-alt bg-gray-50 border-y border-line">
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
                                                <td className="px-4 py-3 font-medium text-center text-text-color">{student.stdNo}</td>
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
                                                <div className="flex items-center justify-between">
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
                <div className="flex justify-end mt-6">
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
