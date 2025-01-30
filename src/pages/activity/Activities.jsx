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
            <h1 className="text-center font-bold">กิจกรรม</h1>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 justify-end">
                <Link 
                    to={'create'} 
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
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