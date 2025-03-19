import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { convertNumberToThaiMonth, formatDayOfWeeks } from "../../helper";

function Timetable() {
    const location = useLocation();
    const { classroom } = location.state;
    const [timetable, setTimetable] = useState(null);
    const dateKey = timetable != null && Object.keys(timetable);
    console.log(classroom);

    const timeStudyList = [
        {
            startDatabaseFormat: "08:40:00",
            endDatabaseFormat: "09:30:00",
            timetableformate: "08.40 - 09.30",
        },
        {
            startDatabaseFormat: "09:30:00",
            endDatabaseFormat: "10:20:00",
            timetableformate: "09.30 - 10.20",
        },
        {
            startDatabaseFormat: "10:20:00",
            endDatabaseFormat: "11:10:00",
            timetableformate: "10.20 - 11.10",
        },
        {
            startDatabaseFormat: "11:10:00",
            endDatabaseFormat: "12:00:00",
            timetableformate: "11.10 - 12.00",
        },
        {
            startDatabaseFormat: "12:00:00",
            endDatabaseFormat: "13:00:00",
            timetableformate: "12.00 - 13.00",
        },
        {
            startDatabaseFormat: "13:00:00",
            endDatabaseFormat: "13:50:00",
            timetableformate: "13.00 - 13.50",
        },
        {
            startDatabaseFormat: "13:50:00",
            endDatabaseFormat: "14:40:00",
            timetableformate: "13.50 - 14.40",
        },
        {
            startDatabaseFormat: "14:40:00",
            endDatabaseFormat: "15:30:00",
            timetableformate: "14.40 - 15.30",
        },
    ];
    
    const fetchTimetable = async (classroomId) => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/timetableR?classroomid=${classroomId}`);
            console.log(response.data);
            setTimetable(response.data);
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        if(classroom != null || classroom != undefined){
            fetchTimetable(classroom.classId);
        };
    },[classroom]);

    

    return (
        <div className="w-full h-fit">
            <h1 className="text-center font-bold">ตารางเรียนห้องม.{classroom.classLevel}/{classroom.classRoom} ปีการศึกษา {classroom.term.academicYear} เทอม {classroom.term.semester}</h1>
            <div className="w-fit ml-auto">
                <Link
                    to={'create'} 
                    className="inline-flex mb-2 justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    จัดการตารางเรียน
                </Link>
            </div>
            <div className="relative border overflow-x-scroll overflow-y-hidden shadow-lg sm:rounded-2xl">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-2">
                                <div className="w-20">
                                    <span className="rounded-lg px-2  bg-gray-200/70">วัน/เวลา</span>
                                </div>
                            </th>
                            {timeStudyList.map((time, index) => (
                                <th key={index} className="px-1 py-3 w-40 text-center">
                                    <div className="rounded-lg w-full py-4 bg-gray-200/70">
                                        {time.timetableformate}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dateKey.length > 0 && dateKey.map((key, keyindex) => (
                            <tr className="bg-white" key={`${key} - ${keyindex}`}>
                                <th className="text-center text-xs px-2">
                                    <div className="w-20">
                                        <span className="rounded-lg px-2 text-gray-700 font-bold bg-gray-200/70">{formatDayOfWeeks(key)}</span>
                                    </div>
                                </th>
                                {timeStudyList.map((time, period) => {
                                    const timetablethistime = timetable[key].find((tt) => tt.timeStart === time.startDatabaseFormat);
                                    if(time.startDatabaseFormat === "12:00:00" ) {
                                        return (
                                            <td key={`${time} period ${period+1}`} className="p-1">
                                                <div className="flex justify-center items-center card w-40 h-20 bg-gray-200 rounded-lg">
                                                    พักเที่ยง
                                                </div>
                                            </td>
                                        );
                                    }else if(timetablethistime === undefined){
                                        return(
                                            <td key={`${time} period ${period+1}`} className="p-1">
                                                <div className="card w-40 h-20 bg-gray-200 rounded-lg">
                                                    
                                                </div>
                                            </td>
                                        );
                                    }else{
                                        return (
                                            <td key={`${time} period ${period+1}`} className="p-1">
                                                <div className="card grid grid-cols-1 gap-1 w-40 h-20 bg-background-alt rounded-lg p-2 text-white">
                                                    <h5 className="text-sm">
                                                        {timetablethistime.subject.subNameThai}
                                                    </h5>
                                                    <p className="w-fit text-xs rounded-2xl px-1 bg-blue-500">{timetablethistime.subject.subCode}</p>
                                                    <p className="w-fit text-xs rounded-2xl px-1 bg-amber-500">คุณครู {timetablethistime.subject.teacher.fName} {timetablethistime.subject.teacher.lName}</p>
                                                </div>
                                            </td>
                                        );
                                    };
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Timetable;
