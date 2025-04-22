import { Link, useLocation } from "react-router-dom";
import { formatDateToThai, formatTitle } from "../../../../helper";
import { styles } from "../style.js";
import { Page, Text, View, Document, PDFViewer, Image } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

function AttendenceByDayPDF() {
    const location = useLocation();
    const { studentList, totalStatus, date, classroomInfo } = location.state;
    const [periodStatus, setPeriodStatus] = useState([]);

    // Calculate per-period statistics
    useEffect(() => {
        if (!studentList || !studentList.length) return;
        
        const periodsCount = studentList[0].attendance.length;
        const periodStats = Array(periodsCount).fill().map(() => ({
            present: 0,
            late: 0,
            absent: 0,
            activity: 0,
            leave: 0
        }));
        
        studentList.forEach((student) => {
            student.attendance.forEach((attendance, periodIndex) => {
                if (attendance.attStatus !== null) {
                    const status = attendance.attStatus.toLowerCase();
                    if (periodStats[periodIndex].hasOwnProperty(status)) {
                        periodStats[periodIndex][status]++;
                    }
                }
            });
        });
        
        setPeriodStatus(periodStats);
    }, [studentList]);

    const formatAttStatus = (status) => {
        switch (status) {
            case 'present': {
                return 'เข้าเรียน';
            }
            case 'absent': {
                return 'ไม่เข้าเรียน';
            }
            case 'late': {
                return 'มาสาย';
            }
            case 'activity': {

                return 'เข้าเรียนกิจกรรม';
            }
            case 'leave': {

                return 'ลา';
            }
            default:
                return status;
        }
    };

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายงาน PDF สรุปการเข้าเรียนตามวัน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    to={`/activity/participate/filterbyclassroomjoin`}
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้าเลือกห้อง
                </Link>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="p-6">
                    <div className="mb-6">
                        <div className="bg-gray-50 border border-line rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="font-medium text-text-color font-body">รายละเอียดการเข้าเรียน</h4>
                                    <p className="text-sm text-text-color-alt font-body mt-1">
                                        ประจำวันที่ {formatDateToThai(date)} | ห้อง ม.{classroomInfo.classLevel}/{classroomInfo.classRoom}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[700px] rounded-xl overflow-hidden border border-line">
                        <PDFViewer width={"100%"} height={"100%"} style={{ borderRadius: "0.5rem" }}>
                            <Document
                                pageMode="fullScreen"
                                title={`เอกสารการเข้าเรียนประจำวันที่ ${formatDateToThai(date)}`}
                            >
                                <Page size="A4" style={styles.page} orientation="portrait">
                                    <Image src={`/Logo_NPS.png`} style={styles.logoSize} />
                                    <Text style={styles.textHeader}>สรุปการเข้าเรียน | ห้องม.{classroomInfo.classLevel}/{classroomInfo.classRoom}</Text>
                                    <View 
                                        style={{
                                            width:'20%',
                                            height: '2px',
                                            backgroundColor: '#EE722A',
                                            borderRadius: '5px',
                                            marginBottom: '5px',
                                        }}
                                    ></View>
                                    <Text style={styles.textParagraph}>ประจำวันที่ {formatDateToThai(date)}</Text>
                                    
                                    {/* First row - Period Numbers */}
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.tableColumn1, {width:'5%'}]}>คาบที่</Text>
                                        <Text style={[styles.tableColumn1, {width:'15%'}]}></Text>
                                        <Text style={[styles.tableColumn1, {width:'15%'}]}></Text>
                                        {studentList[0].attendance.map((_, index) => (
                                            <Text key={index} style={[styles.tableColumn2, {textAlign: 'center'}]}>{index + 1}</Text>
                                        ))}
                                    </View>
                                    
                                    {/* Second row - Subject Codes */}
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableColumn1, {width:'5%'}]}>รหัสวิชา</Text>
                                        <Text style={[styles.tableColumn1, {width:'15%'}]}></Text>
                                        <Text style={[styles.tableColumn1, {width:'15%'}]}></Text>
                                        {studentList[0].attendance.map((att, index) => (
                                            <Text key={index} style={[styles.tableColumn2, {textAlign: 'center'}]}>{att.subjectCode}</Text>
                                        ))}
                                    </View>
                                    
                                    {/* Third row - Column Headers */}
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableColumn1, {width:'5%'}]}>เลขที่</Text>
                                        <Text style={[styles.tableColumn1, {width:'15%'}]}>รหัสนักเรียน</Text>
                                        <Text style={[styles.tableColumn1, {width:'15%'}]}>ชื่อ-นามสกุล</Text>
                                        {studentList[0].attendance.map((att, index) => (
                                            <Text key={index} style={[styles.tableColumn2, {textAlign: 'center'}]}>{att.subjectName}</Text>
                                        ))}
                                    </View>
                                    
                                    {/* Student rows */}
                                    {studentList.map((student, index) => (
                                        <View key={index} style={styles.tableRow}>
                                            <Text style={[styles.tableColumn1, {width:'5%'}]}>{student.stdNo}</Text>
                                            <Text style={[styles.tableColumn1, {width:'15%'}]}>{student.stdId}</Text>
                                            <Text style={[styles.tableColumn1, {width:'15%'}]}>{`${formatTitle(student.title)}${student.fName} ${student.lName}`}</Text>
                                            
                                            {student.attendance.map((attendance, idx) => (
                                                <Text key={idx} style={[styles.tableColumn2, {textAlign: 'center'}]}>
                                                    {attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : "-"}
                                                </Text>
                                            ))}
                                        </View>
                                    ))}
                                    
                                    {/* Summary rows */}
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableColumn1, {width:'35%', textAlign: 'left', color: '#22c55e'}]}>มาเรียน</Text>
                                        {periodStatus.map((period, index) => (
                                            <Text key={index} style={[styles.tableColumn2, {color: '#22c55e', textAlign: 'center'}]}>
                                                {period.present || 0} คน
                                            </Text>
                                        ))}
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableColumn1, {width:'35%', textAlign: 'left', color: '#f97316'}]}>มาสาย</Text>
                                        {periodStatus.map((period, index) => (
                                            <Text key={index} style={[styles.tableColumn2, {color: '#f97316', textAlign: 'center'}]}>
                                                {period.late || 0} คน
                                            </Text>
                                        ))}
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableColumn1, {width:'35%', textAlign: 'left', color: '#dc2626'}]}>ขาดเรียน</Text>
                                        {periodStatus.map((period, index) => (
                                            <Text key={index} style={[styles.tableColumn2, {color: '#dc2626', textAlign: 'center'}]}>
                                                {period.absent || 0} คน
                                            </Text>
                                        ))}
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableColumn1, {width:'35%', textAlign: 'left', color: '#9333ea'}]}>ลา</Text>
                                        {periodStatus.map((period, index) => (
                                            <Text key={index} style={[styles.tableColumn2, {color: '#9333ea', textAlign: 'center'}]}>
                                                {period.leave || 0} คน
                                            </Text>
                                        ))}
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableColumn1, {width:'35%', textAlign: 'left', color: '#2563eb'}]}>กิจกรรม</Text>
                                        {periodStatus.map((period, index) => (
                                            <Text key={index} style={[styles.tableColumn2, {color: '#2563eb', textAlign: 'center'}]}>
                                                {period.activity || 0} คน
                                            </Text>
                                        ))}
                                    </View>
                                </Page>
                            </Document>
                        </PDFViewer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendenceByDayPDF;