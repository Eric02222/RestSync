import React from 'react';
import { AlertCircle, AlertTriangle, BellRing } from 'lucide-react';

const AlertCard = ({ pacienteNome, status = 'critical', message, timestamp }) => {
  const isCritical = status === 'critical';

  return (
    <div className={`p-4 rounded-xl border flex items-start space-x-4 shadow-sm transition-all duration-300 hover:shadow ${
      isCritical 
        ? 'bg-red-50/75 border-red-100 hover:border-red-200' 
        : 'bg-amber-50/75 border-amber-100 hover:border-amber-200'
    }`}>
      <div className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${
        isCritical ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
      }`}>
        {isCritical ? <AlertCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800 truncate">{pacienteNome}</h4>
          <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{timestamp}</span>
        </div>
        <p className={`text-xs mt-1 leading-relaxed ${
          isCritical ? 'text-red-700' : 'text-amber-700'
        }`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default AlertCard;
