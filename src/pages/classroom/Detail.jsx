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
      <Link to={`/classroom/edit/${classroom?.classId}`} type="button" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">แก้ไขข้อมูลห้องเรียน</Link>
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