import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
function StudentDetail() {
    const { id } = useParams();
    const [student, setStudent] = useState({});

    function fetchStudent() {
        axios
            .get(HOSTNAME + "/a/student/" + id)
            .then((response) => {
                setStudent(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching student", error);
            });
    }

    useEffect(() => {
        fetchStudent();
    }, []);

  return (
    <div>
      <h1>Student Detail</h1>
    </div>
  );
}

export default StudentDetail;