import React, { useEffect, useState } from "react";
import { Page, Text, Document, Image, PDFViewer, View } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import axios from "axios";
import { HOSTNAME } from "../../../config.js";
import { convertNumberToThaiMonth, formatTitle } from "../../../helper.js";
import { DateTime } from "luxon";
import { styles } from "./style.js";
import { useLocation, Link } from "react-router-dom";


function FilterByClassroom() {
  const location = useLocation();
  const { activityId, classId, className, startDate, endDate, activity } = location.state;
  const [keyFilter, setKeyFilter] = useState([]);
  const [participate, setParticipate] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const dates = getDatesBetween(startDate, endDate);
    const objectKeys = Object.keys(participate).filter((dateKey) => {
      return dates.includes(dateKey);
    });
    setKeyFilter(objectKeys);
  };

  const getParticipateList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${HOSTNAME}/a/activity/abstact/byclassroom/${activityId}/${classId}`
      );
      if (response.status === 200) {
        setParticipate(response.data);
        filterParticipate(response.data);
      } else {
        throw new Error(response.data.message || "ไม่สามารถโหลดข้อมูลได้");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(styles.table);

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
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายงาน PDF การเข้าร่วมกิจกรรม</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium text-text-color font-heading">
              {activity.actName}
            </h2>
            <p className="text-sm text-text-color-alt font-body">ห้อง {className}</p>
          </div>
        </div>

        <Link
          to={`/activity/participate/filterbyclassroom`}
          state={{ classrooms: location.state.classrooms, activityId: activityId, activity: activity }}
          className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          กลับไปหน้าเลือกห้อง
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-color font-heading">ช่วงวันที่แสดงในรายงาน</h3>
                <p className="text-text-color-alt font-body">
                  {dateFormatToThai(startDate)} ถึง {dateFormatToThai(endDate)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-line rounded-lg p-4">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-text-color font-body">รายละเอียดกิจกรรม</h4>
                  <p className="text-sm text-text-color-alt font-body mt-1">
                    สถานที่: {activity.actLocation} | เวลา: {activity.actStartTime} - {activity.actEndTime} น.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="ml-3 text-text-color-alt font-body">กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>{error}</div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[700px] rounded-xl overflow-hidden border border-line">
              {Object.keys(participate).length > 0 && keyFilter.length > 0 ? (
                <PDFViewer width={"100%"} height={"100%"} style={{ borderRadius: "0.5rem" }}>
                  <Document
                    pageMode="fullScreen"
                    title={`เอกสารการเข้าร่วมกิจกรรม ${activity.actName} ห้อง ${className}`}
                  >
                    <Page size="A4" style={styles.page} orientation="portrait">
                      <Image src={`/Logo_NPS.png`} style={styles.logoSize} />
                      <Text style={styles.textHeader}>การเข้าร่วมกิจกรรม {activity.actName} ระหว่างวันที่ {dateFormatToThai(startDate)} ถึง {dateFormatToThai(endDate)} ห้อง {className}</Text>
                      <Text style={styles.textParagraph}>
                        สถานที่ {activity.actLocation} เริ่ม {activity.actStartTime} สิ้นสุด {activity.actEndTime}
                      </Text>
                      {keyFilter.map((key) => (
                        <React.Fragment key={key}>
                          <Text style={styles.textSpan}>{dateFormatToThai(key)}</Text>
                          <View style={styles.tableHeader}>
                            <Text style={[styles.tableColumn1, { fontWeight: "bold" }]}>รหัสนักเรียน</Text>
                            <Text style={[styles.tableColumn2, { fontWeight: "bold" }]}>ชื่อ-นามสกุล</Text>
                            <Text style={[styles.tableColumn2, { fontWeight: "bold" }]}>เวลาที่ลงชื่อ</Text>
                            <Text style={[styles.tableColumn2, { fontWeight: "bold" }]}>สถานะการเข้าร่วม</Text>
                          </View>
                          {participate[key].map((pati, patiIndex) => (
                            <View style={styles.tableRow} key={patiIndex}>
                              <Text style={[styles.tableColumn1]}>{pati.stdId}</Text>
                              <Text style={[styles.tableColumn2]}>{formatTitle(pati.student.title)} {pati.student.fName} {pati.student.lName}</Text>
                              <Text style={[styles.tableColumn2]}>{pati.isJoin ? timeStampConvert(pati.joinTimestamp) : "-"}</Text>
                              <Text style={[styles.tableColumn2]}>{pati.isJoin ? "เข้าร่วม" : "ไม่เข้าร่วม"}</Text>
                            </View>
                          ))}
                        </React.Fragment>
                      ))}
                    </Page>
                  </Document>
                </PDFViewer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลการเข้าร่วมกิจกรรม</h2>
                  <p className="text-text-color-alt font-body">ไม่มีข้อมูลการเข้าร่วมในช่วงวันที่เลือก</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterByClassroom;
