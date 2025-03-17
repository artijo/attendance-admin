import { useEffect, useState } from "react";
import { Page, Text, Document, Image , PDFViewer } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import axios from "axios";
import { HOSTNAME } from "../../../config.js";
import { convertNumberToThaiMonth, formatTitle } from "../../../helper.js";
import { DateTime } from "luxon";
import {styles} from "./style.js";
import { useLocation } from "react-router-dom";

function FilterByClassroom() {
  const location = useLocation();
  const { activityId, classId, className, startDate, endDate , activity } = location.state;
  const [keyFilter, setKeyFilter] = useState([]);
  const [participate, setParticipate] = useState({});
  // console.log(location.state.activity);

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let current = DateTime.fromISO(startDate).setZone('Asia/Bangkok').startOf('day');
    const end = DateTime.fromISO(endDate).setZone('Asia/Bangkok').startOf('day');
    
    while (current <= end) {
        dates.push(current.toISODate());
        current = current.plus({ days: 1 });
    }
    return dates;
  };

  const filterParticipate = (participate) => {
    const date = getDatesBetween(startDate, endDate);
    const objectKeys = Object.keys(participate).filter((dateKey) => {
      if(date.includes(dateKey)) {
        return dateKey
      }
    });
    console.log(objectKeys);
    setKeyFilter(objectKeys);
  };

  const getParticipateList = async () => {
    try {
      const response = await axios.get(
        `${HOSTNAME}/a/activity/abstact/byclassroom/${activityId}/${classId}`
      );
      if (response.status === 200) {
        setParticipate(response.data);
        filterParticipate(response.data);
        // console.log(response.data[filtersDate]);
        // console.log(response.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
  

  useEffect(() => {
    getParticipateList();
  },[])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">เอกสาร PDF การเข้าร่วมกิจกรรม {activity.actName} ห้อง{className}</h1>
      <p className="text-xl font-light text-gray-600">ระหว่างวันที่ {dateFormatToThai(startDate)} ถึง {dateFormatToThai(endDate)}</p>
      
      <div className="w-full h-[560px] rounded-2xl shadow-lg">
        {Object.keys(participate).length > 0 && keyFilter.length > 0 ? (
          <PDFViewer
          width={"100%"}
          height={"100%"}
          style={{borderRadius: "1rem"}}
          >
            <Document 
              pageMode="fullScreen"
              title={`เอกสารการเข้าร่วมกิจกรรม ${activity.actName} ห้อง ${className}`}
            >
              <Page size="A4" style={styles.page}  orientation="portrait">
                    <Image src={`/Logo_NPS.png`} style={styles.logoSize}/>
                    <Text style={styles.textHeader}>การเข้าร่วมกิจกรรม {activity.actName} ระหว่างวันที่ {dateFormatToThai(startDate)} ถึง {dateFormatToThai(endDate)} ห้อง {className}</Text>
                    <Text style={styles.textParagraph}>
                      สถานที {activity.actLocation} เริ่ม {activity.actStartTime} สิ้นสุด {activity.actEndTime}
                    </Text>
                    {keyFilter.map((key) => (
                      <Table style={styles.table} key={key}>
                        <Text style={styles.textSpan}>{dateFormatToThai(key)}</Text>
                        <TH style={styles.tableHeader}>
                          <TD style={[styles.td, { flex: 1 }]}>รหัสนักเรียน</TD>
                          <TD style={[styles.td, { flex: 1 }]}>ชื่อ-นามสกุล</TD>
                          <TD style={[styles.td, { flex: 1 }]}>เวลาที่ลงชื่อ</TD>
                          <TD style={[styles.td, { flex: 1 }]}>สถานะการเข้าร่วม</TD>
                        </TH>
                        {participate[key].map((pati, patiIndex) => (
                          <TR key={patiIndex}>
                            <TD style={[styles.td, { flex: 1 }]}>{pati.stdId}</TD>
                            <TD style={[styles.td, { flex: 1 }]}>{formatTitle(pati.student.title)} {pati.student.fName} {pati.student.lName}</TD>
                            <TD style={[styles.td, { flex: 1 }]}>{pati.isJoin ? timeStampConvert(pati.joinTimestamp) : "-"}</TD>
                            <TD style={[styles.td, { flex: 1 }]}> {pati.isJoin ? "เข้าร่วม" : "ไม่เข้าร่วม"}</TD>
                          </TR>
                        ))}
                      </Table>
                    ))}
                    
                  </Page>
            </Document>
          </PDFViewer>) : (
            <div>กำลังโหลด....</div>
          )
        }
        
      </div>
    </div>
    
  );
}

export default FilterByClassroom;
