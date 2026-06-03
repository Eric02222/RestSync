import React, { useEffect, useState, useCallback } from 'react';
import { vitalsService } from '../../services/vitals.service';
import { getHeartRateStatus, getTemperatureStatus } from '../../utils/vitalsRules';
import { VITALS_UPDATED_EVENT } from '../../utils/vitalsEvents';
import {
  Users,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  XCircle,
} from 'lucide-react';

const getResidenteStatus = (historico) => {
  if (!historico || historico.length === 0) return 'sem-dados';
  const latest = historico[0];
  const fcStatus = getHeartRateStatus(latest.frequencia_cardiaca);
  const tempStatus = getTemperatureStatus(latest.temperatura);
  if (fcStatus === 'critical' || tempStatus === 'critical') return 'critical';
  if (fcStatus === 'attention' || tempStatus === 'attention') return 'attention';
  return 'normal';
};

const ExecutiveSummary = ({ pacientes }) => {
  const [residenteStatus, setResidenteStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchAllVitals = useCallback(async () => {
    if (!pacientes || pacientes.length === 0) {
      setResidenteStatus([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const results = [];
    for (const p of pacientes) {
      try {
        const hist = await vitalsService.getHistorico(p.id);
        results.push({ id: p.id, nome: p.nome, status: getResidenteStatus(hist) });
      } catch {
        results.push({ id: p.id, nome: p.nome, status: 'sem-dados' });
      }
    }
    setResidenteStatus(results);
    setLastUpdate(new Date());
    setLoading(false);
  }, [pacientes]);

  useEffect(() => {
    fetchAllVitals();
  }, [fetchAllVitals]);

  useEffect(() => {
    window.addEventListener(VITALS_UPDATED_EVENT, fetchAllVitals);
    return () => window.removeEventListener(VITALS_UPDATED_EVENT, fetchAllVitals);
  }, [fetchAllVitals]);

  const total = pacientes?.length || 0;
  const estaveis = residenteStatus.filter((r) => r.status === 'normal').length;
  const observacao = residenteStatus.filter((r) => r.status === 'attention').length;
  const criticos = residenteStatus.filter((r) => r.status === 'critical').length;
  const monitorados = residenteStatus.filter((r) => r.status !== 'sem-dados').length;

  const formatTime = (date) => {
    if (!date) return '--';
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const metrics = [
    {
      label: 'Total de Residentes',
      value: total,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Monitorados Ativos',
      value: monitorados,
      icon: Activity,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50/50 dark:bg-violet-900/10 border-violet-100 dark:border-violet-900/30',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Alertas Ativos',
      value: observacao + criticos,
      icon: AlertTriangle,
      color: (observacao + criticos) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400',
      bg: (observacao + criticos) > 0 ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' : 'bg-slate-50/50 dark:bg-slate-800/10 border-slate-100 dark:border-slate-800/30',
      iconBg: (observacao + criticos) > 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
    },
    {
      label: 'Última Atualização',
      value: formatTime(lastUpdate),
      icon: Clock,
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-50/50 dark:bg-slate-800/10 border-slate-100 dark:border-slate-800/30',
      iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      isTime: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={`flex items-center gap-4 p-4 rounded-2xl border ${m.bg} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${m.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className={`text-xl font-extrabold leading-none ${m.color} ${m.isTime ? 'text-sm' : ''}`}>
                  {loading && !m.isTime ? '—' : m.value}
                </p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 leading-tight">{m.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{loading ? '—' : estaveis}</p>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-0.5">Estáveis</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
              <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">{loading ? '—' : observacao}</p>
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 mt-0.5">Em Observação</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-red-700 dark:text-red-400">{loading ? '—' : criticos}</p>
              <p className="text-[10px] font-bold text-red-600 dark:text-red-500 mt-0.5">Críticos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveSummary;
