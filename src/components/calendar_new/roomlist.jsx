import axios from "axios";
import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
export const RoomList = ({ academicYearTermId } ) => {
    const [classrooms, setClassrooms] = useState([]);
    const fecthClassrooms = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/classrooms/byterm/${academicYearTermId}`);
            if(response.status === 200){
                setClassrooms(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fecthClassrooms();
    }, [academicYearTermId]);

    return(
        <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ระดับชั้น</th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ห้องเรียน</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                            {
                                classrooms.length > 0 && classrooms.map((classroom) => (
                                    <tr key={classroom.classId}>
                                        <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700">{classroom.classLevel}</td>
                                        <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700">{classroom.classRoom}</td>
                                        <td className="whitespace-nowrap text-center px-4 py-2 text-blue-700 cursor-pointer"><Link to="/calendarstudy" state={{classroomId:classroom.classId,classroomInfo:classroom}}>ปฎิทินการเรียน</Link></td>
                                        <td className="whitespace-nowrap text-center px-4 py-2 text-blue-700 cursor-pointer"><Link to="/calendarholiday" state={{classroomId:classroom.classId,classroomInfo:classroom}}>ปฎิทินวันหยุด</Link></td>      
                                    </tr>
                                ))
                            }
                            {
                                classrooms.length === 0 && (
                                    <tr>
                                        <td colSpan="2" className="whitespace-nowrap text-center px-4 py-2 text-gray-700">ไม่มีห้องเรียน</td>
                                    </tr>
                                )
                            }
                    </tbody>
                </table>
            </div>
        </div>
    );
} 

// {classrooms.map((classroom) => (
                    //     <tr key={classroom.classId}>
                        
                    //     <td className="whitespace-nowrap px-4 py-2 text-gray-700"><Link to={`/classroom/${classroom.classId}`} className="hover:bg-gray-100">{classroom.classLevel}/{classroom.classRoom}</Link></td>
                        
                    //     <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.classroomType.classTypeNameThai}</td>

                    //     <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.term.academicYear+543}</td>
                    //     <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.term.semester}</td>
                        
                    //     <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    //         <Link to={`/timetable/${classroom.classId}`} > <span className="underline text-blue-800">ตารางเรียน</span> </Link>
                    //     </td>
                    //     </tr>
                    // ))}