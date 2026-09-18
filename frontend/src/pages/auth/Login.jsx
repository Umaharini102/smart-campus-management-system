import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Users } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'faculty') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">NexusCampus</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Sign in to your academic account</h2>
        <p className="text-xs text-slate-500 mt-1">Select your role or enter institutional credentials</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-8 shadow-xl rounded-2xl border border-slate-200">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
              One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@campus.edu', 'Admin@123')}
                className="p-2 text-center rounded-lg border border-purple-200 bg-purple-50/60 hover:bg-purple-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-purple-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-purple-800 block">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('elena.vance@campus.edu', 'Faculty@123')}
                className="p-2 text-center rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-amber-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-amber-800 block">Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('aarav.sharma@campus.edu', 'Student@123')}
                className="p-2 text-center rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 transition-colors"
              >
                <Users className="w-4 h-4 text-blue-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-blue-800 block">Student</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Need an institutional profile?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
