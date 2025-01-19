import { ClassroomAttendenceList } from "../../components/attendence/classroomattendenceList";
import { useEffect, useState } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";

function Attendence() {
    const [academicYearTermList, setAcademicYearTermList] = useState([]);
    const [selectedAcademicYearTerm, setSelectedAcademicYearTerm] = useState("");
    const [selectedClassLevel, setSelectedClassLevel] = useState(1);


    const fecthAcademicYearTerms = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            if (response.status === 200) {
                setAcademicYearTermList(response.data);
                setSelectedAcademicYearTerm(response.data[0].termId);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fecthAcademicYearTerms();
    }, []);


    return (
        <div className="mx-auto container">
            <h1 className="mb-4">การเข้าเรียน</h1>
            <div className="mb-4 flex gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700">ปีการศึกษาเทอม</label>
                    <select 
                        name="academicYearTerm" 
                        onChange={(e) => setSelectedAcademicYearTerm(e.target.value)} className="mt-1 w-fit px-2 h-8 rounded-md border-gray-200 shadow-sm sm:text-sm" 
                    >
                        {academicYearTermList.map((academicYearTerm) => (
                            <option key={academicYearTerm.termId} value={academicYearTerm.termId}>
                               ปีการศึกษา {academicYearTerm.academicYear + 543} เทอม {academicYearTerm.semester}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700">ชั้นมัธยมศึกษา</label>
                    <select name="classroom" className="mt-1 w-fit px-2 h-8 rounded-md border-gray-200 shadow-sm sm:text-sm" 
                        onChange={(e) => setSelectedClassLevel(e.target.value)}
                    >
                        <option value={1}>ม.1</option>
                        <option value={2}>ม.2</option>
                        <option value={3}>ม.3</option>
                        <option value={4}>ม.4</option>
                        <option value={5}>ม.5</option>
                        <option value={6}>ม.6</option>
                    </select>
                </div>
                
            </div>
            <div>
                   <ClassroomAttendenceList classLevel={selectedClassLevel} academicYearTerm={selectedAcademicYearTerm}/>
            </div>
        </div>
    );
};

export default Attendence;  