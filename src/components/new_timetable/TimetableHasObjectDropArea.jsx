import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { DateTime } from "luxon";
// import DeleteDialog from "../dialog/DeleteDialog";

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


export const TimetableHasObjectDropArea = ({ timetablethistime, setActiveCard, onDrop, schedule, weekday, callDeleteTimetableApi, handleFormEnable }) => {
    const [deleteDiologShow, setDeleteDiologShow] = useState(false);
    const [clicked, setClicked] = useState(false);
    const timeStartActiveCard = DateTime.fromISO(timetablethistime.timeStart);
    const timeLateActiveCard = DateTime.fromISO(timetablethistime.timeLate);
    const diffLateTime = timeLateActiveCard.diff(timeStartActiveCard, ["minutes"]);
    // console.log(diffLateTime.minutes);
    const [points, setPoints] = useState({
        x: 0,
        y: 0,
    });
    const [isActive, setIsActive] = useState(false);

    const subject = timetablethistime.subject;
    const teacher = timetablethistime.subject.teacher;
    const teacherFullName = `คุณครู${teacher.fName} ${teacher.lName}`

    const getSubjectCardStyle = (subject) => {
        // Generate a consistent color based on subject code
        const hash = subject.subCode.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        const hue = hash % 360;
        const saturation = 75 + (hash % 20);
        const lightness = 40 + (hash % 10);

        return {
            borderTop: `4px solid hsl(${hue}, ${saturation + 10}%, ${lightness - 10}%)`
        };
    };
    // const subjectStyle = getSubjectCardStyle(timetablethistime.subject);

    useEffect(() => {
        const handleClick = () => setClicked(false);
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <td
            style={getSubjectCardStyle(subject)}
            className="min-w-52 h-20 border border-gray-100 p-2 cursor-grab"
            draggable
            onDragStart={() => {
                setActiveCard(timetablethistime)
                setIsActive(true);
            }}
            onDragEnd={() => {
                setActiveCard(null)
                setIsActive(false);
            }}
            onDrop={() => {
                onDrop(weekday, schedule)
            }}
            onDragOver={e => e.preventDefault()}
            onContextMenu={(e) => {
                e.preventDefault();
                setClicked(true);
                setPoints({
                    x: e.clientX,
                    y: e.clientY,
                });
            }}
        >
            <div className={`${isActive && "opacity-50"} w-full h-full flex flex-col items-start space-y-1`}>
                <p className="text-sm font-medium text-gray-500">{subject.subCode}</p>
                <h5 className="text-base font-bold text-gray-800">{subject.subNameThai}</h5>
                <p className="text-sm font-medium text-gray-600 inline-flex items-center">
                    {subject.subNameEng}
                </p>
                <p className="text-sm font-medium text-gray-600 inline-flex items-center">
                    <BuildingIcon />
                    <span>{subject.subjectType.subTypeNameThai}</span>
                </p>

                <p className="text-sm font-medium text-gray-600 italic inline-flex items-center">
                    <UserIcon />
                    {teacherFullName}
                </p>
                <p className="text-xs font-medium text-gray-500">มาสายไม่เกิน {diffLateTime.minutes} นาที</p>
            </div>

            {clicked && (
                <div
                    className={`fixed w-[250px] box-border bg-white border border-gray-200 z-40`}
                    style={{
                        top: `${points.y}px`,
                        left: `${points.x}px`
                    }}
                >
                    <ul className="p-1">
                        <li
                            className="p-1 flex gap-2 group/item items-center text-sm hover:cursor-pointer hover:bg-gray-100 rounded"
                            onClick={() => callDeleteTimetableApi(timetablethistime, schedule)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            <p className="pt-1 group-hover/item:text-gray-700">ลบวิชานี้ออกจากคาบ</p>

                        </li>
                        <li
                            className="p-1 flex gap-2 group/item  items-center  text-sm hover:cursor-pointer hover:bg-gray-100 rounded"
                            onClick={() => handleFormEnable(timetablethistime, schedule)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            <p className="pt-1 group-hover/item:text-gray-700">แก้ไขเวลามาสายของวิชา</p>
                        </li>
                    </ul>
                </div>
            )}
        </td>
    );
};