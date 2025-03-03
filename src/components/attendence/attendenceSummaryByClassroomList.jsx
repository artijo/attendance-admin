import { PropTypes } from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { AttendanceSummaryByDay } from '../../exportExcel';
import ExportExcelButton from '../exportExcelButton';
import ExportPdfButton from '../exportPdfButton';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { HOSTNAME } from '../../config';
export const AttendenceBySummaryByClassroomList = ({studentList,classroomId}) => {
    console.log(studentList);
    const ref = useRef();
    const page = Math.ceil(studentList.length/10);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceStudentList = studentList.slice((seletedPage - 1) * 10, seletedPage * 10);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const handaleExportExcel = () => {
            if(ref.current) {
                const tableList = ref.current;
                AttendanceSummaryByDay(tableList);
            }
            
        }
        const fetchClassroomInfo = async () => {
            try{
                const response = await axios.get(`${HOSTNAME}/a/classroom/${classroomId}`)
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
            {studentList.length === 0 && <div>ไม่พบข้อมูล</div>}
             {
                                        studentList.length > 0 &&
                                        <ul className="flex flex-row-reverse">
                                            <li>
                                                <ExportExcelButton handelOnClickFunction={handaleExportExcel}/>
                                            </li>
                                            <li>
                                                <Link to="/att/byclassroom/pdf" state={{ studentList: studentList, classroomInfo:classroomInfo}}>
                                                    <ExportPdfButton/>
                                                </Link>
                                            </li>
                                             
                                        </ul>
                        }
            {
                studentList.length > 0 && (
                    <div>
                        <div>
                            <div>
                                <div className="relative border overflow-x-auto shadow-md sm:rounded-2xl">
                                    <table ref={ref} className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th className="px-6 py-4">เลขที่</th>
                                                <th className="px-6 py-4">รหัสนักศึกษา</th>
                                                <th className="px-6 py-4">ชื่อ-สกุล</th>
                                                <th className="px-6 py-4">ขาดเรียน(ครั้ง)</th>
                                                <th className="px-6 py-4">เข้าสาย(ครั้ง)</th>
                                                <th className="px-6 py-4">ลา(ครั้ง)</th>
                                                <th className="px-6 py-4">กิจกรรม(ครั้ง)</th>
                                                <th className="px-6 py-4">เข้าเรียน(ครั้ง)</th>
                                                <th className="px-6 py-4">คะแนนจิตวิสัย</th>
                                                <th className="px-6 py-4">ร้อยละการเข้าเรียนทั้งหมดรวมลา</th>
                                                {/* <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">สถานะ ไม่มีสิทธ์สอบ</th> */}
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                studentList.map((student, index) => (
                                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                                        <td className="px-6 py-4">{student.stdNo}</td>
                                                        <td className="px-6 py-4">{student.stdId}</td>
                                                        <td className="px-6 py-4">{`${student.fName} ${student.lName}`}</td>
                                                        <td className="px-6 py-4">{student.attendenceAbsentCount}</td>
                                                        <td className="px-6 py-4">{student.attendenceLateCount}</td>
                                                        <td className="px-6 py-4">{student.attendenceLeaveCount}</td>
                                                        <td className="px-6 py-4">{student.attendenceActivity}</td>
                                                        <td className="px-6 py-4">{student.attendenceCount}</td>
                                                        <td className="px-6 py-4">{student.behaviourScore} คะแนน</td>
                                                        <td className="px-6 py-4">{student.attendencePercent}%</td>
                                                        {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.canExam}</td> */}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
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
