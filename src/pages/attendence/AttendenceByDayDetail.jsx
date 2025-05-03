import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME, TIME_ZONE } from "../../config";
import { useEffect, useState } from "react";
import { AttendanceByDayDetailList } from "../../components/attendence/attendenceByDayDetailList";
import { formatDateToThai, formatDayOfWeeks } from "../../helper";
import { DateTime } from "luxon";

function AttendenceByDayDetail() {
    const location = useLocation();
    const [studentList, setStudentList] = useState([]);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const classroomId = location.state?.classroomId;
    const date = location.state?.date;
    const formattedDate = date ? formatDateToThai(date) : "";
    const dayOfWeek = date ? 
        formatDayOfWeeks(DateTime.fromISO(`${date}T17:00:00`).setZone(TIME_ZONE).weekday) : "";
    
    const fetchClassroomInfo = async () => {
        if (!classroomId) return;
        
        try {
            const response = await axios.get(`${HOSTNAME}/a/classroom/${classroomId}`);
            setClassroomInfo(response.data);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลห้องเรียนได้");
        }
    };
    
    const fetchData = async () => {
        if (!date || !classroomId) {
            setIsLoading(false);
            setError("ข้อมูลไม่ครบถ้วน กรุณาเลือกวันและห้องเรียนอีกครั้ง");
            return;
        }
        
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/attendence/byDate/${date}/${classroomId}`);
            setStudentList(response.data);
            setError(null);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลการเข้าเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchClassroomInfo();
    }, [date, classroomId]);

    if (!date || !classroomId) {
        return (
            <div className="min-h-screen">
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ข้อมูลไม่ครบถ้วน</h2>
                    <p className="text-text-color-alt font-body mb-6">กรุณาเลือกวันและห้องเรียนเพื่อดูข้อมูลการเข้าเรียน</p>
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
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายละเอียดการเข้าเรียนตามวัน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                {classroomInfo ? (
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary rounded-full p-2 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <h2 className="text-lg font-medium text-text-color font-heading">
                                    วัน{dayOfWeek} ที่ {formattedDate}
                                </h2>
                                
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                                    ["เสาร์", "อาทิตย์"].includes(dayOfWeek) 
                                        ? "bg-red-100 text-red-800" 
                                        : "bg-green-100 text-green-800"
                                }`}>
                                    {["เสาร์", "อาทิตย์"].includes(dayOfWeek) ? "วันหยุด" : "วันเรียน"}
                                </span>
                            </div>
                            
                            <p className="text-sm text-text-color-alt font-body mt-1">
                                ห้อง ม.{classroomInfo.classLevel}/{classroomInfo.classRoom} 
                                <span className="mx-1">•</span>
                                {classroomInfo.classroomType?.classTypeNameThai} 
                                <span className="mx-1">•</span>
                                ปีการศึกษา {classroomInfo.term?.academicYear + 543} เทอม {classroomInfo.term?.semester}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                )}
                
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
                <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-lg text-text-color font-heading flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            ตารางแสดงการเข้าเรียนตามคาบ
                        </h3>
                        
                        <div className="bg-gray-50 border border-line rounded-lg px-3 py-1.5">
                            <span className="text-sm text-text-color-alt font-body">จำนวนนักเรียน:</span>
                            <span className="ml-1 font-medium text-primary">{studentList.length} คน</span>
                        </div>
                    </div>
                    
                    {studentList && <AttendanceByDayDetailList studentList={studentList} date={date} />}
                </div>
            )}
        </div>
    );
}

export default AttendenceByDayDetail;