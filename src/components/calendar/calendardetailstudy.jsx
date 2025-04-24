import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect, useState } from "react";

export const CalendarDetatils = ({classroom}) => {
    const [studyList, setStudyList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // console.log(classroom);
    const fectStudyList = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/fullcalendarStudyTime/${classroom.classroomId}`);
            setStudyList(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("ไม่สามารถโหลดข้อมูลวันเรียนได้");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fectStudyList();
        // console.log(studyList);
    }, []);

    // Customize the calendar appearance with consistent styling
    const calendarOptions = {
        initialView: "dayGridMonth",
        initialDate: studyList.length > 0 ? studyList[0].start : new Date(),
        plugins: [dayGridPlugin, timegridPlugin, interactionPlugin],
        timeZone: "Asia/Bangkok",
        locale: "th",
        height: 650,
        eventDisplay: "block",
        eventDidMount: (info) => {
            info.el.style.cursor = 'pointer';
            
            // Add tooltip with more details
            const tooltip = document.createElement('div');
            tooltip.classList.add('calendar-tooltip');
            tooltip.innerHTML = `
                <strong>${info.event.title}</strong><br>
                เวลา: ${info.timeText || 'ทั้งวัน'}<br>
            `;
            
            info.el.addEventListener('mouseover', () => {
                document.body.appendChild(tooltip);
                const rect = info.el.getBoundingClientRect();
                tooltip.style.position = 'absolute';
                tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.backgroundColor = 'white';
                tooltip.style.border = '1px solid #ddd';
                tooltip.style.borderRadius = '4px';
                tooltip.style.padding = '4px 8px';
                tooltip.style.fontSize = '12px';
                tooltip.style.zIndex = 1000;
                tooltip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
            
            info.el.addEventListener('mouseout', () => {
                if (document.body.contains(tooltip)) {
                    document.body.removeChild(tooltip);
                }
            });
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: studyList,
        allDayText: "ทั้งวัน",
        buttonText: {
            today: 'วันนี้',
            month: 'เดือน',
            week: 'สัปดาห์',
            day: 'วัน',
        },
        eventContent: (eventInfo) => {
            return (
                <div className="flex items-center gap-1 text-xs">
                    {eventInfo.timeText && (
                        <span className="font-medium">{eventInfo.timeText}</span>
                    )}
                    <span className="truncate">{eventInfo.event.title}</span>
                </div>
            );
        },
        eventColor: '#4F46E5', // Primary color for consistency
        themeSystem: 'standard',
        // Custom styling for calendar elements
        dayCellClassNames: 'text-sm p-1',
        dayHeaderClassNames: 'text-xs font-medium py-2',
        eventClassNames: 'rounded-md shadow-sm border-none',
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="calendar-container relative">
            {studyList.length > 0 ? (
                <div className="rounded-lg overflow-hidden border border-line">
                    <FullCalendar {...calendarOptions} />
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-text-color mb-2 font-heading">ไม่พบข้อมูลวันเรียน</h3>
                    <p className="text-text-color-alt font-body">ยังไม่มีวันเรียนที่กำหนดไว้ในห้องเรียนนี้</p>
                </div>
            )}

            {studyList.length > 0 && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-line">
                    <div className="text-sm text-text-color-alt font-body">
                        <span className="block font-medium text-text-color mb-1">คำอธิบาย:</span>
                        <ul className="space-y-1">
                            {/* <li className="flex items-center">
                                <span className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                                วันเรียนปกติตามตารางเรียน
                            </li> */}
                            <li className="flex items-center">
                                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                                วันเรียนปกติตามตารางเรียน
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};