import React from 'react';
import {
  Mail,
  Phone,
  Building2,
  Award,
  Globe,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function FacultyCard({ faculty, onViewProfile }) {
  if (!faculty) return null;

  return (
    <div className="group relative rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/70 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/10 backdrop-blur-md p-6 flex flex-col justify-between overflow-hidden">
      {/* Top subtle glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all pointer-events-none" />

      <div>
        {/* Card Header: Avatar & Country Flag & Demo Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${faculty.avatarBg || 'from-blue-600 to-indigo-600'} text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform shrink-0`}
            >
              {faculty.initials || faculty.name.slice(0, 2).toUpperCase()}
            </div>
            {/* Country flag indicator */}
            <span
              className="absolute -bottom-1 -right-1 text-base bg-slate-900 rounded-full px-1 shadow border border-slate-700"
              title={faculty.country}
            >
              {faculty.flag}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {faculty.country}
            </span>
            <span className="text-[9px] text-cyan-400 font-medium mt-1">
              Fictional Demo
            </span>
          </div>
        </div>

        {/* Name & Designation */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
          {faculty.name}
        </h3>
        <p className="text-xs font-semibold text-cyan-400/90 mt-0.5">
          {faculty.designation}
        </p>

        {/* Department */}
        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">{faculty.department}</span>
        </div>

        {/* Specialization */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            <Award className="w-3 h-3 text-indigo-400" />
            Specialization
          </div>
          <span className="text-xs font-medium text-white block truncate">
            {faculty.specialization}
          </span>
        </div>
      </div>

      {/* Footer: Contact Links & View Profile Button */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <a
            href={`mailto:${faculty.email}`}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-colors border border-slate-700/60"
            title={`Email ${faculty.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
          {faculty.phone && (
            <a
              href={`tel:${faculty.phone}`}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 flex items-center justify-center transition-colors border border-slate-700/60"
              title={`Call ${faculty.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <button
          onClick={() => onViewProfile(faculty)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-sm group-hover:scale-[1.02]"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
