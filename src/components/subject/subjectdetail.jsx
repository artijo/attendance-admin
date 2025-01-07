
function ShowDetail({ subject }) {
  return (
    <div className="flow-root bg-white rounded-lg border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">รหัสวิชา</dt>
          <dd className="text-gray-700 sm:col-span-2">{subject.subCode}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">ชื่อวิชา (ภาษาไทย)</dt>
          <dd className="text-gray-700 sm:col-span-2">{subject.subNameThai}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">ชื่อวิชา (ภาษาอังกฤษ)</dt>
          <dd className="text-gray-700 sm:col-span-2">{subject.subNameEng}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">หน่วยกิต</dt>
          <dd className="text-gray-700 sm:col-span-2">{subject.subCredit}</dd>
        </div>

        {/* <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">คำอธิบายรายวิชา</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {subject.subDescription || "-"}
          </dd>
        </div> */}

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold text-gray-900">กลุ่มสาระการเรียนรู้</dt>
            <dd className="text-gray-700 sm:col-span-2">
                {subject.subjectType.subTypeNameThai} ({subject.subjectType.subTypeNameEng})
            </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold text-gray-900">คุณครูประจำวิชา</dt>
            <dd className="text-gray-700 sm:col-span-2">
                {subject.teacher.fName} {subject.teacher.lName}
            </dd>
        </div>
      </dl>
    </div>
  );
}

export default ShowDetail;
