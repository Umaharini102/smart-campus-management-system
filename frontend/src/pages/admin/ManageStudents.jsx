import React, { useState, useEffect } from 'react';
import { studentService, departmentService, courseService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    departmentId: '',
    courseId: '',
    year: 1,
    semester: 1,
    section: 'A',
    rollNumber: '',
    address: '',
  });

  const { showToast } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stuRes, deptRes, courseRes] = await Promise.all([
        studentService.getAll({ search, departmentId: selectedDept }),
        departmentService.getAll(),
        courseService.getAll(),
      ]);
      setStudents(stuRes.students || []);
      setDepartments(deptRes.departments || []);
      setCourses(courseRes.courses || []);
    } catch (err) {
      showToast('Error loading students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, selectedDept]);

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      studentId: `STU-${Date.now().toString().slice(-6)}`,
      departmentId: departments[0]?._id || '',
      courseId: courses[0]?._id || '',
      year: 1,
      semester: 1,
      section: 'A',
      rollNumber: `26R${Math.floor(100 + Math.random() * 900)}`,
      address: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.userId?.name || '',
      email: student.userId?.email || '',
      phone: student.phone || student.userId?.phone || '',
      studentId: student.studentId || '',
      departmentId: student.departmentId?._id || '',
      courseId: student.courseId?._id || '',
      year: student.year || 1,
      semester: student.semester || 1,
      section: student.section || 'A',
      rollNumber: student.rollNumber || '',
      address: student.address || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentService.update(editingStudent._id, formData);
        showToast('Student record updated successfully', 'success');
      } else {
        await studentService.create(formData);
        showToast('Student enrolled successfully', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}'s student record?`)) {
      try {
        await studentService.delete(id);
        showToast('Student deleted successfully', 'success');
        fetchData();
      } catch (err) {
        showToast('Failed to delete student', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Manage Students
          </h2>
          <p className="text-xs text-slate-500 mt-1">Enroll, inspect academic standings, and manage scholar credentials.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Enroll Student
        </button>
      </div>

      {/* Toolbar & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or ID..."
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

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Student ID / Roll</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Semester & Year</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading student directory...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No student records found.
                  </td>
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

                    <td className="px-5 py-3.5">
                      <span className="font-mono text-blue-700 font-semibold">{stu.studentId}</span>
                      <span className="text-slate-400 block text-[11px]">Roll: {stu.rollNumber}</span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="text-slate-800 font-medium">{stu.departmentId?.name || 'Unassigned'}</span>
                      <span className="text-slate-400 block text-[11px]">{stu.courseId?.name}</span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="text-slate-800 font-medium">Sem {stu.semester}</span>
                      <span className="text-slate-400 block text-[11px]">Year {stu.year} (Sec {stu.section})</span>
                    </td>

                    <td className="px-5 py-3.5 text-slate-600">
                      {stu.phone || stu.userId?.phone || 'N/A'}
                    </td>

                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(stu)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(stu._id, stu.userId?.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Student"
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Edit Student Record' : 'Enroll New Student'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
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
                disabled={!!editingStudent}
                className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
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
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Year</label>
              <input
                type="number"
                min="1"
                max="4"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              />
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
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Section</label>
              <input
                type="text"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                required
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              />
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
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Residential / Hostel Address</label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              {editingStudent ? 'Save Changes' : 'Enroll Scholar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
