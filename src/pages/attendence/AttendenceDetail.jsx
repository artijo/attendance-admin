import { useParams } from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import { HOSTNAME } from "../../config";
import { AttendenceByDayList } from "../../components/attendence/attendenceByDayList";
import { AttendenceBySubjectList } from "../../components/attendence/attendenceBySubjectList";
import AttendenceSummaryByClassroom from "./AttendenceSummaryByClassroom";
import { TapAttendenceSummaryOpen } from "../../components/attendence/tapAttendenceSummaryOpen";
function AttendanceDetail() {
    const params = useParams();
    const [classroomInfo, setClassroomInfo] = useState(null);
    const [isTabOpen, setIsTabOpen] = useState(new Array(3).fill(false));
    const fetchClassroomInfo = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/classroom/${params.id}`);
            setClassroomInfo(response.data);
        } catch (error) {
            console.error(error);
        };
    };

    const handleIsTabOpen = (index) => {
        let newIsTabOpen = isTabOpen.slice();
        newIsTabOpen[index] = !newIsTabOpen[index];
        setIsTabOpen(newIsTabOpen);
    }

    useEffect(() => {
        fetchClassroomInfo();
    },[]);
    return (
        <div className="mx-auto container">
            {classroomInfo != null && <h5 className="text-xl mb-5"><span className="font-medium">รายละเอียดการเข้าเรียน</span> ห้อง ม.{classroomInfo.classLevel}/{classroomInfo.classRoom} เทอม {classroomInfo.term.semester}  ปีการศึกษา {classroomInfo.term.academicYear+543}</h5>}
            <div className="grid grid-cols-1 gap-2">
                <TapAttendenceSummaryOpen 
                    isTabOpen={isTabOpen} 
                    title={"การเข้าเรียนตามวัน"}
                    handleIsTabOpen={handleIsTabOpen}
                    index={0}
                > 
                    {classroomInfo != null && 
                        <AttendenceByDayList 
                            termId={classroomInfo != null && classroomInfo.term.termId} 
                            classroomId={classroomInfo != null && classroomInfo.classId} 
                        />
                    }
                </TapAttendenceSummaryOpen>
                <TapAttendenceSummaryOpen 
                    isTabOpen={isTabOpen} 
                    title={"การเข้าเรียนตามรายวิชา"}
                    handleIsTabOpen={handleIsTabOpen}
                    index={1}
                > 
                    {classroomInfo != null && 
                        <AttendenceBySubjectList 
                            classroomId={classroomInfo != null && classroomInfo.classId} 
                        />
                    }
                </TapAttendenceSummaryOpen>
                <TapAttendenceSummaryOpen 
                    isTabOpen={isTabOpen} 
                    title={"แบบสรุปเวลาเรียนตามห้องเรียน"}
                    handleIsTabOpen={handleIsTabOpen}
                    index={2}
                > 
                    {classroomInfo != null && 
                        <AttendenceSummaryByClassroom 
                            classroomId={classroomInfo != null && classroomInfo.classId}
                        />
                    }
                </TapAttendenceSummaryOpen>
            </div>
        </div>
    );
};
export default AttendanceDetail;
