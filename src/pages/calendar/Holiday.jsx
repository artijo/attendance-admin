import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config.js";
import { HolidaytableList } from "../../components/calendar/holidaytableList.jsx";
export const Holiday = () => {
    const [academicYearList, setAcademicYearList] = useState([]);
    const [holidayList, setHolidayList] = useState([]);

    const [value, setValue] = useState({});

    const fectHolidayList = async (value) => {
        try{
            const response = await axios.post(`${HOSTNAME}/a/holidayList`, value);
            setHolidayList(response.data);
        }catch(err){
            console.error(err);
        };
    };

    const handleSelectOption = async (value) => {
        const spiltValue = value.split("&").map(Number);
        let updatedValue = {};
        updatedValue = {semester: spiltValue[0], academicYear: spiltValue[1]}
        if(value) {
            setValue(updatedValue);
            fectHolidayList(updatedValue);
        }
    }

    const fecthSemester = async () => {
        try{
            const response = await axios.get(`${HOSTNAME}/a/termAndAcademicYear`);
            setAcademicYearList(response.data);
        }catch(err){
            console.error(err);
        };
    };

    useEffect(()=> {
        fecthSemester();
    },[])

    return (
        <div className="grid grid-cols-1 gap-4">
            <div>
                <h3>รายการวันหยุด</h3>
                <div>
                    <label>เทอมและปีการศึกษา:</label>
                    <select name="academicYear" className="ml-2 px-4 rounded-md" onChange={(e) => handleSelectOption(e.target.value)}>
                        <option value={""}>
                            -
                        </option>
                        {
                            academicYearList.length > 0 && 
                                academicYearList.map((item, index) => (
                                    <option key={index} value={`${item.semester}&${item.academicYear}`} >
                                        เทอม {item.semester} ปีการศึกษา {item.academicYear}
                                    </option>
                                ))
                        }     
                    </select>
                </div>
            </div>
            <div>
                <HolidaytableList holidayList={holidayList} semester={value.semester} academicYear={value.academicYear} handleSelectOption={handleSelectOption}/>
            </div>
        </div>
    );
};