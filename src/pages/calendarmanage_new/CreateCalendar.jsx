import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import { HolidayListable} from "../../components/holiday/holidaylistable.jsx";
import { formatDateTimeISOToDate,formatDateToThai } from "../../helper";
import { CreateCalendarClassroomTable } from "../../components/calendar_new/createcalendatclassroomtable.jsx";

//alert
import  AlertSuccess  from "../../components/alert/success.jsx";
import Loading from "../../components/alert/loading.jsx";
import ErrorAlert from "../../components/alert/error.jsx";

function CreateCalendar(){
    const [academicYearTermList, setAcademicYearTermList] = useState([]);
    const [holidayList, setHolidayList] = useState([]);
    // input
    const [academicYearSemester, setAcademicYearSemester] = useState("");
    const [selectedClassrooms, setSelectedClassrooms] = useState([]);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if(selectedClassrooms.length === 0) {
            setAlertShow([false,false,false,true]);
            setTimeout(() => {
                setAlertShow([false,false,false,false]);
            }, 3000);
            return;  
        };
        const data = {
            holidayList: holidayList,
            termId: academicYearSemester,
            classroomids: selectedClassrooms
        }
        try{
            setAlertShow([false,true,false,false]);
            const response = await axios.post(`${HOSTNAME}/a/studingtime`,data);
            if(response.status === 200){
                setAlertShow([true,false,false,false]);
                setTimeout(() => {
                    setAlertShow([false,false,false,false]);
                    window.location.href = "/calendar";
                }, 3000);
            }else{
                setAlertShow([false,false,true,false]);
                setTimeout(() => {
                    setAlertShow([false,false,false,false]);
                    window.location.href = "/calendar";
                }, 3000);
            };
            return;
        }catch(error){
            console.error(error);
        }
    };

    const fetchHolidayList = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/holiday/${academicYearSemester}`);
            if(response.status === 200){
                const newList = response.data.map((holiday, index) => ({
                    id: holiday.holidayId,
                    holidayname: holiday.holidayName,
                    startDate: formatDateTimeISOToDate(holiday.startHolidayDate),
                    endDate: formatDateTimeISOToDate(holiday.endHolidayDate),
                    type:holiday.type
                }));
                
                setHolidayList(newList); 
            };
        }catch(error){
            console.error(error)
        };
    };

    const fecthAcademicYearTerms = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            if(response.status === 200){
                setAcademicYearTermList(response.data);  
            };
            if(response.data.length > 0){
                setAcademicYearSemester(response.data[0].termId);
            }
        }catch(error){
            console.error(error)
        };
    };
    useEffect(() => {
        fecthAcademicYearTerms();
    },[]);

    useEffect(() => {
        if(academicYearSemester === "") return;
        fetchHolidayList();
    },[academicYearSemester]);

    
    const [alertShow, setAlertShow] = useState([false, false, false, false]); // [success, loading, error]
    return (
        <div className="realative">
            <div className={`bg-black w-full h-screen fixed top-0 left-0 opacity-50 z-10 ${alertShow.some((value) => value === true) ? "" : "hidden"}`}></div>
            <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" id="AlertBox">
                <div className={alertShow[0] ? "block" : "hidden"}>
                    <AlertSuccess title="สําเร็จ" message="เพิ่มปฎิทินในเทอมนั้นเรียบร้อย"/>
                </div>
                <div className={alertShow[1] ? "block" : "hidden"}>
                    <Loading title="กำลังเพิ่มปฎิทินการเรียน" message="กรุณารอสักครู่"/>
                </div>
                <div className={alertShow[2] ? "block" : "hidden"}>
                    <ErrorAlert title="เกิดข้อผิดพลาด" message="เกิดข้อผิดพลาดในการเพิ่มปฎิทินการเรียน"/>
                </div>
                <div className={alertShow[3] ? "block" : "hidden"}>
                    <ErrorAlert title="กรุณาเลือกห้องเรียน" message="กรุณาเลือกห้องเรียนก่อนสร้างปฎิทินการเรียน"/>
                </div>
            </div>
            <div className="mx-auto container">
                <h1 className="font-medium mb-4">สร้างปฏิทินการเรียน</h1>
                <form className=" border bg-white p-4 grid-cols-1 rounded-lg mb-4 grid md:grid-cols-1 gap-4" onSubmit={(e) => handleOnSubmit(e)}>
                    <div className="grid gap-1">
                        <label className="block text-xs font-medium text-gray-700">
                            ปีการศึกษาและเทอม <span className="ml-2 text-blue-600 underline"> <Link to="/terms/create">เพิ่มปีการศึกษา</Link> </span>
                        </label>
                        <select name="academicyear_semester" onChange={(e)=> setAcademicYearSemester(e.target.value)} className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border">
                            {
                                academicYearTermList.length > 0 ? 
                                    academicYearTermList.map((academicYearTermList) => {
                                        return (
                                            <option  key={academicYearTermList.termId} value={academicYearTermList.termId}>ปีการศึกษา {academicYearTermList.academicYear + 543} เทอม {academicYearTermList.semester} 
                                            
                                                    (วันที่เริ่มเปิดเทอม {formatDateToThai(formatDateTimeISOToDate(academicYearTermList.termStart))} 
                                                    วันสิ้นสุดเทอม {formatDateToThai(formatDateTimeISOToDate(academicYearTermList.termEnd))})
                                                
                                            </option>
                                        );
                                    })
                                :
                                    <option value={""}>
                                        ไม่มีปีการศึกษา
                                    </option>
                            }
                        </select>
                        
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                วันหยุดในเทอมนั้นและปีการศึกษานั้น <span> <Link to="/holiday/create" className="ml-2 text-blue-600 underline">เพิ่มวันหยุด</Link> </span>
                            </label>
                            <HolidayListable holidayList={holidayList} fectHolidayList={fetchHolidayList} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                ห้องเรียน
                            </label>
                            {
                                academicYearSemester !== "" &&
                                <CreateCalendarClassroomTable academicYearTermId={academicYearSemester} setSelectedClassrooms={setSelectedClassrooms} selectedClassrooms={selectedClassrooms}/>
                            }
                        </div>
                    </div>
                    <button type="submit" 
                            className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            
                    >
                            เพิ่มปีการศึกษา
                    </button>
                </form>          
            </div>
        </div>
        
    );
};

export default CreateCalendar;