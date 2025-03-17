import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import FilterByClassroom from "../../../components/activity/exportPDF/FilterByClassroom";
import { DateTime } from "luxon";
import { convertNumberToThaiMonth } from "../../../helper";

function FilterClassroomPage() {
    const location = useLocation();
    const { classrooms, activityId, activity } = location.state;
    const firstDate = DateTime.fromISO(activity.actDate).setZone('Asia/Bangkok').startOf('day').toISODate();
    const [selectedDate, setSelectedDate] = useState(`${firstDate}`);

    const getDatesBetween = (startDate, endDate) => {
        const dates = [];
        let current = DateTime.fromISO(startDate).setZone('Asia/Bangkok').startOf('day');
        const end = DateTime.fromISO(endDate).setZone('Asia/Bangkok').startOf('day');
        
        while (current <= end) {
            dates.push(current.toISODate());
            current = current.plus({ days: 1 });
        }
        return dates;
    };

    return (
        <div>
            <div className="w-full h-fit">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    ดาวน์โหลดเอกสารการเข้าร่วมกิจกรรม {activity.actName} โดยแบ่งตามห้องและแต่ละวันมีใครเข้าร่วมบ้าง
                </h1>
                
                {/* Existing date selector */}
                <p className="text-gray-700 mb-2">เลือกวันที่ต้องการดาวน์โหลด </p>
                <div className="relative mb-6">
                    <div className="overflow-x-auto pb-2 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                        <div className="flex gap-2 px-1">
                            {activity && getDatesBetween(activity.actDate, activity.actDateEnd).map((date) => {
                                const dateTime = DateTime.fromISO(date).setZone('Asia/Bangkok');
                                const isToday = DateTime.now().setZone('Asia/Bangkok').hasSame(dateTime, 'day');
                                const thaiMonth = convertNumberToThaiMonth(dateTime.month);
                                return (
                                    <button
                                        key={date}
                                        onClick={() => {
                                            setSelectedDate(date);
                                        }}
                                        className={`flex-shrink-0 flex flex-col items-center w-24 py-2 rounded-lg transition-all ${
                                            selectedDate === date
                                                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                                : 'bg-white border hover:bg-gray-50'
                                        } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                                    >
                                        <span className="text-xs mb-1">
                                            {dateTime.toFormat('ccc')}
                                        </span>
                                        <span className="text-lg font-semibold">
                                            {dateTime.day}
                                        </span>
                                        <span className="text-xs">
                                            {thaiMonth}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">
                                    ห้องเรียน
                                </th>
                                <th className="px-6 py-3">
                                    จัดการ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {classrooms.map((classroom) => (
                                
                                <tr key={classroom.classId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">
                                        {classroom.className}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link 
                                            to="/activity/participate/filterbyclassroom/pdfpage"
                                            state={{activityId:activityId, classId:classroom.classId, filtersDate: selectedDate, className:classroom.className, activity: activity }} 
                                        >
                                            <button  className="px-4 py-1 text-xs bg-rose-600 text-white cursor-pointer rounded-full hover:bg-rose-500">
                                                เอกสาร PDF
                                            </button>
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
};

export default FilterClassroomPage;
