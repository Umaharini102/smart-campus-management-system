import React, { useState } from 'react';
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
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  ChevronRight,
  Compass,
  Activity,
  Award,
  Clock,
  Database,
  Globe2
} from 'lucide-react';
import Campus3DVisual from '../components/visuals/Campus3DVisual';
import AshenPressLayer from '../components/visuals/AshenPressLayer';
import AnimatedBackground from '../components/visuals/AnimatedBackground';

export default function LandingPage() {
  const [showAshenPress, setShowAshenPress] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState('admin');

  // Existing features preserved and enriched
  const features = [
    {
      title: 'Student Management',
      desc: 'Centralized profiles, enrollment records, course tracking, digital identities, and academic progress monitoring.',
      icon: Users,
      badge: 'Academic Core'
    },
    {
      title: 'Faculty Management',
      desc: 'Academic appointment directory, department tracking, teaching workloads, schedule allocation, and evaluations.',
      icon: UserCheck,
      badge: 'Faculty Hub'
    },
    {
      title: 'Attendance Management',
      desc: 'Subject-wise class roll call, real-time logging, RFID/biometric compatibility, and statutory 75% threshold compliance.',
      icon: CalendarCheck,
      badge: 'Real-Time Sync'
    },
    {
      title: 'Assignment Management',
      desc: 'Digital homework workflows, multi-format document uploads, deadline tracking, and instructor grading rubrics.',
      icon: FileText,
      badge: 'Paperless'
    },
    {
      title: 'Events Calendar',
      desc: 'Campus symposiums, placement drives, tech conferences, guest lectures, and institutional milestones with venue alerts.',
      icon: Calendar,
      badge: 'Campus Life'
    },
    {
      title: 'Campus Notices',
      desc: 'Instant priority broadcasts, circular distribution, examination timetables, and role-targeted announcements.',
      icon: Bell,
      badge: 'Broadcasting'
    },
    {
      title: 'Academic Reports',
      desc: 'Interactive analytical dashboards, department pass-rate trends, attendance metrics, and compliance exports.',
      icon: BarChart3,
      badge: 'Analytics'
    },
    {
      title: 'Notifications & Alerts',
      desc: 'Instant feedback on assignment grades, timetable schedule adjustments, and urgent campus safety broadcasts.',
      icon: Sparkles,
      badge: 'Automated'
    },
    {
      title: 'Role-Based Access',
      desc: 'Secure JWT authentication with dedicated, isolated dashboards for Administrators, Faculty, and Students.',
      icon: ShieldCheck,
      badge: 'Enterprise Security'
    },
  ];

  // Preserved benefits
  const benefits = [
    'Automated academic attendance calculations and low-attendance statutory warnings',
    'Seamless paperless assignment submissions and real-time instructor grade feedback loops',
    'Real-time timetable synchronization across faculty allocations and student course batches',
    'Enterprise-grade security with bcrypt password hashing and JWT authorization protocols',
    'Placement tracking, career milestones, and campus symposium coordination',
    'Modular RESTful architecture easily configurable for any educational institution'
  ];

  // Role previews to showcase platform breadth
  const roleWorkspaces = {
    admin: {
      title: 'Institutional Administration Control Room',
      desc: 'Complete high-altitude governance across faculties, student admissions, departmental allocations, and compliance reporting.',
      kpis: [
        { label: 'Campus Enrollment', val: '100% Tracked' },
        { label: 'Department Coverage', val: 'Full Matrix' },
        { label: 'System Health', val: '99.98% Uptime' },
        { label: 'Security Policy', val: 'Strict RBAC' },
      ],
      link: '/login',
    },
    faculty: {
      title: 'Faculty Academic Workspace',
      desc: 'Streamlined daily workflow: take roll call in seconds, publish homework materials, grade submissions, and communicate with batches.',
      kpis: [
        { label: 'Roll Call Engine', val: '< 60 Seconds' },
        { label: 'Grading Workflow', val: 'Rubric Based' },
        { label: 'Course Sync', val: 'Instant Cloud' },
        { label: 'Student Outreach', val: 'Direct Notice' },
      ],
      link: '/login',
    },
    student: {
      title: 'Student Digital Campus Portal',
      desc: 'Empowering learners with real-time attendance tracking, exam timetables, digital assignment submissions, and official campus circulars.',
      kpis: [
        { label: 'Attendance Monitor', val: 'Live Threshold' },
        { label: 'Assignment Desk', val: 'Cloud Upload' },
        { label: 'Class Timetable', val: 'Dynamic Grid' },
        { label: 'Notice Board', val: 'Realtime Feed' },
      ],
      link: '/login',
    },
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* 3D Digital Library Shelf Modal (Preserved) */}
      <AshenPressLayer isOpen={showAshenPress} onClose={() => setShowAshenPress(false)} />

      {/* Sophisticated Animated Background */}
      <AnimatedBackground />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-tight">
                Smart Campus
              </span>
              <span className="text-[11px] font-semibold text-cyan-400 tracking-wider uppercase block">
                Management System
              </span>
            </div>
          </Link>

          {/* Quick Nav Anchors */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={scrollToFeatures}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-blue-400" /> Platform Features
            </button>
            <a
              href="#workspaces"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-indigo-400" /> Role Portals
            </a>
            <a
              href="#benefits"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Institutional Benefits
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setShowAshenPress(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 rounded-xl transition-all border border-cyan-500/30 shadow-sm"
              title="Open 3D Academic Library Shelf"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">3D Library</span>
            </button>

            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN HERO SECTION */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center px-6 py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            {/* Small Trust/Status Element */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-800/80 border border-blue-500/30 shadow-lg shadow-blue-500/10 mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide text-cyan-300 uppercase">
                AI-Powered • Secure • Connected • Smart
              </span>
            </div>

            {/* Large Prominent Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
              Smart Campus Management,{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Simplified
              </span>
            </h1>

            {/* Short Professional Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
              Connect campus management, academics, communication, placements, events, and daily campus activities in one intelligent, unified system engineered for higher education institutions.
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={scrollToFeatures}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2.5 shadow-lg group"
              >
                <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
                <span>Explore Platform</span>
              </button>

              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 hover:shadow-cyan-500/40 hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Enterprise Trust Grid */}
            <div className="pt-6 border-t border-slate-800/80 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Role-Based RBAC</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">99.98% Availability</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Real-Time Sync</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Encrypted Vault</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Campus / Technology Visualization */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            {/* Subtle Neon Halo Backdrop */}
            <div className="absolute inset-0 -m-6 bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-indigo-600/20 rounded-3xl blur-2xl -z-10 pointer-events-none" />

            {/* Futuristic 3D Visual Frame */}
            <div className="w-full h-[420px] sm:h-[480px] lg:h-[520px] rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-cyan-500/20 shadow-2xl shadow-blue-900/40 backdrop-blur-xl overflow-hidden relative group">
              {/* Interactive 3D Canvas */}
              <Campus3DVisual className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS / INSTITUTIONAL CAPABILITY BANNER */}
      <section className="relative z-10 py-10 bg-slate-950/60 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              3 Roles
            </div>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Admin • Faculty • Student
            </p>
          </div>

          <div className="text-center md:text-left">
            <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-300">
              100%
            </div>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Paperless Assignment Flow
            </p>
          </div>

          <div className="text-center md:text-left">
            <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">
              Real-Time
            </div>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Automated Attendance Calc
            </p>
          </div>

          <div className="text-center md:text-left">
            <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Institutional
            </div>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Universal Academic Ready
            </p>
          </div>
        </div>
      </section>

      {/* CORE PLATFORM MODULES (Preserved 9 Features with High-Tech Styling) */}
      <section id="features-section" className="relative py-24 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-300 mb-4">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Comprehensive Operational Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Every Dimension of Campus Life
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Eliminate fragmented tools. Smart Campus integrates essential administrative, instructional, and student operations into a unified reactive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900/80 p-7 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/10 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600/25 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span>Connected Module</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE ROLE WORKSPACE PREVIEW */}
      <section id="workspaces" className="relative py-20 px-6 bg-slate-950/70 border-t border-slate-800/80 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
              Tailored Workspaces
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              Purpose-Built Portals for Every Stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Select a workspace below to preview role-tailored capabilities and control planes.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
              <button
                onClick={() => setActiveRoleTab('admin')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${activeRoleTab === 'admin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <ShieldCheck className="w-4 h-4" /> Administrators
              </button>
              <button
                onClick={() => setActiveRoleTab('faculty')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${activeRoleTab === 'faculty'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <UserCheck className="w-4 h-4" /> Faculty Members
              </button>
              <button
                onClick={() => setActiveRoleTab('student')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${activeRoleTab === 'student'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <GraduationCap className="w-4 h-4" /> Students
              </button>
            </div>
          </div>

          {/* Active Tab Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {roleWorkspaces[activeRoleTab].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {roleWorkspaces[activeRoleTab].desc}
                </p>
              </div>

              <Link
                to={roleWorkspaces[activeRoleTab].link}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all self-start md:self-auto shrink-0"
              >
                Enter Portal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* KPI matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {roleWorkspaces[activeRoleTab].kpis.map((kpi, kIdx) => (
                <div key={kIdx} className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 text-left">
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    {kpi.label}
                  </span>
                  <span className="text-base font-bold text-cyan-300 font-mono">
                    {kpi.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL BENEFITS & ARCHITECTURE */}
      <section id="benefits" className="relative py-24 px-6 max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Institutional Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
              Modern Academic Administration Without Complexity
            </h2>

            {/* University Campus Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 mb-6 group">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
                alt="Modern University Campus Architecture"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Digital Academic Infrastructure & Unified Services
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Replace outdated spreadsheets, paper attendance rosters, and siloed software with a modern full-stack academic ecosystem. Powered by reactive Node.js, Express, MongoDB, and React, it delivers sub-second response times and real-time synchronization.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Engineered with zero hardcoded institution specifics, allowing any higher educational institution or college to seamlessly adopt the platform for their unique curricula.
            </p>
          </div>

          {/* Right Column: Key Benefits Checklist */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-10 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Key Institutional Benefits
                  </h3>
                  <p className="text-xs text-slate-400">
                    Proven reliability across real-world university workloads
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  <span>Cloud & Multi-Device Accessible</span>
                </div>
                <button
                  onClick={() => setShowAshenPress(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Explore 3D Library Shelf &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900/80 border border-blue-500/30 p-10 sm:p-14 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Transform Your Campus Operations Today
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Experience an intelligent ecosystem connecting academic administration, faculty operations, and student engagement into one synchronized platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* MODERN SAAS FOOTER */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-6 text-xs z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-white font-bold">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-sm">Smart Campus Management System</span>
              <span className="text-[10px] text-slate-400 font-normal">Next-Generation Academic OS</span>
            </div>
          </div>

          <div className="text-center md:text-left text-slate-400">
            &copy; {new Date().getFullYear()} Smart Campus Management System. All academic records verified, protected, and encrypted.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowAshenPress(true)}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-cyan-400" /> 3D Library
            </button>
            <Link to="/login" className="hover:text-white transition-colors">
              Portal Sign In
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              New Registration
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
