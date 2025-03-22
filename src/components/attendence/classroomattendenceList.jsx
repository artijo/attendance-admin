import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";

export const ClassroomAttendenceList = ({ classLevel, academicYearTerm }) => {
    const [classrooms, setClassrooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchClassrooms = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${HOSTNAME}/a/classrooms/filterTA/${academicYearTerm}/${classLevel}`);
            if (response.status === 200) {
                setClassrooms(response.data);
            }
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลห้องเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(academicYearTerm !== "" && classLevel !== null){
            fetchClassrooms();
        }
    }, [academicYearTerm, classLevel]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg text-text-color font-heading flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        รายการห้องเรียนชั้น ม.{classLevel}
                    </h3>
                    
                    <div className="bg-gray-50 border border-line rounded-lg px-3 py-1.5">
                        <span className="text-sm text-text-color-alt font-body">จำนวนห้องเรียน:</span>
                        <span className="ml-1 font-medium text-primary">{classrooms.length} ห้อง</span>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt uppercase tracking-wider bg-gray-50 border-y border-line font-heading w-1/4">
                                    ห้องเรียน
                                </th>
                                <th className="px-6 py-3.5 text-left text-xs font-medium text-text-color-alt uppercase tracking-wider bg-gray-50 border-y border-line font-heading w-3/4">
                                    การจัดการ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {classrooms.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="bg-gray-100 text-gray-400 rounded-full p-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-text-color font-heading">ไม่พบข้อมูลห้องเรียน</h3>
                                            <p className="text-text-color-alt font-body">ยังไม่มีห้องเรียนในระดับชั้นนี้</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                classrooms.map((classroom) => (
                                    <tr key={classroom.classId} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 text-text-color font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 text-primary rounded-full p-1.5 flex-shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span className="inline-block bg-primary/10 text-primary rounded-md px-2.5 py-1 text-sm font-medium">
                                                        ม.{classroom.classLevel}/{classroom.classRoom}
                                                    </span>
                                                    {classroom.classroomType && (
                                                        <p className="text-xs text-text-color-alt mt-1">
                                                            {classroom.classroomType.classTypeNameThai}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link 
                                                to={`/attendances/details/${classroom.classId}`}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors duration-300"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                </svg>
                                                รายละเอียดการเข้าเรียน
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
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