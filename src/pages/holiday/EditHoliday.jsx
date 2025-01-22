import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { HOSTNAME } from '../../config';
import { formatDateTimeISOToDate } from "../../helper.js";
import { DateTime } from "luxon";
import AlertSuccess from '../../components/alert/success.jsx';
import Loading from '../../components/alert/loading.jsx';
import ErrorAlert from '../../components/alert/error.jsx';
function EditHoliday() {
    const params = useParams();

    const [holidayName, setHolidayName] = useState("");
    const [dateStartDateEndDate, setDateStartDateEndDate] = useState("");
    const [holidayType, setHolidayType] = useState("RATCHAKHAN");

    const onSubmitEdit = async () => {
        try {
            setAlertShow([false, true, false]);
            const response = await axios.put(`${HOSTNAME}/a/holiday/${params.id}`, {
                holidayName: holidayName,
                startHolidayDate: DateTime.fromISO(dateStartDateEndDate+"T00:00:00Z", { zone: "UTC" }),
                type: holidayType,
            });
            if (response.status === 200) {
                setAlertShow([true, false, false]);
                setTimeout(() => {
                    setAlertShow([false,false,false]);
                    window.location.href = "/holiday";
                }, 3000);
            }else{
                setAlertShow([false, false, true]);
                setTimeout(() => {
                    setAlertShow([false,false,false]);
                    window.location.href = "/holiday";
                }, 3000);
            }
            
        } catch (error) {
            console.error(error);
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
    const [alertShow, setAlertShow] = useState([false, false, false]); // [success, loading, error]
    return (
        <div className='container mx-auto relative' >
            <div className={`bg-black w-full h-screen fixed top-0 left-0 opacity-50 z-10 ${alertShow.some((value) => value === true) ? "" : "hidden"}`}></div>
            <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20" id="AlertBox">
                <div className={alertShow[0] ? "block" : "hidden"}>
                    <AlertSuccess title="สําเร็จ" message="แก้ไขวันหยุดในเทอมนั้นเรียบร้อย"/>
                </div>
                <div className={alertShow[1] ? "block" : "hidden"}>
                    <Loading title="กำลังแก้ไขวันหยุด" message="กรุณารอสักครู่"/>
                </div>
                <div className={alertShow[2] ? "block" : "hidden"}>
                    <ErrorAlert title="เกิดข้อผิดพลาด" message="เกิดข้อผิดพลาดในการแก้ไขการวันหยุด"/>
                </div>
            </div>
            <h1 className="mb-4 font-medium">ฟอร์มแก้ไขวันหยุด</h1>
            <form
                className="border p-4 rounded-lg bg-white grid grid-cols-1 gap-2"
                onSubmit={() => onSubmitEdit()}
            >
                <div>
                    <label className="block text-xs font-medium text-gray-700">
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
                    <label className="block text-xs font-medium text-gray-700">
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
                    <label className="block text-xs font-medium text-gray-700">
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
                    className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                    แก้ไขวันหยุด
                </button>
            </form>
        </div>
    );
};

export default EditHoliday;