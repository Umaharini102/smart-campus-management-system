import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/dataServices';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function FacultyPerformance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const res = await reportService.getFacultyStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerf();
  }, []);

  const performance = data?.subjectPerformance || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" /> Scholar Academic Performance Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-1">Classroom engagement metrics, evaluation averages, and attendance distribution.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">Subject Performance Benchmarks</h3>
        <p className="text-xs text-slate-500 mb-6">Attendance percentage & test score averages</p>

        <div className="h-72">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">Loading performance data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="attendance" fill="#2563eb" radius={[4, 4, 0, 0]} name="Attendance %" />
                <Bar dataKey="avgMarks" fill="#10b981" radius={[4, 4, 0, 0]} name="Average Grade %" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
