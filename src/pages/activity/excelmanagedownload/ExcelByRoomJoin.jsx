import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
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
    const [processingClass, setProcessingClass] = useState(null);

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
            setAlert(true);
        } else {
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

    const handelExportExcel = async (activityId, classId, startDate, endDate, className, activityName) => {
        setProcessingClass(classId);
        try {
            await abstactActivity(activityId, classId, startDate, endDate, className, activityName);
        } finally {
            setTimeout(() => {
                setProcessingClass(null);
            }, 1000);
        }
    };

    useEffect(() => {
        checkDate(startDate, endDate);
    }, [startDate, endDate]);

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
                    ดาวน์โหลดเอกสารสรุปการเข้าร่วมกิจกรรม
                </h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-text-color font-heading">
                            {activity.actName}
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">การเข้าร่วมกิจกรรมแบ่งตามห้องเรียน</p>
                    </div>
                </div>
                
                <Link 
                    to={`/activity/${activityId}/participate`}
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้ารายการ
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="p-6">
                    {classrooms.length > 0 && (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-text-color font-heading mb-4">เลือกช่วงวันที่</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 border border-line rounded-lg p-4">
                                        <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-text-color font-body flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            วันที่เริ่มต้น
                                        </label>
                                        <select 
                                            id="startDate"
                                            name="startDate" 
                                            className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                            onChange={(e) => handleStartDate(e.target.value)}
                                        >
                                            {activity && getDatesBetween(activity.actDate, activity.actDateEnd).map((date) => {
                                                const dateTimeFormat = formatDateToThai(date);
                                                return (
                                                    <option value={date} key={date}>
                                                        {dateTimeFormat}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    
                                    <div className="bg-gray-50 border border-line rounded-lg p-4">
                                        <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-text-color font-body flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            วันที่สิ้นสุด
                                        </label>
                                        <select 
                                            id="endDate"
                                            name="endDate" 
                                            className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                            onChange={(e) => handleEndDate(e.target.value)}
                                        >
                                            {activity && getDatesBetween(activity.actDate, activity.actDateEnd).map((date) => {
                                                const dateTimeFormat = formatDateToThai(date);
                                                return (
                                                    <option value={date} key={date}>
                                                        {dateTimeFormat}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {alert ? (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    <div className="flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <div>วันที่เริ่มต้นต้องน้อยกว่าหรือเท่ากับวันที่สิ้นสุด กรุณาเลือกวันที่ใหม่</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-line">
                                                <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ห้องเรียน</th>
                                                <th className="px-4 py-3.5 text-center text-xs font-medium text-text-color-alt tracking-wider font-heading" width="200">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {classrooms.map((classroom) => (
                                                <tr key={classroom.classId} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="px-4 py-4 font-medium text-text-color">
                                                        <div className="flex items-center">
                                                            <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full h-8 w-8 mr-3">
                                                                {classroom.className.split("ม.")[1].split("/")[0]}
                                                            </span>
                                                            <span>{classroom.className}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <button
                                                            onClick={() => handelExportExcel(activityId, classroom.classId, startDate, endDate, classroom.className, activity.actName)}  
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                            disabled={processingClass === classroom.classId}
                                                        >
                                                            {processingClass === classroom.classId ? (
                                                                <>
                                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    กำลังดาวน์โหลด...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                    </svg>
                                                                    ดาวน์โหลด Excel
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                    
                    {classrooms.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลห้องเรียน</h2>
                            <p className="text-text-color-alt font-body">ไม่พบห้องเรียนที่ต้องแสดงสำหรับกิจกรรมนี้</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExcelByFilterRoom;
