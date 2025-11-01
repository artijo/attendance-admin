import { PropTypes } from "prop-types";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AttendenceBySubjectList = ({ classroomId }) => {
    const [subjectList, setSubjectList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(subjectList.length / itemsPerPage);
    const sliceSubjectList = subjectList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/subjectTimetable/${classroomId}`);
            setSubjectList(response.data);
            setError(null);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลรายวิชาได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (classroomId) {
            fetchData();
        }
    }, [classroomId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="w-10 h-10 border-b-2 rounded-full animate-spin border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
                <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-lg text-sm font-medium text-text-color">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    จำนวนวิชาทั้งหมด: <span className="ml-1 font-semibold text-primary">{subjectList.length} วิชา</span>
                </div>
            </div>
            
            <div className="overflow-hidden bg-white border rounded-lg border-line">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs tracking-wider uppercase border-b text-text-color-alt bg-gray-50 border-line">
                            <tr>
                                <th className="px-6 py-3" width="60">ลำดับ</th>
                                <th className="px-6 py-3">รหัสวิชา</th>
                                <th className="px-6 py-3">วิชา</th>
                                <th className="px-6 py-3">ผู้สอน</th>
                                <th className="px-6 py-3 text-right">การเข้าเรียน</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200">
                            {sliceSubjectList.length > 0 ? (
                                sliceSubjectList.map((subject, index) => (
                                    <tr key={index} className="transition-colors duration-150 bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-center text-text-color">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs text-nowrap font-medium bg-blue-100 text-blue-800">
                                                {subject.subCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-text-color">{subject.subNameThai}</div>
                                            <div className="text-xs text-text-color-alt">{subject.subNameEng}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex items-center justify-center w-8 h-8 mr-2 font-medium rounded-full bg-primary/10 text-primary">
                                                    {subject.teacher?.fName?.charAt(0)}
                                                </div>
                                                <span>
                                                    คุณครู {subject.teacher?.fName} {subject.teacher?.lName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Link 
                                                to="/attendances/details/bysubject" 
                                                state={{ subject: subject, classroomId: classroomId }}
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-3 mb-3 text-gray-500 bg-gray-100 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <h3 className="mb-1 font-medium text-text-color">ไม่พบข้อมูลรายวิชา</h3>
                                            <p className="text-sm text-text-color-alt">ห้องเรียนนี้ยังไม่มีรายวิชาที่กำหนด</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {subjectList.length > 0 && (
                    <div className="px-6 py-4 border-t border-line">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-text-color-alt">
                                แสดง <span className="font-medium text-text-color">{sliceSubjectList.length}</span> จาก <span className="font-medium text-text-color">{subjectList.length}</span> รายการ
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

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === page 
                                            ? 'bg-primary text-white' 
                                            : 'bg-white text-text-color hover:bg-gray-50 border border-gray-200 transition-colors'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

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

AttendenceBySubjectList.propTypes = {
    classroomId: PropTypes.string.isRequired
};