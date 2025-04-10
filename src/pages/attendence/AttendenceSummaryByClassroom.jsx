import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AttendenceSummaryByClassroom({ classroomId }) {
    const [studentList, setStudentList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/atttendence/byClassroom/${classroomId}`);
            setStudentList(response.data);
            setError(null);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลสรุปการเข้าเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (classroomId) {
            fetchData();
        }
    }, [classroomId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="py-3">
            {studentList && studentList.length > 0 ? (
                <Link 
                    to="/attendances/details/byclassroom" 
                    state={{ classroomId: classroomId, studentList: studentList }}
                    className="inline-flex items-center px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors duration-300 font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ดูรายละเอียดการเข้าเรียนทั้งหมด
                </Link>
            ) : (
                <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        ไม่พบข้อมูลการเข้าเรียนสำหรับห้องเรียนนี้
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttendenceSummaryByClassroom;