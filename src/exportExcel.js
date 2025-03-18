import axios from 'axios';
import { func } from 'prop-types';
import * as XLSX from 'xlsx';
import { HOSTNAME } from './config';
import { DateTime, Zone } from 'luxon';
import { convertNumberToThaiMonth, formatTitle } from './helper';
const formatAttStatus = (status) => {
    switch (status) {
        case 'present':
            return 'เข้าเรียน';
        case 'absent':
            return 'ไม่เข้าเรียน';
        case 'late':
            return 'มาสาย';
        case 'activity':
            return 'เข้าเรียนกิจกรรม';
        case 'leave':
            return 'ลา';
        default:
            return status;
    }
};

export function AttendanceSummaryByDay(table){
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SheetDay");
    XLSX.writeFile(workbook, "Sheets.xlsx", {compression :true});
}

export async function abstactActivity(activityId, classId, startDate, endDate, className, activityName) {
    let response;
    try{
        const responsed = await axios.get(`${HOSTNAME}/a/activity/abstact/byclassroom/${activityId}/${classId}`);
        if(responsed.status == 200){
            response = responsed.data;
        }else{
            throw new Error(response.data.message);
        };
    }catch(error){
        console.error(error);
    };

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
        return objectKeys;
    };
    const workbook = XLSX.utils.book_new();
    filterParticipate(response).forEach(key => {
        const arrayOfJsonObject = [];
        const dateSplit = key.split('-');
        const dateFormatToThai = `${dateSplit[2]} ${convertNumberToThaiMonth(parseInt(dateSplit[1]))} ${parseInt(dateSplit[0]) + 543}`;
        response[key].forEach((pati) => {
            if(pati.isJoin) {
                const dateTime = DateTime.fromISO(pati.joinTimestamp).setZone("Asia/Bangkok");
                const thaiDateTime = dateTime.setLocale("th").toFormat("d LLLL ") + (dateTime.year + 543) + dateTime.toFormat(" HH:mm น.");
                const formatObject = {
                    'รหัสนักเรียน' : pati.stdId,
                    'ชื่อ-นามสกุล' : `${formatTitle(pati.student.title)} ${pati.student.fName} ${pati.student.lName}`,
                    'เวลาที่ลงชื่อ' : thaiDateTime,
                    'สถานะการเข้าร่วม' : "เข้าร่วม"
                }
            arrayOfJsonObject.push(formatObject);
            }else{
                const formatObject = {
                    'รหัสนักเรียน' : pati.stdId,
                    'ชื่อ-นามสกุล' : `${formatTitle(pati.student.title)} ${pati.student.fName} ${pati.student.lName}`,
                    'เวลาที่ลงชื่อ' : "-",
                    'สถานะการเข้าร่วม' : "ไม่ข้าร่วม"
                }
                arrayOfJsonObject.push(formatObject);
            }
        });
        const worksheet = XLSX.utils.json_to_sheet(arrayOfJsonObject);
        XLSX.utils.book_append_sheet(workbook , worksheet, dateFormatToThai)
    });

    try{
        XLSX.writeFile(workbook, `สรุปการเข้ากิจกรรม ${activityName} ห้อง ${className} วันที่ (${startDate})-(${endDate}).xlsx`, {compression :true});
    }catch(error){
        console.error(error);
    }    
}

export async function abstactActivityFilterByClassroom(activityId, filterRoom, activity) {
    let response;
    try{
        const responsed = await axios.get(`${HOSTNAME}/a/activity/abstact/${activityId}`);
        if(responsed.status == 200){
            response = responsed.data[filterRoom];
            console.log(responsed.data[filterRoom]);
        }else{
            throw new Error(response.data.message);
        };
    }catch(error){
        console.error(error);
    };

    const arrayOfJsonObject = [];
    response.forEach((member) => {
        const newObject = {
            "รหัสนักเรียน":member.stdId,
            "ชื่อ":`${formatTitle(member.title)} ${member.fName} ${member.lName}`,
            "จำนวนการเข้าร่วม": member.participateCount
        }
        arrayOfJsonObject.push(newObject);
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(arrayOfJsonObject);
    const nameSplit = filterRoom.split('/');
    XLSX.utils.book_append_sheet(workbook, worksheet, `ห้อง${nameSplit[0]}_${nameSplit[1]}`);
    try{
        XLSX.writeFile(workbook, `เอกสารสรุปการเข้าร่วมกิจกรรม ${activity.actName} ห้อง${filterRoom}.xlsx`, {compression :true});
    }catch(error){
        console.error(error);
    };
}