import { useState,useEffect } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import { Holidaylisttable } from "../../components/holiday/createholiday/holidaylisttable";
import {formatDateYYYYMMDD} from "../../helper.js"
import { DateTime } from "luxon";
import axios from "axios";


function daybetween(Start, End) {
    const dates = [];
    if (Start !== "" && End !== "") {
        const startDate = DateTime.fromISO(Start);
        const endDate = DateTime.fromISO(End);
        // console.log("Start Date:", startDate.toString());
        // console.log("End Date:", endDate.toString());
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

function CreateHoliday(){
    const [holidayAutoList, setHolidayAutoList] = useState([]);
    
    const fecthHolidayAuto = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/holidayauto`)
            if(response.status === 200){
                const newList = response.data.map((holiday,index) => ({
                    id: index,
                    holidayname: holiday.SUMMARY,
                    startDate: formatDateYYYYMMDD(holiday["DTSTART;VALUE=DATE"]),
                    endDate: formatDateYYYYMMDD(holiday["DTEND;VALUE=DATE"]),
                    type:"RATCHAKHAN"
                }));
                setHolidayAutoList(newList);
            };
        }catch(error){
            console.error(error);
        };
    };

    useEffect(()=> {
        fecthHolidayAuto()
    },[])

    const [academicYearTermList, setAcademicYearTermList] = useState([]);
    const fecthAcademicYearTerms = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            if(response.status === 200){
                setAcademicYearTermList(response.data);  
            };
            if(response.data.length > 0){
                setAcademicYearSemester(response.data[0].termId);
            }
        }catch(error){
            console.error(error)
        };
    };
    useEffect(() => {
        fecthAcademicYearTerms();
    },[]);
    // input
    const [holidayName, setHolidayName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [holidayType, setHolidayType] = useState("RATCHAKHAN");
    const [academicYearSemester, setAcademicYearSemester] = useState("");

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const data = {
            holidayList: holidayAutoList,
            termId: academicYearSemester
        }
        try{
            const response = await axios.post(`${HOSTNAME}/a/holiday`,data);
            if(response.status === 200){
                alert("เพิ่มรายการวันหยุดในเทอมนั้นเรียบร้อย");
            };
        }catch(error){
            console.error(error);
        }
    };
    
    const handleAddHoliday = (e) => {
        e.preventDefault();
        const data = daybetween(startDate, endDate).map((date) => ({
            holidayname: holidayName,
            startDate: date,
            endDate: date,
            type: holidayType,
        }));
        const newHoliday = [...data,...holidayAutoList];
        setHolidayAutoList(newHoliday);
        alert("เพิ่มรายการวันหยุดในตารางเรียบร้อย");
        setHolidayName("");
        setStartDate("");
        setEndDate("");
        setHolidayType("RATCHAKHAN");
    }

    return (
        <div>
            <h1 className="font-medium mb-4">ฟอร์มสร้างวันหยุด</h1>
            <div className="grid gap-2 md:grid-cols-2">
                <div className="holiday" id="holiday-box">
                    <Holidaylisttable holidayList={holidayAutoList}/>
                </div>
                <div className="grid gap-2 md:grid-cols-1">
                    <form className="border p-4 rounded-lg bg-white grid grid-cols-1 gap-2" onSubmit={(e) => handleAddHoliday(e)}>
                        <h4 className="mb-4 font-medium">เพิ่มรายการวันหยุด</h4>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                ชื่อวันหยุด
                            </label>
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
                            <label className="block text-xs font-medium text-gray-700">
                                ประเภทวันหยุด
                            </label>
                            <select name="holidayType" 
                                className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                value={holidayType}
                                onChange={(e) => setHolidayType(e.target.value)}
                            >
                                <option value="RATCHAKHAN">วันหยุดราชกาล</option>
                                <option value="SCHOOL">วันหยุดโรงเรียน</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                วันที่เริ่มหยุด
                            </label>
                            <input
                                className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                type="date"
                                name="semester"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required={true}
                                min={startDate}
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-700">
                                วันที่สิ้นสุดการหยุด
                            </label>
                            <input
                                className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                type="date"
                                name="semester"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required={true}
                            />
                        </div>
                        <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            เพิ่มรายการวันหยุด
                        </button>
                    </form>
                    <form onSubmit={(e) => handleOnSubmit(e)} className="h-fit border p-4 rounded-lg mb-4 bg-white grid grid-cols-1 gap-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">
                                    ปีการศึกษาและเทอม <span> <Link to="/terms/create">เพิ่มปีการศึกษา</Link> </span>
                                </label>
                                <select name="academicyear_semester" onChange={(e)=> setAcademicYearSemester(e.target.value)} className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border">
                                    {
                                        academicYearTermList.length > 0 ? 
                                            academicYearTermList.map((academicYearTermList) => {
                                                return (
                                                    <option  key={academicYearTermList.termId} value={academicYearTermList.termId}>ปีการศึกษา {academicYearTermList.academicYear + 543}-เทอม {academicYearTermList.semester}</option>
                                                );
                                            })
                                        :
                                            <option value={""}>
                                                ไม่มีปีการศึกษา
                                            </option>
                                    }
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            เพิ่มวันหยุดในเทอมนั้น
                        </button>
                    </form>
                </div>
            </div>
            
        </div>
    );
};

export default CreateHoliday;