import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { DateTime } from "luxon";
import { formatDateToThai } from "../../helper";
import { Link } from "react-router-dom";
import ErrorAlert from "../alert/error";
import AlertSuccess from "../alert/success";
export const Termlistable = () => {
    const [academicYearTerm, setAcademicYearTerm] = useState([]);
    // responed from server 
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [success,setSuccess] = useState(false);
    function datetimeFormat(value) {
        const datetime = DateTime.fromISO(value).setZone('Asia/Bangkok');
        let datetimeString = formatDateToThai(datetime.toFormat('yyyy-MM-dd'));
        return datetimeString;
    };

    const fecthData =  async () => {
        const response = await axios.get(`${HOSTNAME}/a/academicterms`);
        // console.log(response.data)
        if(response.status === 200){
            setAcademicYearTerm(response.data);
        }
    };

    const handleOnDelete =  async (termId) => {
        try{
            const confirmDelete = window.confirm(`คุณต้องการลบใช่หรือไม่?`);
            if (confirmDelete) {
                const response = await axios.delete(`${HOSTNAME}/a/academicterms/${termId}`);
                if(response.status === 200){
                    fecthData();
                    setMsg(response.data.message);
                    setSuccess(true);
                }else{
                    throw new Error(response.data.message);
                }
            }
        }catch(error){
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบ");
            setError(true);
        }
    }

    useEffect(() => {
      fecthData();
    },[])

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
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr >
                                <th className="px-6 py-3">ปีการศึกษา</th>
                                <th className="px-6 py-3">เทอม</th>
                                <th className="px-6 py-3">วันที่เริ่ม</th>
                                <th className="px-6 py-3">วันที่สิ้นสุด</th>
                                <th className="px-6 py-3">จัดการ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {academicYearTerm.length === 0 ? (
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
                            ) : (
                                academicYearTerm.map((term) => (
                                <tr key={term.termId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <td className="px-6 py-4">{term.academicYear ? term.academicYear + 543 : '-'}</td>
                                    <td className="px-6 py-4">{term.semester || '-'}</td>
                                    <td className="px-6 py-4">{term.termStart ? datetimeFormat(term.termStart) : '-'}</td>
                                    <td className="px-6 py-4">{term.termEnd ? datetimeFormat(term.termEnd) : '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className='inline-flex overflow-hidden rounded-md border bg-white shadow-sm'>
                                            <Link to="/terms/edit" state={{ termId: term.termId }}>
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
                                                onClick={() => handleOnDelete(term.termId)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </span>
                                    </td>
                                    
                                </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </>
        
    );
};