import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { RoomList } from "../../components/calendar_new/roomlist";
import { Link } from "react-router-dom";

function Calendar(){
    const [academicYearTermList, setAcademicYearTermList] = useState([]);
    const [selectedAcademicYearTerm, setSelectedAcademicYearTerm] = useState("");


    const fetchAcademicYearTermList = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            // console.log(response.data);
            if(response.status === 200){
                setAcademicYearTermList(response.data);
                setSelectedAcademicYearTerm(response.data[0].termId);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAcademicYearTermList();
    }, []);

    return(
        <div className="container mx-auto">
            <h1 className="mb-4">ปฎิทินการเรียน</h1>
            <div>
                <div className="mb-2 flex justify-between items-end">
                    <div>
                        <label className="text-xs block font-medium text-gray-700">
                                ปีการศึกษาและเทอม
                                <span className="ml-2 text-blue-600 underline"> 
                                    <Link to="/terms/create">เพิ่มปีการศึกษา</Link></span>
                                </label>
                        <select 
                            name="academicyear_term" 
                            onChange={(e) => setSelectedAcademicYearTerm(e.target.value)}
                            className="mt-1 w-fit px-2 h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                        >
                            {
                                academicYearTermList.map((academicYearTerm) => (
                                    <option key={academicYearTerm.termId} value={academicYearTerm.termId}>ปีการศึกษา{academicYearTerm.academicYear} เทอม {academicYearTerm.semester}</option>
                                ))
                            }
                        </select>
                    </div>
                    <Link to="/calendar/create" className="block w-fit h-fit text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">เพิ่มปฎิทินการเรียน</Link>
                </div>
                <div id="classroomList">
                        {
                            selectedAcademicYearTerm !== "" && (
                                <RoomList academicYearTermId={selectedAcademicYearTerm}/>
                            )
                        }
                </div>
            </div>
        </div>
    );
};

export default Calendar;