import { useEffect, useState } from "react";
import { HOSTNAME } from "../config.js";
import axios from "axios";
import StudentChart from "../components/chart/StudentChart.jsx";
import TeacherChart from "../components/chart/TeacherChart.jsx";
import SubjectChart from "../components/chart/SubjectChart.jsx";
import ActivityChart from "../components/chart/ActivityChart.jsx";

function Dashboard() {
  const [allStudents, setAllStudents] = useState(null);
  const [allTeachers, setAllTeachers] = useState(null);
  const [classrooms, setClassrooms] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectTypes, setSubjectTypes] = useState([]);
  const [continuousActivities, setContinuousActivities] = useState([]);
  const [nonContinuousActivities, setNonContinuousActivities] = useState([]);
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
      })
      .catch((error) => {
        console.error("Error fetching departments", error);
      });
      
    // Fetch subjects และ subject types
    Promise.all([
      axios.get(HOSTNAME + "/a/subjects"),
      axios.get(HOSTNAME + "/a/subjects/type")
    ])
      .then(([subjectsRes, subjectTypesRes]) => {
        setSubjects(subjectsRes.data);
        setSubjectTypes(subjectTypesRes.data.map(type => ({
          value: type.subTypeId,
          label: type.subTypeNameThai
        })));
      })
      .catch((error) => {
        console.error("Error fetching subjects data", error);
      });
      
    // Fetch continuous และ non-continuous activities
    Promise.all([
      axios.get(HOSTNAME + "/a/activities/1"),
      axios.get(HOSTNAME + "/a/activities/2")
    ])
      .then(([continuousRes, nonContinuousRes]) => {
        const continuous = continuousRes.data[0]?.activity || [];
        const nonContinuous = nonContinuousRes.data[0]?.activity || [];
        
        setContinuousActivities(continuous);
        setNonContinuousActivities(nonContinuous);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activities", error);
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

          {/* แผนภูมิวิชาเรียน */}
          {subjects && subjectTypes && (
            <div>
              <SubjectChart subjects={subjects} subjectTypes={subjectTypes} />
            </div>
          )}

          {/* แผนภูมิกิจกรรม */}
          {continuousActivities && nonContinuousActivities && (
            <div>
              <ActivityChart continuousActivities={continuousActivities} nonContinuousActivities={nonContinuousActivities} />
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

            <div className="bg-white rounded-xl shadow-md p-6 border border-line">
              <h3 className="text-lg font-medium text-primary font-heading mb-4">สถิติวชาเรียน</h3>
              <p className="text-text-color font-body">
                จำนวนวิชาเรียนทั้งหมด: <span className="font-medium">{subjects?.length || 0} วิชา</span>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-line">
              <h3 className="text-lg font-medium text-primary font-heading mb-4">สถิติกิจกรรม</h3>
              <p className="text-text-color font-body">
                จำนวนกิจกรรมทั้งหมด: <span className="font-medium">{continuousActivities.length + nonContinuousActivities.length} กิจกรรม</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;