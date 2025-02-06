import { useState } from "react";
import { formatDateToThai, formatTypeToThai } from "../../helper";
import { Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import PropTypes from "prop-types";
import AlertSuccess from "../alert/success.jsx";
import ErrorAlert from "../alert/error.jsx"

export const HolidayListable = ({holidayList,fectHolidayList}) => {
    const page = Math.ceil(holidayList.length/10);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceHolidayList = holidayList.slice((seletedPage - 1) * 10, seletedPage * 10);
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
            <div className="grid gap-2 md:grid-cols-1">
                <div className="border shadow-md border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr className="h-12 text-center shadow-md">
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อวันหยุด</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วันที่เริ่มหยุด</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วันที่สิ้นสุดการหยุด</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ประเภทวันหยุด</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {
                                    sliceHolidayList.length > 0 ? 
                                        (
                                            sliceHolidayList.map((holiday, index) => (
                                                <tr key={index} className="even:bg-slate-100/70 text-center">
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{holiday.holidayname}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThai(holiday.startDate)}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThai(holiday.endDate)}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatTypeToThai(holiday.type)}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 flex gap-2 justify-center" onClick={() => handleDeleteHoliday(holiday.id)}>
                                                        <Link to={`/holiday/edit/${holiday.id}`} >
                                                            <button className="cursor-pointer bg-yellow-200/60 text-yellow-600 px-5 py-[2px] rounded-sm hover:bg-yellow-200/100 hover:text-yellow-700" >แก้ไข</button>
                                                            
                                                        </Link>
                                                        <button className="cursor-pointer bg-red-200 text-red-600 px-5 py-[2px] rounded-sm hover:bg-red-400 hover:text-red-700">ลบ</button>
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
                <div>
                    {Array.from({ length: page }, (_, i) => (
                        <button
                            key={i+1}
                            className={`px-4 py-2 ${seletedPage === i+1 ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setSeletedPage(i+1)}
                            type="button"
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </>
        
        
    );
};

HolidayListable.propTypes = {
    holidayList: PropTypes.array.isRequired,
    fectHolidayList: PropTypes.func.isRequired
}

