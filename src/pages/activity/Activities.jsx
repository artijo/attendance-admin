import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { Link, useLocation } from "react-router-dom";
import ActivityList from "../../components/activity/activityList";
import AlertSuccess from "../../components/alert/success.jsx";
import ActivityChart from "../../components/chart/ActivityChart.jsx";

function Activities() {
  const [continuousActivities, setContinuousActivities] = useState(null);
  const [nonContinuousActivities, setNonContinuousActivities] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { state } = location;
  const [totalActivities, setTotalActivities] = useState(0);

  function fetchActivities() {
    setIsLoading(true);
    Promise.all([
      axios.get(HOSTNAME + "/a/activities/1"),
      axios.get(HOSTNAME + "/a/activities/2"),
    ])
      .then(([continuousRes, nonContinuousRes]) => {
        const continuous = continuousRes.data[0]?.activity || [];
        const nonContinuous = nonContinuousRes.data[0]?.activity || [];

        setContinuousActivities(continuous);
        setNonContinuousActivities(nonContinuous);
        setTotalActivities(continuous.length + nonContinuous.length);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activities", error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          กิจกรรม
        </h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      {state && state.message && (
        <div className="mb-6">
          <AlertSuccess title="บันทึกข้อมูลแล้ว" message={state.message} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {!isLoading && (
          <div className="mb-3 sm:mb-0 bg-white rounded-lg px-4 py-2 border border-line shadow-sm">
            <span className="text-text-color-alt font-body">
              จำนวนกิจกรรมทั้งหมด:
            </span>
            <span className="ml-2 font-medium text-primary text-lg font-heading">
              {totalActivities} กิจกรรม
            </span>
            <div className="mt-1 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>
                  กิจกรรมต่อเนื่อง: {continuousActivities?.length || 0}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>
                  กิจกรรมไม่ต่อเนื่อง: {nonContinuousActivities?.length || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            to="restore"
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
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
                d="M9 8h6m-5 0a3 3 0 110 6H9m0 0l3 3m-3-3l-3-3m15-1a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            กิจกรรมที่ถูกลบ
          </Link>

          <Link
            to={"create"}
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            เพิ่มกิจกรรม
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : totalActivities === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
          <div className="flex justify-center mb-4 text-text-color-alt">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
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
          <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">
            ไม่พบข้อมูลกิจกรรม
          </h2>
          <p className="text-text-color-alt font-body">
            กรุณาเพิ่มกิจกรรมโดยคลิกที่ปุ่ม "เพิ่มกิจกรรม"
          </p>
        </div>
      ) : (
        <>
          {/* แผนภูมิสัดส่วนกิจกรรม */}
          <ActivityChart
            continuousActivities={continuousActivities}
            nonContinuousActivities={nonContinuousActivities}
          />

          <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
            <ActivityList
              continuousActivities={continuousActivities}
              nonContinuousActivities={nonContinuousActivities}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Activities;
