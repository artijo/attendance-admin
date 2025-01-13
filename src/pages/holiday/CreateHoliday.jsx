import { useState,useEffect } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import { Holidaylisttable } from "../../components/holiday/createholiday/holidaylisttable";
import {formatDateYYYYMMDD} from "../../helper.js"
import axios from "axios";

function CreateHoliday(){
    const [holidayAutoList, setHolidayAutoList] = useState([]);
    
    const fecthHolidayAuto = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/holidayauto`)
            if(response.status === 200){
                const newList = response.data.map((holiday) => ({
                    holidayname: holiday.SUMMARY,
                    startDate: formatDateYYYYMMDD(holiday["DTSTART;VALUE=DATE"]),
                    endDate: formatDateYYYYMMDD(holiday["DTEND;VALUE=DATE"])
                }));
                console.log(newList);
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
    const [holidayType, setHolidayType] = useState("");
    const [academicYearSemester, setAcademicYearSemester] = useState("");

    const handleOnSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <h1 className="font-medium mb-4">ฟอร์มสร้างวันหยุด</h1>
            <div className="grid gap-5 md:grid-cols-2">
                <div className="holiday" id="holiday-box">
                    <Holidaylisttable holidayList={holidayAutoList}/>
                </div>
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
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                ชื่อวันหยุด
                            </label>
                            <input 
                                className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                type="text" name="academicYear" value={holidayName} onChange={(e) => setHolidayName(e.target.value)} required={true}/>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                วันที่เริ่มหยุด
                            </label>
                            <input 
                                className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                type="date" name="semester" value={startDate} onChange={(e) => setStartDate(e.target.value)} required={true} min={startDate}/>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                วันที่สิ้นสุดการหยุด
                            </label>
                            <input 
                                className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                                type="date" name="semester" value={endDate} onChange={(e) => setEndDate(e.target.value)} required={true}/>
                        </div>

                    </div>
                    <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        เพิ่มวันหยุดลงตาราง
                    </button>
                </form>
            </div>
            
        </div>
    );
};

export default CreateHoliday;