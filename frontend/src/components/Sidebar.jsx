import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BookOpen,
  CalendarDays,
  CalendarCheck,
  FileText,
  Bell,
  Calendar,
  BarChart3,
  LogOut,
  FolderDown,
  Award,
  BookMarked
} from 'lucide-react';

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/faculty', label: 'Faculty', icon: UserCheck },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/subjects', label: 'Subjects', icon: BookMarked },
    { to: '/admin/timetable', label: 'Timetable', icon: CalendarDays },
    { to: '/admin/notices', label: 'Notices', icon: Bell },
    { to: '/admin/events', label: 'Events', icon: Calendar },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const facultyNav = [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/faculty/subjects', label: 'My Subjects', icon: BookMarked },
    { to: '/faculty/students', label: 'Student Roster', icon: Users },
    { to: '/faculty/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/faculty/assignments', label: 'Assignments', icon: FileText },
    { to: '/faculty/materials', label: 'Study Materials', icon: FolderDown },
    { to: '/faculty/performance', label: 'Performance', icon: BarChart3 },
  ];

  const studentNav = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Profile', icon: UserCheck },
    { to: '/student/timetable', label: 'Timetable', icon: CalendarDays },
    { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/student/subjects', label: 'Subjects', icon: BookMarked },
    { to: '/student/assignments', label: 'Assignments', icon: FileText },
    { to: '/student/results', label: 'Results & Marks', icon: Award },
    { to: '/student/materials', label: 'Study Materials', icon: FolderDown },
    { to: '/student/notices', label: 'Notices', icon: Bell },
    { to: '/student/events', label: 'Events', icon: Calendar },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'faculty' ? facultyNav : studentNav;

  const roleLabels = {
    admin: 'Administrator Console',
    faculty: 'Faculty Portal',
    student: 'Student Portal',
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight leading-tight text-base">NexusCampus</h1>
          <p className="text-xs text-blue-400 font-medium">{roleLabels[role] || 'Smart System'}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Menu Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-rose-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
