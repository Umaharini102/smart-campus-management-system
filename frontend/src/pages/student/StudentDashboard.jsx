import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/dataServices';
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
  AlertTriangle
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await reportService.getStudentStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const student = data?.student || {};
  const todayClasses = data?.todayClasses || [];
  const upcomingAssignments = data?.upcomingAssignments || [];
  const recentSubmissions = data?.recentSubmissions || [];
  const recentNotices = data?.recentNotices || [];
  const upcomingEvents = data?.upcomingEvents || [];
  const subjectAttendanceChart = data?.subjectAttendanceChart || [];

  const isAttendanceSafe = (stats.overallAttendance || 0) >= 75;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Student Scholar Portal
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}!</h2>
          <p className="text-xs text-slate-500 mt-1">
            {student.departmentId?.name} • Year {student.year} (Sem {student.semester}) • Roll: {student.rollNumber}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/student/timetable"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            My Timetable
          </Link>
          <Link
            to="/student/assignments"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Assignments
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Overall Attendance"
          value={`${stats.overallAttendance || 94}%`}
          subtitle={isAttendanceSafe ? '75% Statutory Safe' : 'Attendance Warning (< 75%)'}
          icon={CalendarCheck}
          color={isAttendanceSafe ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Total Classes Attended"
          value={`${stats.attendedClasses || 0} / ${stats.totalClasses || 0}`}
          subtitle="Past Lectures Logged"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Upcoming Due Dates"
          value={stats.upcomingAssignmentsCount || 0}
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

      {/* Main Grid: Classes & Upcoming Coursework */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
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
              <p className="text-xs text-slate-400 py-6 text-center">No classes scheduled for today.</p>
            ) : (
              todayClasses.map((cls) => (
                <div
                  key={cls._id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4"
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

                  <span className="font-mono text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded border border-slate-200">
                    {cls.startTime} - {cls.endTime}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Assignments Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" /> Upcoming Deadlines
            </h3>
            <Link to="/student/assignments" className="text-xs font-semibold text-blue-600 hover:underline">
              Submit
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No assignments pending submission.</p>
            ) : (
              upcomingAssignments.map((assign) => (
                <div key={assign._id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block mb-1">
                    {assign.subjectId?.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{assign.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>Due: {new Date(assign.dueDate).toLocaleDateString()}</span>
                    <span className="font-semibold text-slate-700">{assign.totalMarks} pts</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">Subject-Wise Attendance Breakdown</h3>
        <p className="text-xs text-slate-500 mb-6">Verify statutory compliance (&gt; 75%) across your enrolled courses</p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectAttendanceChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="attendance" fill="#2563eb" radius={[4, 4, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Recent Results & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Results */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" /> Recent Assignment Marks & Feedback
          </h3>

          <div className="space-y-3">
            {recentSubmissions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No graded submissions yet.</p>
            ) : (
              recentSubmissions.map((sub) => (
                <div key={sub._id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{sub.assignmentId?.title}</h4>
                    {sub.feedback && <p className="text-xs text-slate-600 mt-1 italic">"{sub.feedback}"</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                      {sub.marks} / {sub.assignmentId?.totalMarks || 100}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" /> Official Campus Announcements
          </h3>

          <div className="divide-y divide-slate-100">
            {recentNotices.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No notices available.</p>
            ) : (
              recentNotices.map((n) => (
                <div key={n._id} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {n.priority}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{n.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
