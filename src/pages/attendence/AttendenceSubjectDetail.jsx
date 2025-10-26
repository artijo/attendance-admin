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
    // console.log(location.state);
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
            // console.log(response.data)
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
                <div className="p-8 text-center bg-white border shadow-md rounded-xl border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-text-color font-heading">ข้อมูลไม่ครบถ้วน</h2>
                    <p className="mb-6 text-text-color-alt font-body">กรุณาเลือกห้องเรียนและรายวิชาเพื่อดูรายละเอียดการเข้าเรียน</p>
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
                <h1 className="text-2xl font-bold md:text-3xl text-primary font-heading">รายละเอียดการเข้าเรียนตามรายวิชา</h1>
                <div className="w-16 h-1 mt-2 rounded-full bg-secondary"></div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-start flex-1 gap-3">
                    <div className="p-2 mt-1 rounded-full bg-primary/10 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex-1 animate-pulse">
                            <div className="w-3/4 h-5 mb-2 bg-gray-200 rounded"></div>
                            <div className="w-1/2 h-4 mb-1 bg-gray-200 rounded"></div>
                            <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                        </div>
                    ) : error ? (
                        <div className="flex-1">
                            <p className="font-medium text-red-500 font-body">{error}</p>
                        </div>
                    ) : classroomInfo && location.state.subject ? (
                        <div className="flex-1">
                            <h2 className="text-lg font-medium text-text-color font-heading">
                                {location.state.subject.subNameThai}
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {location.state.subject.subCode}
                                </span>
                            </h2>
                            <p className="mt-1 text-sm text-text-color-alt font-body">
                                {location.state.subject.subNameEng}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
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
                    to={`/attendances/details/${location.state?.classroomId}`}
                    // state={{ goBack: true }}
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ย้อนกลับ
                </Link>
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
            ) : (
                <div>
                    {studentList && studentList.data && studentList.data.length > 0 ? (
                        <AttendenceBySubjectDetailList studentList={studentList} />
                    ) : (
                        <div className="p-8 text-center bg-white border shadow-md rounded-xl border-line">
                            <div className="flex justify-center mb-4 text-text-color-alt">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h2 className="mb-2 text-xl font-semibold text-text-color font-heading">ไม่พบข้อมูลการเข้าเรียน</h2>
                            <p className="text-text-color-alt font-body">ยังไม่มีข้อมูลการเข้าเรียนสำหรับวิชานี้</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AttendenceSubjectDetail;