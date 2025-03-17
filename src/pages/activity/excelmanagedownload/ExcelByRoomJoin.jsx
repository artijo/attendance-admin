import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { formatDateToThai } from "../../../helper";
import { abstactActivity } from "../../../exportExcel";
import ErrorAlertActivity from "../../../components/alert/activity/error";

function ExcelByFilterRoom() {
    const location = useLocation();
    const { classrooms, activityId, activity } = location.state;
    const firstDate = DateTime.fromISO(activity.actDate).setZone('Asia/Bangkok').startOf('day').toISODate();
    
    const [alert, setAlert] = useState(false);
    const [startDate, setStartDate] = useState(`${firstDate}`);
    const [endDate, setEndDate] = useState(`${firstDate}`);

    const handleStartDate = (value) => {
        setStartDate(value);
    };

    const handleEndDate = (value) => {
        setEndDate(value);
    };

    const checkDate = (startDate, endDate) => {
        const startDateTime = DateTime.fromISO(startDate).setZone('Asia/Bangkok').startOf('day');
        const endDateTime = DateTime.fromISO(endDate).setZone('Asia/Bangkok').startOf('day');
        if(startDateTime > endDateTime) {
            // console.log("ไม่สามารถเลือกให้วันสิ้นสุดน้อยกว่าวันที่เริ่มได้")
            setAlert(true);
        }else{
            // console.log("สามารถ")
            setAlert(false);
        };
    };

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

    const handelExportExcel = (activityId, classId, startDate, endDate, className, activityName) => {
        abstactActivity(activityId, classId, startDate, endDate , className, activityName);
    };

    useEffect(() => {
        checkDate(startDate, endDate);
    },[startDate, endDate]);

    return (
        <div>
            <div className="w-full h-fit">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    ดาวน์โหลดเอกสารการเข้าร่วมกิจกรรม {activity.actName} โดยแบ่งตามห้องและแต่ละวันนั้นมีใครเข้าร่วมบ้าง
                </h1>
                {classrooms.length > 0 && (
                    <>
                        <div id="select-date-range">
                            <div className="mt-2">
                                <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900">วันที่เริ่ม</label>
                                <select 
                                    id="startDate" 
                                    name="startDate" 
                                    className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    onChange={(e) => handleStartDate(e.target.value)}
                                >
                                    {activity && getDatesBetween(activity.actDate, activity.actDateEnd).map((date) => {
                                        const dateTimeFormat = formatDateToThai(date);
                                        return (
                                            <option value={date} key={date}>
                                                {dateTimeFormat}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900">วันที่สิ้นสุด</label>
                                <select 
                                    id="endDate" 
                                    name="endDate" 
                                    className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    onChange={(e) => handleEndDate(e.target.value)}
                                >
                                    {activity && getDatesBetween(activity.actDate, activity.actDateEnd).map((date) => {
                                        const dateTimeFormat = formatDateToThai(date);
                                        return (
                                            <option value={date} key={date}>
                                                {dateTimeFormat}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        
                        {!alert ? 
                            (<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">ห้องเรียน</th>
                                            <th className="px-6 py-3">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classrooms.map((classroom) => (
                                            <tr key={classroom.classId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4">{classroom.className}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handelExportExcel(activityId, classroom.classId, startDate, endDate , classroom.className, activity.actName)}  
                                                        className="px-4 py-1 text-xs bg-green-600 text-white cursor-pointer rounded-full hover:bg-green-500"
                                                    >
                                                        ดาวน์โหลด Excel
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>) : (
                                <ErrorAlertActivity/>
                            )
                        }
                    </>
                )}
                {classrooms.length === 0 && (
                    <div>
                        <span className="flex flex-col items-center justify-center gap-2 py-3 border rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                            </svg>
                            ไม่พบห้องเรียนที่ต้องแสดง 
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExcelByFilterRoom;
