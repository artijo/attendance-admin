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
            <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">ชื่อกิจกรรม</th>
                                <th className="px-6 py-3">วันที่</th>
                                <th className="px-6 py-3">เวลา</th>
                                <th className="px-6 py-3">สถานที่</th>
                                {/* <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">สถานะ</th> */}
                                <th className="px-6 py-3">การเข้าร่วม</th>
                            </tr>
                        </thead>
                        <tbody >
                            {activities.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                        ไม่พบข้อมูลกิจกรรม
                                    </td>
                                </tr>
                            ) : (
                                activities.map((activity) => (
                                    <tr key={activity.actId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <Link to={`/activity/${activity.actId}`} className="hover:bg-gray-100">
                                                {activity.actName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(activity.actDate)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatTime(activity.actStartTime)} - {formatTime(activity.actEndTime)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {activity.actLocation}
                                        </td>
                                        {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {activity.actStatus}
                                        </td> */}
                                        <td className="px-6 py-4">
                                            
                                            <Link to={`/activity/${activity.actId}/participate`}>
                                                <span className="px-2 py-[1px] rounded-md text-white bg-blue-600 hover:bg-blue-500 ">การเข้าร่วม</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
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
