import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { HolidayListable } from "../../components/holiday/holidaylistable.jsx"
import { HOSTNAME } from "../../config.js";
import { formatDateTimeISOToDate } from "../../helper.js";
import AlertSuccess from "../../components/alert/success.jsx";

function Holiday(){
    const location = useLocation();
    const [holidayList, setHolidayList] = useState([]);
    const [academicYearSemester, setAcademicYearSemester] = useState("");
    const [academicYearTermList, setAcademicYearTermList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const title = useState(location.state?.title);
    const [ isSuccesful, setIsSuccesful ] = useState(
        location.state?.status === true ? true : false
    );
    const [msg, setMsg] = useState(
        location.state?.msg !== undefined ? location.state.msg : ""   
    );
    // console.log(msg);
    const dismissAlerts = () => {
        setIsSuccesful(false);
        // setSuccess(false);
        setMsg("");
    };


    const fectHolidayList = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/holiday/${academicYearSemester}`);
            if(response.status === 200){
                const newList = response.data.map((holiday) => ({
                    id: holiday.holidayId,
                    holidayname: holiday.holidayName,
                    startDate: formatDateTimeISOToDate(holiday.startHolidayDate),
                    endDate: formatDateTimeISOToDate(holiday.endHolidayDate),
                    type: holiday.type
                }));
                setHolidayList(newList);
                setError(null);
            }
        } catch(err) {
            console.error(err);
            setError("ไม่สามารถโหลดข้อมูลวันหยุดได้");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectOption = (value) => {
        if(value) {
            setAcademicYearSemester(value);
        }
    };

    const fecthAcademicYearTerms = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            if(response.status === 200){
                setAcademicYearTermList(response.data);
                if(response.data.length > 0){
                    setAcademicYearSemester(response.data[0].termId);
                }
            }
        } catch(error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลเทอมได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(academicYearSemester !== "") {
            fectHolidayList();
        }
    }, [academicYearSemester]);

    useEffect(() => {
        fecthAcademicYearTerms();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">จัดการวันหยุด</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>

            <div className="mb-4" onClick={dismissAlerts}>
                {/* {error && <ErrorAlert title="เกิดข้อผิดพลาด" message={msg}/>} */}
                {isSuccesful && <AlertSuccess title={title} message={msg}/>}
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
                            รายการวันหยุด
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">จัดการข้อมูลวันหยุดประจำเทอม</p>
                    </div>
                </div>
                
                <Link 
                    to="/holiday/create" 
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    เพิ่มวันหยุด
                </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-line mb-6">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary rounded-t-xl"></div>
                <div className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-between p-6">
                    
                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-text-color font-body mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            เลือกปีการศึกษาและเทอม
                        </label>
                        
                        <div className="flex flex-wrap gap-3 items-center">
                            <select
                                name="academicyear_semester"
                                onChange={(e) => handleSelectOption(e.target.value)}
                                className="w-64 rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                disabled={isLoading || academicYearTermList.length === 0}
                            >
                                {isLoading ? (
                                    <option value="">กำลังโหลดข้อมูล...</option>
                                ) : academicYearTermList.length > 0 ? (
                                    academicYearTermList.map((term) => (
                                        <option
                                            key={term.termId}
                                            value={term.termId}
                                        >
                                            ปีการศึกษา {term.academicYear + 543} เทอม {term.semester}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">ไม่มีปีการศึกษา</option>
                                )}
                            </select>
                            
                            <Link 
                                to="/terms/create" 
                                className="inline-flex items-center text-primary hover:text-accent font-body text-sm transition-colors duration-300"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                เพิ่มปีการศึกษา
                            </Link>
                        </div>
                    </div>
                    
                    {holidayList.length > 0 && (
                        <div className="bg-gray-50 border border-line rounded-lg px-4 py-2 text-sm">
                            <span className="text-text-color-alt font-body">จำนวนวันหยุดทั้งหมด:</span>
                            <span className="ml-2 font-medium text-primary font-heading">{holidayList.length} วัน</span>
                        </div>
                    )}
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
                <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                    <HolidayListable 
                        holidayList={holidayList} 
                        fectHolidayList={fectHolidayList}
                    />
                </div>
            )}
        </div>
    );
}

export default Holiday;