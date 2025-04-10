import { Link } from "react-router-dom";

function ClassroomList({ classrooms }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-color-alt font-medium uppercase tracking-wider bg-gray-50 border-b border-line">
          <tr>
            <th className="px-4 py-3.5">ห้องเรียน</th>
            <th className="px-4 py-3.5">แผนการเรียน</th>
            <th className="px-4 py-3.5">ปีการศึกษา</th>
            <th className="px-4 py-3.5">เทอม</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {classrooms.map((classroom) => (
            <tr 
              key={classroom.classId} 
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-4 py-3.5 font-medium text-primary">
                <Link 
                  to={`/classroom/${classroom.classId}`} 
                  className="hover:text-accent transition-colors duration-200 flex items-center"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-block bg-primary/10 text-primary rounded-md px-2.5 py-1 text-sm font-medium">
                      ม.{classroom.classLevel}/{classroom.classRoom}
                    </span>
                    {classroom.classroomMembers && (
                      <span className="text-xs text-text-color-alt bg-gray-100 px-2 py-0.5 rounded-full">
                        {classroom.classroomMembers.length} คน
                      </span>
                    )}
                  </div>
                </Link>
              </td>
              
              <td className="px-4 py-3.5 font-body text-text-color">
                {classroom.classroomType ? (
                  <div className="flex flex-col">
                    <span className="font-medium">{classroom.classroomType.classTypeNameThai}</span>
                    <span className="text-xs text-text-color-alt">{classroom.classroomType.classTypeNameEng}</span>
                  </div>
                ) : (
                  <span className="text-text-color-alt italic">ไม่ระบุ</span>
                )}
              </td>

              <td className="px-4 py-3.5 font-body text-text-color">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-600">
                  {classroom.term ? classroom.term.academicYear + 543 : "-"}
                </span>
              </td>
              
              <td className="px-4 py-3.5 font-body text-text-color">
                {classroom.term ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-50 text-green-600">
                    {classroom.term.semester}
                  </span>
                ) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassroomList;