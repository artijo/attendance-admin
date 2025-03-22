import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import ShowDetail from "../../components/teacher/teacherdetail";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success";

function TeacherDetail() {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const location = useLocation();
    const { state } = location;

    function fetchTeacher() {
        axios
            .get(HOSTNAME + "/a/teacher/" + id)
            .then((response) => {
                setTeacher(response.data);
            })
            .catch((error) => {
                console.error("Error fetching teacher", error);
            });
    }

    useEffect(() => {
        fetchTeacher();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายละเอียดคุณครู</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            {state && state.message && (
                <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
            )}
            
            <div className="flex justify-between items-center mb-6">
                {teacher && (
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-text-color font-heading">
                                {teacher.fName} {teacher.lName}
                            </h2>
                            <p className="text-sm text-text-color-alt font-body">รหัสครู: {teacher.tchCode}</p>
                        </div>
                    </div>
                )}
                
                <Link 
                    to={`/teachers/edit/${teacher?.tchId}`} 
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    แก้ไขข้อมูลครู
                </Link>
            </div>
            
            {teacher ? (
                <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                    <ShowDetail teacher={teacher} />
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            )}
            
            {teacher && (
                <div className="mt-6 flex justify-end">
                    <Link 
                        to="/teachers" 
                        className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับไปหน้ารายการครู
                    </Link>
                </div>
            )}
        </div>
    );
}

export default TeacherDetail;