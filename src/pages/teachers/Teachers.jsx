import TeacherList from "../../components/teacher/teacherlist.jsx";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config.js";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success.jsx";

function Teachers() {
  const [teachers, setTeachers] = useState(null);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const { state } = location;

  function fetchTeachers() {
    axios
      .get(HOSTNAME + "/a/teachers")
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teachers", error);
      });
  }

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (search !== "" && teachers) {
      const filteredTeachers = teachers.filter(
        (teacher) =>
          teacher.fName.includes(search) ||
          teacher.lName.includes(search) ||
          teacher.tchId.includes(search) ||
          teacher.fName.concat(" ", teacher.lName).includes(search) ||
          teacher.lName.concat(" ", teacher.fName).includes(search) ||
          teacher.tel.includes(search)
      );
      setTeachers(filteredTeachers);
    } else {
      fetchTeachers();
    }
  }, [search]);

  return (
    <div>
      <h1>คุณครู</h1>
      {state && state.message && (
        <AlertSuccess title="บันทึกข้อมูลแล้ว" message={state.message} />
      )}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 justify-end">
        <Link 
          to={'create'} 
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          เพิ่มครู
        </Link>
        <Link 
          to={'departments'} 
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          จัดการสังกัดกลุ่มสาระ
        </Link>
      </div>
      
      <div className="mt-5 flex justify-end">
        <div className="relative">
          <label htmlFor="Search" className="sr-only">Search</label>
          <input
            type="text"
            id="Search"
            placeholder="ชื่อ หรือ รหัสครู"
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
        {teachers ? (
          <TeacherList teachers={teachers} teachersPerPage={10} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default Teachers;