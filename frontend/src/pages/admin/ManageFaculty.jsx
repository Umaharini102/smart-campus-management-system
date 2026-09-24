import React, { useState, useEffect } from 'react';
import { facultyService, departmentService, subjectService } from '../../services/dataServices';
import { DEFAULT_AVATAR } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import {
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Mail,
  Building2,
  BookOpen
} from 'lucide-react';

export default function ManageFaculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    facultyId: '',
    departmentId: '',
    designation: 'Assistant Professor',
    subjects: [],
  });

  const { showToast } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [facRes, deptRes, subRes] = await Promise.all([
        facultyService.getAll({ search, departmentId: selectedDept }),
        departmentService.getAll(),
        subjectService.getAll(),
      ]);
      setFacultyList(facRes.faculty || []);
      setDepartments(deptRes.departments || []);
      setSubjects(subRes.subjects || []);
    } catch (err) {
      showToast('Error loading faculty list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, selectedDept]);

  const handleOpenCreate = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      facultyId: `FAC-${Date.now().toString().slice(-4)}`,
      departmentId: departments[0]?._id || '',
      designation: 'Assistant Professor',
      subjects: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setEditingFaculty(fac);
    setFormData({
      name: fac.userId?.name || '',
      email: fac.userId?.email || '',
      phone: fac.phone || fac.userId?.phone || '',
      facultyId: fac.facultyId || '',
      departmentId: fac.departmentId?._id || '',
      designation: fac.designation || 'Assistant Professor',
      subjects: fac.subjects?.map((s) => s._id) || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaculty) {
        await facultyService.update(editingFaculty._id, formData);
        showToast('Faculty updated successfully', 'success');
      } else {
        await facultyService.create(formData);
        showToast('Faculty appointed successfully', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from faculty records?`)) {
      try {
        await facultyService.delete(id);
        showToast('Faculty removed successfully', 'success');
        fetchData();
      } catch (err) {
        showToast('Failed to delete faculty member', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-amber-600" /> Manage Faculty
          </h2>
          <p className="text-xs text-slate-500 mt-1">Academic appointments, department chairs, and subject assignments.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Appoint Faculty
        </button>
      </div>

      {/* Toolbar & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by professor name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Professor</th>
                <th className="px-5 py-3.5">Faculty ID</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Designation</th>
                <th className="px-5 py-3.5">Assigned Subjects</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading faculty records...
                  </td>
                </tr>
              ) : facultyList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No faculty found.
                  </td>
                </tr>
              ) : (
                facultyList.map((fac) => (
                  <tr key={fac._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={fac.userId?.profileImage || DEFAULT_AVATAR}
                          alt={fac.userId?.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{fac.userId?.name}</span>
                          <span className="text-slate-400 text-[11px]">{fac.userId?.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono font-semibold text-purple-700">
                      {fac.facultyId}
                    </td>

                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {fac.departmentId?.name || 'Unassigned'}
                    </td>

                    <td className="px-5 py-3.5 text-slate-700 font-medium">
                      {fac.designation}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {fac.subjects && fac.subjects.length > 0 ? (
                          fac.subjects.map((sub) => (
                            <span key={sub._id} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                              {sub.code}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">None assigned</span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(fac)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Faculty"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fac._id, fac.userId?.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Faculty"
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaculty ? 'Edit Faculty Member' : 'Appoint Faculty Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name & Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Jane Doe"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Campus Email</label>
            <input
              type="email"
              required
              disabled={!!editingFaculty}
              className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              {editingFaculty ? 'Save Changes' : 'Appoint Faculty'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
