function ShowDetail({ subject }) {
  return (
    <div className="flow-root">
      <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
      <div className="p-4 sm:p-6">
        <dl className="divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              รหัสวิชา
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">{subject.subCode}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              ชื่อวิชา (ภาษาไทย)
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">{subject.subNameThai}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              ชื่อวิชา (ภาษาอังกฤษ)
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">{subject.subNameEng}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              หน่วยกิต
            </dt>
            <dd className="font-body text-text-color sm:col-span-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {subject.subCredit} หน่วยกิต
              </span>
            </dd>
          </div>

          {/* Uncomment if needed for subject description
          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              คำอธิบายรายวิชา
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
              {subject.subDescription || "ไม่มีคำอธิบายรายวิชา"}
            </dd>
          </div>
          */}

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              กลุ่มสาระการเรียนรู้
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
              <div className="flex flex-col">
                <span className="font-medium">{subject.subjectType.subTypeNameThai}</span>
                <span className="text-xs text-text-color-alt">({subject.subjectType.subTypeNameEng})</span>
              </div>
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-text-color font-body flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              คุณครูประจำวิชา
            </dt>
            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
              {subject.teacher ? (
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full h-8 w-8 mr-2">
                    {subject.teacher.fName.charAt(0)}
                  </span>
                  <span>
                    {subject.teacher.fName} {subject.teacher.lName}
                  </span>
                </div>
              ) : (
                <span className="text-text-color-alt italic">ไม่มีคุณครูประจำวิชา</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default ShowDetail;
