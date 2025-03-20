import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { convertNumberToThaiMonth, formatDayOfWeeks } from "../../helper";

function Timetable() {
    const location = useLocation();
    const navigate = useNavigate();
    const { classroom } = location.state;
    const [timetable, setTimetable] = useState(null);
    const dateKey = timetable != null && Object.keys(timetable);
    // console.log(classroom);

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

    const handleEditTimetable = (timetable,time,day) => {
        navigate('edit',{state: {time:time, day:day, classroom:classroom ,timetable:timetable},replace:true})
    }

    const handleAddTimetable = (time,day) => {
        navigate('create',{state: {time:time, day:day, classroom:classroom}, replace:true})
    }
    
    const fetchTimetable = async (classroomId) => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/timetableR?classroomid=${classroomId}`);
            // console.log(response.data);
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
            <div className="relative p-1 bg-white border overflow-x-scroll overflow-y-hidden shadow-lg sm:rounded-2xl">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-center text-gray-700 uppercase">
                        <tr>
                            <th className="px-2">
                                <div>
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
                                    <div>
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
                                                <div 
                                                    onClick={() => handleAddTimetable(time,key)}
                                                    className="card cursor-pointer flex justify-center items-center w-40 h-20 bg-gray-200 rounded-lg"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                </div>
                                            </td>
                                        );
                                    }else{
                                        return (
                                            <td key={`${time} period ${period+1}`} className="p-1">
                                                <div 
                                                    onClick={() => handleEditTimetable(timetablethistime,time,key)}
                                                    className="cursor-pointer card grid grid-cols-1 gap-1 w-40 h-20 bg-background-alt rounded-lg p-2 text-white"
                                                >
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
