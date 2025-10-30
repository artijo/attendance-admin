import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import { AttendenceByDayList } from "../../components/attendence/attendenceByDayList";
import { AttendenceBySubjectList } from "../../components/attendence/attendenceBySubjectList";
import { TapAttendenceSummaryOpen } from "../../components/attendence/tapAttendenceSummaryOpen";
import Calendar from "../../components/attendence/Calendar";

function AttendanceDetail() {
    const navigate = useNavigate();
    const params = useParams();
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isTabOpen, setIsTabOpen] = useState(new Array(3).fill(false));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClassroomInfo = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${HOSTNAME}/a/classroom/${params.id}`);
            setClassroomInfo(response.data);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลห้องเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    const navigateDetailPage = (classroomId, date) => {
        // to="/attendances/details/byday"
        //                   state={{ classroomId: classroomId, date: date }}
        navigate("/attendances/details/byday", { state: { classroomId: classroomId, date: date } });
    };

    useEffect(() => {
        const arrayState = sessionStorage.getItem("savedIsTapOpenArray");
        if (arrayState != null) {
            const newArray = arrayState.split(",").map((string_boolean) => string_boolean === "true" ? true : false);
            setIsTabOpen(newArray);
        } else {
            setIsTabOpen(new Array(3).fill(false));
        }
    }, []);

    const handleIsTabOpen = (index) => {
        let newIsTabOpen = isTabOpen.slice();
        newIsTabOpen[index] = !newIsTabOpen[index];
        setIsTabOpen(newIsTabOpen);
        sessionStorage.setItem("savedIsTapOpenArray", [...newIsTabOpen]);
    };

    useEffect(() => {
        fetchClassroomInfo();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายละเอียดการเข้าเรียน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>{error}</div>
                    </div>
                </div>
            ) : classroomInfo ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-text-color font-heading">
                                    ม.{classroomInfo.classLevel}/{classroomInfo.classRoom}
                                </h2>
                                <p className="text-sm text-text-color-alt font-body">
                                    ปีการศึกษา {classroomInfo.term.academicYear + 543} เทอม {classroomInfo.term.semester}
                                </p>
                            </div>
                        </div>

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

                    <div className="space-y-4">
                        <TapAttendenceSummaryOpen
                            isTabOpen={isTabOpen}
                            title="การเข้าเรียนตามวัน"
                            handleIsTabOpen={handleIsTabOpen}
                            index={0}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                        >
                            {/* <AttendenceByDayList
                                termId={classroomInfo.term.termId}
                                classroomId={classroomInfo.classId}
                            /> */}
                            <Calendar classroom={classroomInfo} term={classroomInfo.term} navigateDetailPage={navigateDetailPage} />
                        </TapAttendenceSummaryOpen>

                        <TapAttendenceSummaryOpen
                            isTabOpen={isTabOpen}
                            title="การเข้าเรียนตามรายวิชา"
                            handleIsTabOpen={handleIsTabOpen}
                            index={1}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            }
                        >
                            <AttendenceBySubjectList
                                classroomId={classroomInfo.classId}
                            />
                        </TapAttendenceSummaryOpen>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลห้องเรียน</h2>
                    <p className="text-text-color-alt font-body">โปรดลองเลือกห้องเรียนอื่นหรือตรวจสอบการเชื่อมต่อ</p>
                </div>
            )}
        </div>
    );
}

export default AttendanceDetail;
