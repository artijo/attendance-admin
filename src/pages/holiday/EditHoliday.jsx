import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { HOSTNAME } from '../../config';
import { formatDateTimeISOToDate } from "../../helper.js";
import { DateTime } from "luxon";
import AlertSuccess from '../../components/alert/success.jsx';
import ErrorAlert from '../../components/alert/error.jsx';
function EditHoliday() {
    const params = useParams();
    const [holidayName, setHolidayName] = useState("");
    const [dateStartDateEndDate, setDateStartDateEndDate] = useState("");
    const [holidayType, setHolidayType] = useState("RATCHAKHAN");
    // responed from server 
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [success,setSuccess] = useState(false);

    const onSubmitEdit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`${HOSTNAME}/a/holiday/${params.id}`, {
                holidayName: holidayName,
                startHolidayDate: dateStartDateEndDate,
                type: holidayType,
            });
            if (response.status === 200) {
                setMsg(response.data.message);
                setSuccess(true);
            }else{
                throw new Error(response.data.message);
            };
        } catch (error) {
            console.error(error);
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไขวันหยุด");
            setError(true);
        }
    };

    const feachData = async () => {
        try {
        
            const response = await axios.get(`${HOSTNAME}/a/holiday/one/${params.id}`);
            if (response.status === 200) {
                
                setHolidayName(response.data.holidayName || "");
                setDateStartDateEndDate(formatDateTimeISOToDate(response.data.startHolidayDate) || "");
                setHolidayType(response.data.type || "RATCHAKHAN");
            };
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        feachData();
    }, []);
    
    return (
        <div>
            <h1 className="text-center font-bold">ฟอร์มแก้ไขวันหยุด</h1>
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
            <form
                className="border p-4 rounded-2xl bg-white grid grid-cols-1 gap-2"
                onSubmit={(e) => onSubmitEdit(e)}
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        ชื่อวันหยุด
                    </label>
                    <input
                        className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                        type="text"
                        name="holidayName"
                        value={holidayName}
                        onChange={(e) => setHolidayName(e.target.value)}
                        required={true}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        วันและเวลาที่เริ่มหยุด
                    </label>
                    <input
                        className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                        type="date"
                        name="dateStartDateEndDate"
                        value={dateStartDateEndDate}
                        onChange={(e) => setDateStartDateEndDate(e.target.value)}
                        required={true}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        ประเภทวันหยุด
                    </label>
                    <select name="holidayType" 
                        className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm border"
                        value={holidayType}
                        onChange={(e) => setHolidayType(e.target.value)}
                    >
                        <option value="RATCHAKHAN" defaultValue={holidayType === "RATCHAKHAN" ? true : false}>วันหยุดราชกาล</option>
                        <option value="SCHOOL" defaultValue={holidayType === "SCHOOL" ? true : false}>วันหยุดโรงเรียน</option>
                    </select>
                </div>
                

                <button
                    type="submit"   
                    className="md:w-fit md:ml-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    บันทึกการแก้ไข
                </button>
            </form>
        </div>
    );
};

export default EditHoliday;