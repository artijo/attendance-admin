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
    const ref = useRef([]);
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isTabOpen, setIsTabOpen] = useState([]);
 
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
        let indexReal = 0;
        return (
            <tr>
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
        let indexReal = 0;
        return (
            studentList.data.map((student, index) => (
                <tr key={index}>
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
                    <div className="rounded-lg border border-gray-200">
                        <div className="overflow-x-auto rounded-t-lg">
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
            // setJsonElement(tableJson);
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

    return (
        <>
            <div>
                {
                    studentList != null && (
                        studentList.month.map((month, index) => (
                            <div key={index} className="mb-2">
                                
                                {/* {console.log(month)} */}
                                <TapAttendenceSummaryOpen 
                                    title={convertNumberToThaiMonth(month)} 
                                    index={index} 
                                    isTabOpen={isTabOpen} 
                                    handleIsTabOpen={handleIsTabOpen}
                                >
                                    {/* <TableHeader month={month}/> */}
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
// {
//     studentList.length === 0 &&
//     <Noanything title="ไม่พบข้อมูล" description="ไม่มีปฎิทินการเรียน" />
// }
// {
//                 studentList.length > 0 &&
//                 <ul className="flex flex-row-reverse">
//                     <li>
//                         <ExportExcelButton handelOnClickFunction={handaleExportExcel}/>
//                     </li>
//                     <li>
//                     <Link to="/att/bysubject/pdf" state={{ studentList: studentList, subject:location.state.subject, classroomInfo:classroomInfo }}>
//                         <ExportPdfButton/>
//                     </Link>
//                     </li>
                     
//                 </ul>
// }
// {studentList.length > 0 && (
//     studentList[0].attendance.length > 0 &&
//     <div className="grid gap-2 md:grid-cols-1">
//     <div className="rounded-lg border border-gray-200">
//         <div className="overflow-x-auto rounded-t-lg">
//             <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
//                 <thead className="ltr:text-left rtl:text-right">
//                     <tr>
//                         <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900" >เลขที่</th>
//                         <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900" >รหัสนักเรียน</th>
//                         <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900" >ชื่อ-นามสกุล</th>
//                         {
//                             studentList.length > 0 && 
//                             (
//                                 studentList[0].attendance.map((attendance, index) => (
//                                     <th key={index} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
//                                         {/* {
//                                             formatDateToThai(attendance.studingTimeDate.split('T')[0])} <br/>{attendance.studingTimeDate.split('T')[1].split('.')[0].split(':')[0]}:{attendance.studingTimeDate.split('T')[1].split('.')[0].split(':')[1]} <br/> คาบที่{index+1} */}
//                                         คาบที่ {index+1}
//                                     </th>
//                                 ))
//                             )
//                         }
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                     {
//                         sliceStudentList.length > 0 ? 
//                             (
//                                 studentList.map((student, index) => (
//                                     <tr key={index}>
//                                         <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.stdNo}</td>
//                                         <td className="whitespace-nowrap px-4 py-2 text-gray-700">{student.stdId}</td>
//                                         <td className="whitespace-nowrap px-4 py-2 text-gray-700">{`${student.fName} ${student.lName}`}</td>
//                                         {
//                                             student.attendance.map((attendance, index) => (
//                                                 <td key={index} className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : '-'}</td>
//                                             ))
//                                         }
//                                     </tr>
//                                 ))
//                             ) : 
//                             <tr>
//                                 <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700" colSpan={4}>ไม่มีข้อมูล</td>
//                             </tr>
//                     }
//                 </tbody>
//             </table>
//         </div>
//     </div>
// </div>
// )
// }