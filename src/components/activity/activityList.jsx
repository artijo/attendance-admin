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
                                    <td colSpan={5} className="whitespace-nowrap text-center px-4 py-2 text-gray-700">
                                    <span className="flex flex-col items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                        </svg>
                                        ไม่มีกิจกรรม
                                    </span>
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
