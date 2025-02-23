import { HOSTNAME } from "../../config";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { convertNumberToThaiMonth } from "../../helper";
import ExportExcelButton from "../../components/exportExcelButton";
import { abstactActivity, abstactActivityFilterByClassroom } from "../../exportExcel";

function Participant() {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState('all');

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${HOSTNAME}/a/activity/${id}`);
                if (response.status === 200) {
                    setActivity(response.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id]);

    useEffect(() => {
        if (activity) {
            const now = DateTime.now().setZone('Asia/Bangkok');
            const startDate = DateTime.fromISO(activity.actDate).setZone('Asia/Bangkok');
            const endDate = DateTime.fromISO(activity.actDateEnd).setZone('Asia/Bangkok');
            
            // Check if current date is within activity period
            if (now >= startDate && now <= endDate) {
                setSelectedDate(now.toISODate());
            } else {
                // If not in period, set to activity end date
                setSelectedDate(endDate.toISODate());
            }
        }
    }, [activity]);

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

    const isRecordMatchingDate = (record) => {
        if (!selectedDate) return true;
        const recordDate = DateTime.fromISO(record.joinTimestamp).setZone('Asia/Bangkok');
        const filterDate = DateTime.fromISO(selectedDate).setZone('Asia/Bangkok');
        return recordDate.hasSame(filterDate, 'day');
    };

    const isRecordMatchingFilters = (record) => {
        const matchesDate = isRecordMatchingDate(record);
        const matchesClassroom = selectedClassroom === 'all' || 
            (record.student.classroomMembers[0]?.classroom.classId === selectedClassroom);
        return matchesDate && matchesClassroom;
    };

    const getUniqueClassrooms = () => {
        if (!activity?.actParticipate) return [];
        const classrooms = activity.actParticipate.map(record => {
            const classroomMember = record.student.classroomMembers[0]; // Get first classroom membership
            if (!classroomMember) return null;
            
            return {
                classId: classroomMember.classroom.classId,
                className: `ม.${classroomMember.classroom.classLevel}/${classroomMember.classroom.classRoom}`
            };
        }).filter(Boolean); // Remove null values
        
        return [...new Map(classrooms.map(item => [item.classId, item])).values()]
            .sort((a, b) => a.className.localeCompare(b.className));
    };

    const formatThaiDateTime = (dateTime) => {
        const dt = DateTime.fromISO(dateTime).setZone('Asia/Bangkok');
        const day = dt.toFormat('d');
        const month = convertNumberToThaiMonth(dt.month);
        const year = dt.year + 543;
        const time = dt.toFormat("HH:mm 'น.'");
        return `${day} ${month} ${year} ${time}`;
    };

    const filteredParticipations = activity?.actParticipate.filter(isRecordMatchingFilters) || [];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">กำลังโหลด...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">ไม่พบข้อมูลกิจกรรม</div>
            </div>
        );
    }

    const ExportDataComponentClassroom = () => {
        const handleExportPdf = () => {
            abstactActivity(activity.actId,selectedClassroom)
        }
        return (
            <>
                <div className="border rounded-lg bg-[#F5F5F5] shadow-sm w-fit p-4">
                    <label className="text-xs mb-2">สรุปการเข้ากิจกรรมของห้องเรียนที่เลือก</label>
                    <ExportExcelButton handelOnClickFunction={handleExportPdf}/>
                </div>
            </>
        )
    }
    
    const ExportDataComponentPaticipate = () => {
        const handleExportPdf = () => {
            abstactActivityFilterByClassroom(activity.actId)
        }
        return (
            <>
                <div className="border rounded-lg bg-[#F5F5F5] shadow-sm w-fit p-4">
                    <label className="text-xs mb-2">สรุปการเข้ากิจกรรมโดยแบ่งตามห้องเรียนที่ความเข้าร่วม</label>
                    <ExportExcelButton handelOnClickFunction={handleExportPdf}/>
                </div>
            </>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            ประวัติการเข้าร่วมกิจกรรม: {activity.actName}
                        </h1>
                        
                        {/* Add classroom filter dropdown */}
                        <div className="flex justify-end mb-4">
                            <select
                                value={selectedClassroom}
                                onChange={(e) => setSelectedClassroom(e.target.value)}
                                className="block w-48 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">ทุกห้องเรียน</option>
                                {getUniqueClassrooms().map((classroom) => (
                                    <option key={classroom.classId} value={classroom.classId}>
                                        {classroom.className}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Existing date selector */}
                        <div className="relative mb-6">
                            <div className="overflow-x-auto pb-2 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                                <div className="flex gap-2 px-1">
                                    {activity && getDatesBetween(activity.actDate, activity.actDateEnd).map((date) => {
                                        const dateTime = DateTime.fromISO(date).setZone('Asia/Bangkok');
                                        const isToday = DateTime.now().setZone('Asia/Bangkok').hasSame(dateTime, 'day');
                                        const thaiMonth = convertNumberToThaiMonth(dateTime.month);  
                                        return (
                                            <button
                                                key={date}
                                                onClick={() => setSelectedDate(date)}
                                                className={`flex-shrink-0 flex flex-col items-center w-24 py-2 rounded-lg transition-all ${
                                                    selectedDate === date
                                                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                                        : 'bg-white border hover:bg-gray-50'
                                                } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                                            >
                                                <span className="text-xs mb-1">
                                                    {dateTime.toFormat('ccc')}
                                                </span>
                                                <span className="text-lg font-semibold">
                                                    {dateTime.day}
                                                </span>
                                                <span className="text-xs">
                                                    {thaiMonth}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Existing table */}
                        <div className="flex flex-wrap gap-6 mb-6">
                            <div>
                                <ExportDataComponentPaticipate/>
                            </div>
                            <div>
                                {
                                    selectedClassroom != 'all' && (
                                        <ExportDataComponentClassroom/>
                                    )
                                }
                            </div>
                           
                            
                        </div>
                        
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-6 py-3 text-left w-32">รหัสนักเรียน</th>
                                        <th className="px-6 py-3 text-left">ชื่อ-นามสกุล</th>
                                        <th className="px-6 py-3 text-center w-32">สถานะ</th>
                                        <th className="px-6 py-3 text-left w-64">หมายเหตุ</th>
                                        <th className="px-6 py-3 text-left w-48">บันทึกโดย</th>
                                        <th className="px-6 py-3 text-left w-48">วันเวลาที่บันทึก</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredParticipations.map((record) => (
                                        <tr key={record.actParticipateId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{record.stdId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {record.student.title === 'BOY' ? 'เด็กชาย' : 'เด็กหญิง'} {record.student.fName} {record.student.lName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    เข้าร่วม
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {record.note || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {record.operateBy === 'TEACHER' && record.teacher ? (
                                                    `${record.teacher.tchCode} ${record.teacher.fName}`
                                                ) : record.operateBy}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatThaiDateTime(record.joinTimestamp)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredParticipations.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    {selectedDate ? 'ไม่พบข้อมูลการบันทึกในวันที่เลือก' : 'ยังไม่มีประวัติการบันทึก'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Participant;