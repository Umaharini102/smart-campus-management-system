import React, { useState, useEffect } from 'react';
import { subjectService } from '../../services/dataServices';
import { BookMarked, Users, Award, BookOpen } from 'lucide-react';

export default function FacultySubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await subjectService.getAll();
        setSubjects(res.subjects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-blue-600" /> My Assigned Teaching Subjects
        </h2>
        <p className="text-xs text-slate-500 mt-1">Curriculum modules, semester allocations, and credit structure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading teaching modules...</div>
        ) : subjects.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
            No subjects currently assigned to your profile.
          </div>
        ) : (
          subjects.map((sub) => (
            <div key={sub._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                    {sub.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> {sub.credits} Credits
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{sub.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{sub.courseId?.name || 'Departmental Course'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Semester {sub.semester}</span>
                <span className="font-semibold text-emerald-600">Active Term</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
