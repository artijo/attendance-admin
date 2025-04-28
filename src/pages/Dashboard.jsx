import { useEffect, useState } from "react";
import { HOSTNAME } from "../config.js";
import axios from "axios";
import StudentChart from "../components/chart/StudentChart.jsx";
import TeacherChart from "../components/chart/TeacherChart.jsx";

function Dashboard() {
  const [allStudents, setAllStudents] = useState(null);
  const [allTeachers, setAllTeachers] = useState(null);
  const [classrooms, setClassrooms] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all required data
  useEffect(() => {
    setIsLoading(true);
    
    // Fetch students
    axios.get(HOSTNAME + "/a/students")
      .then((response) => {
        setAllStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students", error);
      });

    // Fetch classrooms
    axios.get(HOSTNAME + "/a/classrooms?noMembers=true")
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classrooms", error);
      });
      
    // Fetch teachers
    axios.get(HOSTNAME + "/a/teachers")
      .then((response) => {
        setAllTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teachers", error);
      });
      
    // Fetch departments
    axios.get(HOSTNAME + "/a/departments")
      .then((response) => {
        setDepartments(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching departments", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">แดชบอร์ด</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* แผนภูมิจำนวนนักเรียนตามห้องเรียน */}
          {allStudents && classrooms && (
            <div>
              <StudentChart students={allStudents} classrooms={classrooms} />
            </div>
          )}
          
          {/* แผนภูมิจำนวนครูตามกลุ่มสาระ */}
          {allTeachers && departments && (
            <div>
              <TeacherChart teachers={allTeachers} departments={departments} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* พื้นที่สำหรับข้อมูลสรุปอื่นๆ */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-line">
              <h3 className="text-lg font-medium text-primary font-heading mb-4">สถิตินักเรียน</h3>
              <p className="text-text-color font-body">
                จำนวนนักเรียนทั้งหมด: <span className="font-medium">{allStudents?.length || 0} คน</span>
              </p>
              <p className="text-text-color font-body mt-2">
                จำนวนห้องเรียนทั้งหมด: <span className="font-medium">{classrooms?.length || 0} ห้อง</span>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-line">
              <h3 className="text-lg font-medium text-primary font-heading mb-4">สถิติครู</h3>
              <p className="text-text-color font-body">
                จำนวนครูทั้งหมด: <span className="font-medium">{allTeachers?.length || 0} คน</span>
              </p>
              <p className="text-text-color font-body mt-2">
                จำนวนกลุ่มสาระ: <span className="font-medium">{departments?.length || 0} กลุ่มสาระ</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;