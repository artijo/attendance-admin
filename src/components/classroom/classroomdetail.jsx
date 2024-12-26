
function ShowDetail({ classroom }) {
  return (
    <>
    <div className="flow-root bg-white rounded-lg border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">ห้องเรียน</dt>
          <dd className="text-gray-700 sm:col-span-2">{classroom.classLevel}/{classroom.classRoom}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">รายละเอียด</dt>
          <dd className="text-gray-700 sm:col-span-2">
           {classroom.classroomType.classTypeNameThai} ({classroom.classroomType.classTypeNameEng})
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">จำนวนนักเรียน</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {classroom.classroomMembers.length} คน
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">ครูที่ปรึกษาห้องเรียน</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {classroom.teacher? (
                classroom.teacher.map((teacher) => (
                    <span key={teacher.tchId}>{teacher.title} {teacher.fName} {teacher.lName} </span>
                )) 
            ) : (
                <span>ไม่มีครูที่ปรึกษา</span>
            )}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">วิชาที่เรียน</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {
                classroom.timetable? (
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
     {
      classroom.classroomMembers.length > 0 && (
        <div className="mt-5">
          <h2 className="text-lg font-semibold text-gray-900">รายชื่อนักเรียนในห้องเรียน</h2>
          <div className="overflow-x-auto mt-3">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">รหัสนักเรียน</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ชื่อ - สกุล</th>
                  {/* <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">อีเมล</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">เลขโทรศัพท์</th> */}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {classroom.classroomMembers.map((student) => (
                  <tr key={student.stdId}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.student.stdId}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.student.title == "MR" ? "นาย" : student.student.title == "MS" ? "นางสาว" : student.student.title == "BOY" ? "เด็กชาย" : "เด็กหญิง"} {student.student.fName} {student.student.lName}</td>
                    {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.email}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.tel? formatPhoneNumber(student.tel) : "ไม่มีหมายเลขโทรศัพท์"}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
     }
    </>
  );
}

export default ShowDetail;