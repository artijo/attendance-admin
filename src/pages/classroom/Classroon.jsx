import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import ClassroomList from "../../components/classroom/classroomlist";
function Classroon() {
    const [classrooms, setClassrooms] = useState(null);
    function fetchClassrooms() {
        axios
            .get(HOSTNAME + "/a/classrooms")
            .then((response) => {
                setClassrooms(response.data);
            })
            .catch((error) => {
                console.error("Error fetching classrooms", error);
            });
    }
    useEffect(() => {
        fetchClassrooms();
    }, []);
  return (
    <div>
      <h1>ห้องเรียน</h1>
        <Link to={'create'} type="button" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">เพิ่มห้องเรียน</Link>
        {classrooms ? (
            <div className="mt-5">
                <ClassroomList classrooms={classrooms} />
            </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>
  );
}

export default Classroon;