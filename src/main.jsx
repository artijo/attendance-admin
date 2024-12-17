import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

// import pages
import NotFound from "./pages/404.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/student/Students.jsx";
<<<<<<< Updated upstream
import CreateForm from "./pages/student/CreateForm.jsx";
import StudentDetail from "./pages/student/Detail.jsx";
=======
import InfomationDetailsStudent from "./pages/InfomationDetailsStudent.jsx";
import AdminSearch from "./pages/AdminSearch.jsx";
>>>>>>> Stashed changes

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/" element={<App />}>
        <Route path="dashboard" index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
      
      </Route>

      {/* for test ohm */}
      <Route path="/adminSearch" element={<AdminSearch/>}></Route>
      <Route path="/studentInfomation" element={<InfomationDetailsStudent/>}></Route>
    </Routes>
  </BrowserRouter>
  // </StrictMode>,
);
