import { PropTypes } from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { AttendanceSummaryByDay } from '../../exportExcel';
import ExportExcelButton from '../exportExcelButton';
import ExportPdfButton from '../exportPdfButton';
import axios from 'axios';
import { HOSTNAME } from '../../config';

export const AttendenceBySummaryByClassroomList = ({ studentList, classroomId }) => {
    const ref = useRef();
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [exportLoading, setExportLoading] = useState({ excel: false, pdf: false });
    const itemsPerPage = 10;
    
    const totalPages = Math.ceil(studentList.length / itemsPerPage);
    const sliceStudentList = studentList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleExportExcel = () => {
        if (ref.current) {
            setExportLoading(prev => ({ ...prev, excel: true }));
            
            try {
                const fileName = classroomInfo 
                    ? `สรุปการเข้าเรียนห้อง_ม${classroomInfo.classLevel}_${classroomInfo.classRoom}_${new Date().toLocaleDateString('th-TH')}` 
                    : `สรุปการเข้าเรียนตามห้อง_${new Date().toLocaleDateString('th-TH')}`;
                
                AttendanceSummaryByDay(ref.current, fileName);
            } catch (error) {
                console.error("Export Excel error:", error);
            } finally {
                setExportLoading(prev => ({ ...prev, excel: false }));
            }
        }
    };

    const fetchClassroomInfo = async () => {
        if (!classroomId) return;
        
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/a/classroom/${classroomId}`);
            if (response.status === 200) {
                setClassroomInfo(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // const handlePdfComponent = () => {
    //     if (classroomInfo && studentList.length > 0) {
    //         return <ByClassroom classroomInfo={classroomInfo} studentList={studentList} />;
    //     }
    //     return null;
    // };

    // const ExportPdfButtonComponent = () => {
    //     const pdfComponent = handlePdfComponent();
        
    //     if (!pdfComponent) {
    //         return (
    //             <button 
    //                 disabled 
    //                 className="px-3 py-1.5 text-sm bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed inline-flex items-center"
    //             >
    //                 <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    //                 </svg>
    //                 กำลังโหลด...
    //             </button>
    //         );
    //     }
        
    //     const fileName = classroomInfo 
    //         ? `สรุปการเข้าเรียน_ม${classroomInfo.classLevel}_${classroomInfo.classRoom}` 
    //         : "สรุปการเข้าเรียนตามห้อง";
            
    //     return (
    //         <ExportPdfButton 
    //             PDFComponent={pdfComponent} 
    //             fileName={fileName}
    //         />
    //     );
    // };

    useEffect(() => {
        fetchClassroomInfo();
    }, [classroomId]);

    if (studentList.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-line p-8 text-center">
                <div className="flex justify-center mb-4 text-text-color-alt">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-text-color mb-1">ไม่พบข้อมูลการเข้าเรียน</h3>
                <p className="text-text-color-alt">ยังไม่มีข้อมูลการเข้าเรียนในห้องเรียนนี้</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-3 mb-4">
                {/* <ExportPdfButtonComponent /> */}
                <ExportExcelButton 
                    handelOnClickFunction={handleExportExcel} 
                    isLoading={exportLoading.excel}
                />
            </div>
            
            <div className="overflow-x-auto">
                <table 
                    ref={ref} 
                    className="w-full text-sm text-left text-gray-500 border border-line rounded-lg overflow-hidden"
                >
                    <thead className="text-xs text-text-color-alt uppercase tracking-wider bg-gray-50 border-b border-line">
                        <tr>
                            <th className="px-4 py-3" width="60">เลขที่</th>
                            <th className="px-4 py-3">รหัสนักเรียน</th>
                            <th className="px-4 py-3">ชื่อ-สกุล</th>
                            <th className="px-4 py-3 text-center">ขาดเรียน<br/>(ครั้ง)</th>
                            <th className="px-4 py-3 text-center">มาสาย<br/>(ครั้ง)</th>
                            <th className="px-4 py-3 text-center">ลา<br/>(ครั้ง)</th>
                            <th className="px-4 py-3 text-center">กิจกรรม<br/>(ครั้ง)</th>
                            <th className="px-4 py-3 text-center">เข้าเรียน<br/>(ครั้ง)</th>
                            <th className="px-4 py-3 text-center">คะแนน<br/>จิตพิสัย</th>
                            <th className="px-4 py-3 text-center">ร้อยละ<br/>การเข้าเรียน</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sliceStudentList.map((student, index) => (
                            <tr 
                                key={index} 
                                className={`hover:bg-gray-50 transition-colors duration-150 ${
                                    (isNaN(student.attendencePercent) || student.attendencePercent < 80) 
                                        ? 'bg-red-50' 
                                        : 'bg-white'
                                }`}
                            >
                                <td className="px-4 py-3 font-medium text-text-color">{student.stdNo}</td>
                                <td className="px-4 py-3 text-text-color-alt">{student.stdId}</td>
                                <td className="px-4 py-3 font-medium text-text-color">{`${student.fName} ${student.lName}`}</td>
                                
                                <td className={`px-4 py-3 text-center ${student.attendenceAbsentCount > 0 ? 'text-red-600 font-medium' : ''}`}>
                                    {student.attendenceAbsentCount}
                                </td>
                                
                                <td className={`px-4 py-3 text-center ${student.attendenceLateCount > 0 ? 'text-orange-500 font-medium' : ''}`}>
                                    {student.attendenceLateCount}
                                </td>
                                
                                <td className={`px-4 py-3 text-center ${student.attendenceLeaveCount > 0 ? 'text-purple-600 font-medium' : ''}`}>
                                    {student.attendenceLeaveCount}
                                </td>
                                
                                <td className={`px-4 py-3 text-center ${student.attendenceActivity > 0 ? 'text-blue-600 font-medium' : ''}`}>
                                    {student.attendenceActivity}
                                </td>
                                
                                <td className={`px-4 py-3 text-center ${student.attendenceCount > 0 ? 'text-green-600 font-medium' : ''}`}>
                                    {student.attendenceCount}
                                </td>
                                
                                <td className="px-4 py-3 text-center font-medium">
                                    {student.behaviourScore} 
                                    <span className="text-xs text-text-color-alt ml-1">คะแนน</span>
                                </td>
                                
                                <td className={`px-4 py-3 text-center font-medium ${
                                    isNaN(student.attendencePercent) || student.attendencePercent < 80 
                                        ? 'text-red-600' 
                                        : student.attendencePercent >= 90
                                            ? 'text-green-600'
                                            : 'text-yellow-600'
                                }`}>
                                    {isNaN(student.attendencePercent) ? '0' : student.attendencePercent}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td colSpan="10" className="px-4 py-3 text-text-color-alt">
                                <div className="text-xs">
                                    * นักเรียนที่มีสัดส่วนการเข้าเรียนต่ำกว่า 80% จะถูกไฮไลท์ด้วยสีแดง
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            {studentList.length > itemsPerPage && (
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="hidden sm:block">
                        <p className="text-sm text-text-color-alt">
                            แสดง <span className="font-medium text-text-color">{sliceStudentList.length}</span> จาก <span className="font-medium text-text-color">{studentList.length}</span> รายการ
                        </p>
                    </div>
                    
                    <div className="flex-1 flex justify-between sm:justify-end items-center gap-1">
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
            )}
            
            <div className="mt-6">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-text-color mb-3">คำอธิบายสถานะ:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                            <span className="text-sm">ขาดเรียน</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                            <span className="text-sm">มาสาย</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
                            <span className="text-sm">ลา</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                            <span className="text-sm">เข้าร่วมกิจกรรม</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                            <span className="text-sm">เข้าเรียน</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AttendenceBySummaryByClassroomList.propTypes = {
    studentList: PropTypes.array.isRequired,
    classroomId: PropTypes.string.isRequired
};
