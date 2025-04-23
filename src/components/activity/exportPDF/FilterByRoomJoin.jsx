import { useEffect, useState } from "react";
import { styles } from "./style.js";
import { Page, Text, Document, Image, PDFViewer, View } from "@react-pdf/renderer";
import axios from "axios";
import { HOSTNAME } from "../../../config.js";
import { useLocation, Link } from "react-router-dom";
import { formatTitle } from "../../../helper.js";

function FilterByRoomJoin() {
  const [participate, setParticipate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { activityId, className, filterRoom, activity } = location.state;

  console.log(participate);
  const getParticipateList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${HOSTNAME}/a/activity/abstact/${activityId}`);
      if (response.status === 200) {
        if (response.data[filterRoom]) {
          setParticipate(response.data[filterRoom]);
        } else {
          setError("ไม่พบข้อมูลการเข้าร่วมกิจกรรมของห้องเรียนนี้");
        }
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

  useEffect(() => {
    getParticipateList();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">รายงาน PDF สรุปการเข้าร่วมกิจกรรม</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
          to={`/activity/participate/filterbyclassroomjoin`}
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
              {participate.length > 0 ? (
                <PDFViewer width={"100%"} height={"100%"} style={{ borderRadius: "0.5rem" }}>
                  <Document
                    pageMode="fullScreen"
                    title={`เอกสารสรุปการเข้าร่วมกิจกรรม ${activity.actName} ห้อง ${className}`}
                  >
                    <Page size="A4" style={styles.page} orientation="portrait">
                      <Image src={`/Logo_NPS.png`} style={styles.logoSize} />
                      <Text style={styles.textHeader}>สรุปการเข้าร่วมกิจกรรม {activity.actName} ห้อง {className}</Text>
                      <Text style={styles.textParagraph}>
                        สถานที่ {activity.actLocation} เวลา {activity.actStartTime} - {activity.actEndTime} น.
                      </Text>
                      <View style={styles.tableHeader}>
                        <Text style={[styles.tableColumn1, { fontWeight: "bold" }]}>รหัสนักเรียน</Text>
                        <Text style={[styles.tableColumn2, { fontWeight: "bold" }]}>ชื่อ-นามสกุล</Text>
                        <Text style={[styles.tableColumn2, { fontWeight: "bold" }]}>จำนวนการเข้าร่วม</Text>
                      </View>
                      {participate.map((pati, patiIndex) => (
                        <View style={styles.tableRow} key={patiIndex}>
                          <Text style={[styles.tableColumn1]}>{pati.stdId}</Text>
                          <Text style={[styles.tableColumn2]}>{formatTitle(pati.title)} {pati.fName} {pati.lName}</Text>
                          <Text style={[styles.tableColumn2]}>{pati.participateCount}</Text>
                        </View>
                      ))}
                    </Page>
                  </Document>
                </PDFViewer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-color-alt mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลการเข้าร่วมกิจกรรม</h2>
                  <p className="text-text-color-alt font-body">ไม่มีนักเรียนเข้าร่วมกิจกรรมในห้องเรียนนี้</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterByRoomJoin;