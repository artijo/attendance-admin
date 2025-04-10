import SubjectList from "../../components/subject/subjectlist.jsx";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config.js";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success.jsx";

function Subjects() {
  const [subjects, setSubjects] = useState(null);
  const [search, setSearch] = useState("");
  const [subjectType, setSubjectType] = useState("all");
  const [subjectTypes, setSubjectTypes] = useState([]);
  const location = useLocation();
  const { state } = location;
  const [originalSubjects, setOriginalSubjects] = useState(null);
  const [totalSubjects, setTotalSubjects] = useState(0);

  function fetchSubjects() {
    axios
      .get(HOSTNAME + "/a/subjects")
      .then((response) => {
        setSubjects(response.data);
        setOriginalSubjects(response.data);
        setTotalSubjects(response.data.length);
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
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายวิชา</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>
      
      {state && state.message && (
        <AlertSuccess title="บันทึกข้อมูลแล้ว" message={state.message} />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {subjects && (
          <div className="mb-3 sm:mb-0 bg-white rounded-lg px-4 py-2 border border-line shadow-sm">
            <span className="text-text-color-alt font-body">จำนวนรายวิชาทั้งหมด:</span>
            <span className="ml-2 font-medium text-primary text-lg font-heading">{subjects.length} วิชา</span>
            {subjects.length !== totalSubjects && (
              <span className="ml-2 text-sm text-text-color-alt font-body">
                (จากทั้งหมด {totalSubjects} วิชา)
              </span>
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to={'create'} 
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            เพิ่มรายวิชา
          </Link>
          
          <Link 
            to={'types'} 
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            จัดการกลุ่มสาระการเรียนรู้
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-line mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-64">
            <label htmlFor="subject-type" className="block text-sm font-medium text-text-color font-body flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              กลุ่มสาระการเรียนรู้
            </label>
            <select
              id="subject-type"
              value={subjectType}
              onChange={(e) => setSubjectType(e.target.value)}
              className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
            >
              {subjectTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative w-full sm:w-72">
            <label htmlFor="Search" className="sr-only">ค้นหา</label>
            <input
              type="text"
              id="Search"
              placeholder="ค้นหารหัสวิชา หรือชื่อวิชา"
              className="w-full rounded-lg border-gray-300 py-2.5 pl-4 pr-10 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
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

      {!subjects ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
          <div className="flex justify-center mb-4 text-text-color-alt">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลรายวิชา</h2>
          <p className="text-text-color-alt font-body">ลองค้นหาด้วยคำค้นหาอื่นหรือเปลี่ยนกลุ่มสาระการเรียนรู้</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <SubjectList subjects={subjects} subjectsPerPage={50} />
        </div>
      )}
    </div>
  );
}

export default Subjects;
