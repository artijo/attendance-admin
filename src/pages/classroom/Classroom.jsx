import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { Link } from "react-router-dom";
import ClassroomList from "../../components/classroom/classroomlist";
function Classroom() {
    const [allclassrooms, setallClassrooms] = useState(null);
    const [classrooms, setClassrooms] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    function fetchClassrooms() {
        axios
            .get(HOSTNAME + "/a/classrooms")
            .then((response) => {
                setallClassrooms(response.data);
                setClassrooms(response.data);
            })
            .catch((error) => {
                console.error("Error fetching classrooms", error);
            });
    }

    function filterClassrooms() {
        if (selectedGrade) {
            setClassrooms(allclassrooms.filter((classroom) => parseInt(classroom.classLevel) == selectedGrade));
        }
    }
    useEffect(() => {
        fetchClassrooms();
    }, []);

    useEffect(() => {
        if (selectedGrade === "all") {
            setClassrooms(allclassrooms);
        } else {
            filterClassrooms();
        }
    }, [selectedGrade]);

  return (
    <div>
      <h1 className="text-center font-bold">ห้องเรียน</h1>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <label htmlFor="gradeFilter" className="block text-sm font-medium text-gray-700">
              ระดับชั้น
          </label>
          <select
              id="gradeFilter"
              name="gradeFilter"
              className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
              onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="all">ทั้งหมด</option>
            <option value="1">มัธยมศึกษาปีที่ 1</option>
            <option value="2">มัธยมศึกษาปีที่ 2</option>
            <option value="3">มัธยมศึกษาปีที่ 3</option>
            <option value="4">มัธยมศึกษาปีที่ 4</option>
            <option value="5">มัธยมศึกษาปีที่ 5</option>
            <option value="6">มัธยมศึกษาปีที่ 6</option>
          </select>
        </div>
   
        <div className="flex flex-col sm:flex-row gap-2">
          <Link 
            to={'create'} 
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            เพิ่มห้องเรียน
          </Link>
          <Link 
            to={'types'} 
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            จัดการประเภทห้องเรียน
          </Link>
        </div>
      </div>

      {classrooms === null ? (
        <div className="flex items-center justify-center h-32 sm:h-48 bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
            <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
          </div>
        </div>
      ) : classrooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 sm:h-48 bg-gray-50 rounded-lg p-4 text-center">
          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <div className="text-gray-500 font-medium">ไม่พบข้อมูลห้องเรียน</div>
          <div className="text-sm text-gray-400">กรุณาเพิ่มห้องเรียนหรือเปลี่ยนตัวกรอง</div>
        </div>
      ) : (
        <div className="overflow-hidden overflow-x-auto">
          <ClassroomList classrooms={classrooms} />
        </div>
      )}
    </div>
  );
}

export default Classroom;