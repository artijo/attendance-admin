import axios from "axios";
import { HOSTNAME } from "../../config";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

function ShowDetail({ classroom }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [students, setStudents] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentNo, setStudentNo] = useState("");

  function fetchStudents() {
    axios
      .get(HOSTNAME + "/a/students/withoutClassroom")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students", error);
      });
  }

  const handleDeleteClick = (uuid) => {
    setStudentToDelete(uuid);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    
    axios
      .delete(HOSTNAME + "/a/classroom/member/" + studentToDelete)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting student", error);
      });
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setStudentToDelete(null);
  };

  const handleStudentSelect = (selected) => {
    setSelectedStudent(selected);
    setStudentNo(""); // Reset student number when new student is selected
  };

  const handleAddStudent = async () => {
    if (!selectedStudent || !studentNo) return;
    
    setIsLoading(true);
    try {
      // console.log(classroom.classId, selectedStudent.value, studentNo);
      await axios.post(HOSTNAME + "/a/classroom/member", {
        classId: classroom.classId,
        studentId: selectedStudent.value,
        stdNo: studentNo
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding student to classroom", error);
    } finally {
      setIsLoading(false);
      setSelectedStudent(null);
      setStudentNo("");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
    <div className="flow-root bg-white rounded-lg border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">ห้องเรียน</dt>
          <dd className="text-gray-700 sm:col-span-2">{classroom.classLevel}/{classroom.classRoom}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">รายละเอียด</dt>
          <dd className="text-gray-700 sm:col-span-2">
           {classroom.classroomType.classTypeNameThai} ({classroom.classroomType.classTypeNameEng})
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">จำนวนนักเรียน</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {classroom.classroomMembers? classroom.classroomMembers.length : 0} คน
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">ปีการศึกษา</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {classroom.academicYear+543}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">เทอม</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {classroom.semester}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">ครูที่ปรึกษาห้องเรียน</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {classroom.teacher.length > 0 ? (
                classroom.teacher.map((teacher) => (
                    <span key={teacher.tchId}>{teacher.title} {teacher.fName} {teacher.lName} </span>
                )) 
            ) : (
                <span>ไม่มีครูที่ปรึกษา</span>
            )}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">วิชาที่เรียน</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {
                classroom.timetable.length >0 ? (
                    classroom.timetable.map((timetable) => (
                        <span key={timetable.timetableId}>{timetable.subject.subNameThai} ({timetable.subject.subNameEng}) เวลา {timetable.timeStart} - {timetable.timeEnd} <br /> </span>
                    )) 
                ) : (
                    <span>ไม่มีวิชาที่เรียน</span>
                )
            }
          </dd>
        </div>
       
      </dl>
    </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-5">เพิ่มนักเรียนเข้าห้องเรียน</h3>
            <div className="mt-3 space-y-3">
              <Select
                isSearchable
                isClearable
                isLoading={isLoading}
                value={selectedStudent}
                options={students?.map((student) => ({
                  value: student.stdId,
                  label: `${student.stdId} - ${
                    student.title == "MR" ? "นาย" : 
                    student.title == "MS" ? "นางสาว" : 
                    student.title == "BOY" ? "เด็กชาย" : "เด็กหญิง"
                  } ${student.fName} ${student.lName}`,
                }))}
                onChange={handleStudentSelect}
                placeholder="เลือกนักเรียนที่ต้องการเพิ่ม..."
                noOptionsMessage={() => "ไม่พบนักเรียน"}
                loadingMessage={() => "กำลังโหลดข้อมูล..."}
                isDisabled={isLoading}
                className="basic-select"
                classNamePrefix="select"
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  value={studentNo}
                  onChange={(e) => setStudentNo(e.target.value)}
                  placeholder="เลขที่"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  disabled={isLoading || !selectedStudent}
                />
                <button
                  onClick={handleAddStudent}
                  disabled={!selectedStudent || !studentNo || isLoading}
                  className={`px-4 py-2 rounded-md text-white font-medium flex-shrink-0
                    ${!selectedStudent || !studentNo || isLoading
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300'
                    }`}
                >
                  {isLoading ? 'กำลังเพิ่มนักเรียน...' : 'เพิ่มนักเรียน'}
                </button>
              </div>
            </div>
    
     {
      classroom.classroomMembers.length > 0 && (
        <div className="mt-5">
          <h2 className="text-lg font-semibold text-gray-900">รายชื่อนักเรียนในห้องเรียน</h2>
          <div className="overflow-x-auto mt-3">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รหัสนักเรียน</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">เลขที่</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อ - สกุล</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">จัดการ</th>
                  {/* <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">อีเมล</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">เลขโทรศัพท์</th> */}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {classroom.classroomMembers
                  .sort((a, b) => parseInt(a.stdNo) - parseInt(b.stdNo))
                  .map((student) => (
                    <tr key={student.classRoomMemeberId}>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.student.stdId}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.stdNo}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.student.title == "MR" ? "นาย" : 
                         student.student.title == "MS" ? "นางสาว" : 
                         student.student.title == "BOY" ? "เด็กชาย" : "เด็กหญิง"} 
                        {student.student.fName} {student.student.lName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">

  <button
    className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
    title="Delete Student"
    onClick={() => handleDeleteClick(student.classRoomMemeberId)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  </button>
</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )
     }

     {/* Confirmation Dialog */}
     {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">ยืนยันการลบ</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  คุณต้องการลบนักเรียนออกจากห้องเรียนหรือไม่?
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={handleConfirmDelete}
                >
                  ลบ
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={handleCancelDelete}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShowDetail;