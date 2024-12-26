import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import ShowDetail from "../../components/student/studentdetail";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success";
function StudentDetail() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const location = useLocation();
    const { state } = location;

    function fetchStudent() {
        axios
            .get(HOSTNAME + "/a/student/" + id)
            .then((response) => {
                setStudent(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching student", error);
            });
    }

    useEffect(() => {
        fetchStudent();
    }, []);

  return (
    <div>
      <h1>รายละเอียดนักเรียน</h1>
      <Link to={`/students/edit/${student?.stdId}`} type="button" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">แก้ไขข้อมูลนักเรียน</Link>
      {state && state.message && (
        <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
      )}
      {student ? (
        <div className="mt-5">
          <ShowDetail student={student} />
        </div>
      ):(
            <p>Loading...</p>
      )}
    </div>
  );
}

export default StudentDetail;