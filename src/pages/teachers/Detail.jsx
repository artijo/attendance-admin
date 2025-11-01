import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import ShowDetail from "../../components/teacher/teacherdetail";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success";

function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  function deleteTeacher() {
    setIsDeleting(true);
    axios
      .delete(HOSTNAME + "/a/teacher/" + id)
      .then((response) => {
        console.log("Teacher deleted", response);
        setShowDeleteModal(false);
        navigate("/teachers", {
          state: { message: "ลบครูเรียบร้อยแล้ว" },
        });
      })
      .catch((error) => {
        console.error("Error deleting teacher", error);
        setIsDeleting(false);
      });
  }

  useEffect(() => {
    fetchTeacher();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl text-primary font-heading">
          รายละเอียดคุณครู
        </h1>
        <div className="w-16 h-1 mt-2 rounded-full bg-secondary"></div>
      </div>

      {state && state.message && (
        <div className="mb-6">
          <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        {teacher && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-color font-heading">
                {teacher.fName} {teacher.lName}
              </h2>
              <p className="text-sm text-text-color-alt font-body">
                กลุ่มสาระที่สังกัด:{" "}
                {teacher.department
                  ? teacher.department.deptName
                  : "ไม่มีกลุ่มสาระที่สังกัด"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link
            to={`/teachers/edit/${teacher?.tchId}`}
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            แก้ไขข้อมูลครู
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="py-2.5 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            ลบครู
          </button>
        </div>
      </div>

      {teacher ? (
        <div className="overflow-hidden bg-white border shadow-md rounded-xl border-line">
          <ShowDetail teacher={teacher} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
        </div>
      )}

      {teacher && (
        <div className="flex justify-end mt-6">
          <Link
            to="/teachers"
            className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            กลับไปหน้ารายการครู
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 0v2m0-2h2m-2 0h-2M9 5a3 3 0 006 0m-1 14a3 3 0 01-6 0m13-1a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-center text-text-color">
              ยืนยันการลบครู
            </h3>
            <p className="mb-6 text-sm text-center text-text-color-alt">
              คุณแน่ใจว่าต้องการลบครู "{teacher?.fName} {teacher?.lName}"
              หรือไม่
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-medium text-text-color bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={deleteTeacher}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "กำลังลบ..." : "ลบครู"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDetail;
