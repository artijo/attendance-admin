import React from 'react';
import { formatDayOfWeeks, calculatedTimeToSeconde, calculatedTimeToSecondeDouleDot } from '../../helper';
import PropTypes from 'prop-types';
import { Addtimetable } from './addtimetable';

export const Tablebody = ({ arraySubject, day, timeStudyList }) => { // listSubject คือ กลุ่มของวิชาที่มีเรียนในวันนั้น
    const secondInTimeStudyArray = timeStudyList.map((time) => {
        let startTime = time.split(' - ')[0];
        let startTimeSplitDot = startTime.split('.');
        // วินาทีทั้งหมด=(ชั่วโมง×3600)+(นาที×60)
        return calculatedTimeToSeconde(startTimeSplitDot[0], startTimeSplitDot[1]);
    });

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
                            <td key={timeIndex} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 ">
                                {/* <SubjectDetail subject={subject.subject} time={subject}/> */}
                                <p>
                                    {subject.timeStart} - {subject.timeEnd}
                                </p>
                                {/* <p>{subject.subject.subCode}</p>
                                <p>ครู{subject.subject.teacher.fName}</p> */}
                            </td>
                        );
                    } else {
                        return (
                            <td key={timeIndex} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                <Addtimetable />
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