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
      <h1 className="font-bold text-center">รายละเอียดนักเรียน</h1>
      {state && state.message && (
        <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
      )}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 justify-end">
        <Link 
          to={`/students/edit/${student?.stdId}`} 
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          แก้ไขข้อมูลนักเรียน
        </Link>
      </div>
      {student ? (
        <div className="mt-5 bg-white shadow sm:rounded-2xl">
          <ShowDetail student={student} />
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-gray-800"></div>
          <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      )}
    </div>
  );
}

export default StudentDetail;