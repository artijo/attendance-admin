import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { formatDateToThai } from "../../helper";

export const AttendenceByDayList = ({termId,classroomId}) => {
    const [dayList, setDayList] = useState([]);
    const page = Math.ceil(dayList.length/10);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceDayList = dayList.slice((seletedPage - 1) * 10, seletedPage * 10);
    function daybetween(Start, End) {
        const dates = [];
        if (Start !== "" && End !== "") {
            const startDate = DateTime.fromISO(Start);
            const endDate = DateTime.fromISO(End);
            let currentDate = startDate;
            while (currentDate <= endDate) {
                dates.push(currentDate.toISODate().split("-").join("-")); // เพิ่มวันที่ในรูปแบบ YYYY-MM-DD
                currentDate = currentDate.plus({ days: 1 }); // เพิ่มวันทีละ 1
            }
        } else {
            console.error("termStart or termEnd is not set!");
        }
        return dates;
    }

    function getDay(value){
        const holidayList = value.holiday.map((holiday) => holiday.startHolidayDate.split("T")[0]);
        const dateTimeStart = value.termStart.split("T")[0]; //ex. ['2025-05-15','00:00:00.000Z']
        const dateTimeEnd = value.termEnd.split("T")[0]; //ex. ['2025-09-09','00:00:00.000Z']
        const datebetween = daybetween(dateTimeStart, dateTimeEnd).filter((date) => {
            const weekday = DateTime.fromISO(`${date}`, { zone: 'UTC' }).weekday; // filter เพื่อตัดวันที่เป้นเสาร์ อาทิตย์ออก
            return weekday !== 6 && weekday !== 7;
        }).filter((date) => !holidayList.includes(date));
        setDayList(datebetween);
    }

    const fetchTermInfo = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/academicterms/${termId}`);
            getDay(response.data);
            console.log(response.data);
        }catch(err){
            console.error(err);
        };
    };
    
    useEffect(() => {
        if(termId !== null){
            fetchTermInfo();
        }
    },[termId]);

    return (
        <>
            <div className="grid gap-2 md:grid-cols-1">
                <div className="rounded-lg border border-gray-200">
                    <div className="overflow-x-auto rounded-t-lg">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">วัน</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {
                                    sliceDayList.length > 0 ? 
                                        (
                                            sliceDayList.map((day, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatDateToThai(day)}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-blue-700 cursor-pointer">
                                                        <Link to={`/attendances/details/byday`} state={{ classroomId: classroomId, date: day }} >
                                                            รายละเอียด
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

AttendenceByDayList.propTypes = {
    termId: PropTypes.string.isRequired,
    classroomId: PropTypes.string.isRequired
};

