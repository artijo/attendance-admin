import axios from "axios";
import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
export const  RoomList = ({ academicYearTermId, selectedClassLevel } ) => {
    const [classrooms, setClassrooms] = useState([]);
    const totalPages = Math.ceil(classrooms.length/12);
    const [currentPage, setCurrentPage] = useState(1);
    const sliceHolidayList = classrooms.slice((currentPage - 1) * 12, currentPage * 12);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const filterClassLevel = (classrooms) => {
      const filterClassroom = classrooms.filter((classroom) => classroom.classLevel === parseInt(selectedClassLevel));
      setClassrooms(filterClassroom);
    };

    const fecthClassrooms = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/classrooms/byterm/${academicYearTermId}`);
            if(response.status === 200){
                // setClassrooms(response.data);
                filterClassLevel(response.data);
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
    }, [academicYearTermId,selectedClassLevel]);

    return(
        <div>
            <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">ห้อง</th>
                            <th className="px-6 py-3">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                            {
                                sliceHolidayList.length > 0 && sliceHolidayList.map((classroom) => (
                                    <tr key={classroom.classId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td className="px-6 py-4">{classroom.classLevel}/{classroom.classRoom}</td>

                                        <td className="px-6 py-4">
                                            <span className='inline-flex overflow-hidden rounded-md border bg-white shadow-sm'>
                                                <Link to="/calendarstudy" 
                                                    className="flex items-center gap-2  p-3 text-blue-500 hover:bg-gray-50 focus:relative"
                                                    state={{classroomId:classroom.classId,classroomInfo:classroom}}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                                    </svg>


                                                    ปฎิทินการเรียน
                                                </Link>
                                                <Link to="/calendarholiday" 
                                                    className="flex items-center gap-2  p-3 text-blue-500 hover:bg-gray-50 focus:relative"    
                                                    state={{classroomId:classroom.classId,classroomInfo:classroom}}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                                                    </svg>

                                                    
                                                    ปฎิทินวันหยุด
                                                </Link>
                                                <button 
                                                    className="flex items-center gap-2  p-3 text-red-500 hover:bg-gray-50 focus:relative"
                                                    onClick={() => handelDeleteStudingTime(classroom.classId)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                    ลบปฎิทิน
                                                </button>
                                            </span>
                                        </td>
                                             
                                    </tr>
                                ))
                            }
                            {
                                sliceHolidayList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="whitespace-nowrap text-center px-4 py-2 text-gray-700">
                                          <span className="flex flex-col items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                            </svg>
                                            ไม่พบข้อมูลห้องเรียน
                                          </span>
                                        </td>
                                    </tr>
                                )
                            }
                    </tbody>
                </table>
            </div>
        </div>
        <div className="rounded-b-lg border-gray-200 px-4 py-2">
          <ol className="flex flex-wrap justify-end gap-1 text-xs font-medium">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={`inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Prev Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  className={`block size-8 rounded border ${
                    currentPage === page
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-100 bg-white text-gray-900"
                  } text-center leading-8`}
                >
                  {page}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className={`inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ol>
        </div>
      </div>
        
    );
} 

RoomList.propTypes = {
    academicYearTermId: PropTypes.string.isRequired,
};