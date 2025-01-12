import { useState,useEffect } from "react";
import { formatDate,formatDateYYYYMMDD } from "../../helper";
import { HOSTNAME } from "../../config";
import { DateTime } from "luxon";
import axios from "axios";
import AlertSuccess from "../../components/alert/success";
// import { DateTime } from "luxon";

export const Calendar = () => {
    // const location = useLocation();
    const [termStart, setTermStart] = useState("");
    const [termEnd, setTermEnd] = useState("");
    const [mainHoliday, setMainHoliday] = useState([]); // วันหยุดราชกาลที่ระบบทำออกมาเองจะสี เทา
    //classroom semester option
    const [semesterClassroom, setSemesterClassroom] = useState([]);
    //semester
    const [selectSemester, setSelectSemester] = useState("");
    const [holiday, setHoliday] = useState([]); // วันหยุดที่ผู้ใช้เพิ่มเองจะสี ฟ้า
    //input เพิ่มวันหยุดเอง
    const [startHolidayDate, setStartHolidayDate] = useState(""); // วันเริ่มวันหยุด
    const [endHolidayDate, setEndHolidayDate] = useState(""); // วันสิ้นสุดวันหยุด
    const [holidayName, setHolidayName] = useState("");
    const [type, setType] = useState("RATCHAKHAN");
    //จัดการ popup 
    const [isShowPopup, setIsShowPopup] = useState(false);

    const [isStartDate, setIsStartDate] = useState(true);
    const [isEndDate, setIsEndDate] = useState(true);

    const toDay = DateTime.now().toISODate();
    const handleSelectOption = (e) => {
        setSelectSemester(e.target.value);
        setIsStartDate(false);
    }

    const handleStratDate = (e) => {
        setTermStart(e.target.value);
    
        setIsEndDate(false);
    }

    const handleEndDate = (e) => {
        setTermEnd(e.target.value);
    }

    const handleHolidayArray = (startDate, endDate, name, type) => {
        const start = DateTime.fromISO(startDate);
        const end = DateTime.fromISO(endDate);
        const array = daybetween(start, end).map((date) => {
            return {
                "DTSTART;VALUE=DATE" : date,
                "DTEND;VALUE=DATE" : date,
                "SUMMARY":name,
                "TYPE" : type
            }
        });
        const newHoliday = [...holiday, 
            ...array
        ];
        setHoliday(newHoliday);
    }

    const handleClickAddHoliday = () => {
        if(startHolidayDate === "" || holidayName === "" || endHolidayDate === ""){
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        handleHolidayArray(startHolidayDate, endHolidayDate, holidayName, type);
    }

    const sentFormData = async (data) => {
        try{
            await axios.post(`${HOSTNAME}/a/calendar`, data);
            await axios.post(`${HOSTNAME}/a/holiday`, data);
            setIsShowPopup(true);
            setTimeout(() => {
                setIsShowPopup(false);
                window.location.href = `/timetable/${location.state.classroomId}`
            }, 3000);
            
        }catch(err){
            console.log(err);
        }
    }
   
    const handleDeleteHoliday = (index) => {
        const newHoliday =holiday.filter((holiday, i) => i !== index);
        setHoliday(newHoliday);   
    }

    function daybetween(Start, End) {
        const dates = [];
        if (Start !== "" && End !== "") {
            const startDate = DateTime.fromISO(Start);
            const endDate = DateTime.fromISO(End);
            // console.log("Start Date:", startDate.toString());
            // console.log("End Date:", endDate.toString());
            let currentDate = startDate;
            while (currentDate <= endDate) {
                dates.push(currentDate.toISODate().split("-").join("")); // เพิ่มวันที่ในรูปแบบ YYYY-MM-DD
                currentDate = currentDate.plus({ days: 1 }); // เพิ่มวันทีละ 1
            }
        } else {
            console.error("termStart or termEnd is not set!");
        }
        return dates;
    }
    
    const fectHoliday = async () => {    
        const array = daybetween(termStart, termEnd);
        try {
            const response = await axios.get(`${HOSTNAME}/a/holiday`);
            if(response.status === 200){
                const mainHoliday = response.data.filter((holiday) => array.includes(holiday["DTSTART;VALUE=DATE"]));
                setMainHoliday(mainHoliday);
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleClickAddCalendar = () => {
        if(termStart === "" || termEnd === "" || selectSemester ===""){
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        const newMainHoliday = mainHoliday.map((holiday) => {
            return {
                "DTSTART;VALUE=DATE" : holiday["DTSTART;VALUE=DATE"],
                "DTEND;VALUE=DATE" : holiday["DTEND;VALUE=DATE"],
                "SUMMARY" : holiday.SUMMARY,
                "TYPE" : "RATCHAKHAN"
            }
        });
        const holidayMerge = [...newMainHoliday, ...holiday];
        const data = {
            semester: selectSemester,
            termStart: formatDate(termStart),
            termEnd: formatDate(termEnd),
            holiday: holidayMerge,
        };
        sentFormData(data);
    }
    useEffect(() => {
        if (termStart && termEnd) {
            fectHoliday();
        }
    }, [termStart, termEnd]);
    const fecthSemester = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/termAndAcademicYear`);
            setSemesterClassroom(response.data);
        }catch(err){
            console.log(err);
        };
    };
    const handleDeleteMainHoliday = (index) => {
        const newMainHoliday = mainHoliday.filter((holiday, i) => i !== index);
        setMainHoliday(newMainHoliday);
    }
    useEffect(() => {
        fecthSemester();
    },[])
    return (
        <div className="container mx-auto">   
            <div
                className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center  ${isShowPopup ? "block" : "hidden"}`}
            >
                <div className="bg-white p-4 rounded shadow-lg">
                    <AlertSuccess
                    title="บันทึกปฎิทินการเรียนสำเร็จ"
                    message="ข้อมูลปฎิทินการเรียนถูกบันทึกเรียบร้อยแล้ว"
                    />
                </div>
            </div>

            <div className="mb-2">
                <h3>สร้างปฎิทิน</h3>
                <p className="text-sm">
                    <span className="text-red-600">**</span>
                    <span className="text-gray-600">โดยการอิงปฎิทินนั้นจะอิงตามตารางเรียนห้องเรียน</span>
                </p>
            </div>
            <div className="border p-3 rounded-md bg-white shadow flex justify-between gap-y-5 w-100 flex-wrap">
                <div className="flex flex-col w-full px-1">
                    <label className="text-xs font-light block">ปีการศึกษา</label>
                    <select name="semester" id="semester"  onChange={(e) =>  handleSelectOption(e) } className="border rounded-md mt-1 px-2 py-1" >
                        <option value="">ปีการศึกษา</option>
                        {
                            semesterClassroom.length > 0 &&
                            semesterClassroom.map((item, index) => <option key={index} value={`${item.semester}|${item.academicYear}`}>เทอมที่ {item.semester}  ปีการศึกษา {item.academicYear}</option>)
                        }
                    </select>
                </div>
                <div className="flex flex-col w-1/2 px-1">
                    <label className="text-xs font-light block">วันเปิดเทอม(วันแรกของการเรียน)</label>
                    <input 
                        type="date" 
                        value={termStart} 
                        onChange={(e) => handleStratDate(e) } 
                        className="border rounded-md mt-1 px-2 py-1"
                        id="termStart"
                        disabled={isStartDate}
                        min={toDay}
                    />
                </div>
                <div className="flex flex-col w-1/2 px-1">
                    <label className="text-xs font-light block">วันปิดเทอม(วันสุดท้ายของการเรียน)</label>
                    <input 
                        type="date" 
                        value={termEnd} 
                        onChange={(e) => handleEndDate(e) } 
                        className="border rounded-md mt-1 px-2 py-1"
                        id="termEnd"
                        min={termStart}
                        disabled={isEndDate}
                    />
                </div>
                
                <div className="flex flex-col w-1/2 px-1 gap-2">
                    <label className="text-xs font-light block">รายการวันหยุดราชการ(ปี {DateTime.now().year + 543})</label>
                    <div className="flex gap-5 flex-start">
                        <div className="flex items-center gap-1 text-xs">
                            <div className="w-3 h-3 bg-gray-700"></div>
                            <span className="block">วันหยุดที่เพิ่มอัตโนมัติ</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                            <div className="w-3 h-3 bg-blue-400"></div>
                            <span className="block">วันหยุดที่เพิ่มเอง</span>
                        </div>
                    </div>
                    <div className="border rounded-md mt-1 flex flex-wrap w-full gap-1 p-2 h-44 overflow-y-auto">
                        {
                            mainHoliday.length > 0 ? 
                            mainHoliday.map((holiday, index) => {
                                return (
                                    <div key={index} className="w-fit">
                                        <p className="rounded-lg text-xs bg-gray-400 px-2 py-1 text-white">{formatDateYYYYMMDD(holiday["DTSTART;VALUE=DATE"])}-{holiday.SUMMARY}<span className="ml-1 text-red-700 cursor-pointer" onClick={() => handleDeleteMainHoliday(index)}>x</span> </p>
                                    </div>
                                
                                )
                            })
                            : <p className="text-xs">กรุณาเลือกปีการศึกษาจนถึงวันปิดเทอม.... หรือ ไม่มีวันหยุดในระหว่างวันที่คุณเลือก</p>
                        }
                    </div>
                    <div className="border rounded-md mt-1 flex flex-wrap w-full gap-x-2.5 p-2 h-44 overflow-y-auto">
                        {
                            holiday.map((holiday, index) => {
                                return (
                                    <div key={index} className="w-fit">
                                        <p className="rounded-lg text-xs bg-blue-400 px-2 py-1 text-white">{formatDateYYYYMMDD(holiday["DTSTART;VALUE=DATE"])}-{holiday.SUMMARY}<span className="ml-1 text-red-700 cursor-pointer" onClick={() => handleDeleteHoliday(index)}>x</span> </p>
                                    </div>
                                
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-col w-1/2 flex-1 px-1">
                    <p className="border-l-4 border-gray-700 pl-1 mb-2"> เพิ่มวันหยุด</p>
                    <div className="w-full">
                        <div className="mb-2">
                            <label className="text-xs font-light block">ชื่อวันหยุด</label>
                                <input 
                                    type="text" 
                                    value={holidayName} 
                                    onChange={(e) => {setHolidayName(e.target.value)} } 
                                    className="border rounded-md mt-1 px-2 py-1 w-full "
                                    required={true}
                                />
                        </div>
                        <div className="mb-2">
                            <label className="text-xs font-light block">วันที่เริ่มหยุด</label>
                            <input 
                                type="date" 
                                value={startHolidayDate} 
                                onChange={(e) => {setStartHolidayDate(e.target.value)} } 
                                className="border rounded-md mt-1 px-2 py-1 w-full"
                                required={true}
                                min={termStart}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="text-xs font-light block">วันที่สิ้นสุดการหยุด</label>
                            <input 
                                type="date" 
                                value={endHolidayDate} 
                                onChange={(e) => {setEndHolidayDate(e.target.value)} } 
                                className="border rounded-md mt-1 px-2 py-1 w-full"
                                required={true}
                                min={startHolidayDate}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="text-xs font-light block">ประเภทของวันหยุด</label>
                            <select name="holidayType" id="holidayType" value={type} onChange={(e) => {setType(e.target.value)}} className="border rounded-md mt-1 px-2 py-1 w-full">
                                <option value="RATCHAKHAN">วันหยุดราชการ</option>
                                <option value="SCHOOL">วันหยุดของโรงเรียนหรือกิจกรรมของโรงเรียน</option>
                            </select>
                        </div>
                       
                        
                        <button 
                            type="button"
                            className="border  bg-slate-50  rounded-md text-sm font-light px-2 py-1 hover:bg-blue-400 hover:text-white"
                            onClick={() => handleClickAddHoliday()}
                        >
                            เพิ่มวันหยุด
                        </button>
                    </div>
                </div>
                <div className="flex flex-col w-full px-1">
                    <button
                        type="button"
                        className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        onClick={() => handleClickAddCalendar()}
                    >
                        บันทึกปฎิทินการเรียน
                    </button>
                </div>
            </div>
        </div>
    );
};
