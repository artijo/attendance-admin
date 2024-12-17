import StudentList from "../../components/student/studentlist.jsx";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config.js";
import axios from "axios";
function Students() {
  const [searchByClass, setSearchByClass] = useState("all");
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
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

  useEffect(() => {
    fetchStudents(searchByClass);
  }, [searchByClass]);

  useEffect(() => {
      // Search by name or student ID in the students array
     if(search !== ""){
      const filteredStudents = students.filter(
        (student) =>
          student.fName.includes(search) ||
          student.lName.includes(search) ||
          student.stdId.includes(search) ||
          student.fName.concat(" ", student.lName).includes(search) ||
          student.lName.concat(" ", student.fName).includes(search) ||
          student.tel.includes(search)
      );
      setStudents(filteredStudents);
    } else {
      fetchStudents(searchByClass);
    }
  }, [search]);
  return (
    <div>
      <h1>Students</h1>
      <div className="mt-5 flex justify-between">
        <div>
          <label
            htmlFor="HeadlineAct"
            className="block text-sm font-medium text-gray-900"
          >
            {" "}
            ค้นหาด้วยห้องเรียน{" "}
          </label>

          <select
            name="searchbyclass"
            id="searchbyclass"
            className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
            value={searchByClass}
            onChange={(e) => setSearchByClass(e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            <optgroup label="มัธยมศึกษาปีที่ 1">
              <option value="1-1">1/1</option>
              <option value="1-2">1/2</option>
              <option value="1-3">1/3</option>
              <option value="1-4">1/4</option>
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 2">
              <option value="2-1">2/1</option>
              <option value="2-2">2/2</option>
              <option value="2-3">2/3</option>
              <option value="2-4">2/4</option>
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 3">
              <option value="3-1">3/1</option>
              <option value="3-2">3/2</option>
              <option value="3-3">3/3</option>
              <option value="3-4">3/4</option>
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 4">
              <option value="4-1">4/1</option>
              <option value="4-2">4/2</option>
              <option value="4-3">4/3</option>
              <option value="4-4">4/4</option>
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 5">
              <option value="5-1">5/1</option>
              <option value="5-2">5/2</option>
              <option value="5-3">5/3</option>
              <option value="5-4">5/4</option>
            </optgroup>

            <optgroup label="มัธยมศึกษาปีที่ 6">
              <option value="6-1">6/1</option>
              <option value="6-2">6/2</option>
              <option value="6-3">6/3</option>
              <option value="6-4">6/4</option>
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
        <StudentList students={students} studentsPerPage={10} />
      </div>
    </div>
  );
}
export default Students;
