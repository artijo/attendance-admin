import { Link, useLocation } from "react-router-dom";
import { formatAttStatus, formatDateToThai, formatTitle } from "../../../../helper";
import { styles } from "../style.js";
import { Page, Text, View, Document, PDFViewer, Image } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { array } from "prop-types";

function AttendenceByDayPDF() {
    const location = useLocation();
    const { studentList, periodStatus, date, classroomInfo } = location.state;
    const [newStudentList, setNewStudentList] = useState([]);

    
    useEffect(() => {
        let listPerPage = 25;
        let totalPage = Math.ceil(studentList.length / listPerPage); // ปัดเศษขึ้น 
        let itemsPage = [];
        // Array structure
        /*
            [
                [],[]
            ]
        */
        for (let i = 1; i <= totalPage; i++) {
            let sliceStudentList = studentList.slice((i - 1) * listPerPage, i * listPerPage)
            // console.log(sliceStudentList);
            itemsPage.push(sliceStudentList);
        };
        // console.log(itemsPage);
        setNewStudentList(itemsPage);
    }, [])



    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold md:text-3xl text-primary font-heading">รายงาน PDF สรุปการเข้าเรียนตามวัน</h1>
                <div className="w-16 h-1 mt-2 rounded-full bg-secondary"></div>
            </div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-text-color font-heading">
                            รายละเอียดการเข้าเรียน
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">ห้อง {classroomInfo.classLevel}/{classroomInfo.classRoom}</p>
                    </div>
                </div>

                <Link
                    to={`/attendances/details/byday`}
                    state={{classroomId: classroomInfo.classId, date: date}}
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ย้อนกลับ
                </Link>
            </div>
            <div className="overflow-hidden bg-white border shadow-md rounded-xl border-line">
                <div className="p-6">
                    <div className="mb-6">
                        <div className="p-4 border rounded-lg bg-gray-50 border-line">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="font-medium text-text-color font-body">รายละเอียดการเข้าเรียน</h4>
                                    <p className="mt-1 text-sm text-text-color-alt font-body">
                                        {/* ประจำวันที่ {formatDateToThai(date)} | ห้อง ม.{classroomInfo.classLevel}/{classroomInfo.classRoom} */}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[700px] rounded-xl overflow-hidden border border-line">
                        {(newStudentList.length > 0 && periodStatus.length > 0) && (
                            <PDFViewer width={"100%"} height={"100%"} style={{ borderRadius: "0.5rem" }}>
                                <Document pageMode="fullScreen" title={`เอกสารการเข้าเรียประจำวันที่ ${formatDateToThai(date)}`}>
                                    {(newStudentList.length > 0) && newStudentList.map((students, pageIndex) => (
                                        <Page size={"A4"} style={styles.page} key={`Page ${pageIndex + 1}`}>
                                            <Image src={`/Logo_NPS.png`} style={styles.logoSize} />
                                            <Text style={styles.textHeader}>
                                                รายละเอียดการเข้าเรียนประจำวันที่ {formatDateToThai(date)} | ห้องม.{classroomInfo.classLevel}/{classroomInfo.classRoom}
                                            </Text>
                                            <View
                                                style={{
                                                    width: '20%',
                                                    height: '2px',
                                                    backgroundColor: '#EE722A',
                                                    borderRadius: '5px',
                                                    marginBottom: '5px'
                                                }}
                                            > </View>
                                            {/* First Row - Period Numbers */}
                                            <View style={styles.tableHeader}>
                                                <Text style={[styles.tableColumn1, { width: '5%' }]}>คาบที่</Text>
                                                <Text style={[styles.tableColumn1, { width: '15%' }]}></Text>
                                                <Text style={[styles.tableColumn1, { width: '15%' }]}></Text>
                                                {studentList[0].attendance.map((_, index) => (
                                                    <Text key={`table first row ${index + 1}`} style={[styles.tableColumn2, { textAlign: 'center' }]}>{index + 1}</Text>
                                                ))}
                                            </View>
                                            {/* Second Row - Subject Codes */}
                                            <View style={styles.tableRow}>
                                                <Text style={[styles.tableColumn1, { width: '5%' }]}>รหัสวิชา</Text>
                                                <Text style={[styles.tableColumn1, { width: '15%' }]}></Text>
                                                <Text style={[styles.tableColumn1, { width: '15%' }]}></Text>
                                                {studentList[0].attendance.map((att, index) => (
                                                    <Text key={`table second row ${index + 1}`} style={[styles.tableColumn2, { textAlign: 'center' }]}>{att.subjectCode}</Text>
                                                ))}
                                            </View>
                                            {/* Third row - Column Headers */}
                                            <View style={styles.tableRow}>
                                                <Text style={[styles.tableColumn1, { width: '5%' }]}>เลขที่</Text>
                                                <Text style={[styles.tableColumn1, { width: '15%' }]}>รหัสนักเรียน</Text>
                                                <Text style={[styles.tableColumn1, { width: '15%' }]}>ชื่อ-นามสกุล</Text>
                                                {studentList[0].attendance.map((att, index) => (
                                                    <Text key={`table third row ${index + 1}`} style={[styles.tableColumn2, { textAlign: 'center' }]}>{att.subjectName}</Text>
                                                ))}
                                            </View>
                                            {/* Student Row */}
                                            {students.map((student, studentIndex) => (
                                                <View
                                                    key={`student-${student.stdNo}-${studentIndex}`}
                                                    style={styles.tableRow}
                                                >
                                                    <Text style={[styles.tableColumn1, { width: '5%' }]}>{student.stdNo}</Text>
                                                    <Text style={[styles.tableColumn1, { width: '15%' }]}>{student.stdId}</Text>
                                                    <Text style={[styles.tableColumn1, { width: '15%' }]}>
                                                        {`${formatTitle(student.title)}${student.fName} ${student.lName}`}
                                                    </Text>

                                                    {student.attendance.map((attendance, attIndex) => (
                                                        <Text
                                                            key={`student-${student.stdNo}-att-${attendance.subjectName}-${attIndex}`}
                                                            style={[styles.tableColumn2, { textAlign: 'center' }]}
                                                        >
                                                            {attendance.attStatus != null
                                                                ? formatAttStatus(attendance.attStatus.toLowerCase())
                                                                : "-"}
                                                        </Text>
                                                    ))}
                                                </View>
                                            ))}
                                            {/* Period Table */}
                                            {(pageIndex === newStudentList.length - 1) && (
                                                <View style={{marginTop : '7px', marginBottom: '7px'}}>
                                                    <Text style={styles.textHeader}>สรุปการเข้าเรียนทั้งหมด</Text>
                                                    <View style={styles.tableHeader}>
                                                        <Text style={styles.tableColumn1}>วิชา</Text>
                                                        <Text style={styles.tableColumn2}>มาเรียน</Text>
                                                        <Text style={styles.tableColumn2}> มาสาย</Text>
                                                        <Text style={styles.tableColumn2}>ขาดเรียน</Text>
                                                        <Text style={styles.tableColumn2}>ลา</Text>
                                                        <Text style={styles.tableColumn2}>กิจกรรม</Text>
                                                    </View>
                                                    {periodStatus.map((period, periodIndex) => (
                                                        <View key={`${period.subjectName} index ${periodIndex}`} style={styles.tableRow}>
                                                            <Text style={styles.tableColumn1}>{period.subjectName}</Text>
                                                            <Text style={styles.tableColumn2}>{period.present}</Text>
                                                            <Text style={styles.tableColumn2}>{period.late}</Text>
                                                            <Text style={styles.tableColumn2}>{period.absent}</Text>
                                                            <Text style={styles.tableColumn2}>{period.leave}</Text>
                                                            <Text style={styles.tableColumn2}>{period.activity}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </Page>
                                    ))}
                                </Document>
                            </PDFViewer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



export default AttendenceByDayPDF;