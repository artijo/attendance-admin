import { PropTypes } from "prop-types";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect,useState} from "react";
import { Link } from "react-router-dom";
export const AttendenceBySubjectList = ({classroomId}) => {
    const [subjectList, setSubjectList] = useState([]);
    const totalPages = Math.ceil(subjectList.length/5);
    const [currentPage, setCurrentPage] = useState(1);
    const sliceSubjectList = subjectList.slice((currentPage - 1) * 5, currentPage * 5);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const fetchData = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/subjectTimetable/${classroomId}`);  
            setSubjectList(response.data);
            // (console.log(response.data));
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if(classroomId == null) return;
        fetchData();
    }, [classroomId]);
    return (
        <>
            <span className="text-xs text-gray-500">จำนวนวิชามีอยู่ {subjectList.length} วิชา</span>
            <div>
                <div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-2xl">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">ลำดับ</th>
                                    <th className="px-6 py-3">วิชา</th>
                                    <th className="px-6 py-3">ผู้สอน</th>
                                    <th className="px-6 py-3">การเข้าเรียน</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {
                                    sliceSubjectList.length > 0 ? 
                                        (
                                            sliceSubjectList.map((subject, index) => (
                                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                                    {
                                                        <td className="px-6 py-4">{((currentPage - 1)*5)+(index+1) }</td>
                                                    }
                                                    <td className="px-6 py-4">{`(${subject.subCode})${subject.subNameThai} - ${subject.subNameEng}`}</td>
                                                    <td className="px-6 py-4">{`คุณครู ${subject.teacher.fName} ${subject.teacher.lName}`}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-blue-700 cursor-pointer">
                                                        
                                                        <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm'">
                                                            
                                                            <Link to={`/attendances/details/bysubject`} state={{subject:subject,classroomId:classroomId}}>
                                                                <button 
                                                                    className="flex items-center gap-2 p-3 text-blue-600 hover:bg-gray-50 focus:relative"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                                    </svg>

                                                                    การเข้าเรียน
                                                                </button>
                                                            </Link>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : 
                                        <tr>
                                            <td colSpan={4} className="whitespace-nowrap text-center px-4 py-2 text-gray-700">
                                                <span className="flex flex-col items-center justify-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                                    </svg>
                                                    ไม่พบข้อมูลวิชาเรียน
                                                </span>
                                                
                                            </td>
                                        </tr>
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
        </>
       
    )
}

AttendenceBySubjectList.propTypes = {
    classroomId: PropTypes.string.isRequired
};