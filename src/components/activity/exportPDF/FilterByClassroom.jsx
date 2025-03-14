import { styles } from "./style.js";
import { Page, Text, View, Document, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../../config.js";
import { convertNumberToThaiMonth } from "../../../helper.js";
import { DateTime } from "luxon";
function FilterByClassroom({
    activityId,
    classId,
}){
    const [paticipate, setPaticipate] = useState(null);

    const getPaticipateList = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/activity/abstact/byclassroom/${activityId}/${classId}`);
            if(response.status === 200) {
                setPaticipate(response.data);
                console.log(response.data);
            }else{
                throw new Error(response.data.message);
            };
        }catch(error){
            console.error(error);
        };
    }

    const dateFormatToThai = (date) => {
        const dateSplit = date.split('-');
        const dateFormat = `${dateSplit[2]} ${convertNumberToThaiMonth(parseInt(dateSplit[1]))} ${parseInt(dateSplit[0]) + 543}`
        return dateFormat
    }

    const timeStampCovert = (timeStamp) => {
        const dateTime = DateTime.fromISO(timeStamp).setZone("Asia/Bangkok");
        const thaiDateTime = dateTime.setLocale("th").toFormat("d LLLL ") + (dateTime.year + 543) + dateTime.toFormat(" HH:mm น.");
        return thaiDateTime
    }

    const MyPDFDocument = () => {
        return (
            <Document>
                {paticipate != null && Object.keys(paticipate).map((key, keyIndex) => (
                    <Page size="A4" orientation="portrait" style={styles.page} key={keyIndex}>
                        <Text style={styles.textHeader}>{dateFormatToThai(key)}</Text>
                        <Table>
                            <TH style={styles.tableHeader}>
                                <TD style={[styles.td, { flex: 1 }]}>รหัสนักเรียน</TD>
                                <TD style={[styles.td, { flex: 1 }]}>เวลาที่ลงชื่อ</TD>
                                <TD style={[styles.td, { flex: 1 }]}>สถานะการเข้าร่วม</TD>
                            </TH>
                            {paticipate[key].map((pati, patiIndex) => (
                                <TR key={patiIndex}>
                                    {pati.isJoin ? (
                                        <>
                                            <TD style={[styles.td, {flex: 1}]}>{pati.stdId}</TD>
                                            <TD style={[styles.td, {flex: 1}]}>{timeStampCovert(pati.joinTimestamp)}</TD>
                                            <TD style={[styles.td, {flex: 1}]}>เข้าร่วม</TD>
                                        </>
                                       
                                    )
                                     : (
                                        <>
                                            <TD style={[styles.td, {flex: 1}]}>{pati.stdId}</TD>
                                            <TD style={[styles.td, {flex: 1}]}>-</TD>
                                            <TD style={[styles.td, {flex: 1}]}>ไม่เข้าร่วม</TD>
                                        </>
                                        
                                    )
                                    }
                                    
                                </TR>
                            ))}
                        </Table>
                        
                    </Page>
                    // paticipate[key].map((pati, patiIndex) => (
                    //     <Page size="A4" style={styles.page} orientation="portrait" key={`${patiIndex}`}>
                          
                    //         <Table  style={styles.table}>
                    //             <TH style={styles.tableHeader}>
                    //                 <TD style={[styles.td, { flex: 1 }]}>รหัสนักเรียน</TD>
                    //                 <TD style={[styles.td, { flex: 1 }]}>เวลาที่ลงชื่อ</TD>
                    //                 <TD style={[styles.td, { flex: 1 }]}>สถานะการเข้าร่วม</TD>
                    //             </TH>
                    //             <TR key={patiIndex}>
                    //                 <TD style={[styles.td, { flex: 1 }]}></TD>
                    //                 <TD style={[styles.td, { flex: 1 }]}></TD>
                    //                 <TD style={[styles.td, { flex: 1 }]}></TD>
                    //             </TR>
                    //         </Table>
                    //     </Page>
                    // ))
                
                ))}
            </Document>
        )
    };

    useEffect(() => {
        if(activityId != null && classId != null){
            getPaticipateList();
        }
    },[activityId, classId])
    
    return (
        <>
            {
                paticipate != null && (
                    <PDFDownloadLink document={<MyPDFDocument/>}  fileName={`สรุปการเข้าร่วมกิจกรรมตามห้องเรียน`}>
                        <p className="text-xs py-2 px-3 hover:cursor-pointer hover:bg-blue-500 hover:text-white">
                            {`สรุปการเข้าร่วมกิจกรรมตามห้องเรียน (PDF)`}
                        </p>
                    </PDFDownloadLink>
                )
            }
            {
                paticipate == null && (
                    <p>loading....</p>
                )
            }
        </>    
    );
};

export default FilterByClassroom;