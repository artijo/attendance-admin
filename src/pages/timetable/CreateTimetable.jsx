import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import axios from "axios";
import { TableHead } from "../../components/timetable/tablehead";
import { Tablebody } from "../../components/timetable/tablebody";
import { useParams, Link } from 'react-router-dom';

export const CreateTimetable = () => {
    const { classroomId } = useParams();
    const [timetable, setTimetable] = useState({});
    const [classroomInfo, setClassroomInfo] = useState({});
    const fetchData = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/timetableR?classroomid=${classroomId}`);
            setTimetable(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchClassroomInfo = async () => { 
        try {
            const response = await axios.get(`${HOSTNAME}/a/classroom/${classroomId}`);
            setClassroomInfo(response.data);
        } catch (error) {
            console.error(error);
        }
    }


    const timeStudyList = [
        "08.40 - 09.30",
        "09.30 - 10.20",
        "10.20 - 11.10",
        "11.10 - 12.00",
        "12.00 - 13.00",
        "13.00 - 13.50",
        "13.50 - 14.40",
        "14.40 - 15.30",
    ]

    useEffect(() => {
        fetchData();
        fetchClassroomInfo();
    }, []);

    return (
        <div className="container mx-auto">
            <div className="mb-2 flex items-end justify-between">
                <div>
                    <h1 className="mb-1">สร้างตารางเรียน</h1>
                    {
                        Object.keys(classroomInfo).length > 0 ? 
                        <p>ห้องเรียน {classroomInfo.classLevel}/{classroomInfo.classRoom} ภาคเรียนที่ {classroomInfo.term.semester} ปีการศึกษา {classroomInfo.term.academicYear + 543} </p>
                        :
                        <p>กำลังโหลดข้อมูล....</p>                   
                    }
                </div>
                <div className="ml-auto flex gap-3 text-sm">
                    <Link to="/calendarstudy" state={{classroomId: classroomId, classroomInfo:classroomInfo}}  type="button"  className="underline text-blue-600 active:text-blue-800">
                        ปฎิทินการเรียน
                    </Link>
                    <Link to="/calendarholiday" state={{classroomId: classroomId, classroomInfo:classroomInfo}}  type="button" className="underline text-blue-600 active:text-blue-800">
                        ปฎิทินวันหยุด
                    </Link>
                </div>
                
                
            </div>
            
            
            <div className="rounded-lg border border-gray-200">
                <div className="overflow-x-auto rounded-t-lg">
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <TableHead timelist={timeStudyList}/>
                            <tbody className="divide-y divide-gray-200 text-center">
                                
                                {
                                    Object.keys(timetable).length > 0 && 
                                    Object.keys(timetable).map((key, index) => (
                                        <Tablebody 
                                            key={index} 
                                            arraySubject={timetable[key]} 
                                            day={parseInt(key)} 
                                            timeStudyList={timeStudyList} 
                                            classroomId={classroomId}
                                        />
                                    ))
                                }
                            </tbody>
                            
                    </table>
                </div>
                </div>
        </div>
        
    );
};