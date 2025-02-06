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
        const datetime = DateTime.fromISO(value,{zone:'UTC'})
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
            <div className="border border-gray-200 shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right ">
                            <tr className="shadow-md h-12 text-center ">
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ปีการศึกษา</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">เทอม</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วันที่เริ่ม</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วันที่สิ้นสุด</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 ">
                            {academicYearTerm.length === 0 ? (
                                <tr>
                                <td colSpan={6} className="px-4 py-2 text-center text-gray-500">ไม่มีข้อมูล</td>
                                </tr>
                            ) : (
                                academicYearTerm.map((term) => (
                                <tr key={term.termId} className="even:bg-slate-100/70 text-center">
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{term.academicYear ? term.academicYear + 543 : '-'}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{term.semester || '-'}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{term.termStart ? datetimeFormat(term.termStart) : '-'}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{term.termEnd ? datetimeFormat(term.termEnd) : '-'}</td>
                                    <td className="whitespace-nowrap px-4 py-2" onClick={() => handleOnDelete(term.termId)}>
                                        <button className="cursor-pointer bg-red-200 text-red-600 px-5 py-[2px] rounded-sm hover:bg-red-400 hover:text-red-700">ลบ</button>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        <Link to="/terms/edit" state={{ termId: term.termId }}>
                                            <button className="cursor-pointer bg-yellow-200/60 text-yellow-600 px-5 py-[2px] rounded-sm hover:bg-yellow-200/100 hover:text-yellow-700">แก้ไข</button>
                                        </Link>
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