import React, { useState, useEffect } from 'react';
import { departmentService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { Building2, Plus, Edit2, Trash2, Users } from 'lucide-react';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    hod: '',
  });

  const { showToast } = useAuth();

  const fetchDepts = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAll();
      setDepartments(res.departments || []);
    } catch (err) {
      showToast('Error loading departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '', hod: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      hod: dept.hod || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentService.update(editingDept._id, formData);
        showToast('Department updated', 'success');
      } else {
        await departmentService.create(formData);
        showToast('Department created', 'success');
      }
      setIsModalOpen(false);
      fetchDepts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await departmentService.delete(id);
        showToast('Department deleted', 'success');
        fetchDepts();
      } catch (err) {
        showToast('Failed to delete department', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Academic Departments
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage institutional faculties, codes, and heads of department.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading departments...</div>
        ) : departments.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400">No departments established.</div>
        ) : (
          departments.map((dept) => (
            <div key={dept._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                    {dept.code}
                  </span>
                  <div className="space-x-1">
                    <button
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id, dept.name)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{dept.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{dept.description || 'No description provided.'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span>Head of Department:</span>
                <strong className="text-slate-800">{dept.hod || 'Unassigned'}</strong>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Create Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Electrical & Computer Engineering"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department Code</label>
              <input
                type="text"
                required
                placeholder="e.g. ECE"
                className="w-full p-2 border border-slate-300 rounded-lg uppercase"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Head of Dept (HOD)</label>
              <input
                type="text"
                placeholder="e.g. Dr. Arthur Pendelton"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.hod}
                onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Scope of department curriculum..."
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
              {editingDept ? 'Save Changes' : 'Create Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
