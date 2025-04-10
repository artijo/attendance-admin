import { useLocation } from "react-router-dom";
import { styles } from "./byday";
import { Page, Text, View, Document, PDFViewer,Image } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { formatDateToThai } from "../../../helper";
function ByDay({studentList,totalStatus,date,classroomInfo}) {
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



  const ByDayPDF = () => (
    <Document pageMode="fullScreen">
      <Page size="A4" style={styles.page} orientation="landscape">
        <Image src={`/Logo_NPS.png`} style={styles.logoSize} />
        <Text style={styles.textHeader}>แบบสรุปการเรียนตามวันที่เรียนประจำวันที่ {formatDateToThai(date)}</Text>
        <Text style={styles.textHeader}>ปีการศึกษา {classroomInfo.term.academicYear + 543} เทอม {classroomInfo.term.semester} ห้องเรียน {classroomInfo.classLevel}/{classroomInfo.classRoom}</Text>
        {/* ตาราง */}
        <Table style={styles.table}>
          {/* แถวที่ 1: คาบที่ */}
          <TH style={styles.tableHeader}>
            <TD style={[styles.td, { flex: 1 }]}>คาบที่</TD>
            <TD style={[styles.td, { flex: 1 }]}></TD>
            <TD style={[styles.td, { flex: 1 }]}></TD>
            {studentList[0].attendance.map((_, index) => (
              <TD key={index} style={[styles.td, { flex: 1 }]}>{index + 1}</TD>
            ))}
          </TH>

          {/* แถวที่ 2: รหัสวิชา */}
          <TH style={styles.tableHeader}>
            <TD style={[styles.td, { flex: 1 }]}>รหัสวิชา</TD>
            <TD style={[styles.td, { flex: 1 }]}></TD>
            <TD style={[styles.td, { flex: 1 }]}></TD>
            {studentList[0].attendance.map((att, index) => (
              <TD key={index} style={[styles.td, { flex: 1 }]}>{att.subjectCode}</TD>
            ))}
          </TH>

          {/* แถวที่ 3: ข้อมูลนักศึกษา */}
          <TH style={styles.tableHeader}>
            <TD style={[styles.td, { flex: 1 }]}>เลขที่</TD>
            <TD style={[styles.td, { flex: 1 }]}>รหัสนักเรียน</TD>
            <TD style={[styles.td, { flex: 1 }]}>ชื่อ-นามสกุล</TD>
            {studentList[0].attendance.map((att, index) => (
              <TD key={index} style={[styles.td, { flex: 1 }]}>{att.subjectName}</TD>
            ))}
          </TH>
          {
            studentList.map((student, index) => (
                <TR key={index}>
                    <TD style={[styles.td, { flex: 1 }]}>{student.stdNo}</TD>
                    <TD style={[styles.td, { flex: 1 }]}>{student.stdId}</TD>
                    <TD style={[styles.td, { flex: 1 }]}>{`${student.fName} ${student.lName}`}</TD>
                    {student.attendance.map((attendance, index) => (
                    <TD key={index} style={[styles.td, { flex: 1 }]}>{attendance.attStatus != null ? formatAttStatus(attendance.attStatus.toLowerCase()) : "-"}</TD>
                    ))}
                </TR>
            ))
          }
          <TR>
            <TD style={[styles.td, { flex: 1 }]}>มาเรียน</TD>
            <TD style={[styles.td, { flex: 1 }]}>{totalStatus.present}</TD>
          </TR>
          <TR>
            <TD style={[styles.td, { flex: 1 }]}>ขาดเรียน</TD>
            <TD style={[styles.td, { flex: 1 }]}>{totalStatus.absent}</TD>
          </TR>
          <TR>
            <TD style={[styles.td, { flex: 1 }]}>ลา</TD>
            <TD style={[styles.td, { flex: 1 }]}>{totalStatus.leave}</TD>
          </TR>
          <TR>
            <TD style={[styles.td, { flex: 1 }]}>กิจกรรม</TD>
            <TD style={[styles.td, { flex: 1 }]}>{totalStatus.activity}</TD>
          </TR>
        </Table>
      </Page>
    </Document>
  );

  return (
      <ByDayPDF/>
  );
}

export default ByDay;
