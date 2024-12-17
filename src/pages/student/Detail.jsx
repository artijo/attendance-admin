import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import ShowDetail from "../../components/student/studentdetail";
function StudentDetail() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);

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
      {student ? (
          <ShowDetail student={student} />
      ):(
            <p>Loading...</p>
      )}
    </div>
  );
}

export default StudentDetail;