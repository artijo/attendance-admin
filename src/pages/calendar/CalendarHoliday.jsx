import { CalendarDetatils } from "../../components/calendar/calendardetailsholiday.jsx"
import { useLocation } from "react-router-dom"

export const CalendarHoliday = () => {
    const location = useLocation();
    const classroomInfo = location.state.classroomInfo;
    return (
        <div>
            <div>
                <h1>ปฎิทินวันหยุด</h1>
                <p>
                    ห้อง {classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.semester}  ปีการศึกษา {classroomInfo.academicYear}
                </p>
            </div>
            
            <div className="container mt-2">
                <CalendarDetatils classroomId={location.state.classroomId}/>
            </div>
        </div>
    )
}