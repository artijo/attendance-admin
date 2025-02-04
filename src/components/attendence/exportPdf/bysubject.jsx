import { styles } from "./byday";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { useLocation } from "react-router-dom";
function BySubject(){
    const location = useLocation();
    const subject = location.state.subject;
    console.log(subject)
    const studentList = location.state.studentList;
    const BySubjectPDF = () => (
        <Document>
          <Page size="A4" style={styles.page} orientation="landscape">
            <View>
              <Text style={styles.textHeader}>แบบสรุปการเรียนตามรายวิชาของวิชา {subject.subNameThai} {`${subject.subCode} - ${subject.subNameEng}`}</Text>
            </View>
            <Table style={styles.table}>
                <TH style={styles.tableHeader}>
                    <TD style={[styles.td,{flex:2}]}>เลขที่</TD>
                    <TD style={[styles.td,{flex:2}]}>ชื่อ</TD>
                    <TD style={[styles.td,{flex:2}]}>นามสกุล</TD>
                    <TD style={[styles.td,{flex:2}]}>รหัสนักเรียน</TD>
                    {
                        studentList[0].attendance.map((_, index) => (
                            <TD key={index} style={styles.td}>คาบที่ {index+1}</TD>
                        ))
                    }
                </TH>
                {
                    studentList.map((student,index) => (
                        <TR key={student.stdNo}>
                            <TD style={[styles.td,{flex:2}]}>{student.stdNo}</TD>
                            <TD style={[styles.td,{flex:2}]}>{student.fName}</TD>
                            <TD style={[styles.td,{flex:2}]}>{student.lName}</TD>
                            <TD style={[styles.td,{flex:2}]}>{student.stdId}</TD>
                            {
                                student.attendance.map((attendance,index) => (
                                    <TD key={index+1+"att"} style={styles.td}>{attendance.attStatus != null ? attendance.attStatus : '-'}</TD>
                                ))
                            }
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
              <BySubjectPDF />
            </PDFViewer>
          </div>
        </div>
      );
};
export default BySubject;