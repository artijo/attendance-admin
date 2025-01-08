import { useState } from "react";
import { Calendar } from "./CreateCalendar.jsx";
import { EditHoliday } from "./EditHoliday.jsx"; 

export const ManageCalendar = () => {
    const [selectPage, setSetSelectPage] = useState(0);


    return(
        <div className="container mx-auto">
            <div className="nav shadow-md border-2 border-slate-600 w-fit rounded-md mb-5">
                <ul className="flex justify-evenly gap-10 px-10">
                    <li className="flex justify-center">
                        <span 
                            className={`py-2 px-2 cursor-pointer ${selectPage === 0 && "border-b-4 border-gray-600 "}    hover:bg-slate-200 `}
                            onClick={()=> {setSetSelectPage(0)}}
                        >
                            สร้างปฎิทิน
                        </span>
                    </li>
                    <li className="flex justify-center">
                        <span 
                            className={`py-2 px-2 cursor-pointer ${selectPage === 1 && "border-b-4 border-gray-600"} hover:bg-slate-200`}
                            onClick={() => setSetSelectPage(1)}
                        >
                            แก้ไขวันหยุด
                        </span>
                        
                    </li>
                </ul>
            </div>
            <div className="component-blox">
                {
                    selectPage === 0 && <Calendar/>
                }
                {
                    selectPage === 1 && <EditHoliday/>
                }
            </div>
        </div>
    );
};