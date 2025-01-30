import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success";
import ErrorAlert from "../../components/alert/error";
function EdittermForm(){
    const location = useLocation();
    const [termId, setTermId] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [semester, setSemester] = useState("");
    const [termStart, setTermStart] = useState("");
    const [termEnd, setTermEnd] = useState("");
    // responed from server 
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [success,setSuccess] = useState(false);

    function spiltUtcTime(value){
        const date = value.split("T")[0];
        return date;
    };

    const fecthData = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/academicterms/${location.state.termId}`);
            if(response.status === 200){
                setTermId(response.data.termId)
                setAcademicYear(response.data.academicYear + 543);
                setSemester(response.data.semester);
                setTermStart(spiltUtcTime(response.data.termStart));
                setTermEnd(spiltUtcTime(response.data.termEnd));
            };
        }catch(error){
            console.error(error);
        };
    };

    const sentFormData = async (data) => {
        try{
            const response = await axios.put(`${HOSTNAME}/a/academicterms`,data);
            if (response.status === 200) {
                let countdownTime = 1000;
                setMsg(response.data.message);
                setSuccess(true);
                setTimeout(() => {window.location.href = "/terms"}, countdownTime);
            } else {
                throw new Error(response.data.message);
            }
        }catch(error){
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาด");
            setError(true);
            
        };
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const data = {
            termId : termId,
            academicYear : academicYear,
            semester : semester,
            termStart : termStart,
            termEnd : termEnd
        };
        sentFormData(data);
    };

    useEffect(() => {
        fecthData();
    },[])
    return (
        <div className="container mx-auto">
            
            <h1 className="font-medium mb-4">ฟอร์มแก้ไขเทอมและการศึกษา</h1>
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
                <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                    แก้ไขเทอม
                </button>
            </form>
        </div>  
    );
};

export default EdittermForm;