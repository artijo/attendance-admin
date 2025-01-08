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
      <div className="flex flex-wrap mt-5">
      <Link to={'create'} type="button" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">เพิ่มครู</Link>
      <Link to={'departments'} type="button" className="block w-fit text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">จัดการสังกัดกลุ่มสาระ</Link>
      </div>
      {/* <Link to={'upload'} type="button" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">เพิ่มครูด้วยไฟล์</Link> */}
      
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