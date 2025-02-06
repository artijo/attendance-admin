import {PropTypes} from "prop-types";
import { useEffect, useRef, useState } from "react";
import Noanything from "../../pages/Noanything";
import { AttendanceSummaryByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
export const AttendanceByDayDetailList = ({studentList}) => {
    const ref = useRef(null);
    const location = useLocation();
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

    useEffect(()=> {
        setuptotalstatus();
    },[studentList]);

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
            const tableList = ref.current;
            // console.log(tableList);
            AttendanceSummaryByDay(tableList);
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

    useEffect(() => {
        fetchClassroomInfo();
    },[])

    return (
        <>
            {
                studentList.length > 0 &&
                <ul className="flex flex-row-reverse">
                    <li>
                        <ExportExcelButton handelOnClickFunction={handaleExportExcel}/>
                    </li>
                    <li>
                        <Link to="/att/byday/pdf" state={
                            { 
                                studentList: studentList , 
                                date: location.state.date,
                                total: totalStatus,
                                classroomInfo : classroomInfo
                            }
                        }>
                            <ExportPdfButton/>
                        </Link>
                        
                    </li>
                     
                </ul>
            }
            {
                studentList.length === 0 && (
                    <Noanything title={"ไม่มีการเรียนในวันนี้"} description={"ไม่มีการเรียนในวันนี้หรือยังไม่สร้างปฎิทินการเรียน"}/>
                )
            }
            {studentList.length > 0 && <div className="grid gap-2 md:grid-cols-1">
                <div className="shadow-md border border-gray-200">
                    <div className="overflow-x-auto">
                        <table ref={ref} className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr className="border">
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={3}>คาบที่</td>
                                    {
                                        Array.from({ length: studentList[0].attendance.length }, (_, index) => (
                                            <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" key={index}>{index + 1}</td>
                                        ))
                                    }
                                </tr>
                                <tr className="border">
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={3}>รหัสวิชา</td>
                                    {
                                        studentList[0].attendance.map((attendance, index) => (
                                            <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" key={index}>{attendance.subjectCode}</td>
                                        ))
                                    }
                                </tr>
                                <tr className="border">
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900">เลขที่</td>
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900">รหัสนักศึกษา</td>
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อ-นามสกุล</td>
                                    {
                                        studentList[0].attendance.map((attendance, index) => (
                                            <td className=" border whitespace-nowrap px-4 py-2 font-bold text-gray-900" key={index}>{attendance.subjectName}</td>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody className=" divide-y divide-gray-200">
                                {
                                    studentList.map((student, index) => (
                                        <tr key={index} className="border">
                                            <td className="border whitespace-nowrap px-4 py-2 text-gray-700">{student.stdNo}</td>      
                                            <td className="border whitespace-nowrap px-4 py-2 text-gray-700">{student.stdId}</td>      
                                            <td className="border whitespace-nowrap px-4 py-2 text-gray-700">{student.fName} {student.lName}</td>      
                                            {
                                                student.attendance.map((attendance, index) => (
                                                    <td className=" border whitespace-nowrap px-4 py-2 text-gray-700" key={index}>{attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : '-'}</td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot className=" divide-y divide-gray-200">
                                <tr className="border">
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={3}>มาเรียน</td>
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={studentList[0].attendance.length}>{totalStatus.present}</td>
                                </tr>
                                <tr className="border">
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={3}>ขาดเรียน</td>
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900"  colSpan={studentList[0].attendance.length}>{totalStatus.absent}</td>
                                </tr>
                                <tr className="border">
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={3}>ลา</td>
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900"  colSpan={studentList[0].attendance.length}>{totalStatus.leave}</td>
                                </tr>
                                <tr className="border">
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={3}>กิจกรรม</td>
                                    <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900"  colSpan={studentList[0].attendance.length}>{totalStatus.activity}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>}
        </>
       
    );
};

AttendanceByDayDetailList.propTypes = {
    studentList: PropTypes.array.isRequired
};
