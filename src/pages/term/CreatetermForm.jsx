import axios from "axios";
import { useState } from "react";
import { HOSTNAME } from "../../config";
import AlertSuccess from "../../components/alert/success";
import Loading from "../../components/alert/loading";
import ErrorAlert from "../../components/alert/error";

function CreatetermForm() {
    const [academicYear, setAcademicYear] = useState("");
    const [semester, setSemester] = useState("");
    const [termStart, setTermStart] = useState("");
    const [termEnd, setTermEnd] = useState("");
    
    
    const sentFormData =  async(data) => {
        try{
            const response = await axios.post(`${HOSTNAME}/a/academicYearTerm`, data);
            setAlertShow([false, true, false]);
            if(response.status === 200){
                setAlertShow([true, false, false]);
                setTimeout(() => {
                    setAlertShow([false,false,false]);
                    window.location.href = "/terms";
                }, 3000);
            }else{
                setAlertShow([false, false, true]);
                setTimeout(() => {
                    setAlertShow([false,false,false]);
                    window.location.href = "/terms";
                }, 3000);
            }
        }catch(error){
            console.error(error)
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const data = {
            academicYear : academicYear,
            semester : semester,
            termStart : termStart,
            termEnd : termEnd
        }
        sentFormData(data)
    }
    const [alertShow, setAlertShow] = useState([false, false, false]); // [success, loading, error]
    return( 
        <div className="container mx-auto relative">
            <div className={`bg-black w-full h-screen fixed top-0 left-0 opacity-50 z-10 ${alertShow.some((value) => value === true) ? "" : "hidden"}`}></div>
            <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" id="AlertBox">
                <div className={alertShow[0] ? "block" : "hidden"}>
                    <AlertSuccess title="สําเร็จ" message="เพิ่มเทอมเรียบร้อย"/>
                </div>
                <div className={alertShow[1] ? "block" : "hidden"}>
                    <Loading title="กำลังสร้างเทอม" message="กรุณารอสักครู่"/>
                </div>
                <div className={alertShow[2] ? "block" : "hidden"}>
                    <ErrorAlert title="เกิดข้อผิดพลาด" message="เกิดข้อผิดพลาดในการสร้างเทอม"/>
                </div>
            </div>
            <h1 className="font-medium mb-4">ฟอร์มสร้างเทอมและการศึกษาใหม่</h1>
            <form onSubmit={(e) => handleOnSubmit(e)} className="border p-4 rounded-lg mb-4 bg-white grid grid-cols-1 gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-700">
                            ปีการศึกษา
                        </label>
                        <input 
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                            type="text" name="academicYear" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} required={true}/>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">
                            เทอม
                        </label>
                        <input 
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                            type="text" name="semester" value={semester} onChange={(e) => setSemester(e.target.value)} required={true}/>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">
                            วันเริ่มต้นเทอม(เดือน-วัน-ปี)
                        </label>
                        <input 
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                            type="date" name="termStart" value={termStart} onChange={(e) => setTermStart(e.target.value)} required={true}/>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">
                            วันสิ้นสุดเทอม(เดือน-วัน-ปี)
                        </label>
                        <input 
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                            type="date" name="termEnd" value={termEnd} onChange={(e) => setTermEnd(e.target.value)} min={termStart}/>
                    </div>
                </div>
                <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                    เพิ่มเทอม
                </button>
            </form>
        </div>
    );
};


export default CreatetermForm;