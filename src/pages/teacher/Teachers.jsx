import axios from "axios";
import { useEffect, useState } from "react";
import TeacherList from "../../components/teacher/teacherList";

const Teacher = () => {
    const [teachers, setTeachers] = useState([]);

    const URL = "http://127.0.0.1:3000/a/teachers";
    const fetchTeacherData = async () => {
        try{
            const response = await axios.get(URL);
            setTeachers(response.data);
        }catch(error) {
            console.log(error)
        };
    };

    useEffect(() => {
        fetchTeacherData();
    },[]);

    return (
        <div>
            <div className="mt-5">
                <TeacherList teacher={teachers} teacherPerPage={10} />
            </div>
        </div>
    );
};

export default Teacher;