import { useState, useEffect } from "react";
import { formatDateToThai, formatTypeToThai } from "../../helper";
import { Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import PropTypes from "prop-types";
import AlertSuccess from "../alert/success.jsx";
import ErrorAlert from "../alert/error.jsx"

export const HolidayListable = ({holidayList, fectHolidayList}) => {
    const totalPages = Math.ceil(holidayList.length/10);
    const [currentPage, setCurrentPage] = useState(1);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [holidayToDelete, setHolidayToDelete] = useState(null);
    
    // Reset to page 1 if holidayList changes significantly
    useEffect(() => {
        setCurrentPage(1);
    }, [holidayList.length]);
    
    const sliceHolidayList = holidayList.slice((currentPage - 1) * 10, currentPage * 10);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const dismissAlerts = () => {
        setError(false);
        setSuccess(false);
        setMsg("");
    };

    const initiateDelete = (holiday) => {
        setHolidayToDelete(holiday);
        setShowDeleteConfirm(true);
    };

    const handleDeleteHoliday = async () => {
        if (!holidayToDelete) return;
        
        try {
            setIsDeleting(true);
            const response = await axios.delete(`${HOSTNAME}/a/holiday/${holidayToDelete.id}`);
            if (response.status === 200) {
                setMsg(response.data.message || "ลบวันหยุดเรียบร้อยแล้ว");
                setSuccess(true);
                await fectHolidayList();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบวันหยุด");
            setError(true);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            setHolidayToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setHolidayToDelete(null);
    };

    return (
        <div onClick={dismissAlerts}>
            {error && <ErrorAlert title="เกิดข้อผิดพลาด" message={msg}/>}
            {success && <AlertSuccess title="สำเร็จ" message={msg}/>}
            
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 border-b border-line">
                        <tr>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ชื่อวันหยุด</th>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">วันที่เริ่มหยุด</th>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">วันที่สิ้นสุดการหยุด</th>
                            <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ประเภทวันหยุด</th>
                            <th className="px-4 py-3.5 text-center text-xs font-medium text-text-color-alt tracking-wider font-heading" width="150">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {sliceHolidayList.length > 0 ? (
                            sliceHolidayList.map((holiday) => (
                                <tr key={holiday.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-4 py-4 font-medium text-text-color">{holiday.holidayname}</td>
                                    <td className="px-4 py-4 text-text-color">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDateToThai(holiday.startDate)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-text-color">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDateToThai(holiday.endDate)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            holiday.type === "PUBLIC" 
                                            ? "bg-red-100 text-red-800" 
                                            : holiday.type === "ACADEMIC" 
                                            ? "bg-blue-100 text-blue-800" 
                                            : "bg-green-100 text-green-800"
                                        }`}>
                                            {formatTypeToThai(holiday.type)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="inline-flex overflow-hidden rounded-lg border border-line bg-white shadow-sm">
                                            <Link 
                                                to={`/holiday/edit/${holiday.id}`}
                                                className="inline-block p-2.5 text-primary hover:bg-gray-50 focus:relative transition-colors duration-300"
                                                title="แก้ไขวันหยุด"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </Link>
                                            
                                            <button
                                                className="inline-block p-2.5 text-red-600 hover:bg-gray-50 focus:relative transition-colors duration-300"
                                                onClick={() => initiateDelete(holiday)}
                                                title="ลบวันหยุด"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-8">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบรายการวันหยุด</h2>
                                        <p className="text-text-color-alt font-body">ยังไม่มีข้อมูลวันหยุดในเทอมที่เลือก</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {totalPages > 1 && (
                <div className="flex justify-end items-center bg-white py-3 px-4 border-t border-line">
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
            
            {/* Delete confirmation modal */}
            {showDeleteConfirm && holidayToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-line">
                        <div className="text-center mb-5">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
                                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-text-color font-heading mb-2">ยืนยันการลบวันหยุด</h3>
                            <p className="text-text-color-alt font-body">
                                คุณต้องการลบวันหยุด "{holidayToDelete.holidayname}" ใช่หรือไม่?
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2.5 text-sm font-medium text-text-color bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleDeleteHoliday}
                                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังลบ...
                                    </>
                                ) : (
                                    'ยืนยันการลบ'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

HolidayListable.propTypes = {
    holidayList: PropTypes.array.isRequired,
    fectHolidayList: PropTypes.func.isRequired
};

