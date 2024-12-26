import { formatPhoneNumber } from "../../helper";
function ShowDetail({ student }) {
  return (
    <div className="flow-root bg-white rounded-lg border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">รหัสนักเรียน</dt>
          <dd className="text-gray-700 sm:col-span-2">{student.stdId}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">คำนำหน้า</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {student.title == "MR"
              ? "นาย"
              : student.title == "MS"
              ? "นางสาว"
              : student.title == "BOY"
              ? "เด็กชาย"
              : "เด็กหญิง"}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">ชื่อ - สกุล</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {student.fName} {student.lName}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">ชั้นมัธยมศึกษาปีที่</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {student.classroomMembers[0]?.classroom.classLevel || "ไม่ระบุ"}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">ห้อง</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {student.classroomMembers[0]?.classroom.classRoom || "ไม่ระบุ"}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">เลขที่</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {student.classroomMembers[0]?.stdNo || "ไม่ระบุ"
            }
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">อีเมล</dt>
          <dd className="text-gray-700 sm:col-span-2">{student.email}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">โทรศัพท์</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {student.tel? formatPhoneNumber(student.tel) : "ไม่มีหมายเลขโทรศัพท์"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default ShowDetail;
