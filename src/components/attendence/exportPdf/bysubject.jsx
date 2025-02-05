import { styles } from "./byday";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { useLocation } from "react-router-dom";
function BySubject(){
    const location = useLocation();
    const subject = location.state.subject;
    const classroomInfo =  location.state.classroomInfo;
    const month = location.state.month;
    const json = location.state.tableJson;
    console.log(json[0][0]);
    const rowRange = Object.keys(json[0][0]).length - 3;
    console.log(rowRange);
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
    const BySubjectPDF = () => (
        <Document>
          <Page size="A4" style={styles.page} orientation="landscape">
            <View style={styles.headerDisplay}>
              <Text style={styles.textHeader}>แบบสรุปการเรียนตามรายวิชาของวิชา {subject.subNameThai} {`${subject.subCode} - ${subject.subNameEng}`} เดือน {month}</Text>
              <Text style={styles.textHeader}>ปีการศึกษา {classroomInfo.term.academicYear + 543} เทอม {classroomInfo.term.semester} ห้องเรียน {classroomInfo.classLevel}/{classroomInfo.classRoom}</Text>
            </View>
            <Table style={styles.table}>
                <TH style={styles.tableHeader}>
                    <TD style={[styles.td,{flex:2}]}>เลขที่</TD>
                    <TD style={[styles.td,{flex:2}]}>ชื่อ</TD>
                    <TD style={[styles.td,{flex:2}]}>นามสกุล</TD>
                    <TD style={[styles.td,{flex:2}]}>รหัสนักเรียน</TD>
                    {
                        Array(rowRange).fill("rows").map((_, index) => (
                          <TD key={index} style={[styles.td,{flex:2}]}>คาบที่ {index+1}</TD>
                        ))
                    }
                </TH>
                {
                    json[0].map((student,index) => (
                      <TR key={student["เลขที่"]}>
                        <TD style={[styles.td,{flex:2}]}>{student["เลขที่"]}</TD>
                        <TD style={[styles.td,{flex:2}]}>{student["ชื่อ-นามสกุล"].split(" ")[0]}</TD>
                        <TD style={[styles.td,{flex:2}]}>{student["ชื่อ-นามสกุล"].split(" ")[1]}</TD>
                        <TD style={[styles.td,{flex:2}]}>{student["รหัสนักเรียน"]}</TD>
                        {
                          Array(rowRange).fill("rows").map((_, index) => (
                            <TD key={index} style={[styles.td,{flex:2}]}>{student[`คาบที่ ${index+1}`]}</TD>
                          ))
                        }
                    </TR>
                      // console.log(student);
                    ))
                    // studentList.map((student,index) => (
                    
                    // ))
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