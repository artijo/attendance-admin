import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import ClassroomList from "../../components/classroom/classroomlist";
function Classroom() {
    const [allclassrooms, setallClassrooms] = useState(null);
    const [classrooms, setClassrooms] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    function fetchClassrooms() {
        axios
            .get(HOSTNAME + "/a/classrooms")
            .then((response) => {
                setallClassrooms(response.data);
                setClassrooms(response.data);
            })
            .catch((error) => {
                console.error("Error fetching classrooms", error);
            });
    }

    function filterClassrooms() {
        if (selectedGrade) {
            setClassrooms(allclassrooms.filter((classroom) => parseInt(classroom.classLevel) == selectedGrade));
        }
    }
    useEffect(() => {
        fetchClassrooms();
    }, []);

    useEffect(() => {
        if (selectedGrade === "all") {
            setClassrooms(allclassrooms);
        } else {
            filterClassrooms();
        }
    }, [selectedGrade]);

  return (
    <div>
      <h1>ห้องเรียน</h1>
    <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
        <label htmlFor="gradeFilter" className="block text-sm font-medium text-gray-700">
            ระดับชั้น
        </label>
        <select
            id="gradeFilter"
            name="gradeFilter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => {
                const selectedGrade = e.target.value;
                setSelectedGrade(selectedGrade);
                
            }}
        >
            <option value="all">ทั้งหมด</option>
            <option value="1">มัธยมศึกษาปีที่ 1</option>
            <option value="2">มัธยมศึกษาปีที่ 2</option>
            <option value="3">มัธยมศึกษาปีที่ 3</option>
            <option value="4">มัธยมศึกษาปีที่ 4</option>
            <option value="5">มัธยมศึกษาปีที่ 5</option>
            <option value="6">มัธยมศึกษาปีที่ 6</option>
        </select>
        </div>
   
        <Link to={'create'} type="button" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">เพิ่มห้องเรียน</Link>
        </div>
        {classrooms ? (
            <div className="mt-5">
                <ClassroomList classrooms={classrooms} />
            </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>
  );
}

export default Classroom;