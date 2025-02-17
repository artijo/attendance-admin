import { styles } from "./byday";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { useLocation } from "react-router-dom";
function ByClassroom(){
    const location = useLocation();
    const classroomInfo = location.state.classroomInfo;
    const studentList = location.state.studentList;
   
    const ByClassroomPDF = () => (
        <Document>
          <Page size="A4" style={styles.page} orientation="landscape">
            <View style={styles.headerDisplay}>
              <View>
                <Text style={styles.textHeader}>แบบสรุปการเรียนตามห้อง</Text>
                <Text style={styles.textHeader}>**ร้อยละการเข้าเรียนเป็นการรวมการลาเข้าไปด้วย</Text>
              </View>
              <Text style={styles.textHeader}>ปีการศึกษา {classroomInfo.term.academicYear + 543} เทอม {classroomInfo.term.semester} ห้องเรียน {classroomInfo.classLevel}/{classroomInfo.classRoom}</Text>
            </View>
            <Table style={styles.table}>
                <TR style={styles.tableHeader}>
                    <TD style={[styles.td, { flex: 2 }]}>เลขที่</TD>
                    <TD style={[styles.td, { flex: 2 }]}>รหัสนักศึกษา</TD>
                    <TD style={[styles.td, { flex: 2 }]}>ชื่อ</TD>
                    <TD style={[styles.td, { flex: 2 }]}>สกุล</TD>
                    <TD style={[styles.td, { flex: 2 }]}>ขาดเรียน(ครั้ง)</TD>
                    <TD style={[styles.td, { flex: 2 }]}>เข้าสาย(ครั้ง)</TD>
                    <TD style={[styles.td, { flex: 2 }]}>ลา(ครั้ง)</TD>
                    <TD style={[styles.td, { flex: 2 }]}>กิจกรรม(ครั้ง)</TD>
                    <TD style={[styles.td, { flex: 2 }]}>เข้าเรียน(ครั้ง)</TD>
                    <TD style={[styles.td, { flex: 2 }]}>คะแนนจิตวิสัย</TD>
                    <TD style={[styles.td, { flex: 2 }]}>ร้อยละการเข้าเรียน</TD>
                    {/* <TD style={[styles.td, { flex: 2 }]}>สถานะ ไม่มีสิทธ์สอบ</TD> */}
                </TR>
                {
                    studentList.map((student, index) => ( 
                        <TR key={index}>
                            <TD style={[styles.td, { flex: 2 }]}>{student.stdNo}</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.stdId}</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.fName}</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.lName}</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.attendenceAbsentCount}</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.attendenceLateCount}</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.attendenceLeaveCount}</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.attendenceActivity}</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.attendenceCount}</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.behaviourScore} คะแนน</TD>
                            <TD style={[styles.td, { flex: 2 }]}>{student.attendencePercent}%</TD>
                            {/* <TD style={[styles.td, { flex: 2 }]}>{student.canExam}</TD> */}
                        </TR>
                    ))
                    
                }
            </Table>
          </Page>
        </Document>
      );
    return (
        <div className="container mx-auto">
          <div className="w-full h-[750px]">
            <PDFViewer width="100%" height="100%">
              <ByClassroomPDF />
            </PDFViewer>
          </div>
        </div>
      );
};
export default ByClassroom;