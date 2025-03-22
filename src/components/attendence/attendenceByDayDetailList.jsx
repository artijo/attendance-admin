import {PropTypes} from "prop-types";
import { useEffect, useRef, useState } from "react";
import Noanything from "../../pages/Noanything";
import { AttendanceSummaryByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";
import {useLocation } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { dateTimeFormat, formatDateToThai, formatDayOfWeeks} from "../../helper";
import ByDay from "./exportPdf/byday.jsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DateTime } from "luxon";
export const AttendanceByDayDetailList = ({studentList}) => {
    const ref = useRef(null);
    const location = useLocation();
    const date = location.state.date;
    const [totalStatus, setTotalStatus] = useState(null);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const setuptotalstatus = () => {
        const updatedTotalStatus = {
            present: 0,
            late: 0,
            absent: 0,
            activity: 0,
            leave: 0
        };
        studentList.forEach((student) => {
            student.attendance.forEach((attendance) => {
                if(attendance.attStatus !== null){
                    if (attendance.attStatus.toLowerCase() === 'present') {
                        updatedTotalStatus.present++;
                    } else if (attendance.attStatus.toLowerCase() === 'late') {
                        updatedTotalStatus.late++;
                    } else if (attendance.attStatus.toLowerCase() === 'absent') {
                        updatedTotalStatus.absent++;
                    } else if (attendance.attStatus.toLowerCase() === 'activity') {
                        updatedTotalStatus.activity++;
                    } else if (attendance.attStatus.toLowerCase() === 'leave') {
                        updatedTotalStatus.leave++;
                    }
                };
            });
        })
        setTotalStatus(updatedTotalStatus);
    }

   

    const formatAttStatus = (status) => {
        
        switch (status) {
            case 'present': {
                return 'เข้าเรียน';
            }
            case 'absent': {
                return 'ไม่เข้าเรียน';
            }
            case 'late': {
                return 'มาสาย';
            }
            case 'activity': {
                
                return 'เข้าเรียนกิจกรรม';
            }
            case 'leave': {
        
                return 'ลา';
            }
            default:
                return status;
        }
    };

    const handaleExportExcel = () => {
        if(ref.current) {
            const dateformat = DateTime.fromISO(`${date}T00:00:00`).setZone('Asia/Bangkok');

            const tableList = ref.current;
            AttendanceSummaryByDay(tableList, `สรุปการเข้าเรียนตามรายวันห้องม.${classroomInfo.classLevel}/${classroomInfo.classRoom} วัน ${formatDayOfWeeks(dateformat.weekday)} วันที่ ${formatDateToThai(dateformat.toString())}`);
        }
    }

    const fetchClassroomInfo = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/classroom/${location.state.classroomId}`)
            if(response.status === 200) {
                setClassroomInfo(response.data);
            }
        }catch(error) {
            console.log(error)
        }
    }
    const handlePdfComponent = () => {
        // console.log("FROM pad compontent: "  + String(classroomInfo));
        if(studentList.length > 0 && totalStatus != null && classroomInfo != null ){
            return <ByDay studentList={studentList} totalStatus={totalStatus} date={date} classroomInfo={classroomInfo}/>
        }
        return null
    }

    const ExportPdfButtonKK = () => {
         const handelExportPdfCheck = handlePdfComponent();
            if(handelExportPdfCheck === null) {
                return <p>Loading....</p>
            }else{
                return (
                <ExportPdfButton PDFComponent={handelExportPdfCheck} fileName={`สรุปการเข้าเรียนตามรายวันที่ ${formatDateToThai(date)}  ชั้นมัธยม ${classroomInfo.classLevel} ห้อง ${classroomInfo.classRoom}`}/>
            );
        }
    }
  
    useEffect(() => {
        fetchClassroomInfo();
        
    },[])

    useEffect(()=> {
        setuptotalstatus();
    },[studentList]);

    return (
        <>
            {
                studentList.length > 0 && totalStatus != null && classroomInfo != null && (
                    <ul className="flex flex-row-reverse">
                        <li>
                            <ExportExcelButton handelOnClickFunction={handaleExportExcel}/>
                        </li>
                        <li>
                            <ExportPdfButtonKK/>
                        </li>
                        
                    </ul>
                )
                
                
            }
            {
                studentList.length === 0 && (
                    <Noanything title={"ไม่มีการเรียนในวันนี้"} description={"ไม่มีการเรียนในวันนี้หรือยังไม่สร้างปฎิทินการเรียน"}/>
                )
            }
            {studentList.length > 0 && 
                <div>
                    <div>
                        <div className="relative border overflow-x-auto shadow-md sm:rounded-2xl">
                            <table ref={ref} className="w-full border-collapse text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4 border-r border-b" colSpan={3}>คาบที่</th>
                                        {
                                            studentList[0].attendance.map((attendance, index) => (
                                                <th className="px-6 py-4 border-r border-b" key={index}>{index + 1}({dateTimeFormat(attendance.studingTimeDate)})</th>
                                            ))
                                        }
                                    </tr>
                                    <tr >
                                        <th className="px-6 py-4 border-r border-b" colSpan={3}>รหัสวิชา</th>
                                        {
                                            studentList[0].attendance.map((attendance, index) => (
                                                <th className="px-6 py-4 border-r border-b" key={index}>{attendance.subjectCode}</th>
                                            ))
                                        }
                                    </tr>
                                    <tr >
                                        <th className="px-6 py-4 border-r border-b">เลขที่</th>
                                        <th className="px-6 py-4 border-r border-b">รหัสนักศึกษา</th>
                                        <th className="px-6 py-4 border-r border-b">ชื่อ-นามสกุล</th>
                                        {
                                            studentList[0].attendance.map((attendance, index) => (
                                                <th className="px-6 py-4 border-r border-b" key={index}>{attendance.subjectName}</th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        studentList.map((student, index) => (
                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                                <td className="px-6 py-4 border-r border-b">{student.stdNo}</td>
                                                <td className="px-6 py-4 border-r border-b">{student.stdId}</td>
                                                <td className="px-6 py-4 border-r border-b">{student.fName} {student.lName}</td>
                                                {
                                                    student.attendance.map((attendance, index) => (
                                                        <td className="px-6 py-4 border-r border-b" key={index}>{attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : '-'}</td>
                                                    ))
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="px-6 py-4 border-r border-b" colSpan={3}>มาเรียน</td>
                                        <td className="px-6 py-4 border-r border-b" colSpan={studentList[0].attendance.length}>{totalStatus.present}</td>
                                    </tr>
                                    <tr >
                                        <td className="px-6 py-4 border-r border-b" colSpan={3}>ขาดเรียน</td>
                                        <td className="px-6 py-4 border-r border-b" colSpan={studentList[0].attendance.length}>{totalStatus.absent}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 border-r border-b" colSpan={3}>ลา</td>
                                        <td className="px-6 py-4 border-r border-b" colSpan={studentList[0].attendance.length}>{totalStatus.leave}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 border-r border-b" colSpan={3}>กิจกรรม</td>
                                        <td className="px-6 py-4 border-r border-b" colSpan={studentList[0].attendance.length}>{totalStatus.activity}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            }
        </> 
    );
};

AttendanceByDayDetailList.propTypes = {
    studentList: PropTypes.array.isRequired
};
