import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { subjectService } from '../../services/dataServices';
import { BookMarked, Award, User, Clock, Search, Filter, Layers } from 'lucide-react';

export default function StudentSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('enrolled'); // 'enrolled' or 'all'

  const studentCourseId = user?.profile?.courseId?._id || user?.profile?.courseId;
  const studentSemester = user?.profile?.semester;

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await subjectService.getAll();
        setSubjects(res.subjects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.code.toLowerCase().includes(search.toLowerCase()) ||
      (sub.facultyId?.userId?.name && sub.facultyId.userId.name.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMode === 'enrolled' && studentSemester) {
      // If course is matched or semester matches
      const subCourseId = sub.courseId?._id || sub.courseId;
      const matchesCourse = !studentCourseId || !subCourseId || String(subCourseId) === String(studentCourseId);
      const matchesSem = Number(sub.semester) === Number(studentSemester);
      return matchesCourse && matchesSem;
    }

    return true;
  });

  const enrolledCount = subjects.filter((sub) => {
    if (!studentSemester) return true;
    const subCourseId = sub.courseId?._id || sub.courseId;
    const matchesCourse = !studentCourseId || !subCourseId || String(subCourseId) === String(studentCourseId);
    return matchesCourse && Number(sub.semester) === Number(studentSemester);
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-blue-600" /> Academic Subjects & Syllabus
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Course modules, credit allocations, and designated faculty instructors for {user?.profile?.courseId?.name || 'your program'}
            {studentSemester ? ` (Semester ${studentSemester})` : ''}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('enrolled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filterMode === 'enrolled'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Current Term ({enrolledCount})
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Campus Subjects ({subjects.length})
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subject code, title or faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 w-full sm:w-auto justify-end">
          <span>Showing <strong className="text-slate-800">{filteredSubjects.length}</strong> modules</span>
          <span>•</span>
          <span>Total Credits: <strong className="text-blue-600 font-bold">{filteredSubjects.reduce((acc, s) => acc + (s.credits || 0), 0)}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400">Loading curriculum subjects...</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
            <BookMarked className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700 text-sm">No subjects found matching your filter</p>
            <p className="text-xs text-slate-400 mt-1">Try switching to "All Campus Subjects" or clearing your search.</p>
            {filterMode === 'enrolled' && (
              <button
                onClick={() => setFilterMode('all')}
                className="mt-3 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                View All Program Subjects
              </button>
            )}
          </div>
        ) : (
          filteredSubjects.map((sub) => {
            const isCurrentTerm = studentSemester && Number(sub.semester) === Number(studentSemester);
            return (
              <div
                key={sub._id}
                className={`bg-white rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                  isCurrentTerm ? 'border-blue-200 ring-1 ring-blue-100 shadow-sm' : 'border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                      {sub.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isCurrentTerm && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active Term
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" /> {sub.credits} Credits
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{sub.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{sub.courseId?.name || 'Departmental Curriculum'}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">{sub.facultyId?.userId?.name || 'Instructor Assigned'}</span>
                  </span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    Semester {sub.semester}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
