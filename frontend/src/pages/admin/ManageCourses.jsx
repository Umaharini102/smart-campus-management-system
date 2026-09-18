import React, { useState, useEffect } from 'react';
import { courseService, departmentService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { BookOpen, Plus, Edit2, Trash2, Building2 } from 'lucide-react';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    duration: '4 Years',
    description: '',
  });

  const { showToast } = useAuth();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const [cRes, dRes] = await Promise.all([courseService.getAll(), departmentService.getAll()]);
      setCourses(cRes.courses || []);
      setDepartments(dRes.departments || []);
    } catch (err) {
      showToast('Error loading courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      name: '',
      code: '',
      departmentId: departments[0]?._id || '',
      duration: '4 Years',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      departmentId: course.departmentId?._id || '',
      duration: course.duration || '4 Years',
      description: course.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await courseService.update(editingCourse._id, formData);
        showToast('Course updated', 'success');
      } else {
        await courseService.create(formData);
        showToast('Course created', 'success');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save course', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await courseService.delete(id);
        showToast('Course deleted', 'success');
        fetchCourses();
      } catch (err) {
        showToast('Failed to delete course', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" /> Academic Degree Programs
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage undergraduate and postgraduate academic curricula.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Course Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading course catalog...</div>
        ) : courses.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400">No courses defined.</div>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-purple-50 text-purple-700 border border-purple-200">
                    {course.code}
                  </span>
                  <div className="space-x-1">
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id, course.name)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{course.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{course.description || 'Degree program structure.'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span>{course.departmentId?.name || 'Department'}</span>
                <span className="font-semibold text-slate-800">{course.duration}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Course Program' : 'Create Course Program'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Degree / Course Name</label>
            <input
              type="text"
              required
              placeholder="e.g. B.Tech in Computer Science"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course Code</label>
              <input
                type="text"
                required
                placeholder="e.g. BTECH-CSE"
                className="w-full p-2 border border-slate-300 rounded-lg uppercase"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                required
                placeholder="e.g. 4 Years"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <select
              required
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Curriculum Summary</label>
            <textarea
              rows={3}
              placeholder="Syllabus overview and career pathways..."
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
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
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
