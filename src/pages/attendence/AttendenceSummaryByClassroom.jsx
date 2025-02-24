import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect,useState } from "react";
import { AttendenceBySummaryByClassroomList } from "../../components/attendence/attendenceSummaryByClassroomList";
import { Link } from "react-router-dom";

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
        <>
            <div>
                <Link
                    state={{
                        classroomId: classroomId,
                        studentList: studentList
                    }}
                    to={'/attendances/details/byclassroom'}
                >
                    <button className="cursor-pointer bg-blue-300/60 text-blue-500 px-5 py-[2px] rounded-sm hover:bg-blue-300/100 hover:text-blue-700 mx-6">รายละเอียด</button>
                </Link>
            </div>
            
        </>
       
    );
};

export default AttendenceSummaryByClassroom;