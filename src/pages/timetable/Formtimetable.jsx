import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { convertSecondsToTime, formatDayOfWeeks, formatTime } from '../../helper.js';
import { Inputtimetable } from '../../components/timetable/inputtimetable.jsx';
import { Searchbar } from '../../components/subject/searchbar.jsx';
import { HOSTNAME } from '../../config.js';
import axios from 'axios';


export const Formtimetable = () => {
    const location = useLocation();
    const [day, setDay] = useState(0);
    const [searchbarValue, setSearchbarValue] = useState("");
    const [classroomInfo, setClassroomInfo] = useState({});
    const [timeStart, setTimeStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [timeLate, setTimeLate] = useState(0);
    const [clasrroom, setClassroom] = useState("");
    const [selectedSubject, setSeletedSubject] = useState({});


    const sendForm = async () => {
        try {
            if (day === 0 || timeStart === "" || clasrroom === "" || Object.keys(selectedSubject).length === 0) {
                alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            } else {
                const formData = {
                    day: day,
                    timestart: timeStart,
                    timeend: timeEnd,
                    timelate:  ( convertSecondsToTime(location.state.time+(parseInt(timeLate)*60))),
                    classroom: clasrroom,
                    subject: selectedSubject
                }
                await axios.post(`${HOSTNAME}/a/timetable`, formData);
                window.location.href = `/timetable/${clasrroom}`;
            }
        } catch (err) {
            console.error(err);
        };
    };

    const handleTimeLateValue = (value) => {
        setTimeLate(parseInt(value))
    }

    const fetchRoomInfo = async (classroomId) => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/classroom/${classroomId}`);
            setClassroomInfo(response.data);
        }catch(error){
            console.error(error);
        };
    };

    const handleStateLocation = () => {
        if(location.state.subject){
            setSeletedSubject(location.state.subject);
            setSearchbarValue(location.state.subject.subCode);
        }
        setDay(location.state.day);
        setTimeStart(convertSecondsToTime(location.state.time));
        setClassroom(location.state.classroom);
        fetchRoomInfo(location.state.classroom);
        setTimeEnd(convertSecondsToTime(parseInt(location.state.time) + 3000)); //3000 = 50 นาที
    }

    useEffect(() => {
        handleStateLocation();
    }, []);

    return (
        <div className='mx-auto container'>
            <div className='mb-2'>
                    <h1 className='mb-1'>ฟอร์มสร้างตารางเรียน วัน {formatDayOfWeeks(day)} เวลา {formatTime(timeStart)} ถึง {formatTime(timeEnd)} </h1>
                    {
                        Object.keys(classroomInfo).length > 0 ? 
                        <h3>ห้องเรียน {classroomInfo.classLevel}/{classroomInfo.classRoom} ภาคเรียนที่ {classroomInfo.term.semester} ปีการศึกษา {classroomInfo.term.academicYear+543} </h3>
                        :
                        <h3>กำลังโหลดข้อมูล....</h3>                   
                    }
            </div>
            <div className='bg-white py-10 px-4 shadow-sm border'>
                <div className='grid gap-2 border-collapse'>
                    <div className="border bg-white p-4 rounded-sm">
                        {/* <h4>เวลาเลท</h4> */}
                        <div className="grid grid-cols-2 gap-4">
                            
                            {/* <Inputtimetable value={timeLate} disabled={false} label={"เวลาเลท"} onChange = {}/> */}
                            <div className='flex flex-col'>
                                <label className="text-xs font-light ">เวลาเลท<span className="text-gray-300">(หน่วยนาที)</span></label>
                                <input type="number" value={15} className="border rounded-sm mt-1 px-2 py-1" onChange={(e) => handleTimeLateValue(e.target.value)} />
                            </div>
                            <div className='hidden'>
                                <Inputtimetable value={clasrroom} disabled={true} label={"รหัสห้องเรียน"} />
                                <Inputtimetable value={day} disabled={true} label={"วัน"} />
                                <Inputtimetable value={timeStart} disabled={true} label={"เวลาเริ่ม"} />
                                <Inputtimetable value={timeEnd} disabled={true} label={"เวลาจบคาบ"} />
                            </div>
                        
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="border bg-white p-4 shadow-sm ">
                            <Searchbar selectedSubject={setSeletedSubject} inputvalue={searchbarValue} setInputvalue={setSearchbarValue} />
                        </div>
                        <div className="border bg-white p-4  shadow-sm">
                            <p className="text-xs font-light ">รายละเอียดวิชา</p>
                            <div>
                                {
                                    Object.keys(selectedSubject).length === 0 ? <p className="text-xs text-center">ไม่มีข้อมูล</p> :
                                        <>
                                            <p>
                                                <span className="text-xs">รหัสวิชา : {selectedSubject.subCode}</span>
                                            </p>
                                            <p>
                                                <span className="text-xs">หน่วยกิต : {selectedSubject.subCredit}</span>
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
                <button
                     className="flex mt-5 ml-auto justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={sendForm}
                >
                    บันทึกเวลา
                </button>
            </div>
        </div>
        
    );
}