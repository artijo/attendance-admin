import { useEffect, useState } from "react";
import { styles } from "./style.js";
import { Page, Text, Document, PDFDownloadLink } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import React from "react";
import axios from "axios";
import { HOSTNAME } from "../../../config.js";


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
   
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
     
      return <p>เกิดข้อผิดพลาดในขณะประมวลผลไฟล์ PDF Document.</p>;
    }
    return this.props.children;
  }
}

function FilterByRoomJoin({activityId}) {
    const [participate, setParticipate] = useState([]);
    
    const getParticipateList = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/activity/abstact/${activityId}`);
            if(response.status == 200){
                setParticipate(response.data);
                // console.log(response.data);
            }else{
                throw new Error(response.data.message);
            };
        }catch(error){
            console.error(error);
        };
    }

    useEffect(() => {
        getParticipateList();
    },[activityId]);

    const MyPDFDocument = () => (
        <Document pageMode="fullScreen">
          {Object.keys(participate).length > 0 ? (
            Object.keys(participate).map((key, keyIndex) => (
              <Page size="A4" orientation="portrait" style={styles.page} key={keyIndex}>
                <Text style={styles.textHeader}>ห้อง {key}</Text>
                <Table style={styles.table}>
                  <TH style={styles.tableHeader}>
                    <TD style={[styles.td,{flex:1}]}>รหัสนักเรียน</TD>
                    <TD  style={[styles.td,{flex:1}]}>คำนำหน้า</TD>
                    <TD style={[styles.td,{flex:1}]}>ชื่อ</TD>
                    <TD style={[styles.td,{flex:1}]}>นามสกุล</TD>
                    <TD style={[styles.td,{flex:1}]}>จำนวนการเข้าร่วม</TD>
                  </TH>
                  {participate[key].map((pati, patiIndex) => (
                    <TR key={patiIndex}>
                      <TD style={[styles.td, { flex: 1 }]}>{pati.stdId}</TD>
                      <TD style={[styles.td, { flex: 1 }]}>{pati.title}</TD>
                      <TD style={[styles.td, { flex: 1 }]}>{pati.fName}</TD>
                      <TD style={[styles.td, { flex: 1 }]}>{pati.lName}</TD>
                      <TD style={[styles.td, { flex: 1 }]}>{pati.participateCount}</TD>
                    </TR>
                  ))}
                </Table>
              </Page>
            ))
          ) : (
            <Page size="A4" orientation="portrait" style={styles.page}>
              <Text style={styles.textHeader}>ไม่มีข้อมูลการเข้าร่วม</Text>
            </Page>
          )}
        </Document>

    );
    return (
        <>
            {Object.keys(participate).length > 0 ? (
                <ErrorBoundary>
                    <PDFDownloadLink 
                        document={<MyPDFDocument/>} 
                        fileName={`เอกสารการเข้าร่วมกิจกรรมโดยแบ่งตามห้องเรียนที่เข้าร่วม`}
                        className="px-4 py-1 text-xs bg-blue-600 text-white cursor-pointer rounded-full hover:bg-blue-500 text-ce"
                    >
                        {({ loading }) =>
                            loading ? "กำลังเตรียมเอกสาร PDF..." : "ดาวน์โหลด"
                        }
                    </PDFDownloadLink>
                </ErrorBoundary>
            )
            :(<p>Loading...</p>

            )}
        </>
        
    );
}

export default FilterByRoomJoin;