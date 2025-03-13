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
                <span className='inline-flex overflow-hidden rounded-md border bg-white shadow-sm'>
                    <Link state={{ classroomId: classroomId, studentList: studentList }} to={'/attendances/details/byclassroom'}>
                        <button 
                            
                            className="inline-flex p-3 text-blue-600 hover:bg-gray-50 focus:relative"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                            </svg>
                            รายละเอียด
                        </button>
                    </Link>
                </span>
                
            </div>
        </>
    );
};

export default AttendenceSummaryByClassroom;