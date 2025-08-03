import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect, useState } from "react";
import { AttendenceBySubjectDetailList } from "../../components/attendence/attendenceBySubjectDetailList";

function AttendenceSubjectDetail() {
    const location = useLocation();
    const [studentList, setStudentList] = useState(null);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClassroomInfo = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/classroom/${location.state?.classroomId}`);
            setClassroomInfo(response.data);
            setError(null);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลห้องเรียนได้");
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/attendence/${location.state?.subject?.subId}/${location.state?.classroomId}`);
            console.log(response.data)
            const studentSortedByNumber = response.data.data.sort((a, b) => parseInt(a.stdNo) - parseInt(b.stdNo));
            // console.log(studentSortedByNumber);
            setStudentList({...response.data,data: studentSortedByNumber});
            setError(null);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลการเข้าเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (location.state?.classroomId && location.state?.subject?.subId) {
            fetchClassroomInfo();
            fetchData();
        } else {
            setError("ข้อมูลไม่ครบถ้วน กรุณาเลือกห้องเรียนและรายวิชาอีกครั้ง");
            setIsLoading(false);
        }
    }, [location.state]);

    if (!location.state?.subject || !location.state?.classroomId) {
        return (
            <div className="min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ข้อมูลไม่ครบถ้วน</h2>
                    <p className="text-text-color-alt font-body mb-6">กรุณาเลือกห้องเรียนและรายวิชาเพื่อดูรายละเอียดการเข้าเรียน</p>
                    <Link 
                        to="/attendances" 
                        className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับไปหน้ารายการ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายละเอียดการเข้าเรียนตามรายวิชา</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-1 items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex-1 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ) : error ? (
                        <div className="flex-1">
                            <p className="text-red-500 font-medium font-body">{error}</p>
                        </div>
                    ) : classroomInfo && location.state.subject ? (
                        <div className="flex-1">
                            <h2 className="text-lg font-medium text-text-color font-heading">
                                {location.state.subject.subNameThai}
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {location.state.subject.subCode}
                                </span>
                            </h2>
                            <p className="text-sm text-text-color-alt font-body mt-1">
                                {location.state.subject.subNameEng}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    ม.{classroomInfo.classLevel}/{classroomInfo.classRoom}
                                </span>
                                <span className="text-sm text-text-color-alt">
                                    ปีการศึกษา {classroomInfo.term.academicYear + 543} เทอม {classroomInfo.term.semester}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <p className="text-text-color-alt font-body">กำลังโหลดข้อมูล...</p>
                        </div>
                    )}
                </div>
                
                <Link 
                    to="/attendances/details/bysubject"
                    state={{ goBack: true }}
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ย้อนกลับ
                </Link>
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
            ) : (
                <div>
                    {studentList && studentList.data && studentList.data.length > 0 ? (
                        <AttendenceBySubjectDetailList studentList={studentList} />
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                            <div className="flex justify-center mb-4 text-text-color-alt">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลการเข้าเรียน</h2>
                            <p className="text-text-color-alt font-body">ยังไม่มีข้อมูลการเข้าเรียนสำหรับวิชานี้</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AttendenceSubjectDetail;