import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { DateTime } from "luxon";
// import DeleteDialog from "../dialog/DeleteDialog";

export const TimetableHasObjectDropArea = ({ timetablethistime, setActiveCard, onDrop, schedule, weekday, callDeleteTimetableApi, handleFormEnable}) => {
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
    
    const getSubjectCardStyle = (subject) => {
        // Generate a consistent color based on subject code
        const hash = subject.subCode.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        const hue = hash % 360;
        const saturation = 75 + (hash % 20);
        const lightness = 40 + (hash % 10);

        return {
            backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            borderLeft: `4px solid hsl(${hue}, ${saturation + 10}%, ${lightness - 10}%)`
        };
    };
    const subjectStyle = getSubjectCardStyle(timetablethistime.subject);

    useEffect(() => {
        const handleClick = () => setClicked(false);
        window.addEventListener("click", handleClick);
        
        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);

    // useEffect(() => {
    //     if (deleteDiologShow === true) {
    //         console.log(true);
    //     }
    // }, [deleteDiologShow])

    return (
        <div
            className="w-full h-28 text-left transition-transform duration-150 active:opacity-70 active:cursor-grab"
            draggable
            onDragStart={() => setActiveCard(timetablethistime)}
            onDragEnd={() => setActiveCard(null)}
            onDrop={() => onDrop(weekday, schedule)}
            onDragOver={e => e.preventDefault()}
            onContextMenu={(e) => {
                e.preventDefault();
                setClicked(true);
                setPoints({
                    x: e.pageX,
                    y: e.pageY,
                });
                // console.log("Right Click", e.pageX, e.pageY);
            }}
        >
            <div
                className="h-full text-white flex flex-col relative"
                style={subjectStyle}
            >
                <div>
                    <h5 className="w-fit text-sm font-medium mb-1 line-clamp-2 mt-2 ml-2">
                        {timetablethistime.subject.subNameThai}
                    </h5>
                    <div className="text-xs bg-white/20 rounded px-1.5 py-0.5 w-fit ml-2 mb-1">
                        {timetablethistime.subject.subCode}
                    </div>
                    <div className="mt-auto text-xs ml-2">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {timetablethistime.subject.teacher?.fName} {timetablethistime.subject.teacher?.lName}
                        </div>
                    </div>
                    <p 
                        className="text-xs mt-3 ml-auto mr-2 w-fit px-1.5 py-0.5 bg-white/50 rounded"
                    >เลท {diffLateTime.minutes} นาที</p>
                </div>
            </div>
            {clicked && (
                <div
                    className={`fixed w-[250px] box-border bg-white border border-gray-200 z-50`}
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
            
        </div>
    );
};