export const TimetableHasObjectDropArea = ({ timetablethistime, setActiveCard, onDrop, schedule, weekday }) => {
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
    return (
        <div
            className="w-full h-28 text-left transition-transform duration-150 hover:scale-[1.02] active:opacity-70 active:cursor-grab"
            draggable
            onDragStart={() => setActiveCard(timetablethistime)}
            onDragEnd={() => setActiveCard(null)}
            onDrop={() => onDrop(weekday, schedule)}
            onDragOver={e => e.preventDefault()}
        >
            <div
                className="h-full p-3 text-white flex flex-col"
                style={subjectStyle}
            >
                <h5 className="text-sm font-medium mb-1 line-clamp-2">
                    {timetablethistime.subject.subNameThai}
                </h5>
                <div className="text-xs bg-white/20 rounded px-1.5 py-0.5 w-fit mb-1">
                    {timetablethistime.subject.subCode}
                </div>
                <div className="mt-auto text-xs">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {timetablethistime.subject.teacher?.fName} {timetablethistime.subject.teacher?.lName}
                    </div>
                </div>
            </div>
        </div>


    );
};