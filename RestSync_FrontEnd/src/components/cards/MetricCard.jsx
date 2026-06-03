import React from 'react';
import { Star } from 'lucide-react';

const MetricCard = ({ title, value, status = 'normal', icon: Icon, unit = '', isFavorite = false, onToggleFavorite }) => {
  const statusStyles = {
    normal: {
      bg: isFavorite ? 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800',
      text: 'text-emerald-700 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      label: 'Normal'
    },
    attention: {
      bg: isFavorite ? 'bg-amber-50/80 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 shadow-amber-100/50 dark:shadow-none' : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900',
      text: 'text-amber-700 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-100/70 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      label: 'Atenção'
    },
    critical: {
      bg: isFavorite ? 'bg-red-50/80 dark:bg-red-900/30 border-red-300 dark:border-red-700 shadow-red-100/50 dark:shadow-none' : 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900',
      text: 'text-red-700 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
      badge: 'bg-red-100/70 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
      label: 'Crítico'
    }
  };

  const currentStyle = statusStyles[status] || statusStyles.normal;

  return (
    <div className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${currentStyle.bg} backdrop-blur-sm relative group`}>
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-4 right-4 p-1 rounded-full transition-all duration-200 ${
            isFavorite ? 'text-amber-500 scale-110' : 'text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-amber-400'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      )}

      <div className="flex items-center justify-between pr-8">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">{title}</span>
        <div className={`p-2 rounded-xl ${currentStyle.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</span>
        {unit && <span className="ml-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{unit}</span>}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${currentStyle.badge} transition-all duration-300`}>
          {currentStyle.label}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;
