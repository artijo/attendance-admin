import { PropTypes } from "prop-types";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect,useState} from "react";
import { Link } from "react-router-dom";
export const AttendenceBySubjectList = ({classroomId}) => {
    const [subjectList, setSubjectList] = useState([]);
    const page = Math.ceil(subjectList.length/5);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceSubjectList = subjectList.slice((seletedPage - 1) * 5, seletedPage * 5);


    const fetchData = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/subjectTimetable/${classroomId}`);  
            setSubjectList(response.data);
            // (console.log(response.data));
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if(classroomId == null) return;
        fetchData();
    }, [classroomId]);
    return (
        <>
            <span className="text-xs text-gray-500">จำนวนวิชามีอยู่ {subjectList.length} วิชา</span>
            <div className="grid gap-2 md:grid-cols-1">
                <div className="rounded-lg border border-gray-200">
                    <div className="overflow-x-auto rounded-t-lg">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วิชา</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ผู้สอน</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {
                                    sliceSubjectList.length > 0 ? 
                                        (
                                            sliceSubjectList.map((subject, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{`(${subject.subCode})${subject.subNameThai} - ${subject.subNameEng}`}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{`คุณครู ${subject.teacher.fName} ${subject.teacher.lName}`}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-blue-700 cursor-pointer">
                                                        <Link to={`/attendances/details/bysubject`} state={{subject:subject,classroomId:classroomId}}>
                                                            รายละเอียด
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : 
                                        <tr>
                                            <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700" colSpan={4}>ไม่มีข้อมูล</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    {Array.from({ length: page }, (_, i) => (
                        <button
                            key={i+1}
                            className={`px-4 py-2 ${seletedPage === i+1 ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setSeletedPage(i+1)}
                            type="button"
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </>
       
    )
}

AttendenceBySubjectList.propTypes = {
    classroomId: PropTypes.string.isRequired
};