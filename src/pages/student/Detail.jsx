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
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายละเอียดนักเรียน</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>
      
      {state && state.message && (
        <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
      )}
      
      <div className="flex justify-between items-center mb-6">
        {student && (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-color font-heading">
                {student.fName} {student.lName}
              </h2>
              <p className="text-sm text-text-color-alt font-body">รหัสนักเรียน: {student.stdId}</p>
            </div>
          </div>
        )}
        
        <Link 
          to={`/students/edit/${student?.stdId}`} 
          className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          แก้ไขข้อมูลนักเรียน
        </Link>
      </div>
      
      {student ? (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <ShowDetail student={student} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      
      {student && (
        <div className="mt-6 flex justify-end">
          <Link 
            to="/students" 
            className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับไปหน้ารายการนักเรียน
          </Link>
        </div>
      )}
    </div>
  );
}

export default StudentDetail;