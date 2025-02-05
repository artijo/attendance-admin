import * as XLSX from 'xlsx';
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

// export function AttendanceBySubject(studentArrayOfJson) {
//     const worksheet = XLSX.utils.table_to_sheet(table);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "SheetDay");
//     XLSX.writeFile(workbook, "Sheets.xlsx", {compression :true});
// }