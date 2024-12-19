import axios from "axios";
import { useParams } from "react-router-dom";
import { HOSTNAME } from "../../config";
import { useState, useEffect } from "react";
import ShowDetail from "../../components/classroom/classroomdetail";

function ClassroomDetail() {
    const { id } = useParams();
    const [classroom, setClassroom] = useState(null);

    function fetchClassroom() {
        axios
            .get(HOSTNAME + "/a/classroom/" + id)
            .then((response) => {
                setClassroom(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching classroom", error);
            });
    }

    useEffect(() => {
        fetchClassroom();
    }, []);
  return (
    <div>
      <h1>รายละเอียดห้องเรียน</h1>
        {classroom ? (
            <div className="mt-5">
            <ShowDetail classroom={classroom} />
        </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>
   
  );
}

export default ClassroomDetail;