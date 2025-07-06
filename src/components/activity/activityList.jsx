import { Link } from "react-router-dom";
import { formatThaiDate, formatTimeThai } from "../../helper";

function ActivityList({ continuousActivities, nonContinuousActivities }) {
    const ActivityTable = ({ activities, title, type }) => (
        <div className="mb-6 px-6 py-5">
            <div className="flex items-center mb-4">
                <div className={`w-5 h-5 rounded-full ${type === 'continuous' ? 'bg-blue-500' : 'bg-green-500'} mr-3`}></div>
                <h2 className="text-xl font-bold text-text-color font-heading">{title}</h2>
                <div className="ml-3 px-2 py-0.5 rounded-full bg-gray-100 text-text-color-alt text-xs">
                    {activities.length} กิจกรรม
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-text-color-alt font-medium uppercase tracking-wider bg-gray-50 border-b border-line">
                        <tr>
                            <th className="px-4 py-3.5">ชื่อกิจกรรม</th>
                            <th className="px-4 py-3.5">วันที่</th>
                            <th className="px-4 py-3.5">เวลา</th>
                            <th className="px-4 py-3.5">สถานที่</th>
                            <th className="px-4 py-3.5 text-center">การเข้าร่วม</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activities.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-text-color-alt font-body">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p>ไม่พบข้อมูลกิจกรรม{type === 'continuous' ? 'ต่อเนื่อง' : 'ไม่ต่อเนื่อง'}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            activities.map((activity) => (
                                <tr key={activity.actId} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-4 py-3.5 font-medium text-primary">
                                        <Link 
                                            to={`/activity/${activity.actId}`} 
                                            className="hover:text-accent transition-colors duration-200"
                                        >
                                            {activity.actName}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3.5 font-body text-text-color">
                                        {formatThaiDate(activity.actDate)}
                                    </td>
                                    <td className="px-4 py-3.5 font-body text-text-color whitespace-nowrap">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-color-alt mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formatTimeThai(activity.actStartTime)} - {formatTimeThai(activity.actEndTime)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 font-body text-text-color">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-color-alt mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {activity.actLocation}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <Link 
                                            to={`/activity/${activity.actId}/participate`}
                                            className="inline-flex items-center px-3 py-1.5 rounded-md text-white bg-primary hover:bg-accent transition-colors duration-300 text-sm font-medium"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            การเข้าร่วม
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="py-2">
            <ActivityTable activities={continuousActivities} title="กิจกรรมต่อเนื่อง" type="continuous" />
            <div className="h-px bg-gray-100 mx-6"></div>
            <ActivityTable activities={nonContinuousActivities} title="กิจกรรมไม่ต่อเนื่อง" type="non-continuous" />
        </div>
    );
}

export default ActivityList;
