import { useState } from "react";
import { formatDateToThai, formatTypeToThai } from "../../helper";
import { Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import PropTypes from "prop-types";
import AlertSuccess from "../alert/success.jsx";
import ErrorAlert from "../alert/error.jsx"

export const HolidayListable = ({holidayList,fectHolidayList}) => {
    const totalPages = Math.ceil(holidayList.length/10);
    const [currentPage, setCurrentPage] = useState(1);
    const sliceHolidayList = holidayList.slice((currentPage - 1) * 10, currentPage * 10);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
     // responed from server 
     const [msg, setMsg] = useState("");
     const [error, setError] = useState(false);
     const [success,setSuccess] = useState(false);
     

    const handleDeleteHoliday = async (id) => {
        try{
            const confirmDelete = window.confirm("คุณต้องการลบวันหยุดนี้หรือไม่");
            if(!confirmDelete) return;
            const response = await axios.delete(`${HOSTNAME}/a/holiday/${id}`);
            if(response.status === 200) {
                setMsg(response.data.message);
                setSuccess(true);
                fectHolidayList();
            }else{
                throw new Error(response.data.message);
            };
        }catch(error){
            console.error(error);
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไขวันหยุด");
            setError(true);
        };
    };

    return (
        <>
            <div className="mb-2"  onClick={() => {
                    setError(false)
                    setSuccess(false)
                    setMsg("")
                }}>
                    {
                        error &&  <ErrorAlert title="เกิดข้อผิดพลาด" message={msg}/>
                    }
                    {
                        success && <AlertSuccess title="สำเร็จ" message={msg}/>
                    }
            </div>
            <div>
                <div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">ชื่อวันหยุด</th>
                                    <th className="px-6 py-3">วันที่เริ่มหยุด</th>
                                    <th className="px-6 py-3">วันที่สิ้นสุดการหยุด</th>
                                    <th className="px-6 py-3">ประเภทวันหยุด</th>
                                    <th className="px-6 py-3">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sliceHolidayList.length > 0 ? 
                                        (
                                            sliceHolidayList.map((holiday, index) => (
                                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{holiday.holidayname}</td>
                                                    <td className="px-6 py-4">{formatDateToThai(holiday.startDate)}</td>
                                                    <td className="px-6 py-4">{formatDateToThai(holiday.endDate)}</td>
                                                    <td className="px-6 py-4">{formatTypeToThai(holiday.type)}</td>
                                                    <td className="px-6 py-4" >
                                                        <span className='inline-flex overflow-hidden rounded-md border bg-white shadow-sm'>
                                                            <Link to={`/holiday/edit/${holiday.id}`} >
                                                            <button
                                                                className="inline-block p-3 text-blue-600 hover:bg-gray-50 focus:relative"
                                                                >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                </svg>
                                                            </button>
                            
                                                            </Link>
                                                            <button
                                                                className="inline-block p-3 text-red-600 hover:bg-gray-50 focus:relative"
                                                                onClick={() => handleDeleteHoliday(holiday.id)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : 
                                        <tr>
                                            <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700" colSpan={4}>ไม่มีข้อมูล</td>
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
        
        
    );
};

HolidayListable.propTypes = {
    holidayList: PropTypes.array.isRequired,
    fectHolidayList: PropTypes.func.isRequired
}

