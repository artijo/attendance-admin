import { styles } from "./byday";
import { Page, Text, View, Document, PDFViewer, PDFDownloadLink, Image } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { useLocation } from "react-router-dom";
import { DateTime } from "luxon";
function BySubject({
  subject,
  classroomInfo,
  month,
  tableJson
}){
    const json = tableJson;
    const rowRange = Object.keys(json[0][0]).length - 3;
    const objectKeys = Object.keys(json[0][0]).filter((item) => {
        const filterKey = ["เลขที่","รหัสนักเรียน","ชื่อ-นามสกุล"];
        return !filterKey.includes(item);
      }
    );
    const dtNow = DateTime.now();
    const BySubjectPDF = () => (
        <Document pageMode="fullScreen">
          <Page size="A4" style={styles.page} orientation="landscape">
            <Image src={`/Logo_NPS.png`} style={styles.logoSize} />
            <Text style={styles.textHeader}>แบบสรุปการเรียนตามรายวิชาของวิชา {subject.subNameThai}({`${subject.subCode} - ${subject.subNameEng}`}) เดือน {month} {dtNow.year +543}</Text>
            <Text style={styles.textHeader}>ปีการศึกษา {classroomInfo.term.academicYear + 543} เทอม {classroomInfo.term.semester} ห้องเรียน {classroomInfo.classLevel}/{classroomInfo.classRoom}</Text>
            <Table style={styles.table}>
                <TH style={styles.tableHeader}>
                    <TD style={[styles.td,{flex:2}]}>เลขที่</TD>
                    <TD style={[styles.td,{flex:2}]}>รหัสนักเรียน</TD>
                    <TD style={[styles.td,{flex:2}]}>ชื่อ-นามสกุล</TD>
                    {
                        Array(rowRange).fill("rows").map((_, index) => (
                          <TD key={index} style={[styles.td,{flex:2}]}>{objectKeys[index]}</TD>
                        ))
                    }
                </TH>
                {
                    json[0].map((student) => (
                      <TR key={student["เลขที่"]}>
                        <TD style={[styles.td,{flex:2}]}>{student["เลขที่"]}</TD>
                        <TD style={[styles.td,{flex:2}]}>{student["รหัสนักเรียน"]}</TD>
                        <TD style={[styles.td,{flex:2}]}>{`${student["ชื่อ-นามสกุล"].split(" ")[0]} ${student["ชื่อ-นามสกุล"].split(" ")[1]}`}</TD>
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
        // <div className="container mx-auto">
        //    <PDFDownloadLink document={<BySubjectPDF />} fileName="somename.pdf">
        //       {({ blob, url, loading, error }) =>
        //         loading ? 'Loading document...' : 'Download now!'
        //       }
        //     </PDFDownloadLink>
        // </div>
        <BySubjectPDF/>
    );
};
export default BySubject;