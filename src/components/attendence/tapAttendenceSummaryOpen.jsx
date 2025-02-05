export const TapAttendenceSummaryOpen = ({children, isTabOpen, title, handleIsTabOpen, index}) => {
    return (
        <>
            <div>
                <div className="w-full px-9 h-12 mb-2 bg-white border rounded-lg flex justify-between items-center">
                    <span>{title}</span>
                    <div className={!isTabOpen[index] ? "block" : "hidden"} onClick={
                        () => { handleIsTabOpen(index); }
                    }>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    </div>
                    <div className={isTabOpen[index] ? "block" : "hidden"} onClick={
                        () => { handleIsTabOpen(index);}
                    }>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg>
                    </div>
                </div>
                <div className={`bg-white p-4 rounded-lg border ${isTabOpen[index] ? "block" : "hidden"}`}>
                    {children}
                </div>
            </div>
        </>
    );
};