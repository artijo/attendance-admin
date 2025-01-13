import PropTypes from 'prop-types';
import { formatDateToThai } from "../../../helper";
import { useState } from 'react';

export const Holidaylisttable = ({holidayList}) => {
    const page = Math.ceil(holidayList.length/10);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceHolidayList = holidayList.slice((seletedPage - 1) * 10, seletedPage * 10);
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {
                                sliceHolidayList  ? 
                                    (
                                        sliceHolidayList.map((holiday, index) => (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{holiday.holidayname}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThai(holiday.startDate)}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThai(holiday.endDate)}</td>
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

Holidaylisttable.propTypes = {
    holidayList: PropTypes.array.isRequired,
};