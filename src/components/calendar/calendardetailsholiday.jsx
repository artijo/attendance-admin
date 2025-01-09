import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin  from "@fullcalendar/interaction"
import timegridPlugin from "@fullcalendar/timegrid"
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect, useState } from "react";

export const CalendarDetatils = ({classroomId}) => {
    // const navigate = useNavigate();
    const [holidayList, setHolidayList] = useState([]);
    
    const fectHolidayList = async () => {
        const response = await axios.get(`${HOSTNAME}/a/holidayCalendar?${classroomId}`);
        setHolidayList(response.data);
    }

    useEffect(() => {
        fectHolidayList();
    }, []);

    return (
        <div className="p-5 rounded-md shadow-md bg-white">
                <FullCalendar
                plugins={[ dayGridPlugin, timegridPlugin, interactionPlugin]}
                timeZone="Asia/Bangkok"
                locale={"th"}
                height={600}
                
                // initialView="dayGridMonth"
                // dateClick={handleDateClick}
                eventDisplay="block"
                eventTimeFormat={{
                    hour: undefined,
                    minute: undefined,
                }}
                eventDidMount={(info) => {
                    // เพิ่ม cursor: pointer โดยใช้ JavaScript
                    info.el.style.cursor = 'pointer';
                }}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth' //calendardetails.jsx,timeGridWeek,timeGridDay
                }}
                events={holidayList}
                // eventClick={(info) => {
                // directToEditFrom(info.event)
                
                // }}
            />
        </div>
        
    )
};