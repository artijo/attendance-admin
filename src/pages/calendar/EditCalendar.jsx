import { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatDateTimeISOToDate,formatDateToThai } from "../../helper.js";

export const EditCalendar = () => {
    const location = useLocation();
    const [title, setTitle] = useState(location.state.title);
    const [startDate, setStartDate] = useState(formatDateTimeISOToDate(location.state.startDate));
    const [endDate, setEndDate] = useState(formatDateTimeISOToDate(location.state.endDate));

    return(
        <div>
            <h1>แก้ไขปฎิทิน{`${location.state.title}`}  {` ${formatDateToThai(location.state.startDate)}`}</h1>
            <div className="container mx-auto bg-white p-3 rounded-md shadow">
                <div>
                    <label className="text-xs font-light block">ชื่อวันหยุด</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => {setTitle(e.target.value)}} 
                        name="title"
                        className="border rounded-md mt-1 px-2 py-1 w-full"
                    ></input>
                </div>
                <div>
                    <label className="text-xs font-light block">วันที่เริ่มหยุด</label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => {setStartDate(e.target.value)}} 
                        name="startDate"
                        className="border rounded-md mt-1 px-2 py-1 w-full"
                    ></input>
                </div>
                <div>
                    <label className="text-xs font-light block">วันที่สิ้นสุดการหยุด</label>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => {setEndDate(e.target.value)}} 
                        name="endDate"
                        className="border rounded-md mt-1 px-2 py-1 w-full"
                    ></input>
                </div>
                <div className="text-end mt-5">
                    <button type="button"  className=" w-fit ml-auto text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">ลบวันหยุด</button>
                    <button type="button"  className="w-fit ml-auto text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">แก้ไข</button>
                </div>
            </div>
            
        </div>
    );
};