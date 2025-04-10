import axios from "axios";
import { useParams, Link, useLocation } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { useState, useEffect } from "react";
import ShowDetail from "../../components/classroom/classroomdetail";
import AlertSuccess from "../../components/alert/success";

function ClassroomDetail() {
    const { id } = useParams();
    const [classroom, setClassroom] = useState(null);
    const location = useLocation();
    const { state } = location;

    function fetchClassroom() {
        axios
            .get(HOSTNAME + "/a/classroom/" + id)
            .then((response) => {
                setClassroom(response.data);
            })
            .catch((error) => {
                console.error("Error fetching classroom", error);
            });
    }

    useEffect(() => {
        fetchClassroom();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายละเอียดห้องเรียน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>

            {state && state.message && (
                <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
            )}

            <div className="flex justify-between items-center mb-6">
                {classroom && (
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-text-color font-heading">
                                ม.{classroom.classLevel}/{classroom.classRoom}
                            </h2>
                            <p className="text-sm text-text-color-alt font-body">{classroom.classroomType.classTypeNameThai}</p>
                        </div>
                    </div>
                )}

                <Link 
                    to={`/classroom/edit/${classroom?.classId}`}
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    แก้ไขข้อมูลห้องเรียน
                </Link>
            </div>

            {classroom ? (
                <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                    <ShowDetail classroom={classroom} />
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            )}
            
            {classroom && (
                <div className="mt-6 flex justify-end">
                    <Link 
                        to="/classroom" 
                        className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับไปหน้ารายการห้องเรียน
                    </Link>
                </div>
            )}
        </div>
    );
}

export default ClassroomDetail;