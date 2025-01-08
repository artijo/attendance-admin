import { formatPhoneNumber } from "../../helper";

function ShowDetail({ teacher }) {
  return (
    <div className="flow-root bg-white rounded-lg border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">รหัสครู</dt>
          <dd className="text-gray-700 sm:col-span-2">{teacher.tchCode}</dd>
        </div>

        {/* <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">คำนำหน้า</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {teacher.title == "MR"
              ? "นาย"
              : teacher.title == "MRS"
              ? "นาง"
              : teacher.title == "MISS"
              ? "นางสาว"
              : "ไม่ระบุ"}
          </dd>
        </div> */}

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">ชื่อ - สกุล</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {teacher.fName} {teacher.lName}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">อีเมล</dt>
          <dd className="text-gray-700 sm:col-span-2">{teacher.email}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">โทรศัพท์</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {formatPhoneNumber(teacher.tel)}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">กลุ่มสาระที่สังกัด</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {teacher.department? teacher.department.deptName : "ไม่มีกลุ่มสาระที่สังกัด"}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-bold text-gray-900">ห้องประจำชั้น</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {teacher.classroom? teacher.classroom.classLevel+"/"+teacher.classroom.classRoom  : "ไม่มีห้องประจำชั้น"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default ShowDetail;