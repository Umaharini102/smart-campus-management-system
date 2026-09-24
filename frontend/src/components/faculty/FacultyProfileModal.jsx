import React from 'react';
import {
  X,
  Mail,
  Phone,
  Building2,
  Award,
  BookOpen,
  MapPin,
  Briefcase,
  FileText,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function FacultyProfileModal({ faculty, isOpen, onClose }) {
  if (!isOpen || !faculty) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header background banner */}
        <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 relative p-6 flex items-start justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/50 backdrop-blur-md text-[11px] font-semibold text-cyan-200 border border-white/10">
            <Sparkles className="w-3 h-3 text-cyan-300" />
            Fictional Faculty Profile · Demonstration
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center transition-colors border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Avatar & Primary Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-5">
            <div className="flex items-end gap-4">
              <div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${faculty.avatarBg || 'from-blue-600 to-indigo-600'} text-white text-2xl font-bold flex items-center justify-center border-4 border-slate-900 shadow-xl shadow-blue-900/30 shrink-0`}
              >
                {faculty.initials || faculty.name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {faculty.name}
                  </h3>
                  <span className="text-xl" title={faculty.country}>
                    {faculty.flag}
                  </span>
                </div>
                <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                  {faculty.designation} · {faculty.department}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {faculty.country} · {faculty.facultyId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Appointee
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-6">
            <div className="text-center border-r border-slate-700/60 pr-2">
              <span className="text-[11px] font-medium text-slate-400 block">Experience</span>
              <span className="text-sm font-bold text-white font-mono">{faculty.experience || '10+ Years'}</span>
            </div>
            <div className="text-center border-r border-slate-700/60 px-2">
              <span className="text-[11px] font-medium text-slate-400 block">Publications</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{faculty.publications || 20}+ Papers</span>
            </div>
            <div className="text-center pl-2">
              <span className="text-[11px] font-medium text-slate-400 block">Academic Status</span>
              <span className="text-sm font-bold text-emerald-400">Regular</span>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="space-y-5 text-xs text-slate-300">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" /> Academic Specialization
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-sm font-semibold text-white block mb-1">
                  {faculty.specialization}
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {faculty.bio}
                </p>
              </div>
            </div>

            {/* Teaching Courses */}
            {faculty.courses && faculty.courses.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Assigned Curriculum & Instruction
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {faculty.courses.map((course, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40 flex items-center gap-2 text-slate-200 font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Institutional Contact Info */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" /> Institutional Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block">Institutional Email</span>
                    <span className="text-xs font-semibold text-white truncate block">{faculty.email}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Direct Telephony</span>
                    <span className="text-xs font-semibold text-white">{faculty.phone}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-3 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Office & Consultation Hours</span>
                    <span className="text-xs font-semibold text-white">
                      {faculty.office} · Mon & Thu (2:00 PM - 4:00 PM)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Generic Institutional Identity System
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
