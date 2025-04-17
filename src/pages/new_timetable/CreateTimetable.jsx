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
    const [oldTimetable, setOldTimetable] = useState(null);
    const dateKey = timetable != null && Object.keys(timetable);
    const [isDisable, setIsDisable] = useState(true);
    //drag and drop
    const [activeCard, setActiveCard] = useState(null); // วิชาที่เลือก
    const [subjectActiveCard, setSubjectActiveCard] = useState(null) // วิชาที่เลือกจะใส่ในตาราง

    // const handleSubmitTimetableChange = async () => {
    //     const data = {
    //         timetables:timetable,
    //         classroom:classroom
    //     }
    //     const response = await axios.post(`${HOSTNAME}/a/timetable/dnd`,data);
    // }

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
            timetableClone[weekday].push(timetableObject);
            setTimetable(timetableClone);
            return;
        }

        if (!exitTimetable) {
            const activeCardWeekDay = activeCard.dayOfWeek;
            const timeStartActiveCard = DateTime.fromISO(activeCard.timeStart);
            const timeLateActiveCard = DateTime.fromISO(activeCard.timeLate);
            const diffLateTime = timeLateActiveCard.diff(timeStartActiveCard, ["minutes"]);
            const timeLateSchedule = DateTime.fromISO(schedule.startDatabaseFormat).plus({ minutes: diffLateTime.minutes }).toFormat('HH:mm:ss');
            timetableClone[activeCardWeekDay] = timetableClone[activeCardWeekDay].filter((tt) => tt != activeCard);
            timetableClone[weekday].push({
                ...activeCard,
                dayOfWeek: weekday,
                timeStart: schedule.startDatabaseFormat,
                timeEnd: schedule.endDatabaseFormat,
                timeLate: timeLateSchedule,
            });
            setTimetable(timetableClone);
            return;
        }

        if (exitTimetable) {
            // console.log(exitTimetable);
            const oldSubject = exitTimetable.subject;
            // console.log(oldSubject);
            const newSubject = activeCard.subject;
            // console.log(newSubject);
            const oldIndex = timetableClone[exitTimetable.dayOfWeek].indexOf(exitTimetable); //index ของตัวโดน drop
            const newIndex = timetableClone[activeCard.dayOfWeek].indexOf(activeCard); // index ของตัว drang
            //old timetable subject
            timetableClone[exitTimetable.dayOfWeek][oldIndex] = { ...exitTimetable, subject: { ...newSubject } };
            //new timetable subject
            timetableClone[activeCard.dayOfWeek][newIndex] = { ...activeCard, subject: { ...oldSubject } };
            setTimetable(timetableClone);
            return;
        }
      
    }

    //fetch timetable 
    const fetchTimetable = async (classroomId) => {
        try {
            // setIsLoading(true);
            // setError(null);
            const response = await axios.get(`${HOSTNAME}/a/timetableR?classroomid=${classroomId}`);
            if(response.status === 200) {
                setTimetable(response.data);
                setOldTimetable(JSON.parse(JSON.stringify(response.data)));
            }else{
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            // setError("ไม่สามารถโหลดข้อมูลตารางเรียนได้");
        } finally {
            // setIsLoading(false);
        }
    };


    useEffect(() => {
        if (classroom) {
            fetchTimetable(classroom.classId);
        };
    },[classroom]);

    useEffect(() => {
        console.log('newtimetable');
        console.log(timetable);
        console.log('defaluttimetable');
        console.log(oldTimetable);
        const compareArrays = (a, b) => {
            return JSON.stringify(a) === JSON.stringify(b);
        };

        setIsDisable(compareArrays(timetable, oldTimetable));
    },[timetable,oldTimetable]);

    return (
        <div className="border grid grid-cols-[auto,400px] gap-5 content-center fixed top-0 left-0 w-full h-screen bg-gray-100 z-30 px-5">
            <div>
                <button
                    type="button"
                    className={
                        isDisable ? `inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white  bg-gray-400 hover:cursor-not-allowed` :
                        `inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary  hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300`
                    }
                    disabled={isDisable}
                    // onClick={() => handleSubmitTimetableChange()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    บันทึกตารางเรียน
                </button>
                <div className="mt-2 relative overflow-x-auto bg-white rounded-lg">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="px-2 py-3 bg-gray-50 border text-center">
                                    <div className="text-xs font-medium text-text-color-alt tracking-wider uppercase font-heading">
                                        วัน / คาบเรียน
                                    </div>
                                </th>
                                {timeStudyList.map((time, index) => (
                                    <th key={index} className={`px-4 py-3 text-center border ${time.period === 'พักเที่ยง' ? 'bg-amber-50' : 'bg-gray-50'}`}>
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
                                        />
                                    </React.Fragment>

                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Searchpanel setSubjectActiveCard={setSubjectActiveCard} />
        </div>
    );
};

export default CreateTimetableDragAndDrop;