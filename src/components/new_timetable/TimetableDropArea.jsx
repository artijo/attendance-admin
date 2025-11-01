import { useState } from "react";

export const TimetableDropArea = ({schedule,weekday,onDrop}) => {
    return (
        <div 
            className={`min-w-52 h-32 `}
            onDrop={() => onDrop(weekday, schedule)}
            onDragOver={e =>e.preventDefault()}
        ></div>
    );
};