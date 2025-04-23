import axios from 'axios';
import { func } from 'prop-types';
import * as XLSX from 'xlsx';
import { HOSTNAME } from './config';
import { DateTime, Zone } from 'luxon';
import { convertNumberToThaiMonth, dateTimeFormat, formatTitle } from './helper';
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

export function AttendanceSummaryByDay(table, fileName){
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet 1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`, {compression :true});
}

export function summaryAttendeanceBySubjectFilterByDay(objectJson, month, fileName, classroomInfo, subject){
    // console.log(objectJson);
    // console.log(classroomInfo);
    try{
        const sheetData = [
            ['สรุปรายละเอียดการเข้าเรียนตามวิชา'],
            [`วิชา: ${subject.subNameThai} (${subject.subCode})`],
            [`เดือน: ${convertNumberToThaiMonth(month)}`],
            [`ห้อง: ${classroomInfo.classLevel}/${classroomInfo.classRoom} ปีการศึกษา: ${classroomInfo.term.academicYear + 543} เทอม: ${classroomInfo.term.semester}`],   
            [],
            ['เลขที่','รหัสนักเรียน', 'ชื่อ-นามสกุล'],
        ]
    
    
        //Header 1
        objectJson.data[0].attendance.forEach((attInfo, index) => {
            if(attInfo.month == month){
    
                sheetData[5].push(`${index + 1}\n(${dateTimeFormat(attInfo.studingTimeDate)})`);
            }
        });
    
        //Body info
        objectJson.data.forEach((object, objectIndex) => {
            const arraySheet = [
                object.stdNo,
                object.stdId,
                `${formatTitle(object.title)} ${object.fName} ${object.lName}`
            ]
            
            object.attendance.forEach((attend, index) => {
                if(attend.month == month){
                    let attendStatus = attend.attStatus.toLowerCase();
                    if(attendStatus == "absent"){
                        arraySheet.push("ไม่เข้าเรียน");
                    }else if(attendStatus == "present"){
                        arraySheet.push("เข้าเรียน");
                    }else if(attendStatus == "late"){
                        arraySheet.push("มาสาย");
                    }else if(attendStatus == "activity"){
                        arraySheet.push("เข้าร่วมกิจกรรม");
                    }else if(attendStatus == "leave"){
                        arraySheet.push("ลา");
                    }else{
                        arraySheet.push("-")
                    }
                }
            })
            sheetData.push(arraySheet);
        });
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        worksheet["!cols"] =[
            { wch: 10 },
            { wch: 10 },
            { wch: 25 },

        ]
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "สรุป");
        XLSX.writeFile(workbook, `${fileName}.xlsx`, {compression :true});
    }catch(error){
        console.error(error);
    }   
    

}

export function summaryAttendeanceByDay(objectJson, fileName, classroomInfo, dateformat){
    try{
        const sheetData = [
            ['สรุปรายละเอียดการเข้าเรียนตามวัน'],
            [`ประจำวันที: ${dateformat.day}/${dateformat.month}/${dateformat.year+543}`],
            [`ห้อง: ${classroomInfo.classLevel}/${classroomInfo.classRoom}`],
            [],
            ['คาบที่','',''],
            ['รหัสวิชา','',''],
            ['เลขที่','รหัสนักเรียน', 'ชื่อ-นามสกุล'],
        ]
        //summary 
        const summaryData = [
            ['มาเรียน', '',''],
            ['มาสาย','',''],
            ['ขาดเรียน','',''],
            ['ลา','',''],
            ['กิจกรรม','','']
        ];

        // console.log(objectJson);
        // tableHeader 1
        objectJson[0].attendance.forEach((_, index) => {
            sheetData[4].push(`${index + 1}`);
            summaryData[0].push(0);
            summaryData[1].push(0);
            summaryData[2].push(0);
            summaryData[3].push(0);
            summaryData[4].push(0);
        })
        
        // console.log(summaryData[0][3]);
        //tableHeader 2
        objectJson[0].attendance.forEach((object) => {
            sheetData[5].push(`${object.subjectCode}`);
        })
        //tableHeader 3
        objectJson[0].attendance.forEach((object) => {
            sheetData[6].push(`${object.subjectName}`);
        })

        //Add Data
        objectJson.forEach((object, objectIndex) => {
            const studentData = [
                object.stdNo,
                object.stdId,
                `${formatTitle(object.title)} ${object.fName} ${object.lName}`
            ];
            // console.log(object.attendance);
            object.attendance.forEach((attend, index) => {
                let attendStatus = attend.attStatus.toLowerCase();
                if(attendStatus == "absent"){
                    summaryData[2][index + 3] += 1;
                    studentData.push("ขาดเรียน");
                }else if(attendStatus == "present"){
                    summaryData[0][index + 3] += 1;
                    studentData.push("เข้าเรียน");
                }else if(attendStatus == "late"){
                    summaryData[1][index + 3] += 1;
                    studentData.push("มาสาย");
                }else if(attendStatus == "activity"){
                    summaryData[4][index + 3] += 1;
                    studentData.push("เข้าเรียนกิจกรรม");
                }else if(attendStatus == "leave"){
                    summaryData[3][index + 3] += 1;
                    studentData.push("ลา");
                }else{
                    studentData.push("-")
                }
            })
            sheetData.push(studentData);

        })
        sheetData.push(...summaryData);
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        worksheet["!merges"] = [
            XLSX.utils.decode_range("A5:C5"),
            XLSX.utils.decode_range("A6:C6"),
            // XLSX.utils.decode_range("A12:C12"),
            // XLSX.utils.decode_range("A13:C13"),
            // XLSX.utils.decode_range("A14:C14"),
            // XLSX.utils.decode_range("A15:C15"),
            // XLSX.utils.decode_range("A16:C16"),
        ]
        worksheet["!cols"] =[
            { wch: 10 },
            { wch: 10 },
            { wch: 30 },
            { wch: 25 },
            { wch: 25 },
            { wch: 25 },
            { wch: 25 },
            { wch: 25 },
            { wch: 25 },
            { wch: 25 },
            { wch: 25 },
        ]
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "สรุป");
        
        XLSX.writeFile(workbook, `${fileName}.xlsx`, {compression :true});
    }catch(error){
        console.error(error);
    }
}

export async function abstactActivityByRoomJoin(activityId, classId, startDate, endDate, className, activityName, activity) {
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
        // const arrayOfJsonObject = [];
        const dateSplit = key.split('-');
        const dateFormatToThai = `${dateSplit[2]} ${convertNumberToThaiMonth(parseInt(dateSplit[1]))} ${parseInt(dateSplit[0]) + 543}`;
        const sheetData = [
            [`กิจกรรม: ${activityName}`],
            [`สถานที่จัดกิจกรรม: ${activity.actLocation}`],
            [`วันที่: ${dateFormatToThai}`],
            [`ห้อง: ${className}`],
            [],
            ['รหัสนักเรียน', 'ชื่อ-นามสกุล', 'เวลาที่ลงชื่อ', 'สถานะการเข้าร่วม'],
        ];
        response[key].forEach((pati) => {
            if (pati.isJoin) {
                const dateTime = DateTime.fromISO(pati.joinTimestamp).setZone("Asia/Bangkok");
                const thaiDateTime = dateTime.setLocale("th").toFormat("d LLLL ") + (dateTime.year + 543) + dateTime.toFormat(" HH:mm น.");
                sheetData.push([
                    pati.stdId,
                    `${formatTitle(pati.student.title)} ${pati.student.fName} ${pati.student.lName}`,
                    thaiDateTime,
                    "เข้าร่วม"
                ]);
            } else {
                sheetData.push([
                    pati.stdId,
                    `${formatTitle(pati.student.title)} ${pati.student.fName} ${pati.student.lName}`,
                    "-",
                    "ไม่เข้าร่วม"
                ]);
            }
        });

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        // console.log(worksheet);
        worksheet['!cols'] = [
            { wch: 15 },  // รหัสนักเรียน
            { wch: 25 },  // ชื่อ-นามสกุล
            { wch: 30 },  // เวลาที่ลงชื่อ
            { wch: 15 },  // สถานะการเข้าร่วม
        ];
        XLSX.utils.book_append_sheet(workbook , worksheet, dateFormatToThai)
    });

    try{
        XLSX.writeFile(workbook, `สรุปการเข้ากิจกรรม ${activityName} ห้อง ${className} วันที่ (${startDate})-(${endDate}).xlsx`, {compression :true});
    }catch(error){
        console.error(error);
    }    
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

    const sheetData = [
        [`กิจกรรม: ${activity.actName}`],
        [`สถานที่จัดกิจกรรม: ${activity.actLocation}`],
        [`ห้อง: ${filterRoom}`],
        [],
        ['รหัสนักเรียน', 'ชื่อ-นามสกุล', 'จำนวนการเข้าร่วม'],
    ];

    // const arrayOfJsonObject = [];
    response.forEach((member) => {
        sheetData.push([
            member.stdId,
            `${formatTitle(member.title)} ${member.fName} ${member.lName}`,
            member.participateCount
        ]);
        // const newObject = {
        //     "รหัสนักเรียน":member.stdId,
        //     "ชื่อ":`${formatTitle(member.title)} ${member.fName} ${member.lName}`,
        //     "จำนวนการเข้าร่วม": member.participateCount
        // }
        // arrayOfJsonObject.push(newObject);
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet['!cols'] = [
        { wch: 15 },  
        { wch: 25 },  
        { wch: 10 }, 
    ];
    const nameSplit = filterRoom.split('/');
    XLSX.utils.book_append_sheet(workbook, worksheet, `ห้อง${nameSplit[0]}_${nameSplit[1]}`);
    try{
        XLSX.writeFile(workbook, `เอกสารสรุปการเข้าร่วมกิจกรรม ${activity.actName} ห้อง${filterRoom}.xlsx`, {compression :true});
    }catch(error){
        console.error(error);
    };
}