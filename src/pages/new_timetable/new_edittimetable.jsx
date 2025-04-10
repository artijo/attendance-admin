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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
                setIsSubmitting(true);
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
            } finally {
                setIsSubmitting(false);
            }
        }else{
            setErrMsg("กรุณาเลือกวิชาที่ต้องเพิ่มลงในคาบเรียน");
            setErrShow(true);
        };
    };

    const handleDelete = async (timetableId) => {
        try {
            const confirmed = window.confirm("ยืนยันการลบคาบเรียนนี้ใช่หรือไม่?");
            if (confirmed) {
                setIsDeleting(true);
                const response = await axios.delete(`${HOSTNAME}/a/timetable/${timetableId}`);
                if(response.status === 200) {
                    navigate('/timetable',{state:{classroom:classroom}, replace:true});
                } else {
                    throw new Error(response.data.message);
                }
            }
        } catch(err) {
            console.error(err);
            setErrMsg(err.response?.data?.message || "เกิดข้อผิดพลาดในการลบคาบวิชาในตารางเรียน");
            setErrShow(true);
        } finally {
            setIsDeleting(false);
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
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">แก้ไขคาบเรียนในตารางสอน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-text-color font-heading">
                            ม.{classroom.classLevel}/{classroom.classRoom}
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">
                            ปีการศึกษา {classroom.term.academicYear + 543} เทอม {classroom.term.semester}
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={handleBackMainTimetable}
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้าตารางเรียน
                </button>
            </div>
            
            {errShow && (
                <div 
                    className="mb-6 cursor-pointer" 
                    onClick={() => setErrShow(false)}
                >
                    <ErrorAlert title="เกิดข้อผิดพลาด" message={errmsg}/>
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="p-6">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-yellow-100 text-yellow-600 rounded-full p-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-text-color font-heading">
                                แก้ไขคาบเรียน
                            </h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-text-color">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDayOfWeeks(day)}
                            </div>
                            <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-text-color">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                เวลา {time.timetableformate}
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={handleOnSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-color font-body flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    วิชาที่สอน <span className="text-red-500">*</span>
                                </label>
                                
                                <div className="flex items-center gap-3">
                                    <div className={`flex-grow p-3 rounded-lg ${subject ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200'}`}>
                                        {subject ? (
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-text-color">{subject.subNameThai}</span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        {subject.subCode}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-text-color-alt mt-1">
                                                    <span className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        คุณครู {subject.teacher.fName} {subject.teacher.lName}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-text-color-alt flex items-center h-14 justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                กรุณาเลือกวิชาที่ต้องการเพิ่ม
                                            </div>
                                        )}
                                    </div>
                                    
                                    <Searchbar valueSetSelectedSubject={setSubject} />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-color font-body flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    เวลาสาย (นาที)
                                </label>
                                
                                <div className="flex items-center gap-3">
                                    <button 
                                        type="button"
                                        onClick={minusLateTime}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                        </svg>
                                    </button>
                                    
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                        <span className="text-2xl font-medium text-primary">{lateTime}</span>
                                    </div>
                                    
                                    <button 
                                        type="button"
                                        onClick={addLateTime}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                    
                                    <input type="hidden" value={lateTime} />
                                    
                                    <div className="ml-2 text-sm text-text-color-alt bg-blue-50 px-3 py-1.5 rounded-lg">
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            จำนวนนาทีที่นักเรียนสามารถเข้าสายได้
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100 flex justify-between">
                            <button
                                type="button"
                                onClick={() => handleDelete(timetable.timetableId)}
                                disabled={isDeleting}
                                className={`inline-flex justify-center items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg transition-colors duration-300 ${
                                    isDeleting
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                }`}
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังลบ...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        ลบคาบเรียน
                                    </>
                                )}
                            </button>
                            
                            <button
                                type="submit"
                                disabled={isSubmitting || !subject}
                                className={`inline-flex justify-center items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg transition-colors duration-300 ${
                                    isSubmitting || !subject
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                                }`}
                            >
                                {isSubmitting ? (
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        บันทึกการแก้ไข
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditTimetable;