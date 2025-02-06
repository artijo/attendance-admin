import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { HolidayListable } from "../../components/holiday/holidaylistable.jsx"
import { HOSTNAME } from "../../config.js";
import { formatDateTimeISOToDate } from "../../helper.js";
function Holiday(){
    const [holidayList, setHolidayList] = useState([]);
    const [academicYearSemester, setAcademicYearSemester] = useState("");

    const fectHolidayList = async () => {
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
        }catch(err){
            console.error(err);
        };
    };

    const handleSelectOption = async (value) => {
        if(value) {
            setAcademicYearSemester(value);
        }
    };

    const [academicYearTermList, setAcademicYearTermList] = useState([]);
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
        if(academicYearSemester !== "") {
            fectHolidayList(academicYearSemester);
        }
    },[academicYearSemester]);

    

    useEffect(() => {
        fecthAcademicYearTerms();
    },[]);


    return(
        <div className="container mx-auto">
            <h1 className="mb-4">รายการวันหยุด</h1>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-1">
                <div className="flex justify-between items-center gap-2">   
                    <div>
                        <label className="block text-xs font-medium text-gray-700">
                            ปีการศึกษาและเทอม 
                            <span className="ml-2 text-blue-600 underline"> 
                                <Link to="/terms/create">เพิ่มปีการศึกษา</Link> 
                            </span>
                        </label>
                        <select
                            name="academicyear_semester"
                            onChange={(e) => handleSelectOption(e.target.value)}
                            className="mt-1 px-2 w-fit h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                        >
                            {academicYearTermList.length > 0 ? (
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
                    </div>
                    <Link to="/holiday/create"  className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        เพิ่มวันหยุด
                    </Link>
                </div>
                <HolidayListable holidayList={holidayList} fectHolidayList={fectHolidayList}/>
            </div>
        </div>
    );
};

export default Holiday;