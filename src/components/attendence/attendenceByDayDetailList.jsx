import {PropTypes} from "prop-types";
import { useEffect, useState } from "react";
export const AttendanceByDayDetailList = ({studentList}) => {
    const [totalStatus, setTotalStatus] = useState({
        present: 0,
        late: 0,
        absent: 0,
        activity: 0,
        leave: 0
    });

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
    },[])

    const formatAttStatus = (status) => {
        
        switch (status) {
            case 'present': {
                return 'เข้าเรียน';
            }
            case 'absent': {
                return 'ไม่เข้าเรียน';
            }
            case 'late': {
                return 'เข้าเรียนสักหน่อย';
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
    return (
        <div className="grid gap-2 md:grid-cols-1">
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
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
                                <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900">{totalStatus.present}</td>
                            </tr>
                            <tr className="border">
                                <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={3}>ขาดเรียน</td>
                                <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900">{totalStatus.absent}</td>
                            </tr>
                            <tr className="border">
                                <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={3}>ลา</td>
                                <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900">{totalStatus.leave}</td>
                            </tr>
                            <tr className="border">
                                <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900" colSpan={3}>กิจกรรม</td>
                                <td className="border whitespace-nowrap px-4 py-2 font-bold text-gray-900">{totalStatus.activity}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

AttendanceByDayDetailList.propTypes = {
    studentList: PropTypes.array.isRequired
};
