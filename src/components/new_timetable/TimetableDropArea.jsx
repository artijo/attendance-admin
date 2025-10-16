import { useState } from "react";

export const TimetableDropArea = ({schedule,weekday,onDrop}) => {
    return (
        <div 
            className={`w-full h-[150px] flex flex-col justify-center items-center bg-gray-200/30 border border-gray-200 `}
            onDrop={() => onDrop(weekday, schedule)}
            onDragOver={e =>e.preventDefault()}
        ></div>
    );
};