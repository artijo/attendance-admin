import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import ClassroomList from "../../components/classroom/classroomlist";

function Classroom() {
    const [allClassrooms, setAllClassrooms] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extract unique academic years
    const academicYears = useMemo(() => {
        if (!allClassrooms) return [];
        const years = [...new Set(allClassrooms.map(classroom => classroom.term.academicYear))];
        return years.sort((a, b) => b - a); // Sort in descending order
    }, [allClassrooms]);
    
    // Apply filters to allClassrooms (client-side filtering)
    const filteredClassrooms = useMemo(() => {
        if (!allClassrooms) return null;
        
        let filtered = [...allClassrooms];
        
        // Filter by grade level
        if (selectedGrade !== "all") {
            filtered = filtered.filter((classroom) => parseInt(classroom.classLevel) == selectedGrade);
        }
        
        // Filter by academic year
        if (selectedYear !== "all") {
            filtered = filtered.filter((classroom) => classroom.term.academicYear == selectedYear);
        }
        
        return filtered;
    }, [allClassrooms, selectedGrade, selectedYear]);

    // Calculate total counts
    const totalClassrooms = useMemo(() => {
        return allClassrooms ? allClassrooms.length : 0;
    }, [allClassrooms]);

    // Fetch classrooms once on component mount
    useEffect(() => {
        setIsLoading(true);
        axios.get(HOSTNAME + "/a/classrooms")
            .then((response) => {
                setAllClassrooms(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching classrooms", error);
                setError("Failed to load classrooms. Please try again later.");
                setIsLoading(false);
            });
    }, []);

    // Reset filters function
    const resetFilters = () => {
        setSelectedGrade("all");
        setSelectedYear("all");
    };

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">ห้องเรียน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                {filteredClassrooms && (
                    <div className="mb-3 sm:mb-0 bg-white rounded-lg px-4 py-2 border border-line shadow-sm">
                        <span className="text-text-color-alt font-body">จำนวนห้องเรียนทั้งหมด:</span>
                        <span className="ml-2 font-medium text-primary text-lg font-heading">{filteredClassrooms.length} ห้อง</span>
                        {filteredClassrooms.length !== totalClassrooms && (selectedGrade !== "all" || selectedYear !== "all") && (
                            <span className="ml-2 text-sm text-text-color-alt font-body">
                                (จากทั้งหมด {totalClassrooms} ห้อง)
                            </span>
                        )}
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                        to={'create'} 
                        className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        เพิ่มห้องเรียน
                    </Link>
                    <Link 
                        to={'types'} 
                        className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        จัดการประเภทห้องเรียน
                    </Link>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-line mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:w-1/2">
                        <label htmlFor="gradeFilter" className="block text-sm font-medium text-text-color font-body mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            กรองตามระดับชั้น
                        </label>
                        <select
                            id="gradeFilter"
                            name="gradeFilter"
                            className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            value={selectedGrade}
                            disabled={isLoading}
                        >
                            <option value="all">ทุกระดับชั้น</option>
                            <option value="1">มัธยมศึกษาปีที่ 1</option>
                            <option value="2">มัธยมศึกษาปีที่ 2</option>
                            <option value="3">มัธยมศึกษาปีที่ 3</option>
                            <option value="4">มัธยมศึกษาปีที่ 4</option>
                            <option value="5">มัธยมศึกษาปีที่ 5</option>
                            <option value="6">มัธยมศึกษาปีที่ 6</option>
                        </select>
                    </div>
                    
                    <div className="w-full sm:w-1/2">
                        <label htmlFor="yearFilter" className="block text-sm font-medium text-text-color font-body mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            กรองตามปีการศึกษา
                        </label>
                        <select
                            id="yearFilter"
                            name="yearFilter"
                            className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                            onChange={(e) => setSelectedYear(e.target.value)}
                            value={selectedYear}
                            disabled={isLoading}
                        >
                            <option value="all">ทุกปีการศึกษา</option>
                            {academicYears.map(year => (
                                <option key={year} value={year}>
                                    ปีการศึกษา {year+543}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {(selectedGrade !== "all" || selectedYear !== "all") && (
                    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-text-color font-body mr-2">
                            กำลังกรอง:
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedGrade !== "all" && (
                                <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium flex items-center">
                                    ระดับชั้น {selectedGrade}
                                    <button 
                                        onClick={() => setSelectedGrade("all")}
                                        className="ml-1.5 hover:text-primary/70"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            {selectedYear !== "all" && (
                                <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium flex items-center">
                                    ปีการศึกษา {parseInt(selectedYear)+543}
                                    <button 
                                        onClick={() => setSelectedYear("all")}
                                        className="ml-1.5 hover:text-primary/70"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            {(selectedGrade !== "all" || selectedYear !== "all") && (
                                <button
                                    onClick={resetFilters}
                                    className="text-text-color-alt hover:text-primary text-xs font-medium flex items-center"
                                >
                                    ล้างตัวกรองทั้งหมด
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-red-500">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">{error}</h2>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        ลองใหม่อีกครั้ง
                    </button>
                </div>
            ) : filteredClassrooms?.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลห้องเรียน</h2>
                    <p className="text-text-color-alt font-body">กรุณาเพิ่มห้องเรียนหรือเปลี่ยนตัวกรอง</p>
                    {(selectedGrade !== "all" || selectedYear !== "all") && (
                        <button 
                            onClick={resetFilters}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            ล้างตัวกรอง
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                    <ClassroomList classrooms={filteredClassrooms} />
                </div>
            )}
        </div>
    );
}

export default Classroom;