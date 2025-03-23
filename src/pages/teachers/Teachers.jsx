import TeacherList from "../../components/teacher/teacherlist.jsx";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config.js";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success.jsx";

function Teachers() {
  const [teachers, setTeachers] = useState(null);
  const [allTeachers, setAllTeachers] = useState(null); // Store all teachers for filtering
  const [departments, setDepartments] = useState([]); // Store departments for filter dropdown
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all"); // New state for department filter
  const [totalTeachers, setTotalTeachers] = useState(0);
  const location = useLocation();
  const { state } = location;

  // Fetch teachers data
  function fetchTeachers() {
    axios
      .get(HOSTNAME + "/a/teachers")
      .then((response) => {
        setAllTeachers(response.data); // Store all teachers
        setTeachers(response.data);
        setTotalTeachers(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching teachers", error);
      });
  }

  // Fetch departments for filter
  function fetchDepartments() {
    axios
      .get(HOSTNAME + "/a/departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments", error);
      });
  }

  // Initial data fetch
  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  // Apply filters when search or department selection changes
  useEffect(() => {
    if (!allTeachers) return;
    
    // Start with all teachers
    let filteredResults = [...allTeachers];
    
    // Apply search filter
    if (search !== "") {
      filteredResults = filteredResults.filter(
        (teacher) =>
          teacher.fName?.toLowerCase().includes(search.toLowerCase()) ||
          teacher.lName?.toLowerCase().includes(search.toLowerCase()) ||
          teacher.tchId?.toLowerCase().includes(search.toLowerCase()) ||
          teacher.fName?.concat(" ", teacher.lName).toLowerCase().includes(search.toLowerCase()) ||
          teacher.lName?.concat(" ", teacher.fName).toLowerCase().includes(search.toLowerCase()) ||
          teacher.tel?.includes(search)
      );
    }
    
    // Apply department filter
    if (selectedDept !== "all") {
      filteredResults = filteredResults.filter(
        (teacher) => teacher.department.deptId === selectedDept
      );
    }
    
    // Update teachers state with filtered results
    setTeachers(filteredResults);
  }, [search, selectedDept, allTeachers]);

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSelectedDept("all");
  };

  // Get department name by ID
  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.deptId === deptId);
    return dept ? dept.deptName : "";
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">คุณครู</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>
      
      {state && state.message && (
        <AlertSuccess title="บันทึกข้อมูลแล้ว" message={state.message} />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {teachers && (
          <div className="mb-3 sm:mb-0 bg-white rounded-lg px-4 py-2 border border-line shadow-sm">
            <span className="text-text-color-alt font-body">จำนวนครูทั้งหมด:</span>
            <span className="ml-2 font-medium text-primary text-lg font-heading">{teachers.length} คน</span>
            {teachers.length !== totalTeachers && (
              <span className="ml-2 text-sm text-text-color-alt font-body">
                (จากทั้งหมด {totalTeachers} คน)
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
            เพิ่มครู
          </Link>
          <Link 
            to={'departments'} 
            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            จัดการสังกัดกลุ่มสาระ
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-line mb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Department Filter */}
            <div className="w-full sm:w-72">
              <label htmlFor="departmentFilter" className="text-sm font-medium text-text-color font-body flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                กรองตามกลุ่มสาระ
              </label>
              <select
                id="departmentFilter"
                className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="all">ทุกกลุ่มสาระ</option>
                {departments.map((dept) => (
                  <option key={dept.deptId} value={dept.deptId}>{dept.deptName}</option>
                ))}
              </select>
            </div>
          {/* Search and Department Filter */}
            <div className="relative w-full sm:w-72">
              <label htmlFor="Search" className="sr-only">ค้นหา</label>
              <input
                type="text"
                id="Search"
                placeholder="ค้นหาชื่อ"
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
          
          {/* Active Filters */}
          {(search !== "" || selectedDept !== "all") && (
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {selectedDept !== "all" && (
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium flex items-center">
                    กลุ่มสาระ: {getDepartmentName(selectedDept)}
                    <button 
                      onClick={() => setSelectedDept("all")}
                      className="ml-1.5 hover:text-primary/70"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {(search !== "" || selectedDept !== "all") && (
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

      {!teachers ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
          <div className="flex justify-center mb-4 text-text-color-alt">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลครู</h2>
          <p className="text-text-color-alt font-body">ลองค้นหาด้วยคำค้นหาอื่น หรือเปลี่ยนตัวกรอง</p>
          {(search !== "" || selectedDept !== "all") && (
            <button 
              onClick={resetFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              ล้างตัวกรอง
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <TeacherList teachers={teachers} teachersPerPage={10} />
        </div>
      )}
    </div>
  );
}

export default Teachers;