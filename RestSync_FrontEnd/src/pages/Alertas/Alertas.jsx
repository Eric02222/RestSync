import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/context';
import { usePacientes } from '../../hooks/usePacientes';
import { vitalsService } from '../../services/vitals.service';
import { buildAnomaliesFromHistorico } from '../../utils/vitalsRules';
import { VITALS_UPDATED_EVENT } from '../../utils/vitalsEvents';
import { 
  BellRing, 
  AlertTriangle, 
  Clock, 
  Loader2,
  Filter,
  CheckCircle2,
  Activity,
  Eye,
  CheckCircle,
  Archive,
  RefreshCcw
} from 'lucide-react';
import AlertCard from '../../components/cards/AlertCard';
import Button from '../../components/ui/Button';

const Alertas = () => {
  const { user } = useAuth();
  const { pacientes, loading: loadingPacientes } = usePacientes();
  const [allAlerts, setAllAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertStatuses, setAlertStatuses] = useState({});

  // Load alert statuses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('restsync_alert_statuses');
    if (saved) {
      try {
        setAlertStatuses(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing alert statuses", e);
      }
    }
  }, []);

  const updateAlertStatus = (alertId, newStatus) => {
    setAlertStatuses(prev => {
      const next = { ...prev, [alertId]: newStatus };
      localStorage.setItem('restsync_alert_statuses', JSON.stringify(next));
      return next;
    });
  };

  const fetchAllAlerts = useCallback(async () => {
    if (!pacientes || pacientes.length === 0) {
      setAllAlerts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const aggregatedAlerts = [];

    try {
      for (const p of pacientes) {
        try {
          const historico = await vitalsService.getHistorico(p.id);
          // Build anomalies but keep the raw data for ID mapping
          const anomalies = historico.map(reading => {
            const fcStatus = vitalsService.getHeartRateStatus ? vitalsService.getHeartRateStatus(reading.frequencia_cardiaca) : 'normal'; // fallback
            // Note: using direct logic here since we need IDs
            const t = parseFloat(reading.temperatura);
            const isAbnormal = (reading.frequencia_cardiaca > 120 || reading.frequencia_cardiaca < 50 || t >= 38.0 || t <= 35.0);
            
            if (!isAbnormal) return null;

            const ts = `${String(reading.data).split('-').reverse().slice(0, 2).join('/')} às ${String(reading.hora).slice(0, 5)}`;
            
            return {
              id: `alert-${reading.id}`,
              pacienteId: p.id,
              pacienteNome: p.nome,
              status: (reading.frequencia_cardiaca > 120 || t >= 38.0) ? 'critical' : 'attention',
              message: (reading.frequencia_cardiaca > 120) ? `Frequência cardíaca crítica: ${reading.frequencia_cardiaca} bpm.` : `Temperatura crítica: ${reading.temperatura} °C.`,
              timestamp: ts,
              rawReading: reading
            };
          }).filter(a => a !== null);

          aggregatedAlerts.push(...anomalies);
        } catch (err) {
          console.error(`Error fetching alerts for patient ${p.id}:`, err);
        }
      }

      // Sort by latest (assuming higher ID is newer)
      aggregatedAlerts.sort((a, b) => b.rawReading.id - a.rawReading.id);
      setAllAlerts(aggregatedAlerts);
    } catch (error) {
      console.error("Error aggregating alerts:", error);
    } finally {
      setLoading(false);
    }
  }, [pacientes]);

  useEffect(() => {
    fetchAllAlerts();
  }, [fetchAllAlerts]);

  useEffect(() => {
    const handleUpdate = () => fetchAllAlerts();
    window.addEventListener(VITALS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(VITALS_UPDATED_EVENT, handleUpdate);
  }, [fetchAllAlerts]);

  // Filter alerts by status (showing only New/Viewed by default, or just all)
  const activeAlerts = allAlerts.filter(a => alertStatuses[a.id] !== 'resolved');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm backdrop-blur-sm transition-colors duration-300">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <BellRing className="mr-3 h-6 w-6 text-amber-500" />
            Central de Alertas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Monitore e gerencie anomalias e situações críticas de todos os residentes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchAllAlerts}
            variant="outline"
            className="flex items-center text-xs py-2 px-3 dark:border-slate-700"
            disabled={loading}
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Badge variant={activeAlerts.length > 0 ? "warning" : "success"} className="px-3 py-1">
            {activeAlerts.length} Ativos
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
              Gestão de Ocorrências
            </h3>
          </div>

          {loading && allAlerts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
          ) : activeAlerts.length === 0 ? (
            <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center transition-colors duration-300">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-50" />
              <h4 className="text-slate-800 dark:text-white font-bold">Tudo sob controle</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Não há alertas pendentes de resolução no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="relative group">
                  <AlertCard
                    pacienteNome={alert.pacienteNome}
                    status={alert.status}
                    message={alert.message}
                    timestamp={alert.timestamp}
                  />
                  <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => updateAlertStatus(alert.id, 'resolved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Resolver
                    </button>
                  </div>
                  {alertStatuses[alert.id] === 'viewed' && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        Visualizado
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm backdrop-blur-sm transition-colors duration-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Filter className="mr-2 h-4 w-4 text-blue-500" />
              Instruções de Manejo
            </h3>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Como resolver alertas?</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Passe o mouse sobre um alerta para revelar o botão "Resolver". Ao clicar, o alerta será arquivado localmente em sua sessão.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300 mb-1">Dica de Produtividade</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
                  Alertas resolvidos são salvos no cache do seu navegador e não aparecerão novamente nesta lista.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-600 to-red-500 p-6 rounded-2xl text-white shadow-lg shadow-red-500/20">
            <h3 className="text-sm font-bold mb-2 flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Atenção Médica
            </h3>
            <p className="text-[11px] text-red-50 leading-relaxed">
              A resolução local de um alerta não substitui o atendimento clínico. Certifique-se de que a intercorrência foi devidamente registrada no prontuário físico do residente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, variant, className = "" }) => {
  const variants = {
    warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    success: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Alertas;
