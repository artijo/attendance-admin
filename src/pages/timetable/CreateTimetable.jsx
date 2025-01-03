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
                        <h3>ห้องเรียน {classroomInfo.classLevel}/{classroomInfo.classRoom} ภาคเรียนที่ {classroomInfo.semester} ปีการศึกษา {classroomInfo.academicYear} </h3>
                        :
                        <h3>กำลังโหลดข้อมูล....</h3>                   
                    }
                </div>
                <Link to="/calendar" state={{classroomId: classroomId}}  type="button" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" >
                    ปฎิทินการเรียน
                </Link>
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