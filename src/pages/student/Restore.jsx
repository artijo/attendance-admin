import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HOSTNAME } from "../../config";
import AlertSuccess from "../../components/alert/success";
import { DateTime } from "luxon";

function StudentRestore() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function fetchSoftDeletedStudents() {
    setLoading(true);
    axios
      .get(HOSTNAME + "/a/students/softdeleted")
      .then((response) => {
        setStudents(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching soft-deleted students", error);
        setStudents([]);
        setLoading(false);
      });
  }

  function handleRestoreClick(student) {
    setSelectedStudent(student);
    setShowRestoreModal(true);
  }

  function restoreStudent() {
    if (!selectedStudent) return;

    setIsRestoring(true);
    axios
      .put(HOSTNAME + `/a/student/restore/${selectedStudent.stdId}`)
      .then((response) => {
        console.log("Student restored", response);
        setSuccessMessage(
          `กู้คืนนักเรียน "${selectedStudent.fName} ${selectedStudent.lName}" เรียบร้อยแล้ว`
        );
        setShowRestoreModal(false);
        setSelectedStudent(null);
        setIsRestoring(false);
        fetchSoftDeletedStudents();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Error restoring student", error);
        setIsRestoring(false);
      });
  }

  const formatDeletedDate = (dateString) => {
    if (!dateString) return "";
    return DateTime.fromISO(dateString)
      .setLocale("th")
      .toFormat("d MMMM yyyy HH:mm");
  };

  useEffect(() => {
    fetchSoftDeletedStudents();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          กู้คืนนักเรียน
        </h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      {successMessage && (
        <AlertSuccess title="สำเร็จ" message={successMessage} />
      )}

      <div className="mb-4">
        <Link
          to="/students"
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
          กลับไปหน้ารายการนักเรียน
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-line p-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-gray-500 text-lg">ไม่มีนักเรียนที่ถูกลบ</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสนักเรียน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลบเมื่อ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr
                    key={student.stdId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-color">
                      {student.stdId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-color">
                      {student.fName} {student.lName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-color-alt">
                      {formatDeletedDate(student.deletedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRestoreClick(student)}
                        className="inline-flex justify-center items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 8h6m-5 0a3 3 0 110 6H9m0 0l3 3m-3-3l-3-3m15-1a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        กู้คืน
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-secondary/10 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 8h6m-5 0a3 3 0 110 6H9m0 0l3 3m-3-3l-3-3m15-1a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-center text-text-color mb-2">
              ยืนยันการกู้คืนนักเรียน
            </h3>
            <p className="text-sm text-center text-text-color-alt mb-6">
              คุณต้องการกู้คืนนักเรียน "{selectedStudent.fName}{" "}
              {selectedStudent.lName}" หรือไม่
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedStudent(null);
                }}
                disabled={isRestoring}
                className="px-4 py-2.5 text-sm font-medium text-text-color bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={restoreStudent}
                disabled={isRestoring}
                className="px-4 py-2.5 text-sm font-medium text-white bg-secondary hover:bg-secondary/90 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRestoring ? "กำลังกู้คืน..." : "กู้คืนนักเรียน"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentRestore;
