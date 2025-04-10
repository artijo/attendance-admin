import { HOSTNAME } from "../../config";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DateTime } from "luxon";
import { convertNumberToThaiMonth } from "../../helper";
import DropdownExportDocument from "../../components/DropdownExportDocument";
import TextDropdownDocument from "../../components/TextDropdownDocument";

function Participant() {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const handleNaviatePDFFilterByRoom = () => {
        const classrooms = getUniqueClassrooms();
        const activityId = activity.actId;
        navigate(
            `/activity/participate/filterbyclassroom`,
            {state:{classrooms: classrooms, activityId: activityId, activity: activity}}
        );
    }

    const handleNaviatePDFByRoomJoin = () => {
        const classrooms = getUniqueClassrooms();
        const activityId = activity.actId;
        navigate(
            `/activity/participate/filterbyclassroomjoin`,
            {state:{classrooms: classrooms, activityId: activityId, activity: activity}}
        );
    }

    const handleNavigateExcelFilterByRoom = () => {
        const classrooms = getUniqueClassrooms();
        const activityId = activity.actId;
        navigate(
            `/activity/participate/filterbyclassroom/excel`,
            {state:{classrooms: classrooms, activityId: activityId, activity: activity}}
        );
    }

    const handleNavigateExcelFilterPage = () => {
        const classrooms = getUniqueClassrooms();
        const activityId = activity.actId;
        navigate(
            `/activity/participate/filterbyclassroomjoin/excel`,
            {state:{classrooms: classrooms, activityId: activityId, activity: activity}}
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">การเข้าร่วมกิจกรรม</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>{error}</div>
                    </div>
                </div>
            ) : !activity ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                    <div className="flex justify-center mb-4 text-text-color-alt">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลกิจกรรม</h2>
                    <p className="text-text-color-alt font-body">กิจกรรมนี้อาจถูกลบหรือไม่มีอยู่ในระบบ</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-text-color font-heading">{activity.actName}</h2>
                                <p className="text-text-color-alt text-sm font-body mt-1">
                                    {activity.activityType?.actTypeName} | 
                                    {formatThaiDateTime(activity.actDate)} - {formatThaiDateTime(activity.actDateEnd)}
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <DropdownExportDocument buttonClassName="inline-flex w-full md:w-auto justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300">
                                    <div className="py-1">
                                        <TextDropdownDocument 
                                            title={`เอกสารสรุปการเข้าร่วมแบ่งตามห้อง (EXCEL)`}
                                            actionFunction={handleNavigateExcelFilterByRoom}
                                        />
                                        <TextDropdownDocument 
                                            title={`เอกสารสรุปจำนวนเข้าร่วมตามห้อง (EXCEL)`}
                                            actionFunction={handleNavigateExcelFilterPage}
                                        /> 
                                        <TextDropdownDocument
                                            title={`เอกสารสรุปการเข้าร่วมแบ่งตามห้อง (PDF)`}
                                            actionFunction={handleNaviatePDFFilterByRoom}
                                        />
                                        <TextDropdownDocument
                                            title={`เอกสารสรุปจำนวนเข้าร่วมตามห้อง (PDF)`}
                                            actionFunction={handleNaviatePDFByRoomJoin}
                                        />
                                    </div>
                                </DropdownExportDocument>
                                
                                <select
                                    value={selectedClassroom}
                                    onChange={(e) => setSelectedClassroom(e.target.value)}
                                    className="w-full md:w-48 rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                >
                                    <option value="all">ทุกห้องเรียน</option>
                                    {getUniqueClassrooms().map((classroom) => (
                                        <option key={classroom.classId} value={classroom.classId}>
                                            {classroom.className}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        {/* Date selector component */}
                        <div className="bg-gray-50 border border-line rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-medium text-text-color-alt font-body mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                เลือกวันที่
                            </h3>
                            <div className="overflow-x-auto pb-2 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                                <div className="flex gap-2 px-1">
                                    {getDatesBetween(activity.actDate, activity.actDateEnd).map((date) => {
                                        const dateTime = DateTime.fromISO(date).setZone('Asia/Bangkok');
                                        const isToday = DateTime.now().setZone('Asia/Bangkok').hasSame(dateTime, 'day');
                                        const thaiMonth = convertNumberToThaiMonth(dateTime.month);  
                                        return (
                                            <button
                                                key={date}
                                                onClick={() => setSelectedDate(date)}
                                                className={`flex-shrink-0 flex flex-col items-center w-20 py-3 rounded-lg transition-all duration-300 ${
                                                    selectedDate === date
                                                        ? 'bg-primary text-white shadow-md'
                                                        : 'bg-white border hover:bg-gray-50'
                                                } ${isToday ? 'ring-2 ring-secondary' : ''}`}
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
                        
                        {/* Participation records table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-line">
                                        <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">รหัสนักเรียน</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ชื่อ-นามสกุล</th>
                                        <th className="px-4 py-3.5 text-center text-xs font-medium text-text-color-alt tracking-wider font-heading">ห้องเรียน</th>
                                        <th className="px-4 py-3.5 text-center text-xs font-medium text-text-color-alt tracking-wider font-heading">สถานะ</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">หมายเหตุ</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">บันทึกโดย</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">วันเวลาที่บันทึก</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredParticipations.map((record) => {
                                        const classroom = record.student.classroomMembers[0]?.classroom;
                                        return (
                                            <tr key={record.actParticipateId} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-4 py-3.5 font-medium text-text-color">{record.stdId}</td>
                                                <td className="px-4 py-3.5 font-body text-text-color">
                                                    {record.student.title === 'BOY' ? 'เด็กชาย' : 
                                                     record.student.title === 'GIRL' ? 'เด็กหญิง' : 
                                                     record.student.title === 'MR' ? 'นาย' : 'นางสาว'} {record.student.fName} {record.student.lName}
                                                </td>
                                                <td className="px-4 py-3.5 text-center font-body text-text-color">
                                                    {classroom ? 
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            ม.{classroom.classLevel}/{classroom.classRoom}
                                                        </span> : '-'}
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        เข้าร่วม
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 font-body text-text-color-alt">
                                                    {record.note || '-'}
                                                </td>
                                                <td className="px-4 py-3.5 font-body text-text-color">
                                                    {record.operateBy === 'TEACHER' && record.teacher ? (
                                                        <div className="flex items-center">
                                                            <span className="inline-block bg-primary/10 text-primary rounded-full h-6 w-6 mr-2 flex items-center justify-center text-xs">
                                                                {record.teacher.fName.charAt(0)}
                                                            </span>
                                                            {record.teacher.tchCode} {record.teacher.fName}
                                                        </div>
                                                    ) : record.operateBy}
                                                </td>
                                                <td className="px-4 py-3.5 font-body text-text-color-alt">
                                                    {formatThaiDateTime(record.joinTimestamp)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredParticipations.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-text-color-alt mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="text-text-color-alt font-body">
                                        {selectedDate ? 'ไม่พบข้อมูลการบันทึกในวันที่เลือก' : 'ยังไม่มีประวัติการบันทึก'}
                                    </p>
                                    <p className="text-sm text-text-color-alt font-body mt-1">
                                        ลองเปลี่ยนวันที่หรือตัวกรองห้องเรียนใหม่
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 border-t border-line px-6 py-4 flex justify-between items-center">
                        <div className="text-sm text-text-color-alt font-body">
                            จำนวนบันทึกทั้งหมด: <span className="font-medium text-text-color">{filteredParticipations.length}</span> รายการ
                        </div>
                        
                        <Link 
                            to={`/activity/${id}`}
                            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            กลับไปหน้ารายละเอียดกิจกรรม
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Participant;