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
    const [studyList, setStudyList] = useState([]);
    
    const fectStudyList = async () => {
        const response = await axios.get(`${HOSTNAME}/a/fullcalendarStudyTime/${location.state.classroomId}`);
        // console.log(response.data);
        setStudyList(response.data);
    }

    useEffect(() => {
        fectStudyList();
    }, []);

    return (
        <div>
            {
                studyList.length > 0 && 
                    <FullCalendar
                    initialView="dayGridMonth"
                    initialDate={studyList[0].start}
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
                    events={studyList}
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
            }
            {
                studyList.length == 0 &&
                <div>ไม่มีรายการวันเรียน</div>
            }
           
        </div>
    )
};