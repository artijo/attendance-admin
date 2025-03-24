import { useState } from "react";
import { Link } from "react-router-dom";

function StudentList({ students, studentsPerPage }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(students.length / studentsPerPage);

  // Get current students to display
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = students.slice(startIndex, startIndex + studentsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper function to format classroom display
  const formatClassroom = (classroom) => {
    if (!classroom) return <span className="text-text-color-alt italic">ไม่มีห้องเรียน</span>;
    
    return (
      <div className="flex items-center">
        <span className="inline-block bg-secondary/10 text-secondary rounded-md px-2 py-1 text-sm">
          ม.{classroom.classLevel}/{classroom.classRoom}
        </span>
      </div>
    );
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-color-alt font-medium uppercase tracking-wider bg-gray-50 border-b border-line">
            <tr>
              <th className="px-4 py-3.5">รหัสนักเรียน</th>
              <th className="px-4 py-3.5">ชื่อ - สกุล</th>
              <th className="px-4 py-3.5">ห้องเรียน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentStudents.map((student) => (
              <tr 
                key={student.stdId} 
                className="hover:bg-gray-50 transition-colors duration-150"
              >  
                <td className="px-4 py-3.5 font-medium text-primary">
                  <Link 
                    to={`/students/${student.stdId}`} 
                    className="hover:text-accent transition-colors duration-200 flex items-center"
                  >
                    <span className="inline-block bg-primary/10 text-primary rounded-md px-2.5 py-1 text-sm font-medium">
                      {student.stdId}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3.5 font-body text-text-color">
                  {student.title === "MR" ? "นาย" : 
                   student.title === "MS" ? "นางสาว" : 
                   student.title === "BOY" ? "เด็กชาย" : "เด็กหญิง"} {student.fName} {student.lName}
                </td>
                <td className="px-4 py-3.5 font-body text-text-color">
                  {student.classroomMembers ? formatClassroom(student.classroomMembers[0].classroom) : (
                    <span className="text-text-color-alt italic">ไม่มีห้องเรียน</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-100 px-4 py-3 sm:px-6 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="hidden sm:block">
              <p className="text-sm text-text-color-alt">
                แสดงรายการ <span className="font-medium text-text-color">{startIndex + 1}</span> ถึง <span className="font-medium text-text-color">{Math.min(startIndex + studentsPerPage, students.length)}</span> จากทั้งหมด <span className="font-medium text-text-color">{students.length}</span> รายการ
              </p>
            </div>
            
            <nav className="flex justify-center items-center space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30'}`}
              >
                <span className="sr-only">หน้าแรก</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30'}`}
              >
                <span className="sr-only">ก่อนหน้า</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="hidden md:flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around the current page
                  let pageToShow;
                  if (totalPages <= 5) {
                    // If total pages <= 5, show all pages
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    // If near the start, show first 5 pages
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // If near the end, show last 5 pages
                    pageToShow = totalPages - 4 + i;
                  } else {
                    // Otherwise, show 2 pages before and after current
                    pageToShow = currentPage - 2 + i;
                  }
                
                  return (
                    <button
                      key={pageToShow}
                      onClick={() => handlePageChange(pageToShow)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                        currentPage === pageToShow
                          ? 'bg-primary text-white'
                          : 'text-text-color hover:bg-gray-100 hover:text-primary'
                      }`}
                    >
                      {pageToShow}
                    </button>
                  );
                })}
              </div>

              <div className="flex md:hidden">
                <span className="px-3 py-1.5 text-sm text-text-color font-medium">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30'}`}
              >
                <span className="sr-only">ถัดไป</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30'}`}
              >
                <span className="sr-only">หน้าสุดท้าย</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
