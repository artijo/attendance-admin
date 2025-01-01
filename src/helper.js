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


export function calculatedTimeToSecondeDouleDot(time) { // สำหรับ :
  const timeSplit = time.split(':');
  return (parseInt(timeSplit[0])*3600)+(parseInt(timeSplit[1])*60);
  // return (parseInt(hour)*3600)+(parseInt(miniute)*60);
}

export function nameFormat(fName, lName) {
  return `${fName} ${lName}`;
}

export function formatTime(time) {
  const timeSplit = time.split(':');
  return `${timeSplit[0]}:${timeSplit[1]}`;
}
