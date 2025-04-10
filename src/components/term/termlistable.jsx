import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { DateTime } from "luxon";
import { formatDateToThai } from "../../helper";
import { Link } from "react-router-dom";
import ErrorAlert from "../alert/error";
import AlertSuccess from "../alert/success";

export const Termlistable = () => {
    const [academicYearTerm, setAcademicYearTerm] = useState([]);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [termToDelete, setTermToDelete] = useState(null);
    
    function datetimeFormat(value) {
        const datetime = DateTime.fromISO(value).setZone('Asia/Bangkok');
        let datetimeString = formatDateToThai(datetime.toFormat('yyyy-MM-dd'));
        return datetimeString;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            if(response.status === 200){
                setAcademicYearTerm(response.data);
            }
        } catch (error) {
            setMsg("ไม่สามารถโหลดข้อมูลเทอมการศึกษาได้");
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const initiateDelete = (term) => {
        setTermToDelete(term);
        setShowDeleteConfirm(true);
    };

    const handleOnDelete = async () => {
        if (!termToDelete) return;
        
        try {
            setLoading(true);
            const response = await axios.delete(`${HOSTNAME}/a/academicterms/${termToDelete.termId}`);
            if(response.status === 200){
                await fetchData();
                setMsg(response.data.message || "ลบข้อมูลเรียบร้อยแล้ว");
                setSuccess(true);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการลบ");
            setError(true);
        } finally {
            setShowDeleteConfirm(false);
            setTermToDelete(null);
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setTermToDelete(null);
    };

    const dismissAlerts = () => {
        setError(false);
        setSuccess(false);
        setMsg("");
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div onClick={dismissAlerts}>
            {error && <ErrorAlert title="เกิดข้อผิดพลาด" message={msg} />}
            {success && <AlertSuccess title="ดำเนินการสำเร็จ" message={msg} />}
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : academicYearTerm.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลปีการศึกษา</h2>
                    <p className="text-text-color-alt font-body">กรุณาเพิ่มข้อมูลปีการศึกษาและเทอม</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-line">
                                <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ปีการศึกษา</th>
                                <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">เทอม</th>
                                <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">วันที่เริ่ม</th>
                                <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">วันที่สิ้นสุด</th>
                                <th className="px-4 py-3.5 text-center text-xs font-medium text-text-color-alt tracking-wider font-heading">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {academicYearTerm.map((term) => (
                                <tr key={term.termId} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-4 py-4 font-body text-text-color">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-800">
                                            {term.academicYear ? term.academicYear + 543 : '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 font-body text-text-color">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-50 text-green-700">
                                            {term.semester || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 font-body text-text-color">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {term.termStart ? datetimeFormat(term.termStart) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-body text-text-color">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {term.termEnd ? datetimeFormat(term.termEnd) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="inline-flex overflow-hidden rounded-lg border border-line bg-white shadow-sm">
                                            <Link 
                                                to="/terms/edit" 
                                                state={{ termId: term.termId }}
                                                className="inline-block p-2.5 text-primary hover:bg-gray-50 focus:relative transition-colors duration-300"
                                                title="แก้ไขข้อมูล"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </Link>
                                            
                                            <button
                                                className="inline-block p-2.5 text-red-600 hover:bg-gray-50 focus:relative transition-colors duration-300"
                                                onClick={() => initiateDelete(term)}
                                                title="ลบข้อมูล"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Delete confirmation modal */}
            {showDeleteConfirm && termToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-line">
                        <div className="text-center mb-5">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
                                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-text-color font-heading mb-2">ยืนยันการลบ</h3>
                            <p className="text-text-color-alt font-body">
                                คุณต้องการลบข้อมูลปีการศึกษา {termToDelete.academicYear + 543} เทอม {termToDelete.semester} ใช่หรือไม่?
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
                                onClick={handleOnDelete}
                                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300"
                            >
                                {loading ? (
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