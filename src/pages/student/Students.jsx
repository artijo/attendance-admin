import StudentList from "../../components/student/studentlist.jsx";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config.js";
import axios from "axios";
function Students() {
  const [students, setStudents] = useState([]);
  function fetchStudents() {
    axios.get(HOSTNAME + "/a/students").then((response) => {
      setStudents(response.data);
    }).catch((error) => {
      console.error("Error fetching students", error);
    });
  }
  useEffect(() => {
    fetchStudents();
  }, []);
  return (
    <div>
      <h1>Students</h1>
      <StudentList students={students} studentsPerPage={10} />
    </div>
  );
}
export default Students;