import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, CheckCheck, Sparkles } from 'lucide-react';
import { notificationService } from '../services/dataServices';
import { getFileUrl, DEFAULT_AVATAR } from '../services/api';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationService.getAll();
        if (res.success) {
          setNotifications(res.notifications || []);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (err) {
        // Silently handle if not supported or network error
      }
    };
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const rolePillStyles = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    faculty: 'bg-amber-100 text-amber-800 border-amber-200',
    student: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-800">Smart Campus Management System</span>
        <span className="text-xs text-slate-400">|</span>
        <span className="text-xs text-slate-500 font-medium">Session: Academic Term 2026-27</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Pill */}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${rolePillStyles[role] || 'bg-slate-100 text-slate-700'}`}>
          {role}
        </span>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-600">Campus Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No active alerts</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n._id} className={`p-3 text-xs ${n.isRead ? 'bg-white' : 'bg-blue-50/50'}`}>
                      <p className="font-semibold text-slate-800">{n.title}</p>
                      <p className="text-slate-600 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <Link
          to={role === 'student' ? '/student/profile' : role === 'faculty' ? '/faculty/profile' : '/admin/dashboard'}
          className="flex items-center gap-2.5 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity"
          title="View Profile"
        >
          <img
            src={user?.profileImage || DEFAULT_AVATAR}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
          />
          <div className="hidden md:block text-left leading-tight">
            <span className="text-xs font-bold text-slate-800 block">{user?.name}</span>
            <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{user?.email}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
