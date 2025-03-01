import { formatPhoneNumber } from "../../helper";

function ShowDetail({ teacher }) {
  return (
    <div className="flow-root bg-white rounded-2xl border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">รหัสครู</dt>
          <dd className="py-2 text-sm uppercase">{teacher.tchCode}</dd>
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
          <dt className="py-2 text-sm text-gray-800 uppercase">ชื่อ - สกุล</dt>
          <dd className="py-2 text-sm  uppercase">
            {teacher.fName} {teacher.lName}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">อีเมล</dt>
          <dd className="py-2 text-sm uppercase">{teacher.email}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">โทรศัพท์</dt>
          <dd className="py-2 text-sm  uppercase">
            {formatPhoneNumber(teacher.tel)}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">กลุ่มสาระที่สังกัด</dt>
          <dd className="py-2 text-sm uppercase">
            {teacher.department? teacher.department.deptName : "ไม่มีกลุ่มสาระที่สังกัด"}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">ห้องประจำชั้น</dt>
          <dd className="py-2 text-sm uppercase">
            {teacher.classroom? teacher.classroom.classLevel+"/"+teacher.classroom.classRoom  : "ไม่มีห้องประจำชั้น"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default ShowDetail;