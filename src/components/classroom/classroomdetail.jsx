
function ShowDetail({ classroom }) {
  return (
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
                        <span key={timetable.ttId}>{timetable.subject.subNameThai} ({timetable.subject.subNameEng}) เวลา {timetable.timeStart} - {timetable.timeEnd} <br /> </span>
                    )) 
                ) : (
                    <span>ไม่มีวิชาที่เรียน</span>
                )
            }
          </dd>
        </div>
       
      </dl>
    </div>
  );
}

export default ShowDetail;