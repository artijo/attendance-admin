import { useState, useEffect } from "react";
import { HOSTNAME } from "../../config";
import axios from "axios";
import { TableHead } from "../../components/timetable/tablehead";
import { Tablebody } from "../../components/timetable/tablebody";

export const CreateTimetable = () => {
    const [timetable, setTimetable] = useState({});
    const classroomId = '361f81e8-760a-4778-882b-ac2cc11fcb2f';

    const fetchData = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/timetableR?classroomid=${classroomId}`);
            setTimetable(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };


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
    }, []);

    return (
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
    );
};