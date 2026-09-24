import React, { useState, useEffect } from 'react';
import { attendanceService, subjectService, studentService } from '../../services/dataServices';
import { DEFAULT_AVATAR } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CalendarCheck, UserCheck, CheckCircle2, XCircle, Save } from 'lucide-react';

export default function FacultyAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceSheet, setAttendanceSheet] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { showToast } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        const subRes = await subjectService.getAll();
        const subs = subRes.subjects || [];
        setSubjects(subs);
        if (subs.length > 0) {
          setSelectedSubject(subs[0]._id);
        }
      } catch (err) {
        showToast('Failed to load teaching subjects', 'error');
      }
    };
    init();
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedSubject) return;
      setLoading(true);
      try {
        const stuRes = await studentService.getAll();
        const stuList = stuRes.students || [];
        setStudents(stuList);

        // Default all to Present
        const sheet = {};
        stuList.forEach((s) => {
          sheet[s._id] = 'Present';
        });
        setAttendanceSheet(sheet);
      } catch (err) {
        showToast('Error loading student roster', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [selectedSubject]);

  const toggleStatus = (studentId, status) => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const sheet = {};
    students.forEach((s) => {
      sheet[s._id] = 'Present';
    });
    setAttendanceSheet(sheet);
    showToast('All scholars marked as Present', 'info');
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const records = Object.entries(attendanceSheet).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      await attendanceService.mark({
        subjectId: selectedSubject,
        date,
        records,
      });

      showToast(`Attendance successfully recorded for ${records.length} students`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600" /> Mark Class Attendance
          </h2>
          <p className="text-xs text-slate-500 mt-1">Record and synchronize daily lecture roll-call with institutional records.</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={saving || students.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save & Publish Log'}
          </button>
        </div>
      </div>

      {/* Selector Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Module</label>
          <select
            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Session Date</label>
          <input
            type="date"
            className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Roster Roll Call Sheet */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student Scholar</th>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5 text-center">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-400">Loading student roster...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-400">No students enrolled in this batch.</td>
                </tr>
              ) : (
                students.map((stu) => {
                  const currentStatus = attendanceSheet[stu._id] || 'Present';
                  return (
                    <tr key={stu._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={stu.userId?.profileImage || DEFAULT_AVATAR}
                            alt={stu.userId?.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{stu.userId?.name}</span>
                            <span className="text-slate-400 text-[11px]">{stu.studentId}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-mono font-semibold text-slate-700">
                        {stu.rollNumber}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600">
                        {stu.departmentId?.name || 'Academic Dept'}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => toggleStatus(stu._id, 'Present')}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-emerald-700'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(stu._id, 'Absent')}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-rose-700'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
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
