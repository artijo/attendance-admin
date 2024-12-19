import { Link } from "react-router-dom";
function ClassroomList({classrooms}) {
  return (
    <div className="rounded-lg border border-gray-200">
    <div className="overflow-x-auto rounded-t-lg">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ห้องเรียน</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">รายละเอียด</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {classrooms.map((classroom) => (
            <tr key={classroom.classroomId}>
              
              <td className="whitespace-nowrap px-4 py-2 text-gray-700"><Link to={`/classroom/${classroom.classId}`} className="hover:bg-gray-100">{classroom.classLevel}/{classroom.classRoom}</Link></td>
              
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.classroomType.classTypeNameThai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default ClassroomList;