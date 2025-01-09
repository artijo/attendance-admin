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
        const response = await axios.get(`${HOSTNAME}/a/calendarStudy?classroomId=${location.state.classroomId}`);
        setHolidayList(response.data);
    }



    useEffect(() => {
        fectHolidayList();
    }, []);

    return (
        <div>
                <FullCalendar
                plugins={[ dayGridPlugin, timegridPlugin, interactionPlugin]}
                timeZone="Asia/Bangkok"
                locale={"th"}
                height={600}
                eventDisplay="block"
                eventDidMount={(info) => {
                    // เพิ่ม cursor: pointer โดยใช้ JavaScript
                    info.el.style.cursor = 'pointer';
                }}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth, timeGridWeek, timeGridDay' //calendardetails.jsx,timeGridWeek,timeGridDay
                }}
                events={holidayList}
                allDayText="กี่โมง"
                buttonText={{
                    today: 'วันนี้',
                    month: 'เดือน',
                    week: 'สัปดาห์',
                    day: 'วัน',
                }}
                eventContent={(eventInfo) => {
                    // แสดงเฉพาะชื่อ event
                    return <span>{eventInfo.timeText} { eventInfo.event.title}</span>;
                }}
                
            />
        </div>
    )
};