import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { UserCheck, Mail, Phone, MapPin, Building2, BookOpen, Save } from 'lucide-react';

export default function StudentProfile() {
  const { user, updateUser, showToast } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.profile?.address || '',
    password: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      if (formData.password) data.append('password', formData.password);
      if (file) data.append('profileImage', file);

      const res = await authService.updateProfile(data);
      if (res.success) {
        updateUser(res.user);
        showToast('Profile updated successfully', 'success');
        setFormData({ ...formData, password: '' });
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-600" /> Scholar Profile & Verification
        </h2>
        <p className="text-xs text-slate-500 mt-1">Manage personal contact details and review your verified enrollment credentials.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        {/* Profile Header */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-600 shadow-sm"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-blue-600 font-semibold">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                ID: {user?.profile?.studentId || 'STU-2024-001'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                Roll: {user?.profile?.rollNumber || '24AI001'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="pt-6 space-y-4 text-xs">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Residential Address / Hostel Room</label>
              <input
                type="text"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Update Password (Leave blank to keep current)</label>
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
