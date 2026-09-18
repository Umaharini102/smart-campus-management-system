import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/dataServices';
import { Users, Search, Mail, Phone } from 'lucide-react';

export default function FacultyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await studentService.getAll({ search });
        setStudents(res.students || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Student Class Roster
          </h2>
          <p className="text-xs text-slate-500 mt-1">Enrolled scholars across your teaching sections and lab cohorts.</p>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student Scholar</th>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="px-5 py-3.5">Department & Course</th>
                <th className="px-5 py-3.5">Semester & Section</th>
                <th className="px-5 py-3.5">Contact Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">Loading student roster...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">No students match your query.</td>
                </tr>
              ) : (
                students.map((stu) => (
                  <tr key={stu._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.userId?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={stu.userId?.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{stu.userId?.name}</span>
                          <span className="text-slate-400 text-[11px]">{stu.userId?.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono font-semibold text-blue-700">
                      {stu.rollNumber}
                    </td>

                    <td className="px-5 py-3.5 text-slate-800">
                      <span className="font-medium block">{stu.departmentId?.name}</span>
                      <span className="text-[11px] text-slate-400">{stu.courseId?.name}</span>
                    </td>

                    <td className="px-5 py-3.5 font-medium text-slate-700">
                      Sem {stu.semester} (Section {stu.section})
                    </td>

                    <td className="px-5 py-3.5 text-slate-600 font-mono">
                      {stu.phone || stu.userId?.phone || 'N/A'}
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
