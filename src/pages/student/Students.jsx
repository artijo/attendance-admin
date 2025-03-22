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
  const [totalStudents, setTotalStudents] = useState(0);
  const location = useLocation();
  const { state } = location;
  
  function fetchStudents(searchByClass) {
    axios
      .get(HOSTNAME + "/a/students" + "?class=" + searchByClass)
      .then((response) => {
        setStudents(response.data);
        // If no search term is active, update the total count
        if (search === "") {
          setTotalStudents(response.data.length);
        }
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
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">นักเรียน</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>
      
      {state && state.message && (
        <AlertSuccess title="บันทึกข้อมูลแล้ว" message={state.message} />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {students && (
          <div className="mb-3 sm:mb-0 bg-white rounded-lg px-4 py-2 border border-line shadow-sm">
            <span className="text-text-color-alt font-body">จำนวนนักเรียนทั้งหมด:</span>
            <span className="ml-2 font-medium text-primary text-lg font-heading">{students.length} คน</span>
            {students.length !== totalStudents && search === "" && (
              <span className="ml-2 text-sm text-text-color-alt font-body">
                (จากทั้งหมด {totalStudents} คน)
              </span>
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to={'create'} 
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            เพิ่มนักเรียน
          </Link>
          <Link 
            to={'upload'} 
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            เพิ่มนักเรียนด้วยไฟล์
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-line mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-3 items-center w-full sm:w-auto">
            <label
              htmlFor="HeadlineAct"
              className="block text-sm font-medium text-text-color font-body text-nowrap"
            >
              ระดับชั้น:
            </label>

            <select
              name="searchbyclass"
              id="searchbyclass"
              className="w-full sm:w-52 rounded-lg border-gray-300 text-text-color font-body sm:text-sm focus:border-primary focus:ring-primary"
              value={searchByClass}
              onChange={(e) => setSearchByClass(e.target.value)}
            >
              <option value="">ทุกระดับชั้น</option>
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
        
          <div className="relative w-full sm:w-72">
            <label htmlFor="Search" className="sr-only">ค้นหา</label>
            <input
              type="text"
              id="Search"
              placeholder="ค้นหาชื่อ หรือ รหัสนักเรียน"
              className="w-full rounded-lg border-gray-300 py-2.5 pl-4 pr-10 shadow-sm sm:text-sm focus:border-primary focus:ring-primary font-body"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
              <button type="button" className="text-gray-600 hover:text-primary">
                <span className="sr-only">ค้นหา</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
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
      </div>
      
      {!students ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
          <div className="flex justify-center mb-4 text-text-color-alt">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลนักเรียน</h2>
          <p className="text-text-color-alt font-body">ลองเปลี่ยนระดับชั้นหรือคำค้นหาใหม่</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <div className="p-0">
            <StudentList students={students} studentsPerPage={50} />
          </div>
        </div>
      )}
    </div>
  );
}
export default Students;
