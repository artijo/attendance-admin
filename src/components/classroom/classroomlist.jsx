import { Link } from "react-router-dom";
function ClassroomList({classrooms}) {
  return (
    <div className="border border-gray-200">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr className="shadow-md h-12 text-center">
            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ห้องเรียน</th>
            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">แผนการเรียน</th>
            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ปีการศึกษา</th>
            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">เทอม</th>
            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ตารางเรียน</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {classrooms.map((classroom) => (
            <tr key={classroom.classId} className="even:bg-slate-100/70 text-center">
              
              <td className="whitespace-nowrap px-4 py-2 text-gray-700"><Link to={`/classroom/${classroom.classId}`} className="hover:bg-gray-100">{classroom.classLevel}/{classroom.classRoom}</Link></td>
              
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.classroomType.classTypeNameThai}</td>

              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.term.academicYear+543}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{classroom.term.semester}</td>
              
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <Link 
                    to={`/timetable/${classroom.classId}`}
                    className="cursor-pointer bg-blue-300/60 text-blue-500 px-5 py-[2px] rounded-sm hover:bg-blue-300/100 hover:text-blue-700"
                  >
                    ตารางเรียน
                  </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default ClassroomList;