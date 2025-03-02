
function ShowDetail({ subject }) {
  return (
    <div className="flow-root bg-white rounded-lg border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">รหัสวิชา</dt>
          <dd className="py-2 text-sm uppercase">{subject.subCode}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">ชื่อวิชา (ภาษาไทย)</dt>
          <dd className="py-2 text-sm uppercase">{subject.subNameThai}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">ชื่อวิชา (ภาษาอังกฤษ)</dt>
          <dd className="py-2 text-sm uppercase">{subject.subNameEng}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">หน่วยกิต</dt>
          <dd className="py-2 text-sm uppercase">{subject.subCredit}</dd>
        </div>

        {/* <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">คำอธิบายรายวิชา</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {subject.subDescription || "-"}
          </dd>
        </div> */}

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="py-2 text-sm text-gray-800 uppercase">กลุ่มสาระการเรียนรู้</dt>
            <dd className="py-2 text-sm uppercase">
                {subject.subjectType.subTypeNameThai} ({subject.subjectType.subTypeNameEng})
            </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="py-2 text-sm text-gray-800 uppercase">คุณครูประจำวิชา</dt>
            <dd className="py-2 text-sm uppercase">
                {subject.teacher.fName} {subject.teacher.lName}
            </dd>
        </div>
      </dl>
    </div>
  );
}

export default ShowDetail;
