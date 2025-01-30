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
      <h1 className="font-bold text-center">รายวิชา</h1>
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
          เพิ่มวิชา
        </Link>
        <Link 
          to={'types'} 
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          จัดการกลุ่มสาระการเรียนรู้
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
