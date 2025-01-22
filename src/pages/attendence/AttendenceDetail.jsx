import { useParams } from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import { HOSTNAME } from "../../config";
import { AttendenceByDayList } from "../../components/attendence/attendenceByDayList";
import { AttendenceBySubjectList } from "../../components/attendence/attendenceBySubjectList";
function AttendanceDetail() {
    const params = useParams();
    const [classroomInfo, setClassroomInfo] = useState(null);
    const fetchClassroomInfo = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/classroom/${params.id}`);
            setClassroomInfo(response.data);
        } catch (error) {
            console.error(error);
        };
    };
    useEffect(() => {
        fetchClassroomInfo();
    },[]);
    return (
        <div className="mx-auto container">
            {classroomInfo != null && <h5 className="text-base text-gray-500">(ห้อง ม.{classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.term.semester}  ปีการศึกษา {classroomInfo.term.academicYear+543})</h5>}
            <div className="grid grid-cols-1 gap-2">
                <h1>การเข้าเรียนตามวัน</h1>
                <div>
                    {classroomInfo != null && <AttendenceByDayList termId={classroomInfo != null && classroomInfo.term.termId} classroomId={classroomInfo != null && classroomInfo.classId} />}
                </div>
                <h1>การเข้าเรียนตามรายวิชา</h1>
                <div>
                    {classroomInfo != null && <AttendenceBySubjectList classroomId={classroomInfo != null && classroomInfo.classId} />}
                </div>
            </div>
        </div>
    );
};
export default AttendanceDetail;
