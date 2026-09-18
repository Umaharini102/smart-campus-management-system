import React, { useState, useEffect } from 'react';
import { noticeService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { Bell, Plus, Trash2, Pin, CheckCircle2 } from 'lucide-react';

export default function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetRole: 'all',
    priority: 'Medium',
    pinned: false,
  });

  const { showToast } = useAuth();

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticeService.getAll();
      setNotices(res.notices || []);
    } catch (err) {
      showToast('Error loading notices', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      targetRole: 'all',
      priority: 'Medium',
      pinned: false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await noticeService.create(formData);
      showToast('Notice broadcasted successfully', 'success');
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post notice', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this official campus notice?')) {
      try {
        await noticeService.delete(id);
        showToast('Notice deleted', 'success');
        fetchNotices();
      } catch (err) {
        showToast('Failed to delete notice', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-600" /> Campus Notices & Announcements
          </h2>
          <p className="text-xs text-slate-500 mt-1">Broadcast official bulletins, examination notices, and institutional updates.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Broadcast Notice
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
            No campus notices currently posted.
          </div>
        ) : (
          notices.map((n) => (
            <div
              key={n._id}
              className={`bg-white rounded-xl p-5 border shadow-sm ${
                n.priority === 'Urgent' || n.priority === 'High'
                  ? 'border-l-4 border-l-rose-500 border-slate-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {n.pinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      n.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : n.priority === 'High'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {n.priority}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Target: {n.targetRole.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{n.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{n.description}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Issued by: <strong className="text-slate-700 font-medium">{n.createdBy?.name || 'Administrator'}</strong></span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Campus Notice">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Headline / Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule of Term End Examinations"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              >
                <option value="all">Entire Campus (All)</option>
                <option value="student">Students Only</option>
                <option value="faculty">Faculty Only</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notice Content</label>
            <textarea
              rows={4}
              required
              placeholder="Type comprehensive details..."
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinnedCheck"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="pinnedCheck" className="text-xs font-semibold text-slate-700">
              Pin to top of bulletin board
            </label>
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
              Broadcast Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
