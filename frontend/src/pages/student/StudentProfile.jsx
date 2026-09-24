import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getFileUrl, DEFAULT_AVATAR } from '../../services/api';
import {
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Building2,
  BookOpen,
  Save,
  GraduationCap,
  Calendar,
  Hash,
  Upload,
  Lock
} from 'lucide-react';

export default function StudentProfile() {
  const { user, updateUser, showToast } = useAuth();
  const profile = user?.profile || {};

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || profile.phone || '',
    address: profile.address || '',
    year: profile.year || 1,
    semester: profile.semester || 1,
    section: profile.section || 'A',
    rollNumber: profile.rollNumber || '',
    password: '',
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || user.profile?.phone || '',
        address: user.profile?.address || '',
        year: user.profile?.year || 1,
        semester: user.profile?.semester || 1,
        section: user.profile?.section || 'A',
        rollNumber: user.profile?.rollNumber || '',
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('year', formData.year);
      data.append('semester', formData.semester);
      data.append('section', formData.section);
      data.append('rollNumber', formData.rollNumber);
      if (formData.password) data.append('password', formData.password);
      if (file) data.append('profileImage', file);

      const res = await authService.updateProfile(data);
      if (res.success) {
        updateUser(res.user);
        showToast('Student profile updated successfully', 'success');
        setFormData((prev) => ({ ...prev, password: '' }));
        setFile(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = user?.profileImage
    ? getFileUrl(user.profileImage)
    : DEFAULT_AVATAR;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-600" /> Student Profile & Academic Record
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review your enrolled university identity and update contact credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          <div className="relative">
            <img
              src={avatarSrc}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-600 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-full shadow">
              <GraduationCap className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-blue-600 font-semibold">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
                ID: {profile.studentId || 'Pending'}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                Roll: {profile.rollNumber || 'Enrolled'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Year {profile.year || 1} • Sem {profile.semester || 1} (Sec {profile.section || 'A'})
              </span>
            </div>
          </div>
        </div>

        {/* Academic Details Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Department
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1">
              {profile.departmentId?.name || 'Academic Dept'}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Degree Course
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1">
              {profile.courseId?.name || 'Engineering / Science'}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-blue-600" /> Contact Phone
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1">
              {user?.phone || profile.phone || 'Not provided'}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Campus Address
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1 truncate">
              {profile.address || 'Hostel / Day Scholar'}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="pt-6 space-y-4 text-xs">
          <h4 className="text-sm font-bold text-slate-800 mb-2">Update Information</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Year</label>
              <input
                type="number"
                min="1"
                max="5"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Section</label>
              <input
                type="text"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hostel Room / Residential Address</label>
              <input
                type="text"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                New Password (Leave blank to keep current)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Upload Profile Avatar Photo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border border-slate-300 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
