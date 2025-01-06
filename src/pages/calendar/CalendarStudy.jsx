import { CalendarDetatils } from "../../components/calendar/calendardetailstudy.jsx"
import { useLocation } from "react-router-dom";

export const CalendarStudy = () => {
    const location = useLocation();
    const classroomInfo = location.state.classroomInfo;
    return (
        <div>
            <div>
                <h1>ปฎิทินการเรียน</h1>
                <p>
                    ห้อง {classroomInfo.classLevel}/{classroomInfo.classRoom} ภาคเรียนที่ {classroomInfo.semester}  ปีการศึกษา {classroomInfo.academicYear}
                </p>
            </div>
            <div className="container mt-2">
                <CalendarDetatils classroomId={location}/>
            </div>
        </div>
    )
}