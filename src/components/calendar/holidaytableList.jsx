import { formatDateYYYYMMDD, formatDateToThaiNot543 } from "../../helper.js";
import { PropTypes } from "prop-types";
import { HOSTNAME } from "../../config.js";
import axios from "axios";

export const HolidaytableList = ({holidayList, semester, academicYear, handleSelectOption}) => {


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
                                <tr key={index}>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{holiday.holidayName}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThaiNot543(formatDateYYYYMMDD(holiday.sDate))}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThaiNot543(formatDateYYYYMMDD(holiday.eDate))}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-red-600 cursor-pointer" onClick={() => handleDelete(holiday.holidayName, holiday.sDate, holiday.eDate)} title="Delete">ลบ</td>
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
