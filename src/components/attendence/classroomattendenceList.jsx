import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
export const ClassroomAttendenceList = ({ classLevel, academicYearTerm }) => {
    const [classrooms, setClassrooms] = useState([]);
    
    const fecthClassrooms = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/classrooms/filterTA/${academicYearTerm}/${classLevel}`);
            if (response.status === 200) {
                setClassrooms(response.data);
            };
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        if(academicYearTerm !== "" && classLevel !== null){
            fecthClassrooms();
        }
    }, [academicYearTerm, classLevel]);

    return (
        <div className="grid gap-2 md:grid-cols-1">
            <div className="border shadow-md border-gray-200">
                <div className="overflow-x-auto ">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr className="h-12 shadow-md">
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชั้นมัธยมศึกษา</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ห้องเรียน</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รายละเอียดการเข้าเรียน</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {
                                classrooms.length === 0 ? 
                                    <tr>
                                        <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700" colSpan={3}>ไม่มีข้อมูล</td>
                                    </tr> :
                                classrooms.map((classroom) => (
                                    <tr key={classroom.classId} className="even:bg-slate-100/70 text-center" >
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.classLevel}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.classRoom}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            <Link to={`/attendances/details/${classroom.classId}`}>
                                                <button className="cursor-pointer bg-blue-300/60 text-blue-500 px-5 py-[2px] rounded-sm hover:bg-blue-300/100 hover:text-blue-700">รายละเอียดการเข้าเรียน</button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    );
};

ClassroomAttendenceList.propTypes = {
    classLevel: PropTypes.number.isRequired,
    academicYearTerm: PropTypes.string.isRequired,
};