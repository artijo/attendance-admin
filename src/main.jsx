// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { lazy, Suspense } from "react";

// Loading component
const LoadingFallback = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// import pages - convert to lazy loading
const NotFound = lazy(() => import("./pages/404.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

// Student Section
const Students = lazy(() => import("./pages/student/Students.jsx"));
const CreateForm = lazy(() => import("./pages/student/CreateForm.jsx"));
const StudentDetail = lazy(() => import("./pages/student/Detail.jsx"));
const EditStudent = lazy(() => import("./pages/student/EditForm.jsx"));
const UploadWithFile = lazy(() => import("./pages/student/UploadFile.jsx"));

// Classroom Section
const Classroom = lazy(() => import("./pages/classroom/Classroom.jsx"));
const ClassroomDetail = lazy(() => import("./pages/classroom/Detail.jsx"));
const CreateClassroom = lazy(() => import("./pages/classroom/CreateForm.jsx"));
const EditClassroom = lazy(() => import("./pages/classroom/EditForm.jsx"));
const ClassroomTypeManage = lazy(() => import("./pages/classroom/classroomtype/Manage.jsx"));

// Teacher Section
const Teachers = lazy(() => import("./pages/teachers/Teachers.jsx"));
const TeacherDetail = lazy(() => import("./pages/teachers/Detail.jsx"));
const CreateTeacher = lazy(() => import("./pages/teachers/CreateForm.jsx"));
const EditTeacher = lazy(() => import("./pages/teachers/EditForm.jsx"));
const DepartmentManage = lazy(() => import("./pages/teachers/department/Manage.jsx"));

// Leave Request Section
const LeaveRequest = lazy(() => import("./pages/leaverequest/LeaveRequest.jsx"));
const LeaveRequestDetail = lazy(() => import("./pages/leaverequest/LeaveRequestDetail.jsx"));

// Timetable
// const Timetable = lazy(() => import("./pages/new_timetable/new_timetable.jsx"));
// const CreateTimetable = lazy(() => import("./pages/new_timetable/new_createtimetable.jsx"));
// const EditTimetable = lazy(() => import("./pages/new_timetable/new_edittimetable.jsx"));
//  Calendar
const CalendarStudy = lazy(() => import("./pages/calendar/CalendarStudy.jsx"));
const CalendarHoliday = lazy(() => import("./pages/calendar/CalendarHoliday.jsx"));
// Holiday Section
const EditHoliday = lazy(() => import("./pages/holiday/EditHoliday.jsx"));
// const CreateHoliday = lazy(() => import("./pages/holiday/CreateHoliday.jsx"));
const CreateHoliday = lazy(() => import("./pages/holiday/CreateHoliday.jsx"));
const Holiday = lazy(() => import("./pages/holiday/Holiday.jsx"));

// Subject Section
const Subjects = lazy(() => import("./pages/subject/Subjects.jsx"));
const SubjectDetail = lazy(() => import("./pages/subject/Detail.jsx"));
const CreateSubject = lazy(() => import("./pages/subject/CreateForm.jsx"));
const EditSubject = lazy(() => import("./pages/subject/EditForm.jsx"));
const SubjectTypeManage = lazy(() => import("./pages/subject/subjecttype/Manage.jsx"));

// Term
const CreatetermForm = lazy(() => import("./pages/term/CreatetermForm.jsx"));
const MainTermPage = lazy(() => import("./pages/term/MainTermPage.jsx"));
const EdittermForm = lazy(() => import("./pages/term/EdittermForm.jsx"));

// Activities
const Activities = lazy(() => import("./pages/activity/Activities.jsx"));
const ActivityDetail = lazy(() => import("./pages/activity/Detail.jsx"));
const CreateActivity = lazy(() => import("./pages/activity/Create.jsx"));
const EditActivity = lazy(() => import("./pages/activity/Edit.jsx"));
const Participant = lazy(() => import("./pages/activity/Paticipation.jsx"));
const ActivityQRpaticipate = lazy(() => import('./pages/activity/ActivityQRpaticipate.jsx'));
//Activity PDF
const FilterClassroomPage = lazy(() => import("./pages/activity/pdfmanagedownload/FilterClassroomPage.jsx"));
const FilterByClassroom = lazy(() => import("./components/activity/exportPDF/FilterByClassroom.jsx"));
const FilterByRoomJoin = lazy(() => import("./components/activity/exportPDF/FilterByRoomJoin.jsx"));
const FilterByClassroomJoinPage = lazy(() => import("./pages/activity/pdfmanagedownload/FilterByClassroomJoinPage.jsx"));
const ExcelByFilterRoom = lazy(() => import("./pages/activity/excelmanagedownload/ExcelByRoomJoin.jsx"));
const FilterExcelPage = lazy(() => import("./pages/activity/excelmanagedownload/ExcelByClassroomPage.jsx"));
//Calendar
const Calendar = lazy(() => import("./pages/calendarmanage_new/Calendar.jsx"));
//Attendence
const Attendence = lazy(() => import("./pages/attendence/Attendence.jsx"));
const AttendanceDetail = lazy(() => import("./pages/attendence/AttendenceDetail.jsx"));
const AttendenceSubjectDetail = lazy(() => import("./pages/attendence/AttendenceSubjectDetail.jsx"));
const AttendenceByDayDetail = lazy(() => import("./pages/attendence/AttendenceByDayDetail.jsx"));
const AttendanceBySubjectCanExam = lazy(() => import("./components/attendence/attendenceBySubjectCanExam.jsx").then(module => ({ default: module.AttendanceBySubjectCanExam })));
const AttendenceByClassroomDeatail = lazy(() => import("./pages/attendence/AttendenceByClassroomDeatail.jsx"));
const CreateTimetableDragAndDrop = lazy(() => import("./pages/new_timetable/CreateTimetable.jsx"));
const AttendenceByDayPDF = lazy(() => import("./pages/attendence/pdfpage/byday/AttendenceByDayPDF.jsx"));
const AttendenceBySubjectPDF = lazy(() => import("./pages/attendence/pdfpage/bysubject/AttendenceBySubjectPDF.jsx"));
const AttendenceCanExamPDF = lazy(() => import("./pages/attendence/pdfpage/canExam/AttendenceCanExamPDF.jsx"));
// Parent
const Parent = lazy(() => import("./pages/parent/Parents.jsx"));
const ParentDetail = lazy(() => import("./pages/parent/ParentDetail.jsx"));

const Setting = lazy(() => import("./pages/setting.jsx"));


createRoot(document.getElementById("root")).render(
  
  // <StrictMode>
  <BrowserRouter>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/" element={<App />}>
          <Route path="dashboard" index element={<Dashboard />} />
          <Route path="settings" element={<Setting />} />
          {/* Student Section */}
          <Route path="students" element={<Students />} />
          <Route path="students/create" element={<CreateForm />} />
          <Route path="students/upload" element={<UploadWithFile />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="students/edit/:id" element={<EditStudent />} />
          {/* Classroom Section */}
          <Route path="classroom" element={<Classroom />} />
          <Route path="classroom/create" element={<CreateClassroom />} />
          <Route path="classroom/:id" element={<ClassroomDetail />} />
          <Route path="classroom/edit/:id" element={<EditClassroom />} />
          <Route path="classroom/types" element={<ClassroomTypeManage />} />
          {/* Teacher Section */}
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/:id" element={<TeacherDetail />} />
          <Route path="teachers/create" element={<CreateTeacher />} />
          <Route path="teachers/edit/:id" element={<EditTeacher />} />
          <Route path="teachers/departments" element={<DepartmentManage />} />
          {/* Leave Request Section */}
          <Route path="leavereq" element={<LeaveRequest />} />
          <Route path="leavereq/:id" element={<LeaveRequestDetail />} />
          {/* Timetable Section */}
          {/* <Route path="timetable" element={<Timetable/>}/> */}
          <Route path="timetable" element={<CreateTimetableDragAndDrop/>}/>
          {/* <Route path="timetable/create" element={<CreateTimetable/>}/>
          <Route path="timetable/edit" element={<EditTimetable/>}/> */}
          {/* CalendarSchool study Section */}
          <Route path="calendarstudy" element={<CalendarStudy />}/>
          <Route path="calendarholiday" element={<CalendarHoliday />}/>
          <Route path="calendar" element={<Calendar/>}/>
          {/* Holiday Section */}
          <Route path="holiday" element={<Holiday/>}/>
          <Route path="holiday/edit/:id" element={<EditHoliday/>}/>
          <Route path="holiday/create" element={<CreateHoliday/>}/>
          {/* Subject Section */}
          <Route path="subjects" element={<Subjects />} />
          <Route path="subjects/:subjectId" element={<SubjectDetail />} />
          <Route path="subjects/create" element={<CreateSubject />} />
          <Route path="subjects/edit/:id" element={<EditSubject />} />
          <Route path="subjects/types" element={<SubjectTypeManage />} />
          {/* Term mannage */}
          <Route path="terms" element={<MainTermPage/>} />
          <Route path="terms/edit" element={<EdittermForm/>} />
          <Route path="terms/create" element={<CreatetermForm />} />
          {/* Activities */}
          <Route path="activities" element={<Activities />} />
          <Route path="activities/create" element={<CreateActivity />} />
          <Route path="activity/:id" element={<ActivityDetail />} />
          <Route path="activity/edit/:id" element={<EditActivity />} />
          <Route path="activity/:id/participate" element={<Participant />} />
          <Route path='activity/:id/qr-code' element={<ActivityQRpaticipate/>}/>
          {/* By Ohm Section */}
          <Route path="activity/participate/filterbyclassroom/excel" element={<ExcelByFilterRoom />} />
          <Route path="activity/participate/filterbyclassroom" element={<FilterClassroomPage />} />
          <Route path="activity/participate/filterbyclassroom/pdfpage" element={<FilterByClassroom />} />
          <Route path="activity/participate/filterbyclassroomjoin/excel" element={<FilterExcelPage/>} />
          <Route path="activity/participate/filterbyclassroomjoin" element={<FilterByClassroomJoinPage />} />
          <Route path="activity/participate/filterbyclassroomjoin/pdfpage" element={<FilterByRoomJoin />} />
          {/* Attendance */}
          <Route path="attendances" element={<Attendence/>} />
          <Route path="attendances/details/:id" element={<AttendanceDetail/>} />
          <Route path="attendances/details/bysubject" element={<AttendenceSubjectDetail/>} />
          <Route path="attendances/abstract/subject" element={<AttendanceBySubjectCanExam/>}/>
          <Route path="attendances/details/byday" element={<AttendenceByDayDetail/>} />
          <Route path="attendances/details/byclassroom" element={<AttendenceByClassroomDeatail/>} />
          {/* <Route path="att/bysubjectCanExam/pdf" element={<BySubejctCanExamPDF/>} />  export pdf by subjectCanExam page */}
          <Route path="attendances/details/byday/pdf" element={<AttendenceByDayPDF/>} />
          <Route path="attendances/details/bysubject/pdf" element={<AttendenceBySubjectPDF/>} /> {/*export pdf by subject page*/}
          <Route path="attendances/details/bysubject/iscanexam/pdfpage" element={<AttendenceCanExamPDF/>} /> {/*export pdf by subject page*/}
          {/* Parent Section */}
          <Route path="parent" element={<Parent />} />
          <Route path="parent/:id" element={<ParentDetail />} />
        </Route>
          {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
  // </StrictMode>,
);
