import { Link, useLocation } from "react-router-dom";
function FilterByClassroomJoinPage() {
    const location = useLocation();
    const { classrooms, activityId, activity } = location.state;
    return (
        <div>
            <div className="w-full h-fit">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    ดาวน์โหลดเอกสารการเข้าร่วมกิจกรรม {activity.actName} โดยแบ่งตามห้องเรียนที่เข้าร่วม
                </h1>

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
            </div>
        </div>
    );
};

export default FilterByClassroomJoinPage;
