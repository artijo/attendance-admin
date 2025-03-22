import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect, useState } from "react";
import { AttendenceBySummaryByClassroomList } from "../../components/attendence/attendenceSummaryByClassroomList";

function AttendenceByClassroomDeatail() {
    const location = useLocation();
    const classroomId = location.state?.classroomId;
    const studentList = location.state?.studentList;
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClassroomInfo = async () => {
        if (!classroomId) return;
        
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/classroom/${classroomId}`);
            setClassroomInfo(response.data);
            setError(null);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลห้องเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClassroomInfo();
    }, [classroomId]);

    if (!classroomId || !studentList) {
        return (
            <div className="min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ข้อมูลไม่ครบถ้วน</h2>
                    <p className="text-text-color-alt font-body mb-6">กรุณาเลือกห้องเรียนเพื่อดูรายละเอียดการเข้าเรียน</p>
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
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">สรุปการเข้าเรียนตามห้อง</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                {isLoading ? (
                    <div className="flex-1 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ) : error ? (
                    <div className="flex-1">
                        <p className="text-red-500 font-medium font-body">{error}</p>
                    </div>
                ) : classroomInfo ? (
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary rounded-full p-2 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-text-color font-heading">
                                ม.{classroomInfo.classLevel}/{classroomInfo.classRoom}
                            </h2>
                            <p className="text-sm text-text-color-alt font-body mt-1">
                                {classroomInfo.classroomType?.classTypeNameThai} 
                                <span className="mx-1">•</span>
                                ปีการศึกษา {classroomInfo.term?.academicYear + 543} เทอม {classroomInfo.term?.semester}
                            </p>
                        </div>
                    </div>
                ) : null}

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

            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                    <h3 className="font-medium text-lg text-text-color font-heading flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        สรุปการเข้าเรียนของนักเรียน
                    </h3>
                    
                    <div className="bg-gray-50 border border-line rounded-lg px-3 py-1.5">
                        <span className="text-sm text-text-color-alt font-body">จำนวนนักเรียน:</span>
                        <span className="ml-1 font-medium text-primary">{studentList.length} คน</span>
                    </div>
                </div>
                
                <div className="p-6">
                    <AttendenceBySummaryByClassroomList 
                        studentList={studentList} 
                        classroomId={classroomId}
                    />
                </div>
            </div>
        </div>
    );
}

export default AttendenceByClassroomDeatail;