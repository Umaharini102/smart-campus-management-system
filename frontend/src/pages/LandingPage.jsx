import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  UserCheck,
  CalendarCheck,
  FileText,
  Calendar,
  Bell,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    { title: 'Student Management', desc: 'Centralized profiles, enrollment records, course tracking, and digital student identities.', icon: Users },
    { title: 'Faculty Management', desc: 'Academic appointment directory, department tracking, teaching workloads, and evaluations.', icon: UserCheck },
    { title: 'Attendance Management', desc: 'Subject-wise class roll call, real-time logging, and statutory 75% threshold compliance.', icon: CalendarCheck },
    { title: 'Assignment Management', desc: 'Digital homework workflows, document uploads, submissions tracking, and instructor grading.', icon: FileText },
    { title: 'Events Calendar', desc: 'Campus symposiums, tech fests, guest lectures, and placement schedules with venue alerts.', icon: Calendar },
    { title: 'Campus Notices', desc: 'Broadcast circulars, examination matrices, priority bulletin alerts, and role targeting.', icon: Bell },
    { title: 'Academic Reports', desc: 'Interactive charts, enrollment statistics, attendance trends, and departmental metrics.', icon: BarChart3 },
    { title: 'Notifications & Alerts', desc: 'Instant feedback on assignment grades, exam timetables, and campus broadcasts.', icon: Sparkles },
    { title: 'Role-Based Access', desc: 'Secure JWT authentication with isolated dashboards for Administrators, Faculty, and Students.', icon: ShieldCheck },
  ];

  const benefits = [
    'Automated academic attendance calculations and low-attendance warnings',
    'Seamless paperless assignment submissions and grade feedback loops',
    'Real-time timetable synchronization across faculty and student batches',
    'Enterprise-grade security with bcrypt password hashing and JWT authorization',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">NexusCampus</span>
              <span className="text-xs text-blue-600 font-semibold block leading-none">Smart Campus OS</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              Register Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-6">
            <Building2 className="w-3.5 h-3.5" /> Next-Generation University Infrastructure
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Smart Campus Management System
          </h1>

          <p className="text-xl text-slate-600 font-medium mb-8 max-w-2xl mx-auto">
            One Platform for Smarter Campus Management
          </p>

          <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Unite students, faculty, and administration under a unified academic ecosystem. 
            Streamline course scheduling, attendance tracking, assignments, grade reports, and official campus communications.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-2 transition-colors"
            >
              Launch Campus Portal <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm transition-colors"
            >
              Student & Faculty Enrollment
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Comprehensive Campus Operations Suite
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered specifically to solve academic administration complexity across modern universities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About & Benefits Section */}
      <section className="py-16 px-6 bg-white border-t border-b border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">About The System</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 mb-4">
              Modern Academic Administration Without Hassle
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              NexusCampus replaces fragmented spreadsheets and legacy portals with an integrated, reactive full-stack platform. Powered by Node.js, Express, MongoDB, and React, it delivers sub-second response times and real-time synchronization.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every user role benefits from a purpose-built workspace: administrators oversee institutional health, professors manage course milestones, and students track their academic progress seamlessly.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> Key Institutional Benefits
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-medium leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 px-6 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <span>Smart Campus Management System</span>
          </div>
          <div>
            &copy; 2026 NexusCampus University Operations. All academic records verified and protected.
          </div>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Portal Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">New Registration</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
