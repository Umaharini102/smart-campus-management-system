import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/dataServices';
import StatCard from '../../components/StatCard';
import {
  Users,
  UserCheck,
  Building2,
  BookOpen,
  CalendarCheck,
  Calendar,
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await reportService.getAdminStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
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
  const monthlyActivity = data?.monthlyActivity || [];
  const departmentDistribution = data?.departmentDistribution || [];
  const upcomingEvents = data?.upcomingEvents || [];
  const recentNotices = data?.recentNotices || [];

  const PIE_COLORS = ['#1d4ed8', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Institutional Administration
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Campus Overview & Metrics</h2>
          <p className="text-xs text-slate-500 mt-1">Real-time status across students, academic staff, and facilities.</p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/students"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Manage Students
          </Link>
          <Link
            to="/admin/notices"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Broadcast Notice
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          subtitle="Enrolled Scholars"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Faculty"
          value={stats.totalFaculty || 0}
          subtitle="Appointed Professors"
          icon={UserCheck}
          color="amber"
        />
        <StatCard
          title="Academic Courses"
          value={stats.totalCourses || 0}
          subtitle="Across All Departments"
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Campus Attendance"
          value={`${stats.attendanceRate || 92}%`}
          subtitle={`${stats.presentCount || 0} Present / ${stats.absentCount || 0} Absent`}
          icon={CalendarCheck}
          color="emerald"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Attendance & Activity Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Campus Activity & Attendance Rate</h3>
              <p className="text-xs text-slate-500">Average student participation over the past semesters</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              <TrendingUp className="w-3 h-3 inline mr-1" /> +3.2% vs last term
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="attendance" fill="#2563eb" radius={[6, 6, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-slate-900 mb-1">Students by Department</h3>
          <p className="text-xs text-slate-500 mb-4">Undergraduate enrollment breakdown</p>

          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="students"
                  nameKey="code"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Events & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Upcoming Campus Events
            </h3>
            <Link to="/admin/events" className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming events scheduled</p>
            ) : (
              upcomingEvents.map((evt) => (
                <div key={evt._id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{evt.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{evt.location} • {evt.time}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 whitespace-nowrap">
                    {new Date(evt.date).toLocaleDateString()}
                  </span>
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
            <Link to="/admin/notices" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentNotices.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active notices</p>
            ) : (
              recentNotices.map((ntc) => (
                <div key={ntc._id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{ntc.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{ntc.description}</p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      ntc.priority === 'High' || ntc.priority === 'Urgent'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {ntc.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
