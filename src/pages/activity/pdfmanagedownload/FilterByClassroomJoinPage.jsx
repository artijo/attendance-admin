import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function FilterByClassroomJoinPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { classrooms, activityId, activity } = location.state;
    const [processingClass, setProcessingClass] = useState(null);

    const handleViewPDF = (classroom) => {
        setProcessingClass(classroom.classId);
        setTimeout(() => {
            navigate("/activity/participate/filterbyclassroomjoin/pdfpage", {
                state: {
                    activityId: activityId, 
                    className: classroom.className, 
                    activity: activity,
                    filterRoom: classroom.className.split('ม.')[1]
                }
            });
        }, 500);
    };

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
                    รายงาน PDF สรุปการเข้าร่วมกิจกรรม
                </h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-text-color font-heading">
                            {activity.actName}
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">รายงานสรุปจำนวนการเข้าร่วมแบ่งตามห้องเรียน</p>
                    </div>
                </div>
                
                <Link 
                    to={`/activity/${activityId}/participate`}
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้ารายการ
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="p-6">
                    <div className="mb-6">
                        <div className="bg-gray-50 border border-line rounded-lg p-4">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-text-color font-heading">คำแนะนำ</h3>
                                    <p className="text-sm text-text-color-alt font-body mt-1">
                                        เลือกห้องเรียนที่ต้องการเพื่อดูรายงาน PDF สรุปจำนวนการเข้าร่วมกิจกรรมของนักเรียนในห้องนั้นๆ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {classrooms.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-line">
                                        <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ห้องเรียน</th>
                                        <th className="px-4 py-3.5 text-center text-xs font-medium text-text-color-alt tracking-wider font-heading" width="200">รายงาน</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {classrooms.map((classroom) => (
                                        <tr key={classroom.classId} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-4 py-4 font-medium text-text-color">
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full h-8 w-8 mr-3">
                                                        {classroom.className.split("ม.")[1].split("/")[0]}
                                                    </span>
                                                    <span>{classroom.className}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => handleViewPDF(classroom)}  
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                    disabled={processingClass === classroom.classId}
                                                >
                                                    {processingClass === classroom.classId ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            กำลังโหลด PDF...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3.5L18.5 9H14a1 1 0 01-1-1z" />
                                                            </svg>
                                                            เอกสาร PDF
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลห้องเรียน</h2>
                            <p className="text-text-color-alt font-body">ไม่มีห้องเรียนที่ต้องแสดงสำหรับกิจกรรมนี้</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterByClassroomJoinPage;
