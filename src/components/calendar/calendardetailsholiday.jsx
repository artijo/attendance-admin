import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const CalendarDetatils = () => {
    const location = useLocation();
    const [holidayList, setHolidayList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    console.log(holidayList);
    
    const fetchHolidayList = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/fullcalendarHoliday/${location.state.classroomId}`);
            setHolidayList(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("ไม่สามารถโหลดข้อมูลวันหยุดได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidayList();
    }, []);

    // Customize the calendar appearance with consistent styling
    const calendarOptions = {
        plugins: [dayGridPlugin, timegridPlugin, interactionPlugin],
        timeZone: "Asia/Bangkok",
        locale: "th",
        height: 650,
        initialView: "dayGridMonth",
        initialDate: holidayList.length > 0 ? holidayList[0].start : new Date(),
        eventDisplay: "block",
        eventDidMount: (info) => {
            info.el.style.cursor = 'pointer';
            
            // Add tooltip with more details
            const tooltip = document.createElement('div');
            tooltip.classList.add('calendar-tooltip');
            tooltip.innerHTML = `
                <strong>${info.event.title}</strong><br>
                ประเภท: ${info.event.backgroundColor === 'red' ? 'วันหยุดราชการ' : 'วันหยุดโรงเรียน'}<br>
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
            right: 'dayGridMonth'
        },
        events: holidayList,
        allDayText: "ทั้งวัน",
        buttonText: {
            today: 'วันนี้',
            month: 'เดือน',
            week: 'สัปดาห์',
            day: 'วัน',
        },
        eventContent: (eventInfo) => {
            return (
                <div className="flex items-center px-1">
                    <div className={`w-2 h-2 rounded-full mr-1.5 ${eventInfo.event.backgroundColor === '#EF4444' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
                    <span className="text-xs font-medium truncate">{eventInfo.event.title}</span>
                </div>
            );
        },
        // Custom styling for calendar elements
        dayCellClassNames: 'text-sm p-1',
        dayHeaderClassNames: 'text-xs font-medium py-2',
        eventClassNames: 'rounded-md shadow-sm border-none',
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
            {holidayList.length > 0 ? (
                <div className="rounded-lg overflow-hidden border border-line">
                    <FullCalendar {...calendarOptions} />
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-text-color mb-2 font-heading">ไม่พบข้อมูลวันหยุด</h3>
                    <p className="text-text-color-alt font-body">ยังไม่มีวันหยุดที่กำหนดไว้ในห้องเรียนนี้</p>
                    <div className="mt-4">
                        <Link 
                            to="/holiday" 
                            className="inline-flex items-center text-primary hover:text-accent font-body"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            จัดการวันหยุด
                        </Link>
                    </div>
                </div>
            )}

            {holidayList.length > 0 && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-line">
                    <div className="text-sm text-text-color-alt font-body">
                        <span className="block font-medium text-text-color mb-1">คำอธิบาย:</span>
                        <ul className="space-y-1">
                            <li className="flex items-center">
                                <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
                                วันหยุดราชการและวันหยุดนักขัตฤกษ์
                            </li>
                            <li className="flex items-center">
                                <span className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                                วันหยุดของโรงเรียนและวันหยุดพิเศษ
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};