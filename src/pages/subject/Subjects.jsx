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
  const [subjectType, setSubjectType] = useState("all");
  const [subjectTypes, setSubjectTypes] = useState([]);
  const location = useLocation();
  const { state } = location;
  const [originalSubjects, setOriginalSubjects] = useState(null);

  function fetchSubjects() {
    axios
      .get(HOSTNAME + "/a/subjects")
      .then((response) => {
        setSubjects(response.data);
        setOriginalSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects", error);
      });
  }

  function fetchSubjectTypes() {
    axios
      .get(HOSTNAME + "/a/subjects/type")
      .then((response) => {
        setSubjectTypes([
          { value: "all", label: "ทั้งหมด" },
          ...response.data.map(type => ({
            value: type.subTypeId,
            label: type.subTypeNameThai
          }))
        ]);
      })
      .catch((error) => {
        console.error("Error fetching subject types", error);
      });
  }

  useEffect(() => {
    fetchSubjects();
    fetchSubjectTypes();
  }, []);

  useEffect(() => {
    if (originalSubjects) {
      let filteredSubjects = [...originalSubjects];
      
      if (search !== "") {
        filteredSubjects = filteredSubjects.filter(
          (subject) =>
            subject.subCode.includes(search) ||
            subject.subNameThai.includes(search) ||
            subject.subNameEng.includes(search)
        );
      }

      if (subjectType !== "all") {
        filteredSubjects = filteredSubjects.filter(
          (subject) => subject.subjectType.subTypeId === subjectType
        );
      }

      setSubjects(filteredSubjects);
    }
  }, [search, subjectType, originalSubjects]);

  return (
    <div>
      <h1>รายวิชา</h1>
      {state && state.message && (
        <AlertSuccess title="บันทึกข้อมูลแล้ว" message={state.message} />
      )}
      <div className="flex justify-end mt-5">
        <Link
          to={"create"}
          type="button"
          className="block w-fit text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          เพิ่มวิชา
        </Link>
      </div>
      <div className="flex gap-2 mt-5">
        <div className="w-48">
          <label htmlFor="subject-type" className="block mb-2 text-sm font-medium text-gray-900">กลุ่มสาระการเรียนรู้</label>
          <select
            id="subject-type"
            value={subjectType}
            onChange={(e) => setSubjectType(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {subjectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <Search placeholder={"รหัสวิชา หรือชื่อวิชา"} search={search} setSearch={setSearch} />
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
