import { useLocation } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect,useState } from "react";
import { AttendenceBySummaryByClassroomList } from "../../components/attendence/attendenceSummaryByClassroomList";
function AttendenceByClassroomDeatail() {
    const location = useLocation();
    const classroomId = location.state.classroomId;
    const studentList = location.state.studentList;
    const [classroomInfo, setClassroomInfo] = useState(null);
    const fetchClassroomInfo = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/classroom/${classroomId}`);
            setClassroomInfo(response.data);
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        fetchClassroomInfo();
    }, []);

    return (
        <div className="mx-auto container">
            {
                classroomInfo && (
                    <div className="mb-2">
                        <h1 className="mb-2">สรุปการเข้าเรียนตามห้อง {classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.term.semester}  ปีการศึกษา {classroomInfo.term.academicYear+543}</h1>
                    </div>
                )
            }
            <AttendenceBySummaryByClassroomList studentList={studentList} classroomId={classroomId}/>
        </div>
    );
};
export default AttendenceByClassroomDeatail;