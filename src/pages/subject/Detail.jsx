import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import ShowDetail from "../../components/subject/subjectdetail";
import { Link, useLocation } from "react-router-dom";
import AlertSuccess from "../../components/alert/success";

function SubjectDetail() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const location = useLocation();
  const { state } = location;

  function fetchSubject() {
    axios
      .get(HOSTNAME + "/a/subject/" + subjectId)
      .then((response) => {
        setSubject(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subject:", error);
      });
  }

  useEffect(() => {
    fetchSubject();
  }, []);

  return (
    <div>
      <h1>รายละเอียดวิชา</h1>
      <Link
        to={`/subjects/edit/${subject?.subId}`}
        type="button"
        className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        แก้ไขข้อมูลวิชา
      </Link>
      {state && state.message && (
        <AlertSuccess title="แก้ไขข้อมูลแล้ว" message={state.message} />
      )}
      {subject ? (
        <div className="mt-5">
          <ShowDetail subject={subject} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SubjectDetail;
