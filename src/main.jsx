import { StrictMode } from "react";
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

// Teacher Section
import Teachers from "./pages/teachers/Teachers.jsx";
import TeacherDetail from "./pages/teachers/Detail.jsx";

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
        {/* Teacher Section */}
        <Route path="teachers" element={<Teachers />} />
        <Route path="teachers/:id" element={<TeacherDetail />} />

      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>,
);
