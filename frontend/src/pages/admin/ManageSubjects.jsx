import React, { useState, useEffect } from 'react';
import { subjectService, courseService, facultyService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { BookMarked, Plus, Edit2, Trash2, Award } from 'lucide-react';

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    courseId: '',
    facultyId: '',
    semester: 1,
    credits: 3,
  });

  const { showToast } = useAuth();

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const [sRes, cRes, fRes] = await Promise.all([
        subjectService.getAll(),
        courseService.getAll(),
        facultyService.getAll(),
      ]);
      setSubjects(sRes.subjects || []);
      setCourses(cRes.courses || []);
      setFacultyList(fRes.faculty || []);
    } catch (err) {
      showToast('Error loading subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingSub(null);
    setFormData({
      name: '',
      code: '',
      courseId: courses[0]?._id || '',
      facultyId: facultyList[0]?._id || '',
      semester: 1,
      credits: 3,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      code: sub.code,
      courseId: sub.courseId?._id || '',
      facultyId: sub.facultyId?._id || '',
      semester: sub.semester || 1,
      credits: sub.credits || 3,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSub) {
        await subjectService.update(editingSub._id, formData);
        showToast('Subject updated', 'success');
      } else {
        await subjectService.create(formData);
        showToast('Subject created', 'success');
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await subjectService.delete(id);
        showToast('Subject deleted', 'success');
        fetchSubjects();
      } catch (err) {
        showToast('Failed to delete subject', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-blue-600" /> Academic Subjects & Modules
          </h2>
          <p className="text-xs text-slate-500 mt-1">Course modules, credit weightages, and professor allocations.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Subject Code</th>
                <th className="px-5 py-3.5">Subject Name</th>
                <th className="px-5 py-3.5">Degree Course</th>
                <th className="px-5 py-3.5">Semester & Credits</th>
                <th className="px-5 py-3.5">Assigned Instructor</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">Loading subjects...</td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">No subjects registered yet.</td>
                </tr>
              ) : (
                subjects.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-700">
                      {sub.code}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {sub.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {sub.courseId?.name || 'Unassigned'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-800">Sem {sub.semester}</span>
                      <span className="text-slate-400 block text-[11px]">{sub.credits} Credits</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">
                      {sub.facultyId?.userId?.name || <span className="text-amber-600 italic">Unallocated</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(sub)}
                        className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id, sub.name)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSub ? 'Edit Subject' : 'Add Subject'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS-501"
                className="w-full p-2 border border-slate-300 rounded-lg uppercase font-mono"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subject Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Deep Learning & Transformers"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course Degree</label>
              <select
                required
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assigned Faculty Instructor</label>
            <select
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
            >
              <option value="">Select Professor (Optional)</option>
              {facultyList.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.userId?.name} ({f.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm"
            >
              {editingSub ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
