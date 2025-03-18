import { Link, useLocation } from "react-router-dom";
function FilterByClassroomJoinPage() {
    const location = useLocation();
    const { classrooms, activityId, activity } = location.state;
    return (
        <div>
            <div className="w-full h-fit">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    ดาวน์โหลดเอกสารสรุปจำนวนการเข้ากิจกรรม {activity.actName} ของนักเรียนแบ่งตามห้องเรียนที่ความเข้าร่วม
                </h1>
                {classrooms.length > 0 && (
                    <>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">
                                            ห้องเรียน
                                        </th>
                                        <th className="px-6 py-3">
                                            จัดการ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classrooms.map((classroom) => (
                                        
                                        <tr key={classroom.classId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4">
                                                {classroom.className}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link 
                                                    to="/activity/participate/filterbyclassroomjoin/pdfpage"
                                                    state={{activityId:activityId, className:classroom.className, activity: activity, filterRoom:classroom.className.split('ม.')[1] }} 
                                                >
                                                    <button  className="px-4 py-1 text-xs bg-rose-600 text-white cursor-pointer rounded-full hover:bg-rose-500">
                                                        เอกสาร PDF
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {classrooms.length == 0 && (
                    <>
                        <div>
                            <span className="flex flex-col items-center justify-center gap-2 py-3 border rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                            </svg>
                            ไม่พบห้องเรียนที่ต้องแสดง 
                            </span>
                        </div>
                    </>
                )}
                
            </div>
        </div>
    );
};

export default FilterByClassroomJoinPage;
