import { useEffect, useState } from "react";
import { styles } from "./style.js";
import { Page, Text, Document, Image, PDFViewer } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import axios from "axios";
import { HOSTNAME } from "../../../config.js";
import { useLocation } from "react-router-dom";
import { formatTitle } from "../../../helper.js";

function FilterByRoomJoin() {
  const [participate, setParticipate] = useState([]);
  const location = useLocation();
  const { activityId, className, filterRoom, activity } = location.state;
  // console.log(filterRoom);

  const getParticipateList = async () => {
    try {
      const response = await axios.get(`${HOSTNAME}/a/activity/abstact/${activityId}`);
      if (response.status == 200) {
        setParticipate(response.data[filterRoom]);
        // console.log(response.data[filterRoom]);
      } else {
        throw new Error(response.data.message);
      };
    } catch (error) {
      console.error(error);
    };
  }

  useEffect(() => {
    getParticipateList();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">เอกสาร PDF การเข้าร่วมกิจกรรม {activity.actName} ห้อง {className}</h1>
      <div className="w-full h-[560px] rounded-2xl shadow-lg">
        {participate.length > 0 ? (
          <PDFViewer
            width={"100%"}
            height={"100%"}
            style={{ borderRadius: "1rem" }}
          >
            <Document
              pageMode="fullScreen"
              title={`เอกสารการเข้าร่วมกิจกรรม ${activity.actName }วันที่ ห้อง ${className}`}
            >
              <Page size="A4" style={styles.page} orientation="portrait">
                <Image src={`/Logo_NPS.png`} style={styles.logoSize} />
                <Text style={styles.textHeader}>สรุปการเข้าร่วมกิจกรรม {activity.actName} ห้อง {className}</Text>
                <Text style={styles.textParagraph}>
                  สถานที {activity.actLocation} เริ่ม {activity.actStartTime} สิ้นสุด {activity.actEndTime}
                </Text>
                <Table style={styles.table}>
                  <TH style={styles.tableHeader}>
                    <TD style={[styles.td, { flex: 1 }]}>รหัสนักเรียน</TD>
                    <TD style={[styles.td, { flex: 1 }]}>ชื่อ-นามสกุล</TD>
                    <TD style={[styles.td, { flex: 1 }]}>จำนวนการเข้าร่วม</TD>
                  </TH>
                  {participate.map((pati, patiIndex) => (
                    <TR key={patiIndex}>
                      <TD style={[styles.td, { flex: 1 }]}>{pati.stdId}</TD>
                      <TD style={[styles.td, { flex: 1 }]}>{formatTitle(pati.title)} {pati.fName} {pati.lName}</TD>
                      <TD style={[styles.td, { flex: 1 }]}> {pati.participateCount}</TD>
                    </TR>
                  ))}
                </Table>
              </Page>
            </Document>
          </PDFViewer>) : (
          <div>กำลังโหลด....</div>
        )}
      </div>
    </div>

  );
}

export default FilterByRoomJoin;