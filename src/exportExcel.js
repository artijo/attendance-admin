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

export function AttendanceBySubject(studentArrayOfJson) {

    const headeFixRow = studentArrayOfJson[0].attendance.map((_, index) => `คาบที่ ${index+1}`);
    const cellItemRows = studentArrayOfJson.map((student) => {
        const attendance = student.attendance.reduce((prev, curr, index) => {
            const timeAt = `คาบที่ ${index+1}`;
            prev[timeAt] = (curr.attStatus != null ? formatAttStatus(curr.attStatus.toLowerCase()) : '-')
            return prev;
        },{})
        return (
            {
                "เลขที่":student.stdNo,
                "รหัสนักเรียน":student.stdId,
                "ชื่อนามสกุล":`${student.fName} ${student.lName}`,
                ...attendance
            }
        )
    })
    
    const worksheet = XLSX.utils.json_to_sheet(cellItemRows );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook,worksheet, "SheetSubject")
    XLSX.utils.sheet_add_aoa(
        worksheet,
        [
            ["เลขที่","รหัสนักเรียน","ชื่อนามสกุล",...headeFixRow]
        ],
        {origin:"A1"}
    )
    XLSX.writeFile(workbook, "SheetsSubject.xlsx", {compression :true});

}