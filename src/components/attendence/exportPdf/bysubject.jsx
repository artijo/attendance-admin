import { styles } from "./byday";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { useLocation } from "react-router-dom";
import { DateTime } from "luxon";
function BySubject(){
    const location = useLocation();
    const subject = location.state.subject;
    const classroomInfo =  location.state.classroomInfo;
    const month = location.state.month;
    const json = location.state.tableJson;
    const rowRange = Object.keys(json[0][0]).length - 3;
    
    const objectKeys = Object.keys(json[0][0]).filter((item) => {
        const filterKey = ["เลขที่","รหัสนักเรียน","ชื่อ-นามสกุล"];
        return !filterKey.includes(item);
        // console.log(filterKey[0]);
        // console.log(item.toString());
      }
    );
    // console.log(objectKeys.length);
    // console.log(rowRange);
    const dtNow = DateTime.now();
    const BySubjectPDF = () => (
        <Document>
          <Page size="A4" style={styles.page} orientation="landscape">
            <View style={styles.headerDisplay}>
              <Text style={styles.textHeader}>แบบสรุปการเรียนตามรายวิชาของวิชา {subject.subNameThai}({`${subject.subCode} - ${subject.subNameEng}`}) เดือน {month} {dtNow.year +543}</Text>
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
                          <TD key={index} style={[styles.td,{flex:2}]}>คาบที่ {objectKeys[index]}</TD>
                        ))
                    }
                </TH>
                {
                    json[0].map((student) => (
                      <TR key={student["เลขที่"]}>
                        <TD style={[styles.td,{flex:2}]}>{student["เลขที่"]}</TD>
                        <TD style={[styles.td,{flex:2}]}>{student["ชื่อ-นามสกุล"].split(" ")[0]}</TD>
                        <TD style={[styles.td,{flex:2}]}>{student["ชื่อ-นามสกุล"].split(" ")[1]}</TD>
                        <TD style={[styles.td,{flex:2}]}>{student["รหัสนักเรียน"]}</TD>
                        {
                          Array(rowRange).fill("rows").map((_, index) => (
                            <TD key={index} style={[styles.td,{flex:2}]}>{student[`${objectKeys[index]}`]}</TD>
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