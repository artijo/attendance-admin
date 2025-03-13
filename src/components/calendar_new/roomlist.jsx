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
                      <h1 className="text-2xl mb-5 pb-5 border-b-4 border-gray-100">
                          ห้อง {classroom.classLevel}/{classroom.classRoom} (
                          {classroom.classroomType.classTypeNameThai})
                      </h1>
                      <div className="card-body grid grid-cols-1 gap-2">
                          <Link
                              to="/calendarstudy"
                              className="flex justify-center h-10 rounded-xl items-center gap-2 text-white bg-blue-400 hover:bg-blue-300 focus:relative"
                              state={{
                                  classroomId: classroom.classId,
                                  classroomInfo: classroom,
                              }}
                          >
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-5"
                              >
                                  <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                                  />
                              </svg>
                              ปฎิทินการเรียน
                          </Link>

                          <Link
                              to="/calendarholiday"
                              className="flex justify-center h-10 border rounded-xl items-center gap-2 text-white bg-pink-600 hover:bg-pink-500 focus:relative"
                              state={{
                                  classroomId: classroom.classId,
                                  classroomInfo: classroom,
                              }}
                          >
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-5"
                              >
                                  <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                                  />
                              </svg>
                              ปฎิทินวันหยุด
                          </Link>

                          <button
                              className="flex justify-center h-10 border rounded-xl items-center gap-2 text-white bg-red-400 hover:bg-red-300 focus:relative"
                              onClick={() => handleDeleteStudyingTime(classroom.classId)}
                          >
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-5"
                              >
                                  <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                              </svg>
                              ลบปฎิทิน
                          </button>
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
