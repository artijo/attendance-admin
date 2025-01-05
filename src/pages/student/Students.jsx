import StudentList from "../../components/student/studentlist.jsx";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config.js";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success.jsx";
function Students() {
  const [searchByClass, setSearchByClass] = useState("all");
  const [students, setStudents] = useState(null);
  const [classrooms, setClassrooms] = useState(null);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const { state } = location;
  function fetchStudents(searchByClass) {
    axios
      .get(HOSTNAME + "/a/students" + "?class=" + searchByClass)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students", error);
      });
  }

  function fetchClassrooms() {
    axios
      .get(HOSTNAME + "/a/classrooms")
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classrooms", error);
      });
  }

  useEffect(() => {
    fetchStudents(searchByClass);
  }, [searchByClass]);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
      // Search by name or student ID in the students array
     if(search !== ""){
      const filteredStudents = students.filter(
        (student) =>
          student.fName.includes(search) ||
          student.lName.includes(search) ||
          student.stdId.includes(search) ||
          student.fName.concat(" ", student.lName).includes(search) ||
          student.lName.concat(" ", student.fName).includes(search)
      );
      setStudents(filteredStudents);
    } else {
      fetchStudents(searchByClass);
    }
  }, [search]);
  return (
    <div>
      <h1>นักเรียน</h1>
      {state && state.message && (
        <AlertSuccess title="บันทึกข้อมูลแล้ว" message={state.message} />
      )}
      <div className="flex gap-2 items-center mt-5">
      <Link to={'create'} type="button" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">เพิ่มนักเรียน</Link>
      <Link to={'upload'} type="button" className="block w-fit text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">เพิ่มนักเรียนด้วยไฟล์</Link>
      </div>
      <div className="mt-5 flex justify-between items-center">
    <div className="flex gap-2 items-center">

          <label
            htmlFor="HeadlineAct"
            className="block text-sm font-medium text-gray-900 text-nowrap"
          >
            ระดับชั้น: 
          </label>

          <select
            name="searchbyclass"
            id="searchbyclass"
            className="w-24 rounded-lg border-gray-300 text-gray-700 sm:text-sm"
            value={searchByClass}
            onChange={(e) => setSearchByClass(e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            <optgroup label="มัธยมศึกษาปีที่ 1">
              {classrooms &&
                classrooms.filter((classroom) => classroom.classLevel === 1).map((classroom) => (
                  <option key={classroom.classId} value={`1-${classroom.classRoom}`}>
                    {`1/${classroom.classRoom}`}
                  </option>
                ))}
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 2">
              {classrooms &&
                classrooms.filter((classroom) => classroom.classLevel === 2).map((classroom) => (
                  <option key={classroom.classId} value={`2-${classroom.classRoom}`}>
                    {`2/${classroom.classRoom}`}
                  </option>
                ))}
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 3">
              {classrooms &&
                classrooms.filter((classroom) => classroom.classLevel === 3).map((classroom) => (
                  <option key={classroom.classId} value={`3-${classroom.classRoom}`}>
                    {`3/${classroom.classRoom}`}
                  </option>
                ))}
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 4">
              {classrooms &&
                classrooms.filter((classroom) => classroom.classLevel === 4).map((classroom) => (
                  <option key={classroom.classId} value={`4-${classroom.classRoom}`}>
                    {`4/${classroom.classRoom}`}
                  </option>
                ))}
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 5">
              {classrooms &&
                classrooms.filter((classroom) => classroom.classLevel === 5).map((classroom) => (
                  <option key={classroom.classId} value={`5-${classroom.classRoom}`}>
                    {`5/${classroom.classRoom}`}
                  </option>
                ))}
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 6">
              {classrooms &&
                classrooms.filter((classroom) => classroom.classLevel === 6).map((classroom) => (
                  <option key={classroom.classId} value={`6-${classroom.classRoom}`}>
                    {`6/${classroom.classRoom}`}
                  </option>
                ))}
            </optgroup>
          </select>
    </div>
      

        <div className="relative">
          <label htmlFor="Search" className="sr-only">
            {" "}
            Search{" "}
          </label>
          <input
            type="text"
            id="Search"
            placeholder="ชื่อ หรือ รหัสนักเรียน"
            className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Search</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>
      </div>
      <div className="mt-5">
        {
          students ? (
            <StudentList students={students} studentsPerPage={50} />
          ) : (
            <div>Loading...</div>
          )
        }
      </div>
    </div>
  );
}
export default Students;
