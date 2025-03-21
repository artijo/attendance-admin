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
    // responed from server 
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [success,setSuccess] = useState(false);
    
    const sentFormData =  async(data) => {
        try {
            const response = await axios.post(`${HOSTNAME}/a/academicYearTerm`, data);
            if (response.status === 200) {
                setMsg(response.data.message);
                setSuccess(true);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไข");
            setError(true);
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

    return( 
        <div>
            <h1 className="font-bold text-center mb-4">ฟอร์มสร้างเทอมและการศึกษาใหม่</h1>
            <div className="mb-2"  onClick={() => {
                setError(false)
                setSuccess(false)
                setMsg("")
            }}>
                {
                    error &&  <ErrorAlert title="เกิดข้อผิดพลาด" message={msg}/>
                }
                {
                    success && <AlertSuccess title="สำเร็จ" message={msg}/>
                }
            </div>
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
                <button 
                        type="submit"
                        className="sm:col-span-2 sm:w-fit sm:ml-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        เพิ่มเทอม
                    </button>
            </form>
        </div>
    );
};


export default CreatetermForm;