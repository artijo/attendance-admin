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
    <div>
      <h1 className="text-center font-bold">รายละเอียดห้องเรียน</h1>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 justify-end">
        <Link 
            to={`/classroom/edit/${classroom?.classId}`}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            แก้ไขข้อมูลห้องเรียน
        </Link>
      </div>
        {state && state.message && (
            <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
        )}
        {classroom ? (
            <div className="mt-5">
            <ShowDetail classroom={classroom} />
        </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>
   
  );
}

export default ClassroomDetail;