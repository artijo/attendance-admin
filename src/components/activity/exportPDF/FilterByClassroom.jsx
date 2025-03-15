import { styles } from "./style.js";
import { Page, Text, Document, PDFDownloadLink } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
// @ts-ignore
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { HOSTNAME } from "../../../config.js";
import { convertNumberToThaiMonth } from "../../../helper.js";
import PropTypes from "prop-types";
import { DateTime } from "luxon";
import React from "react";

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

function FilterByClassroom({ activityId, classId, className }) {
  const [participate, setParticipate] = useState({});
  const [isDownloadClick, setIsDownloadClick] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const getParticipateList = async () => {
    try {
      const response = await axios.get(
        `${HOSTNAME}/a/activity/abstact/byclassroom/${activityId}/${classId}`
      );
      if (response.status === 200) {
        setParticipate(response.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadButton = () => {
    setIsDownloadClick((prevState) => !prevState);
    getParticipateList();
  }

  const autoClickDownload = (url, fileName) => {
    if(url === null) {
      return;
    }else{
      let alink = document.createElement("a");
      alink.href = url;
      alink.download = fileName;
      alink.click();
      alink.remove();
    }
  }

  const dateFormatToThai = (date) => {
    const dateSplit = date.split("-");
    return `${dateSplit[2]} ${convertNumberToThaiMonth(parseInt(dateSplit[1]))} ${parseInt(dateSplit[0]) + 543}`;
  };

  const timeStampConvert = (timeStamp) => {
    const dateTime = DateTime.fromISO(timeStamp).setZone("Asia/Bangkok");
    return (
      dateTime.setLocale("th").toFormat("d LLLL ") +
      (dateTime.year + 543) +
      dateTime.toFormat(" HH:mm น.")
    );
  };

  const MyPDFDocument = () => (
    <Document pageMode="fullScreen">
      {Object.keys(participate).length > 0 ? (
        Object.keys(participate).map((key, keyIndex) => (
          <Page size="A4" orientation="portrait" style={styles.page} key={keyIndex}>
            <Text style={styles.textHeader}>{dateFormatToThai(key)}</Text>
            <Table style={styles.table}>
              <TH style={styles.tableHeader}>
                <TD style={[styles.td,{flex:1}]}>รหัสนักเรียน</TD>
                <TD  style={[styles.td,{flex:1}]}>เวลาที่ลงชื่อ</TD>
                <TD style={[styles.td,{flex:1}]}>สถานะการเข้าร่วม</TD>
              </TH>
              {participate[key].map((pati, patiIndex) => (
                <TR key={patiIndex}>
                  <TD style={[styles.td, { flex: 1 }]}>{pati.stdId}</TD>
                  <TD style={[styles.td, { flex: 1 }]}>
                    {pati.isJoin ? timeStampConvert(pati.joinTimestamp) : "-"}
                  </TD>
                  <TD style={[styles.td, { flex: 1 }]}>
                    {pati.isJoin ? "เข้าร่วม" : "ไม่เข้าร่วม"}
                  </TD>
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
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {className}
        </th>
        <td className="px-6 py-4">
          {!isDownloadClick && (
            <button 
              className="px-4 py-1 text-xs bg-blue-600 text-white cursor-pointer rounded-full hover:bg-blue-500"
              onClick={() => handleDownloadButton()}
            >
              ดาวน์โหลด    
            </button>
          )}
          {Object.keys(participate).length > 0 && (
            <ErrorBoundary>
              <PDFDownloadLink
                document={<MyPDFDocument />}
                fileName={`สรุปการเข้าร่วมกิจกรรมตามห้องเรียน_${className}.pdf`}
              >
                {({ blob, url, loading, error }) => {
                  useEffect(() => {
                    if(!loading) {
                      autoClickDownload(url, `สรุปการเข้าร่วมกิจกรรมตามห้องเรียน_${className}.pdf`);
                    }
                  },[loading,url])
                  return (
                    <button
                      className="px-4 py-1 text-xs bg-blue-600 text-white cursor-pointer rounded-full hover:bg-blue-500"
                    >
                      {loading ? "กำลังเตรียมเอกสาร PDF..." : "ดาวน์โหลด"}
                    </button>
                  ) ;
                }}
              </PDFDownloadLink>
            </ErrorBoundary>
          )}
        </td>
      </tr>
    </>
  );
}

export default FilterByClassroom;
