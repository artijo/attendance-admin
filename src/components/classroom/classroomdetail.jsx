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
  const [editingStudent, setEditingStudent] = useState(null);
  const [editedStdNo, setEditedStdNo] = useState("");
  const [editedBehaviourScore, setEditedBehaviourScore] = useState("");
  const [error, setError] = useState("");
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");

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

  const validateStudentNo = (stdNo, excludeId = null) => {
    // Check if number is empty
    if (!stdNo || stdNo.trim() === "") {
      return "กรุณากรอกเลขที่นักเรียน";
    }
    
    // Check if number is positive
    if (parseInt(stdNo) <= 0) {
      return "เลขที่นักเรียนต้องมากกว่า 0";
    }

    // Check for duplicates
    const isDuplicate = classroom.classroomMembers.some(member => 
      member.stdNo === stdNo && member.classRoomMemeberId !== excludeId
    );
    
    if (isDuplicate) {
      return "เลขที่นักเรียนซ้ำกับนักเรียนคนอื่นในห้องเรียน";
    }

    return null;
  };

  const handleAddStudent = async () => {
    if (!selectedStudent || !studentNo) return;
    
    // Validate student number
    const validationError = validateStudentNo(studentNo);
    if (validationError) {
      setAddError(validationError);
      return;
    }

    setAddError(""); // Clear error if validation passes
    setIsLoading(true);
    try {
      await axios.post(HOSTNAME + "/a/classroom/member", {
        classId: classroom.classId,
        studentId: selectedStudent.value,
        stdNo: studentNo
      });
      window.location.reload();
    } catch (error) {
      setAddError("เกิดข้อผิดพลาดในการเพิ่มนักเรียน");
    } finally {
      setIsLoading(false);
      setSelectedStudent(null);
      setStudentNo("");
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditedStdNo(student.stdNo);
    setEditedBehaviourScore(student.behaviourScore);
    setEditError(""); // Clear any previous edit errors
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditedStdNo("");
    setEditedBehaviourScore("");
    setEditError(""); // Clear any edit errors
  };

  const handleSaveEdit = async (studentId) => {
    // Validate student number for edit
    const validationError = validateStudentNo(editedStdNo, studentId);
    if (validationError) {
      setEditError(validationError);
      return;
    }

    // Validate behaviour score
    if (!editedBehaviourScore || parseInt(editedBehaviourScore) < 0 || parseInt(editedBehaviourScore) > 100) {
      setEditError("คะแนนความประพฤติต้องมากกว่าหรือเท่ากับ 0 และน้อยกว่าหรือเท่ากับ 100");
      return;
    }

    setEditError(""); // Clear error if validation passes
    try {
      await axios.put(HOSTNAME + "/a/classroom/member/" + studentId, {
        stdNo: editedStdNo,
        behaviourScore: editedBehaviourScore
      });
      window.location.reload();
    } catch (error) {
      setEditError("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
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
            {classroom.term.academicYear+543}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">เทอม</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {classroom.term.semester}
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
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={studentNo}
                    onChange={(e) => {
                      setStudentNo(e.target.value);
                      setAddError(""); // Clear error on input change
                    }}
                    placeholder="เลขที่"
                    className={`w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 
                      ${addError ? 'border-red-500' : 'border-gray-300'}`}
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
                {addError && (
                  <div className="text-red-500 text-sm">
                    {addError}
                  </div>
                )}
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
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">คะแนนความประพฤติ</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">จัดการ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {classroom.classroomMembers
                  .sort((a, b) => parseInt(a.stdNo) - parseInt(b.stdNo))
                  .map((student) => (
                    <tr key={student.classRoomMemeberId}>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.student.stdId}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {editingStudent?.classRoomMemeberId === student.classRoomMemeberId ? (
                          <div className="flex flex-col gap-1">
                            <input
                              type="number"
                              value={editedStdNo}
                              onChange={(e) => {
                                setEditedStdNo(e.target.value);
                                setEditError(""); // Clear error on input change
                              }}
                              className={`w-20 px-2 py-1 border rounded
                                ${editError ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {editError && (
                              <div className="text-red-500 text-xs absolute mt-8">
                                {editError}
                              </div>
                            )}
                          </div>
                        ) : (
                          student.stdNo
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.student.title == "MR" ? "นาย" : 
                         student.student.title == "MS" ? "นางสาว" : 
                         student.student.title == "BOY" ? "เด็กชาย" : "เด็กหญิง"} 
                        {student.student.fName} {student.student.lName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {editingStudent?.classRoomMemeberId === student.classRoomMemeberId ? (
                          <input
                            type="number"
                            value={editedBehaviourScore}
                            onChange={(e) => setEditedBehaviourScore(e.target.value)}
                            className="w-20 px-2 py-1 border rounded"
                          />
                        ) : (
                          `${student.behaviourScore} คะแนน`
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                          {editingStudent?.classRoomMemeberId === student.classRoomMemeberId ? (
                            <>
                              <button
                                className="inline-block p-3 text-green-700 hover:bg-gray-50 focus:relative"
                                onClick={() => handleSaveEdit(student.classRoomMemeberId)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              </button>
                              <button
                                className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                                onClick={handleCancelEdit}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="inline-block p-3 text-blue-700 hover:bg-gray-50 focus:relative"
                                onClick={() => handleEditClick(student)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </button>
                              <button
                                className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                                onClick={() => handleDeleteClick(student.classRoomMemeberId)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </>
                          )}
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