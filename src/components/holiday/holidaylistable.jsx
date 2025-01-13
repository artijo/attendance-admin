import { useState } from "react";
import { formatDateToThai, formatTypeToThai } from "../../helper";
import { Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";

export const HolidayListable = ({holidayList,fectHolidayList}) => {
    const page = Math.ceil(holidayList.length/10);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceHolidayList = holidayList.slice((seletedPage - 1) * 12, seletedPage * 12);

    const handleDeleteHoliday = async (id) => {
        try{
            const confirmDelete = window.confirm("คุณต้องการลบวันหยุดนี้หรือไม่");
            if(!confirmDelete) return;
            const response = await axios.delete(`${HOSTNAME}/a/holiday/${id}`);
            if(response.status === 200) {
                // console.log(response.data);
                alert(`${response.data.holidayName} ถูกลบเรียบร้อย`);
                fectHolidayList();
            };
        }catch(error){
            console.error(error);
        };
    };

    return (
        <div className="grid gap-2 md:grid-cols-1">
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อวันหยุด</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วันที่เริ่มหยุด</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วันที่สิ้นสุดการหยุด</th>
                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ประเภทวันหยุด</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {
                                sliceHolidayList.length > 0 ? 
                                    (
                                        sliceHolidayList.map((holiday, index) => (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{holiday.holidayname}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThai(holiday.startDate)}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThai(holiday.endDate)}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatTypeToThai(holiday.type)}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-red-600 cursor-pointer" onClick={() => handleDeleteHoliday(holiday.id)}>ลบ</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-yellow-600 cursor-pointer">
                                                    <Link to={`/holiday/edit/${holiday.id}`}>
                                                        แก้ไข
                                                    </Link>
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
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
        
    );
};