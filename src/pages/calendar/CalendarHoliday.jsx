import { CalendarDetatils } from "../../components/calendar/calendardetailsholiday.jsx"
import { useLocation } from "react-router-dom"

export const CalendarHoliday = () => {
    const location = useLocation();
    const classroomInfo = location.state.classroomInfo;
    return (
        <div className="container mx-auto">
            <div>
                <h1 className="mb-2">ปฎิทินวันหยุด</h1>
                <p>
                    ห้อง {classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.term.semester}  ปีการศึกษา {classroomInfo.term.academicYear+543}
                </p>
            </div>
            
            <div className="p-5 rounded-md shadow-md bg-white mt-2">
                <div className="flex gap-2 text-sm mb-2 mx-auto w-fit">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500"></div>
                        <span>วันหยุดราชการ</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500"></div>
                        <span>วันหยุดของโรงเรียน</span>
                    </div>
                </div>
                <CalendarDetatils classroomId={location.state.classroomId}/>
               
            </div>
        </div>
    )
}
