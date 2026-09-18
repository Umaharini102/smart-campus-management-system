import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/dataServices';
import StatCard from '../../components/StatCard';
import {
  Users,
  BookMarked,
  Clock,
  CalendarCheck,
  FileText,
  Bell,
  ArrowRight,
  TrendingUp,
  Sparkles
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

export default function FacultyDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await reportService.getFacultyStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching faculty dashboard data:', err);
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
  const todayClasses = data?.todayClasses || [];
  const subjectPerformance = data?.subjectPerformance || [];
  const recentNotices = data?.recentNotices || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Academic Faculty Console
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Faculty Teaching Workspace</h2>
          <p className="text-xs text-slate-500 mt-1">Review lecture schedules, student rosters, and pending assignment submissions.</p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/faculty/attendance"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Mark Class Attendance
          </Link>
          <Link
            to="/faculty/assignments"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Create Assignment
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          subtitle="Enrolled in My Subjects"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Assigned Subjects"
          value={stats.mySubjectsCount || 0}
          subtitle="Active Modules This Term"
          icon={BookMarked}
          color="purple"
        />
        <StatCard
          title="Today's Classes"
          value={stats.todayClassesCount || 0}
          subtitle="Scheduled Lecture Sessions"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendancePercentage || 94}%`}
          subtitle="Overall Class Turnout"
          icon={CalendarCheck}
          color="emerald"
        />
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes List */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Today's Scheduled Lectures
            </h3>
            <Link to="/faculty/attendance" className="text-xs font-semibold text-blue-600 hover:underline">
              Take Attendance
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
                      {cls.classroom} • Period {cls.period}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-white px-3 py-1 rounded border border-slate-200 block">
                      {cls.startTime} - {cls.endTime}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Submissions Stat Box */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Pending Submissions</h3>
            <p className="text-xs text-slate-500 mb-4">Awaiting evaluation and grading</p>

            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-center mb-4">
              <span className="text-3xl font-extrabold text-amber-800 block">
                {stats.pendingSubmissionsCount || 0}
              </span>
              <span className="text-xs text-amber-700 font-medium">Ungraded Solutions</span>
            </div>
          </div>

          <Link
            to="/faculty/assignments"
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold text-center block shadow-sm transition-colors"
          >
            Review & Grade Now
          </Link>
        </div>
      </div>

      {/* Student Performance Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">Subject Performance & Attendance Overview</h3>
        <p className="text-xs text-slate-500 mb-6">Aggregate metrics across your assigned course modules</p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="attendance" fill="#2563eb" radius={[4, 4, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
