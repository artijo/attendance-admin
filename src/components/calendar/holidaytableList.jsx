import { formatDateYYYYMMDD, formatDateToThaiNot543 } from "../../helper.js";
import { PropTypes } from "prop-types";
import { HOSTNAME } from "../../config.js";
import { Link } from "react-router-dom";
import { EditHoliday } from "./EditHoliday.jsx";
import axios from "axios";
import { useState } from "react";

export const HolidaytableList = ({holidayList, semester, academicYear, handleSelectOption, fectHolidayList}) => {
    const [onClick, setOnClick] = useState(0);

    const editOnClick = (value) => {
        onClick === value ? setOnClick(0) : setOnClick(value);
    }
    const deleteHoliday = async (holidayName, sDate, eDate) => {
        try {
            const formData = {
                holidayName: holidayName,
                sDate: sDate,
                eDate: eDate,
                semester: semester,
                academicYear: academicYear,
            };

            const response = await axios.delete(`${HOSTNAME}/a/holiday`, { data: formData });
            if (response.status === 200) {
                handleSelectOption(`${semester}&${academicYear}`);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleDelete = (holidayName, sDate, eDate) => {
        // Handle delete logic here
        // console.log(value + " " + semester + " " + academicYear);
        const confirmDelete = window.confirm(`คุณต้องการลบวันหยุด ${holidayName} ใช่หรือไม่?`);
        if (confirmDelete) {
            // Call the delete function from the parent component
            deleteHoliday(holidayName, sDate, eDate);
        }
    };


    return (
        <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ชื่อวันหยุด</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">วันที่เริ่มหยุด</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">วันที่สิ้นสุดการหยุด</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {
                            holidayList.map((holiday, index) => (
                                <tr key={index+1}>
                                    {index+1 === onClick ?
                                        <EditHoliday holidayName={holiday.holidayName} sDate={holiday.sDate} eDate={holiday.eDate} setOnClick={setOnClick} semester={semester} academicYear={academicYear} fectHolidayList={fectHolidayList}/>
                                            :
                                        <>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{holiday.holidayName}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThaiNot543(formatDateYYYYMMDD(holiday.sDate))}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThaiNot543(formatDateYYYYMMDD(holiday.eDate))}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-red-600 cursor-pointer" onClick={() => handleDelete(holiday.holidayName, holiday.sDate, holiday.eDate)} title="Delete">ลบ</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-yellow-600 cursor-pointer" onClick={() => editOnClick(index+1)}>แก้ไข</td>
                                        </>
                                    }
                                    {/* <EditHoliday holidayName={holiday.holidayName} sDate={holiday.sDate} eDate={holiday.eDate}/> */}

                                   
                                </tr>
                                
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

HolidaytableList.propTypes = {
    holidayList: PropTypes.array.isRequired,
    semester: PropTypes.number.isRequired,
    academicYear: PropTypes.number.isRequired,
    handleSelectOption: PropTypes.func.isRequired
};
