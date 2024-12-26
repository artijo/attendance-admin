import { useLocation } from "react-router-dom";


const TeacherDetail = () => {
    const location = useLocation();
    


    return (
        <div>
            <TeacherDetail teacher={location.state}/>
        </div>
    );
};


export default TeacherDetail;