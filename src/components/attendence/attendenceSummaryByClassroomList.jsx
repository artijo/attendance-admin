import { PropTypes } from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { AttendanceSummaryByDay } from '../../exportExcel';
import ExportExcelButton from '../exportExcelButton';
import ExportPdfButton from '../exportPdfButton';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { HOSTNAME } from '../../config';
export const AttendenceBySummaryByClassroomList = ({studentList,classroomId}) => {
    // console.log(studentList);
    const ref = useRef();
    const page = Math.ceil(studentList.length/10);
    const [seletedPage, setSeletedPage] = useState(1);
    const sliceStudentList = studentList.slice((seletedPage - 1) * 10, seletedPage * 10);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const handaleExportExcel = () => {
            if(ref.current) {
                // console.log(ref.current);
                const tableList = ref.current;
            // if(!tableList || tableList[0]) return;
                // console.log(tableList);
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
                        <div className="grid gap-2 md:grid-cols-1">
                            <div className="rounded-lg border border-gray-200">
                                <div className="overflow-x-auto rounded-t-lg">
                                    <table ref={ref} className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
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
                                                {/* <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">สถานะ ไม่มีสิทธ์สอบ</th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 text-center">
                                            {
                                                studentList.map((student, index) => (
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
