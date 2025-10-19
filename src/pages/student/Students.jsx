import StudentList from "../../components/student/studentlist.jsx";
import { useEffect, useState, useMemo } from "react";
import { HOSTNAME } from "../../config.js";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success.jsx";
import StudentChart from "../../components/chart/StudentChart.jsx";

function Students() {
  const [allStudents, setAllStudents] = useState(null); // Store all students for filtering
  const [students, setStudents] = useState(null);
  const [classrooms, setClassrooms] = useState(null);
  const [search, setSearch] = useState("");
  const [searchByClass, setSearchByClass] = useState("all");
  const [totalStudents, setTotalStudents] = useState(0);
  const location = useLocation();
  const { state } = location;

  // Group classrooms by level for the dropdown
  const classroomsByLevel = useMemo(() => {
    if (!classrooms) return {};

    return classrooms.reduce((acc, classroom) => {
      const level = classroom.classLevel;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(classroom);
      return acc;
    }, {});
  }, [classrooms]);

  // Fetch all required data
  function fetchData() {
    // Fetch students
    axios
      .get(HOSTNAME + "/a/students")
      .then((response) => {
        setAllStudents(response.data);
        setStudents(response.data);
        setTotalStudents(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching students", error);
      });

    // Fetch classrooms for filter dropdown
    axios
      .get(HOSTNAME + "/a/classrooms?noMembers=true")
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classrooms", error);
      });
  }

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter students whenever search or classroom filter changes
  useEffect(() => {
    if (!allStudents) return;

    // Always start with all students
    let filteredStudents = [...allStudents];

    // Apply search filter
    if (search !== "") {
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.fName?.toLowerCase().includes(search.toLowerCase()) ||
          student.lName?.toLowerCase().includes(search.toLowerCase()) ||
          student.stdId?.toLowerCase().includes(search.toLowerCase()) ||
          student.fName
            ?.concat(" ", student.lName)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          student.lName
            ?.concat(" ", student.fName)
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    // Apply classroom filter
    if (searchByClass !== "all") {
      // Parse the class filter value (format: "level-room")
      const [level, room] = searchByClass.split("-");

      filteredStudents = filteredStudents.filter((student) => {
        // Check if the student has any classroomMembers
        if (
          !student.classroomMembers ||
          student.classroomMembers.length === 0
        ) {
          return false;
        }

        // Check if any of the student's classroom matches the filter
        return student.classroomMembers.some((member) => {
          if (!member.classroom) return false;

          const classLevel = member.classroom.classLevel.toString();
          const classRoom = member.classroom.classRoom.toString();

          // If only filtering by level, check only the level
          if (room === undefined) {
            return classLevel === level;
          }
          // Otherwise check both level and room
          return classLevel === level && classRoom === room;
        });
      });
    }

    // Update the filtered students
    setStudents(filteredStudents);
  }, [search, searchByClass, allStudents]);

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSearchByClass("all");
  };

  // Get classroom display name for active filter badge
  const getClassroomDisplayName = (filterValue) => {
    if (filterValue === "all") return "";

    const [level, room] = filterValue.split("-");
    return room ? `ม.${level}/${room}` : `ม.${level} (ทุกห้อง)`;
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          นักเรียน
        </h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      {state && state.message && (
        <AlertSuccess title="บันทึกข้อมูลแล้ว" message={state.message} />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {students && (
          <div className="mb-3 sm:mb-0 bg-white rounded-lg px-4 py-2 border border-line shadow-sm">
            <span className="text-text-color-alt font-body">
              จำนวนนักเรียนทั้งหมด:
            </span>
            <span className="ml-2 font-medium text-primary text-lg font-heading">
              {students.length} คน
            </span>
            {students.length !== totalStudents && (
              <span className="ml-2 text-sm text-text-color-alt font-body">
                (จากทั้งหมด {totalStudents} คน)
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="restore"
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 8h6m-5 0a3 3 0 110 6H9m0 0l3 3m-3-3l-3-3m15-1a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            นักเรียนที่ถูกลบ
          </Link>
          <Link
            to={"create"}
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            เพิ่มนักเรียน
          </Link>
          <Link
            to={"upload"}
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            เพิ่มนักเรียนด้วยไฟล์
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-line mb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="searchbyclass"
                className="block text-sm font-medium text-text-color font-body mb-2 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                กรองตามห้องเรียน
              </label>
              <select
                name="searchbyclass"
                id="searchbyclass"
                className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                value={searchByClass}
                onChange={(e) => setSearchByClass(e.target.value)}
              >
                <option value="all">ทุกระดับชั้น</option>

                {/* Group by class level */}
                {Object.entries(classroomsByLevel)
                  .sort((a, b) => a[0] - b[0])
                  .map(([level, rooms]) => (
                    <optgroup key={level} label={`มัธยมศึกษาปีที่ ${level}`}>
                      {/* Option for all rooms in this level */}
                      <option
                        value={`${level}`}
                      >{`ม.${level} (ทุกห้อง)`}</option>

                      {/* Individual rooms */}
                      {rooms
                        .sort((a, b) => a.classRoom - b.classRoom)
                        .map((classroom) => (
                          <option
                            key={classroom.classId}
                            value={`${classroom.classLevel}-${classroom.classRoom}`}
                          >
                            {`ม.${classroom.classLevel}/${classroom.classRoom}`}
                          </option>
                        ))}
                    </optgroup>
                  ))}
              </select>
            </div>

            <div className="relative w-full sm:w-1/2">
              <label
                htmlFor="Search"
                className="block text-sm font-medium text-text-color font-body mb-2 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                ค้นหานักเรียน
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="Search"
                  placeholder="ค้นหาชื่อ หรือ รหัสนักเรียน"
                  className="w-full rounded-lg border-gray-300 py-2.5 pl-4 pr-10 shadow-sm sm:text-sm focus:border-primary focus:ring-primary font-body"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
                  <button
                    type="button"
                    className="text-gray-600 hover:text-primary"
                  >
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

          {/* Active Filters Display */}
          {(search !== "" || searchByClass !== "all") && (
            <div className="flex items-center pt-3 border-t border-gray-100">
              <div className="text-sm text-text-color font-body mr-2">
                กำลังกรอง:
              </div>
              <div className="flex flex-wrap gap-2">
                {search !== "" && (
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium flex items-center">
                    ค้นหา: {search}
                    <button
                      onClick={() => setSearch("")}
                      className="ml-1.5 hover:text-primary/70"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {searchByClass !== "all" && (
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium flex items-center">
                    ห้องเรียน: {getClassroomDisplayName(searchByClass)}
                    <button
                      onClick={() => setSearchByClass("all")}
                      className="ml-1.5 hover:text-primary/70"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {(search !== "" || searchByClass !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="text-text-color-alt hover:text-primary text-xs font-medium flex items-center"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {students && classrooms && (
        <StudentChart students={students} classrooms={classrooms} />
      )}

      {!students ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
          <div className="flex justify-center mb-4 text-text-color-alt">
            <svg
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">
            ไม่พบข้อมูลนักเรียน
          </h2>
          <p className="text-text-color-alt font-body">
            ลองเปลี่ยนระดับชั้นหรือคำค้นหาใหม่
          </p>
          {(search !== "" || searchByClass !== "all") && (
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              ล้างตัวกรอง
            </button>
          )}
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
