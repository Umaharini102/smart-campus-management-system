import React, { useState, useEffect } from 'react';
import { reportService, notificationService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import {
  CalendarCheck,
  Clock,
  FileText,
  Award,
  Bell,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  BookOpen,
  Building2,
  CheckCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, notifRes] = await Promise.all([
          reportService.getStudentStats(),
          notificationService.getAll().catch(() => ({ notifications: [] })),
        ]);

        if (statsRes.success) {
          setData(statsRes);
        }
        if (notifRes.notifications) {
          setNotifications(notifRes.notifications);
        }
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const student = data?.student || user?.profile || {};
  const todayClasses = data?.todayClasses || [];
  const upcomingAssignments = data?.upcomingAssignments || [];
  const recentSubmissions = data?.recentSubmissions || [];
  const recentNotices = data?.recentNotices || [];
  const upcomingEvents = data?.upcomingEvents || [];
  const subjectAttendanceChart = data?.subjectAttendanceChart || [];

  const overallAttendanceVal =
    stats.overallAttendance !== undefined ? stats.overallAttendance : 100;
  const isAttendanceSafe = overallAttendanceVal >= 75;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle 3D Ambient Glow Accent */}
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-500/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" /> Student Scholar Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || student?.userId?.name || 'Scholar'}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200 mt-2">
            <span className="font-semibold text-white">
              {student?.departmentId?.name || 'Academic Department'}
            </span>
            <span>•</span>
            <span>{student?.courseId?.name || 'Undergraduate Degree'}</span>
            <span>•</span>
            <span className="font-mono bg-blue-800/60 px-2 py-0.5 rounded text-blue-100">
              Year {student?.year || 1} (Sem {student?.semester || 1})
            </span>
            <span>•</span>
            <span className="font-mono bg-blue-800/60 px-2 py-0.5 rounded text-blue-100">
              Roll: {student?.rollNumber || 'Enrolled'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/student/timetable"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            My Timetable
          </Link>
          <Link
            to="/student/assignments"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors border border-white/20"
          >
            Assignments
          </Link>
          <Link
            to="/student/reports"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors border border-white/20"
          >
            Academic Report
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Overall Attendance"
          value={`${overallAttendanceVal}%`}
          subtitle={isAttendanceSafe ? '75% Statutory Safe' : 'Attendance Warning (< 75%)'}
          icon={CalendarCheck}
          color={isAttendanceSafe ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Total Classes Attended"
          value={`${stats.attendedClasses !== undefined ? stats.attendedClasses : 0} / ${stats.totalClasses !== undefined ? stats.totalClasses : 0}`}
          subtitle="Past Lectures Logged"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Upcoming Due Dates"
          value={stats.upcomingAssignmentsCount || upcomingAssignments.length || 0}
          subtitle="Assignments Active"
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Recent Evaluations"
          value={recentSubmissions.length}
          subtitle="Graded Coursework"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Main Grid: Today's Classes & Upcoming Coursework */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Scheduled Lectures */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Today's Scheduled Lectures
            </h3>
            <Link to="/student/timetable" className="text-xs font-semibold text-blue-600 hover:underline">
              Full Schedule
            </Link>
          </div>

          <div className="space-y-3">
            {todayClasses.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No lectures scheduled for today.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Check your weekly timetable for upcoming lecture periods.
                </p>
                <Link
                  to="/student/timetable"
                  className="inline-block mt-3 px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-blue-600 hover:bg-slate-50"
                >
                  View Weekly Schedule
                </Link>
              </div>
            ) : (
              todayClasses.map((cls) => (
                <div
                  key={cls._id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-blue-100 text-blue-800">
                        {cls.subjectId?.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{cls.subjectId?.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {cls.classroom} • Period {cls.period} • Instructor: {cls.facultyId?.userId?.name || 'Faculty'}
                    </p>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded border border-slate-200 whitespace-nowrap">
                    {cls.startTime} - {cls.endTime}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Assignments Deadlines */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" /> Upcoming Assignments
              </h3>
              <Link to="/student/assignments" className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingAssignments.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1 opacity-70" />
                  No assignments currently pending submission!
                </div>
              ) : (
                upcomingAssignments.map((assign) => (
                  <div key={assign._id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-blue-700 uppercase bg-blue-50 px-1.5 py-0.5 rounded">
                        {assign.subjectId?.code}
                      </span>
                      <span className="font-semibold text-slate-700 text-[11px]">{assign.totalMarks} pts</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{assign.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span>Due: {new Date(assign.dueDate).toLocaleDateString()}</span>
                      <Link
                        to="/student/assignments"
                        className="font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        Submit <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/student/assignments"
            className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg text-center transition-colors block"
          >
            Assignment Portal
          </Link>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Subject-Wise Attendance Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify statutory compliance (&gt; 75%) across your enrolled courses
            </p>
          </div>
          <Link
            to="/student/attendance"
            className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            Detailed Attendance Log <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="h-64">
          {subjectAttendanceChart.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              No subject attendance logs available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAttendanceChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="attendance" fill="#2563eb" radius={[4, 4, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom Grid: Recent Results, Recent Notices & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Results */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" /> Recent Results & Marks
            </h3>
            <Link to="/student/results" className="text-xs font-semibold text-blue-600 hover:underline">
              All Results
            </Link>
          </div>

          <div className="space-y-3">
            {recentSubmissions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No graded coursework yet.</p>
            ) : (
              recentSubmissions.map((sub) => (
                <div
                  key={sub._id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{sub.assignmentId?.title}</h4>
                    {sub.feedback && (
                      <p className="text-[11px] text-slate-600 mt-1 italic line-clamp-2">
                        "{sub.feedback}"
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                      {sub.marks} / {sub.assignmentId?.totalMarks || 100}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" /> Recent Campus Notices
            </h3>
            <Link to="/student/notices" className="text-xs font-semibold text-blue-600 hover:underline">
              All Notices
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentNotices.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No campus notices available.</p>
            ) : (
              recentNotices.map((n) => (
                <div key={n._id} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                      {n.priority}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{n.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{n.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" /> Upcoming Campus Events
            </h3>
            <Link to="/student/events" className="text-xs font-semibold text-blue-600 hover:underline">
              All Events
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming events scheduled.</p>
            ) : (
              upcomingEvents.map((evt) => (
                <div key={evt._id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {evt.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      {new Date(evt.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{evt.title}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {evt.location}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" /> Notifications & Academic Alerts
          </h3>
          <span className="text-xs text-slate-500">
            {notifications.filter((n) => !n.isRead).length} unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No notifications at this time.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {notifications.slice(0, 6).map((n) => (
              <div
                key={n._id}
                className={`p-3.5 rounded-xl border text-xs ${
                  n.isRead
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-blue-50/60 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 text-xs mt-1">{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
