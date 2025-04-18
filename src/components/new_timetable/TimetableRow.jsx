import { formatDayOfWeeks } from "../../helper";
import { TimetableDropArea } from "./TimetableDropArea";
import { TimetableHasObjectDropArea } from "./TimetableHasObjectDropArea";

export const TimetableRow = ({ scheduleWeekDay, timeStudyList, date, setActiveCard, onDrop, callDeleteTimetableApi }) => {
    return (
        <tr>
            <th className="px-4 py-2 border bg-gray-50 text-center w-10">
                <div className="text-sm font-medium text-text-color font-heading">
                    {formatDayOfWeeks(date)}
                </div>
            </th>
            {timeStudyList.map((schedule, index) => {
                const timetablethistime = scheduleWeekDay.find((tt) => tt.timeStart === schedule.startDatabaseFormat);
                if (schedule.startDatabaseFormat === "12:00:00") {
                    return (
                        <td key={index} className="border border-gray-100 p-0 ">
                            <div className="flex flex-col justify-center items-center h-28 bg-amber-100 p-2 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-text-color">พักเที่ยง</span>
                                <span className="text-xs text-text-color-alt">12:00 - 13:00</span>
                            </div>
                        </td>
                    )
                } else if (!timetablethistime) {
                    return (
                        <td key={index} className="border border-gray-100 p-0">
                            <TimetableDropArea 
                                schedule={schedule}
                                weekday={date}
                                onDrop={onDrop}
                            />
                        </td>
                    )
                } else {
                    return (
                        <td key={index} className="border border-gray-100 p-0 ">
                            <TimetableHasObjectDropArea
                                timetablethistime={timetablethistime}
                                setActiveCard={setActiveCard}
                                schedule={schedule}
                                weekday={date}
                                onDrop={onDrop}
                                callDeleteTimetableApi={callDeleteTimetableApi}
                            />
                        </td>
                    )
                }
            })}
        </tr>
    );
};