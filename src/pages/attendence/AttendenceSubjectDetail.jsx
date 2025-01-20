import { useLocation } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect,useState } from "react";
import { AttendenceBySubjectDetailList} from "../../components/attendence/attendenceBySubjectDetailList";
function AttendenceSubjectDetail() {
    const location = useLocation();
    const [studentList, setStudentList] = useState([]);
    const fecthData = async (req, res) => {
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
    }, []);

    return (
        <div>
            <AttendenceBySubjectDetailList studentList={studentList} />
        </div>
    );
};
export default AttendenceSubjectDetail;