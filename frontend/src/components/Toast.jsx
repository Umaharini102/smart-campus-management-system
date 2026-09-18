import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage, dismissToast } = useAuth();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const borderColors = {
    success: 'border-l-4 border-emerald-500 bg-white text-slate-800',
    error: 'border-l-4 border-rose-500 bg-white text-slate-800',
    info: 'border-l-4 border-blue-500 bg-white text-slate-800',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-bounce-short">
      <div className={`p-4 rounded-lg shadow-lg border border-slate-200 flex items-start gap-3 ${borderColors[type] || borderColors.info}`}>
        {icons[type] || icons.info}
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {message}
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
