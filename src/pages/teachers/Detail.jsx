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
        <div>
            <h1 className="font-bold text-center">รายละเอียดคุณครู</h1>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 justify-end">
                <Link 
                    to={`/teachers/edit/${teacher?.tchId}`} 
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    แก้ไขข้อมูลครู
                </Link>
            </div>
            {state && state.message && (
                <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
            )}
            {teacher ? (
                <div className="mt-5">
                    <ShowDetail teacher={teacher} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default TeacherDetail;