import { DateTime } from "luxon";

export function formatPhoneNumber(phoneNumber) {
    // ลบตัวอักษรที่ไม่ใช่ตัวเลขออก
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // ตรวจสอบว่าหมายเลขโทรศัพท์มีความยาวเพียงพอ
    if (cleaned.length !== 10) {
      return 'หมายเลขโทรศัพท์ไม่ถูกต้อง';
    }
    
    // เพิ่มฟอร์แมต xxx-xxx-xxxx
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    
    return formatted;
  }
  
export function formatDayOfWeeks(dayOfWeek) {
  const dayOfWeeksThai = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
  for (let i = 0; i <= dayOfWeeksThai.length; i++) {
    if ((dayOfWeek-1) === i) {
      return dayOfWeeksThai[i];
    }
  }
}

export function calculatedTimeToSeconde(hour, miniute) { // สำหรับ .
  return (parseInt(hour)*3600)+(parseInt(miniute)*60);
}

export function convertSecondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${secs}`;
}


export const formatTitle = (title) => {
  switch (title) {
      case 'BOY':
          return 'เด็กชาย';
      case 'GIRL':
          return 'เด็กหญิง';
      case 'MR':
          return 'นาย';
      case 'MS':
          return 'นางสาว';
      default:
          return title;
  }
}

export function calculatedTimeToSecondeDouleDot(time) { // สำหรับ :
  const timeSplit = time.split(':');
  return (parseInt(timeSplit[0])*3600)+(parseInt(timeSplit[1])*60);
}

export function nameFormat(fName, lName) {
  return `${fName} ${lName}`;
}

export function formatTime(time) {
  const timeSplit = time.split(':');
  return `${timeSplit[0]}:${timeSplit[1]}`;
}

export function formatDate(date){
  const dateSplit = date.split('-');
  return `${dateSplit[0]}${dateSplit[1]}${dateSplit[2]}`;
}

export function formatDateTimeISOToDate(dateTimeIso){
  const utctobangkok = DateTime.fromISO(dateTimeIso).setZone('Asia/Bangkok');
  const dateSpilt = utctobangkok.toString().split('T');
  return dateSpilt[0];
}

export function formatDateToThai(date){ // YYYY-MM-DD
  const dateSpilt = date.split("-");
  let month = "";
  let year = parseInt(dateSpilt[0]) + 543;
  let day = "";

  if(parseInt(dateSpilt[2].charAt(0)) === 0){
    day += parseInt(dateSpilt[2].charAt(1));
  }else{
    day += parseInt(dateSpilt[2]);
  }

  const thaiMonths = [
      "มกราคม",   // เดือนที่ 1
      "กุมภาพันธ์", // เดือนที่ 2
      "มีนาคม",     // เดือนที่ 3
      "เมษายน",     // เดือนที่ 4
      "พฤษภาคม",   // เดือนที่ 5
      "มิถุนายน",   // เดือนที่ 6
      "กรกฎาคม",   // เดือนที่ 7
      "สิงหาคม",    // เดือนที่ 8
      "กันยายน",    // เดือนที่ 9
      "ตุลาคม",     // เดือนที่ 10
      "พฤศจิกายน", // เดือนที่ 11
      "ธันวาคม"     // เดือนที่ 12
  ];

  // ตรวจสอบว่าเลขเดือนอยู่ในช่วง 1-12
  if (parseInt(dateSpilt[1]) >= 1 && parseInt(dateSpilt[1]) <= 12) {
      month += thaiMonths[parseInt(dateSpilt[1]) - 1];
  } else {
      console.log("เลขเดือนไม่ถูกต้อง")
  }

  return `${day} ${month} ${year}`
}

export function formatTypeToThai(type){
  if(type === "RATCHAKHAN"){
    return "วันหยุดราชการ";
  }else{
    return "วันหยุดโรงเรียน";
  }
}

export function formatDateYYYYMMDD(date) {
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  return `${parseInt(year)}-${month}-${day}`;
}

export function convertNumberToThaiMonth(monthNumber) {
  const thaiMonths = [
    "มกราคม",   // เดือนที่ 1
    "กุมภาพันธ์", // เดือนที่ 2
    "มีนาคม",     // เดือนที่ 3
    "เมษายน",     // เดือนที่ 4
    "พฤษภาคม",   // เดือนที่ 5
    "มิถุนายน",   // เดือนที่ 6
    "กรกฎาคม",   // เดือนที่ 7
    "สิงหาคม",    // เดือนที่ 8
    "กันยายน",    // เดือนที่ 9
    "ตุลาคม",     // เดือนที่ 10
    "พฤศจิกายน", // เดือนที่ 11
    "ธันวาคม"     // เดือนที่ 12
  ];

  if (monthNumber >= 1 && monthNumber <= 12) {
    return thaiMonths[monthNumber-1];
  } else {
    return "เลขเดือนไม่ถูกต้อง";
  }
}

  export function dateTimeFormat(dateTime){
    const dateTimeFormat = formatDateTimeISOToDate(dateTime);
    const dateSplit = dateTimeFormat.split('-');
    return `${dateSplit[2]}/${dateSplit[1]}/${parseInt(dateSplit[0])+543}`;
  }