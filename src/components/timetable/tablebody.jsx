import React from 'react';
import { formatDayOfWeeks, calculatedTimeToSeconde, calculatedTimeToSecondeDouleDot } from '../../helper';
import PropTypes from 'prop-types';
import { Addtimetable } from './addtimetable';
import { SubjectDetail } from './subjectdetail';
import { Deletetimetable } from './deletetimetable';
import { HOSTNAME } from '../../config';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Tablebody = ({ arraySubject, day, timeStudyList, classroomId }) => { // listSubject คือ กลุ่มของวิชาที่มีเรียนในวันนั้น
    const secondInTimeStudyArray = timeStudyList.map((time) => {
        let startTime = time.split(' - ')[0];
        let startTimeSplitDot = startTime.split('.');
        return calculatedTimeToSeconde(startTimeSplitDot[0], startTimeSplitDot[1]);
    });

    const deleteTimetable =  async (timetableId) => {
        try{
            const response = await axios.delete(`${HOSTNAME}/a/timetable/${timetableId}`);
            window.location.reload();
        }catch(error){
            console.error(error);
        }
    }
    const handleDelete = (timetableId) => {
        deleteTimetable(timetableId);
    }

    return (
        <tr>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                <span>{formatDayOfWeeks(day)}</span>
            </td>
            {
                secondInTimeStudyArray.map((time, timeIndex) => {
                    const subject = arraySubject.find(subject => time === calculatedTimeToSecondeDouleDot(subject.timeStart));
                    if (subject) {
                        return ( 
                            <td key={timeIndex} className="relative group whitespace-nowrap px-4 py-2 font-medium text-gray-900 cursor-default">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Deletetimetable onDelete={() => handleDelete(subject.timetableId)}/>
                                </div>
                                <SubjectDetail subject={subject.subId} time={subject}/>
                            </td>
                        );
                    
                    }else if(time === calculatedTimeToSeconde('12', '00')) {
                        return (
                            <td key={timeIndex} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                {/* <Addtimetable /> */}
                            </td>
                        );

                    }else {
                        return (
                            <td key={timeIndex} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                <Link to='/createTimetable' state={{day: day, time: time, classroom:classroomId}}>
                                    <Addtimetable />
                                </Link>
                            </td>
                        );
                    } 
                })
            }
        </tr>
    );
};

Tablebody.propTypes = {
    arraySubject: PropTypes.array,
    day: PropTypes.number,
    timeStudyList: PropTypes.array
};