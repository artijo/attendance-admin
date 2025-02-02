import axios from "axios";
import { useParams, Link, useLocation } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { useState, useEffect } from "react";
import ShowDetail from "../../components/activity/activityDetail";
import AlertSuccess from "../../components/alert/success";

function ActivityDetail() {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
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

    useEffect(() => {
        fetchActivity();
    }, []);

    return (
        <div>
            <h1 className="text-center font-bold">รายละเอียดกิจกรรม</h1>
            <div className="mt-5">
                <div className="mb-4 sm:mb-6 flex justify-end">
                    <Link 
                        to={`/activity/edit/${activity?.actId}`}
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        แก้ไขข้อมูลกิจกรรม
                    </Link>
                </div>
                {state && state.message && (
                    <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
                )}
                {activity ? (
                    <div className="bg-white shadow sm:rounded-lg">
                        <ShowDetail activity={activity} />
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ActivityDetail;
