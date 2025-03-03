import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import { PropTypes } from "prop-types";

export const CreateCalendarClassroomTable = ({ academicYearTermId, setSelectedClassrooms, selectedClassrooms }) => {
    const [classrooms, setClassrooms] = useState({});
    const [checkedState, setCheckedState] = useState({});
    // const [selectedClassrooms, setSelectedClassrooms] = useState([]);
    const handleCheckboxChange = (level, index, e) => {
        const updatedCheckedState = { ...checkedState };
        updatedCheckedState[level][index] = !updatedCheckedState[level][index];
        setCheckedState(updatedCheckedState);

        if (selectedClassrooms.includes(e.target.value)) {
            setSelectedClassrooms(selectedClassrooms.filter((classroom) => classroom !== e.target.value));
        } else {
            setSelectedClassrooms([...selectedClassrooms, e.target.value]);
        }
    };

    const initializeCheckedState = (classroomsData) => {
        const newCheckState = {};
        Object.keys(classroomsData).forEach((level) => {
            newCheckState[level] = new Array(classroomsData[level].length).fill(false);
        });
        setCheckedState(newCheckState);
    };

    const fetchClassrooms = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/classrooms/byterm/${academicYearTermId}`);
            if (response.status === 200) {
                const newClassrooms = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
                response.data.forEach((classroom) => {
                    const level = classroom.classLevel;
                    if (newClassrooms[level]) {
                        newClassrooms[level].push(classroom);
                    }
                });
                setClassrooms(newClassrooms);
                initializeCheckedState(newClassrooms); // Initialize checkedState after fetching classrooms
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, [academicYearTermId]);


    const styleClass = {
        notClick: "border rounded-lg w-fit h-fit px-4 py-[3px]",
        click: "border rounded-lg w-fit h-fit px-4 py-[3px] bg-blue-600 text-white",
    }

    return (
        <div className="rounded-lg border border-gray-200">
            
            <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ระดับชั้น</th>
                            <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ห้องเรียน</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Object.keys(classrooms).map((level) => (
                            level.length > 0 &&
                            <tr key={level}>
                                <td className="whitespace-nowrap text-center px-4 py-2 text-gray-700">{level}</td>
                                <td className="whitespace-nowrap text-center px-4 py-2 grid grid-cols-1">
                                    <div className="flex flex-wrap gap-4 items-center justify-start">
                                        {classrooms[level].map((classroom, index) => (
                                            <button 
                                                type="button"
                                                key={classroom.classId}
                                                className={checkedState[level][index] ? styleClass.click : styleClass.notClick}
                                                value={classroom.classId}
                                                onClick={(e) => {handleCheckboxChange(level, index, e);}}
                                            >
                                                ห้อง{classroom.classRoom}
                                            </button>
                                        ))}
                                    </div>
                                    
                               </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
// {/* <div
//                                             key={classroom.classId}
//                                             className="flex items-center gap-2 place-self-center"
//                                         >
//                                             <input
//                                                 type="checkbox"
//                                                 value={classroom.classId}
//                                                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                                                 checked={checkedState[level] ? checkedState[level][index] : false}
//                                                 onChange={(e) => {
//                                                     handleCheckboxChange(level, index, e);
//                                                 }}
//                                             />
//                                             <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
//                                                 ห้อง {classroom.classRoom}
//                                             </label>
//                                         </div> */}

CreateCalendarClassroomTable.propTypes = {
    academicYearTermId: PropTypes.string.isRequired,
    setSelectedClassrooms: PropTypes.func.isRequired,
    selectedClassrooms: PropTypes.array.isRequired,
};