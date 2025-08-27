import React,{ useState, useEffect} from "react";
import axios from "axios";
import { HOSTNAME, TIME_ZONE } from "../../config";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { formatDateToThai, formatDayOfWeeks } from "../../helper";

export const AttendenceByDayList = ({ termId, classroomId }) => {
    const [dayList, setDayList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(dayList.length / itemsPerPage);
    const sliceDayList = dayList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getTermBetween = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/term/${termId}`);
            setDayList(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("ไม่สามารถโหลดข้อมูลวันเรียนได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (termId) {
            getTermBetween();
        }
    }, [termId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-lg text-sm font-medium text-text-color">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    จำนวนวันที่มีการเรียนตามเทอม: <span className="text-primary ml-1 font-semibold">{dayList.length} วัน</span>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-line overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-color-alt uppercase tracking-wider bg-gray-50 border-b border-line">
                            <tr>
                                <th className="px-6 py-3">วันที่</th>
                                <th className="px-6 py-3">วัน</th>
                                <th className="px-6 py-3 text-right">การเข้าเรียน</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sliceDayList.length > 0 ? (
                                sliceDayList.map((day, index) => {
                                  const formattedDate = formatDateToThai(day);
                                      // สร้าง DateTime object ด้วยโซนเวลาท้องถิ่นตั้งแต่แรก
                                      const dayOfWeek = formatDayOfWeeks(DateTime.fromISO(day, { zone: TIME_ZONE }).weekday);
                                      const isWeekend = ["เสาร์", "อาทิตย์"].includes(dayOfWeek);
                                      return (
                                          <tr key={index} className={`${isWeekend ? 'bg-red-50' : 'bg-white'} hover:bg-gray-50 transition-colors duration-150`}>
                                              <td className="px-6 py-4 font-medium text-text-color">
                                                  {formattedDate}
                                              </td>
                                              <td className={`px-6 py-4 ${isWeekend ? 'text-red-600 font-medium' : 'text-text-color'}`}>
                                                  {dayOfWeek}
                                              </td>
                                              <td className="px-6 py-4 text-right">
                                                  <Link
                                                      to="/attendances/details/byday"
                                                      state={{ classroomId: classroomId, date: day }}
                                                      className="inline-flex items-center px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors duration-300"
                                                  >
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                      </svg>
                                                      ดูการเข้าเรียน
                                                  </Link>
                                              </td>
                                          </tr>
                                      );
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-gray-100 text-gray-500 rounded-full p-3 mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-medium text-text-color mb-1">ไม่พบข้อมูลวันที่มีเรียน</h3>
                                            <p className="text-sm text-text-color-alt">ไม่มีวันเรียนที่ถูกกำหนดในเทอมนี้</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {dayList.length > 0 && (
                    <div className="border-t border-line px-6 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-text-color-alt">
                                แสดง <span className="font-medium text-text-color">{sliceDayList.length}</span> จาก <span className="font-medium text-text-color">{dayList.length}</span> รายการ
                            </p>

                            <div className="flex items-center justify-end gap-1">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`flex items-center justify-center px-3 py-1 rounded border ${
                                        currentPage === 1
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'border-gray-200 bg-white text-text-color hover:bg-gray-50 transition-colors'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        // Show current page, first, last, and pages near current
                                        return page === 1 ||
                                               page === totalPages ||
                                               (page >= currentPage - 1 && page <= currentPage + 1);
                                    })
                                    .map((page, index, array) => (
                                        <React.Fragment key={page}>
                                            {index > 0 && array[index - 1] !== page - 1 && (
                                                <span className="px-2 text-text-color-alt">...</span>
                                            )}
                                            <button
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-1 rounded ${
                                                    currentPage === page
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white text-text-color hover:bg-gray-50 border border-gray-200 transition-colors'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    ))
                                }

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center justify-center px-3 py-1 rounded border ${
                                        currentPage === totalPages
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'border-gray-200 bg-white text-text-color hover:bg-gray-50 transition-colors'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

AttendenceByDayList.propTypes = {
    termId: PropTypes.string.isRequired,
    classroomId: PropTypes.string.isRequired
};
