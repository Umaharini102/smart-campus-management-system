import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-l-blue-600',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-l-emerald-600',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-l-amber-600',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-l-purple-600',
      iconBg: 'bg-purple-100 text-purple-700',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-l-indigo-600',
      iconBg: 'bg-indigo-100 text-indigo-700',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white rounded-xl p-5 border border-slate-200 shadow-sm border-l-4 ${scheme.border} flex items-center justify-between`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
