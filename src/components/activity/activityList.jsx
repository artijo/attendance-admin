import { Link } from "react-router-dom";
import { DateTime } from "luxon";

function ActivityList({ continuousActivities, nonContinuousActivities }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        return DateTime.fromISO(timeString).toLocaleString(DateTime.TIME_SIMPLE);
    };

    const ActivityTable = ({ activities, title }) => (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อกิจกรรม</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วันที่</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">เวลา</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">สถานที่</th>
                                {/* <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">สถานะ</th> */}
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">การเข้าร่วม</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {activities.map((activity) => (
                                <tr key={activity.actId}>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        <Link to={`/activity/${activity.actId}`} className="hover:bg-gray-100">
                                            {activity.actName}
                                        </Link>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {formatDate(activity.actDate)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {formatTime(activity.actStartTime)} - {formatTime(activity.actEndTime)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {activity.actLocation}
                                    </td>
                                    {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {activity.actStatus}
                                    </td> */}
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        <Link to={`/activity/${activity.actId}/attendance`}>
                                            <span className="underline text-blue-800">การเข้าร่วม</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <ActivityTable activities={continuousActivities} title="กิจกรรมต่อเนื่อง" />
            <ActivityTable activities={nonContinuousActivities} title="กิจกรรมไม่ต่อเนื่อง" />
        </div>
    );
}

export default ActivityList;
