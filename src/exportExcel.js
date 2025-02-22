import axios from 'axios';
import { func } from 'prop-types';
import * as XLSX from 'xlsx';
import { HOSTNAME } from './config';
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
    console.log(activityId + " " + classId);
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
    console.log(response);
    
}


// export function AttendanceBySubject(studentArrayOfJson) {
//     const worksheet = XLSX.utils.table_to_sheet(table);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "SheetDay");
//     XLSX.writeFile(workbook, "Sheets.xlsx", {compression :true});
// }