import { DateTime } from "luxon";

function ShowDetail({ activity }) {
    const formatDate = (dateString) => {
        // this formate 2025-01-18 17:00:00.000
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        // แปลงเวลารูปแบบ "23:12" ให้เป็นเวลาไทย 24 ชั่วโมง ด้วย Luxon
        return DateTime.fromISO(timeString).toLocaleString(DateTime.TIME_SIMPLE);
    };

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">ชื่อกิจกรรม</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {activity.actName}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">ประเภทกิจกรรม</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {activity.activityType.actTypeName}
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">รายละเอียด</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {activity.actDesc}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">สถานที่</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {activity.actLocation}
                        </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">ระยะเวลากิจกรรม</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {formatDate(activity.actDate)} - {formatDate(activity.actDateEnd)}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">เวลา</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {formatTime(activity.actStartTime)} - {formatTime(activity.actEndTime)}
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">การจำกัดการเข้าร่วม</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {activity.joinLimit ? (
                                <div>
                                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                        จำกัดการเข้าร่วม
                                    </span>
                                    <span className="ml-2">
                                        ({activity.classroom.length > 0 ? 'จำกัดตามห้องเรียน' : 'จำกัดตามจำนวน'})
                                    </span>
                                </div>
                            ) : (
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    ไม่จำกัดการเข้าร่วม
                                </span>
                            )}
                        </dd>
                    </div>

                    {/* แสดงจำนวนผู้เข้าร่วมสูงสุด (กรณีจำกัดตามจำนวน) */}
                    {activity.joinLimit && activity.classroom.length < 1  && (
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">จำนวนผู้เข้าร่วมสูงสุด</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {activity.joinLimitNumber} คน
                            </dd>
                        </div>
                    )}

                    {/* แสดงห้องเรียนที่สามารถเข้าร่วมได้ (เฉพาะกรณีจำกัดตามห้องเรียน) */}
                    {activity.joinLimit && activity.classroom.length > 0 && (
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">ห้องเรียนที่สามารถเข้าร่วมได้</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                    {activity.classroom.map((classroom) => (
                                        <li key={classroom.classroom.classId} 
                                            className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span className="truncate font-medium">
                                                        มัธยมศึกษาปีที่ {classroom.classroom.classLevel}/{classroom.classroom.classRoom}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                    )}
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">อาจารย์ผู้ดูแล</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                {activity.teacher.map((teacherObj) => (
                                    <li key={teacherObj.actTeacherId} 
                                        className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                        <div className="flex w-0 flex-1 items-center">
                                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                <span className="truncate font-medium">
                                                    {teacherObj.teacher.tchCode} - {teacherObj.teacher.fName} {teacherObj.teacher.lName}
                                                </span>
                                                <span className="flex-shrink-0 text-gray-400">
                                                    {teacherObj.teacher.email}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

export default ShowDetail;
