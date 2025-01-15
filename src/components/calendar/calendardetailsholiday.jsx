import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin  from "@fullcalendar/interaction"
import timegridPlugin from "@fullcalendar/timegrid"
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const CalendarDetatils = () => {
    const location = useLocation();
    const [holidayList, setHolidayList] = useState([]);
    
    const fectHolidayList = async () => {
        const response = await axios.get(`${HOSTNAME}/a/fullcalendarHoliday/${location.state.classroomId}`);
        setHolidayList(response.data);
    }

    useEffect(() => {
        fectHolidayList();
    }, []);

    return (
        <div>
            {
                holidayList.length > 0 && 
                    <FullCalendar
                        plugins={[ dayGridPlugin, timegridPlugin, interactionPlugin]}
                        timeZone="Asia/Bangkok"
                        locale={"th"}
                        height={600}
                        initialView="dayGridMonth"
                        initialDate={holidayList[0].start}
                        // initialView="dayGridMonth"
                        // dateClick={handleDateClick}
                        eventDisplay="block"
                        // eventTimeFormat={{
                        //     hour: undefined,
                        //     minute: undefined,
                        //     second: undefined,
                        //     day: undefined,
                        //     weekday: undefined,
                        //     month: undefined,
                        //     year: undefined,
                        // }}  
                        eventDidMount={(info) => {
                            // เพิ่ม cursor: pointer โดยใช้ JavaScript
                            info.el.style.cursor = 'pointer';
                        }}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth' //calendardetails.jsx,timeGridWeek,timeGridDay
                        }}
                        eventContent={(eventInfo) => {
                            // แสดงเฉพาะชื่อ event
                            return <span>{eventInfo.event.title}</span>;
                        }}
                        events={holidayList}
                        allDayText="กี่โมง"
                        buttonText={{
                            today: 'วันนี้',
                            month: 'เดือน',
                            week: 'สัปดาห์',
                            day: 'วัน',
                        }}
                        // eventClick={(info) => {
                        // directToEditFrom(info.event)
                        
                        // }}
                    />
            }
            {
                holidayList.length == 0 &&
                <div>ไม่มีรายการวันหยุด</div>
            }
                
        </div>
        
    )
};