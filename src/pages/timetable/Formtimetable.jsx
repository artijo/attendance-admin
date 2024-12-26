import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { convertSecondsToTime,formatDayOfWeeks } from '../../helper.js';
import { Inputtimetable } from '../../components/timetable/inputtimetable.jsx';
import { Searchbar } from '../../components/subject/searchbar.jsx';
export const Formtimetable = () => {
    const location = useLocation();
    const [day, setDay] = useState(0);
    const [time, setTime] = useState("");
    const [clasrroom, setClassroom] = useState("");
    const [selectedSubject, setSeletedSubject] = useState({});
    

    const handleStateLocation = () => {
        setDay(location.state.day);
        setTime(convertSecondsToTime(location.state.time));
        setClassroom(location.state.classroom);
    }

    useEffect(() => {
        handleStateLocation();
    }, []);


    return (
        <div>
            <h1 className='mb-2'> สร้างตารางเรียน วัน {formatDayOfWeeks(day)} เวลา {time} </h1>
            <div className='grid gap-2'>
                <div className="border bg-white p-4 rounded-lg shadow-sm">
                    <h4>รายละเอียด<span className="text-sm text-gray-400">(ไม่สามารถแก้ไขได้)</span></h4>
                    <div className="grid grid-cols-2 gap-4">
                        <Inputtimetable value={day} disabled={true} label={"วัน"}/>
                        <Inputtimetable value={time} disabled={true} label={"เวลา"}/>
                        <Inputtimetable value={clasrroom} disabled={true} label={"รหัสห้องเรียน"}/>
                    </div>
                </div>
            
                <div className="grid grid-cols-2 gap-4">  
                    <div className="border bg-white p-4 rounded-lg shadow-sm ">
                        <Searchbar selectedSubject={setSeletedSubject} />
                    </div>
                    <div className="border bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-xs font-light ">รายละเอียดวิชา</p>
                        <div className="mt-1 border p-2 rounded-lg shadow-sm">
                            {
                                Object.keys(selectedSubject).length === 0 ? <p className="text-xs text-center">ไม่มีข้อมูล</p> : 
                                <>
                                    <p>
                                        <span className="text-xs">รหัสวิชา : {selectedSubject.subCode}</span>
                                    </p>
                                    <p>
                                        <span className="text-xs">หน่วยกิต : {selectedSubject.credit}</span>
                                    </p>
                                    <p>
                                        <span className="text-xs">ชื่อวิชา : {selectedSubject.subNameThai}<span className='text-gray-300'>({selectedSubject.subNameEng})</span></span>
                                    </p>
                                    <p>
                                        <span className="text-xs">ผู้สอน : {selectedSubject.teacher.fName} {selectedSubject.teacher.lName}</span>
                                    </p>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <button className="mt-5 block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">บันทึกเวลา</button>
        </div>
    );
}