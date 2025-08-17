// filepath: d:\Github Projects\student_attendance_client_admin\src\pages\parent\ParentDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import Loading from "../../components/alert/loading";
import Error from "../../components/alert/error";
import { formatTitle } from "../../helper";

function ParentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parent, setParent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParentDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${HOSTNAME}/a/parent/${id}`);
        setParent(response.data);
      } catch (error) {
        console.error("Error fetching parent data:", error);
        setError("ไม่สามารถโหลดข้อมูลผู้ปกครองได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParentDetail();
  }, [id]);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!parent) return <Error message="ไม่พบข้อมูลผู้ปกครอง" />;

  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          ข้อมูลผู้ปกครอง
        </h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium text-text-color font-heading">
              {parent.name}
            </h2>
          </div>
        </div>

        <button
          onClick={() => navigate("/parent")}
          className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          กลับไปหน้ารายการผู้ปกครอง
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Parent information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-text-color-alt">ชื่อผู้ปกครอง</p>
                <p className="text-lg font-medium text-text-color">
                  {parent.name}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-text-color-alt">อีเมล</p>
                {parent.email ? (
                  <a
                    href={`mailto:${parent.email}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {parent.email}
                  </a>
                ) : (
                  <p className="text-lg font-medium text-text-color-alt italic">
                    ไม่มีอีเมล
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-text-color-alt">เบอร์โทรศัพท์</p>
                {parent.tel ? (
                  <a
                    href={`tel:${parent.tel}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {parent.tel}
                  </a>
                ) : (
                  <p className="text-lg font-medium text-text-color-alt italic">
                    ไม่มีเบอร์โทรศัพท์
                  </p>
                )}
              </div>
            </div>{" "}
            {parent.lineId && (
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-primary fill-current"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-text-color-alt">LINE ID</p>
                  <p className="text-lg font-medium text-text-color">
                    {parent.lineId}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Student list section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">
              นักเรียนในปกครอง
            </h2>
          </div>

          {parent.student && parent.student.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-color-alt font-medium uppercase tracking-wider bg-gray-50 border-b border-line">
                  <tr>
                    <th className="px-6 py-4 text-left">ลำดับ</th>
                    <th className="px-6 py-4 text-left">รหัสนักเรียน</th>
                    <th className="px-6 py-4 text-left">ชื่อ-นามสกุล</th>
                    <th className="px-6 py-4 text-left">อีเมล</th>
                    <th className="px-6 py-4 text-left">เบอร์โทร</th>
                    <th className="px-6 py-4 text-center">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {parent.student.map((studentRelation, index) => (
                    <tr
                      key={studentRelation.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-body text-text-color">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium font-body text-text-color">
                        <span className="inline-block bg-primary/10 text-primary rounded-md px-2.5 py-1 text-sm font-medium">
                          {studentRelation.stdId}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-body text-text-color">
                        {studentRelation.student ? (
                          <span className="font-medium">
                            {`${formatTitle(studentRelation.student.title)}${studentRelation.student.fName} ${studentRelation.student.lName}`}
                          </span>
                        ) : (
                          <span className="text-text-color-alt italic">
                            ไม่มีข้อมูล
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-body text-text-color">
                        {studentRelation.student?.email ? (
                          <a
                            href={`mailto:${studentRelation.student.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {studentRelation.student.email}
                          </a>
                        ) : (
                          <span className="text-text-color-alt italic">
                            ไม่มีอีเมล
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-body text-text-color">
                        {studentRelation.student?.tel ? (
                          <a
                            href={`tel:${studentRelation.student.tel}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {studentRelation.student.tel}
                          </a>
                        ) : (
                          <span className="text-text-color-alt italic">
                            ไม่มีเบอร์โทร
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/students/${studentRelation.stdId}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          ดูข้อมูลนักเรียน
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500">ไม่พบนักเรียนในปกครอง</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={() => navigate("/parent")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            กลับไปหน้ารายการผู้ปกครอง
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParentDetail;
