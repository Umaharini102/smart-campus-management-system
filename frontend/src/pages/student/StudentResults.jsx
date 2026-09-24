import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  FileCheck,
  Printer,
  Sparkles
} from 'lucide-react';

export default function StudentResults() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await reportService.getStudentStats();
        if (res.success) {
          setSubmissions(res.recentSubmissions || []);
          setStudent(res.student || null);
        }
      } catch (err) {
        console.error('Error fetching academic results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const totalPossible = submissions.reduce(
    (acc, s) => acc + (s.assignmentId?.totalMarks || 100),
    0
  );
  const totalEarned = submissions.reduce((acc, s) => acc + (s.marks || 0), 0);
  const avgPercentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 95;
  const gpa = (avgPercentage / 10).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" /> Academic Results & Evaluation Marks
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official grades, evaluation points, and professor feedback on your coursework.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Grade Transcript
        </button>
      </div>

      {/* KPI Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Cumulative Average
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900">{avgPercentage}%</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">First Class with Distinction</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Semester GPA Equivalent
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900">{gpa}</h3>
            <p className="text-xs text-slate-500 mt-1">On 10.0 Grade Point Scale</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Graded Submissions
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900">{submissions.length}</h3>
            <p className="text-xs text-slate-500 mt-1">All course deliverables verified</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Graded Coursework Details Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Graded Assignments & Continuous Evaluations</h3>
          <span className="text-xs text-slate-500">Official Institutional Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Coursework Title</th>
                <th className="px-5 py-3.5">Submitted Date</th>
                <th className="px-5 py-3.5">Marks Obtained</th>
                <th className="px-5 py-3.5">Score %</th>
                <th className="px-5 py-3.5">Faculty Feedback</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">Loading academic results...</td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">No graded results released yet.</td>
                </tr>
              ) : (
                submissions.map((sub) => {
                  const maxMarks = sub.assignmentId?.totalMarks || 100;
                  const pct = Math.round((sub.marks / maxMarks) * 100);

                  return (
                    <tr key={sub._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 block">{sub.assignmentId?.title}</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-500">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-extrabold text-sm text-emerald-700 font-mono">
                          {sub.marks}
                        </span>
                        <span className="text-slate-400 text-[11px]"> / {maxMarks}</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                        {pct}%
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 italic">
                        "{sub.feedback || 'Good academic work.'}"
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
