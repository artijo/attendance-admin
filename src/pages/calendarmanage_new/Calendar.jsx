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
                            onChange={(e) => {setSelectedAcademicYearTerm(e.target.value) 
                                console.log(e.target.value)}}
                            className="mt-1 w-fit px-2 h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                        >
                            {
                                academicYearTermList.map((academicYearTerm) => (
                                    <option key={academicYearTerm.termId} value={academicYearTerm.termId}>ปีการศึกษา{academicYearTerm.academicYear} เทอม {academicYearTerm.semester}</option>
                                ))
                            }
                        </select>
                    </div>
                    <Link to="/calendar/create">
                        <div  className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            เพิ่มปฎิทินการเรียน
                        </div>
                    </Link>
                    
                   
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