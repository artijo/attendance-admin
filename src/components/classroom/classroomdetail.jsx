import axios from "axios";
import { HOSTNAME } from "../../config";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { formatTitle } from "../../helper";

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
      <div className="flow-root">
        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="p-4 sm:p-6">
          <dl className="divide-y divide-gray-100 text-sm">
            <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-text-color font-body flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                ห้องเรียน
              </dt>
              <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">{classroom.classLevel}/{classroom.classRoom}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-text-color font-body flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                รายละเอียด
              </dt>
              <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                <div className="flex gap-2 items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {classroom.classroomType.classTypeNameThai}
                  </span>
                  <span className="text-text-color-alt font-body text-sm">({classroom.classroomType.classTypeNameEng})</span>
                </div>
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-text-color font-body flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                จำนวนนักเรียน
              </dt>
              <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {classroom.classroomMembers ? classroom.classroomMembers.length : 0} คน
                </span>
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-text-color font-body flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                ปีการศึกษา
              </dt>
              <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                {classroom.term.academicYear + 543}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-text-color font-body flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                เทอม
              </dt>
              <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                {classroom.term.semester}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-text-color font-body flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                ครูที่ปรึกษาห้องเรียน
              </dt>
              <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                {classroom.teacher.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {classroom.teacher.map((teacher) => (
                      <Link 
                        to={`/teachers/${teacher.tchId}`}
                        key={teacher.tchId} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200"
                      >
                        {teacher.fName} {teacher.lName}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span className="text-text-color-alt font-body">ไม่มีครูที่ปรึกษา</span>
                )}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-text-color font-body flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                วิชาที่เรียน
              </dt>
              <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                {classroom.timetable.length > 0 ? (
                  <div className="space-y-2">
                    {classroom.timetable.map((timetable) => (
                      <div key={timetable.timetableId} className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {timetable.subject.subNameThai}
                        </span>
                        <span className="text-text-color-alt text-sm">
                          ({timetable.subject.subNameEng}) เวลา {timetable.timeStart} - {timetable.timeEnd}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-text-color-alt font-body">ไม่มีวิชาที่เรียน</span>
                )}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-text-color font-body flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                หัวหน้าห้อง
              </dt>
              <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                {classroom.leader ? (
                  <div className="flex items-center gap-2">
                    {/* If there's a leader with student info, display it with a link */}
                    {classroom.leader.student && (
                      <Link 
                        to={`/students/${classroom.leader.stdId}`}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200"
                      >
                        <span className="font-semibold">
                          {formatTitle(classroom.leader.student.title)}
                          {classroom.leader.student.fName}
                        <span className="ml-1">{classroom.leader.student.lName}</span>
                        </span>
                      </Link>
                    )}
                    {/* If leader ID exists but we have no student info, just show the ID */}
                    {!classroom.leader.student && classroom.leader.stdId && (
                      <span>รหัส {classroom.leader.stdId}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-text-color-alt font-body">ไม่มีหัวหน้าห้อง</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-6 pt-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-primary mb-4 font-heading flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            เพิ่มนักเรียนเข้าห้องเรียน
          </h3>
          <div className="space-y-4">
            <Select
              isSearchable
              isClearable
              isLoading={isLoading}
              value={selectedStudent}
              options={students?.map((student) => ({
                value: student.stdId,
                label: `${student.stdId} - ${
                  student.title === "MR" ? "นาย" : 
                  student.title === "MS" ? "นางสาว" : 
                  student.title === "BOY" ? "เด็กชาย" : "เด็กหญิง"
                } ${student.fName} ${student.lName}`,
              }))}
              onChange={handleStudentSelect}
              placeholder="เลือกนักเรียนที่ต้องการเพิ่ม..."
              noOptionsMessage={() => "ไม่พบนักเรียน"}
              loadingMessage={() => "กำลังโหลดข้อมูล..."}
              isDisabled={isLoading}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: addError ? '#F56565' : '#E2E8F0',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#CBD5E0',
                  },
                  padding: '2px'
                })
              }}
            />
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label htmlFor="studentNo" className="block text-sm font-medium text-text-color font-body mb-1">เลขที่นักเรียน <span className="text-red-500">*</span></label>
                  <input
                    id="studentNo"
                    type="number"
                    value={studentNo}
                    onChange={(e) => {
                      setStudentNo(e.target.value);
                      setAddError(""); // Clear error on input change
                    }}
                    placeholder="เลขที่"
                    className={`w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 font-body 
                      ${addError ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isLoading || !selectedStudent}
                  />
                </div>
                <button
                  onClick={handleAddStudent}
                  disabled={!selectedStudent || !studentNo || isLoading}
                  className={`mt-6 px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 flex items-center
                    ${!selectedStudent || !studentNo || isLoading
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30'
                    }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {isLoading ? 'กำลังเพิ่มนักเรียน...' : 'เพิ่มนักเรียน'}
                </button>
              </div>
              {addError && (
                <div className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg font-body">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {addError}
                </div>
              )}
            </div>
          </div>
        </div>

        {classroom.classroomMembers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-primary mb-4 font-heading flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              รายชื่อนักเรียนในห้องเรียน
            </h3>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left text-text-color">
                <thead className="text-xs text-text-color-alt uppercase bg-gray-50 font-body">
                  <tr>
                    <th className="px-4 py-3">รหัสนักเรียน</th>
                    <th className="px-4 py-3">เลขที่</th>
                    <th className="px-4 py-3">ชื่อ - สกุล</th>
                    <th className="px-4 py-3">คะแนนความประพฤติ</th>
                    <th className="px-4 py-3 text-center">จัดการ</th>
                  </tr>
                </thead>

                <tbody>
                  {classroom.classroomMembers
                    .sort((a, b) => parseInt(a.stdNo) - parseInt(b.stdNo))
                    .map((student) => (
                      <tr key={student.classRoomMemeberId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          <Link to={`/students/${student.student.stdId}`} className="text-primary hover:text-accent transition-colors">
                            {student.student.stdId}
                          </Link>
                        </td>
                        <td className="px-4 py-3 relative">
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
                                <div className="text-red-500 text-xs absolute mt-8 w-48 z-10 bg-white p-1 shadow-md border border-red-100">
                                  {editError}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                              {student.stdNo}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/students/${student.student.stdId}`} className="hover:text-primary transition-colors">
                            {student.student.title === "MR" ? "นาย" : 
                            student.student.title === "MS" ? "นางสาว" : 
                            student.student.title === "BOY" ? "เด็กชาย" : "เด็กหญิง"} 
                            {student.student.fName} {student.student.lName}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          {editingStudent?.classRoomMemeberId === student.classRoomMemeberId ? (
                            <input
                              type="number"
                              value={editedBehaviourScore}
                              onChange={(e) => setEditedBehaviourScore(e.target.value)}
                              className="w-20 px-2 py-1 border rounded"
                            />
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {student.behaviourScore} คะแนน
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex overflow-hidden rounded-md border border-line bg-white shadow-sm">
                            {editingStudent?.classRoomMemeberId === student.classRoomMemeberId ? (
                              <>
                                <button
                                  className="inline-block p-2 text-green-700 hover:bg-gray-50 focus:relative"
                                  onClick={() => handleSaveEdit(student.classRoomMemeberId)}
                                  title="บันทึก"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                </button>
                                <button
                                  className="inline-block p-2 text-gray-700 hover:bg-gray-50 focus:relative"
                                  onClick={handleCancelEdit}
                                  title="ยกเลิก"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="inline-block p-2 text-primary hover:bg-gray-50 focus:relative"
                                  onClick={() => handleEditClick(student)}
                                  title="แก้ไข"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>
                                <button
                                  className="inline-block p-2 text-red-600 hover:bg-gray-50 focus:relative"
                                  onClick={() => handleDeleteClick(student.classRoomMemeberId)}
                                  title="ลบ"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-line">
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-color font-heading mb-2">ยืนยันการลบนักเรียน</h3>
              <p className="text-text-color-alt font-body">
                คุณต้องการลบนักเรียนออกจากห้องเรียนหรือไม่?
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2.5 text-sm font-medium text-text-color bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShowDetail;