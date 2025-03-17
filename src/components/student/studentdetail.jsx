import { formatPhoneNumber } from "../../helper";
function ShowDetail({ student }) {
  return (
    <div className="flow-root bg-white rounded-2xl border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">รหัสนักเรียน</dt>
          <dd className="py-2 text-sm uppercase">{student.stdId}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">คำนำหน้า</dt>
          <dd className="py-2 text-sm uppercase">
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
          <dt className="py-2 text-sm text-gray-800 uppercase">ชื่อ - สกุล</dt>
          <dd className="py-2 text-sm uppercase">
            {student.fName} {student.lName}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">ชั้นมัธยมศึกษาปีที่</dt>
          <dd className="py-2 text-sm uppercase">
            {student.classroomMembers[0]?.classroom.classLevel || "ไม่ระบุ"}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">ห้อง</dt>
          <dd className="py-2 text-sm uppercase">
            {student.classroomMembers[0]?.classroom.classRoom || "ไม่ระบุ"}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">เลขที่</dt>
          <dd className="py-2 text-sm uppercase">
            {student.classroomMembers[0]?.stdNo || "ไม่ระบุ"
            }
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">อีเมล</dt>
          <dd className="py-2 text-sm uppercase">{student.email?
            student.email
            : "ไม่มีอีเมล"  
        }</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">โทรศัพท์</dt>
          <dd className="py-2 text-sm uppercase">
            {student.tel? formatPhoneNumber(student.tel) : "ไม่มีหมายเลขโทรศัพท์"}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">คะแนนความประพฤติ</dt>
          <dd className="py-2 text-sm uppercase">
            {
              student.classroomMembers[0]?.behaviourScore? student.classroomMembers[0]?.behaviourScore + " คะแนน" : "ไม่มีข้อมูล"
            }
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt className="py-2 text-sm text-gray-800 uppercase">ผู้ปกครอง</dt>
          <dd className="py-2 text-sm uppercase">
            {
              student.parent.length > 0 ? (
                student.parent.map((parent, index) => (
                  <span key={index}>{parent.name}</span>
              )) 
              ) : "ไม่มีข้อมูล"
            }
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default ShowDetail;
