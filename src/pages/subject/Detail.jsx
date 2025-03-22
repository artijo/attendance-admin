import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import ShowDetail from "../../components/subject/subjectdetail";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success";

function SubjectDetail() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const location = useLocation();
  const { state } = location;

  function fetchSubject() {
    axios
      .get(HOSTNAME + "/a/subject/" + subjectId)
      .then((response) => {
        setSubject(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subject:", error);
      });
  }

  useEffect(() => {
    fetchSubject();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายละเอียดวิชา</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>
      
      {state && state.message && (
        <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
      )}

      <div className="flex justify-between items-center mb-6">
        {subject && (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-color font-heading">
                {subject.subCode} - {subject.subNameThai}
              </h2>
              <p className="text-sm text-text-color-alt font-body">{subject.subNameEng}</p>
            </div>
          </div>
        )}

        <Link
          to={`/subjects/edit/${subject?.subId}`}
          className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          แก้ไขข้อมูลวิชา
        </Link>
      </div>
      
      {subject ? (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <ShowDetail subject={subject} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {subject && (
        <div className="mt-6 flex justify-end">
          <Link 
            to="/subjects" 
            className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับไปหน้ารายการวิชา
          </Link>
        </div>
      )}
    </div>
  );
}

export default SubjectDetail;
