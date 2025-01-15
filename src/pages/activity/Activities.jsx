import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import ActivityList from "../../components/activity/activityList";

function Activities() {
    const [continuousActivities, setContinuousActivities] = useState(null);
    const [nonContinuousActivities, setNonContinuousActivities] = useState(null);

    function fetchActivities() {
        // Fetch continuous activities (type 1)
        axios.get(HOSTNAME + "/a/activities/1")
            .then((response) => {
                setContinuousActivities(response.data[0]?.activity || []);
            })
            .catch((error) => {
                console.error("Error fetching continuous activities", error);
            });

        // Fetch non-continuous activities (type 2)
        axios.get(HOSTNAME + "/a/activities/2")
            .then((response) => {
                setNonContinuousActivities(response.data[0]?.activity || []);
            })
            .catch((error) => {
                console.error("Error fetching non-continuous activities", error);
            });
    }

    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <div>
            <h1>กิจกรรม</h1>
            <div className="mb-4 flex items-center justify-between">
                <Link to={'create'} type="button" className="block w-fit text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                    เพิ่มกิจกรรม
                </Link>
            </div>
            {continuousActivities && nonContinuousActivities ? (
                <div className="mt-5">
                    <ActivityList 
                        continuousActivities={continuousActivities}
                        nonContinuousActivities={nonContinuousActivities}
                    />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Activities;