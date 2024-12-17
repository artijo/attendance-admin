import axios from "axios";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { StudentInfomation } from "../components/student/studentInfomation";

// import PropTypes from 'prop-types';

// import PropTypes from "prop-types";
const InfomationDetailsStudent = () => {
    const location = useLocation();
    const [information, setInformation] = useState({});


    const fetchData = useCallback(async ( )=> {
        // await roleSet(role);
        try{
            const URL = `http://localhost:3000/a/student/${location.state}`
            const response = await axios.get(URL);
            // console.log(response.data);
            const data = response.data;
            // console.log(data);
            setInformation(data);
        }catch(err){
            console.log(err);
        };
    },[location.state]); 

    useEffect(() => {
        if(location.state){
            fetchData();
        }   
    },[location.state, fetchData]);

    return (
        <div className="informationPerson">
            <StudentInfomation studentInfo={information}/>
        </div>
    );
};

// InfomationDetailsStudent.propTypes = {
//     person_uuid: PropTypes.string.isRequired
// }

export default InfomationDetailsStudent;