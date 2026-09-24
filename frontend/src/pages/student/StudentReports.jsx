import React, { useState, useEffect } from 'react';
import { reportService, attendanceService, subjectService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  Download,
  CalendarCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  Printer,
  GraduationCap,
  Building2,
  BookOpen,
  FileSpreadsheet
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

export default function StudentReports() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [attData, setAttData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const studentId = user?.profile?._id || user?._id;
        const [statsRes, attRes] = await Promise.all([
          reportService.getStudentStats(),
          attendanceService.getStudentAttendance(studentId).catch(() => ({ summary: null })),
        ]);

        if (statsRes.success) setData(statsRes);
        if (attRes.success) setAttData(attRes);
      } catch (err) {
        console.error('Error loading student reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const student = data?.student || user?.profile || {};
  const stats = data?.stats || {};
  const subjectChart = data?.subjectAttendanceChart || [];
  const subjectStats = attData?.subjectStats || [];
  const submissions = data?.recentSubmissions || [];

  const overallAtt =
    stats.overallAttendance !== undefined ? stats.overallAttendance : 100;
  const isSafe = overallAtt >= 75;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" /> Comprehensive Academic Scholar Report
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Institutional compliance, statutory 75% attendance audit, and term performance summary.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Export Official Transcript
        </button>
      </div>

      {/* Student Identification Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
          </div>
          <p className="text-xs text-slate-600">
            <strong>ID:</strong> {student.studentId || 'Pending'} • <strong>Roll:</strong> {student.rollNumber || 'Enrolled'} • <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {student.departmentId?.name} • {student.courseId?.name} • Year {student.year} (Semester {student.semester}, Section {student.section})
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Academic Status
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-1 ${
              isSafe
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {isSafe ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {isSafe ? 'Statutory Eligible (Passed 75% Threshold)' : 'Attendance Notice (<75%)'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Cumulative Attendance Rate
          </span>
          <h3 className="text-3xl font-extrabold text-slate-900">{overallAtt}%</h3>
          <p className={`text-xs font-medium mt-1 ${isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isSafe ? 'Compliant with university senate regulations' : 'Risk of examination debarment'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Lecture Turnout
          </span>
          <h3 className="text-3xl font-extrabold text-slate-900">
            {stats.attendedClasses || 0} / {stats.totalClasses || 0}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Sessions recorded by teaching faculty</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Evaluated Courseworks
          </span>
          <h3 className="text-3xl font-extrabold text-slate-900">{submissions.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Assignments graded & verified</p>
        </div>
      </div>

      {/* Subject Wise Attendance Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">Statutory Attendance by Subject Module</h3>
        <p className="text-xs text-slate-500 mb-6">Subject turnout plotted against 75% statutory requirement</p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="attendance" fill="#2563eb" radius={[4, 4, 0, 0]} name="Turnout %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Subject Performance & Eligibility Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-sm text-slate-800">
          Module-Wise Attendance & Examination Eligibility Audit
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Module Code</th>
                <th className="px-5 py-3.5">Subject Title</th>
                <th className="px-5 py-3.5">Conducted</th>
                <th className="px-5 py-3.5">Attended</th>
                <th className="px-5 py-3.5">Attendance %</th>
                <th className="px-5 py-3.5 text-center">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No subject records logged yet.
                  </td>
                </tr>
              ) : (
                subjectStats.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-700">{sub.code}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">{sub.name}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">{sub.total}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">{sub.attended}</td>
                    <td className="px-5 py-3.5 font-mono font-bold">
                      <span className={sub.percentage < 75 ? 'text-rose-600' : 'text-emerald-600'}>
                        {sub.percentage}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          sub.percentage >= 75
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {sub.percentage >= 75 ? 'Eligible' : 'Warning'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
