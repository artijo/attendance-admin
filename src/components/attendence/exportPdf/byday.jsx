import { useLocation } from "react-router-dom";
import { styles } from "./byday";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { useState } from "react";
function ByDay() {
  const location = useLocation();
  const studentList = location.state.studentList;
  const [totalStatus, setTotalStatus] = useState({
          present: 0,
          late: 0,
          absent: 0,
          activity: 0,
          leave: 0
      });
      // console.log(studentList)
      const setuptotalstatus = () => {
          const updatedTotalStatus = {
              present: 0,
              late: 0,
              absent: 0,
              activity: 0,
              leave: 0
          };
          studentList.forEach((student) => {
              student.attendance.forEach((attendance) => {
                  if(attendance.attStatus !== null){
                      if (attendance.attStatus.toLowerCase() === 'present') {
                          updatedTotalStatus.present++;
                      } else if (attendance.attStatus.toLowerCase() === 'late') {
                          updatedTotalStatus.late++;
                      } else if (attendance.attStatus.toLowerCase() === 'absent') {
                          updatedTotalStatus.absent++;
                      } else if (attendance.attStatus.toLowerCase() === 'activity') {
                          updatedTotalStatus.activity++;
                      } else if (attendance.attStatus.toLowerCase() === 'leave') {
                          updatedTotalStatus.leave++;
                      }
                  };
              });
          })
          setTotalStatus(updatedTotalStatus);
      }
  

  const ByDayPDF = () => (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View>
          <Text style={styles.textHeader}>แบบสรุปการเรียนตามรายวันที่ DD เดือน MM ปี YYYY</Text>
        </View>

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
            <TD style={[styles.td, { flex: 1 }]}>รหัสนักศึกษา</TD>
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
                    <TD key={index} style={[styles.td, { flex: 1 }]}>{attendance.attStatus != null ? attendance.attStatus : "-"}</TD>
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
    <div className="container mx-auto">
      <div className="w-full h-[750px]">
        <PDFViewer width="100%" height="100%">
          <ByDayPDF />
        </PDFViewer>
      </div>
    </div>
  );
}

export default ByDay;
