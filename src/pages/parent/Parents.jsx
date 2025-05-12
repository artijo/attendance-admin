// filepath: d:\Github Projects\student_attendance_client_admin\src\pages\parent\Parents.jsx
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import Loading from "../../components/alert/loading";
import Error from "../../components/alert/error";

function Parents() {
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchParents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${HOSTNAME}/a/parents`);
      setParents(response.data);
      setFilteredParents(response.data);
    } catch (error) {
      console.error("Error fetching parents data:", error);
      setError("ไม่สามารถโหลดข้อมูลผู้ปกครองได้");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  // Handle search through different fields
  useEffect(() => {
    if (!search.trim()) {
      setFilteredParents(parents);
    } else {
      const searchTermLower = search.toLowerCase();
      const filtered = parents.filter(
        (parent) =>
          parent.name?.toLowerCase().includes(searchTermLower) ||
          parent.email?.toLowerCase().includes(searchTermLower) ||
          parent.tel?.includes(search)
      );
      setFilteredParents(filtered);
    }
    setCurrentPage(1);
  }, [search, parents]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredParents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">ผู้ปกครอง</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white rounded-lg px-4 py-2 border border-line shadow-sm">
            <span className="text-text-color-alt font-body">จำนวนผู้ปกครองทั้งหมด:</span>
            <span className="ml-2 font-medium text-primary text-lg font-heading">{filteredParents.length} คน</span>
          </div>
          
          <div className="relative w-1/3">
            <label htmlFor="Search" className="sr-only">
              ค้นหา
            </label>
            <input
              type="text"
              id="Search"
              placeholder="ค้นหาด้วยชื่อ อีเมล หรือเบอร์โทร"
              className="w-full rounded-lg border-gray-300 py-2.5 pl-4 pr-10 shadow-sm sm:text-sm focus:border-primary focus:ring-primary font-body"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
              <button type="button" className="text-gray-600 hover:text-primary">
                <span className="sr-only">ค้นหา</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-color-alt font-medium uppercase tracking-wider bg-gray-50 border-b border-line">
              <tr>
                <th className="px-6 py-4 text-left">ลำดับ</th>
                <th className="px-6 py-4 text-left">ชื่อผู้ปกครอง</th>
                <th className="px-6 py-4 text-left">อีเมล</th>
                <th className="px-6 py-4 text-left">เบอร์โทรศัพท์</th>
                <th className="px-6 py-4 text-center">จำนวนนักเรียน</th>
                <th className="px-6 py-4 text-center">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((parent, index) => (
                  <tr key={parent.prntId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 font-body text-text-color">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium font-body text-text-color">
                      {parent.name}
                    </td>
                    <td className="px-6 py-4 font-body text-text-color">
                      {parent.email ? (
                        <a 
                          href={`mailto:${parent.email}`} 
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {parent.email}
                        </a>
                      ) : (
                        <span className="text-text-color-alt italic">ไม่มีอีเมล</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-body text-text-color">
                      {parent.tel ? (
                        <a 
                          href={`tel:${parent.tel}`} 
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {parent.tel}
                        </a>
                      ) : (
                        <span className="text-text-color-alt italic">ไม่มีเบอร์โทรศัพท์</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-body text-text-color">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {parent.student?.length || 0}
                      </span>
                    </td>                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/parent/${parent.prntId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 px-6 text-center text-gray-500">
                    ไม่พบข้อมูลผู้ปกครอง
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3 sm:px-6 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm text-text-color-alt">
                  แสดงรายการ <span className="font-medium text-text-color">{startIndex + 1}</span> ถึง <span className="font-medium text-text-color">{Math.min(startIndex + itemsPerPage, filteredParents.length)}</span> จากทั้งหมด <span className="font-medium text-text-color">{filteredParents.length}</span> รายการ
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
    </div>
  );
}

export default Parents;