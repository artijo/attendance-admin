import { useLocation } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect,useState } from "react";
import { AttendenceBySubjectDetailList} from "../../components/attendence/attendenceBySubjectDetailList";
function AttendenceSubjectDetail() {
    const location = useLocation();
    const [studentList, setStudentList] = useState(null);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const fetchClassroomInfo = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/classroom/${location.state.classroomId}`);
            setClassroomInfo(response.data);
        } catch (error) {
            console.error(error);
        };
    };
    const fecthData = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/attendence/${location.state.subject.subId}/${location.state.classroomId}`);
            setStudentList(response.data);
            console.log(response.data);
        }catch(error){
            console.error(error);
        };
    };

    useEffect(() => {
        fecthData();
        fetchClassroomInfo();
    }, []);

    return (
        <div className="mx-auto container">
            {
                classroomInfo && (
                    <div className="mb-2">
                        <h1 className="mb-2">การเข้าเรียนของ {classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.term.semester}  ปีการศึกษา {classroomInfo.term.academicYear+543}</h1>
                        <p>
                            ห้อง {classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.term.semester}  ปีการศึกษา {classroomInfo.term.academicYear+543}
                        </p>
                        <p>
                            วิชา {location.state.subject.subNameThai}({location.state.subject.subCode} - {location.state.subject.subNameEng})
                        </p>
                    </div>
                )
            }
            <AttendenceBySubjectDetailList studentList={studentList} />
        </div>
    );
};
export default AttendenceSubjectDetail;