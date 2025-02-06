import axios from "axios";
import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
export const RoomList = ({ academicYearTermId } ) => {
    const [classrooms, setClassrooms] = useState([]);
    const page = Math.ceil(classrooms.length/12);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceHolidayList = classrooms.slice((seletedPage - 1) * 12, seletedPage * 12);
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

    const handelDeleteStudingTime = async (classroomId) => {
        try {
            const text = "คุณต้องการจะลบปฎิทินหรือไม่"
            if(!confirm(text)) return;
            const response = await axios.delete(`${HOSTNAME}/a/studingtime/${classroomId}`);
            if(response.status === 200){
                fecthClassrooms();
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(academicYearTermId){
            fecthClassrooms();
        }
    }, [academicYearTermId]);

    return(
        <div>
        <div className="border shadow-md border-gray-200 mb-2">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr className="h-12 shadow-md">
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ระดับชั้น</th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ห้องเรียน</th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ปฎิทิน</th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">จัดการ</th>
                            
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                            {
                                sliceHolidayList.length > 0 && sliceHolidayList.map((classroom) => (
                                    <tr key={classroom.classId} className="even:bg-slate-100/70 text-center">
                                        <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700">{classroom.classLevel}</td>
                                        <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700">{classroom.classRoom}</td>

                                        <td className="whitespace-nowrap text-center px-4 py-2 flex gap-2 justify-center">
                                            <Link to="/calendarstudy" className="cursor-pointer bg-blue-300/60 text-blue-500 px-5 py-[2px] rounded-sm hover:bg-blue-300/100 hover:text-blue-700" state={{classroomId:classroom.classId,classroomInfo:classroom}}>
                                                ปฎิทินการเรียน
                                            </Link>
                                            <Link to="/calendarholiday" className="cursor-pointer bg-blue-300/60 text-blue-500 px-5 py-[2px] rounded-sm hover:bg-blue-300/100 hover:text-blue-700" state={{classroomId:classroom.classId,classroomInfo:classroom}}>
                                                ปฎิทินวันหยุด
                                            </Link>
                                        </td>
                                    
                                        <td className="whitespace-nowrap text-center px-4 py-2 text-red-700 cursor-pointer" onClick={() => handelDeleteStudingTime(classroom.classId)}>
                                            <button className="cursor-pointer bg-red-200 text-red-600 px-5 py-[2px] rounded-sm hover:bg-red-400 hover:text-red-700">
                                                ลบปฎิทิน
                                            </button>
                                            
                                        </td>
                                             
                                    </tr>
                                ))
                            }
                            {
                                sliceHolidayList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="whitespace-nowrap text-center px-4 py-2 text-gray-700">ไม่มีห้องเรียน</td>
                                    </tr>
                                )
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
        
    );
} 

RoomList.propTypes = {
    academicYearTermId: PropTypes.string.isRequired,
};