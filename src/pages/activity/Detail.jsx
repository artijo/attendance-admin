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
            <h1>รายละเอียดกิจกรรม</h1>
            <Link 
                to={`/activity/edit/${activity?.actId}`} 
                type="button" 
                className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
                แก้ไขข้อมูลกิจกรรม
            </Link>
            {state && state.message && (
                <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
            )}
            {activity ? (
                <div className="mt-5">
                    <ShowDetail activity={activity} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ActivityDetail;
