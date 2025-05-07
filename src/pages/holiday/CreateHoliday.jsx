import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import { Holidaylisttable } from "../../components/holiday/createholiday/holidaylisttable";
import { formatDateYYYYMMDD } from "../../helper.js";
import { DateTime, Zone } from "luxon";
import axios from "axios";
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
    const [isLoading, setIsLoading] = useState(false);
    //select option
    const [academicYearTermList, setAcademicYearTermList] = useState([]);
    const [academicYearSemester, setAcademicYearSemester] = useState(null);
    //for input date
    const [startDateTerm, setStartDateTerm] = useState("");
    const [endDateTerm, setEndDateTerm] = useState("");

    // input
    const [holidayName, setHolidayName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [holidayType, setHolidayType] = useState("RATCHAKHAN");
    
    // response from server
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const fecthHolidayAuto = async () => {
        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFectholidayAuto = () => {
        if (holidayList.length > 0) {
            const newAutoList = holidayAutoList.filter(
                (holiday) => !holidayList.some((auto) => auto.id === holiday.id)
            );
            setHolidayAutoList(newAutoList);
            setHolidayList([]);
        }
    };

    const fecthAcademicYearTerms = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            if (response.status === 200) {
                // console.log(response.data);
                setAcademicYearTermList(response.data);
                if (response.data.length > 0) {
                    setAcademicYearSemester(response.data[0]);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
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

    useEffect(() => {
        const setDateRange = (startDate, endDate) => {
            console.log(startDate + " " + endDate);
            const sDate = DateTime.fromISO(startDate).setZone('Asia/Bangkok').toFormat('yyyy-MM-dd');
            const eDate = DateTime.fromISO(endDate).setZone('Asia/Bangkok').toFormat('yyyy-MM-dd');
            console.log('==========');
            console.log(sDate);
            console.log(eDate);
            console.log('==========');
            setStartDateTerm(sDate);
            setEndDateTerm(eDate);
        };
        if(academicYearSemester){
            setDateRange(academicYearSemester.termStart, academicYearSemester.termEnd);
        };
    },[academicYearSemester]);

    const handleAcademicYearSemeterChange = (value) => {
        const academicYearList = academicYearTermList;
        const findAcademicYearList = academicYearList.find((ay) => ay.termId == value);
        setAcademicYearSemester(findAcademicYearList);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const data = {
            holidayList: holidayAutoList,
            termId: academicYearSemester.termId,
        };
        
        try {
            setIsLoading(true);
            const response = await axios.post(`${HOSTNAME}/a/holiday`, data);
            if (response.status === 200) {
                setMsg(response.data.message);
                setSuccess(true);
                setHolidayAutoList([]);
                setHolidayList([]);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างวันหยุด");
            setError(true);
        } finally {
            setIsLoading(false);
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
        
        setHolidayName("");
        setStartDate("");
        setEndDate("");
        setHolidayType("RATCHAKHAN");
        
        setSuccess(true);
        setMsg("เพิ่มรายการวันหยุดในตารางเรียบร้อย");
    };


    const dismissAlerts = () => {
        setError(false);
        setSuccess(false);
        setMsg("");
    };

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">เพิ่มวันหยุด</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-text-color font-heading">
                            เพิ่มวันหยุดใหม่
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">เพิ่มและจัดการรายการวันหยุดในระบบ</p>
                    </div>
                </div>
                
                <Link 
                    to="/holiday" 
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้ารายการวันหยุด
                </Link>
            </div>
            
            <div className="mb-4" onClick={dismissAlerts}>
                {error && <ErrorAlert title="เกิดข้อผิดพลาด" message={msg} />}
                {success && <AlertSuccess title="สำเร็จ" message={msg} />}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-text-color font-heading flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                รายการวันหยุดที่เตรียมเพิ่ม
                            </h3>
                            <div className="flex items-center">
                                <span className="bg-gray-50 border border-line rounded-lg px-3 py-1 text-sm text-text-color-alt">
                                    จำนวนทั้งหมด: <span className="font-medium text-primary">{holidayAutoList.length}</span> วัน
                                </span>
                            </div>
                        </div>
                        
                        <Holidaylisttable
                            holidayList={holidayAutoList}
                            setHolidayAutoList={setHolidayAutoList}
                            setHolidayList={setHolidayList}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-text-color font-heading flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    เพิ่มวันหยุดรายการใหม่
                                </h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isMultipleMode}
                                        onChange={(e) => setIsMultipleMode(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    <span className="ml-3 text-sm font-body text-text-color">
                                        เพิ่มวันหยุดราชการอัตโนมัติ
                                    </span>
                                </label>
                            </div>

                            <form 
                                onSubmit={handleAddHoliday}
                                className="grid grid-cols-1 gap-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        ชื่อวันหยุด <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        type="text"
                                        name="holidayName"
                                        value={holidayName}
                                        onChange={(e) => setHolidayName(e.target.value)}
                                        required={true}
                                        placeholder="เช่น วันมาฆบูชา"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        ประเภทวันหยุด <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="holidayType"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        value={holidayType}
                                        onChange={(e) => setHolidayType(e.target.value)}
                                    >
                                        <option value="RATCHAKHAN">วันหยุดราชการ</option>
                                        <option value="SCHOOL">วันหยุดโรงเรียน</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-color font-body flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            วันที่เริ่มหยุด <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                            type="date"
                                            name="startDate"
                                            value={startDate}
                                            min={startDateTerm}
                                            max={endDateTerm}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            required={true}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-color font-body flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            วันที่สิ้นสุดการหยุด <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                            type="date"
                                            name="endDate"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            required={true}
                                            min={startDate === '' ? startDateTerm : startDate}
                                            max={endDateTerm}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        เพิ่มรายการวันหยุด
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-text-color font-heading flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                บันทึกวันหยุดเข้าสู่ระบบ
                            </h3>

                            <form 
                                onSubmit={handleOnSubmit}
                                className="grid grid-cols-1 gap-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        ปีการศึกษาและเทอม <span className="text-red-500">*</span>
                                    </label>

                                    <div className="flex items-center gap-3">
                                        <select
                                            name="academicyear_semester"
                                            onChange={(e) => handleAcademicYearSemeterChange(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                            disabled={isLoading || academicYearTermList.length === 0}
                                        >
                                            {isLoading ? (
                                                <option value="">กำลังโหลดข้อมูล...</option>
                                            ) : academicYearTermList.length > 0 ? (
                                                academicYearTermList.map((term, index) => (
                                                    <option key={term.termId} value={term.termId}>
                                                        {/* {console.log(term)} */}
                                                        ปีการศึกษา {term.academicYear + 543} เทอม {term.semester}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">ไม่มีปีการศึกษา</option>
                                            )}
                                        </select>

                                        <Link 
                                            to="/terms/create" 
                                            className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg border border-gray-300 text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                                            title="เพิ่มปีการศึกษาใหม่"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        disabled={holidayAutoList.length === 0 || isLoading}
                                        className={`inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white transition-all duration-300 ${
                                            holidayAutoList.length === 0 || isLoading
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                กำลังบันทึก...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                บันทึกวันหยุดในระบบ
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateHoliday;