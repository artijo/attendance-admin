import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { convertNumberToThaiMonth, formatDayOfWeeks } from "../../helper";

function Timetable() {
    const location = useLocation();
    const navigate = useNavigate();
    const { classroom } = location.state;
    const [timetable, setTimetable] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const dateKey = timetable != null && Object.keys(timetable);

    const timeStudyList = [
        {
            startDatabaseFormat: "08:40:00",
            endDatabaseFormat: "09:30:00",
            timetableformate: "08.40 - 09.30",
            period: 1
        },
        {
            startDatabaseFormat: "09:30:00",
            endDatabaseFormat: "10:20:00",
            timetableformate: "09.30 - 10.20",
            period: 2
        },
        {
            startDatabaseFormat: "10:20:00",
            endDatabaseFormat: "11:10:00",
            timetableformate: "10.20 - 11.10",
            period: 3
        },
        {
            startDatabaseFormat: "11:10:00",
            endDatabaseFormat: "12:00:00",
            timetableformate: "11.10 - 12.00",
            period: 4
        },
        {
            startDatabaseFormat: "12:00:00",
            endDatabaseFormat: "13:00:00",
            timetableformate: "12.00 - 13.00",
            period: "พักเที่ยง"
        },
        {
            startDatabaseFormat: "13:00:00",
            endDatabaseFormat: "13:50:00",
            timetableformate: "13.00 - 13.50",
            period: 5
        },
        {
            startDatabaseFormat: "13:50:00",
            endDatabaseFormat: "14:40:00",
            timetableformate: "13.50 - 14.40",
            period: 6
        },
        {
            startDatabaseFormat: "14:40:00",
            endDatabaseFormat: "15:30:00",
            timetableformate: "14.40 - 15.30",
            period: 7
        },
    ];

    const handleEditTimetable = (timetable, time, day) => {
        navigate('edit', {state: {time: time, day: day, classroom: classroom, timetable: timetable}, replace: true});
    }

    const handleAddTimetable = (time, day) => {
        navigate('create', {state: {time: time, day: day, classroom: classroom}, replace: true});
    }
    
    const fetchTimetable = async (classroomId) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${HOSTNAME}/a/timetableR?classroomid=${classroomId}`);
            setTimetable(response.data);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลตารางเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(classroom) {
            fetchTimetable(classroom.classId);
        }
    }, [classroom]);

    const getSubjectCardStyle = (subject) => {
        // Generate a consistent color based on subject code
        const hash = subject.subCode.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        
        const hue = hash % 360;
        const saturation = 75 + (hash % 20);
        const lightness = 40 + (hash % 10);
        
        return {
            backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            borderLeft: `4px solid hsl(${hue}, ${saturation + 10}%, ${lightness - 10}%)`
        };
    };

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">ตารางเรียน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
                
                <Link 
                    to="/calendar" 
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้าห้องเรียน
                </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-text-color font-heading flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            ตารางเรียนประจำห้อง
                        </h3>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>{error}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative overflow-x-auto bg-white rounded-lg">
                            <div className="timetable-container">
                                <div className="timetable-wrapper">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="px-2 py-3 bg-gray-50 border text-center">
                                                    <div className="text-xs font-medium text-text-color-alt tracking-wider uppercase font-heading">
                                                        วัน / คาบเรียน
                                                    </div>
                                                </th>
                                                {timeStudyList.map((time, index) => (
                                                    <th key={index} className={`px-4 py-3 text-center border ${time.period === 'พักเที่ยง' ? 'bg-amber-50' : 'bg-gray-50'}`}>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-primary tracking-wider uppercase font-heading">
                                                                {typeof time.period === 'number' ? `คาบที่ ${time.period}` : time.period}
                                                            </span>
                                                            <span className="text-xs text-text-color-alt font-body mt-1">
                                                                {time.timetableformate}
                                                            </span>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {dateKey && dateKey.length > 0 ? (
                                                dateKey.map((key, keyindex) => (
                                                    <tr key={`${key}-${keyindex}`} className="hover:bg-gray-50">
                                                        <th className="px-4 py-2 border bg-gray-50 text-center">
                                                            <div className="text-sm font-medium text-text-color font-heading">
                                                                {formatDayOfWeeks(key)}
                                                            </div>
                                                        </th>
                                                        {timeStudyList.map((time, period) => {
                                                            const timetablethistime = timetable[key].find((tt) => tt.timeStart === time.startDatabaseFormat);
                                                            
                                                            if(time.startDatabaseFormat === "12:00:00" ) {
                                                                return (
                                                                    <td key={`${time}-period-${period}`} className="border border-gray-100 p-0">
                                                                        <div className="flex flex-col justify-center items-center h-28 bg-amber-50 p-2 text-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                            <span className="text-sm font-medium text-text-color">พักเที่ยง</span>
                                                                            <span className="text-xs text-text-color-alt">12:00 - 13:00</span>
                                                                        </div>
                                                                    </td>
                                                                );
                                                            } else if (!timetablethistime) {
                                                                return (
                                                                    <td key={`${time}-period-${period}`} className="border border-gray-100 p-0">
                                                                        <button 
                                                                            onClick={() => handleAddTimetable(time, key)}
                                                                            className="w-full h-28 flex flex-col justify-center items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                                                                        >
                                                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1 group-hover:bg-primary/20">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-color-alt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                                                                                </svg>
                                                                            </div>
                                                                            <span className="text-xs text-text-color-alt">เพิ่มวิชา</span>
                                                                        </button>
                                                                    </td>
                                                                );
                                                            } else {
                                                                const subjectStyle = getSubjectCardStyle(timetablethistime.subject);
                                                                
                                                                return (
                                                                    <td key={`${time}-period-${period}`} className="border border-gray-100 p-0">
                                                                        <button 
                                                                            onClick={() => handleEditTimetable(timetablethistime, time, key)}
                                                                            className="w-full h-28 text-left transition-transform duration-150 hover:scale-[1.02]"
                                                                        >
                                                                            <div 
                                                                                className="h-full p-3 text-white flex flex-col"
                                                                                style={subjectStyle}
                                                                            >
                                                                                <h5 className="text-sm font-medium mb-1 line-clamp-2">
                                                                                    {timetablethistime.subject.subNameThai}
                                                                                </h5>
                                                                                <div className="text-xs bg-white/20 rounded px-1.5 py-0.5 w-fit mb-1">
                                                                                    {timetablethistime.subject.subCode}
                                                                                </div>
                                                                                <div className="mt-auto text-xs">
                                                                                    <div className="flex items-center">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                                        </svg>
                                                                                        {timetablethistime.subject.teacher?.fName} {timetablethistime.subject.teacher?.lName}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                );
                                                            }
                                                        })}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={timeStudyList.length + 1} className="px-4 py-8 text-center border">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                            </svg>
                                                            <h3 className="text-xl font-medium text-text-color mb-2 font-heading">ไม่พบข้อมูลตารางเรียน</h3>
                                                            <p className="text-text-color-alt font-body">ยังไม่มีข้อมูลตารางเรียนสำหรับห้องเรียนนี้</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h4 className="text-sm font-medium text-text-color mb-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    คำอธิบาย
                                </h4>
                                <ul className="text-sm text-text-color-alt space-y-1.5">
                                    <li className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        คลิกที่ช่องว่างเพื่อเพิ่มรายวิชา
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
                                        คลิกที่รายวิชาเพื่อแก้ไขหรือลบ
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Timetable;
