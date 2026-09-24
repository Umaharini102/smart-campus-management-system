import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FacultyDirectory from './pages/FacultyDirectory';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageCourses from './pages/admin/ManageCourses';
import ManageSubjects from './pages/admin/ManageSubjects';
import ManageNotices from './pages/admin/ManageNotices';
import ManageEvents from './pages/admin/ManageEvents';
import ManageTimetable from './pages/admin/ManageTimetable';
import AdminReports from './pages/admin/AdminReports';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyProfile from './pages/faculty/FacultyProfile';
import FacultySubjects from './pages/faculty/FacultySubjects';
import FacultyStudents from './pages/faculty/FacultyStudents';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyAssignments from './pages/faculty/FacultyAssignments';
import FacultyMaterials from './pages/faculty/FacultyMaterials';
import FacultyPerformance from './pages/faculty/FacultyPerformance';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentResults from './pages/student/StudentResults';
import StudentMaterials from './pages/student/StudentMaterials';
import StudentNotices from './pages/student/StudentNotices';
import StudentEvents from './pages/student/StudentEvents';
import StudentReports from './pages/student/StudentReports';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/faculty" element={<FacultyDirectory />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/faculty" element={<ManageFaculty />} />
          <Route path="/admin/departments" element={<ManageDepartments />} />
          <Route path="/admin/courses" element={<ManageCourses />} />
          <Route path="/admin/subjects" element={<ManageSubjects />} />
          <Route path="/admin/notices" element={<ManageNotices />} />
          <Route path="/admin/events" element={<ManageEvents />} />
          <Route path="/admin/timetable" element={<ManageTimetable />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>
      </Route>

      {/* Faculty Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['faculty', 'admin']} />}>
        <Route element={<Layout />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/profile" element={<FacultyProfile />} />
          <Route path="/faculty/subjects" element={<FacultySubjects />} />
          <Route path="/faculty/students" element={<FacultyStudents />} />
          <Route path="/faculty/attendance" element={<FacultyAttendance />} />
          <Route path="/faculty/assignments" element={<FacultyAssignments />} />
          <Route path="/faculty/materials" element={<FacultyMaterials />} />
          <Route path="/faculty/performance" element={<FacultyPerformance />} />
        </Route>
      </Route>

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
        <Route element={<Layout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/subjects" element={<StudentSubjects />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/student/notices" element={<StudentNotices />} />
          <Route path="/student/events" element={<StudentEvents />} />
          <Route path="/student/reports" element={<StudentReports />} />
        </Route>
      </Route>

      {/* Genuinely invalid route fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
