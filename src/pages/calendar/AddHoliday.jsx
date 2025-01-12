import axios from "axios";
import { CreateCalendar } from "../../components/calendar/createcalendar/calendarCreate";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../helper.js";
import { HOSTNAME } from "../../config.js";
export const AddHoliday = () => { //{semester, academicYear, holidayList}
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [type, setType] = useState("RATCHAKHAN");
    const location = useLocation();
    console.log(location.state);

    const sentFormData = async (data, dataForDelete) => {
        try{
            await axios.post(`${HOSTNAME}/a/holiday`, data);
            await axios.delete(`${HOSTNAME}/a/studingtime`, {data: dataForDelete});
            window.location.href = `/calendarmanage`
        }catch(error){
            console.error(error);
        }
    }

    const handleSubmit = (e) => {

        const dataForDelete = {
            semester: location.state.semester,
            academicYear: location.state.academicYear,
            date: startDate,
        }   

        e.preventDefault(); 
        const data = {
            holiday: [
                {
                    SUMMARY: title,
                    "DTSTART;VALUE=DATE":  formatDate(startDate),
                    "DTEND;VALUE=DATE": formatDate(endDate),
                    TYPE: type,
                }
            ],
            semester: `${location.state.semester}|${location.state.academicYear}`,
        };
        sentFormData(data, dataForDelete);
    };

    return ( 
        <div className="container mx-auto ">
            <h2 className="mb-2">เพิ่มวันหยุด</h2>
            <p className="mb-2">ปีการศึกษา {location.state.academicYear} เทอม {location.state.semester}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col  gap-2 shadow rounded-md p-2 h-fit bg-white">
                    <div className="flex flex-col">
                        <label className="text-xs font-light block">ชื่อวันหยุด</label>
                        <input className="border rounded-md mt-1 px-2 py-1"  type="text" placeholder="กรุณาใส่ชื่อวันหยุด..." onChange={(e) => setTitle(e.target.value)} value={title} required/>
                    </div>
                    <div>
                        <label className="text-xs font-light block">วันที่เริ่มหยุด</label>
                        <input className="border rounded-md mt-1 px-2 py-1 w-full" type="date" value={startDate} disabled={true} required/>
                    </div>
                    <div>
                        <label className="text-xs font-light block">วันที่สิ้นสุดการหยุด</label>
                        <input className="border rounded-md mt-1 px-2 py-1 w-full" type="date" value={endDate} disabled={true} required/>
                    </div>
                    <div className="mb-2">
                        <label className="text-xs font-light block">ประเภทของวันหยุด</label>
                        <select name="holidayType" id="holidayType" value={type} onChange={(e) => {setType(e.target.value)}} className="border rounded-md mt-1 px-2 py-1 w-full">
                            <option value="RATCHAKHAN">วันหยุดราชการ</option>
                            <option value="SCHOOL">วันหยุดของโรงเรียนหรือกิจกรรมของโรงเรียน</option>
                        </select>
                    </div>
                    <button type="submit" className="block w-fit ml-auto  text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">เพิ่มวันหยุด</button>
                </form>
                <div className="p-5 rounded-md shadow-md bg-white">
                    <div className="flex gap-2 text-sm mb-2 mx-auto w-fit">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500"></div>
                            <span>วันหยุดราชการ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500"></div>
                            <span>วันหยุดของโรงเรียน</span>
                        </div>
                    </div>
                    {location.state && <CreateCalendar holidayList={location.state.holidayList} setStartDate={setStartDate} setEndDate={setEndDate}/>}
                </div>
               
            </div>
        </div>
    );
};