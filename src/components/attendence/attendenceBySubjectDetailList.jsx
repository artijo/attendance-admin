import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AttendanceSummaryByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";
import { Link, useLocation,Navigate, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import axios from "axios";
import { TapAttendenceSummaryOpen } from "./tapAttendenceSummaryOpen";
import { convertNumberToThaiMonth } from "../../helper";
import { tabletojson }from "tabletojson";
export const AttendenceBySubjectDetailList = ({studentList}) => {
    const location = useLocation();
    const subject = location.state.subject;
    const classroomId = location.state.classroomId;
    const ref = useRef([]);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isTabOpen, setIsTabOpen] = useState([]);
    let indexReal = 0;
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
    const TableHeader = ({month}) => {
        return (
            <tr className="shadow-md text-center h-12">
                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900" >เลขที่</th>
                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900" >รหัสนักเรียน</th>
                <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900" >ชื่อ-นามสกุล</th>
                {
                    studentList.data[0].attendance.map((attendance, index) => (
                    attendance.month === month && (
                        <th key={index} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                            คาบที่ {++indexReal}
                        </th>
                    )
                    ))
                }   
            </tr>
        )
    }

    const TableBody = ({month}) => {
        return (
            studentList.data.map((student, index) => (
                <tr key={index} className="even:bg-slate-100/70 text-center">
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.stdNo}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.stdId}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{`${student.fName} ${student.lName}`}</td>
                    {
                        student.attendance.map((attendance, index) => (
                            attendance.month === month && (
                            <td key={index} className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : '-'}</td>
                            )
                        ))
                    }
                </tr>
            ))
        )
    }


    const Table = ({month,exportPdf, exportExcel,index}) => {
        return(
            <>
                <ul className="flex ml-auto w-fit">
                    <li>
                        {exportPdf}
                    </li>
                    <li>
                        {exportExcel}
                    </li>
                </ul>
                <div ref={(element) => (ref.current[index] = element)} className="grid gap-2 md:grid-cols-1 ">
                    {/* <span>{month}</span> */}
                    <div className="border shadow-md border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <TableHeader month={month}/>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <TableBody month={month}/>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
            
        )
        
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

    const handleIsTabOpen = (index) => {
        let newIsTabOpen = isTabOpen.slice();
        newIsTabOpen[index] = !newIsTabOpen[index];
        setIsTabOpen(newIsTabOpen)
        
    }

    const makeValueIsOpen = () => {
        const arrayState = new Array(1).fill(false);
        setIsTabOpen(arrayState);
    }

    useEffect(() => {
        fetchClassroomInfo();
        if(studentList != null){
            makeValueIsOpen();
        }
    },[studentList])

    const handelExportExcel = (index) => {
        if(ref.current[index]){
            AttendanceSummaryByDay(ref.current[index]);
        }
    }
    // const [jsonElement, setJsonElement] = useState([]);
    const navigate = useNavigate();
    const handelExportPdf = (index, month) => {
        const tableElement = ref.current[index];
        if (tableElement) {
            const tableJson = tabletojson.convert(tableElement.outerHTML);
            navigate('/att/bysubject/pdf', { state: { tableJson: tableJson, classroomInfo:classroomInfo,  subject:subject, month: convertNumberToThaiMonth(month)} });
        }
    }

    const ExportPdfButtonKK = ({ index , month}) => {
        return (
            <>
                <div onClick={() => handelExportPdf(index, month)}>
                    <ExportPdfButton />
                </div>
            </>
        );
    }

    const IsCanExamButton = () => {
        const handleNavigateOnClick = () => {
            navigate('/attendances/abstract/subject', 
                    {
                        state: {
                            classroomInfo: classroomInfo,
                            subject: subject,
                            studentList : studentList.data
                        }
                    }
            )
        }
        return (
            <>
                <div 
                    className="cursor-pointer inline-flex w-fit gap-2 justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={handleNavigateOnClick}
                >
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
                    <span>แบบสรุปการมีสิทธิ์สอบตามรายวิชา</span>
                </div>

            </>
        );
    };

    return (
        <>
            <div className="mx-auto container flex flex-col gap-2">
                {
                    studentList != null && <IsCanExamButton/>
                }
                {
                    studentList != null && (
                        studentList.month.map((month, index) => (
                            <div key={index}>
                                
                                {/* {console.log(month)} */}
                                <TapAttendenceSummaryOpen 
                                    title={convertNumberToThaiMonth(month)} 
                                    index={index} 
                                    isTabOpen={isTabOpen} 
                                    handleIsTabOpen={handleIsTabOpen}
                                >
                                    <Table 
                                        month={month} 
                                        index={index} 
                                        exportPdf={<ExportPdfButtonKK index={index} month={month}/>}
                                        exportExcel={ <ExportExcelButton handelOnClickFunction={() => handelExportExcel(index)}/>}
                                    />
                                </TapAttendenceSummaryOpen>
                            </div>
                            
                        ))
                    )
                }
            </div>
        </>
        
    )
};

AttendenceBySubjectDetailList.propTypes = {
    studentList: PropTypes.object.isRequired
}
