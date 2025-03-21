import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { AttendanceSummaryByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";
import BySubejctCanExamPDF from "./exportPdf/bysubjectCanExam";

export const AttendanceBySubjectCanExam = () => {
    const location = useLocation();
    const { subject, classroomInfo } = location.state;
    const [studentList, setStudentList] = useState([]);
    const nevigate = useNavigate();
    const ref = useRef();


    const abstractCanExam = async () => {
        try {
        const response = await axios.get(
            `${HOSTNAME}/a/atttendence/abstract/${classroomInfo.classId}/${subject.subId}`
        );
        setStudentList(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        abstractCanExam();
    }, []);

    const HeaderTitle = () => {
        return (
        <>
            {subject && (
            <h3>
                แบบสรุปการมีสิทธิ์สอบตามวิชา {subject.subNameThai} (
                {subject.subCode}-{subject.subNameEng})
            </h3>
            )}
        </>
        );
    };

    const HeaderDescription = () => {
        return (
        <>
            {classroomInfo && (
            <p className="inline-flex gap-2">
                <span>
                ห้อง {classroomInfo.classLevel}/{classroomInfo.classRoom}
                </span>
                <span>
                ปีการศึกษา {classroomInfo.term.academicYear + 543} เทอม{" "}
                {classroomInfo.term.semester}
                </span>
            </p>
            )}
        </>
        );
    };

    const Table = () => {
        return (
        <div>
            <div className="mt-4" >
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" ref={ref}>
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">
                                    เลขที่
                                </th>
                                <th className="px-6 py-3">
                                    รหัสนักเรียน
                                </th>
                                <th className="px-6 py-3">
                                    ชื่อ-สกุล
                                </th>
                                <th className="px-6 py-3">
                                    ขาดเรียน(ครั้ง)
                                </th>
                                <th className="px-6 py-3">
                                    เข้าสาย(ครั้ง)
                                </th>
                                <th className="px-6 py-3">
                                    ลา(ครั้ง)
                                </th>
                                <th className="px-6 py-3">
                                    กิจกรรม(ครั้ง)
                                </th>
                                <th className="px-6 py-3">
                                    เข้าเรียน(ครั้ง)
                                </th>
                                <th className="px-6 py-3">
                                    ร้อยละการเข้าเรียนรวมลา
                                </th>
                                <th className="px-6 py-3">
                                    สถานไม่มีสิทธิ์สอบ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentList.map((student, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <td className="px-6 py-4">
                                {student.stdNo}
                                </td>
                                <td className="px-6 py-4">
                                {student.stdId}
                                </td>
                                <td className="px-6 py-4">
                                {`${student.fName} ${student.lName}`}
                                </td>
                                <td className="px-6 py-4">
                                {student.attendenceAbsentCount}
                                </td>
                                <td className="px-6 py-4">
                                {student.attendenceLateCount}
                                </td>
                                <td className="px-6 py-4">
                                {student.attendenceLeaveCount}
                                </td>
                                <td className="px-6 py-4">
                                {student.attendenceActivity}
                                </td>
                                <td className="px-6 py-4">
                                {student.attendenceCount}
                                </td>
                                <td className="px-6 py-4">
                                {student.attendencePercent}%
                                </td>
                                <td className="px-6 py-4">
                                {student.canExam}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {studentList.length === 0 &&(
                    <div className="mt-4">
                        <span className="flex flex-col items-center justify-center gap-2 py-3 border rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                            </svg>
                            ไม่พบสรุปหรือยังไม่มีข้อมูลการเข้าเรียน
                        </span>
                    </div>
                )}
            </div>
        </div>
        );
    };

    const handleExportExcel = () => {
        if(ref.current) {
            console.log(ref.current);
            AttendanceSummaryByDay(ref.current);
        }
        
    }

    const handelExportPdf = () => {
        if(subject != null && classroomInfo != null && studentList.length > 0){
            return <BySubejctCanExamPDF classroomInfo={classroomInfo} studentList={studentList} subject={subject}/>
        }
        return null;
    }

    const ExportPdfButtonKK = () => {
        const handelExportPdfCheck = handelExportPdf();
        if(handelExportPdfCheck === null) {
            return <p>Loading....</p>
        }else{
            return (
                <ExportPdfButton PDFComponent={handelExportPdfCheck} fileName={`สรุปการมิสิทธ์สอบวิชา ${subject.subNameThai} ชั้นมัธยมปีที่ ${classroomInfo.classLevel} ห้อง ${classroomInfo.classRoom}`}/>
            );
        }
    }

    return (
        <div className="mx-auto container">
            <div className="header">
                <HeaderTitle />
                <HeaderDescription />
            </div>
            <div className="body">
                <div className="flex gap-2 w-fit ml-auto">
                    {studentList.length > 0 && Object.keys(studentList.length) > 0 &&
                        <>
                            <ExportPdfButtonKK/>
                            <ExportExcelButton handelOnClickFunction={handleExportExcel}/>
                        </>
                    }
                </div>
                <Table />
            </div>
        </div>
    );
};
