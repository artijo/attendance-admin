import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, useLocation } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { TimetableRow } from "../../components/new_timetable/TimetableRow";
import { formatDayOfWeeks } from "../../helper";
import { DateTime, Interval } from "luxon";
import { Searchpanel } from "../../components/new_timetable/subject/searchpanel";

const timeStudyList = [
    {
        startDatabaseFormat: "08:40:00",
        endDatabaseFormat: "09:30:00",
        timetableformate: "08.40 - 09.30",
        period: 1
    },
    {
        startDatabaseFormat: "09:30:00",
        endDatabaseFormat: "10:20:00",
        timetableformate: "09.30 - 10.20",
        period: 2
    },
    {
        startDatabaseFormat: "10:20:00",
        endDatabaseFormat: "11:10:00",
        timetableformate: "10.20 - 11.10",
        period: 3
    },
    {
        startDatabaseFormat: "11:10:00",
        endDatabaseFormat: "12:00:00",
        timetableformate: "11.10 - 12.00",
        period: 4
    },
    {
        startDatabaseFormat: "12:00:00",
        endDatabaseFormat: "13:00:00",
        timetableformate: "12.00 - 13.00",
        period: "พักเที่ยง"
    },
    {
        startDatabaseFormat: "13:00:00",
        endDatabaseFormat: "13:50:00",
        timetableformate: "13.00 - 13.50",
        period: 5
    },
    {
        startDatabaseFormat: "13:50:00",
        endDatabaseFormat: "14:40:00",
        timetableformate: "13.50 - 14.40",
        period: 6
    },
    {
        startDatabaseFormat: "14:40:00",
        endDatabaseFormat: "15:30:00",
        timetableformate: "14.40 - 15.30",
        period: 7
    },
    {
        startDatabaseFormat: "15:30:00",
        endDatabaseFormat: "16:20:00",
        timetableformate: "15.30 - 16.20",
        period: 8
    }
];

function CreateTimetableDragAndDrop() {
    const location = useLocation();
    const { classroom } = location.state;
    const [timetable, setTimetable] = useState(null);
    // const [oldTimetable, setOldTimetable] = useState(null);
    const dateKey = timetable != null && Object.keys(timetable);
    // const [isDisable, setIsDisable] = useState(true);
    //drag and drop
    const [activeCard, setActiveCard] = useState(null); // วิชาที่เลือก
    const [subjectActiveCard, setSubjectActiveCard] = useState(null) // วิชาที่เลือกจะใส่ในตาราง


     //fetch timetable 
     const fetchTimetable = async (classroomId) => {
        try {
            // setIsLoading(true);
            // setError(null);
            const response = await axios.get(`${HOSTNAME}/a/timetableR?classroomid=${classroomId}`);
            if (response.status === 200) {
                setTimetable(response.data);
                // setOldTimetable(JSON.parse(JSON.stringify(response.data)));
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            // setError("ไม่สามารถโหลดข้อมูลตารางเรียนได้");
        } finally {
            // setIsLoading(false);
        }
    };


    const callDeleteTimetableApi = async (timetablethistime,schedule) => {
        // timetableformate: "13.50 - 14.40",
        // period: 6
        try{
            const text = `คุณต้องการที่จะลบวิชา ${timetablethistime.subject.subNameThai} ในคาบ ${schedule.period} เวลา ${schedule.timetableformate}`
            if(confirm(text) === true) {
                const response = await axios.delete(`${HOSTNAME}/a/timetable/${timetablethistime.timetableId}`)
                if(response.status === 200) {
                    // console.log('delete sucessful');
                    fetchTimetable(classroom.classId);
                }else{
                    throw new Error(response.data.message);
                }
            }else{
                return;
            }
        }catch(error){
            console.error(error)
        }
    }

    const callCreateTimetableBySubject = async (classroom, timetable, schedule) => {
        try {
            const data = {
                classroom: classroom,
                timetable: timetable,
                schedule: schedule
            }
            const response = await axios.post(`${HOSTNAME}/a/timetable/bysubject`, data);
            if (response.status === 200) {
                fetchTimetable(classroom.classId);
            } else {
                console.log("kuy")
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const callSwitchTimetableSubjectPeriod = async (timetable, classroom, schedule, weekday) => {
        try {
            const data = {
                timetable: timetable,
                classroom: classroom,
                schedule: schedule,
                weekday:weekday
            }
            const response = await axios.post(`${HOSTNAME}/a/timetable/byswitchperiod`, data);
            if (response.status === 200) {
                fetchTimetable(classroom.classId);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const callSwitchSubjectAndSubject = async (firstTimetable, secondTimetable, schedule) => {
        try {
            const data = {
                firstTimetable: firstTimetable,
                secondTimetable: secondTimetable,
                schedule: schedule
            }
            const response = await axios.post(`${HOSTNAME}/a/timetable/switchsubjectandsubject`, data);
            if (response.status === 200) {
                fetchTimetable(classroom.classId);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onDrop = (weekday, schedule) => {
        const timetableClone = { ...timetable };
        const exitTimetable = timetableClone[weekday].find((tt) => tt.timeStart === schedule.startDatabaseFormat);

        if (subjectActiveCard != null) {
            const timeLateSchedule = DateTime.fromISO(schedule.startDatabaseFormat).plus({ minutes: 15 }).toFormat('HH:mm:ss');
            const timetableObject = {
                timeStart: schedule.startDatabaseFormat,
                timeEnd: schedule.endDatabaseFormat,
                timeLate: timeLateSchedule,
                dayOfWeek: weekday,
                subject: subjectActiveCard
            }
            callCreateTimetableBySubject(classroom, timetableObject, schedule);
            return;
        }

        if (!exitTimetable) {
            const timeStartActiveCard = DateTime.fromISO(activeCard.timeStart);
            const timeLateActiveCard = DateTime.fromISO(activeCard.timeLate);
            const diffLateTime = timeLateActiveCard.diff(timeStartActiveCard, ["minutes"]);
            const timeLateSchedule = DateTime.fromISO(schedule.startDatabaseFormat).plus({ minutes: diffLateTime.minutes }).toFormat('HH:mm:ss');
            const timetableObject = {
                ...activeCard,
                timeStart: schedule.startDatabaseFormat,
                timeEnd: schedule.endDatabaseFormat,
                timeLate: timeLateSchedule,
                dayOfWeek: Number(weekday),
                subject: subjectActiveCard
            }
            callSwitchTimetableSubjectPeriod(timetableObject, classroom, schedule, weekday);
            return;
        }

        if (exitTimetable) {
            callSwitchSubjectAndSubject(exitTimetable, activeCard, schedule);
            return;
        }

    }

   

    useEffect(() => {
        if (classroom) {
            fetchTimetable(classroom.classId);
        };
        console.log(classroom);
    }, [classroom]);

    return (
        <div className="border grid grid-cols-[auto_400px] content-center fixed top-0 left-0 w-full h-screen bg-gray-50 z-30">
            <div>
                <div className="p-5">
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">เพิ่มรายวิชาในตารางเรียน</h1>
                        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-primary/10 text-primary rounded-full p-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-text-color font-heading">
                            ม.{classroom.classLevel}/{classroom.classRoom} เทอม {classroom.term.semester} ปีการศึกษา {classroom.term.academicYear + 543}
                        </h3>
                    </div>
                    <div className="mt-2 relative bg-white rounded-lg">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-2 py-3 bg-gray-50 border text-center w-10">
                                        <div className="text-xs font-medium text-text-color-alt tracking-wider uppercase font-heading">
                                            วัน / คาบเรียน
                                        </div>
                                    </th>
                                    {timeStudyList.map((time, index) => (
                                        <th key={index} className={`w-20 py-3 text-center border ${time.period === 'พักเที่ยง' ? 'bg-amber-50' : 'bg-gray-50'}`}>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-primary tracking-wider uppercase font-heading">
                                                    {typeof time.period === 'number' ? `คาบที่ ${time.period}` : time.period}
                                                </span>
                                                <span className="text-xs text-text-color-alt font-body mt-1">
                                                    {time.timetableformate}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {dateKey.length > 0 && (
                                    dateKey.map((date, index) => (
                                        <React.Fragment key={index}>
                                            <TimetableRow
                                                scheduleWeekDay={timetable[date]}
                                                timeStudyList={timeStudyList}
                                                date={date}
                                                setActiveCard={setActiveCard}
                                                onDrop={onDrop}
                                                callDeleteTimetableApi={callDeleteTimetableApi}
                                            />
                                        </React.Fragment>

                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Searchpanel setSubjectActiveCard={setSubjectActiveCard} />
        </div>
    );
};

export default CreateTimetableDragAndDrop;