import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowLeft, Home, LayoutDashboard, Compass } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();

  const getDashboardUrl = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'faculty') return '/faculty/dashboard';
    if (role === 'student') return '/student/dashboard';
    return '/';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-6">
      {/* Top Navbar Brand */}
      <header className="flex items-center justify-between max-w-6xl w-full mx-auto py-2">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">NexusCampus</span>
            <span className="text-[11px] block text-blue-400 font-medium -mt-1">Smart Campus OS</span>
          </div>
        </Link>

        {isAuthenticated && user && (
          <span className="text-xs text-slate-400 font-medium">
            Signed in as <strong className="text-slate-200">{user.name}</strong>
          </span>
        )}
      </header>

      {/* Main 404 Hero */}
      <main className="max-w-lg w-full mx-auto text-center my-auto py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6 shadow-inner">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-100 mb-3">Page Not Found</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          The campus resource or page you are looking for does not exist, has been relocated, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <Link
              to={getDashboardUrl()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </Link>
          )}

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700 hover:text-white transition border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-4 max-w-6xl w-full mx-auto border-t border-slate-800/60">
        NexusCampus Operating System &bull; Academic Portal &bull; All Rights Reserved
      </footer>
    </div>
  );
}
