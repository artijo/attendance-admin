import { styles } from "./style.js";
import { Page, Text, Document, PDFDownloadLink } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
// @ts-ignore
import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../../config.js";
import { convertNumberToThaiMonth } from "../../../helper.js";
import PropTypes from 'prop-types';
import { DateTime } from "luxon";
function FilterByClassroom({ activityId, classId , title}) {
    const [paticipate, setPaticipate] = useState(null);
    const getPaticipateList = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/activity/abstact/byclassroom/${activityId}/${classId}`);
            if (response.status === 200) {
                setPaticipate(response.data);
                console.log(response.data);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const dateFormatToThai = (date) => {
        const dateSplit = date.split('-');
        return `${dateSplit[2]} ${convertNumberToThaiMonth(parseInt(dateSplit[1]))} ${parseInt(dateSplit[0]) + 543}`;
    };

    const timeStampCovert = (timeStamp) => {
        const dateTime = DateTime.fromISO(timeStamp).setZone("Asia/Bangkok");
        return dateTime.setLocale("th").toFormat("d LLLL ") + (dateTime.year + 543) + dateTime.toFormat(" HH:mm น.");
    };

    const MyPDFDocument = () => (
        <Document>
            {paticipate &&
                Object.keys(paticipate).map((key, keyIndex) => (
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
                                    <TD style={[styles.td, { flex: 1 }]}>{pati.stdId}</TD>
                                    <TD style={[styles.td, { flex: 1 }]}>
                                        {pati.isJoin ? timeStampCovert(pati.joinTimestamp) : "-"}
                                    </TD>
                                    <TD style={[styles.td, { flex: 1 }]}>
                                        {pati.isJoin ? "เข้าร่วม" : "ไม่เข้าร่วม"}
                                    </TD>
                                </TR>
                            ))}
                        </Table>
                    </Page>
                ))}
        </Document>
    );

    useEffect(() => {
        getPaticipateList()
    },[])

    return (
        <>
            {paticipate ? (
                <PDFDownloadLink document={<MyPDFDocument/>} fileName={`สรุปการเข้าร่วมกิจกรรมตามห้องเรียน ${title}.pdf`}>
                    {({ blob, url, loading, error }) =>
                        loading ? 'Loading document...' : 'Download now!'
                    }
                </PDFDownloadLink>
            ) : (
                <p>loading....</p>
            )}
        </>
    );
}

export default FilterByClassroom;
