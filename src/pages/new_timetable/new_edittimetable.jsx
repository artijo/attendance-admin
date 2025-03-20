import { useEffect, useState } from "react";
import { formatDayOfWeeks } from "../../helper";
import { useLocation, useNavigate } from "react-router-dom";
import Searchbar from "../../components/new_timetable/searchbar";
import axios from "axios";
import { HOSTNAME } from "../../config";
import ErrorAlert from "../../components/alert/error";
import { DateTime } from "luxon";

function EditTimetable() {
    const location = useLocation();
    const navigate = useNavigate();
    const { classroom, time, day, timetable } = location.state;
    const [lateTime, setLateTime] = useState(15);
    const [subject, setSubject] = useState(timetable.subject);
    const [errShow, setErrShow] = useState(false);
    const [errmsg, setErrMsg] = useState([]);


    const validateInput = () => {
        if(subject === null || subject === undefined){
            return false;
        }else{
            return true;
        }
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const checkInput = validateInput();
        if(checkInput) {
            const data = {
                timetable:timetable,
                subject:subject,
                periodtime:time,
                timelate:lateTime
            }
            try{
                const response = await axios.put(`${HOSTNAME}/a/timetable`, data);
                if(response.status === 200) {
                    navigate('/timetable',{state:{classroom:classroom},replace:true});
                }else{
                    throw new Error(response.data.message);
                };
            }catch(err){
                console.error(err);
                setErrMsg(err.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไขคาบวิชาในตารางเรียน");
                setErrShow(true);
            };  
        }else{
            setErrMsg("กรุณาเลือกวิชาที่ต้องเพิ่มลงในคาบเรียน");
            setErrShow(true);
        };
        
    };

    const handleDelete = async (timetableId) => {
        // router.delete('/timetable/:timetableId', deleteTimetable);
        const confirmStatus = confirm("ต้องการที่จะลบคาบเรียนนี้จริงๆ หรือ");
        if(confirmStatus){
            try{
                const response = await axios.delete(`${HOSTNAME}/a/timetable/${timetableId}`);
                if(response.status === 200) {
                    navigate('/timetable',{state:{classroom:classroom}, replace:true});
                }else{
                    throw new Error(response.data.message);
                };
            }catch(err){
                console.error(err);
                setErrMsg(err.response?.data?.message || "เกิดข้อผิดพลาดในการลบคาบวิชาในตารางเรียน");
                setErrShow(true);
            };  
        }else{
            return;
        }
    } 

    const handleBackMainTimetable = () => {
        navigate('/timetable', {state:{classroom:classroom}, replace:true});
    };

    const timetableLateTime = () => {
        const timeStart = DateTime.fromISO(timetable.timeStart).setZone(`Asia/Bangkok`);
        const timelate = DateTime.fromISO(timetable.timeLate).setZone(`Asia/Bangkok`);
        const diff = timelate.diff(timeStart,["minutes"])
        setLateTime(diff.minutes);
    }

    const addLateTime = () => {
        setLateTime((prevState) => prevState + 1)
    }

    const minusLateTime = () => {
        setLateTime((prevState) => prevState - 1)
    }

    useEffect(() => {
        if(lateTime <= 0) {
            setLateTime(1);
        };
    },[lateTime]);

    useEffect(() => {
        timetableLateTime();
    },[])
    
    return (
        <div className="w-full">
            <h1 className="text-center font-bold mb-5">จัดการตารางเรียนห้องม.{classroom.classLevel}/{classroom.classRoom} ปีการศึกษา {classroom.term.academicYear} เทอม {classroom.term.semester}</h1>
            {errShow && (
                <div className="mb-5" onClick={() => setErrShow((prevState) => !prevState)}>
                    <ErrorAlert title={"เกิดข้อผิดพลาด"} message={errmsg}/>
                </div>
            )}
            
            <div className="p-4 bg-white border rounded-2xl shadow-md">
                <div className="flex justify-between items-center">
                    <h4 className="text-lg text-gray-700 font-semibold w-fit px-2 py-1 border border-200 rounded-lg bg-gray-200 mb-2">จัดการคาบของวัน {formatDayOfWeeks(day)} เวลา {time.timetableformate}</h4>
                    <button
                        type="button"
                        className="flex justify-center w-fit items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        onClick={() => handleBackMainTimetable()}
                    >
                        ย้อนกลับ
                    </button>
                </div> 
                <form onSubmit={(e) => (handleOnSubmit(e))}>
                    <div>   
                        <div className="mb-2">
                            <p className="text-base font-medium mb-1">วิชา</p>
                            <div className="flex gap-2">
                                <p className="px-2 text-base font-medium rounded-lg bg-gray-200">{subject != null ? `${subject.subNameThai}` : "ว่าง"}</p>
                                <Searchbar valueSetSelectedSubject={setSubject}/>
                            </div>
                        </div>
                        <div className="mb-2">
                            <p className="text-base font-medium mb-1">เวลาเลทของคาบ(นาที)</p>
                            <div className="flex items-center gap-2">
                                <div onClick={minusLateTime} className="border px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                    </svg>
                                </div>
                                <label
                                    className="flex justify-center items-center w-16 h-16 px-3 py-2 bg-gray-100 text-3xl text-gray-400 font-bold border rounded-xl" 
                                    htmlFor="latetime-input" 
                                >
                                    {lateTime}
                                </label>
                                <div onClick={addLateTime} className="border px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                            </div>
                            <input id="latetime-input" type="number" className="hidden" value={lateTime}  disabled={true}/>
                        </div>
                    </div>
                    <div className="flex w-fit ml-auto gap-2">
                        
                        <button
                            type="button"
                            className="flex mt-5 justify-center w-fit items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                            onClick={() => handleDelete(timetable.timetableId)}
                        >
                            ลบ
                        </button>
                        <button
                            type="submit"
                            className="flex mt-5 justify-center w-fit items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
                        >
                            แก้ไขคาบเรียน
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
};

export default EditTimetable;