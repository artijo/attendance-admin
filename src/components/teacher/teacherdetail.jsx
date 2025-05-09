import { formatPhoneNumber } from "../../helper";

function ShowDetail({ teacher }) {
  return (
    <div className="flow-root">
      <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
      <div className="p-4 sm:p-6">
        <dl className="divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              รหัสครู
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">{teacher.tchId}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ชื่อ - สกุล
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
              {teacher.fName} {teacher.lName}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              อีเมล
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
              {teacher.email}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              โทรศัพท์
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
              {teacher.tel? formatPhoneNumber(teacher.tel) : "ไม่มีข้อมูล"}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              กลุ่มสาระที่สังกัด
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
              {teacher.department ? (
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {teacher.department.deptName}
                </span>
              ) : (
                <span className="text-text-color-alt">ไม่มีกลุ่มสาระที่สังกัด</span>
              )}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              ห้องประจำชั้น
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
              {teacher.classTeacher && teacher.classTeacher.length > 0 ? (
                teacher.classTeacher.map((classTeacher, index) => (
                  <div key={classTeacher.classTeacherId} className={`flex flex-col ${index > 0 ? 'mt-2 pt-2 border-t' : ''}`}>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-2">
                        ม.{classTeacher.classroom.classLevel}/{classTeacher.classroom.classRoom}
                      </span>
                      {classTeacher.classroom.classTypeId && (
                        <span className="text-sm text-text-color-alt">
                          ({classTeacher.classroom.classTypeId})
                        </span>
                      )}
                    </div>
                    {classTeacher.classroom.term && (
                      <div className="text-xs text-gray-500 mt-1">
                        ปีการศึกษา {classTeacher.classroom.term.academicYear} ภาคเรียนที่ {classTeacher.classroom.term.semester}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-text-color-alt">ไม่มีห้องประจำชั้น</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default ShowDetail;