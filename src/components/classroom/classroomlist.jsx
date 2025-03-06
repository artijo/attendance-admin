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
              <td className="px-6 py-4">
                <span className='inline-flex overflow-hidden rounded-md border bg-white shadow-sm'>
                    <Link 
                      to={`/timetable/${classroom.classId}`}
                    >
                      <button
                        className=" inline-flex items-center gap-2 p-3 text-blue-600 hover:bg-gray-50 focus:relative"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                        </svg>
                        ตารางเรียน
                      </button>
                    </Link>
                  </span>
                  
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