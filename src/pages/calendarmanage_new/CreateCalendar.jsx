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
    // responed from server 
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [success,setSuccess] = useState(false);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if(selectedClassrooms.length === 0) {
            setError(true);
            setMsg("กรุณาเลือกห้องเรียน");
            return;  
        };
        const data = {
            holidayList: holidayList,
            termId: academicYearSemester,
            classroomids: selectedClassrooms
        }
        try{
            const response = await axios.post(`${HOSTNAME}/a/studingtime`,data);
            if(response.status === 200){
                setMsg(response.data.message);
                setSuccess(true);
                
            }else{
                throw new Error(response.data.message);
            };
            return;
        }catch(error){
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มปฎิทิน");
            setError(true);
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


    return (
        <div className="container mx-auto">
            
            <div className="mx-auto container">
                <h1 className="font-medium mb-4">สร้างปฏิทินการเรียน</h1>
                <div className="mb-2"  onClick={() => {
                    setError(false)
                    setSuccess(false)
                    setMsg("")
                }}>
                    {
                        error &&  <ErrorAlert title="เกิดข้อผิดพลาด" message={msg}/>
                    }
                    {
                        success && <AlertSuccess title="สำเร็จ" message={msg}/>
                    }
                </div>
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
                           className="inline-flex w-fit ml-auto justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            
                    >
                            เพิ่มปฎิทินการเรียน
                    </button>
                </form>          
            </div>
        </div>
        
    );
};

export default CreateCalendar;