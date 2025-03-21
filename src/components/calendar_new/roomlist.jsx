import axios from "axios";
import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const RoomList = ({ academicYearTermId, selectedClassLevel }) => {
    const [classrooms, setClassrooms] = useState([]);

    const filterClassLevel = (classrooms) => {
        const filteredClassrooms = classrooms.filter(
            (classroom) => classroom.classLevel === parseInt(selectedClassLevel)
        );
        setClassrooms(filteredClassrooms);
    };

    const fetchClassrooms = async () => {
        try {
            const response = await axios.get(
                `${HOSTNAME}/a/classrooms/byterm/${academicYearTermId}`
            );
            if (response.status === 200) {
                filterClassLevel(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteStudyingTime = async (classroomId) => {
        try {
            const text = "คุณต้องการจะลบปฎิทินหรือไม่";
            if (!confirm(text)) return;

            const response = await axios.delete(
                `${HOSTNAME}/a/studingtime/${classroomId}`
            );
            if (response.status === 200) {
                fetchClassrooms();
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (academicYearTermId) {
            fetchClassrooms();
        }
    }, [academicYearTermId, selectedClassLevel]);

    return (
        <div>
            <p className="text-gray-500 md:text-xs ml-2 mb-2">จำนวนห้องที่แสดง {classrooms.length} ห้อง</p>
            {
                !classrooms.length > 0 && (
                    <div>
                        <span className="flex flex-col items-center justify-center gap-2 py-3 border rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                            </svg>
                            ไม่พบห้องเรียนที่ต้องแสดง
                        </span>
                    </div>
                )
            }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {classrooms.map((classroom) => (
                    <div className="card rounded-2xl shadow-md bg-white p-6 transition-shadow duration--300 ease-out hover:shadow-blue-100" key={classroom.classId}>
                        <h1 className="text-xl mb-5">
                            ห้อง {classroom.classLevel}/{classroom.classRoom}
                            <span className="inline-flex w-fit ml-2 px-2 py-[1px] text-sm text-white font-medium bg-blue-700 rounded-full ">{classroom.classroomType.classTypeNameThai}</span>
                            
                        </h1>
                        <div className="card-body grid grid-cols-1 gap-2">
                            <Link 
                                to={`/timetable`}
                                state={{
                                    classroom:classroom
                                }}
                            >
                                <span
                                    className="inline-flex text-sm px-4 py-1 rounded-full font-bold text-white bg-violet-600 hover:text-gray-50 hover:bg-violet-500 hover:shadow-md"
                                >
                                    ตารางเรียน
                                </span>
                            </Link>
                            <Link
                                to="/calendarstudy"
                                state={{
                                    classroomId: classroom.classId,
                                    classroomInfo: classroom,
                                }}
                            >
                                <span
                                    className="inline-flex text-sm px-4 py-1 rounded-full font-bold text-white bg-blue-700 hover:text-gray-50 hover:bg-blue-600 hover:shadow-md"
                                >
                                    ปฎิทินการเรียน
                                </span>
                            </Link>
                            <Link
                                to="/calendarholiday"
                                state={{
                                    classroomId: classroom.classId,
                                    classroomInfo: classroom,
                                }}
                            >
                                <span
                                    className="inline-flex text-sm px-4 py-1 rounded-full font-bold text-white bg-rose-700 hover:text-gray-50 hover:bg-rose-600 hover:shadow-md"
                                >
                                    ปฎิทินวันหยุด
                                </span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

RoomList.propTypes = {
    academicYearTermId: PropTypes.string.isRequired,
    selectedClassLevel: PropTypes.string.isRequired,
};
