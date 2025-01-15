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
import { CreateTimetable }  from "./pages/timetable/CreateTimetable.jsx";
import  { Formtimetable }  from "./pages/timetable/Formtimetable.jsx";
//  Calendar
import { CalendarStudy } from "./pages/calendar/CalendarStudy.jsx";
import { CalendarHoliday } from "./pages/calendar/CalendarHoliday.jsx";
// Calendar new fix
import CreateCalendar from "./pages/calendarmanage_new/CreateCalendar.jsx";
// import { EditHoliday } from "./pages/calendar/EditHoliday.jsx";
// Holiday Section
import EditHoliday from "./pages/holiday/EditHoliday.jsx";
import CreateHoliday from "./pages/holiday/CreateHoliday.jsx";
import Holiday from "./pages/holiday/Holiday.jsx";

// Subject Section
import Subjects from "./pages/subject/subjects.jsx";
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
import Calendar from "./pages/calendarmanage_new/Calendar.jsx";

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
        <Route path="timetable/:classroomId" element={<CreateTimetable/>}/>
        <Route path="createTimetable" element={<Formtimetable/>}/>
        {/* CalendarSchool study Section */}
        <Route path="calendarstudy" element={<CalendarStudy />}/>
        <Route path="calendarholiday" element={<CalendarHoliday />}/>
        <Route path="calendar" element={<Calendar/>}/>
        <Route path="calendar/create" element={<CreateCalendar/>}/> 
        {/* Holiday Section */}
        <Route path="holiday" element={<Holiday/>}/>
        <Route path="holiday/edit/:id" element={<EditHoliday/>}/>
        <Route path="holiday/create" element={<CreateHoliday/>}/>
        
        {/* <Route path="calendarmanage" element={<ManageCalendar  />}/>
        <Route path="createholiday" element={<AddHoliday/>}/> */}
        {/* <Route path="calendaredit" element={<EditHoliday/>}/> */}
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
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>,
);
