import { formatDayOfWeeks } from "../../helper";
import { TimetableDropArea } from "./TimetableDropArea";
import { TimetableHasObjectDropArea } from "./TimetableHasObjectDropArea";

export const TimetableRow = ({ scheduleWeekDay, timeStudyList, date, setActiveCard, onDrop, callDeleteTimetableApi, handleFormEnable }) => {
    return (
        <tr>
            <th className="text-right pr-2">{formatDayOfWeeks(date)}</th>
            {timeStudyList.map((schedule, index) => {
                const timetablethistime = scheduleWeekDay.find((tt) => tt.timeStart === schedule.startDatabaseFormat);
                if (schedule.startDatabaseFormat === "12:00:00") {
                    return (
                        <td className="min-w-52 h-32 bg-white border border-gray-200" key={index}></td>
                    )
                } else if (!timetablethistime) {
                    return (
                        <td key={index} className="min-w-52 h-32 border border-gray-200 bg-gray-50">
                            <TimetableDropArea
                                schedule={schedule}
                                weekday={date}
                                onDrop={onDrop}
                            />
                        </td>
                    )
                } else {
                    return (
                        <TimetableHasObjectDropArea
                            timetablethistime={timetablethistime}
                            setActiveCard={setActiveCard}
                            schedule={schedule}
                            weekday={date}
                            onDrop={onDrop}
                            callDeleteTimetableApi={callDeleteTimetableApi}
                            handleFormEnable={handleFormEnable}
                            key={index}
                        />
                    )
                }
            })}
        </tr>
    );
};