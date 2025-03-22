import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import { Holidaylisttable } from "../../components/holiday/createholiday/holidaylisttable";
import { formatDateYYYYMMDD } from "../../helper.js";
import { DateTime } from "luxon";
import axios from "axios";
// alert
import AlertSuccess from "../../components/alert/success.jsx";
import ErrorAlert from "../../components/alert/error.jsx";

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

function CreateHoliday() {
    const [holidayList, setHolidayList] = useState([]); // เก็บตัวอันตโนมัติไว้
    const [holidayAutoList, setHolidayAutoList] = useState([]);
    const [isMultipleMode, setIsMultipleMode] = useState(false);

    const fecthHolidayAuto = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/holidayauto`);
            if (response.status === 200) {
                const newList = response.data.map((holiday, index) => ({
                    id: `${holiday.SUMMARY}-${holiday["DTSTART;VALUE=DATE"]}-${index}`,
                    holidayname: holiday.SUMMARY,
                    startDate: formatDateYYYYMMDD(holiday["DTSTART;VALUE=DATE"]),
                    endDate: formatDateYYYYMMDD(holiday["DTEND;VALUE=DATE"]),
                    type: "RATCHAKHAN",
                }));
                setHolidayAutoList([...holidayAutoList, ...newList]);
                setHolidayList([...newList]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteFectholidayAuto = () => {
        if (holidayList.length > 0) {
            const newAutoList = holidayAutoList.filter(
                (holiday) => !holidayList.some((auto) => auto.id === holiday.id)
            );
            setHolidayAutoList(newAutoList);
            setHolidayList([]);
        } else {
            return;
        }
    };

    const [academicYearTermList, setAcademicYearTermList] = useState([]);
    const fecthAcademicYearTerms = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            if (response.status === 200) {
                setAcademicYearTermList(response.data);
            }
            if (response.data.length > 0) {
                setAcademicYearSemester(response.data[0].termId);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (isMultipleMode === true) {
            fecthHolidayAuto();
        } else {
            deleteFectholidayAuto();
        }
    }, [isMultipleMode]);

    useEffect(() => {
        fecthAcademicYearTerms();
    }, []);

    // input
    const [holidayName, setHolidayName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [holidayType, setHolidayType] = useState("RATCHAKHAN");
    const [academicYearSemester, setAcademicYearSemester] = useState("");
    // responed from server
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const data = {
            holidayList: holidayAutoList,
            termId: academicYearSemester,
        };
        try {
            const response = await axios.post(`${HOSTNAME}/a/holiday`, data);
            if (response.status === 200) {
                setMsg(response.data.message);
                setSuccess(true);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            // console.error(error);
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างวันหยุด");
            setError(true);
        }
    };

    const handleAddHoliday = (e) => {
        e.preventDefault();
        const data = daybetween(startDate, endDate).map((date, index) => ({
            id: `${holidayName}-${date}-${holidayType}-${index}`,
            holidayname: holidayName,
            startDate: date,
            endDate: date,
            type: holidayType,
        }));
        const newHoliday = [...data, ...holidayAutoList];
        setHolidayAutoList(newHoliday);
        alert("เพิ่มรายการวันหยุดในตารางเรียบร้อย");
        setHolidayName("");
        setStartDate("");
        setEndDate("");
        setHolidayType("RATCHAKHAN");
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-center text-2xl font-bold mb-4">ฟอร์มสร้างวันหยุด</h1>
                <div
                    className="mb-4"
                    onClick={() => {
                        setError(false);
                        setSuccess(false);
                        setMsg("");
                    }}
                >
                    {error && <ErrorAlert title="เกิดข้อผิดพลาด" message={msg} />}
                    {success && <AlertSuccess title="สำเร็จ" message={msg} />}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="holiday" id="holiday-box">
                        <Holidaylisttable
                            holidayList={holidayAutoList}
                            setHolidayAutoList={setHolidayAutoList}
                            setHolidayList={setHolidayList}
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-1">
                        <form
                            className="border p-4 rounded-lg bg-gray-50 grid grid-cols-1 gap-4"
                            onSubmit={(e) => handleAddHoliday(e)}
                        >
                            <div className="grid self-center grid-cols-2 gap-4">
                                <h4 className="font-medium place-self-start">เพิ่มรายการวันหยุด</h4>
                                <div className="place-self-end">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            onChange={(e) => setIsMultipleMode(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            สร้างวันหยุดราชการอัตโนมัติ
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">ชื่อวันหยุด</label>
                                <input
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                    type="text"
                                    name="academicYear"
                                    value={holidayName}
                                    onChange={(e) => setHolidayName(e.target.value)}
                                    required={true}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">ประเภทวันหยุด</label>
                                <select
                                    name="holidayType"
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                    value={holidayType}
                                    onChange={(e) => setHolidayType(e.target.value)}
                                >
                                    <option value="RATCHAKHAN">วันหยุดราชการ</option>
                                    <option value="SCHOOL">วันหยุดโรงเรียน</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700">วันที่เริ่มหยุด</label>
                                <input
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                    type="date"
                                    name="semester"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required={true}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-700">วันที่สิ้นสุดการหยุด</label>
                                <input
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                    type="date"
                                    name="semester"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required={true}
                                    min={startDate}
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex w-fit ml-auto justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                เพิ่มรายการวันหยุด
                            </button>
                        </form>
                        <form
                            onSubmit={(e) => handleOnSubmit(e)}
                            className="h-fit border p-4 rounded-lg mb-4 bg-gray-50 grid grid-cols-1 gap-5"
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">
                                        ปีการศึกษาและเทอม{" "}
                                        <span>
                                            {" "}
                                            <Link to="/terms/create" className="text-blue-600 hover:underline">
                                                เพิ่มปีการศึกษา
                                            </Link>{" "}
                                        </span>
                                    </label>
                                    <select
                                        name="academicyear_semester"
                                        onChange={(e) => setAcademicYearSemester(e.target.value)}
                                        className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                    >
                                        {academicYearTermList.length > 0 ? (
                                            academicYearTermList.map((academicYearTermList) => {
                                                return (
                                                    <option
                                                        key={academicYearTermList.termId}
                                                        value={academicYearTermList.termId}
                                                    >
                                                        ปีการศึกษา {academicYearTermList.academicYear + 543}-เทอม{" "}
                                                        {academicYearTermList.semester}
                                                    </option>
                                                );
                                            })
                                        ) : (
                                            <option value={""}>ไม่มีปีการศึกษา</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex w-fit ml-auto justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                เพิ่มวันหยุดในเทอมนั้น
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateHoliday;