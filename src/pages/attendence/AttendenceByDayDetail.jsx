import { useLocation } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect,useState } from "react";
import { AttendanceByDayDetailList } from "../../components/attendence/attendenceByDayDetailList";
function AttendenceByDayDetail() {
    const location = useLocation();
    const [studentList, setStudentList] = useState([]);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const classroomId = location.state.classroomId;
    const date = location.state.date;
    const fetchClassroomInfo = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/classroom/${location.state.classroomId}`);
            console.log(response.data);
            setClassroomInfo(response.data);
        } catch (error) {
            console.error(error);
        };
    };
    
    const fecthData = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/attendence/byDate/${date}/${classroomId}`);
            console.log(response.data);
            setStudentList(response.data);
        }catch(error){
            console.error(error);
        }
    };


    useEffect(() => {
        fecthData();
        fetchClassroomInfo();
    },[]);
    return (
        <div className="mx-auto container">
            {
                classroomInfo && (
                    <div className="mb-2">
                        <h1 className="mb-2">การเข้าเรียนของ {classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.term.semester}  ปีการศึกษา {classroomInfo.term.academicYear+543}</h1>
                        <p>
                            ห้อง {classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.term.semester}  ปีการศึกษา {classroomInfo.term.academicYear+543}
                        </p>
                    </div>
                )
            }
            
            {studentList && <AttendanceByDayDetailList studentList={studentList} date={date}/>}
        </div>
    );
};

export default AttendenceByDayDetail;