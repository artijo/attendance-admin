import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect,useState } from "react";
import { AttendenceBySummaryByClassroomList } from "../../components/attendence/attendenceSummaryByClassroomList";

function AttendenceSummaryByClassroom({classroomId}){
    const [studentList, setStudentList] = useState([]);
    const fecthData = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/atttendence/byClassroom/${classroomId}`);
            setStudentList(response.data);
        }catch(error){
            console.error(error);
        };
    };
    useEffect(() => {
        fecthData();
    },[]);

    return(
        <AttendenceBySummaryByClassroomList studentList={studentList}/>
    );
};

export default AttendenceSummaryByClassroom;