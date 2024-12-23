import { useState } from "react";
import { formatPhoneNumber } from "../../helper";
import { Link } from "react-router-dom";

function TeacherList({ teachers, teachersPerPage }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(teachers.length / teachersPerPage);

  // Get current teachers to display
  const startIndex = (currentPage - 1) * teachersPerPage;
  const currentTeachers = teachers.slice(startIndex, startIndex + teachersPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="overflow-x-auto rounded-t-lg">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">รหัสครู</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ชื่อ - สกุล</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">อีเมล</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">เลขโทรศัพท์</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentTeachers.map((teacher) => (
              <tr key={teacher.tchId}>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <Link to={`/teachers/${teacher.tchId}`} className="hover:bg-gray-100">
                    {teacher.tchCode}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {teacher.fName} {teacher.lName}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{teacher.email}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{formatPhoneNumber(teacher.tel)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
        <ol className="flex justify-end gap-1 text-xs font-medium">
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

export default TeacherList;