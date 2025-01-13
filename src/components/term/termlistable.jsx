import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { DateTime } from "luxon";
import { formatDateToThai } from "../../helper";
import { Link } from "react-router-dom";
export const Termlistable = () => {
    const [academicYearTerm, setAcademicYearTerm] = useState([]);

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
                // Call the delete function from the parent component
                const response = await axios.delete(`${HOSTNAME}/a/academicterms/${termId}`);
                if(response.status === 200){
                    fecthData();
                }
            }
        }catch(error){
            console.error(error);
        }
    }

    useEffect(() => {
      fecthData();
    },[])

    return (
        <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ปีการศึกษา</th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">เทอม</th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วันที่เริ่ม</th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วันที่สิ้นสุด</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {
                            academicYearTerm.length > 0 ? 
                                (
                                    academicYearTerm.map((academicYearTerm) => (
                                        <tr key={academicYearTerm.termId}>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{academicYearTerm.academicYear + 543}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{academicYearTerm.semester}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{datetimeFormat(academicYearTerm.termStart)}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{datetimeFormat(academicYearTerm.termEnd)}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-red-700" onClick={()=> handleOnDelete(academicYearTerm.termId)}>
                                                ลบ
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                <Link to="/terms/edit" state={{termId: academicYearTerm.termId}}>
                                                    <span className="text-yellow-400">แก้ไข</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : 
                                <tr>
                                    <td colSpan={4}>ไม่มีข้อมูล</td>
                                </tr>

                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};