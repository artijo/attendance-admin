import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";

function CreateCalendar(){
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
        fecthAcademicYearTerms();
    },[]);
    // input
    const [academicYearSemester, setAcademicYearSemester] = useState("");


    return (
        <div className="border bg-white p-4 rounded-lg mb-4 grid grid-cols-1 gap-5">
            <form className="rounded-lg mb-4 grid md:grid-cols-1 gap-5">
                <div>
                    <label className="block text-xs font-medium text-gray-700">
                        ปีการศึกษาและเทอม <span> <Link to="/terms/create">เพิ่มปีการศึกษา</Link> </span>
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
                {/* รายการวันหยุดในเทอมนั้น */}
                <div> 
                     
                </div>
                <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        เพิ่มปีการศึกษา
                </button>
            </form>
        </div>
    );
};

export default CreateCalendar;