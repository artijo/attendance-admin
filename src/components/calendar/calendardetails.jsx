import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin  from "@fullcalendar/interaction"
import timegridPlugin from "@fullcalendar/timegrid"
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CalendarDetatils = () => {
    const navigate = useNavigate();
    const [holidayList, setHolidayList] = useState([]);
    
    const fectHolidayList = async () => {
        const response = await axios.get(`${HOSTNAME}/a/holidayCalendar`);
        setHolidayList(response.data);

    }

    const directToEditFrom = (value) => {
        navigate("/editcalendar", {state: {title: value.title, startDate: value.startStr, endDate: value.endStr}})

        // info.event.title
        //        info.event.startStr
        //        info.event.endStr
    }

    useEffect(() => {
        fectHolidayList();
    }, []);

    return (
        <FullCalendar
            
            plugins={[ dayGridPlugin, timegridPlugin, interactionPlugin]}
            timeZone="Asia/Bangkok"
            locale={"th"}
            height={500}
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
            eventClick={(info) => {
               directToEditFrom(info.event)
               
            }}
        />
    )
};