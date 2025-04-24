import { CalendarDetatils } from "../../components/calendar/calendardetailstudy.jsx";
import { useLocation, Link } from "react-router-dom";

const CalendarStudy = () => {
    const location = useLocation();
    const classroomInfo = location.state.classroomInfo;
    console.log(classroomInfo);

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">ปฏิทินการเรียน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-text-color font-heading">
                            ห้อง ม.{classroomInfo.classLevel}/{classroomInfo.classRoom}
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">
                            ปีการศึกษา {classroomInfo.term.academicYear+543} เทอม {classroomInfo.term.semester}
                        </p>
                    </div>
                </div>
                
                <Link 
                    to="/calendar" 
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้าห้องเรียน
                </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-text-color font-heading flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            ตารางปฏิทินวันเรียน
                        </h3>
                        
                        <div className="flex gap-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="w-2 h-2 rounded-full bg-green-600 mr-1.5"></span>
                                วันเรียน
                            </div>
                        </div>
                    </div>
                    
                    {/* <CalendarDetatils classroomId={classroomInfo} /> */}
                </div>
            </div>
        </div>
    );
};

export default CalendarStudy;