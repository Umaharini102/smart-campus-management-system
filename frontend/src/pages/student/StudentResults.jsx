import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/dataServices';
import { Award, CheckCircle2 } from 'lucide-react';

export default function StudentResults() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await reportService.getStudentStats();
        setSubmissions(res.recentSubmissions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-600" /> Academic Results & Evaluation Marks
        </h2>
        <p className="text-xs text-slate-500 mt-1">Official grades, evaluation points, and professor feedback on your coursework.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Coursework Title</th>
                <th className="px-5 py-3.5">Submitted Date</th>
                <th className="px-5 py-3.5">Marks Obtained</th>
                <th className="px-5 py-3.5">Faculty Feedback</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">Loading academic results...</td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">No graded results released yet.</td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {sub.assignmentId?.title}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-extrabold text-sm text-emerald-700 font-mono">
                        {sub.marks}
                      </span>
                      <span className="text-slate-400 text-[11px]"> / {sub.assignmentId?.totalMarks || 100}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 italic">
                      "{sub.feedback || 'Good work.'}"
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sub.status}
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
