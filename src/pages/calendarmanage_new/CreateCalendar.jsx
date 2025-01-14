import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import { HolidayListable} from "../../components/holiday/holidaylistable.jsx";
import { formatDateTimeISOToDate } from "../../helper";

function CreateCalendar(){
    const [academicYearTermList, setAcademicYearTermList] = useState([]);
    const [holidayList, setHolidayList] = useState([]);
    // input
    const [academicYearSemester, setAcademicYearSemester] = useState("");


    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const data = {
            holidayList: holidayList,
            termId: academicYearSemester
        }
        try{
            const response = await axios.post(`${HOSTNAME}/a/studingtime`,data);
            if(response.status === 200){
                alert("เพิ่มรายการวันหยุดในเทอมนั้นเรียบร้อย");
            };
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
    return (
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
                                        <option  key={academicYearTermList.termId} value={academicYearTermList.termId}>ปีการศึกษา {academicYearTermList.academicYear + 543}-เทอม {academicYearTermList.semester}</option>
                                    );
                                })
                            :
                                <option value={""}>
                                    ไม่มีปีการศึกษา
                                </option>
                        }
                    </select>
                </div>
                <div className="grid gap-1">
                    <label className="block text-xs font-medium text-gray-700">
                        วันหยุดในเทอมนั้นและปีการศึกษานั้น <span> <Link to="/holiday/create" className="ml-2 text-blue-600 underline">เพิ่มวันหยุด</Link> </span>
                    </label>
                    <HolidayListable holidayList={holidayList} fectHolidayList={fetchHolidayList} />
                </div>
                <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        เพิ่มปีการศึกษา
                </button>
            </form>          
        </div>
    );
};

export default CreateCalendar;