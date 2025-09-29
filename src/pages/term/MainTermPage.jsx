import { use, useState } from "react";
import { Termlistable } from "../../components/term/termlistable";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success";

function MainTermPage() {
    const location = useLocation();
    const title = useState(location.state?.title);
    const [ isSuccesful, setIsSuccesful ] = useState(
        location.state?.status === true ? true : false
    );
    const [msg, setMsg] = useState(
        location.state?.msg !== undefined ? location.state.msg : ""   
    );
    // console.log(msg);
    const dismissAlerts = () => {
        setIsSuccesful(false);
        // setSuccess(false);
        setMsg("");
    };
    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">จัดการเทอมและปีการศึกษา</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>

            <div className="mb-4" onClick={dismissAlerts}>
                {/* {error && <ErrorAlert title="เกิดข้อผิดพลาด" message={msg}/>} */}
                {isSuccesful && <AlertSuccess title={title} message={msg}/>}
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
                            รายการเทอมในระบบ
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">จัดการเทอมการศึกษาและกำหนดช่วงเวลา</p>
                    </div>
                </div>
                
                <Link 
                    to="/terms/create" 
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    เพิ่มปีการศึกษาและเทอม
                </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="p-6">
                    <div className="mb-4">
                        <div className="bg-gray-50 border border-line rounded-lg p-4">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-text-color font-heading">คำแนะนำ</h3>
                                    <p className="text-sm text-text-color-alt font-body mt-1">
                                        เทอมการศึกษาจะใช้เพื่อกำหนดช่วงเวลาของปีการศึกษาและเทอม สำหรับกำหนดการเรียนการสอนและกิจกรรมต่างๆ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Termlistable />
                </div>
            </div>
        </div>
    );
};

export default MainTermPage;