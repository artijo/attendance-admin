import { DateTime } from "luxon";

function ShowDetail({ activity }) {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return "";
        return DateTime.fromISO(timeString).toLocaleString(DateTime.TIME_SIMPLE);
    };

    return (
        <div className="flow-root">
            <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
            <div className="p-4 sm:p-6">
                <dl className="divide-y divide-gray-100 text-sm">
                    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            ชื่อกิจกรรม
                        </dt>
                        <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                            {activity.actName}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                            ประเภทกิจกรรม
                        </dt>
                        <dd className="font-body text-text-color sm:col-span-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {activity.activityType?.actTypeName || "-"}
                            </span>
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            รายละเอียด
                        </dt>
                        <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                            {activity.actDesc || "-"}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            สถานที่
                        </dt>
                        <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                            {activity.actLocation || "-"}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            ระยะเวลากิจกรรม
                        </dt>
                        <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800 mr-2">
                                    {formatDate(activity.actDate)}
                                </span>
                                <span className="mx-2">-</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                    {formatDate(activity.actDateEnd)}
                                </span>
                            </div>
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            เวลา
                        </dt>
                        <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                            {formatTime(activity.actStartTime)} - {formatTime(activity.actEndTime)}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            การจำกัดการเข้าร่วม
                        </dt>
                        <dd className="font-body text-text-color sm:col-span-2">
                            {activity.joinLimit ? (
                                <div className="flex items-center">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        จำกัดการเข้าร่วม
                                    </span>
                                    <span className="ml-3 text-text-color-alt">
                                        ({activity.classroom && activity.classroom.length > 0 ? 'จำกัดตามห้องเรียน' : 'จำกัดตามจำนวน'})
                                    </span>
                                </div>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    ไม่จำกัดการเข้าร่วม
                                </span>
                            )}
                        </dd>
                    </div>

                    {activity.joinLimit && activity.classroom && activity.classroom.length < 1 && (
                        <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-medium text-text-color font-body flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                จำนวนผู้เข้าร่วมสูงสุด
                            </dt>
                            <dd className="font-body text-text-color sm:col-span-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {activity.joinLimitNumber || 0} คน
                                </span>
                            </dd>
                        </div>
                    )}

                    {activity.joinLimit && activity.classroom && activity.classroom.length > 0 && (
                        <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-medium text-text-color font-body flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                ห้องเรียนที่สามารถเข้าร่วม
                            </dt>
                            <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {activity.classroom.map((classroom) => (
                                        <div key={classroom.classroom.classId} className="flex items-center bg-white p-2 rounded-md border border-gray-200">
                                            <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full h-8 w-8 mr-3">
                                                {classroom.classroom.classLevel}
                                            </span>
                                            <div>
                                                <p className="font-medium">
                                                    ม.{classroom.classroom.classLevel}/{classroom.classroom.classRoom}
                                                </p>
                                                <p className="text-xs text-text-color-alt">
                                                    ปีการศึกษา {classroom.classroom.term.academicYear + 543}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </dd>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            อาจารย์ผู้ดูแล
                        </dt>
                        <dd className="font-body text-text-color sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {activity.teacher && activity.teacher.length > 0 ? (
                                    activity.teacher.map((teacherObj) => (
                                        <div key={teacherObj.actTeacherId} className="flex items-center bg-white p-2 rounded-md border border-gray-200">
                                            <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full h-8 w-8 mr-3">
                                                {teacherObj.teacher.fName.charAt(0)}
                                            </span>
                                            <div>
                                                <p className="font-medium">
                                                    {teacherObj.teacher.title === "MR" ? "นาย" : 
                                                    teacherObj.teacher.title === "MRS" ? "นาง" : "นางสาว"} {teacherObj.teacher.fName} {teacherObj.teacher.lName}
                                                </p>
                                                {teacherObj.teacher.email && (
                                                    <p className="text-xs text-text-color-alt">{teacherObj.teacher.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-text-color-alt italic">ไม่มีอาจารย์ผู้ดูแล</p>
                                )}
                            </div>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

export default ShowDetail;
