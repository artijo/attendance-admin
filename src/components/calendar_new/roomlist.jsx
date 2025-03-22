import axios from "axios";
import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const RoomList = ({ academicYearTermId, selectedClassLevel }) => {
    const [classrooms, setClassrooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const filterClassLevel = (classrooms) => {
        const filteredClassrooms = classrooms.filter(
            (classroom) => classroom.classLevel === parseInt(selectedClassLevel)
        );
        setClassrooms(filteredClassrooms);
    };

    const fetchClassrooms = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${HOSTNAME}/a/classrooms/byterm/${academicYearTermId}`
            );
            if (response.status === 200) {
                filterClassLevel(response.data);
                setError(null);
            }
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลห้องเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (academicYearTermId) {
            fetchClassrooms();
        }
    }, [academicYearTermId, selectedClassLevel]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-lg font-medium text-text-color font-heading">ห้องเรียนระดับชั้นมัธยมศึกษาปีที่ {selectedClassLevel}</h3>
                </div>
                <div className="bg-gray-50 border border-line rounded-lg px-3 py-1.5">
                    <span className="text-sm text-text-color-alt font-body">จำนวนห้องเรียนทั้งหมด:</span>
                    <span className="ml-1 font-medium text-primary">{classrooms.length} ห้อง</span>
                </div>
            </div>

            {classrooms.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-text-color font-heading mb-2">ไม่พบห้องเรียน</h3>
                    <p className="text-text-color-alt font-body">ไม่มีห้องเรียนในระดับชั้นที่เลือก</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {classrooms.map((classroom) => (
                        <div 
                            key={classroom.classId} 
                            className="bg-white rounded-xl border border-line shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30"
                        >
                            <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 text-primary rounded-full p-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-color font-heading">
                                            ม.{classroom.classLevel}/{classroom.classRoom}
                                        </h3>
                                    </div>
                                    <div className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-1 text-xs font-medium">
                                        {classroom.classroomType.classTypeNameThai}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Link 
                                        to="/timetable"
                                        state={{ classroom: classroom }}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                        ตารางเรียน
                                    </Link>

                                    <Link
                                        to="/calendarstudy"
                                        state={{
                                            classroomId: classroom.classId,
                                            classroomInfo: classroom,
                                        }}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-primary/90 bg-primary text-sm font-medium text-white hover:bg-accent transition-colors duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        ปฏิทินการเรียน
                                    </Link>

                                    <Link
                                        to="/calendarholiday"
                                        state={{
                                            classroomId: classroom.classId,
                                            classroomInfo: classroom,
                                        }}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-rose-600/90 bg-rose-600 text-sm font-medium text-white hover:bg-rose-700 transition-colors duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        ปฏิทินวันหยุด
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

RoomList.propTypes = {
    academicYearTermId: PropTypes.string.isRequired,
    selectedClassLevel: PropTypes.string.isRequired,
};
