import { CalendarDetatils } from "../../components/calendar/calendardetailstudy.jsx"
import { useLocation } from "react-router-dom";

export const CalendarStudy = () => {
    const location = useLocation();
    const classroomInfo = location.state.classroomInfo;
    return (
        <div className="container mx-auto">
            <div>
                <h1 className="mb-2">ปฎิทินการเรียน</h1>
                <p>
                ห้อง {classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.term.semester}  ปีการศึกษา {classroomInfo.term.academicYear+543}
                </p>
            </div>
            <div className="p-5 rounded-md shadow-md bg-white mt-2">
                <CalendarDetatils classroomId={location}/>
            </div>
        </div>
    )
}