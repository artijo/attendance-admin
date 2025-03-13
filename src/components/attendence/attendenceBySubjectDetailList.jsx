import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AttendanceSummaryByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";
import { Link, useLocation,Navigate, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import axios from "axios";
import { TapAttendenceSummaryOpen } from "./tapAttendenceSummaryOpen";
import { convertNumberToThaiMonth, dateTimeFormat } from "../../helper";
import { tabletojson }from "tabletojson";
import BySubject from "./exportPdf/bysubject";
export const AttendenceBySubjectDetailList = ({studentList}) => {
    const navigate = useNavigate();
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
            <tr className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <th className="px-2 py-4" >เลขที่</th>
                <th className="px-2 py-4" >รหัสนักเรียน</th>
                <th className="px-2 py-4" >ชื่อ-นามสกุล</th>
                {
                    studentList.data[0].attendance.map((attendance, index) => (
                        
                    attendance.month === month && (
                        <th key={index} className="px-2 py-4">
                            คาบที่ {++indexReal}<br/>
                            ({dateTimeFormat(attendance.studingTimeDate)})
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
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <td className="px-2 py-4">{student.stdNo}</td>
                    <td className="px-2 py-4">{student.stdId}</td>
                    <td className="px-2 py-4">{`${student.fName} ${student.lName}`}</td>
                    {
                        student.attendance.map((attendance, index) => (
                            attendance.month === month && (
                            <td key={index} className="px-2 py-4">{attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : '-'}</td>
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
                <div ref={(element) => (ref.current[index] = element)}>
                    {/* <span>{month}</span> */}
                    <div>
                        <div className="relative border overflow-x-auto shadow-md sm:rounded-2xl">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <TableHeader month={month}/>
                                </thead>
                                <tbody>
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

    const handelExportExcel = (index) => {
        if(ref.current[index]){
            AttendanceSummaryByDay(ref.current[index]);
        }
    }

    const handelExportPdf = (index, month) => {
        const tableElement = ref.current[index];
        if(tableElement != null){
            const tableJson = tabletojson.convert(tableElement.outerHTML);
            return <BySubject subject={subject} classroomInfo={classroomInfo} month={convertNumberToThaiMonth(month)} tableJson={tableJson}/> //by subject pdf
        }
        return null;
    }

    const ExportPdfButtonKK = ({index , month}) => {
        const handelExportPdfCheck = handelExportPdf(index, month);
        if(handelExportPdfCheck === null) {
            return <p>Loading....</p>
        }else{
            return (
                <ExportPdfButton PDFComponent={handelExportPdf(index, month)} fileName={`สรุปการเข้าเรียนวิชา ${subject.subNameThai}`}/>
            );
        }
    }

    useEffect(() => {
        fetchClassroomInfo();
        if(studentList != null){
            makeValueIsOpen();
        }
    },[studentList])

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
