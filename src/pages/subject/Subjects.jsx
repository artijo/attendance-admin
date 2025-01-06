import SubjectList from "../../components/subject/subjectlist.jsx";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config.js";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success.jsx";
import Search from "../../components/search.jsx";

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
        <Search placeholder={"รหัสวิชา หรือชื่อวิชา"} search={search} setSearch={setSearch} />
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
