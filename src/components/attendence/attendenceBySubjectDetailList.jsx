import { useState } from "react";
import { formatDateToThai } from "../../helper";
import PropTypes from "prop-types";
import Noanything from "../../pages/Noanything";
export const AttendenceBySubjectDetailList = ({studentList}) => {
    const page = Math.ceil(studentList.length/5);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceStudentList = studentList.slice((seletedPage - 1) * 5, seletedPage * 5);

    const formatAttStatus = (status) => {
        switch (status) {
            case 'present':
                return 'เข้าเรียน';
            case 'absent':
                return 'ไม่เข้าเรียน';
            case 'late':
                return 'มาสาย';
            case 'activity':
                return 'เข้าเรียนกิจกรรม';
            case 'leave':
                return 'ลา';
            default:
                return status;
        }
    };

    return (
        <>
            {
                studentList.length === 0 &&
                <Noanything title="ไม่พบข้อมูล" description="ไม่มีปฎิทินการเรียน" />
            }
            {studentList.length > 0 && (
                studentList[0].attendance.length > 0 &&
                <div className="grid gap-2 md:grid-cols-1">
                <div className="rounded-lg border border-gray-200">
                    <div className="overflow-x-auto rounded-t-lg">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900" rowSpan={2}>เลขที่</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900" rowSpan={2}>รหัสนักเรียน</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900" rowSpan={2}>ชื่อ-นามสกุล</th>
                                    {
                                        studentList.length > 0 && 
                                        (
                                            studentList[0].attendance.map((attendance, index) => (
                                                <th key={index} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    {
                                                        formatDateToThai(attendance.studingTimeDate.split('T')[0])} <br/>{attendance.studingTimeDate.split('T')[1].split('.')[0].split(':')[0]}:{attendance.studingTimeDate.split('T')[1].split('.')[0].split(':')[1]} <br/> คาบที่{index+1}
                                                </th>
                                            ))
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {
                                    sliceStudentList.length > 0 ? 
                                        (
                                            sliceStudentList.map((student, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.stdNo}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.stdId}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{`${student.fName} ${student.lName}`}</td>
                                                    {
                                                        student.attendance.map((attendance, index) => (
                                                            <td key={index} className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : '-'}</td>
                                                        ))
                                                    }
                                                </tr>
                                            ))
                                        ) : 
                                        <tr>
                                            <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700" colSpan={4}>ไม่มีข้อมูล</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    {Array.from({ length: page }, (_, i) => (
                        <button
                            key={i+1}
                            className={`px-4 py-2 ${seletedPage === i+1 ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setSeletedPage(i+1)}
                            type="button"
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>)}
        </>
        
    )
};
AttendenceBySubjectDetailList.propTypes = {
    studentList: PropTypes.array.isRequired
}