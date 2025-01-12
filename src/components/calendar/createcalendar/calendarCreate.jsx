import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/timegrid";
import "./calendar.css";

export const CreateCalendar = ({ holidayList, setStartDate, setEndDate }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const newHolidayList = holidayList.map((holiday) => ({
        title: holiday.holidayName,
        start: holiday.sDate,
        end: holiday.eDate,
        color: holiday.color
    }));
    const handleDateClick = (info) => {
        if (selectedDate === info.dateStr) {
            setSelectedDate(""); // ยกเลิกการเลือกถ้าคลิกวันเดิม
            setStartDate("");
            setEndDate("");
        } else {
            setSelectedDate(info.dateStr); // เลือกวันใหม่
            setStartDate(info.dateStr);
            setEndDate(info.dateStr);
        }
    };
    return (
        <div className="calendar-create">
            <FullCalendar
                plugins={[dayGridPlugin, timegridPlugin, interactionPlugin]}
                timeZone="Asia/Bangkok"
                locale={"th"}
                height={600}
                eventDisplay="block"
                eventDidMount={(info) => {
                    info.el.style.cursor = "pointer";
                }}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth, timeGridWeek, timeGridDay",
                }}
                allDayText="กี่โมง"
                buttonText={{
                    today: "วันนี้",
                    month: "เดือน",
                    week: "สัปดาห์",
                    day: "วัน",
                }}
                events={newHolidayList}
                dateClick={handleDateClick}
                dayCellClassNames={(info) =>
                    selectedDate === info.date.toISOString().split("T")[0]
                        ? "selected-day"
                        : ""
                }
                eventContent={(eventInfo) => {
                    return <span>{eventInfo.event.title}</span>;
                }}
            />
        </div>
    );
};
