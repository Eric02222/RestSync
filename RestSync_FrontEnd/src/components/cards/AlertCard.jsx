import React from 'react';
import { AlertCircle, AlertTriangle, BellRing } from 'lucide-react';

const AlertCard = ({ pacienteNome, status = 'critical', message, timestamp }) => {
  const isCritical = status === 'critical';

  return (
    <div className={`p-4 rounded-xl border flex items-start space-x-4 shadow-sm transition-all duration-300 hover:shadow ${
      isCritical 
        ? 'bg-red-50/75 dark:bg-red-900/20 border-red-100 dark:border-red-900/50 hover:border-red-200 dark:hover:border-red-800' 
        : 'bg-amber-50/75 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50 hover:border-amber-200 dark:hover:border-amber-800'
    }`}>
      <div className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${
        isCritical ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
      }`}>
        {isCritical ? <AlertCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{pacienteNome}</h4>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">{timestamp}</span>
        </div>
        <p className={`text-xs mt-1 leading-relaxed ${
          isCritical ? 'text-red-700 dark:text-red-300/90' : 'text-amber-700 dark:text-amber-300/90'
        }`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default AlertCard;
