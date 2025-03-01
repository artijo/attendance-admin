import { useState } from "react";
import { formatPhoneNumber } from "../../helper";
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

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-2xl">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400t">
            <tr>
              <th className="px-6 py-3">รหัสนักเรียน</th>
              <th className="px-6 py-3">ชื่อ - สกุล</th>
              <th className="px-6 py-3">อีเมล</th>
              <th className="px-6 py-3">เลขโทรศัพท์</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentStudents.map((student) => (
              <tr key={student.stdId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">  
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <Link to={`/students/${student.stdId}`} className="hover:bg-gray-100">{student.stdId}</Link>
                </td>
                <td className="px-6 py-4">{student.fName} {student.lName}</td>
                <td className="px-6 py-4">{student.email? student.email: "ไม่มีอีเมล"}</td>
                <td className="px-6 py-4">{student.tel? formatPhoneNumber(student.tel) : "ไม่มีหมายเลขโทรศัพท์"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
        <ol className="flex flex-wrap justify-end gap-1 text-xs font-medium">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Prev Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              <button
                onClick={() => handlePageChange(page)}
                className={`block size-8 rounded border ${
                  currentPage === page
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-100 bg-white text-gray-900"
                } text-center leading-8`}
              >
                {page}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default StudentList;
