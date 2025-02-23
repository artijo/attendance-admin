import axios from 'axios';
import { func } from 'prop-types';
import * as XLSX from 'xlsx';
import { HOSTNAME } from './config';
import { DateTime, Zone } from 'luxon';
import { convertNumberToThaiMonth } from './helper';
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

export async function abstactActivity(activityId, classId) {
    let response;
    try{
        const responsed = await axios.get(`${HOSTNAME}/a/activity/abstact/byclassroom/${activityId}/${classId}`);
        if(responsed.status == 200){
            response = responsed.data;
            console.log(responsed.data);
        }else{
            throw new Error(response.data.message);
        };
    }catch(error){
        console.error(error);
    };
    const keyObject = Object.keys(response);
    const workbook = XLSX.utils.book_new();
    keyObject.forEach((key) => {
        const arrayOfJsonObject = []
        const dateSplit = key.split('-');
        const dateFormatToThai = `${dateSplit[2]} ${convertNumberToThaiMonth(parseInt(dateSplit[1]))} ${parseInt(dateSplit[0]) + 543}`
        response[key].forEach((parcitpate) => {
            if(parcitpate.isJoin){
                const dateTime = DateTime.fromISO(parcitpate.joinTimestamp).setZone("Asia/Bangkok");
                const thaiDateTime = dateTime.setLocale("th").toFormat("d LLLL ") + (dateTime.year + 543) + dateTime.toFormat(" HH:mm น.");
                const formatObject = {
                    'รหัสนักเรียน' : parcitpate.stdId,
                    'เวลาที่ลงชื่อ' : thaiDateTime,
                    'สถานะการเข้าร่วม': "เข้าร่วม"
                }
                arrayOfJsonObject.push(formatObject)
            }else{
                const formatObject = {
                    'รหัสนักเรียน' : parcitpate.stdId,
                    'เวลาที่ลงชื่อ' : "-",
                    'สถานะการเข้าร่วม': "ไม่เข้าร่วม"
                }
                arrayOfJsonObject.push(formatObject)
            }
        })
        // console.log(arrayOfJsonObject);
        const worksheet = XLSX.utils.json_to_sheet(arrayOfJsonObject);
        XLSX.utils.book_append_sheet(workbook, worksheet, dateFormatToThai);
    });
    try{
        XLSX.writeFile(workbook, "สรุปการเข้ากิจกรรมตามห้องเรียน.xlsx", {compression :true});
    }catch(error){
        console.error(error);
    }
    
}


export async function abstactActivityFilterByClassroom(activityId) {
    let response;
    try{
        const responsed = await axios.get(`${HOSTNAME}/a/activity/abstact/${activityId}`);
        if(responsed.status == 200){
            response = responsed.data;
            console.log(responsed.data);
        }else{
            throw new Error(response.data.message);
        };
    }catch(error){
        console.error(error);
    };
    
}