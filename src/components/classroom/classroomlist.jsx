import { Link } from "react-router-dom";
function ClassroomList({classrooms}) {
  return (
    <div>
    <div className="relative overflow-x-auto shadow-md sm:rounded-2xl">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr >
            <th className="px-6 py-3">ห้องเรียน</th>
            <th className="px-6 py-3">แผนการเรียน</th>
            <th className="px-6 py-3">ปีการศึกษา</th>
            <th className="px-6 py-3">เทอม</th>
          </tr>
        </thead>

        <tbody>
          {classrooms.map((classroom) => (
            <tr key={classroom.classId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"><Link to={`/classroom/${classroom.classId}`} className="hover:bg-gray-100">{classroom.classLevel}/{classroom.classRoom}</Link></th>
              
              <td className="px-6 py-4">{classroom.classroomType.classTypeNameThai}</td>

              <td className="px-6 py-4">{classroom.term.academicYear+543}</td>
              <td className="px-6 py-4">{classroom.term.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default ClassroomList;