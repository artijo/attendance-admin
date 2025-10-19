import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HOSTNAME } from "../../config";
import AlertSuccess from "../../components/alert/success";
import { DateTime } from "luxon";

function SubjectRestore() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function fetchSoftDeletedSubjects() {
    setLoading(true);
    axios
      .get(HOSTNAME + "/a/subjects/softdeleted")
      .then((response) => {
        setSubjects(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching soft-deleted subjects", error);
        setSubjects([]);
        setLoading(false);
      });
  }

  function handleRestoreClick(subject) {
    setSelectedSubject(subject);
    setShowRestoreModal(true);
  }

  function restoreSubject() {
    if (!selectedSubject) return;

    setIsRestoring(true);
    axios
      .put(HOSTNAME + `/a/subject/restore/${selectedSubject.subId}`)
      .then((response) => {
        console.log("Subject restored", response);
        setSuccessMessage(
          `กู้คืนรายวิชา "${selectedSubject.subCode} - ${selectedSubject.subNameThai}" เรียบร้อยแล้ว`
        );
        setShowRestoreModal(false);
        setSelectedSubject(null);
        setIsRestoring(false);
        fetchSoftDeletedSubjects();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Error restoring subject", error);
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
    fetchSoftDeletedSubjects();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          กู้คืนรายวิชา
        </h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      {successMessage && (
        <AlertSuccess title="สำเร็จ" message={successMessage} />
      )}

      <div className="mb-4">
        <Link
          to="/subjects"
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
          กลับไปหน้ารายการวิชา
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : subjects.length === 0 ? (
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-gray-500 text-lg">ไม่มีรายวิชาที่ถูกลบ</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสวิชา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อวิชา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    กลุ่มสาระ
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
                {subjects.map((subject) => (
                  <tr
                    key={subject.subId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-color">
                      {subject.subCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-color">
                      {subject.subNameThai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-color-alt">
                      {subject.subjectType?.subTypeNameThai || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-color-alt">
                      {formatDeletedDate(subject.deletedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRestoreClick(subject)}
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
      {showRestoreModal && selectedSubject && (
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
              ยืนยันการกู้คืนรายวิชา
            </h3>
            <p className="text-sm text-center text-text-color-alt mb-6">
              คุณต้องการกู้คืนรายวิชา "{selectedSubject.subCode} -{" "}
              {selectedSubject.subNameThai}" หรือไม่
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedSubject(null);
                }}
                disabled={isRestoring}
                className="px-4 py-2.5 text-sm font-medium text-text-color bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={restoreSubject}
                disabled={isRestoring}
                className="px-4 py-2.5 text-sm font-medium text-white bg-secondary hover:bg-secondary/90 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRestoring ? "กำลังกู้คืน..." : "กู้คืนรายวิชา"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectRestore;
