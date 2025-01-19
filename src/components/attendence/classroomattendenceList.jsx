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
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr>
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
                                    <tr key={classroom.classId}>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.classLevel}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.classRoom}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            <Link to={`/attendances/details/${classroom.classId}`}>
                                                <span className="text-blue-800">รายละเอียดการเข้าเรียน</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            }
                            {/* {
                                sliceHolidayList.length > 0 ? 
                                    (
                                        sliceHolidayList.map((holiday, index) => (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{holiday.holidayname}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThai(holiday.startDate)}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThai(holiday.endDate)}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatTypeToThai(holiday.type)}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-red-600 cursor-pointer" onClick={() => handleDeleteHoliday(holiday.id)}>ลบ</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-yellow-600 cursor-pointer">
                                                    <Link to={`/holiday/edit/${holiday.id}`}>
                                                        แก้ไข
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : 
                                    <tr>
                                        <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700" colSpan={4}>ไม่มีข้อมูล</td>
                                    </tr>
                            } */}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                {/* {Array.from({ length: page }, (_, i) => (
                    <button
                        key={i+1}
                        className={`px-4 py-2 ${seletedPage === i+1 ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setSeletedPage(i+1)}
                        type="button"
                    >
                        {i + 1}
                    </button>
                ))} */}
            </div>
        </div> 
    );
};

ClassroomAttendenceList.propTypes = {
    classLevel: PropTypes.number.isRequired,
    academicYearTerm: PropTypes.string.isRequired,
};