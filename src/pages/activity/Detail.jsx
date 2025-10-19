import axios from "axios";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { useState, useEffect } from "react";
import ShowDetail from "../../components/activity/activityDetail";
import AlertSuccess from "../../components/alert/success";
import { DateTime } from "luxon";

function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const { state } = location;

  function fetchActivity() {
    axios
      .get(HOSTNAME + "/a/activity/" + id)
      .then((response) => {
        setActivity(response.data);
      })
      .catch((error) => {
        console.error("Error fetching activity", error);
      });
  }
  function deleteActivity() {
    setIsDeleting(true);
    axios
      .delete(HOSTNAME + "/a/activity/" + id)
      .then((response) => {
        console.log("Activity deleted", response);
        setShowDeleteModal(false);
        navigate("/activities", {
          state: { message: "ลบกิจกรรมเรียบร้อยแล้ว" },
        });
      })
      .catch((error) => {
        console.error("Error deleting activity", error);
        setIsDeleting(false);
      });
  }

  useEffect(() => {
    fetchActivity();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return DateTime.fromISO(dateString).setLocale("th").toFormat("d MMMM yyyy");
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          รายละเอียดกิจกรรม
        </h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      {state && state.message && (
        <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
      )}

      <div className="flex justify-between items-center mb-6">
        {activity && (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-color font-heading">
                {activity.actName}
              </h2>
              <p className="text-sm text-text-color-alt font-body">
                {activity.activityType?.actTypeName} |{" "}
                {formatDate(activity.actDate)}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Link
            to={`/activity/edit/${activity?.actId}`}
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
            แก้ไขข้อมูลกิจกรรม
          </Link>
          <Link
            to={`/activity/${id}/qr-code`}
            className="py-2.5 px-4 text-sm font-medium text-white bg-primary hover:bg-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            QR Code กิจกรรม
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="py-2.5 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            ลบกิจกรรม
          </button>
        </div>
      </div>

      {activity ? (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <ShowDetail activity={activity} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {activity && (
        <div className="mt-6 flex justify-end">
          <Link
            to={`/activity/${id}/participate`}
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300 mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            จัดการการเข้าร่วม
          </Link>

          <Link
            to="/activities"
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
            กลับไปหน้ารายการกิจกรรม
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
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
            <h3 className="text-lg font-medium text-center text-text-color mb-2">
              ยืนยันการลบกิจกรรม
            </h3>
            <p className="text-sm text-center text-text-color-alt mb-6">
              คุณแน่ใจว่าต้องการลบกิจกรรม "{activity?.actName}" หรือไม่
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-medium text-text-color bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={deleteActivity}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "กำลังลบ..." : "ลบกิจกรรม"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityDetail;
