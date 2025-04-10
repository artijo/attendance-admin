import PropTypes from 'prop-types';
import { formatDateToThai, formatTypeToThai } from "../../../helper";
import { useState, useEffect } from 'react';

export const Holidaylisttable = ({holidayList, setHolidayAutoList, setHolidayList}) => {
    const totalPages = Math.ceil(holidayList.length / 5);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Reset to page 1 if holidayList changes significantly
    useEffect(() => {
        setCurrentPage(1);
    }, [holidayList.length]);
    
    const sliceHolidayList = holidayList.slice((currentPage - 1) * 5, currentPage * 5);
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteHoliday = async (id) => {
        try {
            setHolidayList(prevList => prevList.filter(holiday => holiday.id !== id));
            setHolidayAutoList(prevList => prevList.filter(holiday => holiday.id !== id));
        } catch(error) {
            console.error(error);
        }
    };

    const getHolidayTypeColor = (type) => {
        switch(type) {
            case 'RATCHAKHAN':
                return 'bg-blue-100 text-blue-800';
            case 'SCHOOL':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="overflow-hidden rounded-lg border border-line">
                {holidayList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่มีรายการวันหยุด</h2>
                        <p className="text-text-color-alt font-body">กรุณาเพิ่มวันหยุดหรือเปิดใช้งานวันหยุดอัตโนมัติ</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 border-b border-line">
                                <tr>
                                    <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ชื่อวันหยุด</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">วันที่เริ่มหยุด</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">วันที่สิ้นสุด</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ประเภท</th>
                                    <th className="px-4 py-3.5 text-center text-xs font-medium text-text-color-alt tracking-wider font-heading" width="100">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {sliceHolidayList.map((holiday, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-4 py-3 font-medium text-text-color text-sm">{holiday.holidayname}</td>
                                        <td className="px-4 py-3 text-sm text-text-color">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDateToThai(holiday.startDate)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-text-color">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDateToThai(holiday.endDate)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHolidayTypeColor(holiday.type)}`}>
                                                {formatTypeToThai(holiday.type)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center">
                                            <button 
                                                onClick={() => handleDeleteHoliday(holiday.id)}
                                                className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                                title="ลบรายการ"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {totalPages > 1 && (
                <div className="flex justify-end items-center py-3 px-4 border-t border-line mt-3 bg-white rounded-lg shadow-sm">
                    <nav className="flex items-center gap-1 text-sm">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`inline-flex items-center justify-center h-8 w-8 rounded border ${
                                currentPage === 1
                                ? "border-gray-200 bg-white text-gray-300 cursor-not-allowed"
                                : "border-gray-200 bg-white text-text-color hover:border-primary hover:text-primary"
                            } transition-colors duration-300`}
                            aria-label="Previous Page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`inline-flex items-center justify-center h-8 w-8 rounded text-sm font-medium ${
                                        currentPage === page
                                        ? "bg-primary text-white"
                                        : "border border-gray-200 bg-white text-text-color hover:border-primary hover:text-primary"
                                    } transition-colors duration-300`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`inline-flex items-center justify-center h-8 w-8 rounded border ${
                                currentPage === totalPages
                                ? "border-gray-200 bg-white text-gray-300 cursor-not-allowed"
                                : "border-gray-200 bg-white text-text-color hover:border-primary hover:text-primary"
                            } transition-colors duration-300`}
                            aria-label="Next Page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

Holidaylisttable.propTypes = {
    holidayList: PropTypes.array.isRequired,
    setHolidayAutoList: PropTypes.func.isRequired,
    setHolidayList: PropTypes.func.isRequired
};