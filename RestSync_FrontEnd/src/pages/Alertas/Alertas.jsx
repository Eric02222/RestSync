import React, { useState, useEffect } from 'react';
import { usePacientes } from '../../hooks/usePacientes';
import { vitalsService } from '../../services/vitals.service';
import { toast } from 'react-toastify';
import {
  BellRing,
  Heart,
  Thermometer,
  Clock,
  Calendar,
  CheckCircle,
  Eye,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Loader2,
  Filter,
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const getHeartRateStatus = (fc) => {
  if (!fc) return 'normal';
  if (fc > 120 || fc < 50) return 'critical';
  if (fc >= 90 || fc <= 55) return 'attention';
  return 'normal';
};

const getTemperatureStatus = (temp) => {
  if (!temp) return 'normal';
  const t = parseFloat(temp);
  if (t >= 38.0 || t <= 35.0) return 'critical';
  if (t >= 37.2) return 'attention';
  return 'normal';
};

const buildAlertas = (paciente, historico) => {
  const alerts = [];
  historico.slice(0, 20).forEach((reading) => {
    const fcStatus = getHeartRateStatus(reading.frequencia_cardiaca);
    const tempStatus = getTemperatureStatus(reading.temperatura);
    const ts = `${String(reading.data).split('-').reverse().join('/')} ${String(reading.hora).slice(0, 5)}`;

    if (fcStatus === 'critical') {
      alerts.push({
        id: `fc-crit-${reading.id}`,
        data: String(reading.data).split('-').reverse().slice(0, 2).join('/'),
        hora: String(reading.hora).slice(0, 5),
        residente: paciente.nome,
        tipo: reading.frequencia_cardiaca > 120 ? 'Frequência Cardíaca Alta' : 'Frequência Cardíaca Baixa',
        detalhe: `${reading.frequencia_cardiaca} bpm`,
        severity: 'critical',
        status: 'novo',
      });
    } else if (fcStatus === 'attention') {
      alerts.push({
        id: `fc-att-${reading.id}`,
        data: String(reading.data).split('-').reverse().slice(0, 2).join('/'),
        hora: String(reading.hora).slice(0, 5),
        residente: paciente.nome,
        tipo: 'Frequência Cardíaca Alterada',
        detalhe: `${reading.frequencia_cardiaca} bpm`,
        severity: 'attention',
        status: 'novo',
      });
    }

    if (tempStatus === 'critical') {
      alerts.push({
        id: `temp-crit-${reading.id}`,
        data: String(reading.data).split('-').reverse().slice(0, 2).join('/'),
        hora: String(reading.hora).slice(0, 5),
        residente: paciente.nome,
        tipo: parseFloat(reading.temperatura) >= 38.0 ? 'Temperatura Elevada' : 'Temperatura Baixa',
        detalhe: `${parseFloat(reading.temperatura).toFixed(1)} °C`,
        severity: 'critical',
        status: 'novo',
      });
    } else if (tempStatus === 'attention') {
      alerts.push({
        id: `temp-att-${reading.id}`,
        data: String(reading.data).split('-').reverse().slice(0, 2).join('/'),
        hora: String(reading.hora).slice(0, 5),
        residente: paciente.nome,
        tipo: 'Temperatura Elevada',
        detalhe: `${parseFloat(reading.temperatura).toFixed(1)} °C`,
        severity: 'attention',
        status: 'novo',
      });
    }
  });
  return alerts;
};

const severityIcon = (s) => {
  if (s === 'critical') return <XCircle className="h-4 w-4 text-red-500" />;
  if (s === 'attention') return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  return <CheckCircle className="h-4 w-4 text-emerald-500" />;
};

const Alertas = () => {
  const { pacientes, loading: loadingPacientes } = usePacientes();
  const [alertas, setAlertas] = useState([]);
  const [loadingAlertas, setLoadingAlertas] = useState(false);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [severityFilter, setSeverityFilter] = useState('todos');
  // status override map: { alertId: 'visualizado' | 'resolvido' }
  const [statusOverride, setStatusOverride] = useState({});

  const fetchAlertas = async () => {
    if (pacientes.length === 0) return;
    setLoadingAlertas(true);
    try {
      const all = [];
      for (const p of pacientes) {
        try {
          const hist = await vitalsService.getHistorico(p.id);
          const pAlertas = buildAlertas(p, hist);
          all.push(...pAlertas);
        } catch {
          // skip if no vitals
        }
      }
      // Sort: critical first, then by time
      all.sort((a, b) => {
        if (a.severity === 'critical' && b.severity !== 'critical') return -1;
        if (b.severity === 'critical' && a.severity !== 'critical') return 1;
        return 0;
      });
      setAlertas(all);
    } finally {
      setLoadingAlertas(false);
    }
  };

  useEffect(() => {
    if (pacientes.length > 0) {
      fetchAlertas();
    }
  }, [pacientes]);

  const markStatus = (id, newStatus) => {
    setStatusOverride((prev) => ({ ...prev, [id]: newStatus }));
    toast.success(`Alerta marcado como ${newStatus}.`);
  };

  const getEffectiveStatus = (alerta) => statusOverride[alerta.id] || alerta.status;

  const filtered = alertas.filter((a) => {
    const effStatus = getEffectiveStatus(a);
    if (statusFilter !== 'todos' && effStatus !== statusFilter) return false;
    if (severityFilter !== 'todos' && a.severity !== severityFilter) return false;
    return true;
  });

  const totalCritical = alertas.filter((a) => a.severity === 'critical').length;
  const totalNovos = alertas.filter((a) => getEffectiveStatus(a) === 'novo').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 border border-slate-200/80 p-6 rounded-2xl shadow-sm backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <BellRing className="mr-3 h-6 w-6 text-blue-600" />
            Central de Alertas
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Eventos clínicos gerados a partir dos sinais vitais monitorados
          </p>
        </div>
        <Button
          onClick={fetchAlertas}
          variant="outline"
          className="flex items-center text-xs py-2.5 px-4 cursor-pointer"
        >
          <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loadingAlertas ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total de Alertas', value: alertas.length, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-100' },
          { label: 'Críticos', value: totalCritical, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'Atenção', value: alertas.filter((a) => a.severity === 'attention').length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Não Vistos', value: totalNovos, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg} text-center`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Filter className="h-3.5 w-3.5" />
          Filtrar:
        </div>
        <div className="flex gap-2 flex-wrap">
          {['todos', 'novo', 'visualizado', 'resolvido'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer capitalize ${
                statusFilter === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              {s === 'todos' ? 'Todos os Status' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['todos', 'critical', 'attention'].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                severityFilter === s
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {s === 'todos' ? 'Todas Severidades' : s === 'critical' ? '🔴 Crítico' : '🟡 Atenção'}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      {loadingPacientes || loadingAlertas ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/70 border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
          <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700">Nenhum alerta encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">
            {alertas.length === 0
              ? 'Todos os sinais vitais estão dentro dos parâmetros normais.'
              : 'Nenhum alerta corresponde aos filtros selecionados.'}
          </p>
        </div>
      ) : (
        <div className="bg-white/70 border border-slate-200/85 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-5 py-4">Severidade</th>
                  <th className="px-5 py-4">Data / Hora</th>
                  <th className="px-5 py-4">Residente</th>
                  <th className="px-5 py-4">Tipo</th>
                  <th className="px-5 py-4">Detalhe</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 text-xs font-semibold text-slate-700">
                {filtered.map((alerta) => {
                  const effStatus = getEffectiveStatus(alerta);
                  return (
                    <tr
                      key={alerta.id}
                      className={`hover:bg-slate-50/50 transition-colors duration-150 ${
                        alerta.severity === 'critical' ? 'bg-red-50/30' :
                        alerta.severity === 'attention' ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        {severityIcon(alerta.severity)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-1 text-slate-500">
                            <Calendar className="h-3 w-3" />
                            <span>{alerta.data}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-400 mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{alerta.hora}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-800">
                        {alerta.residente}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {alerta.tipo.includes('Cardíaca') || alerta.tipo.includes('Frequência')
                            ? <Heart className="h-3.5 w-3.5 text-red-400" />
                            : <Thermometer className="h-3.5 w-3.5 text-amber-400" />
                          }
                          <span>{alerta.tipo}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`font-bold ${alerta.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
                          {alerta.detalhe}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          effStatus === 'resolvido' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          effStatus === 'visualizado' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {effStatus.charAt(0).toUpperCase() + effStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {effStatus === 'novo' && (
                            <button
                              onClick={() => markStatus(alerta.id, 'visualizado')}
                              title="Marcar como visualizado"
                              className="p-1.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                            </button>
                          )}
                          {effStatus !== 'resolvido' && (
                            <button
                              onClick={() => markStatus(alerta.id, 'resolvido')}
                              title="Marcar como resolvido"
                              className="p-1.5 rounded-lg border border-emerald-100 bg-emerald-50 hover:bg-white hover:border-emerald-300 transition-colors duration-200 cursor-pointer"
                            >
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alertas;
