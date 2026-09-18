import React, { useState, useEffect } from 'react';
import { noticeService } from '../../services/dataServices';
import { Bell, Pin, CheckCircle2 } from 'lucide-react';

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchN = async () => {
      try {
        const res = await noticeService.getAll({ targetRole: 'student' });
        setNotices(res.notices || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchN();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-600" /> Campus Bulletin & Circulars
        </h2>
        <p className="text-xs text-slate-500 mt-1">Official university notifications, examination alerts, and administrative broadcasts.</p>
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
                <div className="flex items-center gap-2">
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
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{n.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{n.description}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Issued by: <strong className="text-slate-700">{n.createdBy?.name || 'Academic Dean'}</strong></span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
