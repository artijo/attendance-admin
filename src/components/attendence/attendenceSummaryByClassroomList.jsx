import { PropTypes } from 'prop-types';
import { useState } from 'react';
export const AttendenceBySummaryByClassroomList = ({studentList}) => {
    // console.log(studentList);
    const page = Math.ceil(studentList.length/10);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceStudentList = studentList.slice((seletedPage - 1) * 10, seletedPage * 10);
    return (
        <>
            {studentList.length === 0 && <div>ไม่พบข้อมูล</div>}
            {
                studentList.length > 0 && (
                    <div>
                        <div className="grid gap-2 md:grid-cols-1">
                            <div className="rounded-lg border border-gray-200">
                                <div className="overflow-x-auto rounded-t-lg">
                                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                        <thead className="ltr:text-left rtl:text-right">
                                            <tr>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">เลขที่</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รหัสนักศึกษา</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อ-สกุล</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ขาดเรียน(ครั้ง)</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">เข้าสาย(ครั้ง)</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ลา(ครั้ง)</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">กิจกรรม(ครั้ง)</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">เข้าเรียน(ครั้ง)</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ร้อยละการเข้าเรียนทั้งหมดรวมลา</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">สถานะ ไม่มีสิทธ์สอบ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 text-center">
                                            {
                                                sliceStudentList.map((student, index) => (
                                                    <tr key={index}>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.stdNo}</td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.stdId}</td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{`${student.fName} ${student.lName}`}</td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.attendenceAbsentCount}</td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.attendenceLateCount}</td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.attendenceLeaveCount}</td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.attendenceActivity}</td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.attendenceCount}</td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.attendencePercent}%</td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.canExam}</td>
                                                    </tr>
                                                ))
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
                        </div>
                        
                    </div>  
                )
            }
            
        </>
    )
}

AttendenceBySummaryByClassroomList.propTypes = {
    studentList: PropTypes.array.isRequired
}
