import React from 'react';

const MetricCard = ({ title, value, status = 'normal', icon: Icon, unit = '' }) => {
  const statusStyles = {
    normal: {
      bg: 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-600',
      badge: 'bg-emerald-100/70 text-emerald-800 border-emerald-200',
      label: 'Normal'
    },
    attention: {
      bg: 'bg-amber-50/50 border-amber-100 hover:border-amber-200',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100 text-amber-600',
      badge: 'bg-amber-100/70 text-amber-800 border-amber-200',
      label: 'Atenção'
    },
    critical: {
      bg: 'bg-red-50/50 border-red-100 hover:border-red-200',
      text: 'text-red-700',
      iconBg: 'bg-red-100 text-red-600',
      badge: 'bg-red-100/70 text-red-800 border-red-200',
      label: 'Crítico'
    }
  };

  const currentStyle = statusStyles[status] || statusStyles.normal;

  return (
    <div className={`p-6 rounded-2xl border bg-white/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${currentStyle.bg} backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{title}</span>
        <div className={`p-2 rounded-xl ${currentStyle.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
        {unit && <span className="ml-1 text-sm font-semibold text-slate-500">{unit}</span>}
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
