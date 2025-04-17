export const TimetableDropArea = ({schedule,weekday,onDrop}) => {
    return (
        <div 
            className="w-full h-28 flex flex-col justify-center items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            onDrop={() => onDrop(weekday, schedule)}
            onDragOver={e => e.preventDefault()}
        >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1 group-hover:bg-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-color-alt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <span className="text-xs text-text-color-alt">ลากไว้ตรงนี้</span>
        </div>
    );
};