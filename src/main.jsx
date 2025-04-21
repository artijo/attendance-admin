// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

// import pages
import NotFound from "./pages/404.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Student Section
import Students from "./pages/student/Students.jsx";
import CreateForm from "./pages/student/CreateForm.jsx";
import StudentDetail from "./pages/student/Detail.jsx";
import EditStudent from "./pages/student/EditForm.jsx";
import UploadWithFile from "./pages/student/UploadFile.jsx";

// Classroom Section
import Classroom from "./pages/classroom/Classroom.jsx";
import ClassroomDetail from "./pages/classroom/Detail.jsx";
import CreateClassroom from "./pages/classroom/CreateForm.jsx";
import EditClassroom from "./pages/classroom/EditForm.jsx";
import ClassroomTypeManage from "./pages/classroom/classroomtype/Manage.jsx";

// Teacher Section
import Teachers from "./pages/teachers/Teachers.jsx";
import TeacherDetail from "./pages/teachers/Detail.jsx";
import CreateTeacher from "./pages/teachers/CreateForm.jsx";
import EditTeacher from "./pages/teachers/EditForm.jsx";
import DepartmentManage from "./pages/teachers/department/Manage.jsx";

// Timetable
import Timetable from "./pages/new_timetable/new_timetable.jsx";
import CreateTimetable from "./pages/new_timetable/new_createtimetable.jsx";
import EditTimetable from "./pages/new_timetable/new_edittimetable.jsx";
//  Calendar
import { CalendarStudy } from "./pages/calendar/CalendarStudy.jsx";
import { CalendarHoliday } from "./pages/calendar/CalendarHoliday.jsx";
// Holiday Section
import EditHoliday from "./pages/holiday/EditHoliday.jsx";
import CreateHoliday from "./pages/holiday/CreateHoliday.jsx";
import Holiday from "./pages/holiday/Holiday.jsx";

// Subject Section
import Subjects from "./pages/subject/Subjects.jsx";
import SubjectDetail from "./pages/subject/Detail.jsx";
import CreateSubject from "./pages/subject/CreateForm.jsx";
import EditSubject from "./pages/subject/EditForm.jsx";
import SubjectTypeManage from "./pages/subject/subjecttype/Manage.jsx";

// Term
import CreatetermForm from "./pages/term/CreatetermForm.jsx";
import MainTermPage from "./pages/term/MainTermPage.jsx";
import EdittermForm from "./pages/term/EdittermForm.jsx";

// Activities
import Activities from "./pages/activity/Activities.jsx";
import ActivityDetail from "./pages/activity/Detail.jsx";
import CreateActivity from "./pages/activity/Create.jsx";
import EditActivity from "./pages/activity/Edit.jsx";
import Participant from "./pages/activity/Paticipation.jsx";
//Activity PDF
import FilterClassroomPage from "./pages/activity/pdfmanagedownload/FilterClassroomPage.jsx";
import FilterByClassroom from "./components/activity/exportPDF/FilterByClassroom.jsx";
import FilterByRoomJoin from "./components/activity/exportPDF/FilterByRoomJoin.jsx";
import FilterByClassroomJoinPage from "./pages/activity/pdfmanagedownload/FilterByClassroomJoinPage.jsx";
import ExcelByFilterRoom from "./pages/activity/excelmanagedownload/ExcelByRoomJoin.jsx";
import FilterExcelPage from "./pages/activity/excelmanagedownload/ExcelByClassroomPage.jsx";
//Calendar
import Calendar from "./pages/calendarmanage_new/Calendar.jsx";
//Attendence
import Attendence from "./pages/attendence/Attendence.jsx";
import AttendanceDetail from "./pages/attendence/AttendenceDetail.jsx";
import AttendenceSubjectDetail from "./pages/attendence/AttendenceSubjectDetail.jsx";
import AttendenceByDayDetail from "./pages/attendence/AttendenceByDayDetail.jsx";
import { AttendanceBySubjectCanExam } from "./components/attendence/attendenceBySubjectCanExam.jsx";
import BySubejctCanExamPDF from "./components/attendence/exportPdf/bysubjectCanExam.jsx";
import AttendenceByClassroomDeatail from "./pages/attendence/AttendenceByClassroomDeatail.jsx";
import CreateTimetableDragAndDrop from "./pages/new_timetable/CreateTimetable.jsx";
import AttendenceByDayPDF from "./pages/attendence/pdfpage/byday/AttendenceByDayPDF.jsx";


createRoot(document.getElementById("root")).render(
  
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/" element={<App />}>
        <Route path="dashboard" index element={<Dashboard />} />
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
        {/* Timetable Section */}
        <Route path="timetable" element={<Timetable/>}/>
        <Route path="testtimetable" element={<CreateTimetableDragAndDrop/>}/>
        <Route path="timetable/create" element={<CreateTimetable/>}/>
        <Route path="timetable/edit" element={<EditTimetable/>}/>
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
        <Route path="att/bysubjectCanExam/pdf" element={<BySubejctCanExamPDF/>} />  {/*export pdf by subjectCanExam page*/}
        <Route path="attendances/details/byday/pdf" element={<AttendenceByDayPDF/>} />
        
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>,
);
