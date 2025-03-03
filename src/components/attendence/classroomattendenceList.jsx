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
        <div>
            <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-2xl">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">ห้อง</th>
                                <th className="px-6 py-3">รายละเอียดการเข้าเรียน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                classrooms.length === 0 ? 
                                    <tr>
                                        <td colSpan={2} className="whitespace-nowrap text-center px-4 py-2 text-gray-700">
                                            <span className="flex flex-col items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                                </svg>
                                                ไม่พบข้อมูลห้องเรียน
                                            </span>
                                        </td>
                                    </tr> :
                                classrooms.map((classroom) => (
                                    <tr key={classroom.classId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200" >
                                        <td className="px-6 py-4">{classroom.classLevel}/{classroom.classRoom}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/attendances/details/${classroom.classId}`}>
                                                <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm'">
                                                    <button 
                                                        className="flex gap-2 p-3 text-blue-600 hover:bg-gray-50 focus:relative"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                                        </svg>

                                                        รายละเอียดการเข้าเรียน
                                                    </button>
                                                </span>
                                                
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