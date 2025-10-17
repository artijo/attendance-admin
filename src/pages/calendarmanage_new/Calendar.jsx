import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { RoomList } from "../../components/calendar_new/roomlist";
import { Link } from "react-router-dom";

function Calendar() {
    const [academicYearTermList, setAcademicYearTermList] = useState([]);
    const [selectedAcademicYearTerm, setSelectedAcademicYearTerm] = useState("");
    const [selectedClassLevel, setSelectedClassLevel] = useState("1");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAcademicYearTermList = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            if (response.status === 200) {
                setAcademicYearTermList(response.data);
                if (response.data.length > 0) {
                    setSelectedAcademicYearTerm(response.data[0].termId);
                }
                setError(null);
            }
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลเทอมได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAcademicYearTermList();
    }, []);

    const classLevels = [
        { value: "1", label: "ม.1" },
        { value: "2", label: "ม.2" },
        { value: "3", label: "ม.3" },
        { value: "4", label: "ม.4" },
        { value: "5", label: "ม.5" },
        { value: "6", label: "ม.6" }
    ];

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">ปฏิทินการเรียน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-text-color font-heading">
                            จัดการปฏิทินห้องเรียน
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">กำหนดและจัดการปฏิทินการเรียนและวันหยุด</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-line mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            ปีการศึกษาและเทอม
                        </label>
                        
                        <div className="flex items-center gap-3">
                            <select 
                                name="academicyear_term" 
                                onChange={(e) => setSelectedAcademicYearTerm(e.target.value)}
                                className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                disabled={isLoading || academicYearTermList.length === 0}
                            >
                                {isLoading ? (
                                    <option value="">กำลังโหลดข้อมูล...</option>
                                ) : academicYearTermList.length > 0 ? (
                                    academicYearTermList.map((term) => (
                                        <option key={term.termId} value={term.termId}>
                                            ปีการศึกษา {term.academicYear + 543} เทอม {term.semester}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">ไม่มีปีการศึกษา</option>
                                )}
                            </select>
                            
                            <Link 
                                to="/terms/create" 
                                className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg border border-gray-300 text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                                title="เพิ่มปีการศึกษาใหม่"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            ชั้นมัธยมศึกษาปีที่
                        </label>
                        
                        <div className="flex flex-wrap gap-2">
                            {classLevels.map((level) => (
                                <button
                                    key={level.value}
                                    type="button"
                                    className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                        selectedClassLevel === level.value
                                            ? "bg-primary text-white shadow-sm"
                                            : "bg-gray-100 text-text-color hover:bg-gray-200"
                                    }`}
                                    onClick={() => setSelectedClassLevel(level.value)}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>{error}</div>
                    </div>
                </div>
            ) : isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div id="classroomList" className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                    {selectedAcademicYearTerm && (
                        <RoomList 
                            academicYearTermId={selectedAcademicYearTerm} 
                            classLevel={selectedClassLevel} 
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default Calendar;