import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getFileUrl, DEFAULT_AVATAR } from '../../services/api';
import {
  UserCheck,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Award,
  Save,
  GraduationCap,
  Sparkles,
  BookMarked
} from 'lucide-react';

export default function FacultyProfile() {
  const { user, updateUser, showToast } = useAuth();
  const profile = user?.profile || {};

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || profile.phone || '',
    designation: profile.designation || 'Assistant Professor',
    password: '',
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || user.profile?.phone || '',
        designation: user.profile?.designation || 'Assistant Professor',
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
      data.append('designation', formData.designation);
      if (formData.password) data.append('password', formData.password);
      if (file) data.append('profileImage', file);

      const res = await authService.updateProfile(data);
      if (res.success) {
        updateUser(res.user);
        showToast('Faculty profile updated successfully', 'success');
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

  const subjects = profile.subjects || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-amber-600" /> Faculty Academic Profile
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review academic appointments, assigned teaching subjects, and update your university profile.
        </p>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          <div className="relative">
            <img
              src={avatarSrc}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-600 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 p-1 bg-amber-600 text-white rounded-full shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-amber-700 font-semibold">{formData.designation}</p>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200">
                Faculty ID: {profile.facultyId || 'FAC-1001'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {profile.departmentId?.name || 'Department of AI'}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Subjects Overview */}
        <div className="py-6 border-b border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <BookMarked className="w-4 h-4 text-blue-600" /> Assigned Teaching Subjects & Modules
          </h4>

          {subjects.length === 0 ? (
            <p className="text-xs text-slate-400">No subjects currently assigned to your teaching roster.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map((s) => (
                <div key={s._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-blue-700 block">{s.code}</span>
                    <span className="font-semibold text-slate-900 block">{s.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="pt-6 space-y-4 text-xs">
          <h4 className="text-sm font-bold text-slate-800 mb-2">Edit Contact & Identity</h4>

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
              <label className="block font-semibold text-slate-700 mb-1">Academic Designation</label>
              <input
                type="text"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            <label className="block font-semibold text-slate-700 mb-1">Upload New Avatar Photo</label>
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
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Faculty Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
