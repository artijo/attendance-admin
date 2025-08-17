import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { TimetableRow } from "../../components/new_timetable/TimetableRow";
import { formatDayOfWeeks } from "../../helper";
import { DateTime, Interval } from "luxon";
import { Searchpanel } from "../../components/new_timetable/subject/searchpanel";
import ErrorAlert from "../../components/alert/error";
import { set } from "react-hook-form";

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
    const navigate = useNavigate();
    const { classroom } = location.state;
    const [timetable, setTimetable] = useState(null);
    // const [oldTimetable, setOldTimetable] = useState(null);
    const dateKey = timetable != null && Object.keys(timetable);
    //edit late time
    const [editForm, setEditFrom] = useState(false);
    const [timetableEditNow, setTimetableEditNow] = useState(null);
    const [lateTime, setLateTime] = useState(0);
    // const [isDisable, setIsDisable] = useState(true);
    //drag and drop
    const [activeCard, setActiveCard] = useState(null); // วิชาที่เลือก
    const [subjectActiveCard, setSubjectActiveCard] = useState(null) // วิชาที่เลือกจะใส่ในตาราง

    //Error State 
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);



    const handleFormEnable = (timetablethistime, schedule) => {
        const timeStartActiveCard = DateTime.fromISO(timetablethistime.timeStart);
        const timeLateActiveCard = DateTime.fromISO(timetablethistime.timeLate);
        const diffLateTime = timeLateActiveCard.diff(timeStartActiveCard, ["minutes"]);
        setLateTime(diffLateTime.minutes);
        setEditFrom(true);
        setTimetableEditNow({ ...timetablethistime, schedule });

    };

    const handleFormDisable = () => {
        setEditFrom(false);
        setTimetableEditNow(null);
    };

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

    const onEditLateTimeSubmit = async (e) => {
        e.preventDefault();
        const lateTimePlus = DateTime.fromISO(timetableEditNow.timeStart).plus({ minutes: lateTime }).toFormat('HH:mm:ss');
        try {
            const response = await axios.put(`${HOSTNAME}/a/timetable/editlatetime`, { timetable: timetableEditNow, lateTime: lateTimePlus });
            if (response.status === 200) {
                fetchTimetable(classroom.classId);
                handleFormDisable();
            } else {
                throw new Error(response.data.message);
            };
        } catch (error) {
            console.error(error);
        };
    }

    const handleOnChangeNumberLateTime = (value) => {
        let lateTimeClone = value;
        if (lateTimeClone < 0) {
            setLateTime(0);
        } else {
            setLateTime(value);
        };
    };


    const callDeleteTimetableApi = async (timetablethistime, schedule) => {
        // timetableformate: "13.50 - 14.40",
        // period: 6
        try {
            const text = `คุณต้องการที่จะลบวิชา ${timetablethistime.subject.subNameThai} ในคาบ ${schedule.period} เวลา ${schedule.timetableformate}`
            if (confirm(text) === true) {
                const response = await axios.delete(`${HOSTNAME}/a/timetable/${timetablethistime.timetableId}`)
                if (response.status === 200) {
                    // console.log('delete sucessful');
                    fetchTimetable(classroom.classId);
                } else {
                    throw new Error(response.data.message);
                }
            } else {
                return;
            }
        } catch (error) {
            console.error(error)
        }
    }

    const callCreateTimetableBySubject = async (classroom, timetable, schedule, weekday) => {
        try {
            const data = {
                classroom,
                timetable,
                schedule,
                weekday
            };
            const response = await axios.post(`${HOSTNAME}/a/timetable/bysubject`, data);
            fetchTimetable(classroom.classId);
        } catch (error) {
            setError(true);
            // ถ้า server ส่ง error แบบ JSON ที่มี message
            const message = error.response?.data?.message || error.message;
            setMessage(message);

            setTimeout(() => {
                setError(false);
                setMessage(null);
            }, 5000);
        }

    }

    const callSwitchTimetableSubjectPeriod = async (timetable, classroom, schedule, weekday) => {
        try {
            const data = {
                classroom,
                timetable,
                schedule,
                weekday
            };
            const response = await axios.post(`${HOSTNAME}/a/timetable/byswitchperiod`, data);
            fetchTimetable(classroom.classId);
        } catch (error) {
            setError(true);
            // ถ้า server ส่ง error แบบ JSON ที่มี message
            const message = error.response?.data?.message || error.message;
            setMessage(message);

            setTimeout(() => {
                setError(false);
                setMessage(null);
            }, 5000);
        }
    }

    const callSwitchSubjectAndSubject = async (firstTimetable, secondTimetable, schedule) => {
        try {
            const data = {
                firstTimetable,
                secondTimetable,
                schedule
            }
            const response = await axios.post(`${HOSTNAME}/a/timetable/switchsubjectandsubject`, data);
            fetchTimetable(classroom.classId);
        } catch (error) {
            setError(true);
            const message = error.response?.data?.message || error.message;
            setMessage(message);

            setTimeout(() => {
                setError(false);
                setMessage(null);
            }, 5000);

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
            callCreateTimetableBySubject(classroom, timetableObject, schedule, weekday);
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

    const ErrorAlertDialog = ({ message }) => {
        return (
            <div role="alert" className=" rounded-md border border-red-100 bg-red-100 p-4 animate-fade-in">
                <div className="flex flex-col items-start relative">
                    <div className="flex  items-start gap-4 mt-2">
                        <span className="text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <div className="flex-1">
                            <strong className="block font-medium text-red-600">เกิดข้อผิดพลาด</strong>
                        </div>

                    </div>
                    <p className="mt-2 ml-1 text-sm text-red-600 ">{message}</p>
                    <button className="absolute top-0 right-0 text-gray-500 transition hover:text-gray-600">
                        <span className="sr-only">Dismiss popup</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (classroom) {
            fetchTimetable(classroom.classId);
        };
    }, [classroom]);

    return (
        <div>
            {error && (
                <div className="fixed w-1/4 bottom-0 right-0 z-40 mx-6 my-4">
                    <ErrorAlertDialog message={message} />
                </div>
            )}
            <div className="grid grid-cols-[auto_400px] gap-5 p-5 content-center fixed top-0 left-0 w-full h-screen bg-gray-50 z-30">
                <div className="overflow-auto h-full">
                    <div className="rounded-xl bg-white shadow">
                        <div className="rounded-t-xl px-5 pt-5 py-1 mb-2 ">
                            {/* Updated back button with React Router */}
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center text-primary hover:text-primary-dark transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                    </svg>
                                    <span className="text-sm font-medium">ย้อนกลับ</span>
                                </button>
                            </div>
                            <div className="flex justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">เพิ่มรายวิชาในตารางเรียน</h1>
                                    <div className="mt-2 mb-2 h-1 w-16 bg-secondary rounded-full"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 text-primary rounded-full p-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-color font-heading">
                                            ม.{classroom.classLevel}/{classroom.classRoom} เทอม {classroom.term.semester} ปีการศึกษา {classroom.term.academicYear + 543}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 pb-5 relative">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-3 bg-gray-50 border border-gray-100 text-center w-10">
                                            <div className="text-xs font-medium text-text-color-alt tracking-wider uppercase font-heading">
                                                วัน / คาบเรียน
                                            </div>
                                        </th>
                                        {timeStudyList.map((time, index) => (
                                            <th key={index} className={`w-20 py-3 text-center border border-gray-100 ${time.period === 'พักเที่ยง' ? 'bg-amber-50' : 'bg-gray-50'}`}>
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
                                                    handleFormEnable={handleFormEnable}
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
                {editForm && (
                    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/5 z-40">
                        <div className="">
                            <form className="bg-white w-[400px] p-6 rounded-xl shadow" onSubmit={(e) => onEditLateTimeSubmit(e)}>
                                <div className="mb-2">
                                    <h1 className="text-lg font-bold text-primary font-heading">แก้ไขเวลาการเข้าสาย</h1>
                                    <div className="flex gap-2 bg-gray-100/70 p-2 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                        </svg>
                                        <div className="text-xs">
                                            <p>
                                                คาบที่ {timetableEditNow.schedule.period} เวลา {timetableEditNow.schedule.timetableformate}
                                            </p>
                                            <p>
                                                วิชา {timetableEditNow.subject.subNameThai}
                                            </p>
                                        </div>

                                    </div>
                                    <div className="mt-2 h-1 w-20 bg-secondary rounded-full"></div>
                                </div>
                                <div className="grid">
                                    <label className="block text-sm font-medium text-gray-700">
                                        เวลาการเข้าเรียนสาย (นาที)
                                    </label>
                                    <input
                                        className="mt-1 w-full rounded-md px-1.5 py-1  border-gray-200 shadow-sm sm:text-sm"
                                        value={lateTime}
                                        type="number"
                                        onChange={(e) => handleOnChangeNumberLateTime(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 w-fit mt-2 ml-auto">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-text-color bg-white hover:bg-gray-100 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                                        onClick={() => handleFormDisable()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>

                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-xs font-medium rounded-lg text-white bg-primary hover:cursor-pointer hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        บันทึกการแก้ไข
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default CreateTimetableDragAndDrop;