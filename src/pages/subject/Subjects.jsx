import SubjectList from "../../components/subject/subjectlist.jsx";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config.js";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success.jsx";

function Subjects() {
  const [subjects, setSubjects] = useState(null);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const { state } = location;

  function fetchSubjects() {
    axios
      .get(HOSTNAME + "/a/subjects")
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects", error);
      });
  }

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (search !== "" && subjects) {
      const filteredSubjects = subjects.filter(
        (subject) =>
          subject.subCode.includes(search) ||
          subject.subNameThai.includes(search) ||
            subject.subNameEng.includes(search)
      );
      setSubjects(filteredSubjects);
    } else {
      fetchSubjects();
    }
  }, [search]);

  return (
    <div>
      <h1>วิชา</h1>
      {state && state.message && (
        <AlertSuccess title="บันทึกข้อมูลแล้ว" message={state.message} />
      )}
      <div className="flex gap-2 items-center mt-5">
        <Link
          to={"create"}
          type="button"
          className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          เพิ่มวิชา
        </Link>
      </div>
      <div className="mt-5 flex justify-end">
        <div className="relative">
          <label htmlFor="Search" className="sr-only">
            Search
          </label>
          <input
            type="text"
            id="Search"
            placeholder="รหัสวิชา หรือ ชื่อวิชา"
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
        {subjects ? (
          <SubjectList subjects={subjects} subjectsPerPage={50} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default Subjects;
