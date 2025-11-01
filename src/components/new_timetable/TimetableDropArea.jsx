import { useState } from "react";
import { formatDayOfWeeks } from "../../helper";

export const TimetableDropArea = ({ schedule, weekday, onDrop }) => {
    return (
        <div
            className={`min-w-52 h-32 p-2`}
            onDrop={() => onDrop(weekday, schedule)}
            onDragOver={e => e.preventDefault()}
        >
            <p className="text-sm italic text-gray-600">
                {formatDayOfWeeks(weekday)} {schedule.timetableformate}
            </p>
            <p className="text-xs text-gray-400 italic mt-1">
                วางรายวิชาที่นี่
            </p>
        </div>
    );
};