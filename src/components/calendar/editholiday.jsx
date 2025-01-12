
import { useState } from "react";
import { formatDateYYYYMMDD, formatDateToThaiNot543, formatDateYYYYMMDDNot543 } from "../../helper.js";
import axios from "axios";
import { HOSTNAME } from "../../config.js";

export const EditHoliday = ({holidayName, sDate, eDate, setOnClick,  semester, academicYear, fectHolidayList}) => {
    const [title, setTitle] = useState(holidayName);

    const newData = {
        holidayName: title,
    }
    const oldData = {   
        holidayName: holidayName,
        sDate: sDate,
        eDate: eDate,
    }
    const semesterAndAcademicYear = {
        semester: semester,
        academicYear: academicYear,
    }

    const updateHoliday = async () => {
        try {
            const response = await axios.put(`${HOSTNAME}/a/holiday`, 
                {
                    "newData" : newData,
                    "oldData" : oldData,
                    "semesterAndAcademicYear" : semesterAndAcademicYear
                }
            );
            if(response.status === 200) {
                fectHolidayList({semester: semester, academicYear: academicYear})
            };
        }
        catch (error) {
            console.error(error);
        };
    };

    // <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThaiNot543(formatDateYYYYMMDD(holiday.sDate))}</td>
    // <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThaiNot543(formatDateYYYYMMDD(holiday.eDate))}</td>

    return (
        <>
            {/* <td>{holidayName}</td> */}
            <td className="whitespace-nowrap px-4 py-2 text-gray-700" >
                <input type="text" value={title} placeholder="ชื่อวันหยุด" onChange={(e) => setTitle(e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded-md"/>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {formatDateToThaiNot543(formatDateYYYYMMDD(sDate))}
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700"> 
                {formatDateToThaiNot543(formatDateYYYYMMDD(eDate))}
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700 cursor-pointer" colSpan={2}  onClick={() => setOnClick(0)}>
                <span className="block  text-start text-blue-700" onClick={() => updateHoliday()}>ยืนยัน</span>
            </td>
        </>
    );
};