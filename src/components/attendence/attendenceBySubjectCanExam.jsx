import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { AttendanceSummaryByDay } from "../../exportExcel";
import ExportExcelButton from "../exportExcelButton";
import ExportPdfButton from "../exportPdfButton";

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
        <div className="grid gap-2 md:grid-cols-1">
            <div className="shadow-md border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm" ref={ref}>
                <thead className="ltr:text-left rtl:text-right">
                    <tr className="shadow-md text-center h-12">
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        เลขที่
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        รหัสนักเรียน
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        ชื่อ-สกุล
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        ขาดเรียน(ครั้ง)
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        เข้าสาย(ครั้ง)
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        ลา(ครั้ง)
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        กิจกรรม(ครั้ง)
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        เข้าเรียน(ครั้ง)
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        ร้อยละการเข้าเรียนรวมลา
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                        สถานไม่มีสิทธิ์สอบ
                    </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-center">
                    {studentList.map((student, index) => (
                    <tr key={index}>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.stdNo}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.stdId}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {`${student.fName} ${student.lName}`}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.attendenceAbsentCount}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.attendenceLateCount}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.attendenceLeaveCount}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.attendenceActivity}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.attendenceCount}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.attendencePercent}%
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {student.canExam}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
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

    const handleExportPDF = () => {
        // att/bysubjectCanExam/pdf
        nevigate('/att/bysubjectCanExam/pdf', {
                    state:{
                        subject:subject,
                        studentList: studentList,
                        classroomInfo: classroomInfo
                    }
                }
            )
    }



    return (
        <div className="mx-auto container">
            <div className="header">
                <HeaderTitle />
                <HeaderDescription />
            </div>
            <div className="body">
                <div className="flex gap-2 w-fit ml-auto">
                    <div onClick={handleExportPDF}>
                        <ExportPdfButton/>
                    </div>
                    <ExportExcelButton handelOnClickFunction={handleExportExcel}/>
                </div>
                
                <Table />
            </div>
        </div>
    );
    };
